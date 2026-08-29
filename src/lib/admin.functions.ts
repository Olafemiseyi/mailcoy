// Platform super-admin server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertPlatformAdmin(supabase: any, userId: string): Promise<void> {
  const { data, error } = await supabase.rpc("is_platform_admin", { _user_id: userId });
  if (error) throw error as Error;
  if (!data) throw new Error("You do not have platform admin access.");
}

/** Cheap check the /admin gate uses before rendering. */
export const getPlatformAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("is_platform_admin", { _user_id: context.userId });
    if (error) throw error;
    return { isPlatformAdmin: Boolean(data) };
  });

function startOfWeek(now = new Date()) { const d = new Date(now); d.setHours(0,0,0,0); d.setDate(d.getDate() - d.getDay()); return d.toISOString(); }
function startOfMonth(now = new Date()) { const d = new Date(now.getFullYear(), now.getMonth(), 1); return d.toISOString(); }
function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString(); }

/** Full metrics for the super-admin dashboard. */
export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const weekStart = startOfWeek();
    const monthStart = startOfMonth();
    const last30 = daysAgo(30);
    const startOfToday = new Date(new Date().setHours(0,0,0,0)).toISOString();

    const [
      orgs, orgsWeek, orgsMonth,
      users, usersWeek,
      employees, employeesActive,
      gmailConnected, gmailRevoked,
      subsActive, subsCancelled, subsPastDue, subsTrialing,
      emailsToday, emailsBounced,
      domainsFailing,
      recentActivity, recentBilling,
    ] = await Promise.all([
      supabaseAdmin.from("organizations").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("organizations").select("*", { count: "exact", head: true }).is("deleted_at", null).gte("created_at", weekStart),
      supabaseAdmin.from("organizations").select("*", { count: "exact", head: true }).is("deleted_at", null).gte("created_at", monthStart),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekStart),
      supabaseAdmin.from("employees").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("employees").select("*", { count: "exact", head: true }).is("deleted_at", null).eq("status", "active"),
      supabaseAdmin.from("gmail_connections").select("*", { count: "exact", head: true }).is("revoked_at", null),
      supabaseAdmin.from("gmail_connections").select("*", { count: "exact", head: true }).not("revoked_at", "is", null),
      supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "canceled"),
      supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "past_due"),
      supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "trialing"),
      supabaseAdmin.from("email_logs").select("*", { count: "exact", head: true }).gte("timestamp", startOfToday),
      supabaseAdmin.from("email_logs").select("*", { count: "exact", head: true }).eq("status", "bounced").gte("timestamp", daysAgo(7)),
      supabaseAdmin.from("domains").select("*", { count: "exact", head: true }).eq("verification_status", "failed"),
      supabaseAdmin.from("activity_logs").select("id, action, target_type, target_id, meta, at, organization_id").order("at", { ascending: false }).limit(20),
      supabaseAdmin.from("billing_events").select("id, provider, event_type, reference, payload, status, created_at, organization_id").order("created_at", { ascending: false }).limit(10),
    ]);

    // Revenue: sum amount_kobo from active subscriptions, and from successful billing_events payload.amount
    const { data: activeSubs } = await supabaseAdmin
      .from("subscriptions").select("plan_code, amount_kobo, status").eq("status", "active");
    const mrrKobo = (activeSubs ?? []).reduce((acc: number, s) => acc + (s.amount_kobo ?? 0), 0);

    // Total revenue collected: iterate successful billing_events, pull amount from payload
    const { data: successEvents } = await supabaseAdmin
      .from("billing_events").select("payload, created_at").eq("status", "success");
    let totalKobo = 0;
    let kobo30d = 0;
    const cutoff30 = new Date(last30).getTime();
    for (const ev of successEvents ?? []) {
      const p = ev.payload as { amount?: number; data?: { amount?: number } } | null;
      const amt = p?.amount ?? p?.data?.amount ?? 0;
      totalKobo += amt;
      if (new Date(ev.created_at).getTime() >= cutoff30) kobo30d += amt;
    }

    // Subscriptions by plan
    const { data: allSubs } = await supabaseAdmin
      .from("subscriptions").select("plan_code, status");
    const byPlanMap: Record<string, { active: number; canceled: number; trialing: number; past_due: number }> = {};
    for (const r of allSubs ?? []) {
      const k = r.plan_code ?? "unknown";
      if (!byPlanMap[k]) byPlanMap[k] = { active: 0, canceled: 0, trialing: 0, past_due: 0 };
      const s = r.status as string;
      if (s in byPlanMap[k]) (byPlanMap[k] as Record<string, number>)[s]++;
    }
    const subscriptionsByPlan = Object.entries(byPlanMap).map(([plan, counts]) => ({ plan, ...counts }));

    return {
      revenue: { totalKobo, kobo30d, mrrKobo, currency: "NGN" as const },
      growth: {
        organizations: { total: orgs.count ?? 0, week: orgsWeek.count ?? 0, month: orgsMonth.count ?? 0 },
        users: { total: users.count ?? 0, week: usersWeek.count ?? 0 },
        employees: { total: employees.count ?? 0, active: employeesActive.count ?? 0 },
        gmail: { connected: gmailConnected.count ?? 0, revoked: gmailRevoked.count ?? 0 },
      },
      subscriptions: {
        active: subsActive.count ?? 0,
        cancelled: subsCancelled.count ?? 0,
        pastDue: subsPastDue.count ?? 0,
        trialing: subsTrialing.count ?? 0,
        byPlan: subscriptionsByPlan,
      },
      health: {
        emailsToday: emailsToday.count ?? 0,
        bouncedThisWeek: emailsBounced.count ?? 0,
        gmailRevoked: gmailRevoked.count ?? 0,
        domainsFailing: domainsFailing.count ?? 0,
      },
      recentActivity: recentActivity.data ?? [],
      recentBilling: recentBilling.data ?? [],
    };
  });

