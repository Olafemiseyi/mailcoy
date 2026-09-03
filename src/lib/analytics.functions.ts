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
    let q = context.supabase
      .from("aliases")
      .select(
        "id, address, is_primary, employee_id, created_at, employees(id, full_name, professional_email, department, job_title)"
      )
      .eq("organization_id", ctx.organizationId);

    // Multi-Employee Isolation: Members only see their own aliases or shared aliases
    if (ctx.role === "member") {
      const userEmailLower = context.userEmail?.toLowerCase() || "";
      const { data: myEmps } = await context.supabase
        .from("employees")
        .select("id")
        .eq("organization_id", ctx.organizationId)
        .or(
          `user_id.eq.${context.userId},personal_email.ilike.${userEmailLower},company_email.ilike.${userEmailLower},professional_email.ilike.${userEmailLower}`
        );

      const myEmpId = myEmps?.[0]?.id;
      if (myEmpId) {
        q = q.or(`employee_id.eq.${myEmpId},employee_id.is.null`);
      } else {
        q = q.is("employee_id", null);
      }
    } else {
      q = q.order("created_at", { ascending: false });
    }

    const { data, error } = await q;

    if (error) throw error;
    return data || [];
  });

export const createAlias = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        address: z
          .string()
          .trim()
          .toLowerCase()
          .min(1, "Please enter an alias prefix or address.")
          .max(254),
        employee_id: z.string().uuid("Please select a team member."),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    if (!ctx.subscription.canUseAliases) {
      throw new Error(
        "Shared inboxes and aliases are not available on the Free Tier. Please upgrade to Starter Pro in Settings → Billing.",
      );
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (ctx.subscription.maxAliases !== Infinity) {
      const { count: currentAliasCount } = await supabaseAdmin
        .from("aliases")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId);

      if ((currentAliasCount ?? 0) >= ctx.subscription.maxAliases) {
        throw new Error(
          `You have reached the maximum of ${ctx.subscription.maxAliases} aliases on your ${ctx.subscription.plan} plan. Please upgrade to Growth for unlimited aliases.`,
        );
      }
    }

    if (ctx.subscription.maxAliasesPerEmployee !== Infinity) {
      const { count: empAliasCount } = await supabaseAdmin
        .from("aliases")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId)
        .eq("employee_id", data.employee_id);

      if ((empAliasCount ?? 0) >= ctx.subscription.maxAliasesPerEmployee) {
        throw new Error(
          `This team member has reached the limit of ${ctx.subscription.maxAliasesPerEmployee} aliases on your ${ctx.subscription.plan} plan. Please upgrade to Growth to assign more aliases per member.`,
        );
      }
    }

    let fullAddress = data.address.trim().toLowerCase();

    // If only prefix (e.g. "hello") was entered, auto-append the organization's verified domain
    if (!fullAddress.includes("@")) {
      const { data: doms } = await supabaseAdmin
        .from("domains")
        .select("domain_name")
        .eq("organization_id", ctx.organizationId)
        .eq("verification_status", "verified")
        .order("created_at", { ascending: true });

      const defaultDom = doms?.[0]?.domain_name || "mailcoy.com";
      fullAddress = `${fullAddress}@${defaultDom}`;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(fullAddress)) {
      throw new Error("Invalid alias format. Please enter a valid name like 'sales' or 'sales@company.com'.");
    }

    // Check if duplicate for this employee
    const { data: existing } = await supabaseAdmin
      .from("aliases")
      .select("id, employee_id")
      .eq("organization_id", ctx.organizationId)
      .eq("address", fullAddress)
      .eq("employee_id", data.employee_id)
      .maybeSingle();

    if (existing) {
      throw new Error(`The alias "${fullAddress}" is already assigned to this team member.`);
    }

    const { data: row, error } = await context.supabase
      .from("aliases")
      .insert({
        organization_id: ctx.organizationId,
        employee_id: data.employee_id,
        address: fullAddress,
        is_primary: false,
      } as never)
      .select("id, address, is_primary, employee_id, created_at")
      .single();

    if (error) {
      if ((error as any).code === "23505") {
        throw new Error(`The alias "${fullAddress}" is already assigned.`);
      }
      throw new Error(error.message || "Failed to create alias.");
    }
    return row;
  });

export const deleteAlias = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        // Optional: when provided, ALL alias rows for this address in the org
        // are deleted (full group wipe), not just the single row by id.
        address: z.string().trim().toLowerCase().max(254).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    if (data.address) {
      // Delete the entire alias group (all employee assignments for this address)
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin
        .from("aliases")
        .delete()
        .eq("address", data.address)
        .eq("organization_id", ctx.organizationId)
        .eq("is_primary", false); // never delete primary rows this way
      if (error) throw error;
    } else {
      // Fallback: delete a single alias row by ID (used when removing one member from shared inbox)
      const { error } = await context.supabase
        .from("aliases")
        .delete()
        .eq("id", data.id)
        .eq("organization_id", ctx.organizationId);
      if (error) throw error;
    }
    return { ok: true };
  });

