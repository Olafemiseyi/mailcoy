import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listWebhooks, createWebhook, deleteWebhook } from "@/lib/platform.functions";
import { Card, Button, Input, Field, PageHeader, ConfirmDeleteModal } from "@/components/app/AppShell";
import { Webhook, Plus, Trash2, Copy, Check, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";

const opts = queryOptions({ queryKey: ["webhooks"], queryFn: async () => listWebhooks(), staleTime: 30_000 });
const EVENTS = ["email.sent", "email.delivered", "email.bounced", "email.complained", "domain.verified", "employee.connected"] as const;

export const Route = createFileRoute("/_authenticated/_shell/settings/webhooks")({
  head: () => ({ meta: [{ title: "Webhooks — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: WebhooksRoute,
});

function WebhooksRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const create = useServerFn(createWebhook);
  const del = useServerFn(deleteWebhook);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["email.bounced", "email.delivered"]);
  const [reveal, setReveal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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

  const handleCopySecret = () => {
    if (reveal) {
      navigator.clipboard.writeText(reveal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="Webhooks"
          subtitle="Receive real-time HTTP POST notifications whenever emails deliver, bounce, or domains verify."
        />
      </div>

      <Card className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 text-ink font-semibold text-[14.5px]">
          <Webhook className="h-4 w-4 text-primary" /> Create New Webhook Endpoint
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Endpoint URL" hint="Must be a publicly accessible HTTPS URL.">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              type="url"
              placeholder="https://api.yourcompany.com/webhooks/mailcoy"
            />
          </Field>

          <div>
            <div className="mb-2 text-[13px] font-semibold text-ink-2">Trigger Events:</div>
            <div className="flex flex-wrap gap-2">
              {EVENTS.map((ev) => {
                const active = events.includes(ev);
                return (
                  <button
                    type="button"
                    key={ev}
                    onClick={() => toggle(ev)}
                    className={`h-8 px-3 rounded-lg text-[12px] font-mono transition-all border cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                        : "border-line bg-surface text-ink-2 hover:bg-ink/[0.04]"
                    }`}
                  >
                    {active && "✓ "}
                    {ev}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={busy || !url.trim() || events.length === 0}
              className="w-full sm:w-auto whitespace-nowrap justify-center"
            >
              {busy ? "Creating…" : "Create webhook"}
            </Button>
          </div>
        </form>

        {reveal && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-[13px] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Webhook Signing Secret
              </div>
              <button
                type="button"
                onClick={handleCopySecret}
                className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Secret"}
              </button>
            </div>
            <p className="text-[11.5px] text-ink-3">
              Copy this secret now to verify <code className="font-mono text-ink font-semibold">X-Mailcoy-Signature</code> headers. It will not be shown again.
            </p>
            <code className="block p-2 rounded-lg bg-surface border border-line text-[11px] font-mono text-ink overflow-x-auto select-all">
              {reveal}
            </code>
          </div>
        )}
      </Card>

      <Card className="p-0 overflow-hidden shadow-xs border-line">
        <div className="px-5 py-4 border-b border-line">
          <h3 className="font-display text-[14.5px] font-semibold text-ink">Active Webhooks</h3>
        </div>
        {data.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-ink-3">No active webhooks configured.</div>
        ) : (
          <ul className="divide-y divide-line">
            {data.map((w: any) => (
              <li key={w.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[13px] font-semibold text-ink truncate">{w.url}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {w.events.map((ev: string) => (
                      <span key={ev} className="text-[10.5px] font-mono rounded-md bg-ink/[0.05] text-ink px-1.5 py-0.5 border border-line/40">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setPendingDeleteId(w.id)}
                  className="text-danger hover:bg-danger/10 text-[12px] h-8 px-3 shrink-0 whitespace-nowrap self-start sm:self-auto"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {pendingDeleteId && (
        <ConfirmDeleteModal
          title="Delete Webhook Endpoint?"
          description="Are you sure you want to delete this webhook endpoint? Event delivery to this URL will stop immediately."
          confirmLabel="Delete webhook"
          onConfirm={async () => {
            try {
              await del({ data: { id: pendingDeleteId } });
              await qc.invalidateQueries({ queryKey: ["webhooks"] });
            } finally {
              setPendingDeleteId(null);
            }
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
