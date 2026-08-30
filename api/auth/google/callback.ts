// Native Vercel Serverless Function for Google OAuth2 Callback
// Handles https://www.mailcoy.com/api/auth/google/callback
import { createClient } from "@supabase/supabase-js";
import { createCipheriv, createHash, randomBytes } from "node:crypto";

function encryptToken(plaintext: string, secretRaw: string): string {
  const clean = typeof secretRaw === "string" ? secretRaw.trim().replace(/^["']|["']$/g, "") : "";
  if (!clean || clean.length < 32) {
    throw new Error("APP_USER_CONNECTION_KEY_SECRET is not configured or too short");
  }
  const key = createHash("sha256").update(clean, "utf8").digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ct]).toString("base64");
}

function buildInviteErrorUrl(origin: string, stateRaw: string | null, msg: string): string {
  if (!stateRaw) return `${origin}/?error=${encodeURIComponent(msg)}`;
  try {
    const s = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    const token = s?.token ?? "";
    if (token) return `${origin}/invite/${token}?error=${encodeURIComponent(msg)}`;
  } catch {
    // fallback
  }
  return `${origin}/?error=${encodeURIComponent(msg)}`;
}

export default async function handler(req: any, res: any) {
  const code = req.query.code as string | undefined;
  const stateRaw = req.query.state as string | undefined;
  const errorParam = req.query.error as string | undefined;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const origin = `${protocol}://${host}`;

  // 1. Check for user cancellation or errors
  if (errorParam) {
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Google sign-in was denied."));
    return res.status(302).send("");
  }

  if (!code || !stateRaw) {
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invalid callback parameters."));
    return res.status(302).send("");
  }

  // 2. Decode state to retrieve invite token
  let state: { token: string; nonce: string };
  try {
    state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    if (!state.token || !state.nonce) throw new Error("bad state");
  } catch {
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invalid state parameter."));
    return res.status(302).send("");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim().replace(/^["']|["']$/g, "");
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim().replace(/^["']|["']$/g, "");
  const cryptoSecret = process.env.APP_USER_CONNECTION_KEY_SECRET?.trim().replace(/^["']|["']$/g, "");
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!clientId || !clientSecret || !cryptoSecret || !supabaseUrl || !supabaseKey) {
    console.error("[GoogleCallback] Server missing configuration:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasCryptoSecret: !!cryptoSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
    });
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Server configuration error."));
    return res.status(302).send("");
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    // 3. Exchange OAuth code for tokens with Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("[GoogleCallback] Token exchange error:", errBody);
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Google authorization exchange failed."));
      return res.status(302).send("");
    }

    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      id_token?: string;
    };

    if (!tokenData.refresh_token) {
      console.warn("[GoogleCallback] No refresh token returned by Google.");
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Google did not return a refresh token. Please re-authorize with consent."));
      return res.status(302).send("");
    }

    // 4. Fetch Google profile email
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = profileRes.ok ? ((await profileRes.json()) as { email?: string }) : {};
    const googleEmail = profile.email || "";

    // 5. Query Supabase for invitation record
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: inv, error: invErr } = await supabaseAdmin
      .from("employee_invitations")
      .select("id, employee_id, organization_id, revoked_at, expires_at, accepted_at")
      .eq("token", state.token)
      .maybeSingle();

    if (invErr || !inv) {
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invitation record not found."));
      return res.status(302).send("");
    }

    if (inv.revoked_at || new Date(inv.expires_at) < new Date()) {
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invitation has expired or been revoked."));
      return res.status(302).send("");
    }

    // 6. Encrypt refresh token & store in app_user_connections
    const encryptedKey = encryptToken(tokenData.refresh_token, cryptoSecret);
    await supabaseAdmin.from("app_user_connections").upsert(
      {
        user_id: inv.employee_id,
        connector_id: "google_mail",
        connection_key_ciphertext: encryptedKey,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,connector_id" },
    );

    // 7. Upsert gmail_connections
    await supabaseAdmin.from("gmail_connections").upsert(
      {
        organization_id: inv.organization_id,
        employee_id: inv.employee_id,
        google_email: googleEmail,
        connected_at: new Date().toISOString(),
        health_status: "healthy",
        revoked_at: null,
      },
      { onConflict: "employee_id" },
    );

    // 8. Mark employee active & stamp connection time
    await supabaseAdmin
      .from("employees")
      .update({
        status: "active",
        connected_at: new Date().toISOString(),
        personal_gmail: googleEmail,
      } as never)
      .eq("id", inv.employee_id);

    // 9. Mark invitation accepted
    await supabaseAdmin
      .from("employee_invitations")
      .update({ accepted_at: new Date().toISOString() } as never)
      .eq("id", inv.id);

    // 10. Dispatch onboarding setup email to the employee
    if (resendApiKey && googleEmail) {
      try {
        const { data: orgRow } = await supabaseAdmin
          .from("organizations")
          .select("name")
          .eq("id", inv.organization_id)
          .maybeSingle();

        const { data: empRow } = await supabaseAdmin
          .from("employees")
          .select("professional_email, full_name")
          .eq("id", inv.employee_id)
          .maybeSingle();

        if (empRow?.professional_email) {
          const orgName = orgRow?.name || "Mailcoy Workspace";
          const firstName = empRow.full_name ? empRow.full_name.split(" ")[0] : "there";
          const subject = `⚡ Action Required: Finish setting up ${empRow.professional_email} in Gmail`;

          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Mailcoy Setup <router@mailcoy.com>",
              to: [googleEmail],
              subject,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
                  <h2>Welcome to your business address, ${firstName}!</h2>
                  <p>Your professional address <strong>${empRow.professional_email}</strong> is now connected to this Gmail inbox.</p>
                  <p>Inbound emails sent to <strong>${empRow.professional_email}</strong> will arrive directly in your inbox.</p>
                  <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <strong>Next Step:</strong> When composing in Gmail, tap the "From" line and select <strong>${empRow.professional_email}</strong> to send as your business address.
                  </div>
                </div>
              `,
            }),
          });
        }
      } catch (emailErr) {
        console.warn("[GoogleCallback] Could not send onboarding email:", emailErr);
      }
    }

    // 11. Success redirect to invite confirmation page
    res.setHeader("Location", `${origin}/invite/${state.token}`);
    return res.status(302).send("");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Authentication processing failed";
    console.error("[GoogleCallback] Fatal error:", err);
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, msg));
    return res.status(302).send("");
  }
}
