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
    let startDate: Date;
    if (data.range === "today") {
      // Midnight 00:00:00 of current day
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else if (data.range === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    } else if (data.range === "month") {
      startDate = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    } else {
      startDate = new Date(now.getTime() - 365 * 24 * 3600 * 1000);
    }

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
    const failed = logs.filter((m: any) => m.status === "failed").length;
    const bounced = logs.filter((m: any) => m.status === "bounced").length;
    const bounceRate = sent > 0 ? Math.round((bounced / sent) * 100) : 0;

    // Build labeled time series for charts
    let series: { label: string; date: string; sent: number; received: number }[] = [];

    if (data.range === "today") {
      const hours = [0, 4, 8, 12, 16, 20];
      const hourMap = new Map<number, { label: string; date: string; sent: number; received: number }>();
      hours.forEach((h) => {
        const period = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
        hourMap.set(h, { label: period, date: `${h}:00`, sent: 0, received: 0 });
      });

      sentLogs.forEach((m: any) => {
        const d = new Date(m.timestamp);
        const h = d.getHours();
        const bucket = hours.slice().reverse().find((slot) => h >= slot) ?? 0;
        if (hourMap.has(bucket)) hourMap.get(bucket)!.sent++;
      });
      recLogs.forEach((m: any) => {
        const d = new Date(m.timestamp);
        const h = d.getHours();
        const bucket = hours.slice().reverse().find((slot) => h >= slot) ?? 0;
        if (hourMap.has(bucket)) hourMap.get(bucket)!.received++;
      });
      series = Array.from(hourMap.values());
    } else if (data.range === "week") {
      const dayMap = new Map<string, { label: string; date: string; sent: number; received: number }>();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
        const key = d.toISOString().split("T")[0];
        const label = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" });
        dayMap.set(key, { label, date: key, sent: 0, received: 0 });
      }
      sentLogs.forEach((m: any) => {
        const day = (m.timestamp || "").split("T")[0];
        if (dayMap.has(day)) dayMap.get(day)!.sent++;
      });
      recLogs.forEach((m: any) => {
        const day = (m.timestamp || "").split("T")[0];
        if (dayMap.has(day)) dayMap.get(day)!.received++;
      });
      series = Array.from(dayMap.values());
    } else if (data.range === "month") {
      const dayMap = new Map<string, { label: string; date: string; sent: number; received: number }>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
        const key = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dayMap.set(key, { label, date: key, sent: 0, received: 0 });
      }
      sentLogs.forEach((m: any) => {
        const day = (m.timestamp || "").split("T")[0];
        if (dayMap.has(day)) dayMap.get(day)!.sent++;
      });
      recLogs.forEach((m: any) => {
        const day = (m.timestamp || "").split("T")[0];
        if (dayMap.has(day)) dayMap.get(day)!.received++;
      });
      series = Array.from(dayMap.values());
    } else {
      const monthMap = new Map<string, { label: string; date: string; sent: number; received: number }>();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString("en-US", { month: "short" });
        monthMap.set(key, { label, date: key, sent: 0, received: 0 });
      }
      sentLogs.forEach((m: any) => {
        const ym = (m.timestamp || "").slice(0, 7);
        if (monthMap.has(ym)) monthMap.get(ym)!.sent++;
      });
      recLogs.forEach((m: any) => {
        const ym = (m.timestamp || "").slice(0, 7);
        if (monthMap.has(ym)) monthMap.get(ym)!.received++;
      });
      series = Array.from(monthMap.values());
    }

    const total = sent + received;
    const deliverability = total > 0 ? Math.round((delivered / total) * 100) : 100;

    return {
      sent,
      received,
      delivered,
      bounced,
      failed,
      deliverability,
      bounceRate,
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
      .select(
        "id, address, is_primary, employee_id, created_at, employees(id, full_name, professional_email, department, job_title)"
      )
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
