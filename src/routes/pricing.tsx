import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Sparkles, ArrowRight, Globe } from "lucide-react";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { detectUserCurrency, Currency } from "@/lib/currency";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & ROI — Mailcoy" },
      { name: "description", content: "Simple monthly pricing for teams of any size. Save 80%+ vs Google Workspace." },
      { property: "og:title", content: "Pricing — Mailcoy" },
      { property: "og:description", content: "Simple monthly pricing for teams of any size." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    setCurrency(detectUserCurrency());
  }, []);

  const plans = [
    {
      name: "Free",
      usd: "$0",
      ngn: "₦0",
      priceNote: "/ month · whole team",
      perUserEq: null,
      gwSaving: null,
      tag: "Solopreneurs & Startups",
      desc: "For new ventures connecting their first custom domain.",
      features: [
        "1 Custom Domain",
        "1 Team Inbox",
        "Gmail Send-As Integration",
        "Automatic SPF & DKIM Setup",
        "Standard Email Support",
      ],
      highlight: false,
      actionText: "Start For Free",
    },
    {
      name: "Starter Pro",
      usd: "$9",
      ngn: "₦7,500",
      priceNote: "/ month · whole team",
      perUserEq: { usd: "$1.80/user", ngn: "₦1,500/user", users: 5 },
      gwSaving: { usd: "$26", ngn: "₦21,700" },
      tag: "Small Teams",
      desc: "Perfect for small teams who just need professional addresses.",
      features: [
        "1 Custom Domain",
        "Up to 5 Team Inboxes",
        "Gmail Send-As Integration",
        "Centralized Company Signatures",
        "Standard Email Support",
      ],
      highlight: false,
      actionText: "Upgrade to Starter",
    },
    {
      name: "Growth",
      usd: "$29",
      ngn: "₦20,000",
      priceNote: "/ month · whole team",
      perUserEq: { usd: "$1.45/user", ngn: "₦1,000/user", users: 20 },
      gwSaving: { usd: "$111", ngn: "₦91,000" },
      tag: "Growing Companies",
      desc: "Everything you need to eliminate Google Workspace markup.",
      features: [
        "3 Custom Domains",
        "Up to 20 Team Inboxes",
        "Catch-All Inboxes & Shared Mail",
        "Centralized Company Signatures",
        "DNSBL Blacklist Monitoring",
        "Full API Access",
        "Priority Support & Fast Setup",
      ],
      highlight: true,
      actionText: "Upgrade to Growth",
    },
    {
      name: "Scale",
      usd: "$79",
      ngn: "₦50,000",
      priceNote: "/ month · whole team",
      perUserEq: { usd: "$1.58/user", ngn: "₦1,000/user", users: 50 },
      gwSaving: { usd: "$271", ngn: "₦222,000" },
      tag: "Established Brands",
      desc: "For mid-to-large businesses managing heavy team volume.",
      features: [
        "10 Custom Domains",
        "Up to 50 Team Inboxes",
        "1-Click Employee Offboarding Shield",
        "CSV Bulk Onboarding Wizard",
        "Real-Time Deliverability Shield",
        "Full API Access & Webhooks",
        "Dedicated VIP Account Manager",
      ],
      highlight: false,
      actionText: "Contact Sales",
    },
  ];

  return (
    <MarketingPage
      eyebrow="Transparent Pricing"
      title="Save up to 80% on business email."
      lede="Stop paying $7/user/month for Google Workspace just to send email on your domain."
    >
      {/* Key Differentiator Banner */}
      <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 text-center">
        <p className="text-[14px] font-semibold text-emerald-700 dark:text-emerald-400">
          💡 Mailcoy charges <span className="underline underline-offset-2">per team</span>, not per user.
        </p>
        <p className="mt-1 text-[13px] text-ink-3 max-w-xl mx-auto">
          Unlike Google Workspace or Zoho where costs multiply with every hire, your Mailcoy bill stays flat.
          A team of 20 on Growth pays <strong className="text-ink">$29/month</strong> — the same as a team of 3.
          Your Gmail inboxes are untouched; we just power the professional layer on top.
        </p>
      </div>

      {/* Location-based Currency Indicator */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-line bg-surface text-[12.5px] text-ink-3 shadow-xs">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span>
            Prices shown in <strong className="text-ink">{currency === "NGN" ? "NGN (₦)" : "USD ($)"}</strong> based on your region
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-2xl p-6 transition ${
              p.highlight
                ? "border-2 border-primary bg-surface shadow-xl"
                : "border border-line bg-surface/70 hover:bg-surface"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Most Popular
              </span>
            )}

            <div>
              <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-4">
                {p.tag}
              </span>
              <h3 className="font-display mt-1 text-[22px] font-bold tracking-tight text-ink">
                {p.name}
              </h3>
              <p className="mt-1 text-[13px] text-ink-3 min-h-[36px]">{p.desc}</p>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap items-baseline gap-1.5 whitespace-nowrap">
                <span className="font-display text-[30px] lg:text-[36px] font-bold tracking-tight text-ink">
                  {currency === "USD" ? p.usd : p.ngn}
                </span>
                <span className="text-[12px] lg:text-[13px] text-ink-4 whitespace-nowrap">{p.priceNote}</span>
              </div>
              {p.perUserEq && (
                <div className="mt-1 text-[11.5px] text-ink-3">
                  ≈ <strong className="text-emerald-600 dark:text-emerald-400">
                    {currency === "USD" ? p.perUserEq.usd : p.perUserEq.ngn}
                  </strong>
                  {" "}for up to {p.perUserEq.users} users
                </div>
              )}
              {p.gwSaving && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  Save {currency === "USD" ? p.gwSaving.usd : p.gwSaving.ngn}/mo vs Google Workspace
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
              className={`mt-8 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl px-3 text-[12.5px] lg:text-[13.5px] font-semibold transition ${
                p.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary-focus shadow-xs"
                  : "border border-line bg-background text-ink hover:bg-surface-muted"
              }`}
            >
              <span>{p.actionText || "Start For Free"}</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5 shrink-0" />
            </Link>
          </div>
        ))}
      </div>

      {/* Competitor Comparison Table */}
      <div className="mt-12 rounded-2xl border border-line overflow-hidden">
        <div className="px-6 py-4 border-b border-line bg-surface-muted/30">
          <h4 className="font-display font-bold text-[15px] text-ink">How Mailcoy stacks up</h4>
          <p className="text-[12.5px] text-ink-3 mt-0.5">All competitor prices are per user, per month. Mailcoy is flat per team.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-ink-3 text-[11.5px] uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Platform</th>
                <th className="text-left px-5 py-3 font-medium">Pricing model</th>
                <th className="text-left px-5 py-3 font-medium">20-person team cost</th>
                <th className="text-left px-5 py-3 font-medium">Uses Gmail inbox?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[
                { name: "Mailcoy Growth", model: "Flat team", cost20: currency === "USD" ? "$29/mo" : "₦20,000/mo", usesGmail: "✅ Yes — your real inbox", highlight: true },
                { name: "Google Workspace", model: "Per user ($7)", cost20: currency === "USD" ? "$140/mo" : "₦114,800/mo", usesGmail: "✅ Yes", highlight: false },
                { name: "Zoho Mail", model: "Per user ($1)", cost20: currency === "USD" ? "$20/mo" : "₦16,400/mo", usesGmail: "❌ Separate inbox", highlight: false },
                { name: "Hostinger Mail", model: "Per user ($0.59)", cost20: currency === "USD" ? "$11.80/mo" : "₦9,676/mo", usesGmail: "❌ Separate inbox", highlight: false },
              ].map((row) => (
                <tr key={row.name} className={row.highlight ? "bg-emerald-500/[0.03]" : ""}>
                  <td className="px-5 py-3 font-medium text-ink">
                    <div className="flex items-center gap-2">
                      {row.highlight && <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />}
                      {row.name}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-2">{row.model}</td>
                  <td className={`px-5 py-3 font-mono font-semibold ${row.highlight ? "text-emerald-600 dark:text-emerald-400" : "text-ink-2"}`}>{row.cost20}</td>
                  <td className="px-5 py-3 text-ink-2">{row.usesGmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-line bg-surface-muted/20 text-[11.5px] text-ink-3">
          * Competitor costs at full 20-user capacity for fair comparison.
        </div>
      </div>

      <div className="mt-10 p-6 rounded-2xl border border-line bg-surface-muted/30 text-center">
        <h4 className="font-display font-semibold text-[15px] text-ink">Enterprise with 50+ Employees?</h4>
        <p className="text-[13px] text-ink-3 mt-1 max-w-xl mx-auto">
          Need dedicated IP pools, custom SSO routing, or custom SLA agreements? Contact our executive team for custom invoicing.
        </p>
        <Link to="/contact" className="mt-3 inline-block text-[13px] font-semibold text-primary hover:underline">
          Contact Enterprise Sales &rarr;
        </Link>
      </div>
    </MarketingPage>
  );
}