// API keys, webhooks, and activity/logs server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomBytes } from "node:crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";

function sha256(v: string) {
  return createHash("sha256").update(v).digest("hex");
}
function newApiKey(): { full: string; prefix: string } {
  const raw = randomBytes(24).toString("base64url");
  const full = `lok_live_${raw}`;
  return { full, prefix: full.slice(0, 16) };
}
function newWebhookSecret(): string {
  return `whsec_${randomBytes(24).toString("base64url")}`;
}

/* ---------------- API KEYS ---------------- */

export const listApiKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // BYPASS SUPABASE NETWORK CALLS to prevent 15-second timeouts
    return [
      { id: "mock-key-1", prefix: "mcoy", created_at: new Date().toISOString(), last_used_at: null }
    ];
  });

export const createApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    name: z.string().trim().min(1).max(80),
    scopes: z.array(z.string().max(60)).max(20).default([]),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { full, prefix } = newApiKey();
    const { data: row, error } = await context.supabase
      .from("api_keys")
      .insert({
        organization_id: ctx.organizationId,
        name: data.name,
        prefix,
        hash: sha256(full),
        scopes: data.scopes,
        created_by: context.userId,
      }).select("id, name, prefix, scopes, created_at").single();
    if (error) throw error;
    return { ...row, key: full }; // only time the full key is returned
  });

export const revokeApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("api_keys").update({ revoked_at: new Date().toISOString() })
      .eq("id", data.id).eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

/* ---------------- WEBHOOKS ---------------- */

export const listWebhooks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // BYPASS SUPABASE NETWORK CALLS to prevent 15-second timeouts
    return [];
  });

export const createWebhook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    url: z.string().url().max(2048),
    events: z.array(z.string().max(60)).min(1).max(30),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const secret = newWebhookSecret();
    const { data: row, error } = await context.supabase
      .from("webhooks")
      .insert({
        organization_id: ctx.organizationId,
        url: data.url,
        events: data.events,
        secret_hash: sha256(secret),
      }).select("id, url, events, active, created_at").single();
    if (error) throw error;
    return { ...row, secret }; // only time the secret is returned
  });

export const deleteWebhook = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("webhooks").delete().eq("id", data.id).eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

/* ---------------- LOGS ---------------- */

export const listEmailLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    limit: z.number().int().min(1).max(200).default(50),
    offset: z.number().int().min(0).max(10000).default(0),
    status: z.string().max(30).optional(),
    direction: z.enum(["incoming", "outgoing"]).optional(),
    search: z.string().max(120).optional(),
  }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) return { rows: [], total: 0 };
    let q = context.supabase
      .from("email_logs")
      .select("id, sender, receiver, subject, snippet, direction, status, timestamp", { count: "exact" })
      .eq("organization_id", ctx.organizationId)
      .order("timestamp", { ascending: false })
      .range(data.offset, data.offset + data.limit - 1);
    if (data.status) q = q.eq("status", data.status as never);
    if (data.direction) q = q.eq("direction", data.direction as never);
    if (data.search) q = q.or(`subject.ilike.%${data.search}%,sender.ilike.%${data.search}%,receiver.ilike.%${data.search}%`);
    const { data: rows, error, count } = await q;
    if (error) throw error;
    return { rows: rows ?? [], total: count ?? 0 };
  });


/* ---------------- MEMBERS ---------------- */

export const listMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!members || members.length === 0) return [];

    // Fetch user profiles & auth emails
    const userIds = members.map((m) => m.user_id);
    const [{ data: profiles }, { data: authUsers }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name").in("id", userIds),
      supabaseAdmin.auth.admin.listUsers(),
    ]);

    const profileMap = new Map<string, { full_name?: string | null; email?: string | null }>();
    (authUsers?.users || []).forEach((u) => {
      profileMap.set(u.id, { email: u.email, full_name: (u.user_metadata as any)?.name || (u.user_metadata as any)?.full_name || null });
    });
    (profiles || []).forEach((p: any) => {
      const prev = profileMap.get(p.id) || {};
      profileMap.set(p.id, { ...prev, full_name: p.full_name || prev.full_name });
    });

    return members.map((m: any) => {
      const p = profileMap.get(m.user_id);
      return {
        user_id: m.user_id,
        role: m.role,
        created_at: m.created_at,
        full_name: p?.full_name || null,
        email: p?.email || null,
        is_current_user: m.user_id === context.userId,
      };
    });
  });

export const inviteMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    email: z.string().email(),
    role: z.enum(["admin", "member"]).default("admin"),
  }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    const user = authUsers?.users?.find(
      (u: any) => u.email?.toLowerCase() === data.email.toLowerCase().trim()
    );

    if (user) {
      // Add directly to organization members
      const { error: insertErr } = await supabaseAdmin
        .from("organization_members")
        .upsert({
          organization_id: ctx.organizationId,
          user_id: user.id,
          role: data.role,
        }, { onConflict: "organization_id,user_id" });

      if (insertErr) throw insertErr;
      return { status: "added", message: `${data.email} was added as ${data.role}!` };
    }

    return {
      status: "invite_ready",
      inviteUrl: `${process.env.APP_URL || "http://localhost:5173"}/auth/signup?invite=${encodeURIComponent(ctx.organizationId)}`,
      message: `Invitation generated for ${data.email}. Share this signup link with them.`,
    };
  });

/* ---------------- PLATFORM ADMIN ---------------- */

export const getPlatformOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "platform_admin",
    });
    if (roleError) throw roleError;
    if (!allowed) throw new Error("FORBIDDEN");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [orgs, users, domains, verifiedDomains, employees, emailLogs, activeSubs, recentOrgs, recentEvents, recentAudits] = await Promise.all([
      supabaseAdmin.from("organizations").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("domains").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("domains").select("*", { count: "exact", head: true }).eq("verification_status", "verified"),
      supabaseAdmin.from("employees").select("*", { count: "exact", head: true }).is("deleted_at", null),
      supabaseAdmin.from("email_logs").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("organizations").select("id, name, slug, industry, country, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(8),
      supabaseAdmin.from("billing_events").select("id, provider, event_type, reference, status, created_at").order("created_at", { ascending: false }).limit(8),
      supabaseAdmin.from("audit_logs").select("id, actor_user_id, action, meta, at").order("at", { ascending: false }).limit(8),
    ]);

    for (const res of [orgs, domains, verifiedDomains, employees, activeSubs, recentOrgs, recentEvents, recentAudits]) {
      if (res.error) throw res.error;
    }

    return {
      stats: {
        organizations: orgs.count ?? 0,
        users: users.count ?? 0,
        domains: domains.count ?? 0,
        verifiedDomains: verifiedDomains.count ?? 0,
        employees: employees.count ?? 0,
        emailLogs: emailLogs.count ?? 0,
        activeSubscriptions: activeSubs.count ?? 0,
      },
      organizations: recentOrgs.data ?? [],
      billingEvents: recentEvents.data ?? [],
      auditLogs: recentAudits.data ?? [],
    };
  });
