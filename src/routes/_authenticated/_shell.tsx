import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { GlobalError } from "@/components/GlobalError";
import { Skeleton } from "@/components/Skeleton";
import { SupportChatWidget } from "@/components/SupportChatWidget";

export const Route = createFileRoute("/_authenticated/_shell")({
  ssr: false,
  errorComponent: GlobalError,
  pendingComponent: () => (
    <AppShell>
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </AppShell>
  ),
  component: () => (
    <AppShell>
      <Outlet />
      <SupportChatWidget />
    </AppShell>
  ),
});
