import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listApiKeys, createApiKey, revokeApiKey } from "@/lib/platform.functions";
import { Card, Button, Input, ConfirmDeleteModal } from "@/components/app/AppShell";
import { KeyRound, Copy, Check, Plus, Trash2, Terminal, CheckCircle2, Shield, X, AlertTriangle, EyeOff } from "lucide-react";

const opts = queryOptions({ queryKey: ["api-keys"], queryFn: async () => listApiKeys(), staleTime: 15_000 });

export const Route = createFileRoute("/_authenticated/_shell/settings/api-keys")({
  head: () => ({ meta: [{ title: "API & Developers — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(opts),
  component: ApiKeysRoute,
});

function ApiKeysRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(opts);
  const create = useServerFn(createApiKey);
  const revoke = useServerFn(revokeApiKey);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<string[]>(["email:send", "domains:read"]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // One-time reveal modal
  const [revealKey, setRevealKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Revoke state
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingBusy, setRevokingBusy] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const r = await create({ data: { name, scopes } });
      await qc.invalidateQueries({ queryKey: ["api-keys"] });
      setOpenCreateModal(false);
      setName("");
      setRevealKey((r as { key: string }).key);
    } catch (err: any) {
      setError(err?.message || "Failed to generate API key");
    } finally {
      setBusy(false);
    }
  }

  const copyKey = () => {
    if (revealKey) {
      navigator.clipboard.writeText(revealKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  async function handleConfirmRevoke() {
    if (!revokingId) return;
    setRevokingBusy(true);
    try {
      await revoke({ data: { id: revokingId } });
      await qc.invalidateQueries({ queryKey: ["api-keys"] });
      setRevokingId(null);
    } catch (err: any) {
      alert(err?.message || "Failed to revoke key");
    } finally {
      setRevokingBusy(false);
    }
  }

  const toggleScope = (s: string) => {
    setScopes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> API Keys
          </h3>
          <p className="mt-1 text-[13px] text-ink-3">
            Manage secret keys to authenticate automated requests to the Mailcoy REST API.
          </p>
        </div>
        <Button onClick={() => setOpenCreateModal(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create new secret key
        </Button>
      </div>

      {/* Standard API Keys Table */}
      <Card className="p-0 overflow-hidden shadow-xs border-line">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted/50 text-[11.5px] uppercase tracking-wider font-semibold text-ink-3">
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Secret Key</th>
                <th className="px-5 py-3.5">Permissions</th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-ink-3">
                    No secret API keys yet. Click <span className="font-semibold text-ink">"Create new secret key"</span> to generate one.
                  </td>
                </tr>
              ) : (
                data.map((k: any) => {
                  const isRevoked = Boolean(k.revoked_at);
                  return (
                    <tr key={k.id} className="hover:bg-surface-muted/30 transition">
                      <td className="px-5 py-4 font-semibold text-ink whitespace-nowrap">
                        {k.name}
                      </td>
                      <td className="px-5 py-4 font-mono text-[12.5px] text-ink-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-ink">{k.prefix}</span>
                          <span className="text-ink-4 tracking-widest">••••••••••••••••</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {(k.scopes || ["email:send"]).slice(0, 2).map((sc: string) => (
                            <span key={sc} className="px-2 py-0.5 rounded-md bg-ink/[0.04] text-[11px] font-mono text-ink-3">
                              {sc.replace(":", ".")}
                            </span>
                          ))}
                          {(k.scopes || []).length > 2 && (
                            <span className="text-[11px] text-ink-4 font-mono">+{k.scopes.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12.5px] text-ink-3 whitespace-nowrap">
                        {new Date(k.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {isRevoked ? (
                          <span className="text-[11.5px] font-mono uppercase text-danger/80 bg-danger/10 px-2 py-0.5 rounded">
                            Revoked
                          </span>
                        ) : (
                          <Button
                            variant="ghost"
                            onClick={() => setRevokingId(k.id)}
                            className="text-danger hover:bg-danger/10 text-[12px] h-7 px-2"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Developer cURL Example */}
      <Card className="p-5 bg-surface-muted/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink font-semibold text-[13.5px]">
            <Terminal className="h-4 w-4 text-primary" /> Integration Quickstart
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              const snippet = `curl -X POST https://api.mailcoy.com/v1/send \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "from": "sales@yourcompany.com",\n    "to": "client@gmail.com",\n    "subject": "Quote Estimation",\n    "html": "<p>Hello! Here is your custom proposal.</p>"\n  }'`;
              navigator.clipboard.writeText(snippet);
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2500);
            }}
            className="h-8 px-2.5 text-[12px] gap-1.5 hover:bg-ink/[0.05]"
          >
            {copiedSnippet ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedSnippet ? "Copied" : "Copy snippet"}
          </Button>
        </div>
        <p className="text-[12.5px] text-ink-3">
          Pass your secret key in the standard <code className="font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">Authorization: Bearer</code> header:
        </p>
        <pre className="p-4 rounded-xl bg-ink text-background text-[12px] font-mono overflow-x-auto leading-relaxed">
{`curl -X POST https://api.mailcoy.com/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sales@yourcompany.com",
    "to": "client@gmail.com",
    "subject": "Quote Estimation",
    "html": "<p>Hello! Here is your custom proposal.</p>"
  }'`}
        </pre>
      </Card>

      {/* Modal 1: Create New Secret Key */}
      {openCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                <KeyRound className="h-5 w-5 text-primary" /> Create new secret key
              </div>
              <button
                onClick={() => setOpenCreateModal(false)}
                className="text-ink-4 hover:text-ink transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-1.5">
                <label className="text-[13px] font-semibold text-ink-2">Name</label>
                <Input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Production Webhook Backend"
                  className="h-10"
                />
                <p className="text-[11.5px] text-ink-3">A descriptive name to distinguish this key.</p>
              </div>

              {/* Scopes */}
              <div className="space-y-2 pt-1">
                <label className="text-[12.5px] font-semibold text-ink-2">Permissions</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "email:send", label: "Send Emails", desc: "Route outbound mail via custom domain" },
                    { id: "domains:read", label: "Inspect Domains", desc: "Check DNS records and domain status" },
                    { id: "logs:read", label: "Read Logs", desc: "Query message delivery events" },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => toggleScope(sc.id)}
                      className={`p-3 text-left rounded-xl border transition flex items-center justify-between ${
                        scopes.includes(sc.id)
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-line bg-surface text-ink-3 hover:bg-surface-muted"
                      }`}
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-ink">{sc.label}</div>
                        <div className="text-[11px] text-ink-4 mt-0.5">{sc.desc}</div>
                      </div>
                      {scopes.includes(sc.id) && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-[12.5px] text-danger">
                  {error}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpenCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy || !name.trim()}>
                  {busy ? "Creating…" : "Create secret key"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Industry-Standard ONE-TIME Secret Key Reveal */}
      {revealKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                <EyeOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">Save your secret key</h3>
                <p className="text-[12.5px] text-ink-3">Please save this secret key somewhere safe and accessible.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[12.5px] flex items-start gap-2.5 leading-relaxed">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                For security reasons, <strong>you won't be able to view this key again</strong> through your account. If you lose this key, you will need to generate a new one.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-semibold text-ink-3">Secret Key</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={revealKey}
                  className="h-10 flex-1 rounded-xl border border-line bg-surface-muted px-3 text-[13px] font-mono text-ink outline-none"
                />
                <Button onClick={copyKey} className="gap-1.5 shrink-0 h-10 px-4">
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={() => {
                  setRevealKey(null);
                  setCopied(false);
                }}
                className="w-full sm:w-auto"
              >
                Done / I have saved this key
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Revocation Modal */}
      {revokingId && (
        <ConfirmDeleteModal
          title="Revoke API Key"
          description="Are you sure you want to revoke this API key? Any applications, forms, or automated systems using it will immediately be denied access."
          confirmLabel="Revoke Key"
          busy={revokingBusy}
          onConfirm={handleConfirmRevoke}
          onCancel={() => setRevokingId(null)}
        />
      )}
    </div>
  );
}
