import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveOrgContext } from "@/server/orgContext.server";
import { z } from "zod";

const TemplateSchema = z.object({
  name: z.string().min(1),
  subject: z.string(),
  html_body: z.string(),
});

export const listTemplates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) return [];
    
    const { data, error } = await context.supabase
      .from("email_templates")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .order("updated_at", { ascending: false });
      
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    subject: z.string(),
    html_body: z.string(),
  }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) throw new Error("No org");
    
    if (data.id) {
      const { error } = await context.supabase
        .from("email_templates")
        .update({
          name: data.name,
          subject: data.subject,
          html_body: data.html_body,
        })
        .eq("id", data.id)
        .eq("organization_id", ctx.organizationId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("email_templates")
        .insert({
          organization_id: ctx.organizationId,
          name: data.name,
          subject: data.subject,
          html_body: data.html_body,
        });
      if (error) throw new Error(error.message);
    }
  });

export const deleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) throw new Error("No org");
    
    const { error } = await context.supabase
      .from("email_templates")
      .delete()
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId);
      
    if (error) throw new Error(error.message);
  });
