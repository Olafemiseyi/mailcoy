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
      let targetGmail: string | null = null;
      let orgId: string | null = null;

      // 1. Direct employee match
      const { data: emp } = await (supabaseAdmin
        .from("employees")
        .select("id, organization_id, full_name")
        .or(`professional_email.eq.${recipientEmail},company_email.eq.${recipientEmail}`)
        .maybeSingle() as any) as { data: any };

      if (emp) {
        const { data: gc } = await supabaseAdmin
          .from("gmail_connections")
          .select("google_email")
          .eq("employee_id", emp.id)
          .is("revoked_at", null)
          .maybeSingle();
        targetGmail = (gc as any)?.google_email || null;
        orgId = emp.organization_id;
      }

      // 2. Alias lookup
      if (!targetGmail) {
        const { data: alias } = await (supabaseAdmin
          .from("aliases")
          .select("id, organization_id, address, employee_id")
          .eq("address", recipientEmail)
          .maybeSingle() as any) as { data: any };

        if (alias) {
          orgId = alias.organization_id;
          const { data: gc } = await supabaseAdmin
            .from("gmail_connections")
            .select("google_email")
            .eq("employee_id", alias.employee_id)
            .is("revoked_at", null)
            .maybeSingle();
          targetGmail = (gc as any)?.google_email || null;
        }
      }

      // 3. Catch-all: domain owner
      if (!targetGmail) {
        const { data: domain } = await (supabaseAdmin
          .from("domains")
          .select("id, organization_id")
          .eq("domain_name", recipientDomain)
          .maybeSingle() as any) as { data: any };

        if (domain) {
          orgId = domain.organization_id;
          const { data: ownerEmp } = await (supabaseAdmin
            .from("employees")
            .select("id")
            .eq("organization_id", domain.organization_id)
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
            targetGmail = (gc as any)?.google_email || null;
          }
        }
      }

      if (!targetGmail) {
        console.warn(`[Mailcoy] No Gmail found for ${recipientEmail}`);
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

      const fwd = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${senderDisplayName} <router@${recipientDomain}>`,
          to: [targetGmail],
          reply_to: [fromAddress],
          subject,
          html: forwardHtml,
        }),
      });

      const fwdResult = (await fwd.json()) as any;
      console.log(`[Mailcoy] Forwarded ${recipientEmail} -> ${targetGmail} | id:`, fwdResult?.id);

      if (orgId) {
        await supabaseAdmin.from("email_logs").insert({
          organization_id: orgId,
          sender: senderEmail,
          receiver: recipientEmail,
          subject,
          snippet: (text || subject || "(Inbound)").slice(0, 150),
          direction: "incoming",
          status: fwd.ok ? "delivered" : "failed",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(`[Mailcoy] Error routing ${recipientEmail}:`, err);
    }
  }
}
