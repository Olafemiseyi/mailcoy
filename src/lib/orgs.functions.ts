// Organization + onboarding server functions.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveOrgContext } from "@/server/orgContext.server";

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "workspace";

const createOrgSchema = z.object({
  name: z.string().trim().min(2).max(120),
  industry: z.string().trim().max(80).optional(),
  country: z.string().trim().max(80).optional(),
  timezone: z.string().trim().max(80).optional(),
});

export const getMyOrganization = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) return null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: org, error } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("id", ctx.organizationId)
      .single();

    if (error || !org) return null;

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      industry: org.industry,
      country: org.country,
      timezone: org.timezone,
      currency: org.currency,
      logo_url: org.logo_url,
      onboarding_step: org.onboarding_step,
      onboarding_completed_at: org.onboarding_completed_at,
      created_at: org.created_at,
      role: ctx.role,
      platformAdmin: false,
      subscription: ctx.subscription,
    };
  });

export const createOrganization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createOrgSchema.parse(data))
  .handler(async ({ data, context }) => {
    const existing = await resolveOrgContext(context.supabase, context.userId);
    if (existing) return { id: existing.organizationId, alreadyExists: true as const };

    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    for (let i = 1; i < 20; i++) {
      const { data: taken } = await context.supabase
        .from("organizations")
        .select("id")
        .ilike("slug", slug)
        .maybeSingle();
      if (!taken) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data: org, error } = await context.supabase
      .from("organizations")
      .insert({
        name: data.name,
        slug,
        industry: data.industry ?? null,
        country: data.country ?? null,
        timezone: data.timezone ?? "UTC",
        currency: (data.country ?? "").toUpperCase() === "NG" ? "NGN" : "USD",
        created_by: context.userId,
        onboarding_step: 1,
      } as never)
      .select("id")
      .single();
    if (error || !org) throw error ?? new Error("Failed to create organization");

    // Add creator as owner. RLS: has_org_role uses this table, so bootstrap via service role.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: memberErr } = await supabaseAdmin
      .from("organization_members")
      .insert({
        organization_id: (org as { id: string }).id,
        user_id: context.userId,
        role: "owner",
      } as never);
    if (memberErr) throw memberErr;

    await supabaseAdmin.from("activity_logs").insert({
      organization_id: (org as { id: string }).id,
      actor_user_id: context.userId,
      action: "organization.created",
      meta: { name: data.name },
    } as never);

    return { id: (org as { id: string }).id, alreadyExists: false as const };
  });

export const setOnboardingStep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ step: z.number().int().min(0).max(10), completed: z.boolean().optional() })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) throw new Error("NO_ORGANIZATION");
    const patch: Record<string, unknown> = { onboarding_step: data.step };
    if (data.completed) patch.onboarding_completed_at = new Date().toISOString();
    const { error } = await context.supabase
      .from("organizations")
      .update(patch as never)
      .eq("id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

const updateOrgSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  industry: z.string().trim().max(80).nullable().optional(),
  country: z.string().trim().max(80).nullable().optional(),
  timezone: z.string().trim().max(80).optional(),
  currency: z.enum(["USD", "NGN"]).optional(),
  logo_url: z.string().url().max(1024).nullable().optional(),
});

export const updateOrganization = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateOrgSchema.parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) throw new Error("NO_ORGANIZATION");
    if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");
    const { error } = await context.supabase
      .from("organizations")
      .update(data)
      .eq("id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

export const uploadOrganizationLogo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        fileName: z.string().trim().min(1).max(160),
        contentType: z.enum([
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
          "image/svg+xml",
        ]),
        base64: z.string().min(10).max(7_000_000),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const ctx = await resolveOrgContext(context.supabase, context.userId);
    if (!ctx) throw new Error("NO_ORGANIZATION");
    if (ctx.role !== "owner" && ctx.role !== "admin") throw new Error("FORBIDDEN");

    const ext =
      data.contentType === "image/jpeg"
        ? "jpg"
        : data.contentType.split("/")[1].replace("svg+xml", "svg");
    const safeName = data.fileName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .slice(0, 80);
    const path = `logos/${ctx.organizationId}/${Date.now()}-${safeName || `logo.${ext}`}`;
    const bytes = Buffer.from(data.base64, "base64");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: uploadError } = await supabaseAdmin.storage
      .from("brand-assets")
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (uploadError) throw uploadError;
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("brand-assets")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signError || !signed?.signedUrl) throw signError ?? new Error("Logo upload failed");
    const { error: updateError } = await supabaseAdmin
      .from("organizations")
      .update({ logo_url: signed.signedUrl, updated_at: new Date().toISOString() } as never)
      .eq("id", ctx.organizationId);
    if (updateError) throw updateError;
    return { logoUrl: signed.signedUrl };
  });
