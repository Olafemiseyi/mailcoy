// Server-side usage quota and subscription enforcement module for Mailcoy.
// Enforces:
// 1. Free plan seat limit (Max 1 employee)
// 2. Free plan monthly volume cap (50 emails/month total) with 80% & 100% threshold alerts
// 3. Paid plan 72-hour grace period enforcement on past_due/failed renewals

import {
  sendQuotaWarningEmail,
  sendQuotaExceededEmail,
} from "./billingLifecycleEmail.server";

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: "quota_exceeded" | "subscription_expired" | "seat_limit_exceeded";
  planCode: string;
  currentCount?: number;
  maxLimit?: number;
}

const FREE_MONTHLY_LIMIT = 50;
const FREE_WARNING_THRESHOLD = 40; // 80%

/**
 * Checks whether an organization is authorized to route an email and increments usage counter.
 */
export async function checkAndEnforceEmailQuota(
  organizationId: string,
  targetEmail: string,
  isOwnerOrPrimary: boolean = true
): Promise<QuotaCheckResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    // 1. Fetch organization details & active subscription
    const { data: org } = await supabaseAdmin
      .from("organizations")
      .select("id, name, billing_email, plan")
      .eq("id", organizationId)
      .maybeSingle();

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, plan_code, current_period_end, updated_at")
      .eq("organization_id", organizationId)
      .maybeSingle();

    const planCode = ((sub as any)?.plan_code || (org as any)?.plan || "free").toLowerCase();
    const subStatus = ((sub as any)?.status || "active").toLowerCase();
    const orgName = (org as any)?.name || "Workspace";
    const ownerEmail = (org as any)?.billing_email || targetEmail;

    // 2. Enforce Paid Subscription Status & 72-Hour Grace Period
    if (planCode !== "free") {
      if (subStatus === "past_due") {
        const lastUpdated = new Date((sub as any)?.updated_at || Date.now()).getTime();
        const graceEndMs = lastUpdated + 72 * 60 * 60 * 1000; // 72 hours
        const isWithinGrace = Date.now() < graceEndMs;

        if (!isWithinGrace) {
          return {
            allowed: false,
            reason: "subscription_expired",
            planCode,
          };
        }
      } else if (subStatus === "canceled") {
        return {
          allowed: false,
          reason: "subscription_expired",
          planCode,
        };
      }

      // Paid plan is active or in grace period -> Unlimited volume
      return {
        allowed: true,
        planCode,
      };
    }

    // 3. Free Plan Enforcement: Seat Limit (Max 1 Employee)
    if (!isOwnerOrPrimary) {
      // Check total employees in this organization
      const { count } = await supabaseAdmin
        .from("employees")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", organizationId);

      if (count && count > 1) {
        return {
          allowed: false,
          reason: "seat_limit_exceeded",
          planCode: "free",
        };
      }
    }

    // 4. Free Plan Monthly Quota Enforcement (50 emails/month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Query messages count for this month from billing_events or activity_logs
    const { count: monthlyCount } = await supabaseAdmin
      .from("billing_events")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("event_type", "email.routed")
      .gte("received_at", startOfMonth);

    const currentUsage = (monthlyCount || 0) + 1; // including current message

    // Check 100% Limit (50 emails)
    if (currentUsage > FREE_MONTHLY_LIMIT) {
      // Send 100% email only on the first breach (currentUsage === 51)
      if (currentUsage === FREE_MONTHLY_LIMIT + 1) {
        await sendQuotaExceededEmail({
          toEmail: ownerEmail,
          ownerName: orgName,
          organizationName: orgName,
          maxLimit: FREE_MONTHLY_LIMIT,
        }).catch((e) => console.warn("[QuotaGuard] Error sending 100% email:", e));
      }

      return {
        allowed: false,
        reason: "quota_exceeded",
        planCode: "free",
        currentCount: currentUsage - 1,
        maxLimit: FREE_MONTHLY_LIMIT,
      };
    }

    // Check 80% Threshold Alert (40 emails)
    if (currentUsage === FREE_WARNING_THRESHOLD) {
      await sendQuotaWarningEmail({
        toEmail: ownerEmail,
        ownerName: orgName,
        organizationName: orgName,
        currentCount: currentUsage,
        maxLimit: FREE_MONTHLY_LIMIT,
      }).catch((e) => console.warn("[QuotaGuard] Error sending 80% warning email:", e));
    }

    // Record the routed message in billing_events for monthly usage tracking
    await supabaseAdmin.from("billing_events").insert({
      organization_id: organizationId,
      provider: "mailcoy_internal",
      event_type: "email.routed",
      reference: `route_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      payload: { targetEmail, timestamp: now.toISOString(), plan: "free" },
      received_at: now.toISOString(),
      status: "success",
    } as never);

    return {
      allowed: true,
      planCode: "free",
      currentCount: currentUsage,
      maxLimit: FREE_MONTHLY_LIMIT,
    };
  } catch (e) {
    console.error("[QuotaGuard] Error checking quota:", e);
    // Safe fail-open so transient database errors don't drop legitimate emails
    return {
      allowed: true,
      planCode: "free",
    };
  }
}
