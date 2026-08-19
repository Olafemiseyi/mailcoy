// Dashboard aggregation.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveOrgContext } from "@/server/orgContext.server";

const EMPTY_DASHBOARD = {
  hasOrganization: false,
  domainsTotal: 0,
  domainsVerified: 0,
  employeesTotal: 0,
  employeesConnected: 0,
  sentToday: 0,
  receivedToday: 0,
  bouncedToday: 0,
  deliverabilityPct: 100,
  activity: [] as Array<{ id: string; action: string; at: string; meta: string | null }>,
  recentLogs: [] as Array<{ id: string; sender: string; receiver: string; subject: string; status: string; timestamp: string }>,
};



export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) return EMPTY_DASHBOARD;
    const org = ctx.organizationId;
    const s = context.supabase;
    const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

    const [
      { count: domainsTotal },
      { count: domainsVerified },
      { count: employeesTotal },
      { count: employeesConnected },
      { count: sentToday },
      { count: receivedToday },
      { data: recentOut }
    ] = await Promise.all([
      s.from("domains").select("*", { count: "exact", head: true }).eq("organization_id", org),
      s.from("domains").select("*", { count: "exact", head: true }).eq("organization_id", org).eq("verification_status", "verified"),
      s.from("employees").select("*", { count: "exact", head: true }).eq("organization_id", org),
      s.from("employees").select("*", { count: "exact", head: true }).eq("organization_id", org).eq("status", "active"),
      s.from("outgoing_messages").select("*", { count: "exact", head: true }).eq("organization_id", org).gte("sent_at", since24h),
      s.from("incoming_messages").select("*", { count: "exact", head: true }).eq("organization_id", org).gte("received_at", since24h),
      s.from("outgoing_messages").select("id, from_addr, to_addr, sent_at").eq("organization_id", org).order("sent_at", { ascending: false }).limit(5)
    ]);

    const recentLogs = (recentOut || []).map((m: any) => ({
      id: m.id,
      sender: m.from_addr,
      receiver: m.to_addr,
      subject: "No Subject",
      status: "delivered",
      timestamp: m.sent_at
    }));

    return {
      hasOrganization: true,
      domainsTotal: domainsTotal || 0,
      domainsVerified: domainsVerified || 0,
      employeesTotal: employeesTotal || 0,
      employeesConnected: employeesConnected || 0,
      sentToday: sentToday || 0,
      receivedToday: receivedToday || 0,
      bouncedToday: 0,
      deliverabilityPct: 100,
      recentLogs
    };
  });

