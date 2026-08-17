import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { PageHeader, Card } from "@/components/app/AppShell";
import { Globe, Users, Mail, AtSign, PenLine, Inbox, BarChart3, ScrollText, Settings as SettingsIcon, KeyRound, Webhook, CreditCard, Rocket, ShieldCheck, Bot } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_shell/help")({
  head: () => ({ meta: [{ title: "Help — Mailcoy" }] }),
  component: DocsRoute,
});

type Section = { id: string; icon: ComponentType<{ className?: string }>; title: string; body: ReactNode };

const SECTIONS: Section[] = [
  { id: "quickstart", icon: Rocket, title: "Quickstart Guide",
    body: (
      <div className="space-y-3">
        <p>Follow these steps in order to set up your company's business email on <strong>Mailcoy</strong> without confusion:</p>
        <ol className="list-decimal list-inside space-y-1.5 text-ink-2">
          <li>Add your company domain in <strong>Domains</strong> (e.g. <em>yourcompany.com</em>).</li>
          <li>Copy the DNS records (TXT ownership and 2 MX routes) into your registrar and wait for instant green verification.</li>
          <li>Add your employees under <strong>Employees</strong> so each team member gets a business address (e.g. <em>sales@yourcompany.com</em>).</li>
          <li>Each employee connects their existing personal Gmail inbox with 1 click or QR code to send and receive directly in Gmail.</li>
          <li>Configure optional catch-all routing, centralized company signatures, or invite team admins in <strong>Settings</strong>.</li>
        </ol>
      </div>
    ) },
  { id: "domains", icon: Globe, title: "Domains & DNS",
    body: (
      <div className="space-y-3">
        <p>Connecting your domain proves company ownership and unlocks custom business email addresses for your team.</p>
        <p>After adding a domain, Mailcoy generates 4 critical authentication records:</p>
        <ul className="list-disc list-inside space-y-1 text-ink-3">
          <li><strong>MX Records:</strong> Route incoming customer emails to Mailcoy's high-speed delivery servers.</li>
          <li><strong>SPF:</strong> Authorizes mail delivery and protects against email spoofing.</li>
          <li><strong>DKIM:</strong> Cryptographically signs every outgoing email so Gmail and Outlook trust your domain.</li>
          <li><strong>DMARC:</strong> Specifies anti-phishing policies to ensure 99%+ primary inbox placement.</li>
        </ul>
        <p>Copy each record into Namecheap, GoDaddy, or Cloudflare, then click <strong>Verify Domain</strong>.</p>
      </div>
    ) },
  { id: "employees", icon: Users, title: "Employee Inboxes",
    body: (
      <div className="space-y-3">
        <p>Employees are your team members who send and receive professional email under your domain.</p>
        <p>Click on any employee to review their connection health, alias routing, total sent/received stats, and delivery history.</p>
        <p><strong>Status Breakdown:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-ink-3">
          <li><span className="text-amber-600 font-semibold">Pending:</span> Employee invite sent, awaiting Gmail connection.</li>
          <li><span className="text-emerald-600 font-semibold">Connected:</span> Gmail linked and actively sending/receiving.</li>
          <li><span className="text-red-600 font-semibold">Suspended:</span> 1-Click offboarding shield active; employee cannot access company routing.</li>
        </ul>
      </div>
    ) },
  { id: "gmail", icon: Mail, title: "Gmail Integration",
    body: (
      <div className="space-y-3">
        <p>Mailcoy links an employee's existing Gmail mailbox to their custom business email. No new app or password to remember.</p>
        <p><strong>How it works:</strong> Inbound emails sent to <em>name@yourcompany.com</em> land immediately in their Gmail inbox. Replies sent from Gmail go out with the business address and verified DKIM signature.</p>
      </div>
    ) },
  { id: "aliases", icon: AtSign, title: "Aliases & Department Routing",
    body: "Create shared team addresses like sales@, support@, or billing@. Route each alias to one or multiple employees simultaneously with round-robin or fan-out distribution." },
  { id: "signatures", icon: PenLine, title: "Company Signatures",
    body: "Deploy a consistent, branded email signature template across your entire company. Smart merge tags ({name}, {title}, {phone}, {company}) populate dynamically per employee." },
  { id: "catch-all", icon: Inbox, title: "Catch-All Routing",
    body: "Capture emails sent to misspelled or unassigned addresses on your domain (e.g. info@, help@). Forward them to a designated manager inbox so you never miss an inquiry." },
  { id: "analytics", icon: BarChart3, title: "Analytics & Health",
    body: "Track live outbound/inbound email volume, deliverability rates, and DNSBL spam blacklist health across 7-day and 30-day windows in real time." },
  { id: "logs", icon: ScrollText, title: "Email Logs",
    body: "Searchable delivery audit log showing direction, recipient, timestamp, and real-time delivery status for full organizational compliance." },
  { id: "api-keys", icon: KeyRound, title: "API & Developers",
    body: (
      <div className="space-y-3">
        <p>API keys allow your CRM, website, or backend services to programmatically send transactional emails or query domain health.</p>
        <p>Generate keys in <em>Settings → API & Developers</em>. Keep your API key private in your server environment variables.</p>
      </div>
    ) },
  { id: "billing", icon: CreditCard, title: "Billing & Plans",
    body: "Manage your subscription, upgrade employee seat tiers, switch between NGN (₦) and USD ($), download receipts, and update payment cards powered securely by Paystack." },
  { id: "security", icon: ShieldCheck, title: "Security & Encryption",
    body: "All Gmail connections use OAuth 2.0 with AES-256 token encryption at rest. Inbound and outbound transmission is secured with TLS 1.3 encryption. We never access your private email credentials." },
  { id: "settings", icon: SettingsIcon, title: "Workspace & Team Admins",
    body: (
      <div className="space-y-3">
        <p>Customize your workspace name, default timezone, and upload your official company logo.</p>
        <p>Invite co-founders, IT administrators, or managers under <em>Settings → Team Admins & Members</em> to grant dashboard management access.</p>
      </div>
    ) },
];

