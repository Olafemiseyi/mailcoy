import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, AuthField, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/auth/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Set new password — Mailcoy" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setCheckingSession(false);
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/auth/login" });
  }

  if (checkingSession) {
    return (
      <AuthShell title="Checking reset link…" subtitle="Verifying your password reset session.">
        <div className="h-1 w-full bg-line rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-primary animate-pulse" />
        </div>
      </AuthShell>
    );
  }

  if (!hasSession) {
    return (
      <AuthShell title="Invalid or expired link" subtitle="This password reset link is invalid or has already expired.">
        <div className="space-y-4">
          <p className="text-[13px] text-ink-3">
            Please request a new password reset link from the forgot password page.
          </p>
          <Link to="/auth/forgot-password">
            <PrimaryButton>Request new reset link</PrimaryButton>
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={onSubmit} className="space-y-3">
        <AuthField label="New password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        <AuthField label="Confirm password" type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {error && <p className="text-[13px] text-red-600">{error}</p>}
        <PrimaryButton type="submit" disabled={loading}>{loading ? "Updating…" : "Update password"}</PrimaryButton>
      </form>
    </AuthShell>
  );
}