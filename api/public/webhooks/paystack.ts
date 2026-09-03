// Public Paystack webhook for Vercel. Verifies HMAC-SHA512 with PAYSTACK_SECRET_KEY,
// then upserts subscription state.
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).send("Server not configured");

  const signature = req.headers["x-paystack-signature"] ?? "";
  
  // In Vercel Node.js Serverless, req.body is already parsed into an object or string depending on Content-Type.
  // We need the raw body for HMAC verification. If body-parser has already parsed it, we need to stringify it.
  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  
  const expected = createHmac("sha512", secret).update(raw).digest("hex");
  const a = Buffer.from(signature as string);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(401).send("Invalid signature");
  }

  let event: {
    event: string;
    data?: {
      reference?: string;
      subscription_code?: string;
      invoice_code?: string;
      status?: string;
      amount?: number;
      customer?: { email?: string };
      metadata?: Record<string, unknown>;
      plan?: { plan_code?: string };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return res.status(400).send("Bad JSON");
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).send("Supabase not configured");
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const meta = (event.data?.metadata ?? {}) as { organization_id?: string; plan_code?: string; billing_interval?: "monthly" | "yearly" };
  let orgId = meta.organization_id;
  const planCode = meta.plan_code ?? event.data?.plan?.plan_code ?? null;
  const reference = event.data?.reference ?? event.data?.subscription_code ?? event.data?.invoice_code ?? null;

  // If organization_id is missing (recurring renewal event), attempt lookup via subscription_code
  if (!orgId && event.data?.subscription_code) {
    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("organization_id, plan_code")
      .eq("provider_reference", event.data.subscription_code)
      .maybeSingle();
    if (existingSub) {
      orgId = (existingSub as any).organization_id;
    }
  }

  const isSuccess = event.event === "charge.success" || event.event === "subscription.create";

  // Always record raw delivery for audit.
  await supabaseAdmin.from("billing_events").insert({
    provider: "paystack",
    event_type: event.event,
    reference,
    payload: event as unknown as Record<string, unknown>,
    received_at: new Date().toISOString(),
    organization_id: orgId ?? null,
    status: isSuccess ? "success" : "received",
  } as never);

  if (!orgId || !reference) {
    return res.status(200).send("ok");
  }

  let status: string | null = null;
  switch (event.event) {
    case "charge.success":
    case "subscription.create":
      status = "active";
      break;
    case "invoice.payment_failed":
      status = "past_due";
      break;
    case "subscription.disable":
    case "subscription.not_renew":
      status = "canceled";
      break;
    default:
      status = null;
  }

  if (status) {
    const periodDays = meta.billing_interval === "yearly" ? 365 : 30;
    await supabaseAdmin.from("subscriptions").upsert(
      {
        organization_id: orgId,
        provider: "paystack",
        provider_reference: reference,
        plan: planCode ?? "Paystack",
        plan_code: planCode,
        status,
        amount_kobo: event.data?.amount ?? null,
        current_period_end: status === "active" ? new Date(Date.now() + periodDays * 24 * 3600 * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "provider_reference" },
    );
  }

  return res.status(200).send("ok");
}
