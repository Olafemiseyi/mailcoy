import type { ReactNode } from "react";
import { MarketingShell } from "./MarketingShell";

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
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-10 md:pt-24">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-4">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[52px]">
          {title}
        </h1>
        {lede && (
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-3">
            {lede}
          </p>
        )}
      </section>
      <section className="mx-auto max-w-3xl px-5 pb-24">{children}</section>
    </MarketingShell>
  );
}