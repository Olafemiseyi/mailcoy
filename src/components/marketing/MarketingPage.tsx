import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MarketingShell } from "./MarketingShell";
import { ArrowLeft, Sparkles } from "lucide-react";

export function MarketingPage({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <MarketingShell>
      <div className="relative overflow-hidden">
        {/* Ambient mesh glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full opacity-60 dark:opacity-30" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 pt-12 pb-8 md:pt-20">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-2xs">
              <Sparkles className="h-3 w-3" />
              <span>{eyebrow}</span>
            </div>
            <h1 className="font-display text-[36px] sm:text-[48px] font-bold text-ink leading-[1.08] tracking-tight">
              {title}
            </h1>
            {lede && (
              <p className="text-[16px] sm:text-[17px] leading-relaxed text-ink-3 max-w-2xl pt-1">
                {lede}
              </p>
            )}
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24">{children}</div>
      </div>
    </MarketingShell>
  );
}