export const updateAliasEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
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

const COMMON_ALIASES = [
  { address: "hello", label: "Hello / Welcome", reason: "First point of contact — great for inbound leads and general enquiries." },
  { address: "info", label: "Info", reason: "Standard address customers try first. Reduces missed messages." },
  { address: "support", label: "Support", reason: "Customers expect this for help requests. Boosts trust and response rates." },
  { address: "sales", label: "Sales", reason: "Routes sales enquiries to your team. Critical for revenue." },
  { address: "contact", label: "Contact", reason: "General contact alias — used widely on websites and business cards." },
  { address: "admin", label: "Admin", reason: "Internal and vendor communications often target admin@." },
  { address: "billing", label: "Billing", reason: "Finance and invoice queries — keep them separate from general mail." },
  { address: "careers", label: "Careers / HR", reason: "Recruiting and HR enquiries go here instead of an employee inbox." },
  { address: "press", label: "Press / Media", reason: "Journalists and media contacts expect a dedicated address." },
  { address: "noreply", label: "No-reply", reason: "Use for transactional system emails to set clear reply expectations." },
  { address: "newsletter", label: "Newsletter", reason: "Dedicate an address for outbound marketing campaigns." },
  { address: "legal", label: "Legal", reason: "Contracts, NDAs, and legal notices should go to a controlled mailbox." },
  { address: "partners", label: "Partners", reason: "Dedicated inbox for partnership and vendor discussions." },
  { address: "security", label: "Security", reason: "Responsible disclosure and security reports." },
  { address: "privacy", label: "Privacy / DPO", reason: "GDPR and privacy requests — legally required in many jurisdictions." },
];

export const getAliasSuggestionsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: existingAliases }, { data: domains }, { data: employees }] = await Promise.all([
      supabaseAdmin
        .from("aliases")
        .select("address")
        .eq("organization_id", ctx.organizationId),
      supabaseAdmin
        .from("domains")
        .select("domain_name")
        .eq("organization_id", ctx.organizationId)
        .eq("verification_status", "verified"),
      supabaseAdmin
        .from("employees")
        .select("id, full_name, professional_email, job_title, department, status")
        .eq("organization_id", ctx.organizationId)
        .is("deleted_at", null)
        .eq("status", "active"),
    ]);

    const existingLocal = new Set(
      (existingAliases ?? []).map((a: any) => {
        const parts = (a.address || "").split("@");
        return parts[0]?.toLowerCase() ?? "";
      }),
    );

    const primaryDomain = (domains ?? [])[0]?.domain_name ?? null;

    const suggestions = COMMON_ALIASES.filter((alias) => !existingLocal.has(alias.address)).map(
      (alias) => ({
        local_part: alias.address,
        label: alias.label,
        reason: alias.reason,
        suggested_address: primaryDomain ? `${alias.address}@${primaryDomain}` : null,
      }),
    );

    const employeeSuggestions = (employees ?? []).flatMap((emp: any) => {
      const parts = (emp.full_name || "").trim().toLowerCase().split(/\s+/);
      const firstName = parts[0] ?? "";
      const lastName = parts[parts.length - 1] ?? "";
      const firstInitial = firstName.charAt(0);

      const patterns: { local: string; reason: string }[] = [];
      if (firstName.length >= 2 && !existingLocal.has(firstName)) {
        patterns.push({ local: firstName, reason: `Direct first-name alias for ${emp.full_name}` });
      }
      if (firstInitial && lastName.length >= 2) {
        const firstLast = `${firstInitial}${lastName}`;
        if (!existingLocal.has(firstLast)) {
          patterns.push({ local: firstLast, reason: `Standard short-form alias for ${emp.full_name}` });
        }
      }

      return patterns.map((p) => ({
        local_part: p.local,
        label: `${emp.full_name} (${p.local})`,
        reason: p.reason,
        suggested_address: primaryDomain ? `${p.local}@${primaryDomain}` : null,
        employee_id: emp.id,
      }));
    });

    return {
      suggestions,
      employee_suggestions: employeeSuggestions,
      primary_domain: primaryDomain,
    };
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
        catchall_forward_to: z.string().trim().max(254).nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    if (!ctx.subscription.canUseCatchAll) {
      throw new Error(
        "Catch-all routing is a premium feature available on the Growth plan and above. Please upgrade in Settings → Billing.",
      );
    }

    let forwardEmail: string | null = null;
    if (data.catchall_mode === "forward") {
      forwardEmail = (data.catchall_forward_to || "").trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!forwardEmail || !emailRegex.test(forwardEmail)) {
        throw new Error("Please specify a valid destination email address for forwarding.");
      }
    }

    const { error } = await context.supabase.from("settings").upsert(
      {
        organization_id: ctx.organizationId,
        catchall_mode: data.catchall_mode,
        catchall_forward_to: data.catchall_mode === "forward" ? forwardEmail : null,
      } as never,
      { onConflict: "organization_id" },
    );
    if (error) throw error;
    return { ok: true };
  });
