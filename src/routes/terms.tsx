import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Mailcoy" },
      { name: "description", content: "Terms and conditions governing the use of Mailcoy business email routing platform." },
      { property: "og:title", content: "Terms of Service — Mailcoy" },
      { property: "og:description", content: "Understand your rights, responsibilities, and service commitments when using Mailcoy." },
    ],
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <MarketingPage
      eyebrow="Legal & Terms"
      title="Terms of Service"
      lede="Last updated: July 2026. Please read these terms carefully before creating a workspace or routing email with Mailcoy."
    >
      <div className="space-y-10 text-[14.5px] leading-relaxed text-ink-2">
        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">1. Acceptance of Terms</h2>
          <p>
            By registering an account, creating an organization, or using any feature of Mailcoy ("Service"), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">2. Description of Service</h2>
          <p>
            Mailcoy provides business email identity, domain routing, deliverability management, and Gmail integration tools for organizations. Mailcoy is an identity and routing provider—it is not an email host, inbox provider, or document productivity suite.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">3. Domain Ownership & Acceptable Use</h2>
          <p>
            You agree to only register and route email for domains that you legally own or are authorized to manage. You explicitly agree not to use the Service for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-3">
            <li>Sending unsolicited bulk commercial messages (spam) or violating anti-spam laws (CAN-SPAM, GDPR).</li>
            <li>Phishing, domain spoofing, identity theft, or deceptive email activities.</li>
            <li>Distributing malware, viruses, or malicious software.</li>
            <li>Attempting unauthorized access to third-party accounts or email systems.</li>
          </ul>
          <p className="text-[13.5px] text-amber-700 dark:text-amber-400 font-medium">
            Violation of acceptable use policies will result in immediate suspension of sending capabilities and workspace termination without refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">4. Account Responsibilities & Team Roles</h2>
          <p>
            The workspace <strong>Owner</strong> maintains full administrative and billing control. Workspace owners and admins are responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-3">
            <li>Maintaining accurate domain DNS records (TXT, MX, SPF, DKIM, DMARC).</li>
            <li>Managing member invitations, employee seat assignments, and role privileges.</li>
            <li>Ensuring prompt revocation of credentials when employees leave the organization.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">5. Subscriptions, Fees & Billing</h2>
          <p>
            Subscriptions are billed on a recurring monthly or annual basis via Paystack. Plans are priced according to member seat volume and active domain limits. Free trial periods automatically transition to paid subscriptions unless canceled prior to trial expiration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-[20px] font-semibold text-ink">6. Service Availability & Limitations</h2>
          <p>
            While Mailcoy strives for 99.9% routing availability, email delivery performance relies on external factors including third-party DNS propagation, recipient server policies, and Google API availability. Mailcoy is provided on an "as is" and "as available" basis.
          </p>
        </section>

        <section className="space-y-3 border-t border-line pt-6">
          <h2 className="font-display text-[18px] font-semibold text-ink">Questions & Support</h2>
          <p className="text-ink-3">
            For questions regarding these Terms of Service, contact our team at <a href="mailto:legal@mailcoy.com" className="text-primary hover:underline">legal@mailcoy.com</a> or visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
          </p>
        </section>
      </div>
    </MarketingPage>
  );
}
