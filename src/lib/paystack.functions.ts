// Paystack server functions — initialize a transaction for the signed-in
// user's organization and verify the returned reference server-side.
// Uses PAYSTACK_SECRET_KEY (server-only).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, assertAdmin } from "@/server/orgContext.server";

const PAYSTACK_BASE = "https://api.paystack.co";

function requirePaystackKey(): string {
  const k = process.env.PAYSTACK_SECRET_KEY;
  if (!k) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return k;
}

const initSchema = z.object({
  planCode: z.string().min(3).max(64),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  amountKobo: z.number().int().positive().max(1_000_000_00),
  callbackUrl: z.string().url(),
  promoCode: z.string().trim().toUpperCase().max(32).optional(),
});

function planEnvName(planCode: string, interval: "monthly" | "yearly") {
  return `PAYSTACK_PLAN_${planCode.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_${interval.toUpperCase()}`;
}

export const initPaystackCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => initSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const email = context.claims.email as string | undefined;
    if (!email) throw new Error("No email on session");

    // ── Promo code validation (server-side re-check) ──────────────────────────
    let finalAmountKobo = data.amountKobo;
    let promoDiscountPct: number | null = null;
    let promoDuration: "once" | "forever" | null = null;

    if (data.promoCode) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: promo } = await (supabaseAdmin as any)
        .from("promo_codes")
        .select("discount_pct, duration, is_active, max_uses, current_uses, expires_at")
        .eq("code", data.promoCode)
        .maybeSingle() as { data: any, error: any };

      if (
        promo &&
        promo.is_active &&
        (!promo.expires_at || new Date(promo.expires_at) >= new Date()) &&
        (promo.max_uses === 0 || promo.current_uses < promo.max_uses)
      ) {
        // Apply discount to this month's charge
        promoDiscountPct = promo.discount_pct as number;
        promoDuration = promo.duration as "once" | "forever";
        finalAmountKobo = Math.round(finalAmountKobo * (1 - promoDiscountPct / 100));
        // Enforce Paystack minimum (Paystack requires at least ₦100 = 10000 kobo)
        if (finalAmountKobo < 10_000) finalAmountKobo = 10_000;
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    const recurringPlan = process.env[planEnvName(data.planCode, data.interval)];
    const payload: Record<string, unknown> = {
      email,
      callback_url: data.callbackUrl,
      metadata: {
        organization_id: ctx.organizationId,
        plan_code: data.planCode,
        billing_interval: data.interval,
        user_id: context.userId,
        promo_code: data.promoCode ?? null,
        promo_discount_pct: promoDiscountPct,
        promo_duration: promoDuration,
      },
    };
    if (recurringPlan) payload.plan = recurringPlan;
    else payload.amount = finalAmountKobo;

    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${requirePaystackKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = (await res.json()) as {
      status: boolean;
      message?: string;
      data?: { authorization_url: string; access_code: string; reference: string };
    };
    if (!res.ok || !body.status || !body.data) {
      throw new Error(`Paystack init failed: ${body.message ?? res.status}`);
    }
    return {
      authorizationUrl: body.data.authorization_url,
      reference: body.data.reference,
      recurring: Boolean(recurringPlan),
      discountedAmountKobo: finalAmountKobo,
      promoDiscountPct,
    };
  });

export const verifyPaystackReference = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ reference: z.string().min(3) }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(data.reference)}`,
      { headers: { Authorization: `Bearer ${requirePaystackKey()}` } },
    );
    const body = (await res.json()) as {
      status: boolean;
      data?: { status: string; reference: string; amount: number; metadata?: Record<string, unknown> };
    };
    if (!res.ok || !body.status || !body.data) throw new Error("Verify failed");
    if (body.data.status !== "success") return { ok: false as const, status: body.data.status };

    // Best-effort: persist subscription state via admin client (webhook is source of truth).
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const meta = (body.data.metadata ?? {}) as {
      plan_code?: string;
      organization_id?: string;
      billing_interval?: "monthly" | "yearly";
      promo_code?: string;
      promo_discount_pct?: number;
      promo_duration?: string;
    };
    const orgId = meta.organization_id ?? ctx.organizationId;
    const periodDays = meta.billing_interval === "yearly" ? 365 : 30;
    await supabaseAdmin.from("subscriptions").upsert(
      {
        organization_id: orgId,
        provider: "paystack",
        provider_reference: body.data.reference,
        plan: meta.plan_code ?? "Paystack",
        plan_code: meta.plan_code ?? null,
        status: "active",
        amount_kobo: body.data.amount,
        current_period_end: new Date(Date.now() + periodDays * 24 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        // Persist promo info so we can apply discount on future renewals if duration=forever
        promo_code: meta.promo_code ?? null,
        promo_discount_pct: meta.promo_discount_pct ?? null,
        promo_duration: meta.promo_duration ?? null,
      } as never,
      { onConflict: "provider_reference" },
    );

    // Atomically redeem the promo code (increment uses, insert redemption row)
    if (meta.promo_code) {
      const { redeemPromoCodeInternal } = await import("@/lib/promo.functions");
      await redeemPromoCodeInternal(supabaseAdmin, meta.promo_code, orgId, body.data.reference);
    }

    return { ok: true as const, reference: body.data.reference };
  });

export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Update active subscriptions to canceled
    await supabaseAdmin
      .from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() } as never)
      .eq("organization_id", ctx.organizationId)
      .eq("status", "active");

    return { ok: true };
  });

export type BillingCard = {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
} | null;

export const getBillingOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{
    subscription: any;
    card: BillingCard;
    events: any[];
    usage: { employees: number; domains: number };
  }> => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    
    // Fetch subscription
    const { data: sub } = await context.supabase
      .from("subscriptions")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();

    // Fetch usage counts
    const { count: employees } = await context.supabase
      .from("employees")
      .select("*", { count: 'exact', head: true })
      .eq("organization_id", ctx.organizationId);
      
    const { count: domains } = await context.supabase
      .from("domains")
      .select("*", { count: 'exact', head: true })
      .eq("organization_id", ctx.organizationId);
      
    return { 
      subscription: sub || {
        plan: ctx.subscription.plan,
        plan_code: ctx.subscription.planCode,
        status: ctx.subscription.status,
        amount_kobo: null,
        provider: "paystack",
        provider_reference: null,
        current_period_end: ctx.subscription.currentPeriodEnd,
        renewal_date: null,
        updated_at: new Date().toISOString()
      }, 
      card: null, 
      events: [],
      usage: {
        employees: employees || 0,
        domains: domains || 0
      }
    };
  });
