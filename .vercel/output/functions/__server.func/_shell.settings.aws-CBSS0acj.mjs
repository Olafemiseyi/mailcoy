import { c as createServerFn } from "./_ssr/createServerFn-BFFE07zL.mjs";
import { t as createSsrRpc } from "./_ssr/createSsrRpc-_y7YRLGO.mjs";
import { t as requireSupabaseAuth } from "./_ssr/auth-middleware-BwdutfJC.mjs";
import { a as objectType, s as stringType } from "./_libs/zod.mjs";
import { n as queryOptions } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings.aws-CBSS0acj.js
var getSesCredentials = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e0907f54966813769c3885888a57d82b3f55907c030f07a0113e5b4cf32a614b"));
var saveSesCredentials = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	accessKeyId: stringType().min(16),
	secretAccessKey: stringType().min(32),
	region: stringType().default("us-east-1"),
	configurationSet: stringType().optional()
}).parse(d)).handler(createSsrRpc("35b0ea8fdf9ef9aabee4627f8037c4e6e060a3b1fa04de6a6286ce82f509ec60"));
var removeSesCredentials = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5861b0950ac27f27814cbd2cc598abb1c94ff321faad86f278dbb358c7d9cd83"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("fa8de34018d6494859bf538e20839492c58e93def27bb0ba074ca387a55cfbce"));
var sesOpts = queryOptions({
	queryKey: ["ses_credentials"],
	queryFn: () => getSesCredentials()
});
//#endregion
export { saveSesCredentials as n, sesOpts as r, removeSesCredentials as t };
