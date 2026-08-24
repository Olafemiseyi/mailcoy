import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }: { location: { href: string } }) => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        throw redirect({
          to: "/auth/login",
          search: { redirect: location.href },
        });
      }
      return { user: data.session.user };
    } catch (err: any) {
      if (err?.to) throw err; // Re-throw TanStack redirect
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});
