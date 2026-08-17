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
import { CheckCircle2, Mail, ShieldCheck, AlertTriangle, Loader2, Copy, Smartphone, Laptop, Check } from "lucide-react";

export const Route = createFileRoute("/invite/$token")({
  head: () => ({ meta: [{ title: "Connect Gmail — Mailcoy" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : undefined,
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
  const alreadyDone = !!gmail;

  return (
    <Shell>
      <div className="text-center mb-6">
        <div className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-ink text-white mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-semibold">Connect your Gmail</h1>
        <p className="mt-2 text-[13.5px] text-ink-3">
          {orgName} invited you to send business email from a professional address using your own Google account.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-white/60 dark:bg-white/[0.02] p-5 mb-5 space-y-3">
        <InfoRow label="You are" value={emp?.full_name ?? "—"} />
        <InfoRow label="Business email" value={emp?.professional_email ?? "—"} mono />
        {emp?.job_title && (
          <InfoRow label="Role" value={emp.job_title + (emp.department ? " · " + emp.department : "")} />
        )}
        <InfoRow label="Organization" value={orgName} />
      </div>

      {alreadyDone ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="font-medium">Gmail connected</div>
                <div className="text-[13px] text-ink-3 mt-0.5">
                  <span className="font-mono">{gmail.google_email}</span> is now linked to{" "}
                  {emp?.professional_email}. You can now receive emails.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white/60 dark:bg-white/[0.02] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-line bg-surface-muted/30">
              <h3 className="font-semibold text-[14px] flex items-center gap-2">
                Final Step: Send as {emp?.professional_email}
              </h3>
              <p className="text-[12.5px] text-ink-3 mt-1.5">
                To remove the "via gmail.com" warning so your emails look 100% professional to clients, configure your Gmail to send through our secure servers.
              </p>
            </div>
            
            {isMobile ? (
              <div className="p-5 text-center bg-orange-500/5 border-b border-line">
                <Smartphone className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-[13px] font-medium text-orange-700 dark:text-orange-400">Mobile Device Detected</p>
                <p className="text-[12.5px] text-orange-600/80 dark:text-orange-400/80 mt-1 mb-3">
                  Google does not allow changing these settings from a phone.
                </p>
                <button 
                  className="text-[13px] font-medium bg-white dark:bg-ink border border-line px-4 py-2 rounded-lg shadow-sm w-full"
                  onClick={() => alert("We will email you a reminder link to finish this on your computer!")}
                >
                  Email me these instructions
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-5 text-[13px] text-ink-2">
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">1</span>
                    <div className="leading-relaxed">
                      Open your{" "}
                      <a
                        href="https://mail.google.com/mail/u/0/#settings/accounts"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        Gmail Settings
                      </a>{" "}
                      (we'll open it in a new tab).
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">2</span>
                    <div className="leading-relaxed">
                      In the "Send mail as" section, find <strong>{emp?.professional_email}</strong> (we already added it for you!) and click <span className="text-amber-600 font-medium">edit info</span>.
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-0.5">3</span>
                    <div className="leading-relaxed w-full">
                      <p className="mb-2">Paste these exact credentials into the popup and click Save:</p>
                      
                      <div className="rounded-lg border border-line bg-surface-muted overflow-hidden">
                        <div className="grid grid-cols-2 text-[12px] divide-x divide-line border-b border-line">
                          <div className="p-2.5 px-3">
                            <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider">SMTP Server</span>
                            <span className="font-mono font-medium">smtp.resend.com</span>
                          </div>
                          <div className="p-2.5 px-3">
                            <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider">Port</span>
                            <span className="font-mono font-medium">465</span>
                          </div>
                        </div>
                        <div className="p-2.5 px-3 border-b border-line">
                          <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider">Username</span>
                          <span className="font-mono font-medium">resend</span>
                        </div>
                        <div className="p-2.5 px-3 bg-white dark:bg-ink flex items-center justify-between">
                          <div>
                            <span className="text-ink-3 block mb-0.5 text-[10px] uppercase tracking-wider">Password</span>
                            <span className="font-mono font-medium text-ink-3 italic">re_YourGeneratedKeyHere...</span>
                          </div>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("re_YourGeneratedKeyHere...");
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ink text-white text-[12px] font-medium hover:bg-ink/90 transition-colors"
                          >
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Error returned from the Google callback redirect */}
          {search.error && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{search.error}</span>
            </div>
          )}
          {connect.isError && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-700 dark:text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{(connect.error as Error)?.message ?? "Something went wrong"}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => connect.mutate()}
            disabled={redirecting || connect.isPending}
            className="w-full h-11 rounded-lg bg-ink text-white text-[14px] font-medium hover:bg-ink/90 disabled:opacity-60 inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {redirecting || connect.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Google…</>
            ) : (
              <><GoogleGlyph /> Continue with Google</>
            )}
          </button>
          <div className="mt-4 flex items-start gap-2 text-[12px] text-ink-3">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>
              You will be taken to Google to sign in. Mailcoy never sees your Google password. You can
              disconnect at any time.
            </span>
          </div>
        </>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh grid place-items-center px-4 py-10 bg-background">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-[11.5px] uppercase tracking-wider text-ink-3">{label}</div>
      <div className={`text-[13.5px] truncate ${mono ? "font-mono" : "font-medium"}`}>{value}</div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
      <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
      <p className="text-[14px] font-medium">Invitation unavailable</p>
      <p className="mt-1 text-[13px] text-ink-3">{message}</p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.63 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.15.8 3.88 1.5l2.65-2.55C16.9 3.3 14.7 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 9.5-4.85 9.5-8.3 0-.55-.05-.98-.13-1.4H12z"
      />
    </svg>
  );
}
