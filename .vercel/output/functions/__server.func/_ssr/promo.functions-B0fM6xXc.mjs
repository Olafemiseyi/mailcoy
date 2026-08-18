import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Cw6_vrZ_.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, n as booleanType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/promo.functions-B0fM6xXc.js
var listPromoCodes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3b7d4e3580cdeca7b5520437a2361764cab52bc0fd82efde5cde07dbdc6caccc"));
var createSchema = objectType({
	code: stringType().trim().toUpperCase().min(3).max(32).regex(/^[A-Z0-9_-]+$/, "Only letters, numbers, - and _ allowed"),
	description: stringType().trim().max(200).optional(),
	discount_pct: numberType().int().min(1).max(100),
	max_uses: numberType().int().min(0).max(1e6).default(100),
	duration: enumType(["once", "forever"]).default("once"),
	is_active: booleanType().default(true),
	expires_at: stringType().datetime().nullable().optional()
});
var createPromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createSchema.parse(d)).handler(createSsrRpc("53a108889541c1bf5c4c43885654a8b01bbf245ac5676698536b3bfc024a4abe"));
var updateSchema = objectType({
	id: stringType().uuid(),
	description: stringType().trim().max(200).nullable().optional(),
	discount_pct: numberType().int().min(1).max(100).optional(),
	max_uses: numberType().int().min(0).max(1e6).optional(),
	duration: enumType(["once", "forever"]).optional(),
	is_active: booleanType().optional(),
	expires_at: stringType().datetime().nullable().optional()
});
var updatePromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updateSchema.parse(d)).handler(createSsrRpc("df9481ea99f3496bb89b356487185e361084a4cad54e9ec98cf82b3f3c1048ae"));
var deletePromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("9f272bac90a5f61f9b7210f8b7185f40bf5b563cc1144285c46f4deb9f4f6fcf"));
var validatePromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType().trim().toUpperCase().min(1).max(32) }).parse(d)).handler(createSsrRpc("2f6532b4c4a8db8c03c005d8009da706d49e780dc2e96871497caf82edb39049"));
async function redeemPromoCodeInternal(supabaseAdmin, code, organizationId, reference) {
	const { data: row } = await supabaseAdmin.from("promo_codes").select("id").eq("code", code).maybeSingle();
	if (!row) return;
	await supabaseAdmin.rpc("increment_promo_uses", { _code_id: row.id });
	await supabaseAdmin.from("promo_code_redemptions").insert({
		promo_code_id: row.id,
		organization_id: organizationId,
		reference
	});
}
//#endregion
export { createPromoCode, deletePromoCode, listPromoCodes, redeemPromoCodeInternal, updatePromoCode, validatePromoCode };
