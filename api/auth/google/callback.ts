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
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  <!-- Header -->
                  <div style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; color: #0f172a;">Mailcoy</h1>
                  </div>
                  
                  <!-- Body -->
                  <div style="padding: 32px;">
                    <h2 style="margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: 600; color: #0f172a;">Welcome to your business address, ${firstName}!</h2>
                    
                    <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #475569;">
                      Your professional address <strong style="color: #0f172a;">${empRow.professional_email}</strong> is now securely connected to this Gmail inbox.
                    </p>
                    
                    <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
                      Inbound emails sent to your business address will arrive directly in your inbox. To reply or send new messages from this address, you need to configure your Gmail "Send-as" settings.
                    </p>
                    
                    <!-- Setup Box -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                      <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <div style="background-color: #0f172a; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 12px;">1</div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #0f172a;">Open Gmail Settings</h3>
                      </div>
                      <p style="margin: 0 0 24px 36px; font-size: 14px; color: #475569;">Go to <strong>Settings (⚙️)</strong> → <strong>See all settings</strong> → <strong>Accounts and Import</strong>.</p>
                      
                      <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <div style="background-color: #0f172a; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 12px;">2</div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #0f172a;">Add your address</h3>
                      </div>
                      <p style="margin: 0 0 24px 36px; font-size: 14px; color: #475569;">In the "Send mail as" section, click <strong>"Add another email address"</strong>. Enter your name and <strong>${empRow.professional_email}</strong>.</p>
                      
                      <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <div style="background-color: #0f172a; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 12px;">3</div>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #0f172a;">Enter SMTP Credentials</h3>
                      </div>
                      <p style="margin: 0 0 12px 36px; font-size: 14px; color: #475569;">When prompted, enter the following secure routing details:</p>
                      
                      <div style="margin-left: 36px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 100px;">SMTP Server</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #0f172a; font-weight: 600;">smtp.resend.com</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Port</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #0f172a; font-weight: 600;">465 (SSL)</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Username</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-family: monospace; color: #0f172a; font-weight: 600;">resend</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; color: #64748b;">Password</td>
                            <td style="padding: 12px 16px; font-family: monospace; color: #0f172a; font-weight: 600; word-break: break-all;">${resendApiKey}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Footer -->
                  <div style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      Secured by Mailcoy • Modern email routing
                    </p>
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
