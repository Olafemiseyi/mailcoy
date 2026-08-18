import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, n as booleanType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/promo.functions-BFxHWhpx.js
async function assertPlatformAdmin(supabase, userId) {
	const { data, error } = await supabase.rpc("is_platform_admin", { _user_id: userId });
	if (error) throw error;
	if (!data) throw new Error("You do not have platform admin access.");
}
var listPromoCodes_createServerFn_handler = createServerRpc({
	id: "3b7d4e3580cdeca7b5520437a2361764cab52bc0fd82efde5cde07dbdc6caccc",
	name: "listPromoCodes",
	filename: "src/lib/promo.functions.ts"
}, (opts) => listPromoCodes.__executeServer(opts));
var listPromoCodes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listPromoCodes_createServerFn_handler, async ({ context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data, error } = await supabaseAdmin.from("promo_codes").select("*").order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
});
var createSchema = objectType({
	code: stringType().trim().toUpperCase().min(3).max(32).regex(/^[A-Z0-9_-]+$/, "Only letters, numbers, - and _ allowed"),
	description: stringType().trim().max(200).optional(),
	discount_pct: numberType().int().min(1).max(100),
	max_uses: numberType().int().min(0).max(1e6).default(100),
	duration: enumType(["once", "forever"]).default("once"),
	is_active: booleanType().default(true),
	expires_at: stringType().datetime().nullable().optional()
});
var createPromoCode_createServerFn_handler = createServerRpc({
	id: "53a108889541c1bf5c4c43885654a8b01bbf245ac5676698536b3bfc024a4abe",
	name: "createPromoCode",
	filename: "src/lib/promo.functions.ts"
}, (opts) => createPromoCode.__executeServer(opts));
var createPromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createSchema.parse(d)).handler(createPromoCode_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: row, error } = await supabaseAdmin.from("promo_codes").insert({
		code: data.code,
		description: data.description ?? null,
		discount_pct: data.discount_pct,
		max_uses: data.max_uses,
		duration: data.duration,
		is_active: data.is_active,
		expires_at: data.expires_at ?? null,
		created_by: context.userId
	}).select("*").single();
	if (error) {
		if (error.code === "23505") throw new Error("A promo code with that name already exists.");
		throw error;
	}
	return row;
});
var updateSchema = objectType({
	id: stringType().uuid(),
	description: stringType().trim().max(200).nullable().optional(),
	discount_pct: numberType().int().min(1).max(100).optional(),
	max_uses: numberType().int().min(0).max(1e6).optional(),
	duration: enumType(["once", "forever"]).optional(),
	is_active: booleanType().optional(),
	expires_at: stringType().datetime().nullable().optional()
});
var updatePromoCode_createServerFn_handler = createServerRpc({
	id: "df9481ea99f3496bb89b356487185e361084a4cad54e9ec98cf82b3f3c1048ae",
	name: "updatePromoCode",
	filename: "src/lib/promo.functions.ts"
}, (opts) => updatePromoCode.__executeServer(opts));
var updatePromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => updateSchema.parse(d)).handler(updatePromoCode_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { id, ...fields } = data;
	const { data: row, error } = await supabaseAdmin.from("promo_codes").update(fields).eq("id", id).select("*").single();
	if (error) throw error;
	return row;
});
var deletePromoCode_createServerFn_handler = createServerRpc({
	id: "9f272bac90a5f61f9b7210f8b7185f40bf5b563cc1144285c46f4deb9f4f6fcf",
	name: "deletePromoCode",
	filename: "src/lib/promo.functions.ts"
}, (opts) => deletePromoCode.__executeServer(opts));
var deletePromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deletePromoCode_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { error } = await supabaseAdmin.from("promo_codes").delete().eq("id", data.id);
	if (error) throw error;
	return { ok: true };
});
var validatePromoCode_createServerFn_handler = createServerRpc({
	id: "2f6532b4c4a8db8c03c005d8009da706d49e780dc2e96871497caf82edb39049",
	name: "validatePromoCode",
	filename: "src/lib/promo.functions.ts"
}, (opts) => validatePromoCode.__executeServer(opts));
var validatePromoCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType().trim().toUpperCase().min(1).max(32) }).parse(d)).handler(validatePromoCode_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: row, error } = await supabaseAdmin.from("promo_codes").select("id, code, discount_pct, duration, is_active, max_uses, current_uses, expires_at").eq("code", data.code).maybeSingle();
	if (error) throw error;
	if (!row) return {
		valid: false,
		message: "Promo code not found."
	};
	if (!row.is_active) return {
		valid: false,
		message: "This promo code is no longer active."
	};
	if (row.expires_at && new Date(row.expires_at) < /* @__PURE__ */ new Date()) return {
		valid: false,
		message: "This promo code has expired."
	};
	if (row.max_uses > 0 && row.current_uses >= row.max_uses) return {
		valid: false,
		message: "This promo code has reached its usage limit."
	};
	const durLabel = row.duration === "forever" ? "every month" : "your first month only";
	return {
		valid: true,
		code: row.code,
		discountPct: row.discount_pct,
		duration: row.duration,
		message: `${row.discount_pct}% off applied — ${durLabel}.`
	};
});
//#endregion
export { createPromoCode_createServerFn_handler, deletePromoCode_createServerFn_handler, listPromoCodes_createServerFn_handler, updatePromoCode_createServerFn_handler, validatePromoCode_createServerFn_handler };
