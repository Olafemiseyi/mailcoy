import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  Database,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Data Protection — Mailcoy" },
      {
        name: "description",
        content:
          "How Mailcoy protects your workspace identities, Google OAuth tokens, and domain routing data. 100% Google CASA and GDPR compliant.",
      },
      { property: "og:title", content: "Privacy Policy — Mailcoy" },
      {
        property: "og:description",
        content: "Data minimization, AES-256 token encryption, and Google Limited Use compliance.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <MarketingShell>
      <div className="relative overflow-hidden">
        {/* Ambient mesh glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 blur-[130px] rounded-full opacity-60 dark:opacity-30" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 pt-12 pb-24 md:pt-20 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1 text-[11.5px] font-semibold uppercase tracking-widest text-primary shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Legal & Data Security</span>
            </div>
            <h1 className="font-display text-[38px] sm:text-[50px] font-bold text-ink leading-[1.06] tracking-tight">
              Privacy Policy & Security Standards
            </h1>
            <p className="text-[16px] sm:text-[17.5px] leading-relaxed text-ink-3 max-w-3xl">
              Effective August 2026. We believe in strict data minimization: we process only the cryptographic routing headers necessary to connect your custom domain to your Gmail inbox.
            </p>
          </div>

          {/* 4 Core Guarantees Bento */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: EyeOff,
                title: "Zero AI Training",
                desc: "Your emails and contact data are never sold, analyzed, or used to train AI models.",
                tag: "Absolute Guarantee",
              },
              {
                icon: Lock,
                title: "AES-256 Tokens",
                desc: "All Google OAuth credentials are encrypted at rest with military-grade AES-256-GCM.",
                tag: "CASA Compliant",
              },
              {
                icon: Database,
                title: "Tenant Isolation",
                desc: "Every database query is enforced via cryptographic PostgreSQL Row Level Security (RLS).",
                tag: "Multi-Tenant RLS",
              },
              {
                icon: Server,
                title: "30-Day Hard Purge",
                desc: "When an organization is deleted, all stored credentials and records are permanently erased.",
                tag: "Right to Erasure",
              },
            ].map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.title}
                  className="p-5 rounded-2xl border border-line bg-surface space-y-2 shadow-2xs hover:border-primary/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary grid place-items-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-4 px-2 py-0.5 rounded bg-surface-muted border border-line font-semibold">
                      {g.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-[15.5px] font-bold text-ink pt-1">{g.title}</h3>
                  <p className="text-[12.5px] text-ink-3 leading-relaxed">{g.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Legal Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 1
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Information We Collect & Process
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                When you create a workspace, add custom domains, or provision employee inboxes on Mailcoy, we collect:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 text-[13px]">
                <div className="p-4 rounded-xl border border-line bg-background space-y-1">
                  <div className="font-semibold text-ink">Workspace Identity:</div>
                  <p className="text-ink-3">Admin name, work email address, company name, industry, and billing status.</p>
                </div>
                <div className="p-4 rounded-xl border border-line bg-background space-y-1">
                  <div className="font-semibold text-ink">Domain Verification Data:</div>
                  <p className="text-ink-3">Domain name, DNS nonces, TXT/MX records, and SPF/DKIM verification states.</p>
                </div>
                <div className="p-4 rounded-xl border border-line bg-background space-y-1">
                  <div className="font-semibold text-ink">Team & Alias Metadata:</div>
                  <p className="text-ink-3">Employee display names, department titles, assigned aliases, and routing rules.</p>
                </div>
                <div className="p-4 rounded-xl border border-line bg-background space-y-1">
                  <div className="font-semibold text-ink">Encrypted OAuth Tokens:</div>
                  <p className="text-ink-3">Restricted Google API tokens stored via AES-256 envelope encryption.</p>
                </div>
              </div>
            </article>

            {/* Section 2: Google API Limited Use Policy */}
            <article className="p-6 sm:p-8 rounded-3xl border border-primary/30 bg-primary/[0.02] space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 2
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Google User Data & Restricted Scopes Disclosure
                </h2>
              </div>
              <p className="text-[14px] text-ink-2 leading-relaxed">
                Mailcoy requests restricted Google OAuth scopes exclusively to synchronize Send-As aliases and relay outgoing emails composed inside your official Gmail client on behalf of your verified custom domain.
              </p>

              <div className="p-4 rounded-2xl border border-primary/20 bg-background space-y-3 text-[13px]">
                <div className="font-semibold text-primary flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Google API Services User Data Policy Compliance:
                </div>
                <p className="text-ink-2 leading-relaxed">
                  Mailcoy’s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold underline inline-flex items-center gap-1"
                  >
                    Google API Services User Data Policy <ExternalLink className="h-3 w-3" />
                  </a>
                  , including the Limited Use requirements.
                </p>
                <ul className="space-y-1.5 text-ink-3 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Human employees never view your private email content without explicit consent for support.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>We do not serve third-party ads or sell user information to data brokers.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Restricted tokens are rotated and invalidated immediately upon employee removal.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Section 3: Third Party Processors */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 3
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Infrastructure & Sub-Processors
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                We work with enterprise-grade sub-processors to ensure sub-second routing speed and 99.99% uptime:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-line bg-background">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-surface-muted/60 text-[11px] uppercase tracking-wider font-semibold text-ink-3 border-b border-line">
                    <tr>
                      <th className="px-4 py-3">Processor</th>
                      <th className="px-4 py-3">Role & Function</th>
                      <th className="px-4 py-3">Data Residency</th>
                      <th className="px-4 py-3 text-right">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink">Amazon Web Services (SES)</td>
                      <td className="px-4 py-3 text-ink-3">High-throughput outbound SMTP delivery & DKIM signing</td>
                      <td className="px-4 py-3 text-ink-3 font-mono">us-east-1 (N. Virginia)</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">SOC 2 / ISO 27001</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink">Supabase Enterprise</td>
                      <td className="px-4 py-3 text-ink-3">Encrypted PostgreSQL database & Auth provider</td>
                      <td className="px-4 py-3 text-ink-3 font-mono">Global Anycast / US</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">SOC 2 Type II / HIPAA</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-ink">Paystack & Stripe</td>
                      <td className="px-4 py-3 text-ink-3">PCI-DSS subscription processing & invoice generation</td>
                      <td className="px-4 py-3 text-ink-3 font-mono">Global / Nigeria</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-bold">PCI-DSS Level 1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* Section 4: Data Rights & Contact */}
            <article className="p-6 sm:p-8 rounded-3xl border border-line bg-surface space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                  Section 4
                </span>
                <h2 className="font-display text-[20px] font-bold text-ink">
                  Your Data Rights & Inquiries
                </h2>
              </div>
              <p className="text-[14px] text-ink-3 leading-relaxed">
                You possess the full right to export, rectify, or purge your organization's records at any time. For compliance inquiries, data protection agreements (DPA), or security audits, contact our designated privacy officer:
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full">
                <a
                  href="mailto:privacy@mailcoy.com"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-95 transition shadow-2xs w-full sm:w-auto text-center whitespace-nowrap"
                >
                  Email Data Protection Officer (privacy@mailcoy.com)
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-[13px] font-semibold hover:bg-surface-muted transition w-full sm:w-auto text-center whitespace-nowrap"
                >
                  Open Support Ticket &rarr;
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
