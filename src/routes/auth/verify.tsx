import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/auth/verify")({
  ssr: false,
  head: () => ({ meta: [{ title: "Verifying email — Mailcoy" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setState(data.user ? "ok" : "error"));
  }, []);

  if (state === "loading") {
    return <AuthShell title="Verifying…" subtitle="Just a moment."><div className="h-1 w-full bg-line rounded-full overflow-hidden"><div className="h-full w-1/2 bg-primary animate-pulse" /></div></AuthShell>;
  }
  if (state === "ok") {
    return (
      <AuthShell title="Email confirmed" subtitle="You're all set. Let's finish setting up your workspace.">
        <Link to="/dashboard"><PrimaryButton>Continue</PrimaryButton></Link>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="Link expired" subtitle="This verification link is no longer valid.">
      <Link to="/auth/login"><PrimaryButton>Back to sign in</PrimaryButton></Link>
    </AuthShell>
  );
}