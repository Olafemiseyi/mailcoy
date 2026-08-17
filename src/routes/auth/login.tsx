import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AuthShell,
  AuthField,
  PrimaryButton,
  Divider,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — Mailcoy" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Bypass actual Supabase auth since the remote project is dead/unreachable
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/dashboard" });
    }, 500);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Mailcoy workspace"
      footer={
        <>
          New here?{" "}
          <Link
            to="/auth/signup"
            className="text-ink underline underline-offset-2 font-medium"
          >
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
          placeholder="........"
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

        <PrimaryButton
          id="login-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}