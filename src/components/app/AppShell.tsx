// Shared UI primitives for the authenticated app.
import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { Logomark } from "@/components/brand/Logomark";
import {
  LayoutDashboard, Globe, Users, Mail, ScrollText, Settings as SettingsIcon,
  LogOut, PanelLeftClose, PanelLeftOpen, Menu, X, BarChart3, AtSign, PenLine, Inbox,
  BookOpen, HelpCircle, Sun, Moon, Laptop, User as UserIcon, Trash2, ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrganization } from "@/lib/orgs.functions";
import { useEffect, useState, type ReactNode } from "react";
import { SupportChatWidget } from "@/components/SupportChatWidget";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/domains", label: "Domains", icon: Globe },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/gmail", label: "Gmail", icon: Mail },
  { to: "/aliases", label: "Aliases", icon: AtSign },
  { to: "/signatures", label: "Signatures", icon: PenLine },
  { to: "/catch-all", label: "Catch-all", icon: Inbox },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/help", label: "Help & Docs", icon: HelpCircle },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;



const COLLAPSED_KEY = "mailcoy:sidebar-collapsed";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useEffect(() => {
    const stored = localStorage.getItem("mailcoy_theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("mailcoy_theme", next);
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return next;
    });
  };

  return { theme, toggle };
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s: { location: { pathname: string } }) => s.location.pathname });
  const router = useRouter();
  const qc = useQueryClient();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const fetchOrg = useServerFn(getMyOrganization);
  const { data: org } = useQuery({
    queryKey: ["my-org"],
    queryFn: async () => fetchOrg(),
    staleTime: 60_000,
  });
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "1"); } catch { /* noop */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0"); } catch { /* noop */ }
  }, [collapsed]);
  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [path]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth/login", replace: true });
  }
  const navItems = NAV;
  const isActive = (to: string) => path === to || path.startsWith(to + "/");
  const currentLabel = navItems.find((n) => isActive(n.to))?.label ?? "Workspace";

  const orgName = (org as { name?: string } | null | undefined)?.name ?? "";
  const orgLogo = (org as { logo_url?: string | null } | null | undefined)?.logo_url ?? null;
  const orgInitial = orgName ? orgName.charAt(0).toUpperCase() : "•";

  const [userEmail, setUserEmail] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ""));
  }, []);
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "•";

  return (
    <div
      className={`min-h-screen bg-background text-foreground grid grid-cols-1 grid-rows-[auto_1fr] md:grid-rows-none ${
        collapsed ? "md:grid-cols-[64px_1fr]" : "md:grid-cols-[220px_1fr]"
      } transition-[grid-template-columns] duration-200`}
    >
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col border-r border-line bg-background sticky top-0 h-screen">
        <div className={`h-14 flex items-center ${collapsed ? "justify-center px-2" : "px-5"} border-b border-line`}>
          {collapsed ? (
            <Link to="/dashboard" title="Mailcoy">
              <Logomark className="h-6 w-6" />
            </Link>
          ) : (
            <Link to="/dashboard" className="flex items-center gap-2.5 font-display font-bold text-ink hover:opacity-90 transition">
              <Logomark className="h-6 w-6" />
              <div className="flex flex-col">
                <span className="text-[15px] leading-tight">Mailcoy</span>
                {orgName && (
                  <span className="text-[10px] font-sans font-normal text-ink-4 truncate max-w-[130px]">
                    {orgName}
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>

        <nav className="px-2 py-3 flex-1 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                className={`group relative flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13.5px] whitespace-nowrap transition ${
                  active ? "bg-primary text-primary-foreground" : "text-ink-2 hover:bg-ink/[0.04]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2 z-40 hidden group-hover:block whitespace-nowrap rounded-md border border-line bg-surface px-2 py-1 text-[12px] text-ink shadow-sm">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-2 space-y-0.5">
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13px] text-ink-3 hover:bg-ink/[0.04] transition`}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13px] text-ink-3 hover:bg-ink/[0.04] transition`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>}
          </button>
          <button
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2.5 px-3"} h-9 rounded-md text-[13px] text-ink-3 hover:text-danger hover:bg-danger/10 transition`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
          {orgName && (
            <div className={`mt-2 flex items-center ${collapsed ? "justify-center" : "gap-2 px-2"} h-10 rounded-md bg-ink/[0.03] border border-line`}>
              {orgLogo ? (
                <img src={orgLogo} alt="" className="h-6 w-6 rounded object-cover shrink-0" />
              ) : (
                <div className="h-6 w-6 rounded bg-primary text-primary-foreground grid place-items-center text-[11px] font-semibold shrink-0">
                  {orgInitial}
                </div>
              )}
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-[12px] font-medium truncate">{orgName}</div>
                  <div className="text-[10px] text-ink-3 truncate">Workspace</div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 border-b border-line bg-background/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-display font-bold text-ink">
            <Logomark className="h-5 w-5" />
            <span className="text-[15px]">Mailcoy</span>
            {orgName && <span className="text-xs text-ink-4 font-normal">/ {orgName}</span>}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-2"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-background border-r border-line flex flex-col animate-in slide-in-from-left duration-200">
            <div className="h-14 px-4 flex items-center justify-between border-b border-line">
              <div className="flex items-center gap-2 font-display font-bold text-ink">
                <Logomark className="h-5 w-5" /> Mailcoy
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-md text-ink-3 hover:bg-ink/[0.04]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 h-11 rounded-md text-[14px] whitespace-nowrap transition ${
                      active ? "bg-primary text-primary-foreground" : "text-ink-2 hover:bg-ink/[0.04]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={signOut}
              className="m-3 flex items-center gap-3 px-3 h-11 rounded-md text-[13.5px] text-ink-3 border border-line hover:text-danger hover:bg-danger/10 transition"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </aside>
        </div>
      )}

      <main className="min-w-0">
        {/* Impersonation Banner */}
        {typeof window !== "undefined" && localStorage.getItem("mailcoy_impersonating_org_name") && (
          <div className="bg-amber-500 text-amber-950 px-4 py-2 text-[12.5px] font-medium flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-950 animate-pulse" />
              <span>
                <strong>Super Admin Ghost Mode:</strong> Viewing as <strong>{localStorage.getItem("mailcoy_impersonating_org_name")}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("mailcoy_impersonating_org_id");
                localStorage.removeItem("mailcoy_impersonating_org_name");
                window.location.href = "/admin/organizations";
              }}
              className="px-2.5 py-1 bg-amber-950 text-amber-100 rounded text-[11.5px] font-semibold hover:bg-black transition"
            >
              Exit Impersonation
            </button>
          </div>
        )}

        {/* Trial Status & Expiration Banner */}
        {org?.subscription && (
          <>
            {org.subscription.isLocked ? (
              <div className="bg-rose-500 text-white px-4 py-2.5 text-[13px] font-medium flex flex-wrap items-center justify-between gap-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span>
                    <strong>Subscription Inactive:</strong> Your workspace features are locked. Please activate your subscription to continue routing email and managing domains.
                  </span>
                </div>
                <Link
                  to="/settings/billing"
                  className="px-3 py-1 bg-white text-rose-600 rounded-lg text-[12px] font-bold shadow-xs hover:bg-rose-50 transition whitespace-nowrap"
                >
                  Activate Plan & Unlock →
                </Link>
              </div>
            ) : null}
          </>
        )}

        <div className="hidden md:flex sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur px-5 md:px-10 h-14 items-center justify-between">
          <div className="text-[13px] text-ink-3 truncate">{currentLabel}</div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserChip email={userEmail} initial={userInitial} onSignOut={signOut} />
          </div>
        </div>
        <div className="px-5 md:px-10 py-6 md:py-8 max-w-6xl">{children}</div>
        <SupportChatWidget userEmail={userEmail} />
      </main>
    </div>
  );
}

