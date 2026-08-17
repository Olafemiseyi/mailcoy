// Gmail connection monitor.
// Only shows employees who have been invited or connected. Invites are sent
// from the Employees page — this page is where the owner monitors and
// controls (pause / resume / disconnect) live Gmail connections.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, queryOptions, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listEmployees } from "@/lib/employees.functions";
import {
  disconnectGoogleMail,
  isGoogleMailConnectorConfigured,
  pauseGmailConnection,
  resumeGmailConnection,
  triggerSendAsSetup,
} from "@/lib/gmail.functions";
import { PageHeader, Card, Button, StatusPill } from "@/components/app/AppShell";
import { Mail, ShieldCheck, Pause, Play, Link2Off, Send, AtSign, CheckCircle2 } from "lucide-react";
import { GmailSkeleton } from "@/components/Skeleton";
import { InviteModal } from "@/components/InviteModal";

const empOpts = queryOptions({ queryKey: ["employees"], queryFn: async () => listEmployees(), staleTime: 15_000 });
const cfgOpts = queryOptions({ queryKey: ["gmail-cfg"], queryFn: async () => isGoogleMailConnectorConfigured(), staleTime: 60_000 });

export const Route = createFileRoute("/_authenticated/_shell/gmail")({
  head: () => ({ meta: [{ title: "Gmail — Mailcoy" }] }),
  loader: async ({ context }: any) => {
    await Promise.all([
      context.queryClient.ensureQueryData(empOpts),
      context.queryClient.ensureQueryData(cfgOpts),
    ]);
  },
  pendingMs: 0,
  pendingComponent: () => <GmailSkeleton />,
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load Gmail connections</h1>
      <p className="text-[13px] text-ink-3 mb-4">{error.message}</p>
      <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">Retry</button>
    </div>
  ),
  component: GmailRoute,
});

type Row = {
  id: string; full_name: string | null; professional_email: string | null;
  status: string; invited_at: string | null; connected_at: string | null;
  gmail_connected?: boolean; gmail_email?: string | null; gmail_health?: string | null;
};

