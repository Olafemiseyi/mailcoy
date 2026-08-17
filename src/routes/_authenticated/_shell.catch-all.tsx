import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getOrgSettings, updateCatchAll } from "@/lib/analytics.functions";
import { PageHeader, Card, Button, Input, Field } from "@/components/app/AppShell";
import { Inbox, Reply, Forward, AlertCircle, Power, Lock } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { getMyOrganization } from "@/lib/orgs.functions";

const settingsOpts = queryOptions({ queryKey: ["org-settings"], queryFn: async () => getOrgSettings(), staleTime: 30_000 });

type Mode = "receive" | "reject" | "forward";

export const Route = createFileRoute("/_authenticated/_shell/catch-all")({
  head: () => ({ meta: [{ title: "Catch-all & Shared Inboxes — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(settingsOpts),
  component: CatchAllRoute,
});

function CatchAllRoute() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(settingsOpts);
  const save = useServerFn(updateCatchAll);
  const fetchOrg = useServerFn(getMyOrganization);
  const { data: org } = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => fetchOrg(),
    staleTime: 60_000,
  });

  const isFreePlan = org?.subscription?.planCode === "free";

  const [enabled, setEnabled] = useState<boolean>(((data?.catchall_mode as Mode) ?? "reject") !== "reject");
  const [activeMode, setActiveMode] = useState<"receive" | "forward">(
    (data?.catchall_mode === "forward") ? "forward" : "receive"
  );
  const [forwardTo, setForwardTo] = useState<string>((data?.catchall_forward_to as string | null) ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const m = (data?.catchall_mode as Mode) ?? "reject";
    setEnabled(m !== "reject");
    if (m !== "reject") {
      setActiveMode(m);
    }
    setForwardTo((data?.catchall_forward_to as string | null) ?? "");
  }, [data]);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErr(null); setSaved(false); setBusy(true);
    const finalMode: Mode = enabled ? activeMode : "reject";
    try {
      await save({ data: { catchall_mode: finalMode, catchall_forward_to: finalMode === "forward" ? forwardTo : null } });
      await qc.invalidateQueries({ queryKey: ["org-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setBusy(false); }
  }

  const options = [
    { key: "receive", label: "Receive to Shared Inbox", desc: "Unknown mail is collected and visible in your workspace logs.", icon: Inbox },
    { key: "forward", label: "Forward to Address", desc: "Instantly forward unknown mail to a specific external inbox.", icon: Forward },
  ] as const;

  return (
    <div>
      <PageHeader
        title="Catch-all mail"
        subtitle="Manage what happens when someone sends mail to an address that doesn't match any employee or alias."
      />
      <Card className="p-0 max-w-2xl overflow-hidden">
        
        {/* Master Toggle Area */}
        <div className={`p-6 border-b border-line flex items-center justify-between transition-colors ${enabled ? "bg-primary/[0.02]" : "bg-surface-muted"}`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${enabled ? "bg-primary/10 text-primary" : "bg-ink/10 text-ink-3"}`}>
              <Power className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-[15px] font-semibold text-ink">
                Catch-all is {enabled ? "Active" : "Disabled"}
              </h2>
              <p className="text-[12.5px] text-ink-3 mt-0.5">
                {enabled ? "Unknown mail is being processed." : "Unknown mail is automatically rejected (bounced)."}
              </p>
            </div>
          </div>
          <Switch.Root
            checked={enabled}
            disabled={isFreePlan}
            onCheckedChange={(c) => { setEnabled(c); setSaved(false); }}
            className={`w-[42px] h-[24px] rounded-full relative transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 inline-flex items-center ${enabled ? 'bg-primary' : 'bg-ink-3/40'} ${isFreePlan ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Switch.Thumb className={`block w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 ${enabled ? 'translate-x-[21px]' : 'translate-x-[3px]'}`} />
          </Switch.Root>
        </div>

        {/* Configuration Area */}
        {isFreePlan ? (
          <div className="p-10 flex flex-col items-center justify-center text-center bg-surface-muted/30">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold">Catch-all is a Growth Pro feature</h3>
            <p className="text-[13.5px] text-ink-3 mt-2 max-w-md">
              Upgrade to route misaddressed emails to a shared inbox or forward them to an external address automatically.
            </p>
            <Button
              className="mt-6"
              onClick={() => { window.location.href = "/settings/billing"; }}
            >
              Upgrade to Growth Pro
            </Button>
          </div>
        ) : enabled && (
          <div className="p-6">
            <form onSubmit={submit} className="space-y-6">
              
              <div className="space-y-3">
                {options.map((o) => {
                  const Icon = o.icon;
                  return (
                    <label
                      key={o.key}
                      className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                        activeMode === o.key ? "border-primary bg-primary/[0.03]" : "border-line hover:bg-ink/[0.02]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="catchall-mode"
                        checked={activeMode === o.key}
                        onChange={() => { setActiveMode(o.key); setSaved(false); }}
                        className="mt-1 accent-primary"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${activeMode === o.key ? "text-primary" : "text-ink-3"}`} />
                          <div className="text-[13.5px] font-semibold">{o.label}</div>
                        </div>
                        <div className="text-[12.5px] text-ink-3 mt-1 leading-relaxed">{o.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {activeMode === "receive" && (
                <div className="rounded-lg border border-line bg-surface-muted/50 p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-medium text-ink-2 mb-2">
                    <Inbox className="h-4 w-4 text-ink-3" /> Shared Inbox Route
                  </div>
                  <div className="text-[12.5px] text-ink-3">
                    Mail sent to unknown addresses (like <span className="font-mono text-ink text-[11.5px] bg-ink/[0.05] px-1 py-0.5 rounded">anything@your-domain.com</span>) will be stored silently. You can view these messages in the Email Logs.
                  </div>
                </div>
              )}

              {activeMode === "forward" && (
                <Field label="Forward to address">
                  <Input
                    type="email"
                    value={forwardTo}
                    onChange={(e) => { setForwardTo(e.target.value); setSaved(false); }}
                    placeholder="support@empyrehomes.com"
                    required
                  />
                  <div className="text-[11.5px] text-ink-3 mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Forwarded mail will appear as coming from the original sender.
                  </div>
                </Field>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={busy || (activeMode === "forward" && !forwardTo)}>
                  {busy ? "Saving…" : "Save configuration"}
                </Button>
                {saved && <span className="text-[12.5px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">Saved</span>}
                {err && <span className="text-[12.5px] text-danger">{err}</span>}
              </div>
            </form>
          </div>
        )}
        
        {!isFreePlan && !enabled && (
          <div className="p-6">
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={() => submit()} disabled={busy}>
                {busy ? "Saving…" : "Save as Disabled"}
              </Button>
              {saved && <span className="text-[12.5px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">Saved</span>}
              {err && <span className="text-[12.5px] text-danger">{err}</span>}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}