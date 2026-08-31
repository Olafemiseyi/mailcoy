import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { CustomSelect } from "@/components/CustomSelect";
import {
  Globe,
  Users,
  Mail,
  AtSign,
  PenLine,
  Inbox,
  BarChart3,
  ScrollText,
  KeyRound,
  CreditCard,
  Rocket,
  ShieldCheck,
  Bot,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  Lock,
  Zap,
  Settings as SettingsIcon,
  HelpCircle,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation & Setup Guides — Mailcoy" },
      {
        name: "description",
        content:
          "Everything you need to configure custom domains, Gmail Send-As, and 99.9% deliverability in under 15 minutes.",
      },
      { property: "og:title", content: "Documentation — Mailcoy" },
      { property: "og:description", content: "Everything you need to set up Mailcoy." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
    ],
  }),
  component: Docs,
});

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-surface border border-line hover:bg-ink/[0.04] text-ink transition-colors cursor-pointer shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-600" />
          <span className="text-emerald-600 font-semibold">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 text-ink-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function FaqItem({
  num,
  q,
  a,
  isOpen,
  onToggle,
}: {
  num: string;
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "border-primary/40 bg-surface shadow-xs ring-1 ring-primary/20"
          : "border-line bg-surface/80 hover:border-line-strong hover:bg-surface"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 text-left cursor-pointer transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className="font-mono text-[11px] font-bold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md shrink-0 mt-0.5">
            {num}
          </span>
          <span className="font-display text-[14.5px] sm:text-[15.5px] font-bold text-ink leading-snug whitespace-normal break-words">
            {q}
          </span>
        </div>
        <div
          className={`h-7 w-7 rounded-full border border-line grid place-items-center shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-45 bg-primary/10 border-primary/30 text-primary" : "text-ink-3 bg-surface-muted/50"
          }`}
        >
          <Plus className="h-4 w-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 text-[13.5px] text-ink-2 leading-relaxed whitespace-normal break-words border-t border-line/60">
          <p className="pl-8">{a}</p>
        </div>
      )}
    </div>
  );
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can large organizations with 50, 100, 500, or 1,000+ employees use Mailcoy?",
      a: "Yes, absolutely. Mailcoy is built from the ground up to support organizations of any size—from single-person consultancies to multi-national enterprises with hundreds of staff. With high-throughput Anycast edge MX relays, dedicated IP warming pools, multi-domain routing, SAML SSO, and centralized RBAC offboarding controls, Mailcoy easily scales to handle millions of monthly emails.",
    },
    {
      q: "How do I display my company logo in Gmail and customer inboxes?",
      a: "For 100% free and instant setup in Gmail, upload your company logo as your Google Account Profile Picture at myaccount.google.com for your connected Gmail account. Gmail will automatically attach this avatar next to your business emails. For Outlook, Apple Mail, and CRMs, register your business address for free on Gravatar.com. If you want official BIMI DNS records on Yahoo/Fastmail, copy your default._bimi TXT record from your domain details page.",
    },
    {
      q: "Do my employees need to create new accounts or learn new software?",
      a: "No. Your employees continue logging into their regular, existing Gmail inbox on web, iPhone, or Android. They read incoming customer inquiries and reply directly inside Gmail as sales@yourcompany.com with verified DKIM signatures.",
    },
    {
      q: "How does Mailcoy protect against spam and spoofing without Workspace?",
      a: "Mailcoy provides automated SPF, 2048-bit DKIM, and DMARC alignment records upon domain verification. When your staff sends mail through our dedicated outbound relay, messages are cryptographically signed under your root domain, achieving 99.9% primary inbox placement.",
    },
    {
      q: "Can I use shared addresses like sales@ or support@ with multiple staff?",
      a: "Yes. You can configure shared alias inboxes with 1-click fan-out (all assigned team members receive incoming messages simultaneously) or round-robin routing. Replies from any staff member still use the branded alias identity.",
    },
    {
      q: "What happens if an employee leaves the company?",
      a: "With Mailcoy 1-Click Offboarding, toggle the employee off in your dashboard to immediately revoke their Send-As ability and reroute all incoming correspondence to an admin or successor. You retain complete ownership of your corporate email traffic.",
    },
    {
      q: "Can one employee have multiple aliases (e.g. john@, press@, ceo@)?",
      a: "Yes. You can assign unlimited alias identities to a single employee's connected Gmail account at no extra charge. They choose which branded identity to send from via a simple dropdown in Gmail compose.",
    },
    {
      q: "How does Mailcoy pricing compare to Google Workspace or Microsoft 365?",
      a: "Google Workspace charges $6 to $18 per user every month ($72–$216/yr per employee). Mailcoy provides predictable, flat workspace billing with unlimited inboxes, saving fast-growing teams 80% to 90% annually.",
    },
    {
      q: "Does Mailcoy store or read our company's private email messages?",
      a: "No. Mailcoy operates on a zero-storage pipeline. Inbound and outbound emails pass through transient memory for cryptographic signing and spam verification, and are forwarded in milliseconds straight to your Gmail. Your private inbox contents are never saved to our disks.",
    },
    {
      q: "What happens if our DNS or network suffers an outage?",
      a: "Mailcoy utilizes dual redundant Anycast MX routing nodes (mx1.mailcoy.com and mx2.mailcoy.com) with automatic 72-hour retry queues. If an endpoint is temporarily unreachable, emails are safely queued and retried automatically without data loss.",
    },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <FaqItem
          key={faq.q}
          num={`0${idx + 1}`}
          q={faq.q}
          a={faq.a}
          isOpen={openIdx === idx}
          onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
        />
      ))}
    </div>
  );
}

