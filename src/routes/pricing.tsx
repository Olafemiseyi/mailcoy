import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Tag, Star, ArrowRight, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { detectUserCurrency, Currency, PRICING_PLANS } from "@/lib/currency";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Flat Team Email Billing | Mailcoy" },
      {
        name: "description",
        content:
          "Save up to 80% on custom domain email. Flat team billing from $9/mo (₦7,500/mo) with zero per-seat markup.",
      },
      { property: "og:title", content: "Pricing — Flat Team Email Billing | Mailcoy" },
      {
        property: "og:description",
        content:
          "Save up to 80% on custom domain email. Flat team billing with zero per-seat markup.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    setCurrency(detectUserCurrency());
  }, []);

  const plans = [
    {
      name: "Free",
      tag: "Solo Founders",
      desc: "For solo entrepreneurs testing custom domain routing.",
      usdMonthly: 0,
      usdAnnual: 0,
      ngnMonthly: 0,
      ngnAnnual: 0,
      features: [
        "1 employee email inbox",
        "1 verified custom domain",
        "100 daily routed emails",
        "Native Gmail Send-As",
        "Standard community support",
      ],
      highlight: false,
      actionText: "Get Started Free",
    },
    {
      name: "Starter Pro",
      tag: "Small Teams",
      desc: "Ideal for boutique agencies and early-stage startups.",
      usdMonthly: 9,
      usdAnnual: 7,
      ngnMonthly: 7500,
      ngnAnnual: 6000,
      perUserEq: { usd: "$1.40/user", ngn: "₦1,200/user", users: 5 },
      gwSaving: { usd: "$26", ngn: "₦21,700" },
      features: [
        "Up to 5 employee inboxes",
        "1 verified custom domain",
        "Unlimited routed emails",
        "1-Click Google OAuth linking",
        "Shared aliases (sales@, support@)",
        "Standard DKIM & SPF signing",
        "Email support (< 12hr SLA)",
      ],
      highlight: false,
      actionText: "Start 14-Day Free Trial",
    },
    {
      name: "Growth",
      tag: "Growing Companies",
      desc: "Our most popular tier for fast-scaling operational teams.",
      usdMonthly: 29,
      usdAnnual: 23,
      ngnMonthly: 20000,
      ngnAnnual: 16000,
      perUserEq: { usd: "$1.15/user", ngn: "₦800/user", users: 20 },
      gwSaving: { usd: "$111", ngn: "₦91,000" },
      features: [
        "Up to 20 employee inboxes",
        "3 verified custom domains",
        "Unlimited routed emails",
        "Company-wide HTML signatures",
        "Catch-all routing & smart rules",
        "Real-time delivery telemetry logs",
        "1-Click offboarding shield",
        "Priority 24/7 Slack & WhatsApp support",
      ],
      highlight: true,
      actionText: "Start 14-Day Free Trial",
    },
    {
      name: "Scale",
      tag: "Mid-Market",
      desc: "Maximum capacity and dedicated infrastructure for enterprises.",
      usdMonthly: 79,
      usdAnnual: 63,
      ngnMonthly: 50000,
      ngnAnnual: 40000,
      perUserEq: { usd: "$1.26/user", ngn: "₦800/user", users: 50 },
      gwSaving: { usd: "$271", ngn: "₦222,000" },
      features: [
        "Up to 50 employee inboxes",
        "10 verified custom domains",
        "Unlimited routed emails",
        "Advanced RBAC permission tiers",
        "REST API & Webhooks access",
        "Dedicated outbound IP pool",
        "Custom DPA & CASA compliance logs",
        "Dedicated account manager",
      ],
      highlight: false,
      actionText: "Start 14-Day Free Trial",
    },
  ];

  const sym = currency === "USD" ? "$" : "₦";

  return (
    <MarketingShell>
      <div className="mx-auto max-w-6xl px-4 sm:px-5 pt-12 pb-24 md:pt-20 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1 text-[11.5px] font-semibold uppercase tracking-widest text-primary shadow-2xs">
            <Tag className="h-3.5 w-3.5" />
            <span>Flat Team Billing</span>
          </div>
          <h1 className="font-display text-[32px] sm:text-[44px] md:text-[54px] font-bold text-ink leading-[1.1] tracking-tight">
            Transparent pricing for your whole team.
          </h1>
          <p className="text-[15px] sm:text-[17.5px] text-ink-3 leading-relaxed max-w-2xl mx-auto">
            {currency === "NGN"
              ? "Stop paying $7 per user per month. A team of 20 on Growth pays ₦20,000/mo total — not ₦114,800/mo."
              : "Stop paying $7 per user per month. A team of 20 on Growth pays $29/mo total — not $140/mo."}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 sm:pt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 p-1 px-3 rounded-2xl bg-surface border border-line shadow-xs">
              <span className={`text-[12.5px] font-medium ${!annual ? "text-ink font-semibold" : "text-ink-3"}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setAnnual(!annual)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  annual ? "bg-primary" : "bg-line-strong"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    annual ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-[12.5px] font-medium flex items-center gap-1.5 ${annual ? "text-ink font-semibold" : "text-ink-3"}`}>
                Annual <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Save 20%</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => {
            const price = currency === "USD"
              ? (annual ? p.usdAnnual : p.usdMonthly)
              : (annual ? p.ngnAnnual : p.ngnMonthly);

            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-2xl p-6 sm:p-7 transition bg-surface ${
                  p.highlight
                    ? "border-2 border-primary shadow-xl ring-1 ring-primary/20"
                    : "border border-line shadow-xs hover:border-line-strong hover:shadow-md"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> Most Popular
                  </span>
                )}

                <div>
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-4">
                    {p.tag}
                  </span>
                  <h3 className="font-display mt-1 text-[22px] font-bold tracking-tight text-ink">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-ink-3 min-h-[36px] leading-relaxed">{p.desc}</p>
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-[34px] sm:text-[38px] font-bold tracking-tight text-ink">
                      {sym}{price.toLocaleString()}
                    </span>
                    <span className="text-[13px] text-ink-4">
                      {p.usdMonthly === 0 ? "forever" : "/ month"}
                    </span>
                  </div>

                  {p.perUserEq && (
                    <div className="mt-1.5 text-[12px] text-ink-3">
                      ≈ <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        {currency === "USD" ? p.perUserEq.usd : p.perUserEq.ngn}
                      </strong>
                      {" "}for up to {p.perUserEq.users} users
                    </div>
                  )}

                  {p.gwSaving && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Save {currency === "USD" ? p.gwSaving.usd : p.gwSaving.ngn}/mo vs Workspace
                    </div>
                  )}
                </div>

                <div className="my-6 border-t border-line" />

                <ul className="space-y-2.5 text-[13px] text-ink-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth/signup"
                  className={`mt-8 inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-[13px] font-semibold transition ${
                    p.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-95 shadow-sm"
                      : "border border-line bg-surface text-ink hover:bg-surface-muted shadow-2xs"
                  }`}
                >
                  <span>{p.actionText}</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Competitor Comparison Table */}
        <div className="rounded-3xl border border-line bg-surface overflow-hidden shadow-xs">
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-line bg-surface-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-[16px] sm:text-[18px] font-bold text-ink">
                Compare Mailcoy vs. Traditional Per-Seat Hosts
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-ink-3">
                Calculated for a standard 20-person company requiring professional custom domains.
              </p>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-semibold border border-primary/20 whitespace-nowrap">
              Flat Team Economics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] sm:text-[13px] min-w-[540px]">
              <thead className="bg-surface-muted/60 text-[11px] uppercase tracking-wider font-semibold text-ink-4 border-b border-line">
                <tr>
                  <th className="px-5 py-3">Platform</th>
                  <th className="px-5 py-3">Billing Model</th>
                  <th className="px-5 py-3">20-User Monthly Total</th>
                  <th className="px-5 py-3">Uses Real Gmail App?</th>
                  <th className="px-5 py-3 text-right">Effective Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr className="bg-emerald-500/[0.04] font-semibold">
                  <td className="px-5 py-3.5 text-ink flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Mailcoy Growth
                  </td>
                  <td className="px-5 py-3.5 text-ink-2">Flat Team Plan</td>
                  <td className="px-5 py-3.5 font-mono text-emerald-600">
                    {currency === "USD" ? "$29 / mo" : "₦20,000 / mo"}
                  </td>
                  <td className="px-5 py-3.5 text-emerald-600">✓ Native Gmail</td>
                  <td className="px-5 py-3.5 text-right font-mono text-emerald-600">Baseline (Best)</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-ink font-medium">Google Workspace (Business Starter)</td>
                  <td className="px-5 py-3.5 text-ink-3">$7 / user / mo</td>
                  <td className="px-5 py-3.5 font-mono text-ink">
                    {currency === "USD" ? "$140 / mo" : "₦114,800 / mo"}
                  </td>
                  <td className="px-5 py-3.5 text-ink-3">✓ Native Gmail</td>
                  <td className="px-5 py-3.5 text-right font-mono text-rose-500">-79% More Expensive</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-ink font-medium">Zoho Workplace</td>
                  <td className="px-5 py-3.5 text-ink-3">$1 / user / mo</td>
                  <td className="px-5 py-3.5 font-mono text-ink">
                    {currency === "USD" ? "$20 / mo" : "₦16,400 / mo"}
                  </td>
                  <td className="px-5 py-3.5 text-ink-4">✗ Zoho Webmail app required</td>
                  <td className="px-5 py-3.5 text-right font-mono text-ink-3">No Gmail Workflow</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-ink font-medium">Microsoft 365 (Business Basic)</td>
                  <td className="px-5 py-3.5 text-ink-3">$6 / user / mo</td>
                  <td className="px-5 py-3.5 font-mono text-ink">
                    {currency === "USD" ? "$120 / mo" : "₦98,400 / mo"}
                  </td>
                  <td className="px-5 py-3.5 text-ink-4">✗ Outlook app required</td>
                  <td className="px-5 py-3.5 text-right font-mono text-rose-500">-75% More Expensive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Bottom Banner */}
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-display text-[20px] sm:text-[22px] font-bold text-ink">
              Need custom enterprise provisioning for 100+ seats?
            </h3>
            <p className="text-[13.5px] text-ink-3 max-w-xl leading-relaxed">
              We offer dedicated Amazon SES IP warming pools, custom data retention SLAs, SAML SSO integration, and direct Wire / ACH corporate invoicing.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-[13.5px] font-semibold text-primary-foreground shadow-xs hover:opacity-95 transition w-full sm:w-auto text-center whitespace-nowrap"
          >
            Contact Enterprise Sales &rarr;
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
