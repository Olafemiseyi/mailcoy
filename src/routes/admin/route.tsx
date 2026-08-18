// Isolated admin layout: separate from the customer `_authenticated` shell.
// Checks Supabase session + platform admin role. Redirects to /admin/login otherwise.
import { createFileRoute, Outlet, redirect, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getPlatformAdminStatus } from "@/lib/admin.functions";
import { Logomark } from "@/components/brand/Logomark";
import { LayoutDashboard, Building2, LogOut, ShieldCheck, Activity, Server, Tag } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }: any) => {
    if (location.pathname === "/admin/login") return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    try {
      const status = await getPlatformAdminStatus();
      if (!status.isPlatformAdmin) throw redirect({ to: "/admin/login" });
    } catch (e) {
      if (e && typeof e === "object" && "to" in e) throw e;
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/organizations", label: "Organizations", icon: Building2 },
  { to: "/admin/promos", label: "Promo Codes", icon: Tag },
  { to: "/admin/status", label: "System status & Infrastructure", icon: Activity },
] as const;

function AdminLayout() {
  const router = useRouter();
  const qc = useQueryClient();
  const path = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname });

  // The login route reuses AuthShell — render bare Outlet without chrome.
  if (path === "/admin/login") return <Outlet />;

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-line bg-background/95 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-5">
          <Link to="/admin" className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight">
            <Logomark className="h-5 w-5" />
            <span>Mailcoy</span>
            <span className="ml-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Admin
            </span>
          </Link>
          <nav className="ml-6 hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.to || (n.to !== "/admin" && path.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`inline-flex items-center gap-2 h-8 px-3 rounded-md text-[13px] ${
                    active ? "bg-ink/[0.06] text-ink" : "text-ink-3 hover:text-ink hover:bg-ink/[0.03]"
                  }`}
                >
                  <n.icon className="h-3.5 w-3.5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto">
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[13px] text-ink-3 hover:text-ink hover:bg-ink/[0.03]"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
