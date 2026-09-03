// Resend Inbound Webhook Router for Mailcoy
// Returns 200 to Resend IMMEDIATELY, then processes async in background
// to avoid Vercel 10s timeout causing Resend to mark as failed and retry.
import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { waitUntil } from "@vercel/functions";

function verifySvixSignature(rawBody: string, headers: Headers, secret: string): boolean {
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) return false;

  // Protect against timestamp replay attacks (> 5 min)
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(svixTimestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300) return false;

  try {
    const cleanSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
    const key = Buffer.from(cleanSecret, "base64");
    const signedPayload = `${svixId}.${svixTimestamp}.${rawBody}`;
    const expectedSig = createHmac("sha256", key).update(signedPayload).digest("base64");

    const signatures = svixSignature.split(" ");
    for (const versionedSig of signatures) {
      const [version, sig] = versionedSig.split(",");
      if (version === "v1" && sig) {
        const sigBuf = Buffer.from(sig, "base64");
        const expBuf = Buffer.from(expectedSig, "base64");
        if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
          return true;
        }
      }
    }
  } catch (e) {
    console.warn("[Mailcoy] Error checking Svix signature:", e);
  }
  return false;
}

async function processInboundEmail(emailData: any, resendApiKey: string, lockId?: string, eventId?: string) {
  const rawTo = emailData?.to;
  const toAddresses: string[] = Array.isArray(rawTo)
    ? rawTo
    : typeof rawTo === "string"
      ? [rawTo]
      : [];

  if (toAddresses.length === 0) {
    if (lockId && eventId) {
      const { markWebhookCompleted } = await import("@/server/webhookDeduplication.server");
      await markWebhookCompleted(lockId, "resend", eventId, { no_recipients: true });
    }
    return;
  }

  let html = emailData?.html || "";
  let text = emailData?.text || "";
  let fromAddress = emailData?.from || "(Unknown sender)";
  const subject = emailData?.subject || "(No subject)";
  let originalMessageId: string | undefined = undefined;
  let attachments: any[] = [];

  const emailId = emailData?.email_id || emailData?.id;
  const { fetchReceivingEmailWithRetry, sendResendEmail } = await import("@/server/resendClient.server");

  // Resend email.received webhook sends metadata only — fetch full body & attachments with retry
  if (emailId) {
    try {
      const full = await fetchReceivingEmailWithRetry(emailId, resendApiKey);
      if (full) {
        html = html || full?.html || "";
        text = text || full?.text || "";
        if (full?.headers?.from) {
          fromAddress = full.headers.from;
        }
        if (full?.headers?.["message-id"]) {
          originalMessageId = full.headers["message-id"];
        }
        if (Array.isArray(full?.attachments) && full.attachments.length > 0) {
          attachments = full.attachments;
        }
      }
    } catch (e) {
      console.warn("[Mailcoy] Could not fetch email body:", e);
    }
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    for (const recipientRaw of toAddresses) {
      const recipientMatch = recipientRaw.match(/<([^>]+)>/) || [null, recipientRaw];
      const recipientEmail = (recipientMatch[1] || recipientRaw).trim().toLowerCase();
      const recipientDomain = recipientEmail.split("@")[1] || "mailcoy.com";

      // 0. Smart Relay Reply Processing (When employee clicks Reply in Gmail)
      if (recipientEmail.startsWith("reply+")) {
        const token = recipientEmail.slice(6).split("@")[0];
        try {
          const { decodeRelayToken, sanitizeQuotedText } = await import("@/server/relayToken.server");
          const payload = await decodeRelayToken(token);

          if (payload) {
            const senderClean = (fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress).trim().toLowerCase();
            const expectedSender = payload.employeePersonalEmail.trim().toLowerCase();

            // Verify sender matches the authorized personal email
            if (senderClean === expectedSender) {
              const cleanHtml = sanitizeQuotedText(html, token, payload.customerEmail, payload.customerName, payload.employeePersonalEmail, payload.employeeBusinessEmail);
              const cleanText = sanitizeQuotedText(text, token, payload.customerEmail, payload.customerName, payload.employeePersonalEmail, payload.employeeBusinessEmail);

              const outboundHeaders: Record<string, string> = {
                "X-Mailcoy-Relayed": "1",
                "Auto-Submitted": "auto-replied",
              };

              if (payload.originalMessageId) {
                outboundHeaders["In-Reply-To"] = payload.originalMessageId;
                outboundHeaders["References"] = payload.originalMessageId;
              }

              // Deterministic idempotency key derived from thread / original message and customer
              const replyIdempotencyKey = `relay_out_${payload.originalMessageId || token}_${payload.customerEmail}`;

              const outResult = await sendResendEmail({
                from: `${payload.employeeName} <${payload.employeeBusinessEmail}>`,
                to: payload.customerEmail,
                cc: payload.cc && payload.cc.length > 0 ? payload.cc : undefined,
                subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
                headers: outboundHeaders,
                html: cleanHtml || `<pre style="font-family:inherit;white-space:pre-wrap;">${cleanText}</pre>`,
                text: cleanText || undefined,
                attachments: attachments.length > 0 ? attachments : undefined,
                idempotencyKey: replyIdempotencyKey,
                apiKey: resendApiKey,
              });

              console.log(`[Mailcoy Relay] Dispatched threaded reply to ${payload.customerEmail} as ${payload.employeeBusinessEmail} | id:`, outResult?.id);

              if (payload.organizationId) {
                await supabaseAdmin.from("email_logs").insert({
                  organization_id: payload.organizationId,
                  sender: payload.employeeBusinessEmail,
                  receiver: payload.customerEmail,
                  subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
                  snippet: (cleanText || subject || "(Outbound Reply)").slice(0, 150),
                  direction: "outgoing",
                  status: outResult.ok ? "delivered" : "failed",
                  timestamp: new Date().toISOString(),
                });
              }
              continue;
            } else {
              console.warn(`[Mailcoy Relay] Unauthorized sender ${senderClean} (expected ${expectedSender})`);
              continue;
            }
          }
        } catch (relayErr) {
          console.error("[Mailcoy Relay] Error processing relay reply:", relayErr);
        }
      }

      try {
        const targetDeliveries: Array<{ gmail: string; orgId: string | null; name: string }> = [];

        // 1. Direct employee match by professional_email or company_email
        const { data: emps } = await (supabaseAdmin
          .from("employees")
          .select("id, organization_id, full_name, personal_email")
          .or(`professional_email.eq.${recipientEmail},company_email.eq.${recipientEmail}`) as any) as { data: any[] | null };

        if (emps && emps.length > 0) {
          for (const emp of emps) {
            const { data: gc } = await supabaseAdmin
              .from("gmail_connections")
              .select("google_email")
              .eq("employee_id", emp.id)
              .is("revoked_at", null)
              .maybeSingle();

            const gmail = (gc as any)?.google_email || null;
            if (gmail) {
              targetDeliveries.push({
                gmail,
                orgId: emp.organization_id,
                name: emp.full_name || "Team Member",
              });
            }
          }
        }

        // 2. Check aliases table (Support multi-recipient broadcast)
        if (targetDeliveries.length === 0) {
          const { data: aliases } = await (supabaseAdmin
            .from("aliases")
            .select("id, organization_id, address, employee_id")
            .eq("address", recipientEmail) as any) as { data: any[] | null };

          if (aliases && aliases.length > 0) {
            for (const alias of aliases) {
              if (alias.employee_id) {
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

                  const gmail = (gc as any)?.google_email || null;
                  if (gmail) {
                    targetDeliveries.push({
                      gmail,
                      orgId: alias.organization_id,
                      name: aliasEmp.full_name || "Team Member",
                    });
                  }
                }
              }
            }
          }
        }

        // 3. Domain catch-all fallback
        if (targetDeliveries.length === 0) {
          const { data: dom } = await supabaseAdmin
            .from("domains")
            .select("id, organization_id")
            .eq("domain_name", recipientDomain)
            .maybeSingle();

          if (dom?.organization_id) {
            // Check organization catch-all setting
            const { data: wsSetting } = await supabaseAdmin
              .from("settings")
              .select("catchall_mode, catchall_forward_to")
              .eq("organization_id", dom.organization_id)
              .maybeSingle();

            const catchallMode = wsSetting?.catchall_mode || "receive";
            if (catchallMode === "reject") {
              console.log(`[Mailcoy] Catch-all rejected for ${recipientEmail} (mode=reject)`);
              continue;
            }

            if (catchallMode === "forward" && wsSetting?.catchall_forward_to) {
              targetDeliveries.push({
                gmail: wsSetting.catchall_forward_to,
                orgId: dom.organization_id,
                name: "Catch-All Recipient",
              });
            } else {
              // Default "receive" mode: route to earliest created employee
              const { data: ownerEmp } = await (supabaseAdmin
                .from("employees")
                .select("id, full_name")
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

                const gmail = (gc as any)?.google_email || null;
                if (gmail) {
                  targetDeliveries.push({
                    gmail,
                    orgId: dom.organization_id,
                    name: ownerEmp.full_name || "Team Member",
                  });
                }
              }
            }
          }
        }

        if (targetDeliveries.length === 0) {
          console.warn(`[Mailcoy] No destination found for ${recipientEmail}`);
          continue;
        }

        // 4. Forward via Resend to each recipient
        const senderNameMatch = fromAddress.match(/^([^<]+)</);
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

        for (const target of targetDeliveries) {
          // Enforce Free Tier Monthly Quota & Subscription Status
          let quotaAllowed = true;
          let blockReason: string | undefined = undefined;

          if (target.orgId) {
            const { checkAndEnforceEmailQuota } = await import("@/server/usageQuota.server");
            const quotaCheck = await checkAndEnforceEmailQuota(target.orgId, recipientEmail, true);
            quotaAllowed = quotaCheck.allowed;
            blockReason = quotaCheck.reason;
          }

          if (!quotaAllowed) {
            console.warn(`[Mailcoy] Email blocked for ${recipientEmail} (${blockReason})`);
            if (target.orgId) {
              await supabaseAdmin.from("email_logs").insert({
                organization_id: target.orgId,
                sender: fromAddress,
                receiver: recipientEmail,
                subject,
                snippet: `[Blocked: ${blockReason || "Limit Reached"}] ${(text || subject || "").slice(0, 120)}`,
                direction: "incoming",
                status: "failed",
                timestamp: new Date().toISOString(),
              });
            }
            continue;
          }

          let replyToAddress = fromAddress;
          try {
            const { generateRelayToken } = await import("@/server/relayToken.server");
            const relayToken = await generateRelayToken({
              customerEmail: senderEmail,
              customerName: senderDisplayName,
              employeePersonalEmail: target.gmail,
              employeeBusinessEmail: recipientEmail,
              employeeName: target.name,
              organizationId: target.orgId || undefined,
              originalSubject: subject,
              originalMessageId,
              ts: Date.now(),
            });
            replyToAddress = `reply+${relayToken}@mailcoy.com`;
          } catch (e) {
            console.warn("[Mailcoy Relay] Could not generate token, fallback:", e);
          }

          // Deterministic idempotency key for inbound forwarding
          const forwardIdempotencyKey = `relay_fwd_${emailId || originalMessageId || Date.now()}_${target.gmail}`;

          const fwdResult = await sendResendEmail({
            from: `${senderDisplayName} via Mailcoy <router@${recipientDomain}>`,
            to: target.gmail,
            reply_to: replyToAddress,
            subject,
            html: forwardHtml,
            attachments: attachments.length > 0 ? attachments : undefined,
            headers: {
              "X-Mailcoy-Loop-Prevent": "1",
              "Auto-Submitted": "auto-generated",
            },
            idempotencyKey: forwardIdempotencyKey,
            apiKey: resendApiKey,
          });

          console.log(`[Mailcoy] Forwarded ${recipientEmail} -> ${target.gmail} | id:`, fwdResult?.id);

          if (target.orgId) {
            await supabaseAdmin.from("email_logs").insert({
              organization_id: target.orgId,
              sender: fromAddress,
              receiver: recipientEmail,
              subject,
              snippet: (text || subject || "(Inbound)").slice(0, 150),
              direction: "incoming",
              status: fwdResult.ok ? "delivered" : "failed",
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error(`[Mailcoy] Error routing ${recipientEmail}:`, err);
      }
    }

    if (lockId && eventId) {
      const { markWebhookCompleted } = await import("@/server/webhookDeduplication.server");
      await markWebhookCompleted(lockId, "resend", eventId, { recipients_count: toAddresses.length });
    }
  } catch (err: any) {
    if (lockId && eventId) {
      const { markWebhookFailed } = await import("@/server/webhookDeduplication.server");
      await markWebhookFailed(lockId, "resend", eventId, err?.message || "Processing error");
    }
    throw err;
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

        const rawBody = await request.text();
        const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
        const isProduction = process.env.NODE_ENV === "production";

        // FIX 4: MANDATORY WEBHOOK AUTHENTICATION IN PRODUCTION
        if (isProduction && !webhookSecret) {
          console.error("[Mailcoy Webhook] CRITICAL SECURITY CONFIGURATION ERROR: RESEND_WEBHOOK_SECRET is missing in production!");
          return new Response("Server security misconfiguration", { status: 500 });
        }

        if (webhookSecret) {
          const isValid = verifySvixSignature(rawBody, request.headers, webhookSecret);
          if (!isValid) {
            console.error("[Mailcoy Webhook] Unauthorized or forged Svix signature rejected");
            return new Response("Unauthorized signature", { status: 401 });
          }
        } else if (isProduction) {
          return new Response("Unauthorized: missing signature", { status: 401 });
        } else {
          console.warn("[Mailcoy Webhook DEV WARNING] Webhook processed without signature verification (dev mode)");
        }

        let body: any;
        try {
          body = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const emailData = body?.data || body;
        const toAddresses: string[] = Array.isArray(emailData?.to)
          ? emailData.to
          : typeof emailData?.to === "string"
            ? [emailData.to]
            : [];

        // FIX 1: ATOMIC WEBHOOK IDEMPOTENCY & DEDUPLICATION LOCK
        const eventId = emailData?.email_id || emailData?.id || body?.id || `anon_${crypto.randomUUID()}`;
        const { acquireWebhookLock } = await import("@/server/webhookDeduplication.server");
        const lock = await acquireWebhookLock("resend", String(eventId), body?.type || "email.received", {
          to: toAddresses,
        });

        if (lock.status === "already_completed") {
          console.log(`[Mailcoy Webhook] Duplicate event ${eventId} already completed. Safe 200 returned.`);
          return new Response(
            JSON.stringify({ ok: true, duplicate: true, count: toAddresses.length }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        if (lock.status === "currently_processing") {
          console.log(`[Mailcoy Webhook] Event ${eventId} is currently processing by another worker. Safe 200 returned.`);
          return new Response(
            JSON.stringify({ ok: true, in_progress: true, count: toAddresses.length }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        if (toAddresses.length > 0) {
          waitUntil(
            processInboundEmail(emailData, resendApiKey, lock.lockId, String(eventId)).catch((err) =>
              console.error("[Mailcoy] Inbound processing error:", err)
            )
          );
        }

        return new Response(
          JSON.stringify({ ok: true, count: toAddresses.length, lockId: lock.lockId }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
});
