import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext, t as assertAdmin } from "./orgContext.server-9xtCj_ME.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ses.functions-D4ZaEsVJ.js
var getSesCredentials_createServerFn_handler = createServerRpc({
	id: "e0907f54966813769c3885888a57d82b3f55907c030f07a0113e5b4cf32a614b",
	name: "getSesCredentials",
	filename: "src/lib/ses.functions.ts"
}, (opts) => getSesCredentials.__executeServer(opts));
var getSesCredentials = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getSesCredentials_createServerFn_handler, async ({ context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { data, error } = await context.supabase.from("ses_credentials").select("id, region, configuration_set, daily_quota, send_rate, created_at, updated_at").eq("organization_id", ctx.organizationId).maybeSingle();
	if (error) throw error;
	return data;
});
var saveSesCredentials_createServerFn_handler = createServerRpc({
	id: "35b0ea8fdf9ef9aabee4627f8037c4e6e060a3b1fa04de6a6286ce82f509ec60",
	name: "saveSesCredentials",
	filename: "src/lib/ses.functions.ts"
}, (opts) => saveSesCredentials.__executeServer(opts));
var saveSesCredentials = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	accessKeyId: stringType().min(16),
	secretAccessKey: stringType().min(32),
	region: stringType().default("us-east-1"),
	configurationSet: stringType().optional()
}).parse(d)).handler(saveSesCredentials_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { encryptConnectionKey } = await import("./connectionKeyCrypto-SELLRwlC.mjs");
	const akCipher = encryptConnectionKey(data.accessKeyId);
	const skCipher = encryptConnectionKey(data.secretAccessKey);
	const { SESClient, GetSendQuotaCommand } = await import("../_libs/@aws-sdk/client-ses+[...].mjs").then((n) => n.t);
	const client = new SESClient({
		region: data.region,
		credentials: {
			accessKeyId: data.accessKeyId,
			secretAccessKey: data.secretAccessKey
		}
	});
	let dailyQuota = null;
	let sendRate = null;
	try {
		const quota = await client.send(new GetSendQuotaCommand({}));
		dailyQuota = quota.Max24HourSend ? Math.floor(quota.Max24HourSend) : null;
		sendRate = quota.MaxSendRate ? Math.floor(quota.MaxSendRate) : null;
	} catch (e) {
		throw new Error(`Invalid AWS Credentials: ${e.message}`);
	}
	const { data: existing } = await context.supabase.from("ses_credentials").select("id").eq("organization_id", ctx.organizationId).maybeSingle();
	if (existing) {
		const { error } = await context.supabase.from("ses_credentials").update({
			access_key_id_ciphertext: akCipher,
			secret_access_key_ciphertext: skCipher,
			region: data.region,
			configuration_set: data.configurationSet,
			daily_quota: dailyQuota,
			send_rate: sendRate,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", existing.id);
		if (error) throw error;
	} else {
		const { error } = await context.supabase.from("ses_credentials").insert({
			organization_id: ctx.organizationId,
			access_key_id_ciphertext: akCipher,
			secret_access_key_ciphertext: skCipher,
			region: data.region,
			configuration_set: data.configurationSet,
			daily_quota: dailyQuota,
			send_rate: sendRate
		});
		if (error) throw error;
	}
	return { ok: true };
});
var removeSesCredentials_createServerFn_handler = createServerRpc({
	id: "5861b0950ac27f27814cbd2cc598abb1c94ff321faad86f278dbb358c7d9cd83",
	name: "removeSesCredentials",
	filename: "src/lib/ses.functions.ts"
}, (opts) => removeSesCredentials.__executeServer(opts));
var removeSesCredentials = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(removeSesCredentials_createServerFn_handler, async ({ context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("ses_credentials").delete().eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var listSesDomains_createServerFn_handler = createServerRpc({
	id: "fa8de34018d6494859bf538e20839492c58e93def27bb0ba074ca387a55cfbce",
	name: "listSesDomains",
	filename: "src/lib/ses.functions.ts"
}, (opts) => listSesDomains.__executeServer(opts));
var listSesDomains = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listSesDomains_createServerFn_handler, async ({ context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("ses_domains").select(`
        id, 
        region, 
        identity_status, 
        dkim_tokens, 
        verified_at,
        created_at,
        domains ( id, domain )
      `).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return data ?? [];
});
//#endregion
export { getSesCredentials_createServerFn_handler, listSesDomains_createServerFn_handler, removeSesCredentials_createServerFn_handler, saveSesCredentials_createServerFn_handler };