type Section = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  shortTitle?: string;
  badge?: string;
  body: ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "quickstart",
    icon: Rocket,
    title: "Quickstart Guide",
    shortTitle: "Quickstart",
    badge: "5-Min Setup",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Set up your entire company's business email on <strong>Mailcoy</strong> in under 5 minutes by following these 4 straightforward steps:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-4 rounded-xl border border-line bg-surface space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-mono text-[12px] font-bold grid place-items-center">
                1
              </span>
              <h4 className="font-semibold text-ink text-[13.5px]">Add & Verify Domain</h4>
            </div>
            <p className="text-[12.5px] text-ink-3 leading-relaxed">
              Navigate to <strong>Domains</strong>, enter your root domain (e.g. <em>yourcompany.com</em>), and copy the DNS ownership and MX records.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-mono text-[12px] font-bold grid place-items-center">
                2
              </span>
              <h4 className="font-semibold text-ink text-[13.5px]">Add Employees</h4>
            </div>
            <p className="text-[12.5px] text-ink-3 leading-relaxed">
              Under <strong>Employees</strong>, assign professional addresses (e.g. <em>sales@yourcompany.com</em>) paired with their Gmail accounts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-mono text-[12px] font-bold grid place-items-center">
                3
              </span>
              <h4 className="font-semibold text-ink text-[13.5px]">Connect Gmail Inboxes</h4>
            </div>
            <p className="text-[12.5px] text-ink-3 leading-relaxed">
              Staff scan the 1-click QR code or click the invite link to connect their Gmail inbox in seconds with zero workflow disruption.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-mono text-[12px] font-bold grid place-items-center">
                4
              </span>
              <h4 className="font-semibold text-ink text-[13.5px]">Signatures & Policies</h4>
            </div>
            <p className="text-[12.5px] text-ink-3 leading-relaxed">
              Configure centralized company email signatures, catch-all routing, and team admin permissions in <strong>Settings</strong>.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[12.5px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            <strong>Zero Downtime Migration:</strong> You can set up Mailcoy alongside existing email providers with zero lost customer inquiries.
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "domains",
    icon: Globe,
    title: "Domains & DNS Authentication",
    shortTitle: "Domains & DNS",
    badge: "MX · SPF · DKIM · DMARC",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          To send and receive emails as <em>@yourcompany.com</em>, add the following DNS authentication records to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
        </p>

        {/* Interactive DNS Table */}
        <div className="rounded-xl border border-line overflow-x-auto bg-surface">
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-surface-muted border-b border-line text-ink-3 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Host / Name</th>
                <th className="p-3">Value / Target</th>
                <th className="p-3">Priority / TTL</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink">
              <tr>
                <td className="p-3 font-mono font-bold text-primary">MX</td>
                <td className="p-3 font-mono">@</td>
                <td className="p-3 font-mono">inbound-smtp.us-east-1.amazonaws.com</td>
                <td className="p-3 font-mono text-ink-3">10 / 300s</td>
                <td className="p-3 text-right">
                  <CopyButton text="inbound-smtp.us-east-1.amazonaws.com" />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">MX</td>
                <td className="p-3 font-mono">@</td>
                <td className="p-3 font-mono">inbound-smtp.us-east-1.amazonaws.com</td>
                <td className="p-3 font-mono text-ink-3">20 / 300s</td>
                <td className="p-3 text-right">
                  <CopyButton text="inbound-smtp.us-east-1.amazonaws.com" />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">TXT</td>
                <td className="p-3 font-mono">@</td>
                <td className="p-3 font-mono">v=spf1 include:amazonses.com ~all</td>
                <td className="p-3 font-mono text-ink-3">Auto</td>
                <td className="p-3 text-right">
                  <CopyButton text="v=spf1 include:amazonses.com ~all" />
                </td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-primary">TXT</td>
                <td className="p-3 font-mono">_dmarc</td>
                <td className="p-3 font-mono">v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com</td>
                <td className="p-3 font-mono text-ink-3">Auto</td>
                <td className="p-3 text-right">
                  <CopyButton text="v=DMARC1; p=quarantine; rua=mailto:dmarc@mailcoy.com" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[12.5px] text-ink-3 leading-relaxed">
          Once entered in your registrar, click <strong>Verify Domain</strong> in the dashboard for instant DoH verification.
        </p>
      </div>
    ),
  },
  {
    id: "employees",
    icon: Users,
    title: "Employee Inboxes & 1-Click Linking",
    shortTitle: "Employees",
    badge: "Zero Workspace Seats",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Assign professional email addresses to your teammates without paying for Google Workspace licenses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Pending Invite
            </span>
            <p className="text-[12px] text-ink-3 pt-1">
              Invite link dispatched, awaiting Gmail authentication.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Connected
            </span>
            <p className="text-[12px] text-ink-3 pt-1">
              Gmail active, 2-way routing operating under 200ms.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
              1-Click Offboarding
            </span>
            <p className="text-[12px] text-ink-3 pt-1">
              Immediately revokes sending and reroutes inbox traffic.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "gmail",
    icon: Mail,
    title: "Gmail Integration & Send-As Setup",
    shortTitle: "Gmail Setup",
    badge: "Native Gmail App",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Employees send and receive directly inside standard Gmail using their custom business email address:
        </p>

        <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
          <h4 className="font-semibold text-ink text-[13.5px]">Outbound SMTP Configuration:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px] font-mono">
            <div className="p-2.5 rounded-lg bg-surface-muted border border-line flex items-center justify-between">
              <span>Server: <strong>smtp.resend.com</strong></span>
              <CopyButton text="smtp.resend.com" />
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted border border-line flex items-center justify-between">
              <span>Port: <strong>465 (SSL)</strong></span>
              <CopyButton text="465" />
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted border border-line flex items-center justify-between">
              <span>Username: <strong>resend</strong></span>
              <CopyButton text="resend" />
            </div>
            <div className="p-2.5 rounded-lg bg-surface-muted border border-line flex items-center justify-between">
              <span>Password: <strong>SMTP API Key</strong></span>
              <span className="text-[11px] text-ink-4">From Dashboard</span>
            </div>
          </div>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-[13px] text-ink-2">
          <li>Open <strong>Gmail Settings → Accounts and Import</strong>.</li>
          <li>Under <em>"Send mail as"</em>, click <strong>"Add another email address"</strong>.</li>
          <li>Enter the employee's name and business email address (keep <em>"Treat as an alias"</em> checked).</li>
          <li>Enter the SMTP details above and confirm the 6-digit verification code.</li>
          <li>Select <strong>"Reply from the same address to which the message was sent"</strong>.</li>
        </ol>

        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[12.5px] text-blue-900 dark:text-blue-200">
          <strong>📱 Mobile Sync (iOS & Android):</strong> Once completed in your mobile browser, the custom <em>From:</em> address will automatically sync to the official Gmail app on your smartphone.
        </div>
      </div>
    ),
  },
  {
    id: "aliases",
    icon: AtSign,
    title: "Aliases & Department Routing",
    shortTitle: "Aliases",
    badge: "Shared Inboxes",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Create shared department addresses like <em>sales@</em>, <em>support@</em>, or <em>billing@</em>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <strong className="text-ink font-semibold">Fan-Out Broadcast:</strong>
            <p className="text-ink-3 leading-relaxed">
              Every incoming customer email is delivered simultaneously to all assigned team members' Gmail inboxes.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <strong className="text-ink font-semibold">Round-Robin Distribution:</strong>
            <p className="text-ink-3 leading-relaxed">
              Distributes incoming leads sequentially across team members to maintain balanced workload.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "signatures",
    icon: PenLine,
    title: "Branded Email Signatures",
    shortTitle: "Signatures",
    badge: "Dynamic Merge Tags",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Deploy unified, professional email signatures across all employees with smart merge tags:
        </p>
        <div className="p-4 rounded-xl bg-surface border border-line space-y-2.5">
          <div className="text-[12.5px] font-semibold text-ink">Supported Merge Tags:</div>
          <div className="flex flex-wrap gap-1.5 font-mono text-[12px]">
            {["{name}", "{title}", "{email}", "{phone}", "{company}", "{website}", "{booking_link}"].map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-md bg-surface-muted border border-line text-primary font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "catch-all",
    icon: Inbox,
    title: "Catch-All Email Routing",
    shortTitle: "Catch-All",
    badge: "Zero Lost Leads",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Catch emails sent to mistyped or unassigned addresses on your domain (e.g. <em>info@</em>, <em>contact@</em>):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <strong className="text-ink font-semibold">Shared Inbox Mode:</strong>
            <p className="text-ink-3 leading-relaxed">
              Stores unknown incoming mail quietly in your workspace Email Logs for easy auditing.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <strong className="text-ink font-semibold">Forwarding Mode:</strong>
            <p className="text-ink-3 leading-relaxed">
              Instantly forwards all catch-all mail to an administrative manager or founder's inbox.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics, Delivery Health & DNSBL",
    shortTitle: "Analytics",
    badge: "Live Telemetry",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Monitor your domain's sending health, bounce rates, and spam blacklist status across 24-hour, 7-day, 30-day, and 12-month periods.
        </p>
        <div className="p-4 rounded-xl bg-surface border border-line space-y-2 text-[13px]">
          <div className="font-semibold text-ink">DNSBL & Reputation Monitoring:</div>
          <p className="text-ink-3 leading-relaxed">
            Mailcoy continuously monitors global spam registries (Spamhaus, Barracuda, SORBS) to verify your domain maintains clean IP reputation and zero blacklisting.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "logs",
    icon: ScrollText,
    title: "Email Delivery Logs",
    shortTitle: "Logs",
    badge: "Real-Time Inspector",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Full message history with instant search, direction badges (Inbound vs Outbound), delivery timestamps, and payload inspection.
        </p>
        <p className="text-[12.5px] text-ink-3">
          Click any row in the dashboard Email Logs to view full message IDs, sender verification headers, and transmission latency.
        </p>
      </div>
    ),
  },
  {
    id: "api-keys",
    icon: KeyRound,
    title: "REST API & Developer Integration",
    shortTitle: "REST API",
    badge: "cURL · Node.js · Python",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Send automated transactional emails (invoices, receipts, notifications) from your apps or CRM using the Mailcoy REST API.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-[12px] space-y-2 overflow-x-auto border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span>POST /v1/emails/send</span>
            <CopyButton text={`curl -X POST https://api.mailcoy.com/v1/emails/send \\\n  -H "Authorization: Bearer mc_live_secret_key" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "from": "sales@yourcompany.com",\n    "to": "client@apple.com",\n    "subject": "Enterprise Proposal",\n    "html": "<p>Proposal attached.</p>"\n  }'`} />
          </div>
          <pre className="text-slate-300 leading-relaxed">
{`curl -X POST https://api.mailcoy.com/v1/emails/send \\
  -H "Authorization: Bearer mc_live_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "sales@yourcompany.com",
    "to": "client@apple.com",
    "subject": "Enterprise Proposal",
    "html": "<p>Proposal attached.</p>"
  }'`}
          </pre>
        </div>
      </div>
    ),
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security, Privacy & Encryption",
    shortTitle: "Security",
    badge: "TLS 1.3 · AES-256",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Mailcoy is engineered with strict enterprise privacy protections:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12.5px]">
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <Lock className="h-4 w-4 text-primary" /> Zero Passwords
            </div>
            <p className="text-ink-3 leading-relaxed">
              We never ask for or store Google account passwords. All tokens use OAuth 2.0.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> AES-256 At Rest
            </div>
            <p className="text-ink-3 leading-relaxed">
              Credentials and configuration data are encrypted with military-grade AES-256.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <Zap className="h-4 w-4 text-amber-500" /> TLS 1.3 In Flight
            </div>
            <p className="text-ink-3 leading-relaxed">
              All messages are transported across high-security encrypted TLS 1.3 tunnels.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing, Currency & Subscriptions",
    shortTitle: "Billing",
    badge: "Multi-Currency · Paystack",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Mailcoy supports multi-currency billing (Naira ₦ for Nigerian businesses and USD $ internationally) with flat team billing.
        </p>
        <p className="text-[12.5px] text-ink-3">
          Manage payment cards, upgrade seat tiers, and download itemized PDF VAT invoices in <strong>Settings → Billing</strong>.
        </p>
      </div>
    ),
  },
  {
    id: "settings",
    icon: SettingsIcon,
    title: "Workspace & Team Admins",
    shortTitle: "Settings",
    badge: "RBAC & Team",
    body: (
      <div className="space-y-4">
        <p className="text-[14px] text-ink-2 leading-relaxed">
          Customize your workspace profile, default company timezone, and invite team administrators:
        </p>
        <p className="text-[12.5px] text-ink-3">
          Invite co-founders, IT administrators, or managers under <strong>Settings → Team Admins & Members</strong> to grant dashboard management access with role-based permissions.
        </p>
      </div>
    ),
  },
  {
    id: "faq",
    icon: HelpCircle,
    title: "Frequently Asked Questions",
    shortTitle: "FAQ",
    badge: "8 Answers",
    body: <FaqSection />,
  },
];

