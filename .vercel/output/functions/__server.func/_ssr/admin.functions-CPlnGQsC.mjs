import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { a as objectType, i as numberType, n as booleanType, r as enumType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-CPlnGQsC.js
async function assertPlatformAdmin(supabase, userId) {
	const { data, error } = await supabase.rpc("is_platform_admin", { _user_id: userId });
	if (error) throw error;
	if (!data) throw new Error("You do not have platform admin access.");
}
/** Cheap check the /admin gate uses before rendering. */
var getPlatformAdminStatus_createServerFn_handler = createServerRpc({
	id: "e0203d28c81cc53cc6fe760e20d359efc79bdffbb8e299f79520fe44b45ed3f9",
	name: "getPlatformAdminStatus",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getPlatformAdminStatus.__executeServer(opts));
var getPlatformAdminStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getPlatformAdminStatus_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.rpc("is_platform_admin", { _user_id: context.userId });
	if (error) throw error;
	return { isPlatformAdmin: Boolean(data) };
});
function startOfWeek(now = /* @__PURE__ */ new Date()) {
	const d = new Date(now);
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() - d.getDay());
	return d.toISOString();
}
function startOfMonth(now = /* @__PURE__ */ new Date()) {
	return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}
function daysAgo(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - n);
	return d.toISOString();
}
/** Full metrics for the super-admin dashboard. */
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "98193c088815d6bbdd4155ffbad4b125116e51df7ef81d3d6aef43156e028e01",
	name: "getAdminOverview",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const weekStart = startOfWeek();
	const monthStart = startOfMonth();
	const last30 = daysAgo(30);
	const startOfToday = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).toISOString();
	const [orgs, orgsWeek, orgsMonth, users, usersWeek, employees, employeesActive, gmailConnected, gmailRevoked, subsActive, subsCancelled, subsPastDue, subsTrialing, emailsToday, emailsBounced, domainsFailing, recentActivity, recentBilling] = await Promise.all([
		supabaseAdmin.from("organizations").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null),
		supabaseAdmin.from("organizations").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null).gte("created_at", weekStart),
		supabaseAdmin.from("organizations").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null).gte("created_at", monthStart),
		supabaseAdmin.from("profiles").select("*", {
			count: "exact",
			head: true
		}),
		supabaseAdmin.from("profiles").select("*", {
			count: "exact",
			head: true
		}).gte("created_at", weekStart),
		supabaseAdmin.from("employees").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null),
		supabaseAdmin.from("employees").select("*", {
			count: "exact",
			head: true
		}).is("deleted_at", null).eq("status", "active"),
		supabaseAdmin.from("gmail_connections").select("*", {
			count: "exact",
			head: true
		}).is("revoked_at", null),
		supabaseAdmin.from("gmail_connections").select("*", {
			count: "exact",
			head: true
		}).not("revoked_at", "is", null),
		supabaseAdmin.from("subscriptions").select("*", {
			count: "exact",
			head: true
		}).eq("status", "active"),
		supabaseAdmin.from("subscriptions").select("*", {
			count: "exact",
			head: true
		}).eq("status", "canceled"),
		supabaseAdmin.from("subscriptions").select("*", {
			count: "exact",
			head: true
		}).eq("status", "past_due"),
		supabaseAdmin.from("subscriptions").select("*", {
			count: "exact",
			head: true
		}).eq("status", "trialing"),
		supabaseAdmin.from("email_logs").select("*", {
			count: "exact",
			head: true
		}).gte("timestamp", startOfToday),
		supabaseAdmin.from("email_logs").select("*", {
			count: "exact",
			head: true
		}).eq("status", "bounced").gte("timestamp", daysAgo(7)),
		supabaseAdmin.from("domains").select("*", {
			count: "exact",
			head: true
		}).eq("verification_status", "failed"),
		supabaseAdmin.from("activity_logs").select("id, action, target_type, target_id, meta, at, organization_id").order("at", { ascending: false }).limit(20),
		supabaseAdmin.from("billing_events").select("id, provider, event_type, reference, payload, status, created_at, organization_id").order("created_at", { ascending: false }).limit(10)
	]);
	const { data: activeSubs } = await supabaseAdmin.from("subscriptions").select("plan_code, amount_kobo, status").eq("status", "active");
	const mrrKobo = (activeSubs ?? []).reduce((acc, s) => acc + (s.amount_kobo ?? 0), 0);
	const { data: successEvents } = await supabaseAdmin.from("billing_events").select("payload, created_at").eq("status", "success");
	let totalKobo = 0;
	let kobo30d = 0;
	const cutoff30 = new Date(last30).getTime();
	for (const ev of successEvents ?? []) {
		const p = ev.payload;
		const amt = p?.amount ?? p?.data?.amount ?? 0;
		totalKobo += amt;
		if (new Date(ev.created_at).getTime() >= cutoff30) kobo30d += amt;
	}
	const { data: allSubs } = await supabaseAdmin.from("subscriptions").select("plan_code, status");
	const byPlanMap = {};
	for (const r of allSubs ?? []) {
		const k = r.plan_code ?? "unknown";
		if (!byPlanMap[k]) byPlanMap[k] = {
			active: 0,
			canceled: 0,
			trialing: 0,
			past_due: 0
		};
		const s = r.status;
		if (s in byPlanMap[k]) byPlanMap[k][s]++;
	}
	const subscriptionsByPlan = Object.entries(byPlanMap).map(([plan, counts]) => ({
		plan,
		...counts
	}));
	return {
		revenue: {
			totalKobo,
			kobo30d,
			mrrKobo,
			currency: "NGN"
		},
		growth: {
			organizations: {
				total: orgs.count ?? 0,
				week: orgsWeek.count ?? 0,
				month: orgsMonth.count ?? 0
			},
			users: {
				total: users.count ?? 0,
				week: usersWeek.count ?? 0
			},
			employees: {
				total: employees.count ?? 0,
				active: employeesActive.count ?? 0
			},
			gmail: {
				connected: gmailConnected.count ?? 0,
				revoked: gmailRevoked.count ?? 0
			}
		},
		subscriptions: {
			active: subsActive.count ?? 0,
			cancelled: subsCancelled.count ?? 0,
			pastDue: subsPastDue.count ?? 0,
			trialing: subsTrialing.count ?? 0,
			byPlan: subscriptionsByPlan
		},
		health: {
			emailsToday: emailsToday.count ?? 0,
			bouncedThisWeek: emailsBounced.count ?? 0,
			gmailRevoked: gmailRevoked.count ?? 0,
			domainsFailing: domainsFailing.count ?? 0
		},
		recentActivity: recentActivity.data ?? [],
		recentBilling: recentBilling.data ?? []
	};
});
var listAllOrganizations_createServerFn_handler = createServerRpc({
	id: "55fe9e1a26d2eb4bcbf86e3ae9024e03da049250ab428d296f6eb09c07390645",
	name: "listAllOrganizations",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listAllOrganizations.__executeServer(opts));
var listAllOrganizations = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	search: stringType().max(120).optional(),
	plan: stringType().optional(),
	limit: numberType().int().min(1).max(200).default(50),
	offset: numberType().int().min(0).max(1e4).default(0)
}).parse(d ?? {})).handler(listAllOrganizations_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	let q = supabaseAdmin.from("organizations").select(`
        id, name, slug, industry, country, primary_domain, created_at,
        domains ( id, verification_status ),
        employees ( id ),
        subscriptions ( plan_code, status )
      `, { count: "exact" }).is("deleted_at", null).order("created_at", { ascending: false });
	if (data.search) q = q.ilike("name", `%${data.search}%`);
	if (data.plan) q = q.range(0, 999);
	else q = q.range(data.offset, data.offset + data.limit - 1);
	const { data: rows, count, error } = await q;
	if (error) throw error;
	let processedRows = (rows ?? []).map((r) => {
		const activeSub = r.subscriptions?.find((s) => s.status === "active" || s.status === "trialing" || s.status === "past_due");
		return {
			id: r.id,
			name: r.name,
			slug: r.slug,
			industry: r.industry,
			country: r.country,
			primary_domain: r.primary_domain,
			created_at: r.created_at,
			domain_count: r.domains?.length || 0,
			domains: r.domains || [],
			employee_count: r.employees?.length || 0,
			plan_code: activeSub?.plan_code || null,
			plan_status: activeSub?.status || null
		};
	});
	let finalCount = count ?? 0;
	if (data.plan) {
		if (data.plan === "trialing" || data.plan === "past_due") processedRows = processedRows.filter((r) => r.plan_status === data.plan);
		else if (data.plan === "free") processedRows = processedRows.filter((r) => !r.plan_code);
		else processedRows = processedRows.filter((r) => r.plan_code === data.plan);
		finalCount = processedRows.length;
		processedRows = processedRows.slice(data.offset, data.offset + data.limit);
	}
	return {
		rows: processedRows,
		total: finalCount
	};
});
var searchGlobalEmailLogs_createServerFn_handler = createServerRpc({
	id: "f6ccae43e502bb5aaf107c9a56e7877206c22cd9b6f2f8989f56a679c620c439",
	name: "searchGlobalEmailLogs",
	filename: "src/lib/admin.functions.ts"
}, (opts) => searchGlobalEmailLogs.__executeServer(opts));
var searchGlobalEmailLogs = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	query: stringType().optional(),
	limit: numberType().default(50)
}).parse(d)).handler(searchGlobalEmailLogs_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	let q = supabaseAdmin.from("email_logs").select("id, organization_id, direction, from_addr, to_addr, subject, status, provider, timestamp, snippet").order("timestamp", { ascending: false }).limit(data.limit);
	if (data.query) {
		const term = `%${data.query.trim()}%`;
		q = q.or(`from_addr.ilike.${term},to_addr.ilike.${term},subject.ilike.${term}`);
	}
	const { data: logs, error } = await q;
	if (error) throw error;
	return logs ?? [];
});
var overrideOrgPlan_createServerFn_handler = createServerRpc({
	id: "0321c8762492dbe4827dc4f354ba564764c7aa1c09f4305e7c08bd831d2f7d85",
	name: "overrideOrgPlan",
	filename: "src/lib/admin.functions.ts"
}, (opts) => overrideOrgPlan.__executeServer(opts));
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
}).parse(d)).handler(overrideOrgPlan_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	const { data: existing } = await supabaseAdmin.from("subscriptions").select("organization_id").eq("organization_id", data.organizationId).maybeSingle();
	if (existing) await supabaseAdmin.from("subscriptions").update({
		plan_code: data.planCode,
		status: data.status,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("organization_id", data.organizationId);
	else await supabaseAdmin.from("subscriptions").insert({
		organization_id: data.organizationId,
		plan: data.planCode,
		plan_code: data.planCode,
		status: data.status,
		amount_kobo: 0
	});
	return { ok: true };
});
var getPlatformBroadcast_createServerFn_handler = createServerRpc({
	id: "c9cbf391dbfbc93932258b7b8646a136dde4959dc33f7366a263d7b521575dc4",
	name: "getPlatformBroadcast",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getPlatformBroadcast.__executeServer(opts));
var getPlatformBroadcast = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getPlatformBroadcast_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("activity_logs").select("meta").eq("action", "platform.broadcast").order("at", { ascending: false }).limit(1).maybeSingle();
	return data?.meta ?? null;
});
var setPlatformBroadcast_createServerFn_handler = createServerRpc({
	id: "3d6c779487f630322f4af3f836b6671a44a5d0718bb77c826bd5583ad6a34542",
	name: "setPlatformBroadcast",
	filename: "src/lib/admin.functions.ts"
}, (opts) => setPlatformBroadcast.__executeServer(opts));
var setPlatformBroadcast = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).validator((d) => objectType({
	message: stringType(),
	enabled: booleanType(),
	level: enumType(["info", "warning"]).default("info")
}).parse(d)).handler(setPlatformBroadcast_createServerFn_handler, async ({ data, context }) => {
	await assertPlatformAdmin(context.supabase, context.userId);
	const { supabaseAdmin } = await import("./client.server-Bw6iWMJ-.mjs");
	await supabaseAdmin.from("activity_logs").insert({
		organization_id: "00000000-0000-0000-0000-000000000000",
		actor_user_id: context.userId,
		action: "platform.broadcast",
		target_type: "system",
		meta: data
	});
	return { ok: true };
});
//#endregion
export { getAdminOverview_createServerFn_handler, getPlatformAdminStatus_createServerFn_handler, getPlatformBroadcast_createServerFn_handler, listAllOrganizations_createServerFn_handler, overrideOrgPlan_createServerFn_handler, searchGlobalEmailLogs_createServerFn_handler, setPlatformBroadcast_createServerFn_handler };
