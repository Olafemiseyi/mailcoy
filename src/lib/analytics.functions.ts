// Analytics + org-level settings server functions (signatures, catch-all, aliases).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";

/* ---------------- ANALYTICS ---------------- */

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ range: z.enum(["today", "week", "month", "year"]).default("week") }).parse(d ?? {}),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Dynamic date range filter
    const now = new Date();
    const startDate = new Date();
    if (data.range === "today") startDate.setDate(now.getDate() - 1);
    if (data.range === "week") startDate.setDate(now.getDate() - 7);
    if (data.range === "month") startDate.setMonth(now.getMonth() - 1);
    if (data.range === "year") startDate.setFullYear(now.getFullYear() - 1);

    // Use email_logs as single source of truth — correct column names
    const { data: allLogs } = await supabaseAdmin
      .from("email_logs")
      .select("direction, status, timestamp")
      .eq("organization_id", ctx.organizationId)
      .gte("timestamp", startDate.toISOString());

    const logs = allLogs || [];
    const sentLogs = logs.filter((m: any) => m.direction === "outgoing");
    const recLogs = logs.filter((m: any) => m.direction === "incoming");
    const sent = sentLogs.length;
    const received = recLogs.length;
    const delivered = logs.filter((m: any) => m.status === "delivered" || m.status === "routed" || m.status === "sent").length;
    const failed = 0;
    const bounced = 0;

    // Build time series
    const seriesMap = new Map<string, { date: string; sent: number; received: number }>();

    const daysToMap = data.range === "today" ? 1 : data.range === "week" ? 7 : data.range === "month" ? 30 : 12;
    for (let i = daysToMap; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
      const dayStr = d.toISOString().split("T")[0];
      seriesMap.set(dayStr, { date: dayStr, sent: 0, received: 0 });
    }

    sentLogs.forEach((m: any) => {
      const day = (m.timestamp || "").split("T")[0];
      if (!seriesMap.has(day)) seriesMap.set(day, { date: day, sent: 0, received: 0 });
      seriesMap.get(day)!.sent++;
    });
    recLogs.forEach((m: any) => {
      const day = (m.timestamp || "").split("T")[0];
      if (!seriesMap.has(day)) seriesMap.set(day, { date: day, sent: 0, received: 0 });
      seriesMap.get(day)!.received++;
    });

    const series = Array.from(seriesMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    const total = sent + received;
    const deliverability = total > 0 ? Math.round((delivered / total) * 100) : 100;

    return {
      sent,
      received,
      delivered,
      bounced,
      failed,
      deliverability,
      bounceRate: 0,
      series,
      total,
    };
  });

/* ---------------- ALIASES ---------------- */

export const listAliases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("aliases")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  });

export const createAlias = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        address: z.string().trim().email().max(254),
        employee_id: z.string().uuid(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { data: row, error } = await context.supabase
      .from("aliases")
      .insert({
        organization_id: ctx.organizationId,
        employee_id: data.employee_id,
        address: data.address.toLowerCase(),
        is_primary: false,
      } as never)
      .select("id, address, is_primary, employee_id, created_at")
      .single();
    if (error) throw error;
    return row;
  });

export const deleteAlias = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("aliases")
      .delete()
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

export const updateAliasEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        employee_id: z.string().uuid(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("aliases")
      .update({ employee_id: data.employee_id } as never)
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

/* ---------------- SETTINGS (signature + catch-all) ---------------- */

export const getOrgSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("settings")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    // Default settings if no row exists yet
    return {
      company_signature: null,
      catchall_mode: "reject",
      catchall_forward_to: null,
      routing_active: true,
      notify_email: true,
      notify_digest: false,
    };
  });

export const updateSignature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ company_signature: z.string().max(2000).nullable() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("settings")
      .upsert(
        { organization_id: ctx.organizationId, company_signature: data.company_signature } as never,
        {
          onConflict: "organization_id",
        },
      );
    if (error) throw error;
    return { ok: true };
  });

export const updateCatchAll = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        catchall_mode: z.enum(["receive", "reject", "forward"]),
        catchall_forward_to: z.string().trim().email().max(254).nullable(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase.from("settings").upsert(
      {
        organization_id: ctx.organizationId,
        catchall_mode: data.catchall_mode,
        catchall_forward_to: data.catchall_mode === "forward" ? data.catchall_forward_to : null,
      } as never,
      { onConflict: "organization_id" },
    );
    if (error) throw error;
    return { ok: true };
  });
