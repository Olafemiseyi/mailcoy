// Resend Inbound Webhook Router for Mailcoy
// Automatically receives incoming emails for any verified domain,
// resolves the employee/alias destination in Supabase, and relays
// the message straight to their personal Gmail inbox.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/resend")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          console.error("[Resend Webhook] RESEND_API_KEY is not configured.");
          return new Response("Server configuration error", { status: 500 });
        }

        let body: any;
        try {
          const raw = await request.text();
          body = JSON.parse(raw);
        } catch {
          return new Response("Invalid JSON payload", { status: 400 });
        }

        // Support both direct inbound events and Resend webhook wrappers
        const emailData = body?.data || body;
        const rawTo = emailData?.to;
        const toAddresses: string[] = Array.isArray(rawTo)
          ? rawTo
          : typeof rawTo === "string"
            ? [rawTo]
            : [];

        const fromAddress = emailData?.from || "(Unknown sender)";
        const subject = emailData?.subject || "(No subject)";
        let html = emailData?.html || "";
        let text = emailData?.text || "";

        // Resend email.received webhook sends metadata only — fetch full content if needed
        const emailId = emailData?.email_id || emailData?.id;
        if ((!html && !text) && emailId) {
          try {
            const fetchRes = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
              headers: { Authorization: `Bearer ${resendApiKey}` },
            });
            if (fetchRes.ok) {
              const fullEmail = await fetchRes.json();
              html = fullEmail?.html || fullEmail?.body || "";
              text = fullEmail?.text || "";
            }
          } catch (fetchErr) {
            console.warn("[Resend Webhook] Could not fetch email body by ID:", fetchErr);
          }
        }

        if (toAddresses.length === 0) {
          return new Response(JSON.stringify({ ok: true, message: "No recipient found" }), {
            status: 200,
          });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        for (const recipientRaw of toAddresses) {
          // Clean recipient e.g. "Femi <femi@mailcoy.com>" -> "femi@mailcoy.com"
          const recipientMatch = recipientRaw.match(/<([^>]+)>/) || [null, recipientRaw];
          const recipientEmail = (recipientMatch[1] || recipientRaw).trim().toLowerCase();
          const recipientDomain = recipientEmail.split("@")[1] || "mailcoy.com";

          try {
            // 1. Look up matching employee by professional_email, company_email, or name
            let targetGmail: string | null = null;
            let orgId: string | null = null;
            let employeeName: string = "Team Member";

            const { data: emp } = await (supabaseAdmin
              .from("employees")
              .select("id, organization_id, full_name, professional_email, company_email")
              .or(`professional_email.eq.${recipientEmail},company_email.eq.${recipientEmail}`)
              .maybeSingle() as any) as { data: any };

            if (emp) {
              const { data: gConn } = await supabaseAdmin
                .from("gmail_connections")
                .select("google_email")
                .eq("employee_id", emp.id)
                .is("revoked_at", null)
                .maybeSingle();

              // Prefer verified gmail_connection, then fall back to personal email
              targetGmail = (gConn as any)?.google_email || emp.personal_email || null;
              orgId = emp.organization_id;
              employeeName = emp.full_name || "Team Member";
            } else {
              // 2. Check aliases table — column is 'address' not 'alias_email'
              const { data: alias } = await (supabaseAdmin
                .from("aliases")
                .select("id, organization_id, address, employee_id")
                .eq("address", recipientEmail)
                .maybeSingle() as any) as { data: any };

              if (alias?.employee_id) {
                const { data: aliasEmp } = await (supabaseAdmin
                  .from("employees")
                  .select("id, organization_id, full_name, personal_email")
                  .eq("id", alias.employee_id)
                  .maybeSingle() as any) as { data: any };

                if (aliasEmp) {
                  const { data: gConn } = await supabaseAdmin
                    .from("gmail_connections")
                    .select("google_email")
                    .eq("employee_id", aliasEmp.id)
                    .is("revoked_at", null)
                    .maybeSingle();

                  targetGmail = (gConn as any)?.google_email || aliasEmp.personal_email || null;
                  orgId = alias.organization_id;
                  employeeName = aliasEmp.full_name || "Team Member";
                }
              }
            }

            // 3. Fallback to domain catch-all or organization owner if employee not matched directly
            if (!targetGmail) {
              const { data: dom } = await supabaseAdmin
                .from("domains")
                .select("id, organization_id, domain_name")
                .eq("domain_name", recipientDomain)
                .maybeSingle();

              if (dom?.organization_id) {
                orgId = dom.organization_id;
                // Find primary owner's connected Gmail
                const { data: ownerEmp } = await (supabaseAdmin
                  .from("employees")
                  .select("id, personal_email")
                  .eq("organization_id", dom.organization_id)
                  .order("created_at", { ascending: true })
                  .limit(1)
                  .maybeSingle() as any) as { data: any };

                if (ownerEmp) {
                  const { data: ownerConn } = await supabaseAdmin
                    .from("gmail_connections")
                    .select("google_email")
                    .eq("employee_id", ownerEmp.id)
                    .is("revoked_at", null)
                    .maybeSingle();

                  targetGmail = (ownerConn as any)?.google_email || ownerEmp.personal_email || null;
                }
              }
            }

            if (!targetGmail) {
              console.warn(`[Resend Inbound] No destination inbox found for ${recipientEmail}`);
              continue;
            }

            // 4. Forward email to the destination Gmail inbox via Resend
            const forwardHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #475569;">
                <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">📬 Mailcoy Inbound Router</div>
                <div>Delivered to <strong>${recipientEmail}</strong> for <em>${employeeName}</em>.</div>
                <div style="margin-top: 6px; font-size: 12px; color: #64748b;">
                  Reply directly to this email to respond to <strong>${fromAddress}</strong>.
                </div>
              </div>
              <div>${html || `<pre style="font-family: inherit; white-space: pre-wrap;">${text}</pre>`}</div>
            `;

            const forwardRes = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: `Mailcoy Router <router@${recipientDomain}>`,
                to: [targetGmail],
                reply_to: fromAddress,
                subject: subject,
                html: forwardHtml,
              }),
            });

            const forwardResult = await forwardRes.json();
            console.log(`[Resend Inbound] Relayed message for ${recipientEmail} -> ${targetGmail}:`, forwardResult);

            // 5. Log in email_logs table
            if (orgId) {
              await supabaseAdmin.from("email_logs").insert({
                organization_id: orgId,
                sender: fromAddress,
                receiver: recipientEmail,
                subject: subject,
                snippet: text.slice(0, 150) || subject || "(Inbound message)",
                direction: "incoming",
                status: "delivered",
                timestamp: new Date().toISOString(),
              });
            }
          } catch (itemErr) {
            console.error(`[Resend Inbound] Error routing to ${recipientEmail}:`, itemErr);
          }
        }

        return new Response(JSON.stringify({ ok: true, count: toAddresses.length }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
  component: () => null,
});