export const listAllOrganizations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    search: z.string().max(120).optional(),
    plan: z.string().optional(),
    limit: z.number().int().min(1).max(200).default(50),
    offset: z.number().int().min(0).max(10_000).default(0),
  }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("organizations")
      .select(`
        id, name, slug, industry, country, primary_domain, created_at,
        domains ( id, verification_status ),
        employees ( id ),
        subscriptions ( plan_code, status )
      `, { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
      
    if (data.search) {
      q = q.ilike("name", `%${data.search}%`);
    }
    
    // In PostgREST, filtering by a related table can be tricky if we don't have inner joins setup.
    // Since we fetch 50 rows, we will just fetch them and map them. If we need strict filtering,
    // we would do it via a custom RPC. For this MVP, if plan is passed, we might fetch more and filter in-memory.
    // However, to keep it simple and accurate with pagination, we'll fetch up to 1000 if plan is provided, 
    // filter in memory, and then slice. This is an admin panel so it's acceptable for now.
    if (data.plan) {
      q = q.range(0, 999);
    } else {
      q = q.range(data.offset, data.offset + data.limit - 1);
    }

    const { data: rows, count, error } = await q;
    if (error) throw error;
    
    let processedRows = (rows ?? []).map((r: any) => {
      const activeSub = r.subscriptions?.find((s: any) => s.status === 'active' || s.status === 'trialing' || s.status === 'past_due');
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
        plan_status: activeSub?.status || null,
      };
    });

    let finalCount = count ?? 0;
    
    if (data.plan) {
      if (data.plan === "trialing" || data.plan === "past_due") {
        processedRows = processedRows.filter(r => r.plan_status === data.plan);
      } else if (data.plan === "free") {
        processedRows = processedRows.filter(r => !r.plan_code);
      } else {
        processedRows = processedRows.filter(r => r.plan_code === data.plan);
      }
      finalCount = processedRows.length;
      processedRows = processedRows.slice(data.offset, data.offset + data.limit);
    }

    return { rows: processedRows, total: finalCount };
  });

/**
 * Super Admin: Search global email logs across all tenants
 */
export const searchGlobalEmailLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      query: z.string().optional(),
      limit: z.number().default(50),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let q = supabaseAdmin
      .from("email_logs")
      .select("id, organization_id, direction, from_addr, to_addr, subject, status, provider, timestamp, snippet")
      .order("timestamp", { ascending: false })
      .limit(data.limit);

    if (data.query) {
      const term = `%${data.query.trim()}%`;
      q = q.or(`from_addr.ilike.${term},to_addr.ilike.${term},subject.ilike.${term}`);
    }

    const { data: logs, error } = await q;
    if (error) throw error;
    return logs ?? [];
  });

/**
 * Super Admin: Override organization subscription plan (e.g. grant VIP / Lifetime Free)
 */
export const overrideOrgPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      organizationId: z.string().uuid(),
      planCode: z.enum(["free", "starter", "growth", "scale", "custom", "enterprise", "pro"]),
      status: z.enum(["active", "trialing", "canceled"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("subscriptions")
      .select("organization_id")
      .eq("organization_id", data.organizationId)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("subscriptions")
        .update({
          plan_code: data.planCode,
          status: data.status,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("organization_id", data.organizationId);
    } else {
      await supabaseAdmin
        .from("subscriptions")
        .insert({
          organization_id: data.organizationId,
          plan: data.planCode,
          plan_code: data.planCode,
          status: data.status,
          amount_kobo: 0,
        } as never);
    }

    return { ok: true };
  });

/**
 * Super Admin: Broadcast announcement banner across platform
 */
export const getPlatformBroadcast = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("activity_logs")
      .select("meta")
      .eq("action", "platform.broadcast")
      .order("at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return (data?.meta as { message?: string; enabled?: boolean; level?: "info" | "warning" }) ?? null;
  });

export const setPlatformBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      message: z.string(),
      enabled: z.boolean(),
      level: z.enum(["info", "warning"]).default("info"),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("activity_logs").insert({
      organization_id: "00000000-0000-0000-0000-000000000000",
      actor_user_id: context.userId,
      action: "platform.broadcast",
      target_type: "system",
      meta: data,
    } as never);

    return { ok: true };
  });

