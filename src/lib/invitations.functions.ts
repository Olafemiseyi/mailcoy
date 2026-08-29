// Employee invitation flow.
// - Owner creates + manages invites (authenticated).
// - Invited employee opens the invite link, reads context, and completes
//   Google OAuth *themselves* via the workspace google_mail connector.
//   The connection key is stored keyed by employee_id (as the app-user id).
//
// The invite recipient is NOT required to have an app account.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";

const GATEWAY_BASE_URL = "https://connector-gateway.mailcoy.dev";
const CONNECTOR_ID = "google_mail";
const CLIENT_API_KEY_ENV = "GOOGLE_MAIL_APP_USER_CONNECTOR_CLIENT_API_KEY";

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.settings.basic",
];

function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ============ Owner-side (authenticated) ============

export const listInvitesForEmployee = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ employeeId: z.string().uuid().or(z.string()) }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data: invites, error } = await context.supabase
      .from("employee_invitations")
      .select("id, token, sent_at, sent_via, opened_at, accepted_at, revoked_at, expires_at")
      .eq("employee_id", data.employeeId)
      .eq("organization_id", ctx.organizationId)
      .order("sent_at", { ascending: false });

    if (error) throw error;
    return invites || [];
  });

export const createInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      employeeId: z.string().uuid(),
      sentVia: z.enum(["link", "email", "whatsapp", "qr"]).default("link"),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    const { data: emp } = await context.supabase
      .from("employees").select("id").eq("id", data.employeeId)
      .eq("organization_id", ctx.organizationId).is("deleted_at", null).maybeSingle();
    if (!emp) throw new Error("Employee not found");

    // Revoke any existing active invitations for this employee
    await context.supabase
      .from("employee_invitations")
      .update({ revoked_at: new Date().toISOString() } as never)
      .eq("employee_id", data.employeeId)
      .eq("organization_id", ctx.organizationId)
      .is("revoked_at", null);

    const token = randomToken();
    const { data: inv, error } = await context.supabase
      .from("employee_invitations")
      .insert({
        organization_id: ctx.organizationId,
        employee_id: data.employeeId,
        token,
        sent_via: data.sentVia,
        created_by: context.userId,
      } as never)
      .select("id, token, expires_at").single();
    if (error || !inv) throw error ?? new Error("Failed to create invite");

    await context.supabase
      .from("employees")
      .update({ status: "invited", invited_at: new Date().toISOString() } as never)
      .eq("id", data.employeeId).eq("organization_id", ctx.organizationId);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("activity_logs").insert({
      organization_id: ctx.organizationId,
      actor_user_id: context.userId,
      action: "invitation.created",
      target_type: "employee",
      target_id: data.employeeId,
      meta: { sent_via: data.sentVia },
    } as never);

    return inv as { id: string; token: string; expires_at: string };
  });

export const revokeInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { error } = await context.supabase
      .from("employee_invitations")
      .update({ revoked_at: new Date().toISOString() } as never)
      .eq("id", data.id).eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

// ============ Public (invited employee) — no session required ============

async function loadInviteByToken(token: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("employee_invitations")
    .select("id, organization_id, employee_id, opened_at, accepted_at, revoked_at, expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  return data as null | {
    id: string; organization_id: string; employee_id: string;
    opened_at: string | null; accepted_at: string | null;
    revoked_at: string | null; expires_at: string;
  };
}

export const getInviteByToken = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ token: z.string().min(10) }).parse(d))
  .handler(async ({ data }) => {
    const inv = await loadInviteByToken(data.token);
    if (!inv) return { ok: false as const, reason: "not_found" };
    if (inv.revoked_at) return { ok: false as const, reason: "revoked" };
    if (new Date(inv.expires_at) < new Date()) return { ok: false as const, reason: "expired" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Mark opened (first time only)
    if (!inv.opened_at) {
      await supabaseAdmin.from("employee_invitations")
        .update({ opened_at: new Date().toISOString() } as never).eq("id", inv.id);
      await supabaseAdmin.from("employees")
        .update({ status: "opened" } as never)
        .eq("id", inv.employee_id).in("status", ["invited", "pending", "pending_auth"] as never);
    }

    const [{ data: emp }, { data: org }, { data: gmail }] = await Promise.all([
      supabaseAdmin.from("employees").select("id, full_name, professional_email, job_title, department, status").eq("id", inv.employee_id).maybeSingle(),
      supabaseAdmin.from("organizations").select("id, name, logo_url").eq("id", inv.organization_id).maybeSingle(),
      supabaseAdmin.from("gmail_connections").select("google_email, connected_at, health_status, revoked_at").eq("employee_id", inv.employee_id).is("revoked_at", null).maybeSingle(),
    ]);

    return {
      ok: true as const,
      invite: { id: inv.id, expiresAt: inv.expires_at, acceptedAt: inv.accepted_at },
      employee: emp,
      organization: org,
      gmail,
    };
  });

export const startGmailByInvite = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      token: z.string().min(10),
      redirectOrigin: z.string().url(),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    const inv = await loadInviteByToken(data.token);
    if (!inv || inv.revoked_at || new Date(inv.expires_at) < new Date()) {
      throw new Error("Invite is no longer valid");
    }

    const { buildGoogleAuthUrl } = await import("@/server/googleOAuth.server");

    // Encode the invite token + a random nonce into the state param
    const nonce = crypto.randomUUID();
    const jsonStr = JSON.stringify({ token: data.token, nonce });
    // Use btoa to avoid Vite injecting a Node.js Buffer polyfill which breaks the client
    const state = btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const origin = data.redirectOrigin.replace(/\/+$/, "");
    const redirectUri = `${origin}/api/auth/google/callback`;

    const authorizationUrl = await buildGoogleAuthUrl(redirectUri, state);
    return { authorizationUrl };
  });
