// Public invite acceptance page — no auth required.
// The employee arrives via a link/QR/email, sees their details, then clicks
// "Continue with Google". We redirect them DIRECTLY to Google's consent screen.
// Google redirects back to /api/auth/google/callback which stores the refresh token
// and then redirects back here, where the page now shows "Gmail connected".
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getInviteByToken, startGmailByInvite } from "@/lib/invitations.functions";
import {
  CheckCircle2,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Copy,
  Smartphone,
  Laptop,
  Check,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/invite/$token")({
  head: () => ({
    meta: [
      { title: "Connect Your Gmail Inbox — Mailcoy" },
      {
        name: "description",
        content:
          "You've been invited to connect your Gmail inbox to send and receive verified custom domain email via Mailcoy.",
      },
      { property: "og:title", content: "Team Email Invitation — Mailcoy" },
      {
        property: "og:description",
        content:
          "1-Click connect your existing Gmail inbox to send and receive verified business email on your company domain.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Mailcoy" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { property: "og:image:secure_url", content: "https://mailcoy.com/og-image.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Connect Gmail — Mailcoy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Team Email Invitation — Mailcoy" },
      {
        name: "twitter:description",
        content:
          "Connect your Gmail inbox in 1 click to start sending and receiving company emails with verified SPF/DKIM.",
      },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : undefined,
    qa: search.qa === "true" || search.test === "true" || search.qa === true || search.test === true ? true : undefined,
  }),
  component: InvitePage,
});

function InvitePage() {
  const { token } = Route.useParams();
  const search = useSearch({ from: "/invite/$token" });
  const start = useServerFn(startGmailByInvite);
  const [redirecting, setRedirecting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Basic mobile detection
  const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  const query = useQuery({
    queryKey: ["invite", token],
    queryFn: () => getInviteByToken({ data: { token } }),
    staleTime: 15_000,
  });

  const connect = useMutation({
    mutationFn: async () => {
      setRedirecting(true);
      const { authorizationUrl } = await start({
        data: { token, redirectOrigin: window.location.origin },
      });
      // Full-page redirect to Google's consent screen
      window.location.href = authorizationUrl;
    },
    onError: () => setRedirecting(false),
  });

  const mockConnect = useMutation({
    mutationFn: async () => {
      setRedirecting(true);
      const { authorizationUrl } = await start({
        data: { token, redirectOrigin: window.location.origin, mock: true },
      });
      window.location.href = authorizationUrl;
    },
    onError: () => setRedirecting(false),
  });

  if (query.isLoading)
    return (
      <Shell>
        <div className="flex items-center justify-center gap-2 text-ink-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading invite…
        </div>
      </Shell>
    );
  if (query.isError)
    return (
      <Shell>
        <ErrorState message={(query.error as Error).message} />
      </Shell>
    );

  const res = query.data;
  if (!res || !res.ok) {
    const reason = res?.reason;
    return (
      <Shell>
        <ErrorState
          message={
            reason === "expired"
              ? "This invitation has expired. Ask your admin to send a new one."
              : reason === "revoked"
                ? "This invitation has been revoked."
                : "This invitation link is not valid."
          }
        />
      </Shell>
    );
  }

  const orgName = (res.organization as { name?: string } | null)?.name ?? "your workspace";
  const emp = res.employee as {
    full_name?: string | null;
    professional_email?: string | null;
    job_title?: string | null;
    department?: string | null;
  } | null;
  const gmail = res.gmail as { google_email: string; connected_at: string } | null;
  const smtpPassword = res.smtpPassword as string | undefined;
  const hasGoogleKeys = (res as any)?.hasGoogleKeys ?? false;
  const alreadyDone = !!gmail;
  const showSandbox = Boolean(search.qa || !hasGoogleKeys);

  return (
    <Shell>
      <div className="text-center mb-5 sm:mb-6">
        <div className="inline-grid place-items-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-ink text-white mb-3 sm:mb-4 shadow-sm">
          <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink">
          Connect your Gmail
        </h1>
        <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[13.5px] text-ink-3 leading-relaxed px-1">
          {orgName} invited you to send business email from a professional address using your own
          Google account.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4 sm:p-5 mb-4 sm:mb-5 space-y-2.5 sm:space-y-3 min-w-0 shadow-xs">
        <InfoRow label="You are" value={emp?.full_name ?? "—"} />
        <InfoRow label="Business email" value={emp?.professional_email ?? "—"} mono />
        {emp?.job_title && (
          <InfoRow
            label="Role"
            value={emp.job_title + (emp.department ? " · " + emp.department : "")}
          />
        )}
        <InfoRow label="Organization" value={orgName} />
      </div>

      {alreadyDone ? (
        <div className="space-y-4 min-w-0">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5">
            <div className="flex items-start gap-3 min-w-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-emerald-950 dark:text-emerald-200 text-[14px]">
                  Gmail connected
                </div>
                <div className="text-[12.5px] sm:text-[13px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 leading-relaxed break-words">
                  <span className="font-mono font-medium">{gmail.google_email}</span> is now linked
                  to <span className="font-mono font-medium">{emp?.professional_email}</span>. You
                  can now receive emails.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs min-w-0">
            <div className="p-4 sm:p-5 border-b border-line bg-surface-muted/40">
              <h3 className="font-semibold text-[13.5px] sm:text-[14px] text-ink flex items-center gap-1.5">
                <span>Final Step: Send as {emp?.professional_email}</span>
              </h3>
              <p className="text-[12px] sm:text-[12.5px] text-ink-3 mt-1 leading-relaxed">
                To send emails as your professional address, configure Gmail settings once (takes 45
                seconds):
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-[12.5px] sm:text-[13px] text-ink-2 min-w-0">
              <div className="space-y-3.5 min-w-0">
                <div className="flex gap-2.5 sm:gap-3 items-start min-w-0">
                  <span className="grid h-5 w-5 sm:h-6 sm:w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">
                    1
                  </span>
                  <div className="leading-relaxed min-w-0 flex-1">
                    Open your{" "}
                    <a
                      href="https://mail.google.com/mail/u/0/#settings/accounts"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary hover:underline inline-flex items-center gap-1 break-words"
                    >
                      Gmail Settings → Accounts and Import ↗
                    </a>
                  </div>
                </div>

                <div className="flex gap-2.5 sm:gap-3 items-start min-w-0">
                  <span className="grid h-5 w-5 sm:h-6 sm:w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">
                    2
                  </span>
                  <div className="leading-relaxed min-w-0 flex-1">
                    In the <strong>"Send mail as"</strong> section, click{" "}
                    <span className="text-primary font-medium">"Add another email address"</span>.
                  </div>
                </div>

                <div className="flex gap-2.5 sm:gap-3 items-start min-w-0">
                  <span className="grid h-5 w-5 sm:h-6 sm:w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">
                    3
                  </span>
                  <div className="leading-relaxed min-w-0 flex-1 w-full">
                    <p className="mb-2">
                      Enter your name, <strong>{emp?.professional_email}</strong>, and enter these
                      SMTP credentials:
                    </p>

                    <div className="rounded-lg border border-line bg-surface-muted/50 overflow-hidden min-w-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line border-b border-line">
                        <div className="p-2.5 px-3">
                          <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider font-medium">
                            SMTP Server
                          </span>
                          <span className="font-mono font-medium text-[12px] text-ink break-all">
                            smtp.resend.com
                          </span>
                        </div>
                        <div className="p-2.5 px-3">
                          <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider font-medium">
                            Port
                          </span>
                          <span className="font-mono font-medium text-[12px] text-ink">
                            465 (SSL)
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 px-3 border-b border-line">
                        <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider font-medium">
                          Username
                        </span>
                        <span className="font-mono font-medium text-[12px] text-ink">
                          resend
                        </span>
                      </div>
                      <div className="p-2.5 px-3">
                        <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider font-medium">
                          Password
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-medium text-[12px] text-ink truncate">
                            {smtpPassword || "(Ask your workspace admin)"}
                          </span>
                          {smtpPassword && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(smtpPassword);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="text-ink-3 hover:text-ink transition shrink-0"
                              title="Copy password"
                            >
                              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 text-[12px] flex items-start sm:items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">
                  We've also emailed these setup instructions to your Gmail inbox!
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-w-0">
          {/* Error returned from the Google callback redirect */}
          {search.error && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-[12.5px] sm:text-[13px] text-red-700 dark:text-red-400 min-w-0">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words leading-relaxed">{search.error}</span>
            </div>
          )}
          {connect.isError && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-[12.5px] sm:text-[13px] text-red-700 dark:text-red-400 min-w-0">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words leading-relaxed">
                {(connect.error as Error)?.message ?? "Something went wrong"}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => connect.mutate()}
            disabled={redirecting || connect.isPending || mockConnect.isPending}
            className="w-full h-11 rounded-lg bg-ink text-white text-[13.5px] sm:text-[14px] font-medium hover:bg-ink/90 disabled:opacity-60 inline-flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {redirecting || connect.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Redirecting to Google…</span>
              </>
            ) : (
              <>
                <GoogleGlyph />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {showSandbox && (
            <button
              type="button"
              onClick={() => mockConnect.mutate()}
              disabled={redirecting || connect.isPending || mockConnect.isPending}
              className="w-full mt-2.5 h-10 rounded-lg border border-primary/30 bg-primary/5 text-primary text-[12.5px] sm:text-[13px] font-medium hover:bg-primary/10 disabled:opacity-60 inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {mockConnect.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  <span>Connecting Sandbox…</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 shrink-0" />
                  <span>⚡ Instant Connect (QA & Sandbox Mode)</span>
                </>
              )}
            </button>
          )}

          <div className="mt-3.5 sm:mt-4 flex items-start gap-2 text-[11.5px] sm:text-[12px] text-ink-3 leading-relaxed">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5 text-ink-2" />
            <span>
              You will be taken to Google to sign in. Mailcoy never sees your Google password. You
              can disconnect at any time.
            </span>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh w-full max-w-full overflow-x-hidden flex flex-col items-center justify-center px-3.5 sm:px-4 py-8 sm:py-12 bg-background">
      <div className="w-full max-w-md min-w-0 mx-auto">{children}</div>
    </main>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-4 min-w-0 text-left">
      <div className="text-[11px] sm:text-[11.5px] uppercase tracking-wider text-ink-3 shrink-0">
        {label}
      </div>
      <div
        className={`text-[13px] sm:text-[13.5px] break-all sm:text-right min-w-0 ${mono ? "font-mono" : "font-medium text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 sm:p-6 text-center min-w-0">
      <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
      <p className="text-[14px] font-medium text-ink">Invitation unavailable</p>
      <p className="mt-1 text-[13px] text-ink-3 leading-relaxed break-words">{message}</p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.63 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.15.8 3.88 1.5l2.65-2.55C16.9 3.3 14.7 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 9.5-4.85 9.5-8.3 0-.55-.05-.98-.13-1.4H12z"
      />
    </svg>
  );
}
