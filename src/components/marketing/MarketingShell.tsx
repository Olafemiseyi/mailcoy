import { Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { Logomark } from "@/components/brand/Logomark";
import { SupportChatWidget } from "@/components/SupportChatWidget";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/docs", label: "Docs" },
  { to: "/contact", label: "Contact" },
] as const;

export function MarketingShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-background/90 backdrop-blur-xl shadow-2xs">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logomark />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Mailcoy
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-2.5 py-1.5 text-[13.5px] text-ink-3 transition-colors hover:text-ink [&.active]:text-ink [&.active]:font-semibold"
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-xs transition-transform hover:translate-y-[-1px]"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:inline-flex text-[13px] text-ink-3 hover:text-danger px-2.5 py-1 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="hidden text-[13.5px] text-ink-3 transition-colors hover:text-ink sm:inline-block"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/signup"
                  className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-[13px] font-medium text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0_/_0.08)_inset] transition-transform hover:translate-y-[-1px]"
                >
                  Get started
                </Link>
              </>
            )}

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="ml-1 grid h-8 w-8 place-items-center rounded-md border border-line md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Modern Mobile Navigation Drawer */}
        {open && (
          <div className="border-t border-line bg-background/95 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-200">
            <nav className="mx-auto flex max-w-6xl flex-col p-4 space-y-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[14.5px] font-medium text-ink-2 hover:bg-surface-muted transition [&.active]:bg-primary [&.active]:text-primary-foreground [&.active]:font-semibold shadow-xs"
                  activeOptions={{ exact: n.to === "/" }}
                >
                  <span>{n.label}</span>
                  <span className="text-xs opacity-70">&rarr;</span>
                </Link>
              ))}
              
              <div className="pt-3 mt-2 border-t border-line">
                {user ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground shadow-xs"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                      className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-[13.5px] font-semibold text-danger hover:bg-danger/10 transition shadow-xs"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl border border-line bg-surface text-[13.5px] font-semibold text-ink shadow-xs"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/auth/signup"
                      onClick={() => setOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl bg-primary text-[13.5px] font-semibold text-primary-foreground shadow-xs"
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-14">{children}</main>

      <SupportChatWidget />
      <footer className="mt-28 border-t border-slate-800 bg-[#090d14] text-slate-200">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <Logomark className="h-6 w-6 text-primary" />
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  Mailcoy
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                  Operational
                </span>
              </div>
              <p className="max-w-sm text-[13.5px] leading-relaxed text-slate-400">
                The modern business email operating system. Connect your custom domain to your team's existing Gmail inboxes with zero Google Workspace markup.
              </p>
              
              {/* Contact Email & Trust */}
              <div className="space-y-1.5 pt-1 text-[13px] text-slate-400">
                <div>
                  <span className="text-slate-500 text-[11px] uppercase tracking-wider block font-mono">Official Inquiries:</span>
                  <a href="mailto:hello@mailcoy.com" className="font-mono text-slate-200 hover:text-primary transition font-medium">hello@mailcoy.com</a>
                </div>
              </div>

              {/* Live Status Badge */}
              <Link
                to="/status"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/90 text-[12px] text-slate-300 shadow-xs hover:border-slate-700 hover:text-white transition group"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="group-hover:text-white transition font-mono">All Systems Operational (99.99%)</span>
              </Link>

              {/* Trust & Security Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">🔒 TLS 1.3</span>
                <span className="flex items-center gap-1 font-mono">🛡️ 100% SPF/DKIM</span>
                <span className="flex items-center gap-1 font-mono">⚡ Sub-Second Relay</span>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white">
                Product
              </h4>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><Link to="/pricing" className="text-slate-400 transition-colors hover:text-white">Pricing & Plans</Link></li>
                <li><Link to="/auth/signup" className="text-slate-400 transition-colors hover:text-white">Start Free Trial</Link></li>
                <li><Link to="/auth/login" className="text-slate-400 transition-colors hover:text-white">Customer Sign In</Link></li>
                <li><Link to="/dashboard" className="text-slate-400 transition-colors hover:text-white">Admin Dashboard</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white">
                Resources
              </h4>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><Link to="/docs" className="text-slate-400 transition-colors hover:text-white">Documentation</Link></li>
                <li><Link to="/help" className="text-slate-400 transition-colors hover:text-white">Setup Guide & FAQs</Link></li>
                <li><Link to="/status" className="text-slate-400 transition-colors hover:text-white flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> System Status
                </Link></li>
                <li><Link to="/contact" className="text-slate-400 transition-colors hover:text-white">Help & Support</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white">
                Legal & Trust
              </h4>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li><Link to="/privacy" className="text-slate-400 transition-colors hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-400 transition-colors hover:text-white">Terms of Service</Link></li>
                <li><Link to="/about" className="text-slate-400 transition-colors hover:text-white">About Mailcoy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-slate-400">
            <p>© {new Date().getFullYear()} Mailcoy Technologies. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/status" className="hover:text-white transition-colors">Status</Link>
              <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { Logomark } from "@/components/brand/Logomark";