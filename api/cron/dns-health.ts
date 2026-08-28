import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "edge",
};

async function doh(name: string, type: "TXT" | "MX"): Promise<string[]> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { accept: "application/dns-json" } }
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

export default async function handler(req: Request) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  // Fetch all domains
  const { data: domains, error } = await supabaseAdmin
    .from("domains")
    .select("id, organization_id, domain_name, verification_status, mx_status, spf_status, dkim_status, dkim_selector, verified_at");

  if (error || !domains) {
    return new Response(JSON.stringify({ error: error?.message || "Failed to fetch domains" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const results: any[] = [];
  const RESEND_MX = "inbound-smtp.us-east-1.amazonaws.com";

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
      (r) => r.toLowerCase().startsWith("v=spf1") && (r.toLowerCase().includes("include:amazonses.com") || r.toLowerCase().includes("_spf.mailcoy.com"))
    );
    const dkimOk = dkimRecords.some((r) => r.toLowerCase().includes("v=dkim1") || r.length > 20);
    const dmarcOk = dmarcRecords.some((r) => r.toLowerCase().startsWith("v=dmarc1"));

    const wasVerified = dom.verification_status === "verified";
    const isHealthy = mxOk && spfOk;

    const patch: Record<string, any> = {
      mx_status: mxOk ? "verified" : "failed",
      spf_status: spfOk ? "verified" : "failed",
      dkim_status: dkimOk ? "verified" : "failed",
      dmarc_status: dmarcOk ? "verified" : "failed",
      last_checked_at: new Date().toISOString(),
    };

    if (!isHealthy && wasVerified) {
      patch.verification_status = "failed";

      if (resendApiKey) {
        try {
          const { data: ownerEmp } = await (supabaseAdmin
            .from("employees")
            .select("id, full_name, professional_email")
            .eq("organization_id", dom.organization_id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle() as any) as { data: any };

          if (ownerEmp) {
            const { data: gc } = await supabaseAdmin
              .from("gmail_connections")
              .select("google_email")
              .eq("employee_id", ownerEmp.id)
              .maybeSingle();

            const targetEmail = (gc as any)?.google_email || ownerEmp.professional_email;

            if (targetEmail) {
              const issues: string[] = [];
              if (!mxOk) issues.push(`• <strong>MX Record:</strong> Missing required record <code>10 ${RESEND_MX}</code>`);
              if (!spfOk) issues.push(`• <strong>SPF Record:</strong> Missing <code>v=spf1 include:amazonses.com ~all</code>.`);

              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  from: "Mailcoy Deliverability <router@mailcoy.com>",
                  to: [targetEmail],
                  subject: `⚠️ Action Required: DNS Deliverability Alert for ${name}`,
                  html: `
                    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #fee2e2;border-radius:12px;background:#fffaf0;">
                      <h2 style="color:#b91c1c;margin-top:0;">⚠️ Deliverability Warning: ${name}</h2>
                      <p style="font-size:14px;color:#4b5563;">
                        Our automated health monitor detected broken DNS records for <strong>${name}</strong>.
                      </p>
                      <div style="background:#ffffff;padding:16px;border-radius:8px;border:1px solid #fecaca;margin:16px 0;font-size:13px;line-height:1.6;">
                        ${issues.join("<br/>")}
                      </div>
                      <p style="font-size:13px;color:#4b5563;">
                        To prevent emails from bouncing or landing in spam, please restore the records in your DNS provider, or visit your Domains dashboard.
                      </p>
                      <div style="margin-top:20px;">
                        <a href="https://www.mailcoy.com/domains" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">
                          View Domains Dashboard →
                        </a>
                      </div>
                    </div>
                  `,
                }),
              });
            }
          }
        } catch (alertErr) {
          console.error(`[DNS Health Cron] Failed to send alert for ${name}:`, alertErr);
        }
      }
    }

    await supabaseAdmin
      .from("domains")
      .update(patch as never)
      .eq("id", dom.id);

    results.push({ domain: name, mxOk, spfOk, dkimOk, dmarcOk });
  }

  return new Response(JSON.stringify({ ok: true, scannedCount: domains.length, results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
