// Supabase Edge Function: inbound-email
// Receives Resend inbound webhook and routes email to the employee's Gmail
// Deployed at: https://tlimklsruaykdzckpziu.supabase.co/functions/v1/inbound-email

import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const emailData = body?.data || body;
  const rawTo = emailData?.to;
  const toAddresses: string[] = Array.isArray(rawTo)
    ? rawTo
    : typeof rawTo === "string"
    ? [rawTo]
    : [];

  if (toAddresses.length === 0) {
    return new Response(JSON.stringify({ ok: true, count: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return 200 immediately so Resend marks webhook as delivered
  const responsePromise = new Response(
    JSON.stringify({ ok: true, count: toAddresses.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );

  // Process email routing (Edge Functions keep running after response via waitUntil)
  EdgeRuntime.waitUntil(processEmail(emailData, toAddresses));

  return responsePromise;
});

async function processEmail(emailData: any, toAddresses: string[]) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let html: string = emailData?.html || "";
  let text: string = emailData?.text || "";
  let fromAddress: string = emailData?.from || "(Unknown sender)";
  const subject: string = emailData?.subject || "(No subject)";

  // Fetch full email body + headers from Resend (webhook only sends metadata)
  const emailId = emailData?.email_id || emailData?.id;
  if (emailId) {
    try {
      const res = await fetch(
        `https://api.resend.com/emails/receiving/${emailId}`,
        { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } }
      );
      if (res.ok) {
        const full: any = await res.json();
        html = html || full?.html || "";
        text = text || full?.text || "";
        // headers.from has the full "Display Name <email>" — root `from` strips the name
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
      let employeeName = "Team Member";

      // 1. Direct employee lookup by professional_email or company_email
      const { data: emp } = await (supabase
        .from("employees")
        .select("id, organization_id, full_name")
        .or(
          `professional_email.eq.${recipientEmail},company_email.eq.${recipientEmail}`
        )
        .maybeSingle() as any) as { data: any };

      if (emp) {
        const { data: gc } = await supabase
          .from("gmail_connections")
          .select("google_email")
          .eq("employee_id", emp.id)
          .is("revoked_at", null)
          .maybeSingle();

        targetGmail = (gc as any)?.google_email || null;
        orgId = emp.organization_id;
        employeeName = emp.full_name || "Team Member";
      }

      // 2. Alias lookup
      if (!targetGmail) {
        const { data: alias } = await (supabase
          .from("aliases")
          .select("id, organization_id, address, employee_id")
          .eq("address", recipientEmail)
          .maybeSingle() as any) as { data: any };

        if (alias) {
          orgId = alias.organization_id;
          const { data: gc } = await supabase
            .from("gmail_connections")
            .select("google_email")
            .eq("employee_id", alias.employee_id)
            .is("revoked_at", null)
            .maybeSingle();
          targetGmail = (gc as any)?.google_email || null;
        }
      }

      // 3. Catch-all: any gmail_connection in the domain's org
      if (!targetGmail) {
        const { data: domain } = await (supabase
          .from("domains")
          .select("id, organization_id")
          .eq("domain_name", recipientDomain)
          .maybeSingle() as any) as { data: any };

        if (domain) {
          orgId = domain.organization_id;
          const { data: ownerEmp } = await (supabase
            .from("employees")
            .select("id")
            .eq("organization_id", domain.organization_id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle() as any) as { data: any };

          if (ownerEmp) {
            const { data: gc } = await supabase
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

      // 4. Parse sender display name from the full "Name <email>" format
      const senderNameMatch = fromAddress.match(/^"?([^"<]+)"?\s*</);
      const senderDisplayName = senderNameMatch
        ? senderNameMatch[1].trim()
        : fromAddress.replace(/<.*>/, "").trim() || fromAddress;
      const senderEmail =
        fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress;

      // 5. Small footer — not a banner, just a subtle attribution
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

      // 6. Forward via Resend
      const fwd = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
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

      const fwdResult: any = await fwd.json();
      console.log(
        `[Mailcoy] Forwarded ${recipientEmail} -> ${targetGmail} | id:`,
        fwdResult?.id
      );

      // 7. Log to email_logs
      if (orgId) {
        await supabase.from("email_logs").insert({
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
