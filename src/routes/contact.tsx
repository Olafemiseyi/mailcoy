import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Send, CheckCircle2, MessageSquare, ShieldAlert, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Support — Mailcoy" },
      { name: "description", content: "Get in touch with the Mailcoy executive and engineering team." },
      { property: "og:title", content: "Contact — Mailcoy" },
      { property: "og:description", content: "Get in touch with the Mailcoy team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <MarketingPage
      eyebrow="Direct Support"
      title="Talk to our engineering team."
      lede="Questions about DNS setup, Google Workspace migration, or enterprise billing? We respond to every inquiry within 2 hours."
    >
      <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-display text-xl font-bold text-ink">Message Received!</h3>
              <p className="text-[13.5px] text-ink-3 max-w-sm mx-auto">
                Our support team has received your ticket and will email you back shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="grid gap-4"
            >
              <label className="grid gap-1.5 text-[13px] font-medium text-ink-2">
                Full name
                <input
                  required
                  type="text"
                  className="h-10 rounded-xl border border-line bg-background px-3 text-[14px] text-ink outline-none focus:border-primary"
                  placeholder="Ada Obi"
                />
              </label>
              <label className="grid gap-1.5 text-[13px] font-medium text-ink-2">
                Work email
                <input
                  required
                  type="email"
                  className="h-10 rounded-xl border border-line bg-background px-3 text-[14px] text-ink outline-none focus:border-primary"
                  placeholder="ada@company.com"
                />
              </label>
              <label className="grid gap-1.5 text-[13px] font-medium text-ink-2">
                Message & inquiry
                <textarea
                  required
                  rows={5}
                  className="rounded-xl border border-line bg-background p-3 text-[14px] text-ink outline-none focus:border-primary leading-relaxed"
                  placeholder="Tell us about your custom domain, current team size, and what you'd like to set up..."
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[13.5px] font-semibold text-primary-foreground shadow-xs hover:bg-primary-focus transition"
              >
                <Send className="h-4 w-4" /> Send Direct Message
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-[14px]">
              <Mail className="h-4 w-4" /> General & Support
            </div>
            <p className="text-[13px] text-ink-3 leading-relaxed">
              For general inquiries, account setup, or help: <br />
              <a href="mailto:hello@mailcoy.com" className="font-mono text-ink font-semibold hover:text-primary underline">hello@mailcoy.com</a>
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[14px]">
              <Mail className="h-4 w-4" /> Enterprise & Sales
            </div>
            <p className="text-[13px] text-ink-3 leading-relaxed">
              Teams with 50+ members and custom billing: <br />
              <a href="mailto:sales@mailcoy.com" className="font-mono text-ink font-semibold hover:text-primary underline">sales@mailcoy.com</a>
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-[14px]">
              <ShieldAlert className="h-4 w-4" /> Security & Privacy
            </div>
            <p className="text-[13px] text-ink-3 leading-relaxed">
              For compliance, legal inquiries, or security reports: <br />
              <a href="mailto:security@mailcoy.com" className="font-mono text-ink font-semibold hover:text-primary underline">security@mailcoy.com</a>
            </p>
          </div>
        </aside>
      </div>
    </MarketingPage>
  );
}