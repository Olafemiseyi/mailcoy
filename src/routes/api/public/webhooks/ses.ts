import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/ses")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        const messageType = request.headers.get("x-amz-sns-message-type");
        if (!messageType) {
          return new Response("Missing SNS headers", { status: 400 });
        }

        const raw = await request.text();
        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        // Basic Domain Validation (MVP)
        if (payload.SubscribeURL && !payload.SubscribeURL.startsWith("https://sns.")) {
          return new Response("Invalid SubscribeURL domain", { status: 403 });
        }

        if (messageType === "SubscriptionConfirmation") {
          // Auto-confirm the SNS subscription by fetching the URL
          if (payload.SubscribeURL) {
            try {
              const res = await fetch(payload.SubscribeURL);
              if (!res.ok) {
                console.error("[SES Webhook] Failed to confirm subscription", await res.text());
                return new Response("Failed to confirm", { status: 500 });
              }
              console.log("[SES Webhook] Subscription confirmed");
              return new Response("Confirmed", { status: 200 });
            } catch (err) {
              console.error("[SES Webhook] Error confirming subscription", err);
              return new Response("Error confirming", { status: 500 });
            }
          }
          return new Response("No SubscribeURL provided", { status: 400 });
        }

        if (messageType === "Notification") {
          let sesEvent: any;
          try {
            sesEvent = JSON.parse(payload.Message);
          } catch {
            return new Response("Bad SES Message JSON", { status: 400 });
          }

          const notificationType = sesEvent.notificationType;
          if (!notificationType) {
            // Might be a test event or irrelevant
            return new Response("ok", { status: 200 });
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Extract SES message ID to map back to our sending_logs
          const sesMessageId = sesEvent.mail?.messageId;
          
          if (!sesMessageId) {
            console.warn("[SES Webhook] No mail.messageId in payload");
            return new Response("ok", { status: 200 });
          }

          // Look up sending_logs record to get the organization_id
          const { data: log, error: logError } = await supabaseAdmin
            .from("sending_logs")
            .select("id, organization_id")
            .eq("message_id", sesMessageId)
            .maybeSingle();

          if (logError || !log) {
            console.warn(`[SES Webhook] Could not find sending_logs for message_id: ${sesMessageId}`);
            // Return 200 so SNS stops retrying
            return new Response("ok", { status: 200 });
          }

          if (notificationType === "Bounce") {
            const bounce = sesEvent.bounce || {};
            const bounceType = bounce.bounceType;
            const bounceSubType = bounce.bounceSubType;
            const bouncedRecipients = bounce.bouncedRecipients || [];

            for (const recipient of bouncedRecipients) {
              const { error: insErr } = await supabaseAdmin.from("ses_bounce_events").insert({
                organization_id: log.organization_id,
                sending_log_id: log.id,
                bounce_type: bounceType,
                bounce_subtype: bounceSubType,
                recipient: recipient.emailAddress,
                raw: sesEvent,
              } as never);
              if (insErr) console.error("[SES Webhook] Bounce insert error:", insErr);
            }

            const { error: upErr } = await supabaseAdmin.from("sending_logs").update({
              status: "bounced",
              error: `${bounceType}: ${bounceSubType}`
            } as never).eq("id", log.id);
            if (upErr) console.error("[SES Webhook] sending_logs update error:", upErr);

          } else if (notificationType === "Complaint") {
            const complaint = sesEvent.complaint || {};
            const complaintType = complaint.complaintFeedbackType;
            const complainedRecipients = complaint.complainedRecipients || [];

            for (const recipient of complainedRecipients) {
              const { error: insErr } = await supabaseAdmin.from("ses_complaint_events").insert({
                organization_id: log.organization_id,
                sending_log_id: log.id,
                complaint_type: complaintType,
                recipient: recipient.emailAddress,
                raw: sesEvent,
              } as never);
              if (insErr) console.error("[SES Webhook] Complaint insert error:", insErr);
            }

            const { error: upErr } = await supabaseAdmin.from("sending_logs").update({
              status: "complained",
              error: `Complaint: ${complaintType}`
            } as never).eq("id", log.id);
            if (upErr) console.error("[SES Webhook] sending_logs update error:", upErr);
          } else if (notificationType === "Delivery") {
            const { error: upErr } = await supabaseAdmin.from("sending_logs").update({
              status: "delivered"
            } as never).eq("id", log.id);
            if (upErr) console.error("[SES Webhook] sending_logs update error:", upErr);
          }

          return new Response("ok", { status: 200 });
        }

        return new Response("ok", { status: 200 });
      }
    }
  }
});
