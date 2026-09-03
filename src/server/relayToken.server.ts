import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export interface RelayPayload {
  customerEmail: string;
  customerName?: string;
  employeePersonalEmail: string;
  employeeBusinessEmail: string;
  employeeName: string;
  organizationId?: string;
  originalSubject?: string;
  originalMessageId?: string;
  cc?: string[];
  ts: number;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

/**
 * Generates a clean, compact 16-char RFC-compliant token (e.g. rel_a1b2c3d4e5f6)
 * and stores the conversation routing metadata in Supabase.
 */
export async function generateRelayToken(payload: RelayPayload): Promise<string> {
  // 24 random bytes = 192 bits of entropy (well above OWASP 128-bit minimum)
  const token = `rel_${crypto.randomBytes(24).toString("hex")}`;
  const client = getSupabaseClient();

  if (client) {
    // Tokens expire after 72 hours to prevent indefinite replay
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
    try {
      await client.from("billing_events").insert({
        event_type: "relay.thread",
        provider: "mailcoy_relay",
        reference: token,
        payload: payload as any,
        status: "active",
        organization_id: payload.organizationId || null,
        expires_at: expiresAt,
      });
    } catch (e) {
      console.error("[Mailcoy Relay] Error saving relay token:", e);
    }
  }

  return token;
}

/**
 * Decodes and retrieves the conversation routing payload for a compact token.
 * Returns null if the token is not found or has expired.
 */
export async function decodeRelayToken(token: string): Promise<RelayPayload | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data } = await client
      .from("billing_events")
      .select("payload, expires_at")
      .eq("event_type", "relay.thread")
      .eq("reference", token)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return null;

    // Reject expired tokens
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.warn("[Mailcoy Relay] Token expired:", token.slice(0, 12) + "…");
      return null;
    }

    if (data?.payload) {
      return data.payload as unknown as RelayPayload;
    }
  } catch (err) {
    console.warn("[Mailcoy Relay] Error retrieving token from DB:", err);
  }

  return null;
}

/**
 * Sanitizes quoted text in replies by stripping or replacing internal relay addresses
 * with the clean customer identity so the customer never sees relay tokens.
 */
export function sanitizeQuotedText(
  content: string,
  token: string,
  customerEmail: string,
  customerName?: string,
  employeePersonalEmail?: string,
  employeeBusinessEmail?: string
): string {
  if (!content) return "";

  const tokenRegex = new RegExp(`reply\\+${token}@[a-zA-Z0-9.-]+`, "gi");
  const generalRelayRegex = /reply\+rel_[a-f0-9]+@[a-zA-Z0-9.-]+/gi;
  const routerRegex = /[a-zA-Z0-9._%+-]+ via Mailcoy <router@[a-zA-Z0-9.-]+>/gi;

  const cleanCustomer = customerName ? `${customerName} &lt;${customerEmail}&gt;` : customerEmail;
  const cleanCustomerText = customerName ? `${customerName} <${customerEmail}>` : customerEmail;

  let sanitized = content
    .replace(tokenRegex, cleanCustomerText)
    .replace(generalRelayRegex, cleanCustomerText)
    .replace(routerRegex, cleanCustomer);

  if (employeePersonalEmail && employeeBusinessEmail) {
    const personalEmailRegex = new RegExp(employeePersonalEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    sanitized = sanitized.replace(personalEmailRegex, employeeBusinessEmail);
  }

  return sanitized;
}
