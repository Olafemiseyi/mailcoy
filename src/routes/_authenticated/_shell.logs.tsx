import { createFileRoute } from "@tanstack/react-router";
import { useState, useDeferredValue } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listEmailLogs } from "@/lib/platform.functions";
import { PageHeader, Card, StatusPill, Button, Input, CustomSelect } from "@/components/app/AppShell";
import { TableSkeleton } from "@/components/Skeleton";
import {
  Inbox,
  Loader2,
  Search,
  RotateCw,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  X,
  Mail,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Copy,
  Check,
  Filter,
  Reply,
} from "lucide-react";

const PAGE = 50;

export const Route = createFileRoute("/_authenticated/_shell/logs")({
  head: () => ({ meta: [{ title: "Email logs — Mailcoy" }] }),
  component: LogsRoute,
});

function LogsRoute() {
  const qc = useQueryClient();
  const [limit, setLimit] = useState(PAGE);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<"all" | "incoming" | "outgoing">("all");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  const fetchLogs = useServerFn(listEmailLogs);
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ["email-logs", limit, deferredSearch, statusFilter, directionFilter],
    queryFn: async () =>
      fetchLogs({
        data: {
          limit,
          offset: 0,
          search: deferredSearch.trim() || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          direction: directionFilter !== "all" ? directionFilter : undefined,
        },
      }),
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const hasMore = rows.length < total;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickReply = (log: any) => {
    const targetEmail = log.direction === "incoming" ? log.sender : log.receiver;
    const cleanSubject = log.subject?.startsWith("Re:") ? log.subject : `Re: ${log.subject || ""}`;
    window.dispatchEvent(
      new CustomEvent("mailcoy:compose", {
        detail: {
          to: targetEmail,
          subject: cleanSubject,
        },
      })
    );
  };

  return (
    <div className="space-y-6 max-w-6xl min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Email Logs"
          subtitle={
            total
              ? `Tracking ${total} total message events across your organization.`
              : "Real-time delivery outcomes for inbound and outbound messages."
          }
        />
        <Button
          variant="ghost"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 shrink-0 self-start sm:self-auto h-9 text-[13px] whitespace-nowrap"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
          {isFetching ? "Syncing..." : "Refresh logs"}
        </Button>
      </div>

      {/* Sticky Filter & Search Bar */}
      <div className="sticky top-14 md:top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2.5 bg-background/95 backdrop-blur-md border-y md:border-b border-line shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by sender, recipient, or subject..."
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-8 text-[13px] text-ink placeholder:text-ink-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Direction Filter */}
          <div className="flex items-center gap-1 p-1 bg-surface-muted/60 rounded-xl border border-line shrink-0">
            {(
              [
                { id: "all", label: "All Routes" },
                { id: "incoming", label: "Inbound" },
                { id: "outgoing", label: "Outbound" },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDirectionFilter(d.id)}
                className={`h-8 px-3 rounded-lg text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  directionFilter === d.id
                    ? "bg-surface text-ink font-semibold shadow-xs"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44 shrink-0">
            <CustomSelect
              options={[
                { value: "all", label: "All Statuses" },
                { value: "delivered", label: "Delivered" },
                { value: "sent", label: "Sent" },
                { value: "bounced", label: "Bounced" },
                { value: "failed", label: "Failed" },
              ]}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Logs Table Card */}
      <Card className="p-0 overflow-hidden shadow-xs border-line">
        {isPending && !data ? (
          <div className="p-6">
            <TableSkeleton rows={8} />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-surface-muted/20">
            <div className="h-12 w-12 rounded-2xl bg-ink/[0.04] grid place-items-center mb-3">
              <Inbox className="h-6 w-6 text-ink-3" />
            </div>
            <h3 className="font-semibold text-ink text-[15px]">
              {search || statusFilter !== "all" || directionFilter !== "all"
                ? "No matching email logs found"
                : "No logs recorded yet"}
            </h3>
            <p className="mt-1 text-[13px] text-ink-3 max-w-md px-4">
              {search || statusFilter !== "all" || directionFilter !== "all"
                ? "Try adjusting your search terms or filters above."
                : "Once mail starts routing through your Mailcoy addresses, inbound and outbound logs will appear here in real time."}
            </p>
            {(search || statusFilter !== "all" || directionFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setDirectionFilter("all");
                }}
                className="mt-4 text-[12.5px] h-8"
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] min-w-[720px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted/40 text-[11.5px] uppercase tracking-wider font-semibold text-ink-3">
                  <th className="px-5 py-3.5">Direction</th>
                  <th className="px-5 py-3.5">Sender</th>
                  <th className="px-5 py-3.5">Recipient</th>
                  <th className="px-5 py-3.5">Subject</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row: any) => {
                  const isOut = row.direction === "outgoing";
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedLog(row)}
                      className="hover:bg-surface-muted/40 transition cursor-pointer group"
                    >
                      {/* Direction */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2 py-0.5 rounded-md border ${
                            isOut
                              ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              : "text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                          }`}
                        >
                          {isOut ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownLeft className="w-3 h-3" />
                          )}
                          {isOut ? "Outbound" : "Inbound"}
                        </span>
                      </td>

                      {/* Sender */}
                      <td className="px-5 py-3.5 font-mono text-[12px] text-ink font-medium whitespace-nowrap max-w-[200px] truncate">
                        {row.sender}
                      </td>

                      {/* Recipient */}
                      <td className="px-5 py-3.5 font-mono text-[12px] text-ink-2 whitespace-nowrap max-w-[200px] truncate">
                        {row.receiver}
                      </td>

                      {/* Subject */}
                      <td className="px-5 py-3.5 max-w-[240px] truncate text-ink font-medium">
                        {row.subject || <span className="text-ink-4 italic font-normal">No subject</span>}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusPill status={row.status} />
                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-3.5 text-[12px] text-ink-3 whitespace-nowrap">
                        {new Date(row.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickReply(row);
                          }}
                          title="Reply to message"
                          className="p-1.5 rounded-lg text-ink-3 hover:text-primary hover:bg-primary/10 transition cursor-pointer inline-flex items-center gap-1 text-[12px] font-medium mr-1.5"
                        >
                          <Reply className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Reply</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(row);
                          }}
                          className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-ink/[0.05] transition cursor-pointer inline-flex items-center gap-1 text-[12px] font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="p-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-muted/20">
            <span className="text-[12.5px] text-ink-3">
              Showing {rows.length} of {total} events
            </span>
            <Button
              variant="ghost"
              onClick={() => setLimit((l) => l + PAGE)}
              disabled={isFetching}
              className="text-[12.5px] h-8 px-4 gap-2 whitespace-nowrap"
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
                </>
              ) : (
                `Load ${Math.min(PAGE, total - rows.length)} more`
              )}
            </Button>
          </div>
        )}
      </Card>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLog(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink text-[16px]">Log Event Details</h3>
                  <p className="text-[11.5px] text-ink-3">
                    ID: <code className="font-mono">{selectedLog.id.slice(0, 12)}...</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-ink/[0.04] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status & Direction Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted/40 border border-line">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-ink-2">Status:</span>
                <StatusPill status={selectedLog.status} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-ink-2">Route:</span>
                <span
                  className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2 py-0.5 rounded-md border ${
                    selectedLog.direction === "outgoing"
                      ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      : "text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  }`}
                >
                  {selectedLog.direction === "outgoing" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownLeft className="w-3 h-3" />
                  )}
                  {selectedLog.direction === "outgoing" ? "Outbound" : "Inbound"}
                </span>
              </div>
            </div>

            {/* Event Metadata Fields */}
            <div className="space-y-3 text-[13px]">
              {/* Sender */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">
                  <span>From (Sender)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedLog.sender, "sender")}
                    className="text-primary hover:underline lowercase font-normal flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === "sender" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedField === "sender" ? "copied" : "copy"}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-muted border border-line font-mono text-[12px] text-ink break-all select-all">
                  {selectedLog.sender}
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">
                  <span>To (Recipient)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedLog.receiver, "receiver")}
                    className="text-primary hover:underline lowercase font-normal flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === "receiver" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedField === "receiver" ? "copied" : "copy"}
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-muted border border-line font-mono text-[12px] text-ink break-all select-all">
                  {selectedLog.receiver}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">
                  Subject
                </div>
                <div className="p-2.5 rounded-xl bg-surface-muted border border-line text-[13px] font-medium text-ink break-words">
                  {selectedLog.subject || <span className="text-ink-4 italic font-normal">No Subject</span>}
                </div>
              </div>

              {/* Snippet / Preview if available */}
              {selectedLog.snippet && (
                <div className="space-y-1">
                  <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">
                    Body Snippet
                  </div>
                  <div className="p-3 rounded-xl bg-surface-muted border border-line text-[12.5px] text-ink-2 leading-relaxed break-words whitespace-pre-wrap">
                    {selectedLog.snippet}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="space-y-1">
                <div className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-3">
                  Timestamp
                </div>
                <div className="p-2.5 rounded-xl bg-surface-muted border border-line text-[12px] font-mono text-ink">
                  {new Date(selectedLog.timestamp).toUTCString()} ({new Date(selectedLog.timestamp).toLocaleString()})
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelectedLog(null)} className="w-full sm:w-auto">
                Close
              </Button>
              <Button
                onClick={() => {
                  handleQuickReply(selectedLog);
                  setSelectedLog(null);
                }}
                className="w-full sm:w-auto gap-1.5 bg-primary text-primary-foreground"
              >
                <Reply className="h-3.5 w-3.5" />
                <span>Reply in Compose</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

