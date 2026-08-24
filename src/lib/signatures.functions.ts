// Per-scope email signatures (org-wide default + department variants + per-employee overrides).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";

export const listSignatures = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data: sigs } = await supabaseAdmin
      .from("email_signatures")
      .select("*")
      .eq("organization_id", ctx.organizationId);

    const { data: emps } = await supabaseAdmin
      .from("employees")
      .select("id, full_name, professional_email, company_email, department, job_title")
      .eq("organization_id", ctx.organizationId);

    const org = sigs?.find((s: any) => s.scope === "org") || null;
    const departments = sigs?.filter((s: any) => s.scope === "department") || [];
    const rawEmployees = sigs?.filter((s: any) => s.scope === "employee") || [];

    const allEmployees = (emps || []).map((e: any) => ({
      id: e.id,
      full_name: e.full_name,
      professional_email: e.professional_email || e.company_email,
      department: e.department,
      job_title: e.job_title
    }));

    const employees = rawEmployees.map((s: any) => {
      const matchedEmp = allEmployees.find((e) => e.id === s.scope_ref);
      return {
        ...s,
        employee_name: matchedEmp?.full_name || null,
        professional_email: matchedEmp?.professional_email || null,
        department: matchedEmp?.department || null,
        job_title: matchedEmp?.job_title || null,
      };
    });

    return { org, departments, employees, allEmployees };
  });

const upsertSchema = z.object({
  scope: z.enum(["org", "department", "employee"]),
  scope_ref: z.string().nullable().optional(),
  name: z.string().trim().min(1).max(120),
  html: z.string().max(10_000),
});

export const upsertSignature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => upsertSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let scopeRef = "org";
    if (data.scope === "employee") {
      if (!data.scope_ref) throw new Error("scope_ref (employee_id) required for employee-scope signature");
      scopeRef = data.scope_ref;
    } else if (data.scope === "department") {
      if (!data.scope_ref) throw new Error("scope_ref (department name) required for department-scope signature");
      scopeRef = data.scope_ref;
    }

    // Look up existing by (org, scope, scope_ref)
    const { data: existing } = await supabaseAdmin
      .from("email_signatures")
      .select("id")
      .eq("organization_id", ctx.organizationId)
      .eq("scope", data.scope)
      .eq("scope_ref", scopeRef)
      .maybeSingle();

    const payload = {
      organization_id: ctx.organizationId,
      scope: data.scope,
      scope_ref: scopeRef,
      name: data.name,
      html: data.html,
      variables: {},
      is_default: data.scope === "org",
    };

    if (existing) {
      const { error } = await supabaseAdmin
        .from("email_signatures")
        .update({ name: payload.name, html: payload.html } as never)
        .eq("id", (existing as { id: string }).id);
      if (error) throw error;
      return { id: (existing as { id: string }).id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("email_signatures")
      .insert(payload as never)
      .select("id").single();
    if (error || !row) throw error ?? new Error("Insert failed");
    return { id: (row as { id: string }).id };
  });

export const deleteSignature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("email_signatures")
      .delete()
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });
