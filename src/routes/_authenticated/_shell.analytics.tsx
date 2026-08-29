import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAnalytics } from "@/lib/analytics.functions";
import { PageHeader, Card } from "@/components/app/AppShell";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { Lock } from "lucide-react";
import { getMyOrganization } from "@/lib/orgs.functions";

type Range = "today" | "week" | "month" | "year";

const analyticsOpts = (range: Range) =>
  queryOptions({
    queryKey: ["analytics", range],
    queryFn: async () => getAnalytics({ data: { range } }),
    staleTime: 30_000,
  });

export const Route = createFileRoute("/_authenticated/_shell/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(analyticsOpts("week")),
  component: AnalyticsRoute,
});

function AnalyticsRoute() {
  const fetchOrg = useServerFn(getMyOrganization);
  const { data: org } = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => fetchOrg(),
    staleTime: 60_000,
  });
  
  const isFreePlan = org?.subscription?.planCode === "free";
  const [range, setRange] = useState<Range>("today"); // Default to today since it's the free option
  
  // Force range to 'today' if on free plan, regardless of state
  const effectiveRange = isFreePlan ? "today" : range;
  
  const { data } = useSuspenseQuery(analyticsOpts(effectiveRange));

  const ranges: { key: Range; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "7 days" },
    { key: "month", label: "30 days" },
    { key: "year", label: "12 months" },
  ];

  const stats = [
    { label: "Sent", value: data?.sent ?? 0 },
    { label: "Received", value: data?.received ?? 0 },
    { label: "Delivered", value: data?.delivered ?? 0 },
    { label: "Bounced", value: data?.bounced ?? 0 },
    { label: "Failed", value: data?.failed ?? 0 },
    { label: "Deliverability", value: `${data?.deliverability ?? 0}%` },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Message volume, delivery health, and bounce trends across your organization."
        actions={
          <div className="max-w-full overflow-x-auto no-scrollbar pb-1 -mb-1">
            <div className="inline-flex rounded-md border border-line bg-surface p-0.5 min-w-max">
              {ranges.map((r) => {
                const isLocked = isFreePlan && r.key !== "today";
                return (
                  <button
                    key={r.key}
                    onClick={() => {
                      if (isLocked) {
                        window.location.href = "/settings/billing";
                      } else {
                        setRange(r.key);
                      }
                    }}
                    className={`h-8 px-3 rounded text-[12.5px] font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                      effectiveRange === r.key ? "bg-primary text-primary-foreground" : "text-ink-3 hover:text-ink"
                    } ${isLocked ? "opacity-60" : ""}`}
                    title={isLocked ? "Upgrade to Growth Pro for historical data" : ""}
                  >
                    {isLocked && <Lock className="h-3 w-3" />}
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-[11px] uppercase tracking-wider text-ink-3">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="mb-4 text-[13.5px] font-semibold text-ink">Volume over time</div>
        {(data?.series?.length ?? 0) === 0 ? (
          <div className="py-12 text-center text-[13px] text-ink-3">No data in this window.</div>
        ) : (
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height={280} minWidth={0} debounce={50}>
              <AreaChart data={data!.series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gRecv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--ink-3)" }}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600, marginBottom: 4 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "var(--ink-3)", paddingTop: 8 }} />
                <Area
                  type="monotone"
                  dataKey="sent"
                  name="Sent"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gSent)"
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  name="Received"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#gRecv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}