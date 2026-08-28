import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request, ctx: any) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendApiKey || !supabaseUrl || !supabaseKey) {
    return new Response("Server configuration error", { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const emailData = body?.data || body;
  const toAddresses: string[] = Array.isArray(emailData?.to)
    ? emailData.to
    : typeof emailData?.to === "string"
      ? [emailData.to]
      : [];

  // ✅ KEY FIX: use ctx.waitUntil so Vercel keeps the lambda alive
  // after returning the 200 response. This returns to Resend in <100ms
  // and prevents the 5s timeout that was causing all failures.
  if (toAddresses.length > 0) {
    ctx.waitUntil(
      processInboundEmail(emailData, resendApiKey, supabaseUrl, supabaseKey, toAddresses)
        .catch((err) => console.error("[Mailcoy] Processing error:", err))
    );
  }

  return new Response(
    JSON.stringify({ ok: true, count: toAddresses.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

async function processInboundEmail(
  emailData: any,
  resendApiKey: string,
  supabaseUrl: string,
  supabaseKey: string,
  toAddresses: string[]
) {
  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  let html = emailData?.html || "";
  let text = emailData?.text || "";
  let fromAddress = emailData?.from || "(Unknown sender)";
  const subject = emailData?.subject || "(No subject)";

  // Fetch full email body + real sender name from Resend
  const emailId = emailData?.email_id || emailData?.id;
  if (emailId) {
    try {
      const fetchRes = await fetch(
        `https://api.resend.com/emails/receiving/${emailId}`,
        { headers: { Authorization: `Bearer ${resendApiKey}` } }
      );
      if (fetchRes.ok) {
        const full = (await fetchRes.json()) as any;
        html = html || full?.html || "";
        text = text || full?.text || "";
        // Resend strips display name from root `from` — headers.from has the full "Name <email>"
        if (full?.headers?.from) {
          fromAddress = full.headers.from;
        }
      }
    } catch (e) {
      console.warn("[Mailcoy] Could not fetch email body:", e);
    }
  }

  for (const recipientRaw of toAddresses) {
    const recipientMatch = recipientRaw.match(/<([^>]+)>/) || [null, recipientRaw];
    const recipientEmail = (recipientMatch[1] || recipientRaw).trim().toLowerCase();
    const recipientDomain = recipientEmail.split("@")[1] || "mailcoy.com";

    try {
      const targetGmails = new Set<string>();
      let orgId: string | null = null;

      // 1. Direct employee match
      const { data: emp } = await (supabaseAdmin
        .from("employees")
        .select("id, organization_id, full_name, status")
        .or(`professional_email.eq.${recipientEmail},company_email.eq.${recipientEmail}`)
        .maybeSingle() as any) as { data: any };

      if (emp && emp.status !== "inactive" && emp.status !== "revoked") {
        const { data: gc } = await supabaseAdmin
          .from("gmail_connections")
          .select("google_email")
          .eq("employee_id", emp.id)
          .is("revoked_at", null)
          .maybeSingle();
        if ((gc as any)?.google_email) {
          targetGmails.add((gc as any).google_email);
          orgId = emp.organization_id;
        }
      }

      // 2. Multi-recipient Alias lookup (Shared Inboxes)
      const { data: aliasRows } = await (supabaseAdmin
        .from("aliases")
        .select("id, organization_id, address, employee_id")
        .eq("address", recipientEmail) as any) as { data: any[] | null };

      if (aliasRows && aliasRows.length > 0) {
        for (const alias of aliasRows) {
          orgId = orgId || alias.organization_id;
          // Check employee active status
          const { data: aliasEmp } = await (supabaseAdmin
            .from("employees")
            .select("id, status")
            .eq("id", alias.employee_id)
            .maybeSingle() as any) as { data: any };

          if (aliasEmp && aliasEmp.status !== "inactive" && aliasEmp.status !== "revoked") {
            const { data: gc } = await supabaseAdmin
              .from("gmail_connections")
              .select("google_email")
              .eq("employee_id", alias.employee_id)
              .is("revoked_at", null)
              .maybeSingle();
            if ((gc as any)?.google_email) {
              targetGmails.add((gc as any).google_email);
            }
          }
        }
      }

      // 3. Catch-all: If no active employee or alias target found, route to Catch-All / Domain Owner
      if (targetGmails.size === 0) {
        const { data: domain } = await (supabaseAdmin
          .from("domains")
          .select("id, organization_id")
          .eq("domain_name", recipientDomain)
          .maybeSingle() as any) as { data: any };

        if (domain) {
          orgId = domain.organization_id;
          // Check catch_all_inboxes first if defined
          const { data: catchAll } = await (supabaseAdmin
            .from("catch_all_inboxes")
            .select("target_email")
            .eq("domain_id", domain.id)
            .maybeSingle() as any) as { data: any };

          if (catchAll?.target_email) {
            targetGmails.add(catchAll.target_email);
          } else {
            // Default to first active employee in workspace
            const { data: ownerEmp } = await (supabaseAdmin
              .from("employees")
              .select("id")
              .eq("organization_id", domain.organization_id)
              .not("status", "in", '("inactive","revoked")')
              .order("created_at", { ascending: true })
              .limit(1)
              .maybeSingle() as any) as { data: any };

            if (ownerEmp) {
              const { data: gc } = await supabaseAdmin
                .from("gmail_connections")
                .select("google_email")
                .eq("employee_id", ownerEmp.id)
                .is("revoked_at", null)
                .maybeSingle();
              if ((gc as any)?.google_email) {
                targetGmails.add((gc as any).google_email);
              }
            }
          }
        }
      }

      if (targetGmails.size === 0) {
        console.warn(`[Mailcoy] No destination Gmail found for ${recipientEmail}`);
        continue;
      }

      // Parse "Name <email>" format for display name
      const senderNameMatch = fromAddress.match(/^"?([^"<]+)"?\s*</);
      const senderDisplayName = senderNameMatch
        ? senderNameMatch[1].trim()
        : fromAddress.replace(/<.*>/, "").trim() || fromAddress;
      const senderEmail = fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress;

      const footerHtml = `
        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e2e8f0;font-family:system-ui,sans-serif;font-size:12px;color:#94a3b8;">
          📬 Sent to <strong>${recipientEmail}</strong> · via Mailcoy ·
          <a href="mailto:${senderEmail}" style="color:#64748b;">Reply to ${senderEmail}</a>
        </div>
      `;

      const forwardHtml = `
        <div>${html || `<pre style="font-family:inherit;white-space:pre-wrap;">${text}</pre>`}</div>
        ${footerHtml}
      `;

      // Fan out delivery to all targets in parallel
      const forwardPromises = Array.from(targetGmails).map(async (targetGmail) => {
        try {
          const fwd = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `${senderDisplayName} <router@mailcoy.com>`,
              to: [targetGmail],
              reply_to: fromAddress,
              subject: subject,
              html: forwardHtml,
              text: text ? `${text}\n\n---\nSent to ${recipientEmail} via Mailcoy` : undefined,
            }),
          });

          const fwdData = await fwd.json();
          console.log(`[Mailcoy] Forwarded to ${targetGmail} via Resend:`, fwdData);
          return { targetGmail, success: fwd.ok, data: fwdData };
        } catch (err: any) {
          console.error(`[Mailcoy] Error forwarding to ${targetGmail}:`, err);
          return { targetGmail, success: false, error: err.message };
        }
      });

      await Promise.allSettled(forwardPromises);

      // Log the incoming message in email_logs
      if (orgId) {
        await supabaseAdmin.from("email_logs").insert({
          organization_id: orgId,
          sender: fromAddress,
          receiver: recipientEmail,
          subject: subject,
          snippet: text ? text.slice(0, 160) : subject,
          direction: "incoming",
          status: "delivered",
        } as never);
      }
    } catch (err) {
      console.error(`[Mailcoy] Inbound forwarding error for ${recipientRaw}:`, err);
    }
  }
}
