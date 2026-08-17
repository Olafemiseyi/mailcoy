import { createFileRoute } from "@tanstack/react-router";
import { lookupRdap } from "@/lib/rdap";

// Known registrar/nameserver fingerprints
const REGISTRAR_MAP: Array<{
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

function detectRegistrar(nsRecords: string[], registrarName?: string | null): typeof REGISTRAR_MAP[number] | null {
  const combined = `${registrarName || ""} ${nsRecords.join(" ")}`.toLowerCase();
  for (const reg of REGISTRAR_MAP) {
    if (reg.patterns.some((p) => p.test(combined)) || combined.includes(reg.id)) {
      return reg;
    }
  }
  return null;
}

export const Route = createFileRoute("/api/registrar-detect")({
  server: {
    handlers: {
      GET: async ({ request }: any) => {
        const url = new URL(request.url);
        const domain = url.searchParams.get("domain")?.trim().toLowerCase();
        if (!domain) {
          return Response.json({ error: "Missing domain parameter" }, { status: 400 });
        }

        // 1. Parallel DNS-over-HTTPS (DoH) & RDAP query
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

        const nsRecords: string[] = (dohRes.status === "fulfilled" && dohRes.value) ? dohRes.value : [];
        const rdap = rdapRes.status === "fulfilled" ? rdapRes.value : null;

        const allNameservers = Array.from(new Set([...nsRecords, ...(rdap?.nameservers || [])]));
        const registrar = detectRegistrar(allNameservers, rdap?.registrar);

        return Response.json({
          domain,
          isRegistered: rdap ? rdap.isRegistered : allNameservers.length > 0,
          registrarName: rdap?.registrar || registrar?.name || null,
          registrar: registrar ? {
            id: registrar.id,
            name: registrar.name,
            logo: registrar.logo,
            helpUrl: registrar.helpUrl,
            steps: registrar.steps,
          } : null,
          nameservers: allNameservers,
          expiresAt: rdap?.expiresAt || null,
          createdAt: rdap?.createdAt || null,
        });
      },
    },
  },
});
