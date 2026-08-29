import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AuthShell,
  AuthField,
  PrimaryButton,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account — Mailcoy" },
      {
        name: "description",
        content: "Get started with Mailcoy and connect your custom domain to Gmail in under 5 minutes.",
      },
      { property: "og:title", content: "Sign Up — Mailcoy" },
      {
        property: "og:description",
        content: "Professional business email on your domain via Gmail. Zero per-seat markup.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mailcoy.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mailcoy.com/og-image.jpg" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/verify",
          data: { name: cleanName, full_name: cleanName },
        },
      });
      setLoading(false);
      if (error) {
        if (error.message === "Failed to fetch" || error.message.includes("network") || error.message.includes("fetch")) {
          return setError("Unable to reach authentication server. Please check your internet connection and try again.");
        }
        return setError(error.message);
      }
      if (data?.session) {
        navigate({ to: "/onboarding" });
      } else if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
        setError("An account with this email address already exists. Please sign in or reset your password.");
      } else {
        setSent(true);
      }
    } catch {
      setLoading(false);
      setError("Network error. Please check your internet connection.");
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle={`We sent a verification link to ${email}.`}
      >
        <div className="space-y-4">
          <p className="text-[13px] text-ink-3 leading-relaxed">
            Click the link in the email to activate your account, then sign in.
          </p>
          <PrimaryButton onClick={() => navigate({ to: "/auth/login" })}>
            Back to sign in
          </PrimaryButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Start sending professional email in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-ink underline underline-offset-2 font-medium"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" id="signup-form">
        <AuthField
          id="signup-name"
          label="Full name"
          required
          autoComplete="name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthField
          id="signup-email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="signup-password"
          label="Password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          hint="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthField
          id="signup-confirm-password"
          label="Confirm password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger font-medium"
          >
            {error}
          </p>
        )}

        <PrimaryButton id="signup-submit" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </PrimaryButton>

        <p className="text-[11.5px] text-ink-3 text-center">
          By continuing you agree to our{" "}
          <Link to="/terms" target="_blank" className="underline hover:text-ink transition-colors font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" target="_blank" className="underline hover:text-ink transition-colors font-medium">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}