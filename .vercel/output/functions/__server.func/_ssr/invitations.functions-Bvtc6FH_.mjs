import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { r as requireOrgContext, t as assertAdmin } from "./orgContext.server-DcnSceZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invitations.functions-Bvtc6FH_.js
function randomToken() {
	const bytes = /* @__PURE__ */ new Uint8Array(24);
	crypto.getRandomValues(bytes);
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var listInvitesForEmployee_createServerFn_handler = createServerRpc({
	id: "e27dfc909f46fb2a31eec4fbb2ae12e704b25ee83a989918bf38f7c1b117d8fa",
	name: "listInvitesForEmployee",
	filename: "src/lib/invitations.functions.ts"
}, (opts) => listInvitesForEmployee.__executeServer(opts));
var listInvitesForEmployee = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ employeeId: stringType().uuid().or(stringType()) }).parse(d)).handler(listInvitesForEmployee_createServerFn_handler, async ({ data, context }) => {
	return [{
		id: "mock-invite-1",
		token: "mocktoken123",
		sent_at: (/* @__PURE__ */ new Date()).toISOString(),
		sent_via: "email",
		opened_at: (/* @__PURE__ */ new Date()).toISOString(),
		accepted_at: null,
		revoked_at: null,
		expires_at: new Date(Date.now() + 168 * 3600 * 1e3).toISOString()
	}];
});
var createInvite_createServerFn_handler = createServerRpc({
	id: "e669b038ad0805514a2adf5d25fc43ae8c17ba6712fb539aee2509f7e30ac854",
	name: "createInvite",
	filename: "src/lib/invitations.functions.ts"
}, (opts) => createInvite.__executeServer(opts));
var createInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	employeeId: stringType().uuid(),
	sentVia: enumType([
		"link",
		"email",
		"whatsapp",
		"qr"
	]).default("link")
}).parse(d)).handler(createInvite_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { data: emp } = await context.supabase.from("employees").select("id").eq("id", data.employeeId).eq("organization_id", ctx.organizationId).is("deleted_at", null).maybeSingle();
	if (!emp) throw new Error("Employee not found");
	const token = randomToken();
	const { data: inv, error } = await context.supabase.from("employee_invitations").insert({
		organization_id: ctx.organizationId,
		employee_id: data.employeeId,
		token,
		sent_via: data.sentVia,
		created_by: context.userId
	}).select("id, token, expires_at").single();
	if (error || !inv) throw error ?? /* @__PURE__ */ new Error("Failed to create invite");
	await context.supabase.from("employees").update({
		status: "invited",
		invited_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.employeeId).eq("organization_id", ctx.organizationId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("activity_logs").insert({
		organization_id: ctx.organizationId,
		actor_user_id: context.userId,
		action: "invitation.created",
		target_type: "employee",
		target_id: data.employeeId,
		meta: { sent_via: data.sentVia }
	});
	return inv;
});
var revokeInvite_createServerFn_handler = createServerRpc({
	id: "505a8804d7a40b7c9a50e103dbd5ab3ac3d4c604cba803e56c6b91bb07a656b8",
	name: "revokeInvite",
	filename: "src/lib/invitations.functions.ts"
}, (opts) => revokeInvite.__executeServer(opts));
var revokeInvite = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(revokeInvite_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("employee_invitations").update({ revoked_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
async function loadInviteByToken(token) {
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data, error } = await supabaseAdmin.from("employee_invitations").select("id, organization_id, employee_id, opened_at, accepted_at, revoked_at, expires_at").eq("token", token).maybeSingle();
	if (error) throw error;
	return data;
}
var getInviteByToken_createServerFn_handler = createServerRpc({
	id: "101bff38e2c7723c57dd6b0693e19b1fe2c7aceb0fe40fb46d525f77f8d58e10",
	name: "getInviteByToken",
	filename: "src/lib/invitations.functions.ts"
}, (opts) => getInviteByToken.__executeServer(opts));
var getInviteByToken = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ token: stringType().min(10) }).parse(d)).handler(getInviteByToken_createServerFn_handler, async ({ data }) => {
	const inv = await loadInviteByToken(data.token);
	if (!inv) return {
		ok: false,
		reason: "not_found"
	};
	if (inv.revoked_at) return {
		ok: false,
		reason: "revoked"
	};
	if (new Date(inv.expires_at) < /* @__PURE__ */ new Date()) return {
		ok: false,
		reason: "expired"
	};
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	if (!inv.opened_at) {
		await supabaseAdmin.from("employee_invitations").update({ opened_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", inv.id);
		await supabaseAdmin.from("employees").update({ status: "opened" }).eq("id", inv.employee_id).in("status", [
			"invited",
			"pending",
			"pending_auth"
		]);
	}
	const [{ data: emp }, { data: org }, { data: gmail }] = await Promise.all([
		supabaseAdmin.from("employees").select("id, full_name, professional_email, job_title, department, status").eq("id", inv.employee_id).maybeSingle(),
		supabaseAdmin.from("organizations").select("id, name, logo_url").eq("id", inv.organization_id).maybeSingle(),
		supabaseAdmin.from("gmail_connections").select("google_email, connected_at, health_status, revoked_at").eq("employee_id", inv.employee_id).is("revoked_at", null).maybeSingle()
	]);
	return {
		ok: true,
		invite: {
			id: inv.id,
			expiresAt: inv.expires_at,
			acceptedAt: inv.accepted_at
		},
		employee: emp,
		organization: org,
		gmail
	};
});
var startGmailByInvite_createServerFn_handler = createServerRpc({
	id: "9f1658659ad1637558292bb46b38b84b77731e76dc2e053d2ae3cbce8c0fc115",
	name: "startGmailByInvite",
	filename: "src/lib/invitations.functions.ts"
}, (opts) => startGmailByInvite.__executeServer(opts));
var startGmailByInvite = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	token: stringType().min(10),
	redirectOrigin: stringType().url()
}).parse(d)).handler(startGmailByInvite_createServerFn_handler, async ({ data }) => {
	const inv = await loadInviteByToken(data.token);
	if (!inv || inv.revoked_at || new Date(inv.expires_at) < /* @__PURE__ */ new Date()) throw new Error("Invite is no longer valid");
	const { buildGoogleAuthUrl } = await import("./googleOAuth.server-nkhxNtYg.mjs");
	const nonce = crypto.randomUUID();
	const jsonStr = JSON.stringify({
		token: data.token,
		nonce
	});
	const state = btoa(jsonStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	return { authorizationUrl: await buildGoogleAuthUrl(`${data.redirectOrigin}/api/auth/google/callback`, state) };
});
//#endregion
export { createInvite_createServerFn_handler, getInviteByToken_createServerFn_handler, listInvitesForEmployee_createServerFn_handler, revokeInvite_createServerFn_handler, startGmailByInvite_createServerFn_handler };
