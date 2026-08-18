import { c as createServerFn } from "./_ssr/createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-Cw6_vrZ_.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, r as enumType, s as stringType } from "./_libs/zod.mjs";
import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.billing-Dk_Swgue.js
var initSchema = objectType({
	planCode: stringType().min(3).max(64),
	interval: enumType(["monthly", "yearly"]).default("monthly"),
	amountKobo: numberType().int().positive().max(1e8),
	callbackUrl: stringType().url(),
	promoCode: stringType().trim().toUpperCase().max(32).optional()
});
var initPaystackCheckout = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => initSchema.parse(d)).handler(createSsrRpc("8a44a0c286f6746ce9a1041a2f04951a77a9ecee71d7287d3ccf79a992d638e4"));
var verifyPaystackReference = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ reference: stringType().min(3) }).parse(d)).handler(createSsrRpc("566fd3fda1e3ea1bcc999ab0689bd79f15529da932b597f092fc561630329190"));
var cancelSubscription = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("debe4c4f5e968d42ab9d2facf9d08b29d7cd8a9986f728190f70bc08ef71a94f"));
var getBillingOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("956a6a12a6e8acd746ac0597595c5dff0049c306fe426d622e3cb95904efd54c"));
var billingOpts = queryOptions({
	queryKey: ["billing-overview"],
	queryFn: async () => getBillingOverview(),
	staleTime: 3e4
});
//#endregion
export { verifyPaystackReference as i, cancelSubscription as n, initPaystackCheckout as r, billingOpts as t };
