/**
 * errors.ts — Centralised error translation for Mailcoy.
 *
 * All server functions throw raw Supabase/Postgres errors. This module
 * converts them into plain, user-facing messages before they reach the UI.
 *
 * Usage (server function):
 *   import { toAppError } from "@/lib/errors";
 *   if (error) throw new Error(toAppError(error));
 *
 * Usage (client catch block):
 *   import { friendlyError } from "@/lib/errors";
 *   setErr(friendlyError(e, "Failed to save"));
 */

type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

/**
 * Maps Postgres error codes + constraint names to friendly messages.
 * Called on the SERVER so the translated message travels over the wire.
 */
export function toAppError(err: SupabaseError | Error | unknown, fallback = "Something went wrong. Please try again."): string {
  if (!err) return fallback;

  const e = err as SupabaseError & Error;
  const code = e.code ?? "";
  const msg = (e.message ?? "").toLowerCase();
  const details = (e.details ?? "").toLowerCase();

  // ── Postgres constraint codes ───────────────────────────────────────────
  if (code === "23505") {
    // Unique violation — inspect constraint name from message
    if (msg.includes("domain_name") || msg.includes("domains_organization"))
      return "This domain is already added to your workspace.";
    if (msg.includes("professional_email") || msg.includes("employees_"))
      return "An employee with this email address already exists.";
    if (msg.includes("aliases") || msg.includes("address"))
      return "This email alias already exists.";
    if (msg.includes("api_keys") || msg.includes("api_key"))
      return "An API key with this name already exists.";
    if (msg.includes("organizations") || msg.includes("org"))
      return "An organisation with this name already exists.";
    if (msg.includes("email") || msg.includes("users"))
      return "An account with this email already exists.";
    return "This item already exists. Please use a different value.";
  }

  if (code === "23502") {
    // Not-null violation
    if (msg.includes("spf_value") || msg.includes("dkim_value") || msg.includes("txt_record"))
      return "Domain DNS records could not be generated. Please try again.";
    if (msg.includes("domain_name"))
      return "Please enter a valid domain name.";
    if (msg.includes("full_name") || msg.includes("professional_email"))
      return "Please fill in all required fields before saving.";
    return "A required field is missing. Please check your input and try again.";
  }

  if (code === "23503") {
    // Foreign-key violation
    if (msg.includes("domain"))
      return "The selected domain no longer exists. Please refresh and try again.";
    if (msg.includes("employee") || msg.includes("employees"))
      return "The selected employee no longer exists. Please refresh and try again.";
    return "A related record was not found. Please refresh and try again.";
  }

  if (code === "23514") {
    // Check constraint
    return "The value you entered is not allowed. Please check the field and try again.";
  }

  if (code === "42501" || code === "42503") {
    return "You don't have permission to do this. Contact your workspace admin.";
  }

  if (code === "PGRST116") {
    return "Record not found. It may have been deleted.";
  }

  if (code === "PGRST301" || msg.includes("jwt") || msg.includes("unauthorized")) {
    return "Your session has expired. Please sign in again.";
  }

  // ── Network / fetch errors ──────────────────────────────────────────────
  if (msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("network request failed")) {
    return "Network error — please check your internet connection and try again.";
  }

  if (msg.includes("timeout") || msg.includes("timed out")) {
    return "The request timed out. Please try again.";
  }

  // ── Auth errors ─────────────────────────────────────────────────────────
  if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please verify your email address before signing in.";
  }
  if (msg.includes("user already registered") || (msg.includes("user") && msg.includes("already exists"))) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (msg.includes("password") && (msg.includes("short") || msg.includes("weak") || msg.includes("characters"))) {
    return "Password must be at least 8 characters long.";
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  // ── Validation ──────────────────────────────────────────────────────────
  if (msg.includes("invalid domain")) {
    return "Please enter a valid domain name (e.g. company.com).";
  }

  // Return the raw message if it looks human-readable (no code, short, no "constraint")
  if (!code && e.message && e.message.length < 120 && !e.message.includes("constraint") && !e.message.includes("violates")) {
    return e.message;
  }

  return fallback;
}

/**
 * Client-side helper — safely extracts a friendly string from any thrown value.
 * Use in catch blocks: setErr(friendlyError(e, "Failed to save changes"))
 */
export function friendlyError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!err) return fallback;
  if (typeof err === "string") return toAppError({ message: err }, fallback);
  return toAppError(err, fallback);
}
