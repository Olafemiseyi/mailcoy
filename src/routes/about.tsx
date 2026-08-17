import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { ShieldCheck, Zap, HeartHandshake, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Mailcoy" },
      { name: "description", content: "We believe business email should be as effortless as Gmail. That's why we built Mailcoy." },
      { property: "og:title", content: "About — Mailcoy" },
      { property: "og:description", content: "Business email that respects your team's existing workflow." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <MarketingPage
      eyebrow="Our Mission"
      title="Business email on your team's terms."
      lede="Most companies buy business email, spend hundreds per user, and force their staff through painful software migrations. We built Mailcoy so you never have to."
    >
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-2">
        <p>
          <strong>Mailcoy</strong> is the modern email identity and intelligent routing platform. We give companies professional business email addresses on their own custom domain (<code className="text-primary font-mono text-[13px]">sales@company.com</code>, <code className="text-primary font-mono text-[13px]">team@company.com</code>) while letting every team member keep using their personal or company Gmail inboxes with zero learning curve.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="p-6 rounded-2xl border border-line bg-surface shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-display text-[18px] font-bold text-ink">Brand Identity First</h3>
          <p className="text-[13.5px] leading-relaxed text-ink-3">
            Your customers see a verified, trusted company domain with SPF/DKIM authentication and full logo support.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-line bg-surface shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-display text-[18px] font-bold text-ink">Zero Migration Friction</h3>
          <p className="text-[13.5px] leading-relaxed text-ink-3">
            Employees keep their existing Gmail keyboard shortcuts, mobile apps, labels, and muscle memory.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-line bg-surface shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <h3 className="font-display text-[18px] font-bold text-ink">Massive Cost Savings</h3>
          <p className="text-[13.5px] leading-relaxed text-ink-3">
            Eliminate $7/user/month Google Workspace seat licenses. Save up to 80%+ every single year.
          </p>
        </div>
      </div>

      <section className="mt-12 rounded-2xl border border-line bg-surface-muted/30 p-8">
        <h2 className="font-display text-[22px] font-bold tracking-tight text-ink">Our Core Principles</h2>
        <div className="mt-4 grid gap-6 text-[14px] leading-relaxed text-ink-3 md:grid-cols-2">
          <p>
            <strong>Simplicity on the Surface:</strong> We believe setting up custom domain email shouldn't require hiring an IT consultant or navigating complex registrar manuals. Our 1-click verification guides make onboarding instant.
          </p>
          <p>
            <strong>Enterprise-Grade Security:</strong> Under the hood, Mailcoy is powered by high-throughput Amazon SES and Resend delivery backbones, real-time DNSBL spam reputation monitoring, and AES-256 encryption.
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-line flex items-center justify-between">
          <span className="text-[13px] text-ink-3">Ready to upgrade your business email?</span>
          <Link to="/auth/signup" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:underline">
            Start For Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}