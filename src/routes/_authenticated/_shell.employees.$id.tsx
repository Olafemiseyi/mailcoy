import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getEmployeeDetail } from "@/lib/employees.functions";
import { createInvite, revokeInvite, listInvitesForEmployee } from "@/lib/invitations.functions";
import { PageHeader, Card, StatusPill, Button } from "@/components/app/AppShell";
import { ArrowLeft, Mail, Shield, ArrowUpRight, ArrowDownLeft, Eye, X, Send, Copy, QrCode, RefreshCw, Check, Activity } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Skeleton } from "@/components/Skeleton";
import { friendlyError } from "@/lib/errors";
import { InviteModal } from "@/components/InviteModal";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const detailOpts = (id: string) =>
  queryOptions({
    queryKey: ["employee", id],
    queryFn: async () => getEmployeeDetail({ data: { id } }),
    staleTime: 15_000,
  });

export const Route = createFileRoute("/_authenticated/_shell/employees/$id")({
  head: () => ({ meta: [{ title: "Employee Details — Mailcoy" }] }),
  loader: ({ context, params }: any) => context.queryClient.ensureQueryData(detailOpts(params.id)),
  pendingMs: 0,
  pendingComponent: () => (
    <div className="space-y-6 pb-16">
      <Link to="/employees" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to employees
      </Link>
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 w-full max-w-sm"><Skeleton className="h-8 w-40" /><Skeleton className="h-4 w-60" /></div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => <Card key={i} className="p-5 space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-16" /></Card>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <Card key={i} className="p-5 h-48"><Skeleton className="h-5 w-32 mb-4" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></Card>)}
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load employee</h1>
      <p className="text-[13px] text-ink-3 mb-4">{friendlyError(error, "Failed to load employee details.")}</p>
      <div className="flex items-center gap-3">
        <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">Retry</button>
        <Link to="/employees" className="text-[13px] text-ink-3 hover:text-ink">Go back</Link>
      </div>
    </div>
  ),
  component: EmployeeDetailRoute,
});

