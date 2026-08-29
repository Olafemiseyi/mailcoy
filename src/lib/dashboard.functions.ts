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
  recentLogs: [] as Array<{
    id: string;
    sender: string;
    receiver: string;
    subject: string;
    status: string;
    timestamp: string;
  }>,
};

export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) return EMPTY_DASHBOARD;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const org = ctx.organizationId;
    const s = supabaseAdmin;
    const since24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

    const [
      { count: domainsTotal },
      { count: domainsVerified },
      { count: employeesTotal },
      { count: employeesConnected },
      { count: sentToday },
      { count: receivedToday },
      { count: bouncedTodayCount },
      { data: recentLogsData },
    ] = await Promise.all([
      s.from("domains").select("*", { count: "exact", head: true }).eq("organization_id", org),
      s
        .from("domains")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", org)
        .eq("verification_status", "verified"),
      s.from("employees").select("*", { count: "exact", head: true }).eq("organization_id", org),
      s
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", org)
        .eq("status", "active"),
      s
        .from("outgoing_messages")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", org)
        .gte("sent_at", since24h),
      s
        .from("incoming_messages")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", org)
        .gte("received_at", since24h),
      s
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", org)
        .eq("status", "bounced")
        .gte("timestamp", since24h),
      s
        .from("email_logs")
        .select("id, sender, receiver, subject, status, timestamp")
        .eq("organization_id", org)
        .order("timestamp", { ascending: false })
        .limit(6),
    ]);

    const recentLogs = (recentLogsData || []).map((m: any) => ({
      id: m.id,
      sender: m.sender,
      receiver: m.receiver,
      subject: m.subject || "No Subject",
      status: m.status || "delivered",
      timestamp: m.timestamp,
    }));

    const totalSent = sentToday || 0;
    const bounced = bouncedTodayCount || 0;
    const deliverabilityPct =
      totalSent > 0 ? Math.max(0, Math.round(((totalSent - bounced) / totalSent) * 100)) : 100;

    return {
      hasOrganization: true,
      domainsTotal: domainsTotal || 0,
      domainsVerified: domainsVerified || 0,
      employeesTotal: employeesTotal || 0,
      employeesConnected: employeesConnected || 0,
      sentToday: totalSent,
      receivedToday: receivedToday || 0,
      bouncedToday: bounced,
      deliverabilityPct,
      recentLogs,
    };
  });
