import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Bypass actual Supabase auth since the remote project is dead/unreachable
    // const { data, error } = await supabase.auth.getUser();
    // if (error || !data.user) throw redirect({ to: "/auth/login" });
    const user = { id: "mock-user-123", email: "demo@mailcoy.com" };
    return { user };
  },
  component: () => <Outlet />,
});