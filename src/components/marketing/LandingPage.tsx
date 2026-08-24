import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Check,
  Zap,
  ShieldCheck,
  Mail,
  TrendingDown,
  Sparkles,
  Users,
  Lock,
  PenLine,
  Inbox,
  Radio,
} from "lucide-react";
import { MarketingShell } from "./MarketingShell";

export function LandingPage() {
  return (
    <MarketingShell>
      <Hero />
      <Logos />
      <HowItWorks />
      <SavingsCalculator />
      <FeatureGrid />
      <RoutingDiagram />
      <CTA />
    </MarketingShell>
  );
}

function Hero() {
  return (
    <section className="paper-grain relative">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-3">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Now in early access
          </span>
          <h1 className="font-display mt-6 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[56px] md:text-[68px]">
            Professional email.
            <br />
            <span className="text-ink-3">Gmail workflow.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-ink-3">
            Give your team business email on your domain — sales@, support@, everyone@ — while they keep using the Gmail they already know. Set up in minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/signup"
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-[14px] font-medium text-primary-foreground transition-transform hover:translate-y-[-1px]"
            >
              Start free <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-10 items-center rounded-md border border-line-strong bg-surface px-4 text-[14px] font-medium text-ink transition-colors hover:bg-surface-muted"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-[12.5px] text-ink-4">
            No credit card. Connect your domain in under 5 minutes.
          </p>
        </div>

        {/* Product preview card */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          {/* Ambient glow */}
          <div className="absolute inset-x-12 -bottom-10 h-32 rounded-full bg-primary/20 blur-3xl opacity-75 transition duration-500 group-hover:opacity-100" />

          <div className="hero-tilt-card group relative overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_25px_70px_-20px_oklch(0.12_0_0_/_0.25)] hover:border-primary/50">
            {/* Top Browser Bar */}
            <div className="flex h-11 items-center justify-between border-b border-line bg-surface-muted/70 px-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background/80 border border-line text-[11.5px] font-mono text-ink-3 shadow-2xs max-w-xs truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>app.mailcoy.com/dashboard</span>
              </div>
              <div className="text-[11px] font-mono text-ink-4 hidden sm:block">Mailcoy v2.4 Live</div>
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
    <div className="grid gap-6 p-4 sm:p-6 md:p-8 md:grid-cols-[200px_1fr]">
      {/* Sidebar Mockup */}
      <aside className="hidden flex-col justify-between border-r border-line/60 pr-5 md:flex">
        <div className="space-y-1">
          <div className="flex items-center gap-2 pb-4 mb-2 border-b border-line">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-display text-[14px] font-bold text-ink tracking-tight">Mailcoy OS</span>
          </div>
          {[
            { label: "Overview", active: true },
            { label: "Domains & DNS", active: false },
            { label: "Employees (12)", active: false },
            { label: "Gmail Sync", active: false },
            { label: "Routing & Aliases", active: false },
            { label: "Delivery Logs", active: false },
            { label: "Settings", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-lg px-3 py-2 text-[12.5px] font-medium transition cursor-default flex items-center justify-between ${
                item.active
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-ink-3 hover:text-ink hover:bg-surface-muted"
              }`}
            >
              <span>{item.label}</span>
              {item.active && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl border border-line bg-surface-muted/50 space-y-1">
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-ink-4">Workspace</div>
          <div className="font-display text-[13px] font-bold text-ink truncate">Mailcoy Inc</div>
          <div className="text-[11px] text-emerald-600 font-medium">● Enterprise Plan</div>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <div className="min-w-0 space-y-5">
        {/* Header inside mockup */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-line/50">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink">
              Executive Overview
            </h3>
            <p className="text-[12.5px] text-ink-3">Live mail delivery and custom domain routing status.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-mono font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> mailcoy.com Active
          </span>
        </div>

        {/* 3 Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Primary Domain", value: "mailcoy.com", note: "100% SPF/DKIM Pass", isGood: true },
            { label: "Active Team", value: "12 Inboxes", note: "Gmail Send-As Connected", isGood: false },
            { label: "Routed Today", value: "1,284 Emails", note: "0.2s Avg Delivery", isGood: true },
          ].map((card) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-xl border border-line bg-background/80 p-4 space-y-1.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="text-[11px] uppercase tracking-wider font-mono text-ink-4">{card.label}</div>
                <div className="flex items-center gap-1.5 text-[17px] font-display font-bold text-ink mt-1">
                  {card.isGood && <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                  {card.value}
                </div>
                <div className="text-[11.5px] text-ink-3 mt-0.5 font-medium">{card.note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live routing log */}
        <div className="rounded-xl border border-line bg-background/80 overflow-hidden shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md">
          <div className="flex items-center justify-between border-b border-line bg-surface-muted/40 px-4 py-2.5">
            <span className="text-[12.5px] font-semibold text-ink">Real-Time Routing Stream</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>
          <ul className="divide-y divide-line text-[12.5px]">
            {[
              { from: "sales@mailcoy.com", to: "akin@gmail.com", time: "Just now", status: "Delivered (0.1s)" },
              { from: "john@mailcoy.com", to: "john.doe@gmail.com", time: "2m ago", status: "Delivered (0.2s)" },
              { from: "support@mailcoy.com", to: "team@gmail.com", time: "5m ago", status: "Delivered (0.1s)" },
            ].map((row) => (
              <li
                key={row.from}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 hover:bg-surface-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono font-semibold text-ink truncate group-hover:text-primary transition-colors">{row.from}</span>
                  <span className="text-ink-4">→</span>
                  <span className="font-mono text-ink-3 truncate">{row.to}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto text-[11.5px]">
                  <span className="text-ink-4 font-mono">{row.time}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-mono font-semibold border border-emerald-500/20 shadow-xs">
                    {row.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Logos() {
  const companies = [
    { name: "Mailcoy Innovations", tag: "AI & Cloud Tech" },
    { name: "SmartTable", tag: "SaaS Productivity" },
    { name: "PharmIQ", tag: "HealthTech Systems" },
    { name: "Kalu & Co", tag: "Financial Services" },
    { name: "Northline Dynamics", tag: "Logistics" },
    { name: "Portway Logistics", tag: "Global Freight" },
    { name: "Empire Homes", tag: "Real Estate" },
    { name: "Ovate Media", tag: "Digital Agency" },
  ];

  return (
    <section className="border-y border-line bg-surface-muted/30 py-8 overflow-hidden relative">
      {/* Subtle Gradient Fades on Edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="mx-auto max-w-6xl px-5 mb-4 flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-ink-3">
          Trusted by fast-growing modern teams worldwide
        </span>
      </div>

      {/* Infinite Smooth Marquee Row */}
      <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
        {[...companies, ...companies].map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-line bg-surface/80 shadow-xs hover:border-primary/40 hover:bg-surface transition"
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

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Connect Your Domain",
      d: "Add your domain in 60 seconds. Mailcoy auto-configures your DNS with 1-click SPF, DKIM, and DMARC verification.",
      badge: "Zero Downtime",
      icon: ShieldCheck,
    },
    {
      n: "02",
      t: "Provision Team Inboxes",
      d: "Create custom addresses (sales@yourdomain.com, team@) and link them to teammates' existing Gmail inboxes.",
      badge: "No Passwords Needed",
      icon: Users,
    },
    {
      n: "03",
      t: "Send & Reply from Gmail",
      d: "Teammates receive and send professional branded emails straight from their standard Gmail mobile or web apps.",
      badge: "Zero Workspace Markup",
      icon: Zap,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-[11.5px] font-semibold text-primary uppercase tracking-widest mb-3">
          <Sparkles className="h-3.5 w-3.5" /> Frictionless Architecture
        </span>
        <h2 className="font-display text-[32px] font-bold tracking-tight sm:text-[44px] text-ink leading-tight">
          Three effortless steps. <br />
          <span className="text-ink-3">Zero new software to learn.</span>
        </h2>
        <p className="mt-3 text-[15px] text-ink-3">
          Everything happens behind the scenes. Your team stays in Gmail; your customers see an enterprise custom domain.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.n}
              className="group relative rounded-2xl border border-line bg-surface p-5 sm:p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 sm:gap-2 mb-6">
                  <span className="font-mono text-[10px] sm:text-[12px] font-bold tracking-widest text-primary px-2 sm:px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 whitespace-nowrap">
                    STEP {s.n}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-mono text-ink-4 bg-surface-muted px-2 sm:px-2.5 py-1 rounded-md border border-line whitespace-nowrap overflow-hidden text-ellipsis">
                    {s.badge}
                  </span>
                </div>
                <div className="h-12 w-12 rounded-xl bg-surface-muted border border-line flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-primary/40 transition">
                  <Icon className="h-6 w-6 text-ink" />
                </div>
                <h3 className="font-display text-[20px] font-bold tracking-tight text-ink mb-2">
                  {s.t}
                </h3>
                <p className="text-[14px] leading-relaxed text-ink-3">{s.d}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeatureGrid() {
  const bentoItems = [
    {
      title: "Google CASA-Compliant Security",
      desc: "End-to-end TLS 1.3 encryption with OAuth 2.0 token security. No access to employee personal files or emails.",
      tag: "Security First",
      colSpan: "md:col-span-2",
      icon: Lock,
    },
    {
      title: "Sub-Second Inbound Routing",
      desc: "Real-time edge proxies deliver incoming customer inquiries into Gmail within ~350 milliseconds.",
      tag: "Edge Speed",
      colSpan: "md:col-span-1",
      icon: Zap,
    },
    {
      title: "Centralized HTML Signatures",
      desc: "Standardize your company's email signatures across all employees with department tokens and live previews.",
      tag: "Brand Identity",
      colSpan: "md:col-span-1",
      icon: PenLine,
    },
    {
      title: "Shared Inboxes & Catch-Alls",
      desc: "Route sales@, support@, or billing@ to multiple teammates simultaneously without paying extra seat fees.",
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
          <h2 className="font-display text-[32px] font-bold tracking-tight sm:text-[42px] text-ink leading-tight">
            Engineered to replace <br />
            Google Workspace seat markup.
          </h2>
          <p className="mt-3 text-[15px] text-ink-3">
            All the professional features you need to manage your business identity, with none of the bloated licensing fees.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {bentoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`${item.colSpan} rounded-2xl border border-line bg-surface p-8 shadow-xs hover:border-line-strong hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-surface-muted border border-line flex items-center justify-center text-ink">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-ink-4 px-2.5 py-1 rounded-md bg-background border border-line">
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

function RoutingDiagram() {
  const [activeScenario, setActiveScenario] = useState<"inbound" | "reply">("inbound");

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11.5px] font-semibold text-primary uppercase tracking-wider mb-3">
            <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Routing Telemetry
          </span>
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight sm:text-[44px] text-ink">
            Your custom domain. <br />
            Their favorite inbox.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink-3">
            When clients email your branded business address, Mailcoy instantly delivers it to your staff's existing Gmail inbox. When they hit reply, the client sees your verified company email address.
          </p>

          <div className="mt-8 space-y-3.5">
            {[
              "100% compatible with Gmail personal (@gmail.com) and company inboxes",
              "Automatic SPF, DKIM, and DMARC alignment for maximum deliverability",
              "Zero mailbox migrations or downtime required",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-[14px] text-ink-2">
                <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveScenario("inbound")}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition ${
                activeScenario === "inbound"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-line bg-surface text-ink-3 hover:text-ink"
              }`}
            >
              1. Customer Sends Email
            </button>
            <button
              onClick={() => setActiveScenario("reply")}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition ${
                activeScenario === "reply"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-line bg-surface text-ink-3 hover:text-ink"
              }`}
            >
              2. Staff Replies in Gmail
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Flow Card */}
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="font-display text-[15px] font-bold text-ink">
              {activeScenario === "inbound" ? "Inbound Routing Flow" : "Outbound Reply Flow"}
            </span>
            <span className="text-[11.5px] font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold">
              ● Verified 0.3s
            </span>
          </div>

          {activeScenario === "inbound" ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <FlowRow
                from="client@acme.com"
                to="sales@yourcompany.com"
                label="Step 1: Customer inquiry"
              />
              <div className="my-2 ml-6 h-6 w-0.5 bg-primary/40" />
              <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-4">
                <div className="flex items-center gap-2 text-[11.5px] font-mono uppercase tracking-wider text-primary font-bold">
                  <Zap className="h-3.5 w-3.5" /> Mailcoy Gateway Routing
                </div>
                <div className="mt-1 font-mono text-[13px] font-semibold text-ink">
                  sales@yourcompany.com ➔ john.doe@gmail.com
                </div>
              </div>
              <div className="my-2 ml-6 h-6 w-0.5 bg-primary/40" />
              <FlowRow
                from="Mailcoy Relay"
                to="john.doe@gmail.com"
                label="Step 2: Instant Gmail Inbox Delivery"
              />
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <FlowRow
                from="john.doe@gmail.com"
                to="client@acme.com"
                label="Step 1: John composes in Gmail"
              />
              <div className="my-2 ml-6 h-6 w-0.5 bg-emerald-500/40" />
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                <div className="flex items-center gap-2 text-[11.5px] font-mono uppercase tracking-wider text-emerald-600 font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Send-As Domain Header Masking
                </div>
                <div className="mt-1 font-mono text-[13px] font-semibold text-ink">
                  From: John Doe &lt;sales@yourcompany.com&gt;
                </div>
              </div>
              <div className="my-2 ml-6 h-6 w-0.5 bg-emerald-500/40" />
              <FlowRow
                from="sales@yourcompany.com"
                to="client@acme.com"
                label="Step 2: Customer sees branded domain reply"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FlowRow({ from, to, label }: { from: string; to: string; label: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-line bg-background p-3.5 shadow-2xs">
      <span className="truncate font-mono text-[12.5px] font-medium text-ink">{from}</span>
      <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-[10.5px] font-mono uppercase tracking-wider text-ink-3 border border-line">
        {label}
      </span>
      <span className="truncate text-right font-mono text-[12.5px] font-medium text-ink">{to}</span>
    </div>
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
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to="/auth/signup"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-white text-ink px-6 text-[14px] font-bold shadow-lg hover:bg-slate-100 transition"
          >
            Start For Free <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex h-11 items-center rounded-xl border border-white/25 bg-white/10 px-6 text-[14px] font-semibold text-white hover:bg-white/15 transition"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </section>
  );
}

function SavingsCalculator() {
  const [employees, setEmployees] = useState(15);

  // Google Workspace Starter is $7/user/mo ($84/user/year)
  const workspaceCost = employees * 84;
  // Mailcoy is flat/tiered ~$2/user/mo ($24/user/year)
  const mailcoyCost = employees * 24;
  const annualSavings = workspaceCost - mailcoyCost;
  const percentageSaved = Math.round((annualSavings / workspaceCost) * 100);

  return (
    <section className="border-t border-line bg-surface py-20">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11.5px] font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Instant Cost Reduction
          </span>
          <h2 className="font-display text-[32px] font-semibold tracking-tight sm:text-[40px] text-ink">
            See how much you save vs. Google Workspace
          </h2>
          <p className="mt-3 text-[15px] text-ink-3">
            Stop paying per-seat subscriptions for office software your team doesn't use.
          </p>
        </div>

        <div className="rounded-2xl border border-line-strong bg-background p-8 md:p-10 shadow-lg">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
            <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <label className="text-[12px] sm:text-[13.5px] font-semibold text-ink uppercase tracking-wider truncate">
                    Team Size <span className="hidden sm:inline">(Employees)</span>
                  </label>
                  <span className="font-mono text-lg sm:text-2xl font-bold text-primary px-2 sm:px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 whitespace-nowrap">
                    {employees} {employees === 1 ? "person" : "people"}
                  </span>
                </div>

              <input
                type="range"
                min="3"
                max="100"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-primary my-4"
              />

              <div className="flex justify-between text-[11.5px] text-ink-4 font-mono">
                <span>3<span className="hidden sm:inline"> employees</span></span>
                <span className="hidden sm:inline">25 employees</span>
                <span className="hidden sm:inline">50 employees</span>
                <span>100+<span className="hidden sm:inline"> employees</span></span>
              </div>

              <div className="mt-8 space-y-3 text-[13px] text-ink-3">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-line gap-1 sm:gap-4">
                  <span>Google Workspace ($7/seat/mo):</span>
                  <span className="font-mono font-medium text-ink-2">${workspaceCost.toLocaleString()} / year</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-line gap-1 sm:gap-4">
                  <span>Mailcoy ($2/seat/mo):</span>
                  <span className="font-mono font-medium text-emerald-600">${mailcoyCost.toLocaleString()} / year</span>
                </div>
              </div>
            </div>

            {/* Big Savings Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 text-center space-y-3">
              <span className="text-[11.5px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
                Your Estimated Savings
              </span>
              <div className="font-display text-[48px] md:text-[56px] font-bold text-emerald-600 tracking-tight leading-none">
                ${annualSavings.toLocaleString()}
                <span className="text-[18px] text-ink-3 font-normal font-sans"> / year</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                <TrendingDown className="h-4 w-4" /> Save {percentageSaved}% every year
              </div>
              <p className="text-[12px] text-ink-3 max-w-xs mx-auto pt-2">
                Keep the exact same professional domain identity and familiar Gmail experience.
              </p>
              <Link
                to="/auth/signup"
                className="mt-4 inline-flex w-full h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-white font-medium text-[13.5px] hover:bg-emerald-700 transition"
              >
                Claim your savings <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}