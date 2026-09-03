import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, AuthField, PrimaryButton } from "@/components/auth/AuthShell";
import { startGoogleLogin } from "@/lib/invitations.functions";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Mailcoy" },
      {
        name: "description",
        content: "Sign in to manage your company email domains, aliases, team members, and signatures on Mailcoy.",
      },
      { property: "og:title", content: "Sign In — Mailcoy" },
      {
        property: "og:description",
        content: "Manage your business email routing, DNS authentication, and Gmail integration.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  component: LoginPage,
});

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
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
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const googleLoginFn = useServerFn(startGoogleLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(search.error || null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onGoogleLogin(isMock = false) {
    setError(null);
    setGoogleLoading(true);
    try {
      const rawTarget = search.redirect || "/compose";
      const target =
        typeof rawTarget === "string" &&
        rawTarget.startsWith("/") &&
        !rawTarget.startsWith("//") &&
        !rawTarget.includes("/auth/login")
          ? rawTarget
          : "/compose";

      const res = await googleLoginFn({
        data: {
          redirectOrigin: window.location.origin,
          targetUrl: target,
          mock: isMock,
        },
      });

      if (res?.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google sign in.");
      setGoogleLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(cleanEmail)) {
      setError("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (authErr) throw authErr;

      const rawTarget = search.redirect;
      const isAllowedAdminTarget =
        rawTarget &&
        typeof rawTarget === "string" &&
        rawTarget.startsWith("/") &&
        !rawTarget.startsWith("//") &&
        !rawTarget.includes("/auth/login") &&
        rawTarget !== "/compose";

      const target = isAllowedAdminTarget ? rawTarget : "/dashboard";
      navigate({ to: target as any });
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Mailcoy workspace or employee mailbox"
      footer={
        <>
          New here?{" "}
          <Link to="/auth/signup" className="text-ink underline underline-offset-2 font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-3">
        {/* 1-Click Google Sign In for Mailcoy Compose */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onGoogleLogin(false)}
            disabled={googleLoading || loading}
            className="w-full h-11 rounded-xl border border-line bg-surface hover:bg-surface-muted text-ink font-semibold text-[13.5px] flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <GoogleGlyph />
            <span>{googleLoading ? "Connecting with Google…" : "Sign in with Google (Mailcoy Compose)"}</span>
          </button>
          <p className="text-[11.5px] text-ink-4 text-center">
            For employees and team members using Mailcoy Compose
          </p>
        </div>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-line w-full" />
          <span className="bg-surface px-3 text-[11px] uppercase tracking-wider text-ink-4 font-medium shrink-0">
            or sign in with password
          </span>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" id="login-form">
          <AuthField
            id="login-email"
            label="Work email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
          <AuthField
            id="login-password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <div className="flex justify-end">
            <Link
              to="/auth/forgot-password"
              className="text-[12.5px] text-ink-3 hover:text-ink transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger"
            >
              {error}
            </p>
          )}

          <PrimaryButton id="login-submit" type="submit" disabled={loading || googleLoading}>
            {loading ? "Signing in…" : "Sign in"}
          </PrimaryButton>
        </form>
      </div>
    </AuthShell>
  );
}
