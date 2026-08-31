import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, AuthField, PrimaryButton } from "@/components/auth/AuthShell";

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
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      const rawTarget = search.redirect || "/dashboard";
      const target =
        typeof rawTarget === "string" &&
        rawTarget.startsWith("/") &&
        !rawTarget.startsWith("//") &&
        !rawTarget.includes("/auth/login")
          ? rawTarget
          : "/dashboard";

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
      subtitle="Sign in to your Mailcoy workspace"
      footer={
        <>
          New here?{" "}
          <Link to="/auth/signup" className="text-ink underline underline-offset-2 font-medium">
            Create an account
          </Link>
        </>
      }
    >
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

        <PrimaryButton id="login-submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
