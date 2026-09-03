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
    let isMounted = true;

    async function handleVerify() {
      // 1. Check for token_hash in URL parameters (PKCE flow)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenHash = urlParams.get("token_hash");
      const type = urlParams.get("type");

      if (tokenHash && type) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });
          if (!error && isMounted) {
            setState("ok");
            const next = urlParams.get("next");
            if (next && next.startsWith("/") && !next.startsWith("//")) {
              window.location.href = next;
            }
            return;
          }
        } catch (e) {
          console.warn("OTP verification error:", e);
        }
      }

      // 2. Check existing session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user && isMounted) {
        setState("ok");
        const next = urlParams.get("next");
        if (next && next.startsWith("/") && !next.startsWith("//")) {
          window.location.href = next;
        }
        return;
      }

      // 3. Listen for auth state change from hash fragment parsing
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user && isMounted) {
          setState("ok");
          const next = urlParams.get("next");
          if (next && next.startsWith("/") && !next.startsWith("//")) {
            window.location.href = next;
          }
        }
      });

      // 4. Fallback timeout before marking as expired
      const timeout = setTimeout(async () => {
        const { data: checkUser } = await supabase.auth.getUser();
        if (isMounted) {
          if (checkUser.user) {
            setState("ok");
            const next = urlParams.get("next");
            if (next && next.startsWith("/") && !next.startsWith("//")) {
              window.location.href = next;
            }
          } else {
            setState("error");
          }
        }
      }, 3500);

      return () => {
        authListener?.subscription?.unsubscribe();
        clearTimeout(timeout);
      };
    }

    handleVerify();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <AuthShell title="Verifying…" subtitle="Confirming your email address. Just a moment.">
        <div className="h-1 w-full bg-line rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-primary animate-pulse" />
        </div>
      </AuthShell>
    );
  }
  if (state === "ok") {
    return (
      <AuthShell title="Email confirmed" subtitle="You're all set! Let's finish setting up your workspace.">
        <Link to="/onboarding"><PrimaryButton>Continue to onboarding</PrimaryButton></Link>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="Verification needed" subtitle="This verification link may have expired or was already used.">
      <div className="space-y-3">
        <Link to="/auth/login"><PrimaryButton>Sign in to your account</PrimaryButton></Link>
      </div>
    </AuthShell>
  );
}