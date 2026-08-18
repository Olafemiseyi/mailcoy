import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { i as resolveOrgContext, r as requireOrgContext, t as assertAdmin } from "./orgContext.server-DcnSceZD.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/platform.functions-BEIevL4r.js
function sha256(v) {
	return createHash("sha256").update(v).digest("hex");
}
function newApiKey() {
	const full = `lok_live_${randomBytes(24).toString("base64url")}`;
	return {
		full,
		prefix: full.slice(0, 16)
	};
}
function newWebhookSecret() {
	return `whsec_${randomBytes(24).toString("base64url")}`;
}
var listApiKeys_createServerFn_handler = createServerRpc({
	id: "06194406a64fc6ed394cbdc23d9441692daa59567cfa29043637a74b20ee5d69",
	name: "listApiKeys",
	filename: "src/lib/platform.functions.ts"
}, (opts) => listApiKeys.__executeServer(opts));
var listApiKeys = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listApiKeys_createServerFn_handler, async ({ context }) => {
	return [{
		id: "mock-key-1",
		prefix: "mcoy",
		created_at: (/* @__PURE__ */ new Date()).toISOString(),
		last_used_at: null
	}];
});
var createApiKey_createServerFn_handler = createServerRpc({
	id: "5ba82b01bc055bea2af5ae0c14fee37789c002d01d7889e45fc6564c55be638e",
	name: "createApiKey",
	filename: "src/lib/platform.functions.ts"
}, (opts) => createApiKey.__executeServer(opts));
var createApiKey = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	name: stringType().trim().min(1).max(80),
	scopes: arrayType(stringType().max(60)).max(20).default([])
}).parse(d)).handler(createApiKey_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { full, prefix } = newApiKey();
	const { data: row, error } = await context.supabase.from("api_keys").insert({
		organization_id: ctx.organizationId,
		name: data.name,
		prefix,
		hash: sha256(full),
		scopes: data.scopes,
		created_by: context.userId
	}).select("id, name, prefix, scopes, created_at").single();
	if (error) throw error;
	return {
		...row,
		key: full
	};
});
var revokeApiKey_createServerFn_handler = createServerRpc({
	id: "76c861b7650ebdedb96416b7f46c176d5310f64decf720c43a68bfa639260c3a",
	name: "revokeApiKey",
	filename: "src/lib/platform.functions.ts"
}, (opts) => revokeApiKey.__executeServer(opts));
var revokeApiKey = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(revokeApiKey_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("api_keys").update({ revoked_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var listWebhooks_createServerFn_handler = createServerRpc({
	id: "e42fc51f4ccfa7732180ee388953f4c867cfea9de1bef01f8b9ea3058126bc63",
	name: "listWebhooks",
	filename: "src/lib/platform.functions.ts"
}, (opts) => listWebhooks.__executeServer(opts));
var listWebhooks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listWebhooks_createServerFn_handler, async ({ context }) => {
	return [];
});
var createWebhook_createServerFn_handler = createServerRpc({
	id: "4e16e44698178a63ec93205dfe3e83cce0da8eaaa1c2ec1881558288e5b1c183",
	name: "createWebhook",
	filename: "src/lib/platform.functions.ts"
}, (opts) => createWebhook.__executeServer(opts));
var createWebhook = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	url: stringType().url().max(2048),
	events: arrayType(stringType().max(60)).min(1).max(30)
}).parse(d)).handler(createWebhook_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const secret = newWebhookSecret();
	const { data: row, error } = await context.supabase.from("webhooks").insert({
		organization_id: ctx.organizationId,
		url: data.url,
		events: data.events,
		secret_hash: sha256(secret)
	}).select("id, url, events, active, created_at").single();
	if (error) throw error;
	return {
		...row,
		secret
	};
});
var deleteWebhook_createServerFn_handler = createServerRpc({
	id: "963f8ce92cd96599f42bb3262683a09f6f42e6cb8a7ff9b4b2af1820ef028ce2",
	name: "deleteWebhook",
	filename: "src/lib/platform.functions.ts"
}, (opts) => deleteWebhook.__executeServer(opts));
var deleteWebhook = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteWebhook_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { error } = await context.supabase.from("webhooks").delete().eq("id", data.id).eq("organization_id", ctx.organizationId);
	if (error) throw error;
	return { ok: true };
});
var listEmailLogs_createServerFn_handler = createServerRpc({
	id: "367b741473b8833b2179fc4636a1127e0268e1252e4a154bdae4326b08a2aea5",
	name: "listEmailLogs",
	filename: "src/lib/platform.functions.ts"
}, (opts) => listEmailLogs.__executeServer(opts));
var listEmailLogs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	limit: numberType().int().min(1).max(200).default(50),
	offset: numberType().int().min(0).max(1e4).default(0),
	status: stringType().max(30).optional(),
	direction: enumType(["incoming", "outgoing"]).optional(),
	search: stringType().max(120).optional()
}).parse(d ?? {})).handler(listEmailLogs_createServerFn_handler, async ({ data, context }) => {
	const ctx = await resolveOrgContext(context.supabase, context.userId);
	if (!ctx) return {
		rows: [],
		total: 0
	};
	let q = context.supabase.from("email_logs").select("id, sender, receiver, subject, snippet, direction, status, timestamp", { count: "exact" }).eq("organization_id", ctx.organizationId).order("timestamp", { ascending: false }).range(data.offset, data.offset + data.limit - 1);
	if (data.status) q = q.eq("status", data.status);
	if (data.direction) q = q.eq("direction", data.direction);
	if (data.search) q = q.or(`subject.ilike.%${data.search}%,sender.ilike.%${data.search}%,receiver.ilike.%${data.search}%`);
	const { data: rows, error, count } = await q;
	if (error) throw error;
	return {
		rows: rows ?? [],
		total: count ?? 0
	};
});
var listMembers_createServerFn_handler = createServerRpc({
	id: "7e0e94fc0c8fa7ea2f14dc320c2fb1796c3dc268a653f535a12f48e30638bd06",
	name: "listMembers",
	filename: "src/lib/platform.functions.ts"
}, (opts) => listMembers.__executeServer(opts));
var listMembers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listMembers_createServerFn_handler, async ({ context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: members, error } = await supabaseAdmin.from("organization_members").select("*").eq("organization_id", ctx.organizationId);
	if (error) throw error;
	if (!members || members.length === 0) return [];
	const userIds = members.map((m) => m.user_id);
	const [{ data: profiles }, { data: authUsers }] = await Promise.all([supabaseAdmin.from("profiles").select("id, full_name").in("id", userIds), supabaseAdmin.auth.admin.listUsers()]);
	const profileMap = /* @__PURE__ */ new Map();
	(authUsers?.users || []).forEach((u) => {
		profileMap.set(u.id, {
			email: u.email,
			full_name: u.user_metadata?.name || u.user_metadata?.full_name || null
		});
	});
	(profiles || []).forEach((p) => {
		const prev = profileMap.get(p.id) || {};
		profileMap.set(p.id, {
			...prev,
			full_name: p.full_name || prev.full_name
		});
	});
	return members.map((m) => {
		const p = profileMap.get(m.user_id);
		return {
			user_id: m.user_id,
			role: m.role,
			created_at: m.created_at,
			full_name: p?.full_name || null,
			email: p?.email || null,
			is_current_user: m.user_id === context.userId
		};
	});
});
var inviteMember_createServerFn_handler = createServerRpc({
	id: "000016eb158e84175a07563775199964f81fbaba97172a60637aef197d2fac8c",
	name: "inviteMember",
	filename: "src/lib/platform.functions.ts"
}, (opts) => inviteMember.__executeServer(opts));
var inviteMember = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().email(),
	role: enumType(["admin", "member"]).default("admin")
}).parse(d)).handler(inviteMember_createServerFn_handler, async ({ data, context }) => {
	const ctx = await requireOrgContext(context.supabase, context.userId);
	assertAdmin(ctx.role);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
	const user = authUsers?.users?.find((u) => u.email?.toLowerCase() === data.email.toLowerCase().trim());
	if (user) {
		const { error: insertErr } = await supabaseAdmin.from("organization_members").upsert({
			organization_id: ctx.organizationId,
			user_id: user.id,
			role: data.role
		}, { onConflict: "organization_id,user_id" });
		if (insertErr) throw insertErr;
		return {
			status: "added",
			message: `${data.email} was added as ${data.role}!`
		};
	}
	return {
		status: "invite_ready",
		inviteUrl: `${process.env.APP_URL || "http://localhost:5173"}/auth/signup?invite=${encodeURIComponent(ctx.organizationId)}`,
		message: `Invitation generated for ${data.email}. Share this signup link with them.`
	};
});
var getPlatformOverview_createServerFn_handler = createServerRpc({
	id: "9da949b239a7c3f9d46c31385becfc5fd394cb5d4dc332fd9bbdf777a455597c",
	name: "getPlatformOverview",
	filename: "src/lib/platform.functions.ts"
}, (opts) => getPlatformOverview.__executeServer(opts));
var getPlatformOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getPlatformOverview_createServerFn_handler, async ({ context }) => {
	const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "platform_admin"
	});
	if (roleError) throw roleError;
	if (!allowed) throw new Error("FORBIDDEN");
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const [orgs, users, domains, verifiedDomains, employees, emailLogs, activeSubs, recentOrgs, recentEvents, recentAudits] = await Promise.all([
		supabaseAdmin.from("organizations").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null),
		supabaseAdmin.from("profiles").select("*", {
			count: "exact",
			head: true
		}),
		supabaseAdmin.from("domains").select("*", {
			count: "exact",
			head: true
		}),
		supabaseAdmin.from("domains").select("*", {
			count: "exact",
			head: true
		}).eq("verification_status", "verified"),
		supabaseAdmin.from("employees").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null),
		supabaseAdmin.from("email_logs").select("*", {
			count: "exact",
			head: true
		}),
		supabaseAdmin.from("subscriptions").select("*", {
			count: "exact",
			head: true
		}).eq("status", "active"),
		supabaseAdmin.from("organizations").select("id, name, slug, industry, country, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(8),
		supabaseAdmin.from("billing_events").select("id, provider, event_type, reference, status, created_at").order("created_at", { ascending: false }).limit(8),
		supabaseAdmin.from("audit_logs").select("id, actor_user_id, action, meta, at").order("at", { ascending: false }).limit(8)
	]);
	for (const res of [
		orgs,
		domains,
		verifiedDomains,
		employees,
		activeSubs,
		recentOrgs,
		recentEvents,
		recentAudits
	]) if (res.error) throw res.error;
	return {
		stats: {
			organizations: orgs.count ?? 0,
			users: users.count ?? 0,
			domains: domains.count ?? 0,
			verifiedDomains: verifiedDomains.count ?? 0,
			employees: employees.count ?? 0,
			emailLogs: emailLogs.count ?? 0,
			activeSubscriptions: activeSubs.count ?? 0
		},
		organizations: recentOrgs.data ?? [],
		billingEvents: recentEvents.data ?? [],
		auditLogs: recentAudits.data ?? []
	};
});
//#endregion
export { createApiKey_createServerFn_handler, createWebhook_createServerFn_handler, deleteWebhook_createServerFn_handler, getPlatformOverview_createServerFn_handler, inviteMember_createServerFn_handler, listApiKeys_createServerFn_handler, listEmailLogs_createServerFn_handler, listMembers_createServerFn_handler, listWebhooks_createServerFn_handler, revokeApiKey_createServerFn_handler };
