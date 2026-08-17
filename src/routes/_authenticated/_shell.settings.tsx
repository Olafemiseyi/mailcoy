import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppShell";

const TABS = [
  { to: "/settings", label: "Organization Profile" },
  { to: "/settings/members", label: "Team Admins & Members" },
  { to: "/settings/billing", label: "Billing & Plans" },
  { to: "/settings/api-keys", label: "API & Developers" },
] as const;

export const Route = createFileRoute("/_authenticated/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — Mailcoy" }] }),
  component: () => {
    const path = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname });
    return (
      <div>
        <PageHeader title="Settings" subtitle="Organization, team, integrations, and billing." />
        <nav className="mb-6 flex flex-wrap gap-1 border-b border-line">
          {TABS.map((t) => {
            const active = path === t.to || (t.to !== "/settings" && path.startsWith(t.to));
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`px-3 h-9 -mb-px inline-flex items-center border-b-2 text-[13px] ${
                  active ? "border-primary text-ink" : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <Outlet />
      </div>
    );
  },
});
