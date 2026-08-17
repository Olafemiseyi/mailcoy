import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AuthShell,
  AuthField,
  PrimaryButton,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Mailcoy" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password",
    });
    setLoading(false);
    if (error) return setError(error.message);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`If an account exists for ${email}, we sent a reset link.`}
      >
        <Link
          to="/auth/login"
          className="text-[13px] text-ink underline underline-offset-2 font-medium"
        >
          ← Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link
          to="/auth/login"
          className="text-ink underline underline-offset-2 font-medium"
        >
          ← Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" id="forgot-form">
        <AuthField
          id="forgot-email"
          label="Work email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-[13px] text-danger"
          >
            {error}
          </p>
        )}

        <PrimaryButton id="forgot-submit" type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}