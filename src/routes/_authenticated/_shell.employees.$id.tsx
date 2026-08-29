import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getEmployeeDetail, updateEmployee, offboardEmployee } from "@/lib/employees.functions";
import { createInvite, revokeInvite, listInvitesForEmployee } from "@/lib/invitations.functions";
import {
  PageHeader,
  Card,
  StatusPill,
  Button,
  ConfirmDeleteModal,
} from "@/components/app/AppShell";
import {
  ArrowLeft,
  Mail,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  X,
  Send,
  Copy,
  QrCode,
  RefreshCw,
  Check,
  Activity,
  Filter,
} from "lucide-react";
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
      <Link
        to="/employees"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to employees
      </Link>
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 w-full max-w-sm">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-5 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5 h-48">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load employee</h1>
      <p className="text-[13px] text-ink-3 mb-4">
        {friendlyError(error, "Failed to load employee details.")}
      </p>
      <div className="flex items-center gap-3">
        <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">
          Retry
        </button>
        <Link to="/employees" className="text-[13px] text-ink-3 hover:text-ink">
          Go back
        </Link>
      </div>
    </div>
  ),
  component: EmployeeDetailRoute,
});

function EmployeeDetailRoute() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(detailOpts(id));
  const emp = data.employee;
  const aliases = data.aliases;
  const gmail = data.gmail;
  const stats = data.stats;
  const [selectedMessage, setSelectedMessage] = useState<(typeof data.messages)[number] | null>(
    null,
  );
  const [filter, setFilter] = useState<"all" | "inbound" | "outbound">("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const [showInvite, setShowInvite] = useState(false);
  const [offboarding, setOffboarding] = useState(false);
  const [confirmOffboard, setConfirmOffboard] = useState(false);
  const offboardFn = useServerFn(offboardEmployee);

  const chartData = useMemo(() => {
    const map = new Map<string, { label: string; sent: number; received: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      const key = d.toISOString().split("T")[0];
      map.set(key, { label, sent: 0, received: 0 });
    }

    data.messages.forEach((m) => {
      const dateKey = new Date(m.timestamp).toISOString().split("T")[0];
      const entry = map.get(dateKey);
      if (entry) {
        if (m.direction === "outgoing") entry.sent++;
        else entry.received++;
      }
    });

    return Array.from(map.values());
  }, [data.messages]);

  const filteredMessages = useMemo(() => {
    if (filter === "inbound") return data.messages.filter((m) => m.direction !== "outgoing");
    if (filter === "outbound") return data.messages.filter((m) => m.direction === "outgoing");
    return data.messages;
  }, [data.messages, filter]);

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <Link
        to="/employees"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to employees
      </Link>
      <PageHeader
        title={emp.full_name ?? emp.professional_email ?? "Employee"}
        subtitle={
          emp.job_title
            ? `${emp.job_title}${emp.department ? " · " + emp.department : ""}`
            : undefined
        }
        actions={<StatusPill status={emp.status} />}
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 min-w-0 max-w-full">
        <Card className="p-2.5 sm:p-5 min-w-0 overflow-hidden">
          <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">
            Total sent
          </div>
          <div className="mt-1 sm:mt-2 font-display text-base sm:text-2xl font-semibold truncate">
            {stats.sent.toLocaleString()}
          </div>
        </Card>
        <Card className="p-2.5 sm:p-5 min-w-0 overflow-hidden">
          <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">
            Total received
          </div>
          <div className="mt-1 sm:mt-2 font-display text-base sm:text-2xl font-semibold truncate">
            {stats.received.toLocaleString()}
          </div>
        </Card>
        <Card className="p-2.5 sm:p-5 min-w-0 overflow-hidden">
          <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ink-3 font-medium truncate">
            Total messages
          </div>
          <div className="mt-1 sm:mt-2 font-display text-base sm:text-2xl font-semibold truncate">
            {(stats.sent + stats.received).toLocaleString()}
          </div>
        </Card>
      </div>

      <Card className="mb-6 p-4 sm:p-5 min-w-0 overflow-hidden">
        <h3 className="font-display text-[15px] font-semibold mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-ink-3" /> 7-Day Activity
        </h3>
        <p className="text-[13px] text-ink-3 mb-4">
          Message volume over the last week based on available logs.
        </p>
        <div className="h-40 w-full min-w-0">
          <ResponsiveContainer width="100%" height={160} minWidth={0} debounce={50}>
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
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                  color: "var(--foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="sent"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorSent)"
              />
              <Area
                type="monotone"
                dataKey="received"
                stroke="var(--ink-3)"
                fillOpacity={1}
                fill="url(#colorRecv)"
              />
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
            <Row
              label="Personal Gmail"
              value={
                gmail?.google_email ? (
                  <span className="text-emerald-600 font-medium">{gmail.google_email}</span>
                ) : (
                  <span className="text-ink-3">Not connected</span>
                )
              }
            />
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
              <Row
                label="Last check"
                value={
                  gmail.last_health_check_at
                    ? new Date(gmail.last_health_check_at).toLocaleString()
                    : gmail.connected_at
                      ? `${new Date(gmail.connected_at).toLocaleDateString()} (Active)`
                      : "Active"
                }
              />
              <Row label="Health" value={<StatusPill status={gmail.health_status} />} />
            </dl>
          ) : (
            <div className="py-6 text-center">
              <p className="text-[13px] text-ink-3">Gmail not connected yet.</p>
              <Button variant="ghost" className="mt-3" onClick={() => setShowInvite(true)}>
                Send connection invite
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-[15px] font-semibold">Aliases</h3>
            <Link
              to="/aliases"
              className="text-[12px] text-primary hover:underline font-medium"
            >
              + Manage aliases
            </Link>
          </div>
          {aliases.length === 0 ? (
            <div className="py-2 text-[13px] text-ink-3">
              No aliases assigned yet.{" "}
              <Link to="/aliases" className="text-primary hover:underline">
                Create one on the Aliases page
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {aliases.map((a: { id: string; address: string; is_primary: boolean }) => (
                <li key={a.id} className="py-2 flex items-center justify-between text-[13.5px]">
                  <span className="font-mono text-[12.5px]">{a.address}</span>
                  {a.is_primary && (
                    <span className="text-[11px] uppercase tracking-wider text-ink-3">Primary</span>
                  )}
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
            <Row
              label="Last activity"
              value={stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : "—"}
            />
            <Row label="Connected devices" value={gmail ? "1 (Gmail)" : "0"} />
          </dl>

          {/* 1-Click Offboarding Action */}
          <div className="mt-4 pt-4 border-t border-line">
            <div className="text-[12px] text-ink-3 mb-2">
              Leaving the company? Revoking identity severs Gmail send-as privileges immediately and
              reroutes inbound mail to the workspace catch-all.
            </div>
            {emp.status !== "inactive" && emp.status !== "revoked" && emp.status !== "suspended" ? (
              <Button
                variant="danger"
                className="w-full h-8 text-[12.5px]"
                disabled={offboarding}
                onClick={() => setConfirmOffboard(true)}
              >
                {offboarding ? "Offboarding…" : "1-Click Offboard Employee"}
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold">Message snapshot</h3>
              <p className="mt-0.5 text-[12.5px] text-ink-3">
                Read-only record of this employee's latest sent and received messages.
              </p>
            </div>
            <div className="flex items-center min-w-0 max-w-full">
              {/* Filter Controls */}
              <div className="inline-flex items-center rounded-lg border border-line bg-ink/[0.03] p-0.5 text-[12px] max-w-full overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setFilter("all");
                    setVisibleCount(10);
                  }}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all whitespace-nowrap ${
                    filter === "all"
                      ? "bg-surface text-ink shadow-xs"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <Filter className="h-3 w-3" /> All ({data.messages.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilter("inbound");
                    setVisibleCount(10);
                  }}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all whitespace-nowrap ${
                    filter === "inbound"
                      ? "bg-surface text-ink shadow-xs"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <ArrowDownLeft className="h-3 w-3 text-ink-2" /> Received ({stats.received})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilter("outbound");
                    setVisibleCount(10);
                  }}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-all whitespace-nowrap ${
                    filter === "outbound"
                      ? "bg-surface text-ink shadow-xs"
                      : "text-ink-3 hover:text-ink"
                  }`}
                >
                  <ArrowUpRight className="h-3 w-3 text-primary" /> Sent ({stats.sent})
                </button>
              </div>
            </div>
          </div>
        </div>
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-ink-3">
            {filter === "all"
              ? "No messages recorded for this employee yet."
              : filter === "inbound"
                ? "No received messages found."
                : "No sent messages found."}
          </div>
        ) : (
          <>
            <ul className="divide-y divide-line">
              {filteredMessages.slice(0, visibleCount).map((m) => {
                const outgoing = m.direction === "outgoing";
                return (
                  <li
                    key={m.id}
                    className="p-4 sm:px-5 sm:py-4 transition-colors hover:bg-ink/[0.015] flex flex-col md:grid md:grid-cols-[140px_1fr_auto] md:items-center gap-3"
                  >
                    {/* Top Row on Mobile: Direction Badge + Mobile Date & Status */}
                    <div className="flex items-center justify-between md:justify-start gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                            outgoing
                              ? "bg-primary/10 text-primary"
                              : "bg-ink/[0.05] text-ink-2 dark:bg-ink/10"
                          }`}
                        >
                          {outgoing ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownLeft className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <span className="text-[12.5px] font-medium text-ink">
                          {outgoing ? "Sent" : "Received"}
                        </span>
                      </div>

                      {/* Mobile-only status & timestamp badge */}
                      <div className="flex items-center gap-2 md:hidden">
                        <StatusPill status={m.status} />
                        <time className="text-[11.5px] text-ink-3">
                          {new Date(m.timestamp).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    </div>

                    {/* Middle: Subject, Sender/Receiver, Preview Snippet */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="text-[13.5px] font-semibold text-ink truncate leading-snug">
                        {m.subject || "No subject"}
                      </h4>
                      <p className="text-[12px] text-ink-3 font-mono truncate">
                        {outgoing ? `To: ${m.receiver}` : `From: ${m.sender}`}
                      </p>
                      {m.snippet && (
                        <p className="pt-0.5 text-[12.5px] text-ink-2 line-clamp-2 leading-relaxed">
                          {m.snippet}
                        </p>
                      )}
                    </div>

                    {/* Bottom on Mobile / Right Column on Desktop: Action button + Desktop status */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-1.5 md:pt-0 border-t border-line/40 md:border-t-0">
                      <button
                        type="button"
                        onClick={() => setSelectedMessage(m)}
                        className="inline-flex h-7 sm:h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[12px] font-medium text-ink-2 hover:bg-ink/[0.04] transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Read more
                      </button>

                      {/* Desktop-only status & timestamp */}
                      <div className="hidden md:flex flex-col items-end shrink-0 min-w-[90px]">
                        <StatusPill status={m.status} />
                        <time className="mt-1 text-[11px] text-ink-3">
                          {new Date(m.timestamp).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {filteredMessages.length > visibleCount && (
              <div className="p-3.5 border-t border-line text-center bg-ink/[0.01]">
                <Button
                  variant="ghost"
                  onClick={() => setVisibleCount((prev) => prev + 15)}
                  className="text-[12.5px] h-8 px-4 font-medium"
                >
                  Load more messages ({filteredMessages.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto overflow-x-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMessage(null);
          }}
        >
          <div className="relative w-full max-w-lg max-h-[85vh] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-line bg-surface my-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5 sm:py-4 shrink-0 bg-surface">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill
                    status={selectedMessage.direction === "outgoing" ? "sent" : "received"}
                  />
                  <span className="text-[11.5px] text-ink-3">
                    {new Date(selectedMessage.timestamp).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <h2
                  id="message-modal-title"
                  className="font-display text-[15px] sm:text-base font-semibold leading-snug break-words text-ink"
                >
                  {selectedMessage.subject ?? "No subject"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-3 hover:text-ink hover:bg-ink/[0.06] transition-colors -mr-1"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-[13px]">
              {/* Sender & Receiver Meta */}
              <div className="rounded-lg border border-line bg-ink/[0.02] p-3 space-y-1.5 font-mono text-[12px] overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 min-w-0">
                  <span className="text-ink-3 uppercase text-[10.5px] tracking-wider font-sans font-medium w-12 shrink-0">
                    From:
                  </span>
                  <span className="text-ink font-medium break-all min-w-0">{selectedMessage.sender}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 pt-1.5 border-t border-line/50 min-w-0">
                  <span className="text-ink-3 uppercase text-[10.5px] tracking-wider font-sans font-medium w-12 shrink-0">
                    To:
                  </span>
                  <span className="text-ink font-medium break-all min-w-0">{selectedMessage.receiver}</span>
                </div>
              </div>

              {/* Body / Snippet */}
              <div className="min-w-0">
                <div className="text-[11px] font-medium uppercase tracking-wider text-ink-3 mb-1.5">
                  Message Content
                </div>
                <div className="rounded-lg border border-line bg-background p-3.5 text-[13px] leading-relaxed text-ink whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
                  {selectedMessage.snippet || "No message content available."}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 sm:px-5 sm:py-3 border-t border-line bg-ink/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] text-ink-3">Delivery status:</span>
                <StatusPill status={selectedMessage.status} />
              </div>
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
      {showInvite && (
        <InviteModal
          employee={{
            id: emp.id,
            full_name: emp.full_name,
            professional_email: emp.professional_email,
            job_title: emp.job_title,
            department: emp.department,
            status: emp.status,
            gmail_connected: !!gmail,
          }}
          onClose={() => setShowInvite(false)}
        />
      )}
      {confirmOffboard && (
        <ConfirmDeleteModal
          title={`Offboard ${emp.full_name ?? emp.professional_email}?`}
          description="This will immediately revoke professional email access and sever Gmail send-as permissions. Inbound mail will be routed to the workspace catch-all."
          confirmLabel="Offboard Employee"
          busy={offboarding}
          onCancel={() => setConfirmOffboard(false)}
          onConfirm={async () => {
            setOffboarding(true);
            try {
              await offboardFn({ data: { id: emp.id } });
              await qc.invalidateQueries({ queryKey: ["employee", id] });
              await qc.invalidateQueries({ queryKey: ["employees"] });
              setConfirmOffboard(false);
            } catch (e: any) {
              alert(e?.message || "Failed to offboard employee.");
            } finally {
              setOffboarding(false);
            }
          }}
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
    <div className="flex items-baseline justify-between gap-3 min-w-0 max-w-full">
      <dt className="text-ink-3 text-[12.5px] shrink-0">{label}</dt>
      <dd className={`text-right truncate min-w-0 max-w-[65%] ${mono ? "font-mono text-[12px] sm:text-[12.5px]" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
