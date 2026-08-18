import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-_y7YRLGO.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics.functions-CcJCVsMu.js
var getAnalytics = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ range: enumType([
	"today",
	"week",
	"month",
	"year"
]).default("week") }).parse(d ?? {})).handler(createSsrRpc("c491f292fda3d5d830370f062a74d0bc23cfc38facc1346ab53630f9411951c8"));
var listAliases = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("743a7384f6217152f5f7954844cc3c30253e5126e3ccb2031758395397903229"));
var createAlias = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	address: stringType().trim().email().max(254),
	employee_id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("46eab4cd65c8d0b11e5f5cdcc0820a28ff8819b10a33916e464f723a69b2e63b"));
var deleteAlias = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("4a1dac309d6ce1c6742ad7bb72e54feaff685f0d6137a894f0adfbba2186d24a"));
var updateAliasEmployee = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	employee_id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("2ba394d7d528b09e74c5a39d18161b98d5bce160075423a803c361700a4dba58"));
var getOrgSettings = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a5943c04fd5b3a354ad08587c6802d65d251d7e7a24bc5459b96daf67e51b422"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ company_signature: stringType().max(2e3).nullable() }).parse(d)).handler(createSsrRpc("00b8d018e570e097e9d7ff92fc8da31079d3c5a3b1ae89bea7064ee46cc09352"));
var updateCatchAll = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	catchall_mode: enumType([
		"receive",
		"reject",
		"forward"
	]),
	catchall_forward_to: stringType().trim().email().max(254).nullable()
}).parse(d)).handler(createSsrRpc("1a5980dd51aad3d0fef0ad98140df79149fcad24aa3c1bbd2469af714e523f82"));
//#endregion
export { listAliases as a, getOrgSettings as i, deleteAlias as n, updateAliasEmployee as o, getAnalytics as r, updateCatchAll as s, createAlias as t };
