// Public scheduled endpoint — invoked by pg_cron every 15 minutes to
// re-verify domains still in a pending/failed state. Authenticated by
// the Supabase publishable/anon apikey header (matched to the value
// baked into the cron schedule).
import { createFileRoute } from "@tanstack/react-router";

const REQUIRED_MX = ["mx1.mailcoy.connect", "mx2.mailcoy.connect"];

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
      return s.replace(/"\s+"/g, "");
    });
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/api/public/hooks/verify-domains")({
  server: {
    handlers: {
      POST: async ({ request }: any) => {
        const key = request.headers.get("apikey") ?? "";
        const expected = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
        if (!expected || key !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: domains, error } = await supabaseAdmin
          .from("domains")
          .select("id, domain_name, dkim_selector, txt_record_value, verified_at")
          .in("verification_status", ["pending", "failed"])
          .limit(50);
        if (error) return new Response(error.message, { status: 500 });

        let processed = 0;
        for (const d of domains ?? []) {
          const name = (d as { domain_name: string }).domain_name;
          const selector = (d as { dkim_selector: string | null }).dkim_selector ?? "mailcoy";
          const expectedTxt = (d as { txt_record_value: string | null }).txt_record_value ?? "";

          const [txt, mx, dkimTxt, dkimCname, dmarc] = await Promise.all([
            doh(name, "TXT"),
            doh(name, "MX"),
            doh(`${selector}._domainkey.${name}`, "TXT"),
            doh(`${selector}._domainkey.${name}`, "CNAME" as any),
            doh(`_dmarc.${name}`, "TXT"),
          ]);

          const txtOk = txt.some((r) => r.includes(expectedTxt) || (expectedTxt.startsWith("mailcoy-verify=") && r.includes(expectedTxt.replace("mailcoy-verify=", ""))));
          const mxOk = mx.some((r) => {
            const low = r.toLowerCase();
            return (
              low.includes("inbound-smtp.us-east-1.amazonaws.com") ||
              low.includes("amazonses.com") ||
              low.includes("mailcoy.com") ||
              low.includes("mailcoy.connect")
            );
          });
          const spfOk = txt.some((r) => {
            const low = r.toLowerCase();
            return (
              low.startsWith("v=spf1") &&
              (low.includes("include:amazonses.com") ||
                low.includes("include:resend.com") ||
                low.includes("_spf.mailcoy.com") ||
                low.includes("_spf.mailcoy.connect"))
            );
          });
          const dkimOk =
            dkimTxt.some((r) => r.toLowerCase().includes("v=dkim1")) ||
            dkimCname.length > 0;
          const dmarcOk = dmarc.some((r) => r.toLowerCase().startsWith("v=dmarc1"));

          const verified = txtOk && mxOk;
          const now = new Date().toISOString();
          await supabaseAdmin
            .from("domains")
            .update({
              txt_status: txtOk ? "verified" : "failed",
              mx_status: mxOk ? "verified" : "failed",
              spf_status: spfOk ? "verified" : "failed",
              dkim_status: dkimOk ? "verified" : "failed",
              dmarc_status: dmarcOk ? "verified" : "failed",
              verification_status: verified ? "verified" : "failed",
              last_checked_at: now,
              verified_at: verified
                ? (d as { verified_at: string | null }).verified_at ?? now
                : (d as { verified_at: string | null }).verified_at,
            } as never)
            .eq("id", (d as { id: string }).id);
          processed++;
        }

        return Response.json({ ok: true, processed });
      },
    },
  },
});