function DocsRoute() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0.01 });
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => { window.removeEventListener("hashchange", fromHash); obs.disconnect(); };
  }, []);

  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <div>
      <PageHeader title="Documentation" subtitle="Everything you need to run your team's email on Mailcoy." />

      {/* Mobile: dropdown selector */}
      <div className="lg:hidden mb-5">
        <select
          value={active}
          onChange={(e) => { setActive(e.target.value); window.location.hash = e.target.value; }}
          className="w-full h-10 rounded-md border border-line bg-background px-3 text-[13.5px]"
        >
          {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      {/* Desktop: horizontal chip nav (replaces the second sidebar) */}
      <div className="hidden lg:block sticky top-14 z-10 -mx-6 px-6 py-3 mb-6 bg-background/85 backdrop-blur border-b border-line">
        <div className="flex flex-wrap gap-1.5">
          {SECTIONS.map(({ id, icon: Icon, title }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setActive(id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] transition border ${
                active === id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-ink-2 border-line hover:bg-ink/[0.04] hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {title}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-10 min-w-0">
        {SECTIONS.map(({ id, icon: Icon, title, body }) => (
          <section key={id} id={id} className="scroll-mt-[220px] lg:scroll-mt-[180px]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-9 w-9 rounded-lg bg-ink/[0.04] grid place-items-center"><Icon className="h-4.5 w-4.5 text-ink-2" /></div>
              <h2 className="font-display text-[19px] font-semibold tracking-tight">{title}</h2>
            </div>
            <div className="text-[14px] text-ink-2 leading-relaxed space-y-2.5">
              {typeof body === "string" ? <p>{body}</p> : body}
            </div>
            <div className="mt-8 border-b border-line" />
          </section>
        ))}
        <Card className="p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[15px]">
            <Bot className="h-5 w-5" />
            <h3>Need Instant Help or Account Diagnostics?</h3>
          </div>
          <p className="text-[13.5px] text-ink-3 leading-relaxed">
            Click the <strong>AI Support button</strong> in the bottom right corner of your screen anytime to ask technical questions, debug DNS verification, or calculate pricing in real time.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-line text-[12.5px] text-ink-3">
            <span>Prefer human assistance? Email <a className="underline font-mono text-ink font-medium hover:text-primary" href="mailto:support@mailcoy.com">support@mailcoy.com</a></span>
            <span className="text-[11px] font-mono text-ink-4">Response time: ~2 hours</span>
          </div>
        </Card>
        <p className="text-[11px] text-ink-4 text-center">Currently reading: {activeSection.title}</p>
      </div>
    </div>
  );
}