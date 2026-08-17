// Resend Delivery & Verification Engine
// Provides zero-friction email dispatch with Resend's free tier.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireOrgContext, assertAdmin } from "@/server/orgContext.server";

export const sendEmailViaResend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({
      to: z.string().email(),
      from: z.string(),
      subject: z.string(),
      html: z.string(),
      replyTo: z.string().email().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const ctx = await requireOrgContext(context.supabase, context.userId);
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set in environment. Falling back to simulated dispatch.");
      return {
        id: `sim_${Date.now()}`,
        status: "sent_simulated",
        to: data.to,
        from: data.from,
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: data.from,
        to: [data.to],
        subject: data.subject,
        html: data.html,
        reply_to: data.replyTo,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend send failed: ${errorText}`);
    }

    const result = await response.json();

    // Log the message into email_logs
    try {
      await context.supabase.from("email_logs").insert({
        organization_id: ctx.organizationId,
        direction: "out",
        from_addr: data.from,
        to_addr: data.to,
        subject: data.subject,
        status: "sent",
        provider: "resend",
        provider_message_id: result.id,
      } as never);
    } catch {
      // non-blocking
    }

    return result;
  });
