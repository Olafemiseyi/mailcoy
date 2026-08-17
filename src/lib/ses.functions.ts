import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, assertAdmin } from "@/server/orgContext.server";

export const getSesCredentials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    const { data, error } = await context.supabase
      .from("ses_credentials")
      .select("id, region, configuration_set, daily_quota, send_rate, created_at, updated_at")
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();

    if (error) throw error;
    // Note: We deliberately do NOT return the ciphertext or plaintext keys to the client.
    // If data exists, it means the org has credentials configured.
    return data;
  });

export const saveSesCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      accessKeyId: z.string().min(16),
      secretAccessKey: z.string().min(32),
      region: z.string().default("us-east-1"),
      configurationSet: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    const { encryptConnectionKey } = await import("@/server/connectionKeyCrypto");
    
    const akCipher = encryptConnectionKey(data.accessKeyId);
    const skCipher = encryptConnectionKey(data.secretAccessKey);

    // Verify credentials work against AWS before saving
    const { SESClient, GetSendQuotaCommand } = await import("@aws-sdk/client-ses");
    const client = new SESClient({
      region: data.region,
      credentials: { accessKeyId: data.accessKeyId, secretAccessKey: data.secretAccessKey },
    });

    let dailyQuota = null;
    let sendRate = null;
    try {
      const quota = await client.send(new GetSendQuotaCommand({}));
      dailyQuota = quota.Max24HourSend ? Math.floor(quota.Max24HourSend) : null;
      sendRate = quota.MaxSendRate ? Math.floor(quota.MaxSendRate) : null;
    } catch (e: any) {
      throw new Error(`Invalid AWS Credentials: ${e.message}`);
    }

    const { data: existing } = await context.supabase
      .from("ses_credentials")
      .select("id")
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();

    if (existing) {
      const { error } = await context.supabase
        .from("ses_credentials")
        .update({
          access_key_id_ciphertext: akCipher,
          secret_access_key_ciphertext: skCipher,
          region: data.region,
          configuration_set: data.configurationSet,
          daily_quota: dailyQuota,
          send_rate: sendRate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase
        .from("ses_credentials")
        .insert({
          organization_id: ctx.organizationId,
          access_key_id_ciphertext: akCipher,
          secret_access_key_ciphertext: skCipher,
          region: data.region,
          configuration_set: data.configurationSet,
          daily_quota: dailyQuota,
          send_rate: sendRate,
        });
      if (error) throw error;
    }

    return { ok: true };
  });

export const removeSesCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    const { error } = await context.supabase
      .from("ses_credentials")
      .delete()
      .eq("organization_id", ctx.organizationId);
      
    if (error) throw error;
    return { ok: true };
  });

export const listSesDomains = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    
    // We do a join with domains to get the domain name
    const { data, error } = await context.supabase
      .from("ses_domains")
      .select(`
        id, 
        region, 
        identity_status, 
        dkim_tokens, 
        verified_at,
        created_at,
        domains ( id, domain )
      `)
      .eq("organization_id", ctx.organizationId);

    if (error) throw error;
    return data ?? [];
  });
