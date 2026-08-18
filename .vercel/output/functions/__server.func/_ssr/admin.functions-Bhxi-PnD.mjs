import { r as __exportAll } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Cw6_vrZ_.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, n as booleanType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-Bhxi-PnD.js
var admin_functions_Bhxi_PnD_exports = /* @__PURE__ */ __exportAll({
	i: () => listAllOrganizations,
	n: () => getAdminOverview,
	r: () => getPlatformAdminStatus,
	t: () => admin_functions_exports
});
var admin_functions_exports = /* @__PURE__ */ __exportAll$1({
	getAdminOverview: () => getAdminOverview,
	getPlatformAdminStatus: () => getPlatformAdminStatus,
	listAllOrganizations: () => listAllOrganizations,
	overrideOrgPlan: () => overrideOrgPlan,
	searchGlobalEmailLogs: () => searchGlobalEmailLogs,
	setPlatformBroadcast: () => setPlatformBroadcast
});
/** Cheap check the /admin gate uses before rendering. */
var getPlatformAdminStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e0203d28c81cc53cc6fe760e20d359efc79bdffbb8e299f79520fe44b45ed3f9"));
/** Full metrics for the super-admin dashboard. */
var getAdminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("98193c088815d6bbdd4155ffbad4b125116e51df7ef81d3d6aef43156e028e01"));
var listAllOrganizations = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	search: stringType().max(120).optional(),
	plan: stringType().optional(),
	limit: numberType().int().min(1).max(200).default(50),
	offset: numberType().int().min(0).max(1e4).default(0)
}).parse(d ?? {})).handler(createSsrRpc("55fe9e1a26d2eb4bcbf86e3ae9024e03da049250ab428d296f6eb09c07390645"));
/**
* Super Admin: Search global email logs across all tenants
*/
var searchGlobalEmailLogs = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	query: stringType().optional(),
	limit: numberType().default(50)
}).parse(d)).handler(createSsrRpc("f6ccae43e502bb5aaf107c9a56e7877206c22cd9b6f2f8989f56a679c620c439"));
/**
* Super Admin: Override organization subscription plan (e.g. grant VIP / Lifetime Free)
*/
var overrideOrgPlan = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	organizationId: stringType().uuid(),
	planCode: enumType([
		"free",
		"starter",
		"pro",
		"enterprise"
	]),
	status: enumType([
		"active",
		"trialing",
		"canceled"
	])
}).parse(d)).handler(createSsrRpc("0321c8762492dbe4827dc4f354ba564764c7aa1c09f4305e7c08bd831d2f7d85"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c9cbf391dbfbc93932258b7b8646a136dde4959dc33f7366a263d7b521575dc4"));
var setPlatformBroadcast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	message: stringType(),
	enabled: booleanType(),
	level: enumType(["info", "warning"]).default("info")
}).parse(d)).handler(createSsrRpc("3d6c779487f630322f4af3f836b6671a44a5d0718bb77c826bd5583ad6a34542"));
//#endregion
export { listAllOrganizations as i, getAdminOverview as n, getPlatformAdminStatus as r, admin_functions_Bhxi_PnD_exports as t };
