import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listWebhooks, createWebhook, deleteWebhook } from "@/lib/platform.functions";
import { Card, Button, Input, Field } from "@/components/app/AppShell";

const opts = queryOptions({ queryKey: ["webhooks"], queryFn: async () => listWebhooks(), staleTime: 30_000 });
const EVENTS = ["email.sent", "email.delivered", "email.bounced", "email.complained", "domain.verified", "employee.connected"] as const;

export const Route = createFileRoute("/_authenticated/_shell/settings/webhooks")({
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: WebhooksRoute,
});

function WebhooksRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const create = useServerFn(createWebhook);
  const del = useServerFn(deleteWebhook);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["email.bounced"]);
  const [reveal, setReveal] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggle(ev: string) {
    setEvents((prev) => prev.includes(ev) ? prev.filter((x) => x !== ev) : [...prev, ev]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await create({ data: { url, events } });
      await qc.invalidateQueries({ queryKey: ["webhooks"] });
      setReveal((r as { secret: string }).secret);
      setUrl("");
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-2xl">
      <Card className="p-5 mb-6">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Endpoint URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://api.example.com/webhooks/mailcoy" /></Field>
          <div>
            <div className="mb-1.5 text-[13px] font-medium text-ink-2">Events</div>
            <div className="flex flex-wrap gap-2">
              {EVENTS.map((ev) => (
                <button
                  type="button" key={ev} onClick={() => toggle(ev)}
                  className={`h-8 px-3 rounded-md text-[12px] border ${events.includes(ev) ? "bg-primary text-primary-foreground border-primary" : "border-line text-ink-2 hover:bg-ink/[0.04]"}`}
                >{ev}</button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={busy || events.length === 0}>{busy ? "Creating…" : "Create webhook"}</Button>
        </form>
        {reveal && (
          <div className="mt-4 p-3 rounded-md bg-emerald-500/10 text-[12.5px]">
            <div className="font-medium mb-1">Signing secret — copy now, won't be shown again.</div>
            <code className="font-mono break-all">{reveal}</code>
          </div>
        )}
      </Card>

      <Card className="p-0">
        {data.length === 0 ? (
          <div className="p-8 text-center text-[13.5px] text-ink-3">No webhooks configured.</div>
        ) : (
          <ul className="divide-y divide-line">
            {data.map((w: any) => (
              <li key={w.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono text-[12.5px] truncate">{w.url}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {w.events.map((ev: string) => <span key={ev} className="text-[10.5px] rounded bg-ink/[0.05] px-1.5 py-0.5">{ev}</span>)}
                  </div>
                </div>
                <Button variant="ghost" onClick={async () => { if (confirm("Delete webhook?")) { await del({ data: { id: w.id } }); qc.invalidateQueries({ queryKey: ["webhooks"] }); } }}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
