// Resend Inbound Webhook Router for Mailcoy
// Returns 200 to Resend IMMEDIATELY, then processes async in background
// to avoid Vercel 10s timeout causing Resend to mark as failed and retry.
import { createFileRoute } from "@tanstack/react-router";

async function processInboundEmail(emailData: any, resendApiKey: string) {
  const rawTo = emailData?.to;
  const toAddresses: string[] = Array.isArray(rawTo)
    ? rawTo
    : typeof rawTo === "string"
      ? [rawTo]
      : [];

  if (toAddresses.length === 0) return;

  const fromAddress = emailData?.from || "(Unknown sender)";
  const subject = emailData?.subject || "(No subject)";
  let html = emailData?.html || "";
  let text = emailData?.text || "";

  // Resend email.received webhook sends metadata only — fetch full body
  const emailId = emailData?.email_id || emailData?.id;
  if (emailId) {
    try {
      const fetchRes = await fetch(
        `https://api.resend.com/emails/receiving/${emailId}`,
        { headers: { Authorization: `Bearer ${resendApiKey}` } }
      );
      if (fetchRes.ok) {
        const full = await fetchRes.json() as any;
        html = html || full?.html || "";
        text = text || full?.text || "";
      }
    } catch (e) {
      console.warn("[Mailcoy] Could not fetch email body:", e);
    }
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  for (const recipientRaw of toAddresses) {
    const recipientMatch = recipientRaw.match(/<([^>]+)>/) || [null, recipientRaw];
    const recipientEmail = (recipientMatch[1] || recipientRaw).trim().toLowerCase();
    const recipientDomain = recipientEmail.split("@")[1] || "mailcoy.com";

    try {
      let targetGmail: string | null = null;
      let orgId: string | null = null;
      let employeeName = "Team Member";

      // 1. Direct employee match by professional_email or company_email
      const { data: emp } = await (supabaseAdmin
        .from("employees")
        .select("id, organization_id, full_name, personal_email")
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
        employeeName = emp.full_name || "Team Member";
      }

      // 2. Check aliases table
      if (!targetGmail) {
        const { data: alias } = await (supabaseAdmin
          .from("aliases")
          .select("id, organization_id, address, employee_id")
          .eq("address", recipientEmail)
          .maybeSingle() as any) as { data: any };

        if (alias?.employee_id) {
          const { data: aliasEmp } = await (supabaseAdmin
            .from("employees")
            .select("id, organization_id, full_name")
            .eq("id", alias.employee_id)
            .maybeSingle() as any) as { data: any };

          if (aliasEmp) {
            const { data: gc } = await supabaseAdmin
              .from("gmail_connections")
              .select("google_email")
              .eq("employee_id", aliasEmp.id)
              .is("revoked_at", null)
              .maybeSingle();

            targetGmail = (gc as any)?.google_email || null;
            orgId = alias.organization_id;
            employeeName = aliasEmp.full_name || "Team Member";
          }
        }
      }

      // 3. Domain catch-all fallback
      if (!targetGmail) {
        const { data: dom } = await supabaseAdmin
          .from("domains")
          .select("id, organization_id")
          .eq("domain_name", recipientDomain)
          .maybeSingle();

        if (dom?.organization_id) {
          orgId = dom.organization_id;
          const { data: ownerEmp } = await (supabaseAdmin
            .from("employees")
            .select("id")
            .eq("organization_id", dom.organization_id)
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

      // 4. Forward via Resend to personal Gmail
      // Extract sender display name e.g. "John Doe <john@gmail.com>" → "John Doe"
      const senderNameMatch = fromAddress.match(/^([^<]+)</);
      const senderDisplayName = senderNameMatch
        ? senderNameMatch[1].trim()
        : fromAddress.replace(/<.*>/, "").trim() || fromAddress;
      const senderEmail = fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress;

      // Small footer so the user knows it came via Mailcoy, without replacing the real sender
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
          // Show original sender's name so Gmail displays correctly
          from: `${senderDisplayName} <router@${recipientDomain}>`,
          to: [targetGmail],
          reply_to: [fromAddress],
          subject,
          html: forwardHtml,
        }),
      });

      const fwdResult = await fwd.json() as any;
      console.log(`[Mailcoy] Forwarded ${recipientEmail} -> ${targetGmail} | id:`, fwdResult?.id);

      // 5. Log to email_logs
      if (orgId) {
        await supabaseAdmin.from("email_logs").insert({
          organization_id: orgId,
          sender: fromAddress,
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

export const Route = createFileRoute("/api/public/webhooks/resend")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          return new Response("Server configuration error", { status: 500 });
        }

        let body: any;
        try {
          body = JSON.parse(await request.text());
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const emailData = body?.data || body;
        const toAddresses: string[] = Array.isArray(emailData?.to)
          ? emailData.to
          : typeof emailData?.to === "string"
            ? [emailData.to]
            : [];

        // ✅ Await the processing so Vercel does not kill the function prematurely
        if (toAddresses.length > 0) {
          try {
            await processInboundEmail(emailData, resendApiKey);
          } catch (err) {
            console.error("[Mailcoy] Processing error:", err);
          }
        }

        return new Response(
          JSON.stringify({ ok: true, count: toAddresses.length }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
  component: () => null,
});
