// Promo code server functions.
// Admin CRUD: createPromoCode, updatePromoCode, deletePromoCode, listPromoCodes
// User-facing: validatePromoCode
// Internal: redeemPromoCodeInternal (called from paystack.functions after payment confirmed)

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertPlatformAdmin(supabase: any, userId: string): Promise<void> {
  const { data, error } = await supabase.rpc("is_platform_admin", { _user_id: userId });
  if (error) throw error as Error;
  if (!data) throw new Error("You do not have platform admin access.");
}

export interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  discount_pct: number;
  max_uses: number;
  current_uses: number;
  duration: "once" | "forever";
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface ValidateResult {
  valid: true;
  code: string;
  discountPct: number;
  duration: "once" | "forever";
  message: string;
}
export interface InvalidResult {
  valid: false;
  message: string;
}
export type PromoValidation = ValidateResult | InvalidResult;

export const listPromoCodes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PromoCode[]> => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PromoCode[];
  });

const createSchema = z.object({
  code: z.string().trim().toUpperCase().min(3).max(32).regex(/^[A-Z0-9_-]+$/, "Only letters, numbers, - and _ allowed"),
  description: z.string().trim().max(200).optional(),
  discount_pct: z.number().int().min(1).max(100),
  max_uses: z.number().int().min(0).max(1_000_000).default(100),
  duration: z.enum(["once", "forever"]).default("once"),
  is_active: z.boolean().default(true),
  expires_at: z.string().datetime().nullable().optional(),
});

export const createPromoCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createSchema.parse(d))
  .handler(async ({ data, context }): Promise<PromoCode> => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("promo_codes")
      .insert({
        code: data.code,
        description: data.description ?? null,
        discount_pct: data.discount_pct,
        max_uses: data.max_uses,
        duration: data.duration,
        is_active: data.is_active,
        expires_at: data.expires_at ?? null,
        created_by: context.userId,
      } as never)
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("A promo code with that name already exists.");
      throw error;
    }
    return row as PromoCode;
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  description: z.string().trim().max(200).nullable().optional(),
  discount_pct: z.number().int().min(1).max(100).optional(),
  max_uses: z.number().int().min(0).max(1_000_000).optional(),
  duration: z.enum(["once", "forever"]).optional(),
  is_active: z.boolean().optional(),
  expires_at: z.string().datetime().nullable().optional(),
});

export const updatePromoCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateSchema.parse(d))
  .handler(async ({ data, context }): Promise<PromoCode> => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...fields } = data;
    const { data: row, error } = await supabaseAdmin
      .from("promo_codes")
      .update(fields as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return row as PromoCode;
  });

export const deletePromoCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ ok: boolean }> => {
    await assertPlatformAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("promo_codes").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const validatePromoCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().trim().toUpperCase().min(1).max(32) }).parse(d),
  )
  .handler(async ({ data }): Promise<PromoValidation> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("promo_codes")
      .select("id, code, discount_pct, duration, is_active, max_uses, current_uses, expires_at")
      .eq("code", data.code)
      .maybeSingle();

    if (error) throw error;
    if (!row) return { valid: false, message: "Promo code not found." };
    if (!row.is_active) return { valid: false, message: "This promo code is no longer active." };
    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return { valid: false, message: "This promo code has expired." };
    }
    if (row.max_uses > 0 && row.current_uses >= row.max_uses) {
      return { valid: false, message: "This promo code has reached its usage limit." };
    }
    const durLabel = row.duration === "forever" ? "every month" : "your first month only";
    return {
      valid: true,
      code: row.code as string,
      discountPct: row.discount_pct as number,
      duration: row.duration as "once" | "forever",
      message: `${row.discount_pct}% off applied — ${durLabel}.`,
    };
  });

export async function redeemPromoCodeInternal(
  supabaseAdmin: any,
  code: string,
  organizationId: string,
  reference: string,
): Promise<void> {
  const { data: row } = await supabaseAdmin
    .from("promo_codes")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (!row) return;
  await supabaseAdmin.rpc("increment_promo_uses", { _code_id: row.id });
  await supabaseAdmin.from("promo_code_redemptions").insert({
    promo_code_id: row.id,
    organization_id: organizationId,
    reference,
  } as never);
}
