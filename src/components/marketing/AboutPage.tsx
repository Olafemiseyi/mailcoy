import { MarketingPage } from "./MarketingPage";
import { Link } from "@tanstack/react-router";
import { Users, Mail, Zap, ShieldCheck } from "lucide-react";

export function AboutPage() {
  return (
    <MarketingPage
      eyebrow="About Mailcoy"
      title="Empowering seamless email routing."
      lede="We built Mailcoy because we believe managing professional business email shouldn't require abandoning the Gmail workflow you already know and love."
    >
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary">
        <p className="text-[15.5px] leading-relaxed">
          At <strong>LightOrb Innovations</strong>, we recognized a massive friction point for startups, small businesses, and solo founders: getting a custom domain email usually meant migrating entirely to a clunky enterprise suite or paying steep monthly user fees for Google Workspace.
        </p>

        <p className="text-[15.5px] leading-relaxed">
          <strong>Mailcoy</strong> was born out of a simple idea: <em>Why can't you just route your custom domain directly into your existing personal Gmail?</em>
        </p>
        
        <div className="my-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-display text-[17px] font-semibold text-ink">Zero Inbox Migration</h3>
            <p className="text-[14px] text-ink-3 leading-relaxed">
              We eliminate the need to switch tabs or learn a new email client. You send and receive directly from Gmail.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-display text-[17px] font-semibold text-ink">Instant Setup</h3>
            <p className="text-[14px] text-ink-3 leading-relaxed">
              Configure your DNS records once, add an App Password, and you're done. No complex enterprise configurations.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-display text-[17px] font-semibold text-ink">Enterprise Delivery</h3>
            <p className="text-[14px] text-ink-3 leading-relaxed">
              Powered by robust enterprise APIs, our backend ensures 99.99% deliverability and perfect SPF/DKIM alignment.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-display text-[17px] font-semibold text-ink">Scale Seamlessly</h3>
            <p className="text-[14px] text-ink-3 leading-relaxed">
              Whether you're a team of one or fifty, adding aliases, catch-alls, and team members takes seconds.
            </p>
          </div>
        </div>

        <h2 className="mt-12 mb-4 text-2xl font-semibold text-ink">Our Mission</h2>
        <p className="text-[15.5px] leading-relaxed">
          We want to commoditize professional communication. Our goal is to save thousands of hours and millions of dollars for entrepreneurs globally, so they can focus on building their businesses rather than managing their MX records.
        </p>

        <h2 className="mt-12 mb-4 text-2xl font-semibold text-ink">Built for Speed and Scale</h2>
        <p className="text-[15.5px] leading-relaxed mb-6">
          We process inbound webhooks and outbound SMTP relays in milliseconds. By leveraging cutting-edge cloud infrastructure and deep integration with global edge networks, we ensure your emails are delivered instantaneously without ever compromising on privacy or security.
        </p>

        <hr className="my-12 border-line" />

        <div className="text-center pb-8">
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">Ready to route your domain?</h2>
          <Link
            to="/auth/signup"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-[14px] font-semibold text-primary-foreground transition hover:opacity-90 shadow-sm"
          >
            Start your free trial &rarr;
          </Link>
        </div>
      </div>
    </MarketingPage>
  );
}
