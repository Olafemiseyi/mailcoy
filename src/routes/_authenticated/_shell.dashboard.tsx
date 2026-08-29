import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardSummary } from "@/lib/dashboard.functions";
import { PageHeader, Card, Button, StatusPill } from "@/components/app/AppShell";
import {
  Globe,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  ArrowRight,
  Check,
  Mail,
  Rocket,
  Bot,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/Skeleton";
import { GlobalError } from "@/components/GlobalError";

const dashOpts = queryOptions({
  queryKey: ["dashboard-summary"],
  queryFn: async () => getDashboardSummary(),
  staleTime: 15_000,
});

export const Route = createFileRoute("/_authenticated/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Mailcoy" }] }),
  loader: ({ context }: any) => context.queryClient.ensureQueryData(dashOpts),
  pendingMs: 0,
  pendingComponent: () => <DashboardSkeleton />,
  errorComponent: ({ error, reset }) => <GlobalError error={error} reset={reset} />,
  component: DashboardRoute,
});

function DashboardRoute() {
  const _fetch = useServerFn(getDashboardSummary);
  void _fetch;
  const { data } = useSuspenseQuery(dashOpts);
  const setupIncomplete = data.domainsTotal === 0 || data.employeesTotal === 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Deliverability, team status, and recent activity at a glance."
        actions={
          <Link to="/domains" className="w-full sm:w-auto block">
            <Button variant="primary" className="w-full sm:w-auto">
              Add domain
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          icon={Globe}
          label="Domains"
          value={data.domainsTotal.toLocaleString()}
          sub={
            data.domainsTotal === 0
              ? "No domains yet"
              : `${data.domainsVerified} verified · ${data.domainsTotal - data.domainsVerified} pending`
          }
        />
        <StatCard
          icon={Users}
          label="Employees"
          value={data.employeesTotal.toLocaleString()}
          sub={
            data.employeesTotal === 0
              ? "No employees yet"
              : `${data.employeesConnected} active · ${data.employeesTotal - data.employeesConnected} pending`
          }
        />
        <StatCard
          icon={ArrowUpRight}
          label="24h email"
          value={data.sentToday.toLocaleString()}
          sub={
            <span className="inline-flex items-center gap-1">
              <ArrowDownLeft className="h-3 w-3" /> {data.receivedToday.toLocaleString()} received
            </span>
          }
        />
        <StatCard
          icon={ShieldCheck}
          label="Deliverability"
          value={`${data.deliverabilityPct}%`}
          sub={data.bouncedToday === 0 ? "No bounces in 24h" : `${data.bouncedToday} bounced`}
          tone={
            data.deliverabilityPct >= 95 ? "good" : data.deliverabilityPct >= 85 ? "warn" : "bad"
          }
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold text-ink">Workspace Apps</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/templates">
            <Card className="p-4 flex items-center gap-3 hover:border-primary/40 hover:bg-surface-muted/30 transition-all cursor-pointer group">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Rocket className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-ink truncate">Email Templates</div>
                <div className="text-[12px] text-ink-3 truncate">Build transactional HTML</div>
              </div>
            </Card>
          </Link>
          <Link to="/analytics">
            <Card className="p-4 flex items-center gap-3 hover:border-primary/40 hover:bg-surface-muted/30 transition-all cursor-pointer group">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-ink truncate">Analytics</div>
                <div className="text-[12px] text-ink-3 truncate">Volume & deliverability</div>
              </div>
            </Card>
          </Link>
          <Link to="/logs">
            <Card className="p-4 flex items-center gap-3 hover:border-primary/40 hover:bg-surface-muted/30 transition-all cursor-pointer group">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-ink truncate">Real-time Logs</div>
                <div className="text-[12px] text-ink-3 truncate">Monitor all traffic</div>
              </div>
            </Card>
          </Link>
          <Link to="/catch-all">
            <Card className="p-4 flex items-center gap-3 hover:border-primary/40 hover:bg-surface-muted/30 transition-all cursor-pointer group">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-ink truncate">Catch-All Webmail</div>
                <div className="text-[12px] text-ink-3 truncate">Shared team inbox</div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {!data.hasOrganization && (
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold">Create your workspace</h3>
              <p className="mt-1 text-[13.5px] text-ink-3">
                Start with your company profile, then add domains and teammates.
              </p>
            </div>
            <Link to="/onboarding" className="shrink-0">
              <Button>
                Continue setup <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {data.hasOrganization && setupIncomplete && <GettingStarted data={data} />}

      {data.hasOrganization && !setupIncomplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-0 lg:col-span-2">
            <div className="px-5 py-3 border-b border-line text-[13px] font-medium flex items-center justify-between">
              <span>Recent activity</span>
              <Link to="/logs" className="text-[12px] text-ink-3 hover:text-ink">
                View all →
              </Link>
            </div>
            {data.recentLogs.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-ink-3">No recent logs.</div>
            ) : (
              <ul className="divide-y divide-line">
                {data.recentLogs.map(
                  (log: {
                    id: string;
                    subject?: string;
                    sender: string;
                    receiver: string;
                    status: string;
                    timestamp: string;
                  }) => (
                    <li
                      key={log.id}
                      className="px-5 py-3 flex items-center justify-between gap-4 text-[13.5px]"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{log.subject || "(No subject)"}</div>
                        <div className="text-[12px] text-ink-3 truncate mt-0.5">
                          {log.sender} <span className="mx-1 opacity-50">→</span> {log.receiver}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <StatusPill status={log.status} />
                        <time className="text-[11.5px] text-ink-3">
                          {relativeTime(log.timestamp)}
                        </time>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            )}
          </Card>
          <DocsCard />
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: React.ReactNode;
  tone?: "good" | "warn" | "bad";
}) {
  const toneCls =
    tone === "bad" ? "text-red-600" : tone === "warn" ? "text-amber-600" : "text-ink-3";
  const iconCls =
    tone === "bad"
      ? "text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] bg-red-500/10"
      : tone === "good"
        ? "text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] bg-emerald-500/10"
        : "text-ink-4";

  return (
    <Card className="group relative overflow-hidden p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/40 cursor-default min-w-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 min-w-0">
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <span className="truncate text-ink-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold font-mono min-w-0">
            {label}
          </span>
          <div
            className={`p-1.5 rounded-md shrink-0 ${iconCls.includes("bg-") ? iconCls : "bg-surface-muted"}`}
          >
            <Icon className={`h-3.5 w-3.5 shrink-0 ${iconCls.includes("bg-") ? "" : iconCls}`} />
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3 font-display text-xl sm:text-2xl font-bold tracking-tight text-ink truncate">
          {value}
        </div>
        {sub && (
          <div className={`mt-1 sm:mt-1.5 text-[11px] sm:text-[11.5px] font-medium truncate ${toneCls}`}>
            {sub}
          </div>
        )}
      </div>
    </Card>
  );
}

function GettingStarted({
  data,
}: {
  data: {
    domainsTotal: number;
    domainsVerified: number;
    employeesTotal: number;
    employeesConnected: number;
  };
}) {
  const steps = [
    {
      done: data.domainsTotal > 0,
      label: "Add your sending domain",
      to: "/domains",
      cta: "Add domain",
    },
    { done: data.domainsVerified > 0, label: "Verify DNS records", to: "/domains", cta: "Verify" },
    {
      done: data.employeesTotal > 0,
      label: "Add employees",
      to: "/employees",
      cta: "Add employee",
    },
    {
      done: data.employeesConnected > 0,
      label: "Connect their Gmail",
      to: "/gmail",
      cta: "Connect Gmail",
    },
    { done: false, label: "Start sending business email", to: "/logs", cta: "View logs" },
  ] as const;
  const nextIdx = steps.findIndex((s) => !s.done);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="p-5 lg:col-span-2 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-[15px] font-bold text-ink">Getting started</h3>
          <p className="mt-1 text-[13px] text-ink-3">
            Complete these steps to activate your workspace email routing.
          </p>
        </div>
        <ol className="mt-4 space-y-1.5">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className={`flex items-center justify-between gap-3 p-2 rounded-xl transition ${
                i === nextIdx ? "bg-surface-muted/60 border border-line" : "hover:bg-ink/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    s.done ? "bg-emerald-500/15 text-emerald-600" : "bg-ink/[0.08] text-ink-3"
                  }`}
                >
                  {s.done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={`text-[13px] truncate ${s.done ? "text-ink-4 line-through" : "text-ink font-medium"}`}
                >
                  {s.label}
                </span>
              </div>
              {!s.done && i === nextIdx && (
                <Link to={s.to} className="shrink-0">
                  <Button variant="primary" className="h-7 px-2.5 text-[12px]">
                    {s.cta}
                  </Button>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Card>
      <DocsCard />
    </div>
  );
}

function DocsCard() {
  const links = [
    {
      label: "Domain setup guide",
      hash: "domains",
      icon: Globe,
      desc: "DNS records, SPF, DKIM, & DMARC",
    },
    {
      label: "Gmail connection guide",
      hash: "gmail",
      icon: Mail,
      desc: "Link employee Google inboxes",
    },
    {
      label: "Employee invitation guide",
      hash: "employees",
      icon: Users,
      desc: "Onboard staff to send/receive mail",
    },
    {
      label: "Quickstart & Setup FAQ",
      hash: "quickstart",
      icon: Rocket,
      desc: "Step-by-step setup order",
    },
  ] as const;

  return (
    <Card className="p-0 flex flex-col justify-between overflow-hidden shadow-xs border-line">
      <div className="px-5 py-3.5 border-b border-line bg-surface-muted/30">
        <h3 className="font-display text-[14.5px] font-bold text-ink">Documentation</h3>
        <p className="mt-0.5 text-[12px] text-ink-3">Quick guides for running email on Mailcoy.</p>
      </div>
      <div className="p-2.5 grid gap-1 flex-1">
        {links.map((l) => (
          <Link
            key={l.label}
            to="/help"
            hash={l.hash}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-muted/60 transition group min-w-0"
          >
            <div className="h-8 w-8 rounded-lg bg-ink/[0.04] group-hover:bg-primary/10 group-hover:text-primary transition grid place-items-center shrink-0">
              <l.icon className="h-4 w-4 text-ink-3 group-hover:text-primary transition" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12.5px] font-semibold text-ink truncate group-hover:text-primary transition">
                  {l.label}
                </span>
                <ArrowRight className="h-3 w-3 text-ink-4 shrink-0 group-hover:text-ink-2 transition -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
              <p className="text-[11px] text-ink-3 truncate leading-normal">{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="p-3 border-t border-line bg-surface-muted/10">
        <button
          onClick={() => window.dispatchEvent(new Event("open-ai-assistant"))}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium text-[13px] shadow-sm"
        >
          <Bot className="w-4 h-4" />
          Chat with Mailcoy AI
        </button>
      </div>
    </Card>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
