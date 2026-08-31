// Domain server functions — CRUD + DNS verification.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, resolveOrgContext, assertAdmin } from "@/server/orgContext.server";
import { toAppError } from "@/lib/errors";

const DOMAIN_RE = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})+$/;

const cleanDomain = (val: unknown) => {
  if (typeof val !== "string") return val;
  try {
    const url = new URL(val.includes("://") ? val : `http://${val}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return val
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")
      .trim()
      .toLowerCase();
  }
};

const addSchema = z.object({
  name: z.preprocess(
    cleanDomain,
    z.string().trim().toLowerCase().min(3).max(253).regex(DOMAIN_RE, "Invalid domain"),
  ),
});

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const listDomains = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
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
        `Your current plan (${ctx.subscription.plan}) allows up to ${ctx.subscription.maxDomains} domain(s). Please upgrade your plan in Settings → Billing to add more domains.`,
      );
    }

    const nonce = randomNonce();

    // 1. Register the domain on Resend — this enables both sending AND receiving
    //    Customers then add just 1 MX record → inbound-smtp.us-east-1.amazonaws.com
    const { createResendDomain } = await import("@/lib/resend.functions");
    let dkimValue = "";
    let spfValue = "v=spf1 include:amazonses.com ~all";

    try {
      const resendData = await createResendDomain(data.name);
      const dkimRecord = resendData.records?.find((r: any) => r.record === "DKIM");
      const spfTxtRecord = resendData.records?.find(
        (r: any) => r.record === "SPF" && r.type === "TXT",
      );
      if (dkimRecord) dkimValue = dkimRecord.value;
      if (spfTxtRecord) spfValue = spfTxtRecord.value;
    } catch (e) {
      console.warn("[addDomain] Resend domain registration failed — will retry on verify:", e);
    }

    const { data: row, error } = await context.supabase
      .from("domains")
      .insert({
        organization_id: ctx.organizationId,
        domain_name: data.name,
        // Ownership verification TXT
        txt_record_key: "@",
        txt_record_value: `mailcoy-verify=${nonce}`,
        // SPF record value shown in DNS setup UI
        spf_value: spfValue,
        // DKIM
        dkim_selector: "resend", // Resend usually uses 'resend' instead of 'mailcoy'
        dkim_value: dkimValue,
        // Initial statuses
        verification_status: "pending",
        txt_status: "pending",
        mx_status: "pending",
        spf_status: "pending",
        dkim_status: "pending",
        dmarc_status: "pending",
      } as never)
      .select("*")
      .single();
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
      .from("domains")
      .select("domain_name")
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId)
      .single();

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
      throw new Error(
        `Cannot delete domain. There are ${count} employee(s) associated with ${domain.domain_name}.`,
      );
    }

    const { error } = await context.supabase
      .from("domains")
      .delete()
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId);
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
      .from("domains")
      .select("*")
      .eq("id", data.id)
      .eq("organization_id", ctx.organizationId)
      .maybeSingle();
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

    const txtOk = txtRecords.some((r) => r.includes(expectedTxt) || (expectedTxt.startsWith("mailcoy-verify=") && r.includes(expectedTxt.replace("mailcoy-verify=", ""))));
    if (!txtOk) errors.push(`TXT ownership record not found (expected ${expectedTxt}).`);

    // Inbound MX — points to Resend / AWS SES / Mailcoy
    const mxOk = mxRecords.some((r) => {
      const low = r.toLowerCase();
      return (
        low.includes("inbound-smtp.us-east-1.amazonaws.com") ||
        low.includes("amazonses.com") ||
        low.includes("mailcoy.com") ||
        low.includes("mailcoy.connect")
      );
    });
    if (!mxOk) errors.push(`MX record must point to inbound-smtp.us-east-1.amazonaws.com.`);

    const spfOk = txtRecords.some((r) => {
      const low = r.toLowerCase();
      return (
        low.startsWith("v=spf1") &&
        (low.includes("include:amazonses.com") ||
          low.includes("include:resend.com") ||
          low.includes("_spf.mailcoy.com") ||
          low.includes("_spf.mailcoy.connect"))
      );
    });
    if (!spfOk) errors.push("SPF should include include:amazonses.com or _spf.mailcoy.com.");

    const dkimOk = dkimRecords.some((r) => r.toLowerCase().includes("v=dkim1") || r.includes("p="));
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
      .from("domains")
      .update(patch as never)
      .eq("id", domain.id)
      .select("*")
      .single();
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

export const runDnsHealthCheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: domains, error } = await supabaseAdmin
      .from("domains")
      .select("*")
      .eq("organization_id", ctx.organizationId);

    if (error || !domains) throw error ?? new Error("Failed to load domains");

    const RESEND_MX = "inbound-smtp.us-east-1.amazonaws.com";
    const auditResults: Array<{
      id: string;
      domain: string;
      mxOk: boolean;
      spfOk: boolean;
      dkimOk: boolean;
      dmarcOk: boolean;
      isHealthy: boolean;
    }> = [];

    for (const dom of domains) {
      const name = dom.domain_name;
      const selector = dom.dkim_selector || "resend";

      const [txtRecords, mxRecords, dkimRecords, dmarcRecords] = await Promise.all([
        doh(name, "TXT"),
        doh(name, "MX"),
        doh(`${selector}._domainkey.${name}`, "TXT"),
        doh(`_dmarc.${name}`, "TXT"),
      ]);

      const mxOk = mxRecords.some((r) => r.toLowerCase().includes(RESEND_MX));
      const spfOk = txtRecords.some(
        (r) =>
          r.toLowerCase().startsWith("v=spf1") &&
          (r.toLowerCase().includes("include:amazonses.com") ||
            r.toLowerCase().includes("_spf.mailcoy.com")),
      );
      const dkimOk = dkimRecords.some((r) => r.toLowerCase().includes("v=dkim1") || r.length > 20);
      const dmarcOk = dmarcRecords.some((r) => r.toLowerCase().startsWith("v=dmarc1"));

      const isHealthy = mxOk && spfOk;

      const patch = {
        mx_status: mxOk ? "verified" : "failed",
        spf_status: spfOk ? "verified" : "failed",
        dkim_status: dkimOk ? "verified" : "failed",
        dmarc_status: dmarcOk ? "verified" : "failed",
        verification_status: isHealthy ? "verified" : "failed",
        last_checked_at: new Date().toISOString(),
      };

      await supabaseAdmin.from("domains").update(patch as never).eq("id", dom.id);

      auditResults.push({
        id: dom.id,
        domain: name,
        mxOk,
        spfOk,
        dkimOk,
        dmarcOk,
        isHealthy,
      });
    }

    return { ok: true, count: domains.length, results: auditResults };
  });

export const autoConfigureCloudflareDNS = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        domainId: z.string(),
        cloudflareApiToken: z.string().min(10, "Please enter a valid Cloudflare API token"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    assertAdmin(ctx.role);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: dom, error: domErr } = await supabaseAdmin
      .from("domains")
      .select("*")
      .eq("id", data.domainId)
      .eq("organization_id", ctx.organizationId)
      .single();
    if (domErr || !dom) throw new Error("Domain not found in your organization");

    const token = data.cloudflareApiToken.trim();
    const domainName = dom.domain_name;

    // 1. Fetch Cloudflare Zone
    const zonesRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(domainName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const zonesData = await zonesRes.json();
    if (!zonesData.success || !zonesData.result || zonesData.result.length === 0) {
      throw new Error(
        `Cloudflare zone for '${domainName}' was not found. Please ensure your Cloudflare API token has 'Zone.DNS:Edit' permission for this domain.`,
      );
    }

    const zoneId = zonesData.result[0].id;

    // Desired DNS Records for Mailcoy (Resend-based routing)
    const records = [
      {
        type: "TXT",
        name: domainName,
        content: dom.txt_record_value?.startsWith("mailcoy-verify=")
          ? dom.txt_record_value
          : `mailcoy-verify=${dom.txt_record_value ?? "mailcoy-ready"}`,
        ttl: 3600,
        comment: "Mailcoy Domain Verification",
      },
      {
        // Resend inbound MX — routes incoming mail through Resend → Mailcoy webhook → Gmail
        type: "MX",
        name: domainName,
        content: "inbound-smtp.us-east-1.amazonaws.com",
        priority: 10,
        ttl: 3600,
        comment: "Mailcoy Inbound Mail Router (via Resend)",
      },
      {
        type: "TXT",
        name: `resend._domainkey.${domainName}`,
        content: dom.dkim_value || "v=DKIM1; k=rsa; p=",
        ttl: 3600,
        comment: "Mailcoy DKIM Signing (Resend)",
      },
      {
        type: "TXT",
        name: domainName,
        content: "v=spf1 include:amazonses.com ~all",
        ttl: 3600,
        comment: "Mailcoy SPF (Resend/SES)",
      },
      {
        type: "TXT",
        name: `_dmarc.${domainName}`,
        content: "v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com",
        ttl: 3600,
        comment: "Mailcoy DMARC Alignment",
      },
    ];

    let createdCount = 0;
    const errors: string[] = [];

    for (const rec of records) {
      try {
        const createRes = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(rec),
          },
        );
        const cData = await createRes.json();
        if (cData.success) {
          createdCount++;
        } else {
          // If record already exists, it's fine
          if (
            cData.errors?.[0]?.code === 81057 ||
            cData.errors?.[0]?.message?.includes("already exists")
          ) {
            createdCount++;
          } else {
            errors.push(cData.errors?.[0]?.message || "Record creation failed");
          }
        }
      } catch (e: any) {
        errors.push(e.message);
      }
    }

    return {
      success: true,
      recordsConfigured: createdCount,
      totalRecords: records.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  });

const REGISTRAR_PATTERNS: Array<{
  id: string;
  name: string;
  logo: string;
  patterns: RegExp[];
  helpUrl: string;
  steps: string[];
}> = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    logo: "https://cdn.brandfetch.io/idXBxQqmFb/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
    patterns: [/\.cloudflare\.com$/, /ns\d+\.cloudflare\.com$/],
    helpUrl: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/",
    steps: [
      "Log in to Cloudflare Dashboard at dash.cloudflare.com",
      "Select your domain from the list",
      "Click DNS → Records",
      "Click Add record for each entry in the table below",
      "Set Proxy to 'DNS Only' (Grey Cloud) for MX and verification records",
      "Save each record — changes take effect within seconds",
    ],
  },
  {
    id: "godaddy",
    name: "GoDaddy",
    logo: "https://cdn.brandfetch.io/idXYJoFMN4/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
    patterns: [/domaincontrol\.com$/, /ns\d+\.domaincontrol\.com$/],
    helpUrl: "https://www.godaddy.com/help/add-a-txt-record-19232",
    steps: [
      "Log in to your GoDaddy account",
      "Go to My Products → DNS → Manage Zones",
      "Select your domain",
      "Click Add in the DNS Records section",
      "Fill in the Type, Name, and Value fields for each record below",
      "Click Save — DNS propagation may take up to 48 hours",
    ],
  },
  {
    id: "namecheap",
    name: "Namecheap",
    logo: "https://cdn.brandfetch.io/idZqGOLHxY/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
    patterns: [/registrar-servers\.com$/, /dns\d+\.registrar-servers\.com$/],
    helpUrl: "https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/",
    steps: [
      "Log in to Namecheap and go to Domain List",
      "Click Manage next to your domain",
      "Click the Advanced DNS tab",
      "Click Add New Record for each entry below",
      "Set the Host (use @ for the root) and Value fields",
      "Click the green checkmark to save each record",
    ],
  },
  {
    id: "route53",
    name: "AWS Route 53",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Amazon_Route_53_logo.svg",
    patterns: [/awsdns-\d+\.(com|net|org|co\.uk)$/, /\.awsdns-/],
    helpUrl: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/rrsets-working-with.html",
    steps: [
      "Open AWS Console → Route 53 → Hosted Zones",
      "Select the hosted zone for your domain",
      "Click Create record for each entry below",
      "Set the record type, Name (subdomain), and Value",
      "Click Create records — changes propagate within 60 seconds",
    ],
  },
  {
    id: "hostinger",
    name: "Hostinger",
    logo: "https://cdn.brandfetch.io/id4Lom5kub/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
    patterns: [/hostinger\.(com|ro)$/, /ns\d+\.hostinger\.(com|ro)$/],
    helpUrl: "https://support.hostinger.com/en/articles/1583246",
    steps: [
      "Log in to hPanel at hpanel.hostinger.com",
      "Go to Domains → Manage → DNS / Nameservers",
      "Click Manage DNS Records → Add Record",
      "Select type, enter Name and Value for each record below",
      "Click Add to save — propagation takes 1–24 hours",
    ],
  },
  {
    id: "porkbun",
    name: "Porkbun",
    logo: "https://cdn.brandfetch.io/idZqGOLHxY/w/400/h/400/theme/dark/icon.jpeg?k=bfHSJFAPEa",
    patterns: [/porkbun\.com$/, /ns\d+\.porkbun\.com$/],
    helpUrl: "https://kb.porkbun.com/article/68-how-to-edit-domain-dns-records",
    steps: [
      "Log in to Porkbun and go to Domain Management",
      "Click Details next to your domain, then click Edit DNS Records",
      "Add the TXT, MX, and SPF records",
      "Submit changes",
    ],
  },
];

export const detectRegistrarFn = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ domain: z.string().trim().toLowerCase() }).parse(d))
  .handler(async ({ data }) => {
    const { lookupRdap } = await import("@/lib/rdap");
    const domain = data.domain;

    async function queryDoh(dohUrl: string): Promise<string[] | null> {
      try {
        const res = await fetch(dohUrl, { headers: { accept: "application/dns-json" } });
        if (!res.ok) return null;
        const json = (await res.json()) as { Status: number; Answer?: { data: string }[] };
        if (json.Status !== 0 || !json.Answer?.length) return [];
        return json.Answer.map((r) => r.data.toLowerCase().replace(/\.$/, ""));
      } catch {
        return null;
      }
    }

    const encoded = encodeURIComponent(domain);
    const [dohRes, rdapRes] = await Promise.allSettled([
      queryDoh(`https://dns.google/resolve?name=${encoded}&type=NS`),
      lookupRdap(domain),
    ]);

    const nsRecords: string[] = dohRes.status === "fulfilled" && dohRes.value ? dohRes.value : [];
    const rdap = rdapRes.status === "fulfilled" ? rdapRes.value : null;
    const allNameservers = Array.from(new Set([...nsRecords, ...(rdap?.nameservers || [])]));

    const combined = `${rdap?.registrar || ""} ${allNameservers.join(" ")}`.toLowerCase();
    let detected: typeof REGISTRAR_PATTERNS[number] | null = null;
    for (const reg of REGISTRAR_PATTERNS) {
      if (reg.patterns.some((p) => p.test(combined)) || combined.includes(reg.id)) {
        detected = reg;
        break;
      }
    }

    return {
      domain,
      isRegistered: rdap ? rdap.isRegistered : allNameservers.length > 0,
      registrarName: rdap?.registrar || detected?.name || null,
      registrar: detected
        ? {
            id: detected.id,
            name: detected.name,
            logo: detected.logo,
            helpUrl: detected.helpUrl,
            steps: detected.steps,
          }
        : null,
      nameservers: allNameservers,
      nsRecords: allNameservers,
      expiresAt: rdap?.expiresAt || null,
      createdAt: rdap?.createdAt || null,
    };
  });
