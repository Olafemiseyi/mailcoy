// Gmail Connection server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext } from "@/server/orgContext.server";

const CONNECTOR_ID = "google_mail";

export const isGoogleMailConnectorConfigured = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => ({
    configured: Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET),
  }));

export const disconnectGoogleMail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ employeeId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data: emp } = await context.supabase
      .from("employees")
      .select("id, user_id")
      .eq("id", data.employeeId)
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();

    if (!emp) throw new Error("Employee not found");
    if (emp.user_id !== context.userId && ctx.role === "member") throw new Error("FORBIDDEN");

    // Remove the connection key (refresh token)
    const { deleteConnectionKeyForUser } = await import("@/server/appUserConnections.server");
    await deleteConnectionKeyForUser(emp.id, CONNECTOR_ID); // Notice we use emp.id, since we keyed by employee_id!

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("gmail_connections")
      .update({ revoked_at: new Date().toISOString(), health_status: "revoked" } as never)
      .eq("employee_id", emp.id);

    await supabaseAdmin.from("employees").update({ status: "inactive" } as never).eq("id", emp.id);

    return { ok: true };
  });

export const pauseGmailConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ employeeId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data: emp } = await context.supabase
      .from("employees")
      .select("id")
      .eq("id", data.employeeId)
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();
    if (!emp) throw new Error("Employee not found");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("gmail_connections")
      .update({ health_status: "paused" } as never)
      .eq("employee_id", emp.id)
      .is("revoked_at", null);
    await supabaseAdmin.from("employees").update({ status: "suspended" } as never).eq("id", emp.id);
    await supabaseAdmin.from("activity_logs").insert({
      organization_id: ctx.organizationId,
      actor_user_id: context.userId,
      action: "gmail.paused",
      target_type: "employee",
      target_id: emp.id,
      meta: {},
    } as never);
    return { ok: true };
  });

export const resumeGmailConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ employeeId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data: emp } = await context.supabase
      .from("employees")
      .select("id")
      .eq("id", data.employeeId)
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();
    if (!emp) throw new Error("Employee not found");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("gmail_connections")
      .update({ health_status: "healthy" } as never)
      .eq("employee_id", emp.id)
      .is("revoked_at", null);
    await supabaseAdmin.from("employees").update({ status: "connected" } as never).eq("id", emp.id);
    await supabaseAdmin.from("activity_logs").insert({
      organization_id: ctx.organizationId,
      actor_user_id: context.userId,
      action: "gmail.resumed",
      target_type: "employee",
      target_id: emp.id,
      meta: {},
    } as never);
    return { ok: true };
  });

/**
 * Manually re-trigger Gmail Send As alias setup for an employee.
 * Useful for employees who connected before the automation was added,
 * or if the first attempt failed due to a temporary Gmail API error.
 */
export const triggerSendAsSetup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => z.object({ employeeId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");

    const { data: emp } = await context.supabase
      .from("employees")
      .select("professional_email, full_name")
      .eq("id", data.employeeId)
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();

    if (!emp?.professional_email) throw new Error("Employee has no professional email set.");

    const { getConnectionKeyForUser } = await import("@/server/appUserConnections.server");
    const refreshToken = await getConnectionKeyForUser(data.employeeId, "google_mail");
    if (!refreshToken) throw new Error("Employee has not connected Gmail yet.");

    const { addGmailSendAsAlias } = await import("@/server/googleOAuth.server");
    const result = await addGmailSendAsAlias({
      refreshToken,
      sendAsEmail: emp.professional_email,
      displayName: emp.full_name ?? emp.professional_email,
    });

    return { ok: true, result };
  });
