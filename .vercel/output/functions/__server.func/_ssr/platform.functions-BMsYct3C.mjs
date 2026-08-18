import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Cw6_vrZ_.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/platform.functions-BMsYct3C.js
var listApiKeys = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("06194406a64fc6ed394cbdc23d9441692daa59567cfa29043637a74b20ee5d69"));
var createApiKey = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().trim().min(1).max(80),
	scopes: arrayType(stringType().max(60)).max(20).default([])
}).parse(d)).handler(createSsrRpc("5ba82b01bc055bea2af5ae0c14fee37789c002d01d7889e45fc6564c55be638e"));
var revokeApiKey = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("76c861b7650ebdedb96416b7f46c176d5310f64decf720c43a68bfa639260c3a"));
var listWebhooks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e42fc51f4ccfa7732180ee388953f4c867cfea9de1bef01f8b9ea3058126bc63"));
var createWebhook = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	url: stringType().url().max(2048),
	events: arrayType(stringType().max(60)).min(1).max(30)
}).parse(d)).handler(createSsrRpc("4e16e44698178a63ec93205dfe3e83cce0da8eaaa1c2ec1881558288e5b1c183"));
var deleteWebhook = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("963f8ce92cd96599f42bb3262683a09f6f42e6cb8a7ff9b4b2af1820ef028ce2"));
var listEmailLogs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	limit: numberType().int().min(1).max(200).default(50),
	offset: numberType().int().min(0).max(1e4).default(0),
	status: stringType().max(30).optional(),
	direction: enumType(["incoming", "outgoing"]).optional(),
	search: stringType().max(120).optional()
}).parse(d ?? {})).handler(createSsrRpc("367b741473b8833b2179fc4636a1127e0268e1252e4a154bdae4326b08a2aea5"));
var listMembers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("7e0e94fc0c8fa7ea2f14dc320c2fb1796c3dc268a653f535a12f48e30638bd06"));
var inviteMember = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().email(),
	role: enumType(["admin", "member"]).default("admin")
}).parse(d)).handler(createSsrRpc("000016eb158e84175a07563775199964f81fbaba97172a60637aef197d2fac8c"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("9da949b239a7c3f9d46c31385becfc5fd394cb5d4dc332fd9bbdf777a455597c"));
//#endregion
export { listApiKeys as a, listWebhooks as c, inviteMember as i, revokeApiKey as l, createWebhook as n, listEmailLogs as o, deleteWebhook as r, listMembers as s, createApiKey as t };
