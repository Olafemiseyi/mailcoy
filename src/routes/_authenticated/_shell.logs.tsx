import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listEmailLogs } from "@/lib/platform.functions";
import { PageHeader, Card, StatusPill, Button } from "@/components/app/AppShell";
import { TableSkeleton } from "@/components/Skeleton";
import { Inbox, Loader2 } from "lucide-react";

const PAGE = 50;

export const Route = createFileRoute("/_authenticated/_shell/logs")({
  head: () => ({ meta: [{ title: "Email logs — Mailcoy" }] }),
  component: LogsRoute,
});

function LogsRoute() {
  const [limit, setLimit] = useState(PAGE);
  const fetchLogs = useServerFn(listEmailLogs);
  const { data, isPending, isFetching } = useQuery({
    queryKey: ["email-logs", limit],
    queryFn: async () => fetchLogs({ data: { limit, offset: 0 } }),
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  });
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const hasMore = rows.length < total;

  return (
    <div>
      <PageHeader
        title="Email logs"
        subtitle={total ? `Showing ${rows.length} of ${total} events.` : "Delivery outcomes for inbound and outbound messages."}
      />
      <Card className="p-0 overflow-hidden">
        {isPending && !data ? (
          <div className="p-4">
            <TableSkeleton rows={8} />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center border-t border-line bg-surface-muted/20">
            <div className="h-12 w-12 rounded-full bg-ink/[0.04] grid place-items-center mb-3">
              <Inbox className="h-6 w-6 text-ink-3" />
            </div>
            <h3 className="font-semibold text-ink">No logs yet</h3>
            <p className="mt-1 text-[13px] text-ink-3 max-w-md">Once mail starts routing through your MX endpoints, delivery events will land here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px] min-w-[650px]">
              <thead className="text-[11px] uppercase tracking-wider text-ink-3 border-b border-line">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Dir</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row: any) => {
                  return (
                    <tr key={row.id}>
                      <td className="px-4 py-2.5 text-[12px] text-ink-3 whitespace-nowrap">{new Date(row.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-[12px]">{row.direction === "outgoing" ? "→" : "←"}</td>
                      <td className="px-4 py-2.5 font-mono text-[12px]">{row.sender}</td>
                      <td className="px-4 py-2.5 font-mono text-[12px]">{row.receiver}</td>
                      <td className="px-4 py-2.5 truncate max-w-[280px]">{row.subject ?? "—"}</td>
                      <td className="px-4 py-2.5"><StatusPill status={row.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {hasMore && (
          <div className="p-4 border-t border-line flex justify-center">
            <Button variant="ghost" onClick={() => setLimit((l) => l + PAGE)} disabled={isFetching}>
              {isFetching ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Loading…</> : `Load ${Math.min(PAGE, total - rows.length)} more`}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