function Docs() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.01 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("hashchange", fromHash);
      obs.disconnect();
    };
  }, []);

  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <MarketingShell>
      <div className="relative overflow-x-clip">
        {/* Ambient mesh glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full opacity-60 dark:opacity-30" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 pt-12 pb-6 md:pt-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-2xs">
                <BookOpen className="h-3 w-3" />
                <span>Knowledge Base</span>
              </div>
              <h1 className="font-display text-[32px] sm:text-[40px] font-bold text-ink tracking-tight">
                Documentation
              </h1>
              <p className="text-[15px] text-ink-3">
                Everything you need to run your team's email on Mailcoy.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-ai-assistant"))}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors border border-primary/20 font-medium text-sm cursor-pointer shadow-2xs"
            >
              <Bot className="w-4 h-4" />
              Ask AI Assistant
            </button>
          </div>

          {/* Mobile: Sticky Branded CustomSelect Dropdown Modal */}
          <div className="lg:hidden sticky top-14 z-20 -mx-5 px-5 py-2 mb-4 bg-background/95 backdrop-blur-md border-b border-line shadow-xs">
            <CustomSelect
              options={SECTIONS.map((s) => ({ value: s.id, label: s.title }))}
              value={active}
              onChange={(val) => {
                setActive(val);
                window.location.hash = val;
                const el = document.getElementById(val);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              placeholder="Select a documentation topic…"
              searchable
              className="w-full"
            />
          </div>

          {/* Desktop: Ultra-Slim Single-Line Sticky Ribbon Bar */}
          <div className="hidden lg:block sticky top-14 z-20 -mx-6 px-6 py-2 mb-6 bg-background/90 backdrop-blur-md border-b border-line shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap min-w-0">
              {SECTIONS.map(({ id, icon: Icon, shortTitle, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => {
                    setActive(id);
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-medium transition-all border cursor-pointer shrink-0 ${
                    active === id
                      ? "bg-primary text-primary-foreground border-primary shadow-2xs font-semibold"
                      : "bg-surface text-ink-2 border-line hover:bg-ink/[0.04] hover:text-ink"
                  }`}
                  title={title}
                >
                  <Icon className="h-3 w-3 shrink-0" />
                  <span>{shortTitle || title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Content Body */}
          <div className="max-w-3xl mx-auto space-y-10 min-w-0 pb-16">
            {SECTIONS.map(({ id, icon: Icon, title, badge, body }) => (
              <section key={id} id={id} className="scroll-mt-[220px] lg:scroll-mt-[180px]">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-ink/[0.04] grid place-items-center shrink-0">
                      <Icon className="h-4.5 w-4.5 text-ink-2" />
                    </div>
                    <h2 className="font-display text-[19px] font-semibold tracking-tight text-ink">
                      {title}
                    </h2>
                  </div>
                  {badge && (
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-muted border border-line text-[11px] font-mono text-ink-3">
                      {badge}
                    </span>
                  )}
                </div>

                <div className="text-[14px] text-ink-2 leading-relaxed space-y-3">
                  {typeof body === "string" ? <p>{body}</p> : body}
                </div>

                <div className="mt-8 border-b border-line" />
              </section>
            ))}

            {/* AI Diagnostics Card */}
            <div className="rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[15px]">
                <Bot className="h-5 w-5" />
                <h3>Need Instant Help or Account Diagnostics?</h3>
              </div>
              <p className="text-[13.5px] text-ink-3 leading-relaxed">
                Click the <strong>AI Support button</strong> in the bottom right corner of your screen anytime to ask technical questions, debug DNS verification, or calculate pricing in real time.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-line text-[12.5px] text-ink-3">
                <span>
                  Prefer human assistance? Email{" "}
                  <a
                    className="underline font-mono text-ink font-medium hover:text-primary"
                    href="mailto:support@mailcoy.com"
                  >
                    support@mailcoy.com
                  </a>
                </span>
                <span className="text-[11px] font-mono text-ink-4">Response time: ~2 hours</span>
              </div>
            </div>
            <p className="text-[11px] text-ink-4 text-center">Currently reading: {activeSection.title}</p>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}