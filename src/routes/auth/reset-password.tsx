import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/auth/login" });
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