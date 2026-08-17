import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPlatformAdminStatus } from "@/lib/admin.functions";
import { AuthShell, AuthField, PrimaryButton } from "@/components/auth/AuthShell";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in — Mailcoy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      setLoading(false);
      return setError(signInErr.message);
    }
    // Verify platform admin
    try {
      const status = await getPlatformAdminStatus();
      if (!status.isPlatformAdmin) {
        await supabase.auth.signOut();
        setLoading(false);
        return setError("This account does not have platform admin access.");
      }
      navigate({ to: "/admin" });
    } catch {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Unable to verify admin access.");
    }
  }

  return (
    <AuthShell
      title="Platform admin"
      subtitle="Restricted access — super admins only"
      footer={<Link to="/auth/login" className="text-ink-3 hover:text-ink">← Back to user sign in</Link>}
    >
      <div className="mb-5 flex items-center gap-2 rounded-md border border-line bg-ink/[0.02] px-3 py-2 text-[12.5px] text-ink-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Isolated from customer sign-in.
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <AuthField
          label="Admin email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@mailcoy.com"
          autoComplete="username"
        />
        <AuthField
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <p className="text-[13px] text-red-600">{error}</p>}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in to admin"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