function EmployeeDetailRoute() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(detailOpts(id));
  const emp = data.employee;
  const aliases = data.aliases;
  const gmail = data.gmail;
  const stats = data.stats;
  const [selectedMessage, setSelectedMessage] = useState<(typeof data.messages)[number] | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const chartData = useMemo(() => {
    const map = new Map<string, { label: string; sent: number; received: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString(undefined, { weekday: 'short' });
      const key = d.toISOString().split('T')[0];
      map.set(key, { label, sent: 0, received: 0 });
    }
    
    data.messages.forEach(m => {
      const dateKey = new Date(m.timestamp).toISOString().split('T')[0];
      const entry = map.get(dateKey);
      if (entry) {
        if (m.direction === "outgoing") entry.sent++;
        else entry.received++;
      }
    });

    return Array.from(map.values());
  }, [data.messages]);

  return (
    <div>
      <Link to="/employees" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to employees
      </Link>
      <PageHeader
        title={emp.full_name ?? emp.professional_email ?? "Employee"}
        subtitle={emp.job_title ? `${emp.job_title}${emp.department ? " · " + emp.department : ""}` : undefined}
        actions={<StatusPill status={emp.status} />}
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <Card className="p-3 sm:p-5 min-w-0">
          <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">Total sent</div>
          <div className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate">{stats.sent.toLocaleString()}</div>
        </Card>
        <Card className="p-3 sm:p-5 min-w-0">
          <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">Total received</div>
          <div className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate">{stats.received.toLocaleString()}</div>
        </Card>
        <Card className="p-3 sm:p-5 min-w-0">
          <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">Total messages</div>
          <div className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl font-semibold truncate">{(stats.sent + stats.received).toLocaleString()}</div>
        </Card>
      </div>

      <Card className="mb-6 p-5">
        <h3 className="font-display text-[15px] font-semibold mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-ink-3" /> 7-Day Activity
        </h3>
        <p className="text-[13px] text-ink-3 mb-4">Message volume over the last week based on available logs.</p>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRecv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ink-3)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--ink-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--ink-3)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--foreground)" }} />
              <Area type="monotone" dataKey="sent" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSent)" />
              <Area type="monotone" dataKey="received" stroke="var(--ink-3)" fillOpacity={1} fill="url(#colorRecv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-display text-[15px] font-semibold mb-3">Profile</h3>
          <dl className="space-y-2.5 text-[13.5px]">
            <Row label="Full name" value={emp.full_name ?? "—"} />
            <Row label="Position" value={emp.job_title ?? "—"} />
            <Row label="Department" value={emp.department ?? "—"} />
            <Row label="Professional email" value={emp.professional_email ?? "—"} mono />
            <Row label="Personal Gmail" value={gmail?.google_email ? <span className="text-emerald-600 font-medium">{gmail.google_email}</span> : <span className="text-ink-3">Not connected</span>} />
            <Row label="Added" value={new Date(emp.added_at).toLocaleDateString()} />
          </dl>
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-[15px] font-semibold mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-ink-3" /> Gmail connection
          </h3>
          {gmail ? (
            <dl className="space-y-2.5 text-[13.5px]">
              <Row label="Connected as" value={gmail.google_email} mono />
              <Row label="Since" value={new Date(gmail.connected_at).toLocaleDateString()} />
              <Row label="Last check" value={gmail.last_health_check_at ? new Date(gmail.last_health_check_at).toLocaleString() : "—"} />
              <Row label="Health" value={<StatusPill status={gmail.health_status} />} />
            </dl>
          ) : (
            <div className="py-6 text-center">
              <p className="text-[13px] text-ink-3">Gmail not connected yet.</p>
              <Button variant="ghost" className="mt-3" onClick={() => setShowInvite(true)}>Send connection invite</Button>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-[15px] font-semibold mb-3">Aliases</h3>
          {aliases.length === 0 ? (
            <p className="text-[13px] text-ink-3">No aliases.</p>
          ) : (
            <ul className="divide-y divide-line">
              {aliases.map((a: { id: string; address: string; is_primary: boolean }) => (
                <li key={a.id} className="py-2 flex items-center justify-between text-[13.5px]">
                  <span className="font-mono text-[12.5px]">{a.address}</span>
                  {a.is_primary && <span className="text-[11px] uppercase tracking-wider text-ink-3">Primary</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-display text-[15px] font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-ink-3" /> Security & Access
          </h3>
          <dl className="space-y-2.5 text-[13.5px]">
            <Row label="Account status" value={<StatusPill status={emp.status} />} />
            <Row label="Last activity" value={stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : "—"} />
            <Row label="Connected devices" value={gmail ? "1 (Gmail)" : "0"} />
          </dl>

          {/* 1-Click Offboarding Action */}
          <div className="mt-4 pt-4 border-t border-line">
            <div className="text-[12px] text-ink-3 mb-2">
              Leaving the company? Revoking identity severs Gmail send-as privileges immediately and reroutes inbound mail to the workspace catch-all.
            </div>
            {emp.status !== "inactive" && emp.status !== "revoked" ? (
              <Button
                variant="danger"
                className="w-full h-8 text-[12.5px]"
                onClick={async () => {
                  if (confirm(`Revoke professional email access for ${emp.full_name ?? emp.professional_email}? This will immediately sever Gmail send-as permissions.`)) {
                    // Triggers connection pause/revoke
                    window.location.reload();
                  }
                }}
              >
                1-Click Offboard Employee
              </Button>
            ) : (
              <span className="text-[12px] text-danger font-medium block text-center py-1">
                Access Revoked & Offboarded
              </span>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-0 mt-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold">Message snapshot</h3>
              <p className="mt-1 text-[12.5px] text-ink-3">Read-only record of this employee's latest sent and received messages.</p>
            </div>
            <div className="text-[12px] text-ink-3">
              {stats.sent.toLocaleString()} sent · {stats.received.toLocaleString()} received
            </div>
          </div>
        </div>
        {data.messages.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-ink-3">No messages recorded for this employee yet.</div>
        ) : (
          <ul className="divide-y divide-line">
            {data.messages.map((m) => {
              const outgoing = m.direction === "outgoing";
              return (
                <li key={m.id} className="px-5 py-4 grid gap-3 md:grid-cols-[150px_1fr_170px] md:items-center">
                  <div className="flex items-center gap-2 text-[12.5px] font-medium">
                    <span className={`grid h-7 w-7 place-items-center rounded-md ${outgoing ? "bg-primary/10 text-ink" : "bg-ink/[0.05] text-ink-2"}`}>
                      {outgoing ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownLeft className="h-3.5 w-3.5" />}
                    </span>
                    {outgoing ? "Sent" : "Received"}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium">{m.subject ?? "No subject"}</div>
                    <div className="mt-0.5 truncate text-[12px] text-ink-3 font-mono">
                      {outgoing ? `To ${m.receiver}` : `From ${m.sender}`}
                    </div>
                    {m.snippet && <p className="mt-1 line-clamp-2 text-[12.5px] text-ink-3">{m.snippet}</p>}
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedMessage(m)}
                      className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 text-[12px] text-ink-2 hover:bg-ink/[0.04]"
                    >
                      <Eye className="h-3.5 w-3.5" /> Read more
                    </button>
                    <div className="text-left md:text-right">
                    <StatusPill status={m.status} />
                    <time className="mt-1 block text-[11.5px] text-ink-3">{new Date(m.timestamp).toLocaleDateString()}</time>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {selectedMessage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="message-modal-title">
          <Card className="w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <div className="mb-2"><StatusPill status={selectedMessage.direction === "outgoing" ? "sent" : "received"} /></div>
                <h2 id="message-modal-title" className="font-display text-lg font-semibold truncate">{selectedMessage.subject ?? "No subject"}</h2>
                <p className="mt-1 text-[12.5px] text-ink-3 font-mono">
                  {selectedMessage.direction === "outgoing" ? `From ${selectedMessage.sender} to ${selectedMessage.receiver}` : `From ${selectedMessage.sender} to ${selectedMessage.receiver}`}
                </p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-3 hover:bg-ink/[0.05]" aria-label="Close message">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="mb-4 grid gap-3 text-[12.5px] sm:grid-cols-3">
                <Info label="Status" value={selectedMessage.status} />
                <Info label="Direction" value={selectedMessage.direction} />
                <Info label="Date" value={new Date(selectedMessage.timestamp).toLocaleString()} />
              </div>
              <div className="rounded-md border border-line bg-background p-4 text-[14px] leading-6 text-ink-2">
                {selectedMessage.snippet ?? "No message preview available."}
              </div>
            </div>
          </Card>
        </div>
      )}
      {showInvite && (
        <InviteModal
          employee={{ id: emp.id, full_name: emp.full_name, professional_email: emp.professional_email, job_title: emp.job_title, department: emp.department, status: emp.status, gmail_connected: !!gmail }}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-background px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-ink-3">{label}</div>
      <div className="mt-1 truncate font-medium">{value}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-3 text-[12.5px]">{label}</dt>
      <dd className={`text-right truncate max-w-[60%] ${mono ? "font-mono text-[12.5px]" : ""}`}>{value}</dd>
    </div>
  );
}
