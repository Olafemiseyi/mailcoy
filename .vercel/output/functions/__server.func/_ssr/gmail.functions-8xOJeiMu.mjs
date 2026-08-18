import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gmail.functions-8xOJeiMu.js
var CONNECTOR_ID = "google_mail";
var isGoogleMailConnectorConfigured_createServerFn_handler = createServerRpc({
	id: "7312e8661c9bb9217e9dd6507d0d9def3f7cad9701dcae3138a40e61474fa709",
	name: "isGoogleMailConnectorConfigured",
	filename: "src/lib/gmail.functions.ts"
}, (opts) => isGoogleMailConnectorConfigured.__executeServer(opts));
var isGoogleMailConnectorConfigured = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(isGoogleMailConnectorConfigured_createServerFn_handler, async () => ({ configured: Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET) }));
var disconnectGoogleMail_createServerFn_handler = createServerRpc({
	id: "27b9c6a2f9fcf67db8ccb022583e6dcb45e7c1e87183c701ca2ec4a46ecb41e6",
	name: "disconnectGoogleMail",
	filename: "src/lib/gmail.functions.ts"
}, (opts) => disconnectGoogleMail.__executeServer(opts));
var disconnectGoogleMail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(disconnectGoogleMail_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const { data: emp } = await context.supabase.from("employees").select("id, user_id").eq("id", data.employeeId).eq("organization_id", ctx.organizationId).maybeSingle();
	if (!emp) throw new Error("Employee not found");
	if (emp.user_id !== context.userId && ctx.role === "member") throw new Error("FORBIDDEN");
	const { deleteConnectionKeyForUser } = await import("./appUserConnections.server-BeN-oFLv.mjs");
	await deleteConnectionKeyForUser(emp.id, CONNECTOR_ID);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("gmail_connections").update({
		revoked_at: (/* @__PURE__ */ new Date()).toISOString(),
		health_status: "revoked"
	}).eq("employee_id", emp.id);
	await supabaseAdmin.from("employees").update({ status: "inactive" }).eq("id", emp.id);
	return { ok: true };
});
var pauseGmailConnection_createServerFn_handler = createServerRpc({
	id: "84394eee066f094a19916406f9bba4d3ecdeec066eb74b28fdf2dd0b5124374e",
	name: "pauseGmailConnection",
	filename: "src/lib/gmail.functions.ts"
}, (opts) => pauseGmailConnection.__executeServer(opts));
var pauseGmailConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(pauseGmailConnection_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const { data: emp } = await context.supabase.from("employees").select("id").eq("id", data.employeeId).eq("organization_id", ctx.organizationId).maybeSingle();
	if (!emp) throw new Error("Employee not found");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("gmail_connections").update({ health_status: "paused" }).eq("employee_id", emp.id).is("revoked_at", null);
	await supabaseAdmin.from("employees").update({ status: "suspended" }).eq("id", emp.id);
	await supabaseAdmin.from("activity_logs").insert({
		organization_id: ctx.organizationId,
		actor_user_id: context.userId,
		action: "gmail.paused",
		target_type: "employee",
		target_id: emp.id,
		meta: {}
	});
	return { ok: true };
});
var resumeGmailConnection_createServerFn_handler = createServerRpc({
	id: "791401ad0af8edcb2b4d7b0e19cd174b3519d8c932b10798135b90abd327c110",
	name: "resumeGmailConnection",
	filename: "src/lib/gmail.functions.ts"
}, (opts) => resumeGmailConnection.__executeServer(opts));
var resumeGmailConnection = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(resumeGmailConnection_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const { data: emp } = await context.supabase.from("employees").select("id").eq("id", data.employeeId).eq("organization_id", ctx.organizationId).maybeSingle();
	if (!emp) throw new Error("Employee not found");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("gmail_connections").update({ health_status: "healthy" }).eq("employee_id", emp.id).is("revoked_at", null);
	await supabaseAdmin.from("employees").update({ status: "connected" }).eq("id", emp.id);
	await supabaseAdmin.from("activity_logs").insert({
		organization_id: ctx.organizationId,
		actor_user_id: context.userId,
		action: "gmail.resumed",
		target_type: "employee",
		target_id: emp.id,
		meta: {}
	});
	return { ok: true };
});
var triggerSendAsSetup_createServerFn_handler = createServerRpc({
	id: "b5adde9c68bc1eb32a0f596ae0509784831264249f79139af4811e82f33aa6ae",
	name: "triggerSendAsSetup",
	filename: "src/lib/gmail.functions.ts"
}, (opts) => triggerSendAsSetup.__executeServer(opts));
var triggerSendAsSetup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((data) => objectType({ employeeId: stringType().uuid() }).parse(data)).handler(triggerSendAsSetup_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");
	const { data: emp } = await context.supabase.from("employees").select("professional_email, full_name").eq("id", data.employeeId).eq("organization_id", ctx.organizationId).maybeSingle();
	if (!emp?.professional_email) throw new Error("Employee has no professional email set.");
	const { getConnectionKeyForUser } = await import("./appUserConnections.server-BeN-oFLv.mjs");
	const refreshToken = await getConnectionKeyForUser(data.employeeId, "google_mail");
	if (!refreshToken) throw new Error("Employee has not connected Gmail yet.");
	const { addGmailSendAsAlias } = await import("./googleOAuth.server-nkhxNtYg.mjs");
	return {
		ok: true,
		result: await addGmailSendAsAlias({
			refreshToken,
			sendAsEmail: emp.professional_email,
			displayName: emp.full_name ?? emp.professional_email
		})
	};
});
//#endregion
export { disconnectGoogleMail_createServerFn_handler, isGoogleMailConnectorConfigured_createServerFn_handler, pauseGmailConnection_createServerFn_handler, resumeGmailConnection_createServerFn_handler, triggerSendAsSetup_createServerFn_handler };
