import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext, t as assertAdmin } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paystack.functions-tLHBVKkv.js
var PAYSTACK_BASE = "https://api.paystack.co";
function requirePaystackKey() {
	const k = process.env.PAYSTACK_SECRET_KEY;
	if (!k) throw new Error("PAYSTACK_SECRET_KEY is not set");
	return k;
}
var initSchema = objectType({
	planCode: stringType().min(3).max(64),
	interval: enumType(["monthly", "yearly"]).default("monthly"),
	amountKobo: numberType().int().positive().max(1e8),
	callbackUrl: stringType().url(),
	promoCode: stringType().trim().toUpperCase().max(32).optional()
});
function planEnvName(planCode, interval) {
	return `PAYSTACK_PLAN_${planCode.toUpperCase().replace(/[^A-Z0-9]/g, "_")}_${interval.toUpperCase()}`;
}
var initPaystackCheckout_createServerFn_handler = createServerRpc({
	id: "8a44a0c286f6746ce9a1041a2f04951a77a9ecee71d7287d3ccf79a992d638e4",
	name: "initPaystackCheckout",
	filename: "src/lib/paystack.functions.ts"
}, (opts) => initPaystackCheckout.__executeServer(opts));
var initPaystackCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => initSchema.parse(d)).handler(initPaystackCheckout_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const email = context.claims.email;
	if (!email) throw new Error("No email on session");
	let finalAmountKobo = data.amountKobo;
	let promoDiscountPct = null;
	let promoDuration = null;
	if (data.promoCode) {
		const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
		const { data: promo } = await supabaseAdmin.from("promo_codes").select("discount_pct, duration, is_active, max_uses, current_uses, expires_at").eq("code", data.promoCode).maybeSingle();
		if (promo && promo.is_active && (!promo.expires_at || new Date(promo.expires_at) >= /* @__PURE__ */ new Date()) && (promo.max_uses === 0 || promo.current_uses < promo.max_uses)) {
			promoDiscountPct = promo.discount_pct;
			promoDuration = promo.duration;
			finalAmountKobo = Math.round(finalAmountKobo * (1 - promoDiscountPct / 100));
			if (finalAmountKobo < 1e4) finalAmountKobo = 1e4;
		}
	}
	const recurringPlan = process.env[planEnvName(data.planCode, data.interval)];
	const payload = {
		email,
		callback_url: data.callbackUrl,
		metadata: {
			organization_id: ctx.organizationId,
			plan_code: data.planCode,
			billing_interval: data.interval,
			user_id: context.userId,
			promo_code: data.promoCode ?? null,
			promo_discount_pct: promoDiscountPct,
			promo_duration: promoDuration
		}
	};
	if (recurringPlan) payload.plan = recurringPlan;
	else payload.amount = finalAmountKobo;
	const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${requirePaystackKey()}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	});
	const body = await res.json();
	if (!res.ok || !body.status || !body.data) throw new Error(`Paystack init failed: ${body.message ?? res.status}`);
	return {
		authorizationUrl: body.data.authorization_url,
		reference: body.data.reference,
		recurring: Boolean(recurringPlan),
		discountedAmountKobo: finalAmountKobo,
		promoDiscountPct
	};
});
var verifyPaystackReference_createServerFn_handler = createServerRpc({
	id: "566fd3fda1e3ea1bcc999ab0689bd79f15529da932b597f092fc561630329190",
	name: "verifyPaystackReference",
	filename: "src/lib/paystack.functions.ts"
}, (opts) => verifyPaystackReference.__executeServer(opts));
var verifyPaystackReference = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ reference: stringType().min(3) }).parse(d)).handler(verifyPaystackReference_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(data.reference)}`, { headers: { Authorization: `Bearer ${requirePaystackKey()}` } });
	const body = await res.json();
	if (!res.ok || !body.status || !body.data) throw new Error("Verify failed");
	if (body.data.status !== "success") return {
		ok: false,
		status: body.data.status
	};
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const meta = body.data.metadata ?? {};
	const orgId = meta.organization_id ?? ctx.organizationId;
	const periodDays = meta.billing_interval === "yearly" ? 365 : 30;
	await supabaseAdmin.from("subscriptions").upsert({
		organization_id: orgId,
		provider: "paystack",
		provider_reference: body.data.reference,
		plan: meta.plan_code ?? "Paystack",
		plan_code: meta.plan_code ?? null,
		status: "active",
		amount_kobo: body.data.amount,
		current_period_end: new Date(Date.now() + periodDays * 24 * 3600 * 1e3).toISOString(),
		updated_at: (/* @__PURE__ */ new Date()).toISOString(),
		promo_code: meta.promo_code ?? null,
		promo_discount_pct: meta.promo_discount_pct ?? null,
		promo_duration: meta.promo_duration ?? null
	}, { onConflict: "provider_reference" });
	if (meta.promo_code) {
		const { redeemPromoCodeInternal } = await import("./promo.functions-wQ8o_RIj.mjs");
		await redeemPromoCodeInternal(supabaseAdmin, meta.promo_code, orgId, body.data.reference);
	}
	return {
		ok: true,
		reference: body.data.reference
	};
});
var cancelSubscription_createServerFn_handler = createServerRpc({
	id: "debe4c4f5e968d42ab9d2facf9d08b29d7cd8a9986f728190f70bc08ef71a94f",
	name: "cancelSubscription",
	filename: "src/lib/paystack.functions.ts"
}, (opts) => cancelSubscription.__executeServer(opts));
var cancelSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(cancelSubscription_createServerFn_handler, async ({ context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("subscriptions").update({
		status: "canceled",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("organization_id", ctx.organizationId).eq("status", "active");
	return { ok: true };
});
var getBillingOverview_createServerFn_handler = createServerRpc({
	id: "956a6a12a6e8acd746ac0597595c5dff0049c306fe426d622e3cb95904efd54c",
	name: "getBillingOverview",
	filename: "src/lib/paystack.functions.ts"
}, (opts) => getBillingOverview.__executeServer(opts));
var getBillingOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getBillingOverview_createServerFn_handler, async ({ context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	return {
		subscription: {
			plan: ctx.subscription.plan,
			plan_code: ctx.subscription.planCode,
			status: ctx.subscription.status,
			amount_kobo: null,
			provider: "paystack",
			provider_reference: "mock-sub-123",
			current_period_end: ctx.subscription.currentPeriodEnd,
			renewal_date: null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		},
		card: null,
		events: [],
		usage: {
			employees: 6,
			domains: 4
		}
	};
});
//#endregion
export { cancelSubscription_createServerFn_handler, getBillingOverview_createServerFn_handler, initPaystackCheckout_createServerFn_handler, verifyPaystackReference_createServerFn_handler };
