// Google OAuth2 callback handler.
// Google redirects here after the user grants consent on the Google consent screen.
// The "state" param encodes the invite token + a random nonce (base64 JSON).
// On success we exchange the code for tokens, store the refresh token, update the
// employee record, and redirect to the invite page so the user sees "Gmail connected".
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }: any) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const stateRaw = url.searchParams.get("state");
        const errorParam = url.searchParams.get("error");

        // Derive the redirect URI — must be identical to what was used when building the URL
        const redirectUri = `${url.origin}/api/auth/google/callback`;

        // User denied
        if (errorParam) {
          return new Response(null, {
            status: 302,
            headers: { Location: buildInviteErrorUrl(stateRaw, "Google sign-in was denied.") },
          });
        }

        if (!code || !stateRaw) {
          return new Response(null, {
            status: 302,
            headers: { Location: buildInviteErrorUrl(stateRaw, "Invalid callback parameters.") },
          });
        }

        let state: { token: string; nonce: string };
        try {
          state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
          if (!state.token || !state.nonce) throw new Error("bad");
        } catch {
          return new Response("Invalid state parameter", { status: 400 });
        }

        try {
          const { exchangeGoogleCode } = await import("@/server/googleOAuth.server");
          const { refreshToken, email } = await exchangeGoogleCode(code, redirectUri);

          // Persist the refresh token encrypted (keyed by employee_id = app-user-id)
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Resolve invite → employee_id
          const { data: inv, error: invErr } = await supabaseAdmin
            .from("employee_invitations")
            .select("id, employee_id, organization_id, revoked_at, expires_at, accepted_at")
            .eq("token", state.token)
            .maybeSingle();

          if (invErr || !inv) {
            return new Response(null, {
              status: 302,
              headers: { Location: buildInviteErrorUrl(stateRaw, "Invite not found.") },
            });
          }
          if (inv.revoked_at || new Date(inv.expires_at) < new Date()) {
            return new Response(null, {
              status: 302,
              headers: { Location: buildInviteErrorUrl(stateRaw, "Invite has expired or been revoked.") },
            });
          }

          // Encrypt + store refresh token (connector_id = "google_mail", user_id = employee_id)
          const { encryptConnectionKey } = await import("@/server/connectionKeyCrypto");
          const encrypted = encryptConnectionKey(refreshToken);
          await supabaseAdmin.from("app_user_connections").upsert(
            {
              user_id: inv.employee_id,
              connector_id: "google_mail",
              connection_key_ciphertext: encrypted,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,connector_id" },
          );

          // Upsert gmail_connections
          await supabaseAdmin.from("gmail_connections").upsert(
            {
              organization_id: inv.organization_id,
              employee_id: inv.employee_id,
              google_email: email,
              connected_at: new Date().toISOString(),
              health_status: "healthy",
              revoked_at: null,
            },
            { onConflict: "employee_id" },
          );

          // Mark employee active
          await supabaseAdmin
            .from("employees")
            .update({ status: "active", connected_at: new Date().toISOString() } as never)
            .eq("id", inv.employee_id);

          // Mark invite accepted
          await supabaseAdmin
            .from("employee_invitations")
            .update({ accepted_at: new Date().toISOString() } as never)
            .eq("id", inv.id);

          // ── Auto-configure Gmail Send As alias ──────────────────────────────
          // Best-effort: fetch the employee's professional email + name and silently
          // register it as a Gmail Send As alias. Google will email a one-click
          // verification link to the professional address (which MX-routes to their
          // Gmail inbox). Errors are swallowed — a Gmail API failure must never
          // break the connect flow.
          try {
            const { data: empRow } = await supabaseAdmin
              .from("employees")
              .select("professional_email, full_name")
              .eq("id", inv.employee_id)
              .maybeSingle();

            if (empRow?.professional_email) {
              const { addGmailSendAsAlias } = await import("@/server/googleOAuth.server");
              await addGmailSendAsAlias({
                refreshToken,
                sendAsEmail: empRow.professional_email,
                displayName: empRow.full_name ?? empRow.professional_email,
              });
            }
          } catch (aliasErr) {
            // Non-fatal — log but continue
            console.warn("[SendAs] Could not register alias:", aliasErr instanceof Error ? aliasErr.message : aliasErr);
          }
          // ────────────────────────────────────────────────────────────────────

          // Redirect back to invite page — it will see gmail is connected
          return new Response(null, {
            status: 302,
            headers: { Location: `/invite/${state.token}` },
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Authentication failed";
          return new Response(null, {
            status: 302,
            headers: { Location: buildInviteErrorUrl(stateRaw, msg) },
          });
        }
      },
    },
  },
  // No React component — this is a server-only API route
  component: () => null,
});

function buildInviteErrorUrl(stateRaw: string | null, msg: string): string {
  if (!stateRaw) return `/?error=${encodeURIComponent(msg)}`;
  try {
    const s = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    const token = s?.token ?? "";
    if (token) return `/invite/${token}?error=${encodeURIComponent(msg)}`;
  } catch { /* */ }
  return `/?error=${encodeURIComponent(msg)}`;
}
