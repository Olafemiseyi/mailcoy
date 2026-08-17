import { createFileRoute } from "@tanstack/react-router";

interface DohRecord { name: string; type: number; TTL: number; data: string }
interface DohResponse { Status: number; Answer?: DohRecord[] }

async function queryDoh(url: string): Promise<string[] | null> {
  try {
    const res = await fetch(url, { headers: { accept: "application/dns-json" } });
    if (!res.ok) return null;
    const json = (await res.json()) as DohResponse;
    if (json.Status !== 0 || !json.Answer?.length) return [];
    return json.Answer.map((r) => r.data);
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/dns-resolve")({
  server: {
    handlers: {
      GET: async ({ request }: any) => {
        const url = new URL(request.url);
        const name = url.searchParams.get("name")?.trim().toLowerCase();
        const type = url.searchParams.get("type")?.toUpperCase();
        if (!name || !type || !["TXT", "MX", "A", "AAAA", "CNAME"].includes(type)) {
          return Response.json({ error: "Invalid name or type" }, { status: 400 });
        }
        const encoded = encodeURIComponent(name);
        const google = await queryDoh(`https://dns.google/resolve?name=${encoded}&type=${type}`);
        if (google !== null) return Response.json({ answers: google });
        const cf = await queryDoh(`https://cloudflare-dns.com/dns-query?name=${encoded}&type=${type}`);
        if (cf !== null) return Response.json({ answers: cf });
        return Response.json({ answers: [], error: "All DoH resolvers failed" }, { status: 502 });
      },
    },
  },
});