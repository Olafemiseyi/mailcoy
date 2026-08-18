import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext, t as assertAdmin } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics.functions-DP7v-DFo.js
var getAnalytics_createServerFn_handler = createServerRpc({
	id: "c491f292fda3d5d830370f062a74d0bc23cfc38facc1346ab53630f9411951c8",
	name: "getAnalytics",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getAnalytics.__executeServer(opts));
var getAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ range: enumType([
	"today",
	"week",
	"month",
	"year"
]).default("week") }).parse(d ?? {})).handler(getAnalytics_createServerFn_handler, async ({ data, context }) => {
	return {
		sent: 120,
		received: 45,
		delivered: 118,
		bounced: 2,
		failed: 0,
		deliverability: 98,
		bounceRate: 2,
		series: [],
		total: 165
	};
});
var listAliases_createServerFn_handler = createServerRpc({
	id: "743a7384f6217152f5f7954844cc3c30253e5126e3ccb2031758395397903229",
	name: "listAliases",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => listAliases.__executeServer(opts));
var listAliases = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAliases_createServerFn_handler, async ({ context }) => {
	return [{
		id: "mock-alias-1",
		address: "support@mailcoy.com",
		is_primary: false,
		employee_id: "mock-emp-1",
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	}];
});
var createAlias_createServerFn_handler = createServerRpc({
	id: "46eab4cd65c8d0b11e5f5cdcc0820a28ff8819b10a33916e464f723a69b2e63b",
	name: "createAlias",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => createAlias.__executeServer(opts));
var createAlias = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	address: stringType().trim().email().max(254),
	employee_id: stringType().uuid()
}).parse(d)).handler(createAlias_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { data: row, error } = await context.supabase.from("aliases").insert({
		organization_id: ctx.organizationId,
		employee_id: data.employee_id,
		address: data.address.toLowerCase(),
		is_primary: false
	}).select("id, address, is_primary, employee_id, created_at").single();
	if (error) throw error;
	return row;
});
var deleteAlias_createServerFn_handler = createServerRpc({
	id: "4a1dac309d6ce1c6742ad7bb72e54feaff685f0d6137a894f0adfbba2186d24a",
	name: "deleteAlias",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => deleteAlias.__executeServer(opts));
var deleteAlias = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteAlias_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("aliases").delete().eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var updateAliasEmployee_createServerFn_handler = createServerRpc({
	id: "2ba394d7d528b09e74c5a39d18161b98d5bce160075423a803c361700a4dba58",
	name: "updateAliasEmployee",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => updateAliasEmployee.__executeServer(opts));
var updateAliasEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	employee_id: stringType().uuid()
}).parse(d)).handler(updateAliasEmployee_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("aliases").update({ employee_id: data.employee_id }).eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var getOrgSettings_createServerFn_handler = createServerRpc({
	id: "a5943c04fd5b3a354ad08587c6802d65d251d7e7a24bc5459b96daf67e51b422",
	name: "getOrgSettings",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => getOrgSettings.__executeServer(opts));
var getOrgSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getOrgSettings_createServerFn_handler, async ({ context }) => {
	return {
		company_signature: null,
		catchall_mode: "reject",
		catchall_forward_to: null,
		routing_active: true,
		notify_email: true,
		notify_digest: false
	};
});
var updateSignature_createServerFn_handler = createServerRpc({
	id: "00b8d018e570e097e9d7ff92fc8da31079d3c5a3b1ae89bea7064ee46cc09352",
	name: "updateSignature",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => updateSignature.__executeServer(opts));
var updateSignature = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ company_signature: stringType().max(2e3).nullable() }).parse(d)).handler(updateSignature_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("settings").upsert({
		organization_id: ctx.organizationId,
		company_signature: data.company_signature
	}, { onConflict: "organization_id" });
	if (error) throw error;
	return { ok: true };
});
var updateCatchAll_createServerFn_handler = createServerRpc({
	id: "1a5980dd51aad3d0fef0ad98140df79149fcad24aa3c1bbd2469af714e523f82",
	name: "updateCatchAll",
	filename: "src/lib/analytics.functions.ts"
}, (opts) => updateCatchAll.__executeServer(opts));
var updateCatchAll = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	catchall_mode: enumType([
		"receive",
		"reject",
		"forward"
	]),
	catchall_forward_to: stringType().trim().email().max(254).nullable()
}).parse(d)).handler(updateCatchAll_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("settings").upsert({
		organization_id: ctx.organizationId,
		catchall_mode: data.catchall_mode,
		catchall_forward_to: data.catchall_mode === "forward" ? data.catchall_forward_to : null
	}, { onConflict: "organization_id" });
	if (error) throw error;
	return { ok: true };
});
//#endregion
export { createAlias_createServerFn_handler, deleteAlias_createServerFn_handler, getAnalytics_createServerFn_handler, getOrgSettings_createServerFn_handler, listAliases_createServerFn_handler, updateAliasEmployee_createServerFn_handler, updateCatchAll_createServerFn_handler, updateSignature_createServerFn_handler };
