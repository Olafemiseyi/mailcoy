import { c as createServerFn } from "./_ssr/createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-DcOdAUYM.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType } from "./_libs/zod.mjs";
import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.signatures-BlyJrTH8.js
var listSignatures = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b22b12d19446d57457a66e2f3f0825b44db48e0928062c83eef30ee0acd5ee04"));
var upsertSchema = objectType({
	scope: enumType([
		"org",
		"department",
		"employee"
	]),
	scope_ref: stringType().nullable().optional(),
	name: stringType().trim().min(1).max(120),
	html: stringType().max(1e4)
});
var upsertSignature = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => upsertSchema.parse(d)).handler(createSsrRpc("dafcb694db90dbfd83e672fdc9e15c2ddf49e3142e6ded00ebe3acc3b4e90845"));
var deleteSignature = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("06a13a269101f2a550aa74ef052940e1fb8e3ec5c838acff8712f5edb9fe58c7"));
var opts = queryOptions({
	queryKey: ["signatures"],
	queryFn: async () => listSignatures(),
	staleTime: 15e3
});
//#endregion
export { opts as n, upsertSignature as r, deleteSignature as t };
