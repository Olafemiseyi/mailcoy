// Domain server functions — CRUD + DNS verification.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";
import { toAppError } from "@/lib/errors";

const DOMAIN_RE = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})+$/;

const cleanDomain = (val: unknown) => {
  if (typeof val !== 'string') return val;
  try {
    const url = new URL(val.includes('://') ? val : `http://${val}`);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return val.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').trim().toLowerCase();
  }
};

const addSchema = z.object({
  name: z.preprocess(cleanDomain, z.string().trim().toLowerCase().min(3).max(253).regex(DOMAIN_RE, "Invalid domain")),
});

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const listDomains = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("domains")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  });

export const getDomain = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("domains")
      .select("*")
      .eq("organization_id", ctx.organizationId)
      .eq("id", data.id)
      .single();
    if (error || !row) throw error ?? new Error("Domain not found");
    return row;
  });

export const addDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => addSchema.parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { assertNotLocked } = await import("@/server/orgContext.server");
    assertNotLocked(ctx.subscription);

    // Enforce Plan Limits
    const { count: domainCount, error: countErr } = await context.supabase
      .from("domains")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId);
    if (countErr) throw countErr;

    if ((domainCount ?? 0) >= ctx.subscription.maxDomains) {
      throw new Error(
        `Your current plan (${ctx.subscription.plan}) allows up to ${ctx.subscription.maxDomains} domain(s). Please upgrade your plan in Settings → Billing to add more domains.`
      );
    }

    const nonce = randomNonce();
    const { data: row, error } = await context.supabase
      .from("domains")
      .insert({
        organization_id: ctx.organizationId,
        domain_name: data.name,
        // Ownership verification TXT
        txt_record_key: "@",
        txt_record_value: `mailcoy-verify=${nonce}`,
        // SPF record value shown in DNS setup UI
        spf_value: "v=spf1 include:_spf.mailcoy.com ~all",
        // DKIM
        dkim_selector: "mailcoy",
        dkim_value: "v=DKIM1; k=rsa; p=<generated when SES is wired>",
        // Initial statuses — all pending until verified
        verification_status: "pending",
        txt_status: "pending",
        mx_status: "pending",
        spf_status: "pending",
        dkim_status: "pending",
        dmarc_status: "pending",
      } as never)
      .select("*").single();
    if (error || !row) {
      console.error("[addDomain] Error inserting domain:", error);
      throw new Error(toAppError(error, "Failed to add domain. Please try again."));
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("activity_logs").insert({
      organization_id: ctx.organizationId,
      actor_user_id: context.userId,
      action: "domain.added",
      target_type: "domain",
      target_id: (row as { id: string }).id,
      meta: { domain: data.name },
    } as never);
    return row;
  });

export const deleteDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);

    // Get the domain name first
    const { data: domain, error: fetchErr } = await context.supabase
      .from("domains").select("domain_name")
      .eq("id", data.id).eq("organization_id", ctx.organizationId).single();
    
    if (fetchErr || !domain) throw new Error("Domain not found");

    // Check if any employees use this domain
    const { count, error: empErr } = await context.supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId)
      .ilike("professional_email", `%@${domain.domain_name}`)
      .is("deleted_at", null);

    if (empErr) throw empErr;
    if (count && count > 0) {
      throw new Error(`Cannot delete domain. There are ${count} employee(s) associated with ${domain.domain_name}.`);
    }

    const { error } = await context.supabase
      .from("domains").delete().eq("id", data.id).eq("organization_id", ctx.organizationId);
    if (error) throw error;
    return { ok: true };
  });

/**
 * Runs DNS lookups server-side using Cloudflare DoH, then updates the
 * per-record statuses. Verified iff TXT ownership + both MX are OK.
 */
export const verifyDomainNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { data: domain, error } = await context.supabase
      .from("domains").select("*").eq("id", data.id)
      .eq("organization_id", ctx.organizationId).maybeSingle();
    if (error) throw error;
    if (!domain) throw new Error("Domain not found");

    const name = domain.domain_name;
    const selector = domain.dkim_selector ?? "mailcoy";
    const expectedTxt = domain.txt_record_value ?? "";

    const [txtRecords, mxRecords, dkimRecords, dmarcRecords] = await Promise.all([
      doh(name, "TXT"),
      doh(name, "MX"),
      doh(`${selector}._domainkey.${name}`, "TXT"),
      doh(`_dmarc.${name}`, "TXT"),
    ]);

    const errors: string[] = [];

    const txtOk = txtRecords.some((r) => r.includes(expectedTxt));
    if (!txtOk) errors.push(`TXT ownership record not found (expected ${expectedTxt}).`);

    const hasMx1 = mxRecords.some((r) => r.toLowerCase().includes("mx1.mailcoy.com"));
    const hasMx2 = mxRecords.some((r) => r.toLowerCase().includes("mx2.mailcoy.com"));
    const mxOk = hasMx1 && hasMx2;
    if (!mxOk) errors.push("MX records must include mx1 and mx2.mailcoy.com.");

    const spfOk = txtRecords.some(
      (r) => r.toLowerCase().startsWith("v=spf1") && r.toLowerCase().includes("_spf.mailcoy.com"),
    );
    if (!spfOk) errors.push("SPF should include _spf.mailcoy.com.");

    const dkimOk = dkimRecords.some((r) => r.toLowerCase().includes("v=dkim1"));
    if (!dkimOk) errors.push(`DKIM TXT missing at ${selector}._domainkey.${name}.`);

    const dmarcOk = dmarcRecords.some((r) => r.toLowerCase().startsWith("v=dmarc1"));
    if (!dmarcOk) errors.push(`DMARC TXT missing at _dmarc.${name}.`);

    const verified = txtOk && mxOk;

    const patch = {
      txt_status: txtOk ? "verified" : "failed",
      mx_status: mxOk ? "verified" : "failed",
      spf_status: spfOk ? "verified" : "failed",
      dkim_status: dkimOk ? "verified" : "failed",
      dmarc_status: dmarcOk ? "verified" : "failed",
      verification_status: verified ? "verified" : "failed",
      last_checked_at: new Date().toISOString(),
      verified_at: verified ? new Date().toISOString() : domain.verified_at,
      errors,
    };

    const { data: updated, error: uerr } = await context.supabase
      .from("domains").update(patch as never).eq("id", domain.id).select("*").single();
    if (uerr) throw uerr;
    return updated;
  });

async function doh(name: string, type: "TXT" | "MX"): Promise<string[]> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { accept: "application/dns-json" } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { Status: number; Answer?: { data: string }[] };
    if (json.Status !== 0 || !json.Answer) return [];
    return json.Answer.map((r) => {
      let s = r.data.trim();
      if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
      s = s.replace(/"\s+"/g, "");
      return s;
    });
  } catch {
    return [];
  }
}
