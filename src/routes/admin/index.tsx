import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAdminOverview } from "@/lib/admin.functions";
import { Card } from "@/components/app/AppShell";
import {
  Building2, Users, Mail, Globe, TrendingUp, DollarSign, AlertTriangle, CheckCircle2, RefreshCw,
} from "lucide-react";

const opts = queryOptions({
  queryKey: ["admin-overview"],
  queryFn: async () => getAdminOverview(),
  staleTime: 30_000,
});

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin overview — Mailcoy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async ({ context }: any) => {
    await context.queryClient.ensureQueryData(opts);
  },
  pendingMs: 0,
  pendingComponent: () => (
    <div className="space-y-6">
      <div className="h-8 w-64 rounded bg-ink/[0.06] animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-lg bg-ink/[0.04] animate-pulse" />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-lg bg-ink/[0.04] animate-pulse" />)}
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-2">Unable to load admin overview</h1>
      <p className="text-[13px] text-ink-3 mb-4">{error.message}</p>
      <button onClick={reset} className="h-9 px-3 rounded-md border border-line text-[13px]">Retry</button>
    </div>
  ),
  component: AdminOverview,
});

function ngn(kobo: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);
}

function AdminOverview() {
  const { data, refetch, isFetching } = useSuspenseQuery(opts);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Platform overview</h1>
          <p className="text-[13.5px] text-ink-3 mt-1">Revenue, growth, and system health across every tenant.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-line text-[13px] hover:bg-ink/[0.03]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Revenue */}
      <section className="mb-8">
        <h2 className="mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium">Revenue</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            icon={DollarSign}
            label="Total collected"
            value={ngn(data.revenue.totalKobo)}
            hint="All successful subscription charges to date"
            accent
          />
          <MetricCard
            icon={TrendingUp}
            label="Last 30 days"
            value={ngn(data.revenue.kobo30d)}
            hint="Rolling 30-day revenue"
          />
          <MetricCard
            icon={DollarSign}
            label="MRR"
            value={ngn(data.revenue.mrrKobo)}
            hint="Monthly recurring — sum of active subscription prices"
          />
        </div>
      </section>

      {/* Growth */}
      <section className="mb-8">
        <h2 className="mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium">Growth</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Building2}
            label="Organizations"
            value={data.growth.organizations.total.toString()}
            hint={`+${data.growth.organizations.week} this week · +${data.growth.organizations.month} this month`}
          />
          <MetricCard
            icon={Users}
            label="Users"
            value={data.growth.users.total.toString()}
            hint={`+${data.growth.users.week} this week`}
          />
          <MetricCard
            icon={Users}
            label="Employees"
            value={data.growth.employees.total.toString()}
            hint={`${data.growth.employees.active} active`}
          />
          <MetricCard
            icon={Mail}
            label="Gmail connections"
            value={data.growth.gmail.connected.toString()}
            hint={`${data.growth.gmail.revoked} revoked`}
          />
        </div>
      </section>

      {/* Subscriptions */}
      <section className="mb-8">
        <h2 className="mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium">Subscriptions</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 grid gap-4">
            <MetricCard label="Active" value={data.subscriptions.active.toString()} />
            <MetricCard label="Trialing" value={data.subscriptions.trialing.toString()} />
            <MetricCard label="Past due" value={data.subscriptions.pastDue.toString()} tone={data.subscriptions.pastDue > 0 ? "warn" : "default"} />
            <MetricCard label="Cancelled" value={data.subscriptions.cancelled.toString()} />
          </div>
          <Card className="lg:col-span-2 p-5">
            <div className="mb-3 text-[13px] font-medium">Breakdown by plan</div>
            {data.subscriptions.byPlan.length === 0 ? (
              <p className="text-[13px] text-ink-3">No subscriptions yet.</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-ink-3 border-b border-line">
                    <th className="py-2 font-medium">Plan</th>
                    <th className="py-2 font-medium">Active</th>
                    <th className="py-2 font-medium">Trialing</th>
                    <th className="py-2 font-medium">Past due</th>
                    <th className="py-2 font-medium">Cancelled</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subscriptions.byPlan.map((row) => (
                    <tr key={row.plan} className="border-b border-line/60">
                      <td className="py-2 font-mono">{row.plan}</td>
                      <td className="py-2">{row.active}</td>
                      <td className="py-2">{row.trialing}</td>
                      <td className="py-2">{row.past_due}</td>
                      <td className="py-2 text-ink-3">{row.canceled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </section>

      {/* Health */}
      <section className="mb-8">
        <h2 className="mb-3 text-[12px] uppercase tracking-wider text-ink-3 font-medium">System health</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Mail} label="Emails sent today" value={data.health.emailsToday.toString()} />
          <MetricCard icon={AlertTriangle} label="Bounced (7d)" value={data.health.bouncedThisWeek.toString()} tone={data.health.bouncedThisWeek > 0 ? "warn" : "default"} />
          <MetricCard icon={Mail} label="Gmail revoked" value={data.health.gmailRevoked.toString()} tone={data.health.gmailRevoked > 0 ? "warn" : "default"} />
          <MetricCard icon={Globe} label="Failing domains" value={data.health.domainsFailing.toString()} tone={data.health.domainsFailing > 0 ? "warn" : "default"} />
        </div>
      </section>

      {/* Recent */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-medium">Recent activity</div>
            <span className="text-[11.5px] text-ink-3">Last 20</span>
          </div>
          {data.recentActivity.length === 0 ? (
            <p className="text-[13px] text-ink-3">No activity yet.</p>
          ) : (
            <ul className="space-y-2 text-[13px]">
              {data.recentActivity.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3">
                  <span className="font-mono text-ink-2 truncate">{a.action}</span>
                  <span className="text-ink-3 text-[11.5px] shrink-0">{new Date(a.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-medium">Recent billing events</div>
            <span className="text-[11.5px] text-ink-3">Last 10</span>
          </div>
          {data.recentBilling.length === 0 ? (
            <p className="text-[13px] text-ink-3">No billing events yet.</p>
          ) : (
            <ul className="space-y-2 text-[13px]">
              {data.recentBilling.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 min-w-0">
                    {b.status === "success"
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      : <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                    <span className="font-mono text-ink-2 truncate">{b.event_type}</span>
                  </span>
                  <span className="text-ink-3 text-[11.5px] shrink-0">{new Date(b.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, hint, tone, accent,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone?: "warn" | "default";
  accent?: boolean;
}) {
  return (
    <Card className={`p-5 ${accent ? "bg-primary/[0.04] border-primary/30" : ""}`}>
      <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-ink-3 font-medium">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </div>
      <div className={`mt-2 font-display text-2xl font-semibold tracking-tight ${tone === "warn" ? "text-amber-700" : ""}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-[12px] text-ink-3">{hint}</div>}
    </Card>
  );
}
