// Admin system status — reuses the public /api/public/status probes.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/app/AppShell";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

type CheckStatus = "operational" | "degraded" | "outage";
interface Probe { id: string; name: string; status: CheckStatus; latency_ms: number; message?: string }
interface StatusPayload { status: CheckStatus; checked_at: string; probes: Probe[] }

export const Route = createFileRoute("/admin/status")({
  head: () => ({
    meta: [
      { title: "System status — Admin — Mailcoy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStatus,
});

function Icon({ s }: { s: CheckStatus }) {
  if (s === "operational") return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  if (s === "degraded") return <AlertTriangle className="h-5 w-5 text-amber-600" />;
  return <XCircle className="h-5 w-5 text-red-600" />;
}

function AdminStatus() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/public/status", { cache: "no-store" });
      setData(await res.json());
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); const t = setInterval(load, 15_000); return () => clearInterval(t); }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">System status</h1>
          <p className="text-[13.5px] text-ink-3 mt-1">
            Live probes against production services. The same data powers the public status page at <code className="text-ink-2">/status</code>.
          </p>
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line text-[13px]">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      <Card className="p-0 mb-8">
        {(data?.probes ?? []).map((p) => (
          <div key={p.id} className="flex items-center justify-between px-5 py-4 border-b border-line last:border-b-0">
            <div className="flex items-center gap-3">
              <Icon s={p.status} />
              <div>
                <div className="font-medium">{p.name}</div>
                {p.message && <div className="text-[12.5px] text-ink-3 mt-0.5">{p.message}</div>}
              </div>
            </div>
            <div className="text-[12.5px] text-ink-3 font-mono">{p.latency_ms} ms</div>
          </div>
        ))}
        {!data && <div className="p-8 text-center text-ink-3 text-[13.5px]">Loading…</div>}
      </Card>

      {/* Super-Admin Global Provider Control */}
      <div className="border-t border-line pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
              Master Routing Engine (Resend & Amazon SES)
            </h2>
            <p className="text-[13px] text-ink-3">
              Switch the underlying platform delivery engine globally. Customers and employees are unaffected.
            </p>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
            Invisible to Users
          </span>
        </div>

        <Card className="p-5 border-line bg-surface">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03]">
              <div className="flex items-center justify-between mb-1.5">
                <strong className="text-[14px] text-ink font-semibold">Resend Free Engine</strong>
                <span className="text-[10.5px] font-medium uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  Active Default
                </span>
              </div>
              <p className="text-[12px] text-ink-3 leading-relaxed">
                Requires zero credit card setup. All initial users and domains route smoothly through the built-in Resend delivery pipeline.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface-muted/40">
              <div className="flex items-center justify-between mb-1.5">
                <strong className="text-[14px] text-ink font-semibold">Amazon SES ($0.10/10k)</strong>
                <span className="text-[10.5px] font-medium uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                  High Volume Ready
                </span>
              </div>
              <p className="text-[12px] text-ink-3 leading-relaxed">
                When you gain hundreds of users, plug in your AWS SES credentials to lower costs by 95% at massive scale.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Global Email Master Search */}
      <div className="border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink mb-1">
          Global Email & Delivery Audit Search
        </h2>
        <p className="text-[13px] text-ink-3 mb-4">
          Trace any inbound or outbound email across all tenant organizations in real time.
        </p>

        <Card className="p-5">
          <div className="flex gap-2 mb-4">
            <input
              id="admin-email-search-input"
              placeholder="Search by sender, receiver, subject, or domain..."
              className="flex-1 h-9 px-3 rounded-lg border border-line bg-background text-[13px] outline-none focus:border-primary"
            />
            <button
              onClick={async () => {
                const input = document.getElementById("admin-email-search-input") as HTMLInputElement;
                const resultDiv = document.getElementById("admin-email-search-results");
                if (!input || !resultDiv) return;
                resultDiv.innerHTML = "<div class='py-4 text-center text-[12px] text-ink-3'>Searching logs...</div>";
                try {
                  const { searchGlobalEmailLogs } = await import("@/lib/admin.functions");
                  const logs = await searchGlobalEmailLogs({ data: { query: input.value, limit: 15 } });
                  if (logs.length === 0) {
                    resultDiv.innerHTML = "<div class='py-4 text-center text-[12px] text-ink-3'>No matching emails found.</div>";
                    return;
                  }
                  resultDiv.innerHTML = `
                    <div class="divide-y divide-line border border-line rounded-lg overflow-hidden text-[12.5px]">
                      ${logs.map((l: any) => `
                        <div class="p-3 bg-surface hover:bg-surface-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div class="min-w-0">
                            <div class="font-medium text-ink truncate">${l.subject || "No Subject"}</div>
                            <div class="text-[11.5px] text-ink-3 font-mono truncate">${l.from_addr} &rarr; ${l.to_addr}</div>
                          </div>
                          <div class="flex items-center gap-2 shrink-0">
                            <span class="px-2 py-0.5 rounded-full text-[10.5px] font-semibold uppercase ${l.status === 'sent' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}">${l.status}</span>
                            <span class="text-[11px] text-ink-4">${new Date(l.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      `).join("")}
                    </div>
                  `;
                } catch (e: any) {
                  resultDiv.innerHTML = `<div class='py-4 text-center text-[12px] text-rose-600'>${e.message || "Failed to query logs"}</div>`;
                }
              }}
              className="px-4 h-9 rounded-lg bg-primary text-primary-foreground font-medium text-[13px] hover:bg-primary-focus transition"
            >
              Search
            </button>
          </div>
          <div id="admin-email-search-results"></div>
        </Card>
      </div>

      {/* Platform Broadcast Announcement */}
      <div className="border-t border-line pt-6">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink mb-1">
          Platform Broadcast Announcement
        </h2>
        <p className="text-[13px] text-ink-3 mb-4">
          Broadcast a top-level announcement or maintenance banner to all logged-in customer organizations.
        </p>

        <Card className="p-5 space-y-3">
          <textarea
            id="admin-broadcast-msg"
            rows={2}
            placeholder="e.g. Scheduled maintenance in 15 minutes. Outbound routing will remain uninterrupted."
            className="w-full text-[13px] p-3 rounded-lg border border-line bg-background text-ink outline-none focus:border-primary"
          />
          <div className="flex justify-between items-center pt-2">
            <span className="text-[12px] text-ink-3">Banner will render at top of all tenant workspaces</span>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  const { setPlatformBroadcast } = await import("@/lib/admin.functions");
                  await setPlatformBroadcast({ data: { message: "", enabled: false, level: "info" } });
                  alert("Broadcast cleared from all customer dashboards.");
                }}
                className="px-3 h-8 rounded-md border border-line text-[12px] text-ink-3 hover:text-danger transition"
              >
                Clear Banner
              </button>
              <button
                onClick={async () => {
                  const msg = (document.getElementById("admin-broadcast-msg") as HTMLTextAreaElement)?.value;
                  if (!msg) return;
                  const { setPlatformBroadcast } = await import("@/lib/admin.functions");
                  await setPlatformBroadcast({ data: { message: msg, enabled: true, level: "info" } });
                  alert("Broadcast successfully published to all workspaces!");
                }}
                className="px-4 h-8 rounded-md bg-primary text-primary-foreground font-medium text-[12px] hover:bg-primary-focus transition"
              >
                Publish Broadcast
              </button>
            </div>
          </div>
        </Card>
      </div>

      {data && <p className="mt-6 text-[12px] text-ink-3">Last checked {new Date(data.checked_at).toLocaleString()}</p>}
    </div>
  );
}
