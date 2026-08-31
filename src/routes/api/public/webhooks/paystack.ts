// Public Paystack webhook. Verifies HMAC-SHA512 with PAYSTACK_SECRET_KEY,
// then upserts subscription state. External callers; no auth middleware.
import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/public/webhooks/paystack")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) return new Response("Server not configured", { status: 500 });

        const signature = request.headers.get("x-paystack-signature") ?? "";
        const raw = await request.text();
        const expected = createHmac("sha512", secret).update(raw).digest("hex");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: {
          event: string;
          data?: {
            reference?: string;
            subscription_code?: string;
            invoice_code?: string;
            status?: string;
            amount?: number;
            customer?: { email?: string };
            metadata?: Record<string, unknown>;
            plan?: { plan_code?: string };
          };
        };
        try {
          event = JSON.parse(raw);
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const meta = (event.data?.metadata ?? {}) as { organization_id?: string; plan_code?: string; billing_interval?: "monthly" | "yearly" };
        let orgId = meta.organization_id;
        const planCode = meta.plan_code ?? event.data?.plan?.plan_code ?? null;
        const reference = event.data?.reference ?? event.data?.subscription_code ?? event.data?.invoice_code ?? null;

        // If organization_id is missing (recurring renewal event), attempt lookup via subscription_code
        if (!orgId && event.data?.subscription_code) {
          const { data: existingSub } = await supabaseAdmin
            .from("subscriptions")
            .select("organization_id, plan_code")
            .eq("provider_reference", event.data.subscription_code)
            .maybeSingle();
          if (existingSub) {
            orgId = (existingSub as any).organization_id;
          }
        }

        const isSuccess = event.event === "charge.success" || event.event === "subscription.create";

        // Always record raw delivery for audit.
        await supabaseAdmin.from("billing_events").insert({
          provider: "paystack",
          event_type: event.event,
          reference,
          payload: event as unknown as Record<string, unknown>,
          received_at: new Date().toISOString(),
          organization_id: orgId ?? null,
          status: isSuccess ? "success" : "received",
        } as never);

        if (!orgId || !reference) {
          return new Response("ok", { status: 200 });
        }

        let status: string | null = null;
        switch (event.event) {
          case "charge.success":
          case "subscription.create":
            status = "active";
            break;
          case "invoice.payment_failed":
            status = "past_due";
            break;
          case "subscription.disable":
          case "subscription.not_renew":
            status = "canceled";
            break;
          default:
            status = null;
        }

        if (status) {
          const periodDays = meta.billing_interval === "yearly" ? 365 : 30;
          await supabaseAdmin.from("subscriptions").upsert(
            {
              organization_id: orgId,
              provider: "paystack",
              provider_reference: reference,
              plan: planCode ?? "Paystack",
              plan_code: planCode,
              status,
              amount_kobo: event.data?.amount ?? null,
              current_period_end: status === "active" ? new Date(Date.now() + periodDays * 24 * 3600 * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            } as never,
            { onConflict: "provider_reference" },
          );

          // Dispatch lifecycle email notifications based on status change
          try {
            const { data: orgData } = await supabaseAdmin
              .from("organizations")
              .select("name, billing_email")
              .eq("id", orgId)
              .maybeSingle();

            const ownerEmail = (orgData as any)?.billing_email || event.data?.customer?.email;
            const orgName = (orgData as any)?.name || "Your Workspace";

            if (ownerEmail) {
              const {
                sendPaymentFailedGraceEmail,
                sendSubscriptionExpiredEmail,
              } = await import("@/server/billingLifecycleEmail.server");

              if (status === "past_due") {
                const amountFormatted = event.data?.amount ? `₦${(event.data.amount / 100).toLocaleString()}` : "₦20,000";
                await sendPaymentFailedGraceEmail({
                  toEmail: ownerEmail,
                  ownerName: orgName,
                  organizationName: orgName,
                  planName: planCode ? `${planCode.toUpperCase()} Plan` : "Growth Plan",
                  renewalAmount: amountFormatted,
                  graceEndDate: new Date(Date.now() + 72 * 3600 * 1000).toLocaleDateString(),
                });
              } else if (status === "canceled") {
                await sendSubscriptionExpiredEmail({
                  toEmail: ownerEmail,
                  ownerName: orgName,
                  organizationName: orgName,
                });
              }
            }
          } catch (emailErr) {
            console.warn("[PaystackWebhook] Error sending billing lifecycle email:", emailErr);
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
