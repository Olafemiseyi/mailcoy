import { Link, useRouter, Navigate } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./app/AppShell";
import { useEffect } from "react";

export function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global boundary caught error:", error);
  }, [error]);

  if (error?.message?.includes("NO_ORGANIZATION")) {
    return <Navigate to="/onboarding" replace />;
  }

  const isAuthError =
    error?.message?.toLowerCase().includes("unauthorized") ||
    error?.message?.toLowerCase().includes("authorization header") ||
    error?.message?.includes("JWT") ||
    error?.message?.includes("session") ||
    error?.message?.includes("auth");

  if (isAuthError) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/50">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-ink">Something went wrong</h2>
      <p className="mb-6 max-w-md text-[14px] text-ink-3">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
        <Link to="/dashboard">
          <Button variant="primary">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
