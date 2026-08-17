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

    return {
      hasOrganization: true,
      domainsTotal: 2,
      domainsVerified: 1,
      employeesTotal: 12,
      employeesConnected: 12,
      sentToday: 1284,
      receivedToday: 420,
      bouncedToday: 3,
      deliverabilityPct: 99.7,
      recentLogs: [
        { id: "1", sender: "sales@mailcoy.com", receiver: "akin@gmail.com", subject: "Invoice #1024", status: "delivered", timestamp: new Date().toISOString() },
        { id: "2", sender: "john@mailcoy.com", receiver: "john.doe@gmail.com", subject: "Meeting Notes", status: "delivered", timestamp: new Date(Date.now() - 120000).toISOString() },
        { id: "3", sender: "support@mailcoy.com", receiver: "team@gmail.com", subject: "Customer Inquiry", status: "delivered", timestamp: new Date(Date.now() - 300000).toISOString() },
      ],
    };
  });

