import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getOrgSettings, updateCatchAll } from "@/lib/analytics.functions";
import { listEmailLogs } from "@/lib/platform.functions";
import { PageHeader, Card, Button, Input, Field } from "@/components/app/AppShell";
import { Inbox, Forward, AlertCircle, Power, Lock, Check } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { getMyOrganization } from "@/lib/orgs.functions";

const settingsOpts = queryOptions({
  queryKey: ["org-settings"],
  queryFn: async () => getOrgSettings(),
  staleTime: 30_000,
});

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

  const [enabled, setEnabled] = useState<boolean>(
    ((data?.catchall_mode as Mode) ?? "reject") !== "reject",
  );
  const [activeMode, setActiveMode] = useState<"receive" | "forward">(
    data?.catchall_mode === "forward" ? "forward" : "receive",
  );
  const [forwardTo, setForwardTo] = useState<string>(
    (data?.catchall_forward_to as string | null) ?? "",
  );
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

  async function handleToggle(checked: boolean) {
    if (isFreePlan) return;
    setErr(null);
    setSaved(false);
    setBusy(true);
    setEnabled(checked);
    const finalMode: Mode = checked ? activeMode : "reject";
    try {
      await save({
        data: {
          catchall_mode: finalMode,
          catchall_forward_to: finalMode === "forward" ? forwardTo : null,
        },
      });
      await qc.invalidateQueries({ queryKey: ["org-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update catch-all setting");
      setEnabled(!checked);
    } finally {
      setBusy(false);
    }
  }

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErr(null);
    setSaved(false);
    setBusy(true);
    const finalMode: Mode = enabled ? activeMode : "reject";
    try {
      await save({
        data: {
          catchall_mode: finalMode,
          catchall_forward_to: finalMode === "forward" ? forwardTo : null,
        },
      });
      await qc.invalidateQueries({ queryKey: ["org-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const options = [
    {
      key: "receive",
      label: "Receive to Shared Inbox",
      desc: "Unknown mail is collected and visible in your workspace logs.",
      icon: Inbox,
    },
    {
      key: "forward",
      label: "Forward to Address",
      desc: "Instantly forward unknown mail to a specific external inbox.",
      icon: Forward,
    },
  ] as const;

  return (
    <div className="space-y-8 max-w-3xl">
      <PageHeader
        title="Catch-all mail"
        subtitle="Manage what happens when someone sends mail to an address that doesn't match any employee or alias."
      />
      <Card className="p-0 max-w-2xl overflow-hidden min-w-0">
        {/* Master Toggle Area - Mobile Optimized with Power icon on top row */}
        <div
          className={`p-4 sm:p-6 border-b border-line transition-colors ${
            enabled ? "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]" : "bg-surface-muted/30"
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                enabled
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs"
                  : "bg-surface-muted text-ink-3 border border-line"
              }`}
            >
              <Power className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="text-[11.5px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 whitespace-nowrap">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
              <Switch.Root
                checked={enabled}
                disabled={isFreePlan || busy}
                onCheckedChange={handleToggle}
                className={`w-[46px] h-[26px] rounded-full relative transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 inline-flex items-center cursor-pointer p-0.5 ${
                  enabled ? "!bg-emerald-600 dark:!bg-emerald-500" : "!bg-zinc-300 dark:!bg-zinc-700"
                } ${isFreePlan || busy ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Switch.Thumb
                  className={`block w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform duration-200 ${
                    enabled ? "translate-x-[20px]" : "translate-x-[1px]"
                  }`}
                />
              </Switch.Root>
            </div>
          </div>
          <div>
            <h2 className="font-display text-[15.5px] sm:text-[16.5px] font-semibold text-ink flex items-center gap-2">
              Catch-all is {enabled ? "Active" : "Disabled"}
              {enabled && (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-ink-3 mt-0.5">
              {enabled
                ? "Unknown mail is being processed."
                : "Unknown mail is automatically rejected (bounced)."}
            </p>
          </div>
        </div>

        {/* Configuration Area */}
        {isFreePlan ? (
          <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center bg-surface-muted/30">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold">Catch-all is a Growth Pro feature</h3>
            <p className="text-[13.5px] text-ink-3 mt-2 max-w-md">
              Upgrade to route misaddressed emails to a shared inbox or forward them to an external address automatically.
            </p>
            <Button
              className="mt-6 w-full sm:w-auto whitespace-nowrap justify-center"
              onClick={() => {
                window.location.href = "/settings/billing";
              }}
            >
              Upgrade to Growth Pro
            </Button>
          </div>
        ) : enabled ? (
          <div className="p-4 sm:p-6">
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-3">
                {options.map((o) => {
                  const Icon = o.icon;
                  return (
                    <label
                      key={o.key}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 sm:p-4 cursor-pointer transition ${
                        activeMode === o.key
                          ? "border-primary bg-primary/[0.03]"
                          : "border-line hover:bg-ink/[0.02]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="catchall-mode"
                        checked={activeMode === o.key}
                        onChange={() => {
                          setActiveMode(o.key);
                          setSaved(false);
                        }}
                        className="mt-1 accent-primary shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              activeMode === o.key ? "text-primary" : "text-ink-3"
                            }`}
                          />
                          <div className="text-[13.5px] font-semibold text-ink">{o.label}</div>
                        </div>
                        <div className="text-[12px] sm:text-[12.5px] text-ink-3 mt-1 leading-relaxed">
                          {o.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {activeMode === "receive" && (
                <div className="rounded-xl border border-line bg-surface-muted/50 p-4">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink mb-1.5">
                    <Inbox className="h-4 w-4 text-primary shrink-0" /> Shared Inbox Route
                  </div>
                  <div className="text-[12px] sm:text-[12.5px] text-ink-3 leading-relaxed">
                    Mail sent to unknown addresses (like{" "}
                    <span className="font-mono text-ink text-[11px] sm:text-[11.5px] bg-ink/[0.06] px-1.5 py-0.5 rounded">
                      anything@your-domain.com
                    </span>
                    ) will be stored silently. You can view these messages in the Webmail Inbox below.
                  </div>
                </div>
              )}

              {activeMode === "forward" && (
                <Field label="Forward to address">
                  <Input
                    type="email"
                    value={forwardTo}
                    onChange={(e) => {
                      setForwardTo(e.target.value);
                      setSaved(false);
                    }}
                    placeholder="forwarding@yourcompany.com"
                    required
                  />
                  <div className="text-[11.5px] text-ink-3 mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" /> Forwarded mail will appear as coming from the original sender.
                  </div>
                </Field>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={busy || (activeMode === "forward" && !forwardTo)}
                  className="w-full sm:w-auto whitespace-nowrap justify-center"
                >
                  {busy ? "Saving…" : "Save configuration"}
                </Button>
                {saved && (
                  <span className="text-[12px] sm:text-[12.5px] font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg inline-flex items-center justify-center gap-1 whitespace-nowrap">
                    <Check className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
                {err && <span className="text-[12.5px] text-danger">{err}</span>}
              </div>
            </form>
          </div>
        ) : (
          <div className="p-4 sm:p-6 bg-surface-muted/20">
            <p className="text-[12.5px] sm:text-[13px] text-ink-3 leading-relaxed">
              Catch-all routing is currently turned off. To capture unmatched incoming emails, toggle the switch above.
            </p>
          </div>
        )}
      </Card>

      {/* Webmail Inbox Section */}
      {!isFreePlan && enabled && activeMode === "receive" && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <Inbox className="h-5 w-5" /> Webmail Inbox
          </h2>
          <WebmailInbox />
        </div>
      )}
    </div>
  );
}

function WebmailInbox() {
  const fetchLogs = useServerFn(listEmailLogs);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["email-logs", "incoming"],
    queryFn: async () => fetchLogs({ data: { limit: 100, offset: 0, direction: "incoming" } }),
    staleTime: 5_000,
  });

  const rows = data?.rows ?? [];

  return (
    <>
      <Card className="p-0 overflow-hidden min-h-[300px] border-line shadow-sm">
        {isPending ? (
          <div className="p-10 flex justify-center text-ink-3">Loading inbox...</div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-surface-muted/10">
            <div className="h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3">
              <Inbox className="h-6 w-6 text-ink-3" />
            </div>
            <h3 className="font-semibold text-ink">Inbox is empty</h3>
            <p className="mt-1 text-[13px] text-ink-3 max-w-sm">
              Any emails routed to your catch-all address will securely land here.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-line">
              {rows.slice(0, visibleCount).map((msg: any) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className="p-4 hover:bg-surface-muted/30 transition group flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[14px]">
                    {(msg.sender || "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-ink text-[14px] truncate">
                        {msg.sender}
                      </span>
                      <span className="text-[11px] text-ink-4 whitespace-nowrap">
                        {new Date(msg.timestamp).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className="text-[13.5px] font-semibold text-ink truncate mb-0.5">
                      {msg.subject || "(No Subject)"}
                    </div>
                    <div className="text-[12px] text-ink-3 truncate pr-4 flex items-center gap-1.5">
                      <span className="font-mono text-[10.5px] bg-ink/[0.06] text-ink px-1.5 py-0.5 rounded font-medium shrink-0">
                        To: {msg.receiver}
                      </span>
                      <span className="truncate text-ink-3">
                        {msg.snippet || "No preview available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {rows.length > visibleCount && (
              <div className="p-3.5 border-t border-line text-center bg-ink/[0.01]">
                <Button
                  variant="ghost"
                  onClick={() => setVisibleCount((prev) => prev + 15)}
                  className="text-[12.5px] h-8 px-4 font-medium"
                >
                  Load more messages ({rows.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Message Read Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto overflow-x-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMessage(null);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[85vh] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-line bg-surface my-auto">
            <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5 sm:py-4 shrink-0 bg-surface">
              <div className="min-w-0 pr-2">
                <div className="text-[11.5px] text-ink-3 mb-1">
                  {new Date(selectedMessage.timestamp).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
                <h2 className="font-display text-[15px] sm:text-base font-semibold leading-snug break-words text-ink">
                  {selectedMessage.subject || "(No Subject)"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-3 hover:text-ink hover:bg-ink/[0.06] transition-colors -mr-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-[13px]">
              <div className="rounded-lg border border-line bg-ink/[0.02] p-3 space-y-1.5 font-mono text-[12px] overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 min-w-0">
                  <span className="text-ink-3 uppercase text-[10.5px] tracking-wider font-sans font-medium w-12 shrink-0">
                    From:
                  </span>
                  <span className="text-ink font-medium break-all min-w-0">
                    {selectedMessage.sender}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 pt-1.5 border-t border-line/50 min-w-0">
                  <span className="text-ink-3 uppercase text-[10.5px] tracking-wider font-sans font-medium w-12 shrink-0">
                    To:
                  </span>
                  <span className="text-ink font-medium break-all min-w-0">
                    {selectedMessage.receiver}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-medium uppercase tracking-wider text-ink-3 mb-1.5">
                  Message Content
                </div>
                <div className="rounded-lg border border-line bg-background p-3.5 text-[13px] leading-relaxed text-ink whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
                  {selectedMessage.snippet || "No message content available."}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 sm:px-5 sm:py-3 border-t border-line bg-ink/[0.02] flex items-center justify-end shrink-0">
              <Button
                variant="ghost"
                onClick={() => setSelectedMessage(null)}
                className="h-7 px-3 text-[12px]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
