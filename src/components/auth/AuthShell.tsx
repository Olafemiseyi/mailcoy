import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Shield, Zap, Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Logomark } from "@/components/brand/Logomark";

/* ─── Feature bullets shown on the left panel ─────────────────────────────── */
const FEATURES = [
  { icon: Mail, text: "Connect any custom domain to existing Gmail inboxes" },
  { icon: Shield, text: "Automated SPF, DKIM, and DMARC alignment" },
  { icon: Zap, text: "Sub-200ms inbound forwarding with zero seat fees" },
];

/* ─── Security & Platform Assurance ───────────────────────────────────────── */
const PLATFORM_ASSURANCE = {
  headline: "Enterprise-Grade Reliability & Security",
  statement: "Google CASA-compliant token architecture ensures zero employee passwords are ever requested or stored.",
  certifications: ["TLS 1.3 Encryption", "Zero Workspace Markup", "Free Tier Available"],
};

/* ─── Left panel (desktop only) ───────────────────────────────────────────── */
function AuthPanel() {
  return (
    <div className="auth-panel relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink text-primary-foreground p-12">
      {/* Ambient background mesh glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[450px] h-[450px] bg-primary/20 blur-[130px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[450px] h-[450px] bg-emerald-500/15 blur-[130px] rounded-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 w-fit">
          <Logomark className="h-6 w-6 text-white" />
          <span className="font-display text-[17px] font-bold text-white tracking-tight">
            Mailcoy
          </span>
        </Link>

        {/* Middle content */}
        <div className="space-y-8 my-auto py-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/90 uppercase tracking-widest">
              <Zap className="h-3 w-3 text-amber-300" /> Modern Email OS
            </span>
            <h2 className="font-display text-[34px] xl:text-[40px] font-bold text-white leading-[1.1] tracking-tight">
              Professional email, <br />
              built for modern teams.
            </h2>
            <p className="text-[14.5px] text-white/70 max-w-sm leading-relaxed">
              Route, authenticate, and manage your company's custom domain email using the Gmail inboxes your staff already love.
            </p>
          </div>

          <ul className="space-y-3.5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 border border-white/15 text-white shadow-2xs">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[13.5px] text-white/85 font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Security & Assurance Statement */}
        <div className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-5 space-y-2.5 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[12.5px] font-bold text-white tracking-tight">
              {PLATFORM_ASSURANCE.headline}
            </p>
          </div>
          <p className="text-[12.5px] text-white/75 leading-relaxed">
            {PLATFORM_ASSURANCE.statement}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            {PLATFORM_ASSURANCE.certifications.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium bg-white/10 text-white/90 border border-white/15"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── AuthShell layout ──────────────────────────────────────────────────────── */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  showPanel = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  showPanel?: boolean;
}) {
  return (
    <div className="auth-layout min-h-screen bg-background text-foreground">
      <div
        className={`min-h-screen grid ${showPanel ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}
      >
        {/* Left panel (desktop only) */}
        {showPanel && <AuthPanel />}

        {/* Right: form column */}
        <div className="flex flex-col relative overflow-y-auto bg-background">
          {/* Mobile / top nav */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-line lg:border-none sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-ink"
            >
              <Logomark className="h-5 w-5 text-primary" />
              Mailcoy
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center px-6 py-12">
            <div className="w-full max-w-[400px]">
              {/* Heading */}
              <div className="mb-8 space-y-1.5">
                <h1 className="font-display text-[28px] font-bold tracking-tight text-ink">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[14px] text-ink-3 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {children}

              {footer && (
                <div className="mt-7 text-center text-[13px] text-ink-3">
                  {footer}
                </div>
              )}
            </div>
          </main>

          <footer className="px-6 py-4 text-center text-[11.5px] text-ink-3">
            © {new Date().getFullYear()} Mailcoy ·{" "}
            <Link to="/privacy" className="hover:text-ink transition-colors">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link to="/terms" className="hover:text-ink transition-colors">
              Terms
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}

/* ─── AuthField ──────────────────────────────────────────────────────────────── */
export function AuthField({
  label,
  type,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">
        {label}
      </span>
      <span className="relative block">
        <input
          {...props}
          type={isPassword ? (visible ? "text" : "password") : type}
          className={`w-full h-10 rounded-lg border border-line bg-surface px-3 text-[14px] outline-none
            placeholder:text-ink-3/60
            focus:border-primary focus:ring-2 focus:ring-primary/15
            disabled:opacity-50 transition-all
            ${isPassword ? "pr-10" : ""}
            ${props.className ?? ""}`}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={visible ? "Hide password" : "Show password"}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-3 transition hover:bg-surface-muted hover:text-ink"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </span>
      {hint && (
        <span className="mt-1 block text-[11.5px] text-ink-3">{hint}</span>
      )}
    </label>
  );
}

/* ─── PrimaryButton ─────────────────────────────────────────────────────────── */
export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={`w-full h-10 rounded-lg bg-primary text-primary-foreground text-[14px] font-semibold
        hover:opacity-90 active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed
        transition-all shadow-sm
        ${props.className ?? ""}`}
    />
  );
}

/* ─── GoogleButton ───────────────────────────────────────────────────────────── */
export function GoogleButton({
  onClick,
  label = "Continue with Google",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-10 rounded-lg border border-line bg-background text-[14px] font-medium
        hover:bg-surface active:scale-[.99]
        transition-all flex items-center justify-center gap-2.5 shadow-sm"
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {label}
    </button>
  );
}

/* ─── Divider ───────────────────────────────────────────────────────────────── */
export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[12px] text-ink-3">
      <div className="h-px flex-1 bg-line" />
      {children}
      <div className="h-px flex-1 bg-line" />
    </div>
  );
}