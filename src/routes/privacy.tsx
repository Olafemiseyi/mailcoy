import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Mailcoy" },
      { name: "description", content: "Learn how Mailcoy collects, uses, and protects your personal and workspace data." },
      { property: "og:title", content: "Privacy Policy — Mailcoy" },
      { property: "og:description", content: "How we safeguard organization identities, domain records, and Gmail access." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <MarketingPage
      eyebrow="Legal & Security"
      title="Privacy Policy"
      lede="Last updated: July 2026. This policy explains how Mailcoy collects, processes, and protects data when you use our business email routing service."
    >
      <div className="space-y-10 text-[14.5px] leading-relaxed text-ink-2">
        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">1. Information We Collect</h2>
          <p>
            When you register an account or operate a workspace on Mailcoy, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-3">
            <li><strong className="text-ink">Account & Workspace Identity:</strong> Name, work email address, company name, industry, and billing details.</li>
            <li><strong className="text-ink">Domain & DNS Data:</strong> Sending domain names, DNS nonces, TXT/MX/SPF/DKIM/DMARC status records, and nameserver configurations.</li>
            <li><strong className="text-ink">Team & Alias Metadata:</strong> Employee names, job titles, primary/secondary email aliases, and invitation statuses.</li>
            <li><strong className="text-ink">Google & Gmail OAuth Tokens:</strong> Encrypted access and refresh tokens when employees authorize the Mailcoy Google Connector to send or relay emails on behalf of their custom domain.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">2. Use of Google User Data & Gmail Scopes</h2>
          <p>
            Mailcoy uses Google OAuth restricted scopes strictly to provide the email routing and reply-as functionality within your connected Gmail inbox.
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 space-y-3 text-[13.5px]">
            <p className="font-medium text-ink">How we handle your Gmail data:</p>
            <ul className="list-disc pl-5 space-y-1 text-ink-3">
              <li>We <strong>never sell</strong> your email contents or contact data to third parties or advertisers.</li>
              <li>We <strong>never use</strong> your email data for training artificial intelligence or machine learning models.</li>
              <li>Gmail API permissions are used solely to register custom send-as aliases, insert incoming routed messages, and relay outbound messages composed in your Gmail interface.</li>
              <li>All OAuth tokens are encrypted at rest using AES-256-GCM encryption.</li>
            </ul>
            <div className="rounded-lg border border-primary/20 bg-primary/[0.04] p-3 text-[12.5px] text-ink-2">
              <strong className="text-primary font-semibold">Google API Services User Data Policy (Limited Use):</strong>
              <p className="mt-1">
                Mailcoy’s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary-focus"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">3. Data Storage & Security</h2>
          <p>
            We implement strict security measures to protect your organization's infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-3">
            <li>Tenant data isolation enforced via Supabase Row Level Security (RLS).</li>
            <li>API keys hashed using Argon2id prior to database storage.</li>
            <li>Audit logs for all administrative and privileged actions retained for security forensics.</li>
            <li>HTTPS enforced across all API endpoints and transport routes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">4. Third-Party Service Providers</h2>
          <p>
            We partner with trusted infrastructure providers to deliver our service:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-3">
            <li><strong className="text-ink">Supabase:</strong> Authentication, encrypted database storage, and edge functions.</li>
            <li><strong className="text-ink">Amazon Web Services (SES):</strong> Secure outbound email delivery and DKIM signing.</li>
            <li><strong className="text-ink">Paystack:</strong> PCI-compliant billing and subscription processing.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">5. Your Rights & Data Retention</h2>
          <p>
            Workspace owners can update, export, or delete their organization data at any time. When an organization is deleted, all associated tenant data, employee profiles, domain records, and connected Google credentials are permanently purged after 30 days.
          </p>
        </section>

        <section className="space-y-3 border-t border-line pt-6">
          <h2 className="font-display text-[18px] font-semibold text-ink">Contact Us</h2>
          <p className="text-ink-3">
            If you have questions regarding this Privacy Policy or data security, please contact our support team at <a href="mailto:support@mailcoy.com" className="text-primary hover:underline">support@mailcoy.com</a> or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </MarketingPage>
  );
}
