import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  FileText,
  ShieldCheck,
  Zap,
  Users,
  CreditCard,
  Radio,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service & SLA — Mailcoy" },
      {
        name: "description",
        content:
          "Terms of Service, acceptable use guidelines, SLA commitments, and master service agreements governing Mailcoy business email routing.",
      },
      { property: "og:title", content: "Terms of Service — Mailcoy" },
      {
        property: "og:description",
        content: "Transparent terms of service, acceptable use policies, and SLA commitments.",
      },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <MarketingShell>
      <div className="relative overflow-hidden">
        {/* Ambient mesh glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 blur-[130px] rounded-full opacity-60 dark:opacity-30" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 pt-12 pb-24 md:pt-20 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1 text-[11.5px] font-semibold uppercase tracking-widest text-primary shadow-2xs">
              <FileText className="h-3.5 w-3.5" />
              <span>Master Service Agreement</span>
            </div>
            <h1 className="font-display text-[38px] sm:text-[50px] font-bold text-ink leading-[1.06] tracking-tight">
              Terms of Service & SLA Commitments
            </h1>
            <p className="text-[16px] sm:text-[17.5px] leading-relaxed text-ink-3 max-w-3xl">
              Effective August 2026. These terms govern your use of the Mailcoy email identity and intelligent routing platform. By provisioning a workspace or connecting a domain, you agree to these principles.
            </p>
          </div>

          {/* 4 Core Covenants Bento */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Domain Ownership",
                desc: "You must legally own or be authorized to manage every domain connected to Mailcoy.",
                tag: "Verified Ownership",
              },
              {
                icon: Zap,
                title: "Strict Anti-Spam",
                desc: "Unsolicited bulk spam or deceptive phishing triggers immediate suspension.",
                tag: "CAN-SPAM / GDPR",
              },
              {
                icon: CreditCard,
                title: "Flat Team Pricing",
                desc: "Predictable monthly or annual team billing. Zero hidden per-seat price hikes.",
                tag: "Transparent Rates",
              },
              {
                icon: Radio,
                title: "99.9% Uptime SLA",
                desc: "Multi-region fallback MX proxies with automatic retry queues for unshakeable delivery.",
                tag: "Edge Resilience",
              },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="p-5 rounded-2xl border border-line bg-surface space-y-2 shadow-2xs hover:border-primary/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-4 px-2 py-0.5 rounded bg-surface-muted border border-line font-semibold">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-[15.5px] font-bold text-ink pt-1">{c.title}</h3>
                  <p className="text-[12.5px] text-ink-3 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 1
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Acceptance & Scope of Platform
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                Mailcoy provides email identity, domain routing, deliverability management, and Gmail integration software. Mailcoy is an intelligent routing layer—it decouples domain identity from mailbox storage, allowing teams to route and authenticate email through their existing Gmail inboxes without paying per-seat Google Workspace markups.
              </p>
            </article>

            {/* Section 2 */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 2
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Acceptable Use & Anti-Spam Governance
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                To protect IP pool reputations and ensure high inbox deliverability for all legitimate businesses, customers agree never to use the Service for:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 text-[13px]">
                <div className="p-4 rounded-xl border border-line bg-background space-y-1">
                  <div className="font-semibold text-danger flex items-center gap-1.5">
                    <span>✕</span> Unsolicited Cold Outreach
                  </div>
                  <p className="text-ink-3">Sending scraped or purchased lists in violation of CAN-SPAM or CASL.</p>
                </div>
                <div className="p-4 rounded-xl border border-line bg-background space-y-1">
                  <div className="font-semibold text-danger flex items-center gap-1.5">
                    <span>✕</span> Phishing or Domain Spoofing
                  </div>
                  <p className="text-ink-3">Attempting to impersonate financial entities or deceptive organizations.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[12.5px] text-ink-2">
                <strong className="text-amber-800 dark:text-amber-300">Enforcement:</strong> Any workspace detected engaging in malicious spam or phishing will be immediately suspended without refund.
              </div>
            </article>

            {/* Section 3 */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 3
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Subscription Billing, Currency & Cancellations
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                Subscriptions are billed on a flat recurring monthly or annual schedule via Paystack or Stripe. Pricing is based on active workspace tier and domain limits.
              </p>
              <ul className="space-y-2 text-[13px] text-ink-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>14-Day Guarantee:</strong> Cancel anytime during your 14-day trial with zero penalty.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dual Regional Billing:</strong> Nigerian organizations are billed in Naira (NGN ₦), international organizations in USD ($).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1-Click Self-Service Portal:</strong> Upgrade, downgrade, or cancel directly from your Settings billing tab.</span>
                </li>
              </ul>
            </article>

            {/* Section 4 */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 4
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Service Level Agreement (SLA) & Resilience
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                Mailcoy commits to 99.9% routing proxy availability. In the rare event of upstream provider downtime, incoming messages are automatically buffered across secondary Anycast MX queues with exponential retry intervals until destination delivery completes.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <Link
                  to="/status"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-95 transition shadow-2xs w-full sm:w-auto text-center whitespace-nowrap"
                >
                  View Real-Time System Status &rarr;
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-[13px] font-semibold hover:bg-surface-muted transition w-full sm:w-auto text-center whitespace-nowrap"
                >
                  Contact Legal Department &rarr;
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