type ThemeMode = "system" | "light" | "dark";
const THEME_KEY = "mailcoy:theme";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (mode === "system") {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.add(dark ? "dark" : "light");
  } else {
    root.classList.add(mode);
  }
}

function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem(THEME_KEY) as ThemeMode)) || "system";
    setMode(saved);
    applyTheme(saved);
    if (saved === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const fn = () => applyTheme("system");
      mq.addEventListener("change", fn);
      return () => mq.removeEventListener("change", fn);
    }
  }, []);
  function pick(m: ThemeMode) {
    setMode(m); applyTheme(m);
    try { localStorage.setItem(THEME_KEY, m); } catch { /* noop */ }
    setOpen(false);
  }
  const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Laptop;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle theme"
        className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-2 hover:bg-ink/[0.04]"
      >
        <Icon className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-36 rounded-md border border-line bg-surface p-1 shadow-lg z-40">
            {(["system", "light", "dark"] as const).map((m) => {
              const I = m === "dark" ? Moon : m === "light" ? Sun : Laptop;
              return (
                <button
                  key={m}
                  onClick={() => pick(m)}
                  className={`w-full flex items-center gap-2 px-2 h-8 rounded text-[13px] capitalize hover:bg-ink/[0.05] ${mode === m ? "text-ink font-medium" : "text-ink-2"}`}
                >
                  <I className="h-3.5 w-3.5" /> {m}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function UserChip({ email, initial, onSignOut }: { email: string; initial: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account"
        className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-[12px] font-semibold"
      >
        {initial}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-56 rounded-md border border-line bg-surface p-1 shadow-lg z-40">
            <div className="px-2.5 py-2 border-b border-line">
              <div className="text-[12px] text-ink-3">Signed in as</div>
              <div className="text-[13px] font-medium truncate">{email || "—"}</div>
            </div>
            <Link to="/settings" onClick={() => setOpen(false)} className="w-full flex items-center gap-2 px-2 h-8 rounded text-[13px] text-ink-2 hover:bg-ink/[0.05]">
              <UserIcon className="h-3.5 w-3.5" /> Account settings
            </Link>
            <button onClick={onSignOut} className="w-full flex items-center gap-2 px-2 h-8 rounded text-[13px] text-danger hover:bg-danger/10">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl md:text-[28px] font-semibold tracking-tight truncate">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-ink-3">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface ${className}`}>{children}</div>;
}

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const base = "inline-flex items-center justify-center h-9 px-4 rounded-md text-[13px] font-medium whitespace-nowrap transition disabled:opacity-50";
  const v =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : variant === "danger"
        ? "bg-danger text-white hover:opacity-90"
        : "border border-line hover:bg-ink/[0.04]";
  return <button className={`${base} ${v} ${className}`} {...rest} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-10 rounded-xl border border-line bg-background px-3 text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition ${props.className ?? ""}`}
    />
  );
}

export { CustomSelect, CustomSelect as Select } from "@/components/CustomSelect";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-ink-3">{hint}</span>}
    </label>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-700",
    connected: "bg-emerald-500/10 text-emerald-700",
    active: "bg-emerald-500/10 text-emerald-700",
    healthy: "bg-emerald-500/10 text-emerald-700",
    delivered: "bg-emerald-500/10 text-emerald-700",
    pending: "bg-amber-500/10 text-amber-700",
    pending_auth: "bg-amber-500/10 text-amber-700",
    invited: "bg-amber-500/10 text-amber-700",
    failed: "bg-red-500/10 text-red-700",
    bounced: "bg-red-500/10 text-red-700",
    inactive: "bg-ink/[0.06] text-ink-3",
    suspended: "bg-ink/[0.06] text-ink-3",
    deleted: "bg-ink/[0.06] text-ink-3",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${map[status] ?? "bg-ink/[0.06] text-ink-3"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function ConfirmDeleteModal({
  title,
  description,
  confirmLabel = "Delete",
  busy = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  description?: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <Card className="w-full max-w-md p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-danger/10 text-danger">
            <Trash2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            {description && (
              <p className="mt-1 text-[13.5px] text-ink-3">{description}</p>
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}