function GmailRoute() {
  const qc = useQueryClient();
  const { data: employees } = useSuspenseQuery(empOpts);
  const { data: cfg } = useSuspenseQuery(cfgOpts);
  const disc = useServerFn(disconnectGoogleMail);
  const pause = useServerFn(pauseGmailConnection);
  const resume = useServerFn(resumeGmailConnection);
  const [notice, setNotice] = useState<string | null>(null);
  const [inviteFor, setInviteFor] = useState<Row | null>(null);

  const onErr = (e: unknown) => setNotice(e instanceof Error ? e.message : "Failed");
  const onOk = () => qc.invalidateQueries({ queryKey: ["employees"] });

  const discM = useMutation({ mutationFn: (id: string) => disc({ data: { employeeId: id } }), onSuccess: onOk, onError: onErr });
  const pauseM = useMutation({ mutationFn: (id: string) => pause({ data: { employeeId: id } }), onSuccess: onOk, onError: onErr });
  const resumeM = useMutation({ mutationFn: (id: string) => resume({ data: { employeeId: id } }), onSuccess: onOk, onError: onErr });
  const sendAsM = useMutation({
    mutationFn: (id: string) => triggerSendAsSetup({ data: { employeeId: id } }),
    onSuccess: (_data, id) => setNotice(`Send As setup triggered for employee. They'll receive a verification email at their professional address.`),
    onError: onErr,
  });

  const all = employees as Row[];
  // Only employees who are actually in the Gmail lifecycle: invited, connected,
  // paused, or previously connected. Newly-created employees with no invite
  // yet stay on the Employees page.
  const list = all.filter((e) => e.gmail_connected || e.invited_at || e.connected_at || e.status === "suspended");
  const connected = list.filter((e) => e.gmail_connected && e.gmail_health !== "paused").length;
  const paused = list.filter((e) => e.gmail_health === "paused").length;
  const awaiting = list.filter((e) => !e.gmail_connected).length;

  return (
    <div>
      <PageHeader
        title="Gmail Connections"
        subtitle="Monitor employees who have been invited or connected. Send invites from the Employees page."
      />

      {!cfg.configured && (
        <Card className="p-5 mb-6 border-amber-400/40 bg-amber-50/40 dark:bg-amber-500/5">
          <p className="text-[13.5px] text-ink-2">
            The Google Mail connector isn't provisioned in this workspace yet. Invitation links will still generate, but Google sign-in inside them will fail until the workspace client is configured.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="In lifecycle" value={list.length} />
        <StatCard label="Connected" value={connected} />
        <StatCard label="Paused" value={paused} />
        <StatCard label="Awaiting connection" value={awaiting} />
      </div>

      {/* Startup Brand Logo Avatar Tip */}
      <Card className="p-4 mb-5 border-emerald-500/20 bg-emerald-500/[0.02]">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0 mt-0.5">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-[13px] text-ink-2">
            <strong className="text-ink font-semibold">Pro Tip for Showing Your Company Logo in Gmail ($0):</strong>
            <p className="mt-0.5 text-ink-3 leading-relaxed">
              When employees connect their Google account, setting their company logo as their Google Account profile avatar will automatically display the logo next to all sent business emails in Gmail for desktop, iPhone, and Android without requiring a paid VMC certificate.
            </p>
          </div>
        </div>
      </Card>

      {notice && <div className="mb-4 text-[13px] text-red-600">{notice}</div>}

      <Card className="p-0">
        {list.length === 0 ? (
          <div className="p-10 text-center text-[13.5px] text-ink-3">
            No employees invited yet. <Link to="/employees" className="underline">Go to employees</Link> to send invite links.
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((e) => {
              const paused = e.gmail_connected && e.gmail_health === "paused";
              const statusLabel = e.gmail_connected
                ? (paused ? "paused" : (e.gmail_health ?? "connected"))
                : (e.invited_at ? "invited" : (e.status ?? "pending"));
              return (
                <li key={e.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-md bg-ink/[0.05] flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{e.full_name ?? "—"}</div>
                      <div className="text-[12px] text-ink-3 font-mono truncate">
                        {e.gmail_connected && e.gmail_email
                          ? <>{e.professional_email} · via {e.gmail_email}</>
                          : e.professional_email ?? ""}
                      </div>
                      {!e.gmail_connected && e.invited_at && (
                        <div className="text-[11.5px] text-ink-3 mt-0.5">
                          Invited {new Date(e.invited_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 sm:justify-end">
                    <StatusPill status={statusLabel} />
                    {e.gmail_connected && !paused && (
                      <Button variant="ghost" onClick={() => pauseM.mutate(e.id)} disabled={pauseM.isPending && pauseM.variables === e.id} className="whitespace-nowrap h-8 px-2.5 text-[12.5px]">
                        <Pause className="h-3.5 w-3.5 mr-1" /> Pause
                      </Button>
                    )}
                    {e.gmail_connected && paused && (
                      <Button variant="ghost" onClick={() => resumeM.mutate(e.id)} disabled={resumeM.isPending && resumeM.variables === e.id} className="whitespace-nowrap h-8 px-2.5 text-[12.5px]">
                        <Play className="h-3.5 w-3.5 mr-1" /> Resume
                      </Button>
                    )}
                    {e.gmail_connected && (
                      <Button
                        variant="ghost"
                        onClick={() => sendAsM.mutate(e.id)}
                        disabled={sendAsM.isPending && sendAsM.variables === e.id}
                        title="Re-trigger Gmail Send As alias setup"
                        className="whitespace-nowrap h-8 px-2.5 text-[12.5px]"
                      >
                        {sendAsM.isPending && sendAsM.variables === e.id
                          ? <><AtSign className="h-3.5 w-3.5 mr-1 animate-pulse" /> Setting up…</>
                          : <><AtSign className="h-3.5 w-3.5 mr-1" /> Send As Setup</>}
                      </Button>
                    )}
                    {e.gmail_connected && (
                      <Button variant="ghost" onClick={() => discM.mutate(e.id)} disabled={discM.isPending && discM.variables === e.id} className="whitespace-nowrap h-8 px-2.5 text-[12.5px] text-danger hover:text-red-700 hover:bg-danger/10">
                        <Link2Off className="h-3.5 w-3.5 mr-1" /> Disconnect
                      </Button>
                    )}
                    {!e.gmail_connected && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => setInviteFor(e)}
                          className="whitespace-nowrap"
                        >
                          <Send className="h-3.5 w-3.5 mr-1.5" /> Resend invite
                        </Button>
                        <Link
                          to="/employees/$id"
                          params={{ id: e.id }}
                          className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 text-[12.5px] text-ink-2 hover:bg-ink/[0.04]"
                        >
                          View
                        </Link>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="mt-6 flex items-start gap-2 text-[12px] text-ink-3">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-ink-2 mb-0.5">Privacy & Security note</p>
          <p>
            When an employee connects their Google Account, they grant standard delegated sending permissions to the system. 
            The system acts as an SMTP bridge to dispatch messages safely from their professional address. 
            You do not have the ability to sign into their actual Gmail inbox or read personal messages.
          </p>
        </div>
      </div>

      {inviteFor && (
        <InviteModal employee={inviteFor as any} onClose={() => setInviteFor(null)} />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-3 sm:p-5 min-w-0">
      <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">{label}</div>
      <div className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate">{value}</div>
    </Card>
  );
}
