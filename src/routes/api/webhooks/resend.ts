import { createFileRoute } from "@tanstack/react-router";
import { Route as PublicResendRoute } from "../public/webhooks/resend";

export const Route = createFileRoute("/api/webhooks/resend")({
  server: {
    handlers: {
      POST: async (ctx: any) => {
        // Forward directly to the public resend handler
        const handler = PublicResendRoute.options.server?.handlers?.POST;
        if (typeof handler === "function") {
          return await handler(ctx);
        }
        return new Response("OK", { status: 200 });
      },
    },
  },
});
