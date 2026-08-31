import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Zap, ShieldCheck, Mail, TrendingDown, Users, Lock, PenLine, Inbox, Radio, Copy, ChevronDown, Terminal, Globe, Server, ArrowRight, CheckCircle2, HelpCircle, Plus } from "lucide-react";
import { MarketingShell } from "./MarketingShell";
import { detectUserCurrency, type Currency } from "@/lib/currency";

export function LandingPage() {
  return (
    <MarketingShell>
      <Hero />
      <Logos />
      <InteractiveSimulator />
      <SavingsCalculator />
      <FeatureGrid />
      <FAQSection />
      <CTA />
    </MarketingShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Ambient background mesh glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 blur-[130px] rounded-full opacity-60 dark:opacity-40" />

      <div className="mx-auto max-w-6xl px-5 relative z-10">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1 text-[11px] sm:text-[12px] font-semibold text-ink-3 shadow-2xs backdrop-blur-sm whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Zero Workspace Markup · Scalable from 1 to 1,000+ Inboxes</span>
          </div>

          <h1 className="font-display text-[44px] sm:text-[60px] md:text-[72px] font-bold tracking-[-0.035em] text-ink leading-[1.04]">
            Professional email. <br />
            <span className="bg-gradient-to-r from-ink via-ink-2 to-ink-3 bg-clip-text text-transparent">
              Your real Gmail inbox.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-[16px] sm:text-[17.5px] leading-relaxed text-ink-3">
            Give your team branded email on your custom domain (<code className="font-mono text-primary font-semibold">sales@yourcompany.com</code>) without paying expensive Google Workspace per-seat licenses. Built for teams of 1 to 1,000+.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              to="/auth/signup"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[14.5px] font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 hover:translate-y-[-1px] w-full sm:w-auto whitespace-nowrap"
            >
              Start Free Trial <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-surface px-6 text-[14.5px] font-medium text-ink transition hover:bg-surface-muted shadow-2xs w-full sm:w-auto whitespace-nowrap"
            >
              View Pricing & ROI
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-ink-4 pt-1">
            <span className="flex items-center gap-1.5 font-medium">✓ No credit card required</span>
            <span className="flex items-center gap-1.5 font-medium">✓ 1-click DNS verification</span>
            <span className="flex items-center gap-1.5 font-medium">✓ Sub-200ms MX latency</span>
          </div>
        </div>

        {/* Interactive Hero Preview Frame */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
            {/* Top Browser Bar */}
            <div className="flex h-11 items-center justify-between border-b border-line bg-surface-muted/60 px-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-background border border-line text-[11.5px] font-mono text-ink-3 shadow-2xs max-w-xs truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>app.mailcoy.com/dashboard</span>
              </div>
              <div className="text-[11px] font-mono text-ink-4 hidden sm:block">Connected · TLS 1.3</div>
            </div>

            <DashboardStill />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardStill() {
  return (
    <div className="p-3.5 sm:p-5 md:p-6 bg-background space-y-3.5">
      {/* Header bar inside simulator */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-line/60">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary grid place-items-center font-bold text-[11px] shrink-0">
            M
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[13px] sm:text-[14px] font-bold text-ink truncate">
                Acme Global Ltd
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            </div>
            <p className="text-[10.5px] sm:text-[11px] font-mono text-ink-3 truncate">acmeglobal.com · Live Router</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>99.8% Inbox</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-mono text-ink-3 bg-surface border border-line whitespace-nowrap">
            ⚡ &lt; 180ms
          </span>
        </div>
      </div>

      {/* 3 Compact Metrics in a 3-column row on all screens */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-line bg-surface p-2.5 sm:p-3 text-center sm:text-left space-y-0.5 shadow-2xs">
          <div className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-mono text-ink-4 truncate">
            DNS Auth
          </div>
          <div className="text-[13px] sm:text-[15px] font-display font-bold text-ink truncate">
            100% Pass
          </div>
          <div className="text-[9.5px] sm:text-[11px] text-emerald-600 font-medium truncate">SPF · DKIM · DMARC</div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-2.5 sm:p-3 text-center sm:text-left space-y-0.5 shadow-2xs">
          <div className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-mono text-ink-4 truncate">
            Team Inboxes
          </div>
          <div className="text-[13px] sm:text-[15px] font-display font-bold text-ink truncate">
            12 Linked
          </div>
          <div className="text-[9.5px] sm:text-[11px] text-ink-3 truncate">Native Gmail App</div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-2.5 sm:p-3 text-center sm:text-left space-y-0.5 shadow-2xs">
          <div className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider font-mono text-ink-4 truncate">
            Workspace Savings
          </div>
          <div className="text-[13px] sm:text-[15px] font-display font-bold text-emerald-600 dark:text-emerald-400 truncate">
            80% Saved
          </div>
          <div className="text-[9.5px] sm:text-[11px] text-ink-3 truncate">Flat Team Billing</div>
        </div>
      </div>

      {/* Visual Live Relay Flow Graphic */}
      <div className="rounded-xl border border-line bg-surface p-3 sm:p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-4">
          <span className="uppercase tracking-wider font-semibold text-ink-3">Live Packet Relay</span>
          <span className="text-emerald-600 flex items-center gap-1 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-Time Stream
          </span>
        </div>

        {/* Visual node packet pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-center font-mono text-[11.5px]">
          <div className="p-2.5 rounded-lg border border-line bg-background text-ink font-medium truncate">
            <div className="text-[9px] uppercase tracking-wider text-ink-4">1. Inbound Domain</div>
            <div className="text-primary font-semibold truncate">sales@acmeglobal.com</div>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold text-[11px] flex items-center justify-center gap-1.5">
            <Zap className="h-3 w-3" /> Edge Route (0.12s)
          </div>
          <div className="p-2.5 rounded-lg border border-line bg-background text-ink font-medium truncate">
            <div className="text-[9px] uppercase tracking-wider text-ink-4">3. Delivered to Gmail</div>
            <div className="text-emerald-600 font-semibold truncate">david@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logos() {
  const companies = [
    { name: "LightOrb Innovations", tag: "Technology & AI" },
    { name: "Klem & Keys Realty", tag: "Real Estate" },
    { name: "LightOrb Connect", tag: "Enterprise SaaS" },
    { name: "SmartTable", tag: "Fintech Platform" },
    { name: "PharmIQ", tag: "HealthTech Systems" },
  ];

  return (
    <section className="border-y border-line bg-surface-muted/30 py-8 overflow-hidden relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="mx-auto max-w-6xl px-5 mb-4 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          Powering modern business email for forward-thinking teams
        </span>
      </div>

      <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
        {[...companies, ...companies].map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-line bg-surface shadow-2xs hover:border-primary/40 transition"
          >
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary font-bold text-xs grid place-items-center font-display">
              {c.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[13.5px] font-semibold text-ink tracking-tight">
                {c.name}
              </span>
              <span className="text-[10px] font-mono text-ink-4 uppercase tracking-wider">
                {c.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InteractiveSimulator() {
  const [tab, setTab] = useState<"dns" | "gmail" | "sendas">("dns");

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-[11.5px] font-semibold text-primary uppercase tracking-widest mb-3">
          <Zap className="h-3.5 w-3.5" /> Interactive Architecture
        </span>
        <h2 className="font-display text-[32px] font-bold tracking-tight sm:text-[44px] text-ink leading-tight">
          How Mailcoy Works Under the Hood
        </h2>
        <p className="mt-3 text-[15px] text-ink-3">
          Click the interactive tabs below to see how Mailcoy connects DNS authentication, Gmail relaying, and outbound signing.
        </p>
      </div>

      {/* Tabs - 100% responsive width grid */}
      <div className="flex justify-center mb-8 w-full max-w-xl mx-auto">
        <div className="grid grid-cols-3 w-full p-1 rounded-2xl bg-surface border border-line shadow-xs gap-1">
          {[
            { id: "dns", short: "DNS Auth", full: "1. DNS Verification", icon: Server },
            { id: "gmail", short: "Inbound Relay", full: "2. Gmail Inbound Relay", icon: Mail },
            { id: "sendas", short: "Send-As", full: "3. Outbound Send-As", icon: Zap },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-[13px] font-semibold transition cursor-pointer text-center min-w-0 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-ink-3 hover:text-ink hover:bg-surface-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate sm:hidden">{t.short}</span>
                <span className="truncate hidden sm:inline">{t.full}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-10 shadow-lg min-h-[340px]">
        {tab === "dns" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line">
              <div>
                <h3 className="font-display text-[18px] font-bold text-ink">
                  Automatic 4-Record Cryptographic DNS Verification
                </h3>
                <p className="text-[13px] text-ink-3">
                  Add 2 MX records, 1 SPF TXT, and 1 DKIM CNAME to prove domain ownership.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[11.5px] font-bold border border-emerald-500/20">
                ✓ 100% DMARC Alignment
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-line bg-background">
              <table className="w-full text-left text-[12.5px] min-w-[500px]">
                <thead className="bg-surface-muted/60 text-[11px] uppercase tracking-wider font-semibold text-ink-3 border-b border-line">
                  <tr>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Host</th>
                    <th className="px-4 py-2.5">Target / Value</th>
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-mono">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-ink">MX</td>
                    <td className="px-4 py-3 text-ink-3">@</td>
                    <td className="px-4 py-3 text-ink">inbound.mailcoy.com</td>
                    <td className="px-4 py-3">10</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-bold">Active ✓</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-ink">TXT</td>
                    <td className="px-4 py-3 text-ink-3">@</td>
                    <td className="px-4 py-3 text-ink">v=spf1 include:mailcoy.com ~all</td>
                    <td className="px-4 py-3 text-ink-4">—</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-bold">Active ✓</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-ink">TXT</td>
                    <td className="px-4 py-3 text-ink-3">_dmarc</td>
                    <td className="px-4 py-3 text-ink">v=DMARC1; p=quarantine;</td>
                    <td className="px-4 py-3 text-ink-4">—</td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-bold">Active ✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "gmail" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line">
              <div>
                <h3 className="font-display text-[18px] font-bold text-ink">
                  Sub-200ms Inbound Forwarding to Personal Gmail
                </h3>
                <p className="text-[13px] text-ink-3">
                  Customer emails sent to your business email arrive in your standard Gmail app in real-time.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11.5px] font-bold border border-primary/20">
                ⚡ 180ms Relay Time
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 rounded-xl border border-line bg-background space-y-2">
                <span className="text-[11px] font-mono text-ink-4 uppercase">1. Customer Sends</span>
                <div className="font-mono text-[13px] font-semibold text-ink">client@apple.com</div>
                <p className="text-[12px] text-ink-3">Customer composes email to sales@yourcompany.com</p>
              </div>
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/[0.04] space-y-2">
                <span className="text-[11px] font-mono text-primary font-bold uppercase">2. Mailcoy Edge Relay</span>
                <div className="font-mono text-[13px] font-semibold text-ink">inbound.mailcoy.com</div>
                <p className="text-[12px] text-ink-3">Validates spam filters, extracts destination, forwards packet.</p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] space-y-2">
                <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase">3. Gmail Inbox Pop</span>
                <div className="font-mono text-[13px] font-semibold text-ink">staff@gmail.com</div>
                <p className="text-[12px] text-ink-3">Arrives in standard Gmail mobile and desktop inboxes instantly.</p>
              </div>
            </div>
          </div>
        )}

        {tab === "sendas" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line">
              <div>
                <h3 className="font-display text-[17px] sm:text-[18px] font-bold text-ink">
                  Native Gmail "Send As" Outbound Integration
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-ink-3">
                  Reply directly in Gmail. The recipient sees your custom branded address with verified DKIM signatures.
                </p>
              </div>
              <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[11px] sm:text-[11.5px] font-bold border border-emerald-500/20 whitespace-nowrap">
                🔒 Cryptographically Signed
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl border border-line bg-background space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-[12px] sm:text-[13px] border-b border-line pb-2.5 font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-ink-4 shrink-0">From:</span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-line font-semibold text-ink truncate">
                    John Doe &lt;sales@yourcompany.com&gt;
                  </span>
                </div>
                <span className="text-emerald-600 text-[11px] sm:text-xs font-semibold shrink-0 self-start sm:self-auto">
                  ✓ Verified Sender
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12px] sm:text-[13px] border-b border-line pb-2.5 font-mono">
                <span className="text-ink-4 shrink-0">To:</span>
                <span className="text-ink truncate">client@apple.com</span>
              </div>
              <div className="text-[12.5px] sm:text-[13px] text-ink-3 pt-0.5 leading-relaxed">
                "Hello! Thank you for contacting us. Here is the formal enterprise proposal attached."
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SavingsCalculator() {
  const [employees, setEmployees] = useState(25);
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    setCurrency(detectUserCurrency());
  }, []);

  const gwRate = currency === "USD" ? 7 : 5740;
  // Dynamic tiered rate for Mailcoy calculation up to 500 users
  const mcRate = currency === "USD"
    ? (employees <= 5 ? 1.8 : employees <= 20 ? 1.45 : employees <= 50 ? 1.26 : 0.95)
    : (employees <= 5 ? 1500 : employees <= 20 ? 1000 : employees <= 50 ? 800 : 650);
  const sym = currency === "USD" ? "$" : "₦";

  const workspaceYearly = employees * gwRate * 12;
  const mailcoyYearly = Math.round(employees * mcRate * 12);
  const annualSavings = workspaceYearly - mailcoyYearly;
  const percentageSaved = Math.round((annualSavings / workspaceYearly) * 100);

  return (
    <section className="border-t border-line bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
          <h2 className="font-display text-[26px] sm:text-[34px] md:text-[40px] font-bold tracking-tight text-ink leading-tight">
            See How Much You Save vs. Google Workspace
          </h2>
          <p className="text-[14px] sm:text-[15px] text-ink-3 leading-relaxed">
            Eliminate per-seat markups for email. Flat team economics scale smoothly from solo startups to 500+ employees.
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-line bg-background p-4 sm:p-7 md:p-10 shadow-lg">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[12px] sm:text-[13.5px] font-semibold text-ink uppercase tracking-wider">
                  Team Size (Staff Inboxes)
                </label>
                <span className="font-mono text-base sm:text-2xl font-bold text-primary px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-primary/10 border border-primary/20 whitespace-nowrap">
                  {employees} {employees === 1 ? "person" : "people"}
                </span>
              </div>

              <input
                type="range"
                min="3"
                max="500"
                step={employees > 100 ? "10" : "1"}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary my-2"
              />

              <div className="flex justify-between text-[11px] sm:text-[11.5px] text-ink-4 font-mono px-0.5">
                <span>3 staff</span>
                <span>50 staff</span>
                <span>200 staff</span>
                <span>500+ Enterprise</span>
              </div>

              <div className="pt-2 sm:pt-4 space-y-2 text-[12.5px] sm:text-[13px] text-ink-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-line gap-1">
                  <span className="text-ink-3">Google Workspace ({sym}{gwRate.toLocaleString()}/seat/mo):</span>
                  <span className="font-mono font-semibold text-ink-2 self-start sm:self-auto">
                    {sym}{workspaceYearly.toLocaleString()} / year
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-line gap-1">
                  <span className="text-ink-3">Mailcoy Flat Team Rate (~{sym}{mcRate.toLocaleString()}/seat/mo eq):</span>
                  <span className="font-mono font-bold text-emerald-600 self-start sm:self-auto">
                    {sym}{mailcoyYearly.toLocaleString()} / year
                  </span>
                </div>
              </div>
            </div>

            {/* Savings Badge Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 sm:p-7 text-center space-y-2.5 shadow-sm">
              <span className="text-[11px] sm:text-[11.5px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold block">
                Your Estimated Annual Savings
              </span>
              <div className="font-display text-[32px] sm:text-[44px] md:text-[50px] font-bold text-emerald-600 tracking-tight leading-tight">
                {sym}{annualSavings.toLocaleString()}
                <span className="text-[15px] sm:text-[17px] text-ink-3 font-normal font-sans"> / yr</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 max-w-full">
                <TrendingDown className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Save ~{percentageSaved}% every single year</span>
              </div>
              <p className="text-[11.5px] sm:text-[12px] text-ink-3 max-w-xs mx-auto pt-1 leading-relaxed">
                Keep the same professional custom domain with zero workflow changes for your staff.
              </p>
              <Link
                to="/auth/signup"
                className="mt-3 inline-flex w-full h-11 items-center justify-center gap-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[13.5px] sm:text-[14px] shadow-xs hover:opacity-95 transition"
              >
                Claim Your Savings <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const bento = [
    {
      title: "Zero Credential Storage & OAuth 2.0",
      desc: "We never ask for or store employee Google passwords. All access is governed by official Google OAuth with AES-256 GCM token encryption.",
      tag: "Security First",
      colSpan: "md:col-span-2",
      icon: Lock,
    },
    {
      title: "Sub-200ms Edge Delivery at Scale",
      desc: "High-throughput Anycast edge routing forwards customer inquiries directly to Gmail in under 200 milliseconds, engineered for millions of monthly messages.",
      tag: "High Throughput",
      colSpan: "md:col-span-1",
      icon: Zap,
    },
    {
      title: "Company-Wide HTML Signatures",
      desc: "Deploy standardized email signature templates with dynamic employee variables across your entire organization with 1 click.",
      tag: "Brand Identity",
      colSpan: "md:col-span-1",
      icon: PenLine,
    },
    {
      title: "Shared Aliases & Catch-All Routing",
      desc: "Create sales@, support@, or billing@ and broadcast or round-robin inquiries to multiple team members without extra seat charges.",
      tag: "Zero Seat Fees",
      colSpan: "md:col-span-2",
      icon: Inbox,
    },
  ];

  return (
    <section className="border-y border-line bg-surface-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
            <ShieldCheck className="h-3.5 w-3.5" /> Built for Scale
          </span>
          <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-bold tracking-tight text-ink leading-tight">
            Engineered to replace <br className="hidden sm:inline" />
            Google Workspace seat markup.
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15px] text-ink-3 leading-relaxed">
            All the enterprise email features your company needs, with flat-rate team economics scaling from 1 to 1,000+ seats.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {bento.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`${item.colSpan} rounded-2xl border border-line bg-surface p-5 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-4 px-2.5 py-1 rounded-md bg-surface-muted border border-line">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-ink-3">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is Mailcoy only for small teams, or does it scale to large enterprises with 50, 100, 500+ employees?",
      a: "Mailcoy is architected to scale seamlessly from a solo founder up to enterprises with 1,000+ staff across multiple global domains. Our infrastructure uses high-throughput Anycast edge MX relays, redundant buffering queues, dedicated IP warming pools, and centralized RBAC controls. Whether you have 5 or 500 employees, you get 99.8%+ inbox placement with flat, predictable economics.",
    },
    {
      q: "Do my employees need to create new accounts or learn new software?",
      a: "No. Your employees continue logging into their regular, existing Gmail inbox on web, iPhone, or Android. They read incoming customer inquiries and reply directly inside Gmail as sales@yourcompany.com with zero training required.",
    },
    {
      q: "Does Mailcoy host my emails, store passwords, or replace Google storage?",
      a: "No, and that is our deliberate architectural superpower. By decoupling custom domain identity and routing from bloated mailbox storage, your team keeps their 15GB+ free Google Cloud storage with zero vendor lock-in. We never store employee Google passwords; all authentication uses official Google OAuth with AES-256 GCM token encryption under Google CASA compliance.",
    },
    {
      q: "How does Mailcoy protect against spam, spoofing, and ensure 99.8%+ inbox delivery?",
      a: "Mailcoy cryptographically signs all outgoing messages with 1024/2048-bit DKIM private keys and authenticates SPF and DMARC alignment. We maintain strict IP reputation with continuous DNSBL monitoring and sub-200ms Anycast MX routing to ensure your emails land in the primary inbox.",
    },
    {
      q: "Can I use shared addresses like sales@ or support@ with multiple team members?",
      a: "Yes! Mailcoy supports unlimited department aliases with both Broadcast (fan-out to all team members simultaneously) and Round-Robin (sequential distribution) routing at no extra charge.",
    },
    {
      q: "What happens if an employee leaves the company?",
      a: "With Mailcoy's 1-Click Offboarding Shield, you can instantly revoke the employee's routing from your dashboard. Incoming customer messages immediately redirect to a manager or team alias, protecting company contacts and confidential conversations.",
    },
    {
      q: "Can a single founder or staff member manage multiple email addresses in one Gmail inbox?",
      a: "Yes. You can route hello@company.com, billing@company.com, and ceo@company.com to one single personal Gmail account. When composing in Gmail, you simply choose the desired address from the 'From' dropdown, and replies automatically use the original address.",
    },
    {
      q: "How does Mailcoy compare in cost to Google Workspace or Microsoft 365?",
      a: "Google Workspace charges $7 to $18 per user every month ($140/mo for 20 users, $700/mo for 100 users). Mailcoy charges flat team billing starting at $9/mo (₦7,500/mo) for 5 inboxes or $29/mo (₦20,000/mo) for 20 inboxes, with custom enterprise plans saving companies over 80% on email infrastructure costs.",
    },
    {
      q: "What happens if Google or an edge server experiences temporary downtime?",
      a: "Mailcoy operates redundant multi-region Anycast fallback MX proxies (mx1.mailcoy.com and mx2.mailcoy.com). If an upstream inbox is momentarily unreachable, incoming messages are automatically buffered in secondary retry queues with exponential backoff until delivered.",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-5 py-16 sm:py-24">
      <div className="text-center mb-12 sm:mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-[11.5px] font-semibold text-primary uppercase tracking-widest">
          <HelpCircle className="h-3.5 w-3.5" /> Direct Answers
        </span>
        <h2 className="font-display text-[28px] sm:text-[36px] md:text-[42px] font-bold text-ink tracking-tight leading-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-[14.5px] sm:text-[16px] text-ink-3 max-w-lg mx-auto leading-relaxed">
          Everything you need to know about architecture, security, and setting up Mailcoy for your team.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          const num = String(i + 1).padStart(2, "0");
          return (
            <div
              key={faq.q}
              className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border border-primary/30 bg-surface shadow-sm ring-2 ring-primary/10"
                  : "border border-line bg-surface/70 hover:bg-surface hover:border-line-strong hover:shadow-2xs"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="group w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-start sm:items-center justify-between gap-3.5 sm:gap-4 cursor-pointer transition whitespace-normal"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                  <span
                    className={`font-mono text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors mt-0.5 sm:mt-0 ${
                      isOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-muted text-ink-4 group-hover:text-ink"
                    }`}
                  >
                    {num}
                  </span>
                  <span
                    className={`leading-snug break-words text-[14.5px] sm:text-[16px] transition-colors min-w-0 flex-1 ${
                      isOpen ? "font-bold text-ink" : "font-semibold text-ink-2 group-hover:text-ink"
                    }`}
                  >
                    {faq.q}
                  </span>
                </div>

                <div
                  className={`h-7 w-7 rounded-full shrink-0 grid place-items-center transition-all duration-200 mt-0.5 sm:mt-0 ${
                    isOpen
                      ? "bg-primary text-primary-foreground rotate-45 shadow-2xs"
                      : "bg-surface-muted text-ink-3 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <Plus className="h-3.5 w-3.5 transition-transform duration-200" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-6 pb-5 pt-1 text-[13.5px] sm:text-[14.5px] text-ink-3 leading-relaxed border-t border-line/50 animate-in fade-in slide-in-from-top-1 duration-200 break-words whitespace-normal pl-4 sm:pl-14">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-ink px-6 py-16 text-center text-primary-foreground md:px-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent pointer-events-none" />
        <h2 className="relative font-display text-[34px] font-bold leading-tight tracking-tight sm:text-[48px]">
          Ready to save 80% on business email?
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-[15.5px] text-primary-foreground/80 leading-relaxed">
          Set up in less than 5 minutes. No credit card required. Keep the exact Gmail workflow your staff already loves.
        </p>
        <div className="relative mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full max-w-sm sm:max-w-none mx-auto">
          <Link
            to="/auth/signup"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-ink px-6 text-[14px] font-bold shadow-lg hover:bg-slate-100 transition w-full sm:w-auto whitespace-nowrap"
          >
            Start For Free <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 text-[14px] font-semibold text-white hover:bg-white/15 transition w-full sm:w-auto whitespace-nowrap"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </section>
  );
}