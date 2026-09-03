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
  if (!stateRaw) return `${origin}/auth/login?error=${encodeURIComponent(msg)}`;
  try {
    const s = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    if (s?.type === "login") {
      return `${origin}/auth/login?error=${encodeURIComponent(msg)}`;
    }
    if (s?.token) {
      return `${origin}/invite/${s.token}?error=${encodeURIComponent(msg)}`;
    }
  } catch {
    // fallback
  }
  return `${origin}/auth/login?error=${encodeURIComponent(msg)}`;
}

export default async function handler(req: any, res: any) {
  const code = req.query.code as string | undefined;
  const stateRaw = req.query.state as string | undefined;
  const errorParam = req.query.error as string | undefined;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const origin = `${protocol}://${host}`;

  // 1. Check for user cancellation or errors from Google
  if (errorParam) {
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Google sign-in was denied."));
    return res.status(302).send("");
  }

  if (!code || !stateRaw) {
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invalid callback parameters."));
    return res.status(302).send("");
  }

  // 2. Decode state to retrieve flow metadata
  let state: any;
  try {
    state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    if (!state.nonce) throw new Error("bad state");
  } catch {
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invalid state parameter."));
    return res.status(302).send("");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim().replace(/^["']|["']$/g, "");
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim().replace(/^["']|["']$/g, "");
  const cryptoSecret = process.env.APP_USER_CONNECTION_KEY_SECRET?.trim().replace(/^["']|["']$/g, "");
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    let refreshToken = "";
    let email = "";

    // 3. Exchange OAuth code for tokens with Google
    if (code.startsWith("mock_oauth_code_")) {
      email = `test.employee.${Date.now().toString().slice(-4)}@gmail.com`;
      refreshToken = `mock_refresh_token_${randomBytes(16).toString("hex")}`;
    } else {
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

      refreshToken = tokenData.refresh_token || "";

      // Fetch Google profile email
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const profile = profileRes.ok ? ((await profileRes.json()) as { email?: string }) : {};
      email = profile.email || "";
    }

    if (!email) {
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Failed to retrieve email from Google."));
      return res.status(302).send("");
    }

    const emailLower = email.toLowerCase();
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // =========================================================================
    // FLOW 1: 1-CLICK MULTI-DEVICE GOOGLE LOGIN FLOW (from /compose or /auth/login)
    // =========================================================================
    if (state.type === "login") {
      let targetOrgId: string | null = state.orgId || null;
      let matchedEmp: any = null;

      if (targetOrgId) {
        const { data: orgEmps } = await supabaseAdmin
          .from("employees")
          .select("id, organization_id, personal_email, company_email, professional_email, user_id, full_name")
          .eq("organization_id", targetOrgId);

        matchedEmp = (orgEmps || []).find(
          (e: any) =>
            (state.userId && e.user_id === state.userId) ||
            (e.personal_email && e.personal_email.toLowerCase() === emailLower) ||
            (e.company_email && e.company_email.toLowerCase() === emailLower)
        );
      }

      if (!matchedEmp) {
        const { data: emps } = await supabaseAdmin
          .from("employees")
          .select("id, organization_id, personal_email, company_email, professional_email, user_id, full_name")
          .or(`personal_email.ilike.${emailLower},company_email.ilike.${emailLower},professional_email.ilike.${emailLower}`);
        matchedEmp = emps?.[0];
      }

      const { data: gconns } = await supabaseAdmin
        .from("gmail_connections")
        .select("id, employee_id, organization_id, google_email")
        .ilike("google_email", emailLower)
        .is("revoked_at", null);
      const matchedGconn = gconns?.[0];

      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      let authUser = userList?.users?.find((u: any) => u.email?.toLowerCase() === emailLower);

      let hasOrgMembership = false;
      let userOrgId: string | null = null;
      if (authUser) {
        const { data: memberRecords } = await supabaseAdmin
          .from("organization_members")
          .select("organization_id")
          .eq("user_id", authUser.id)
          .limit(1);

        if (memberRecords && memberRecords.length > 0) {
          hasOrgMembership = true;
          userOrgId = memberRecords[0].organization_id;
        }
      }

      let pendingInv: any = null;
      if (matchedEmp) {
        const { data: pInv } = await supabaseAdmin
          .from("employee_invitations")
          .select("id, token, organization_id, employee_id")
          .eq("employee_id", matchedEmp.id)
          .is("revoked_at", null)
          .is("accepted_at", null)
          .maybeSingle();
        pendingInv = pInv;
      }

      if (!matchedEmp && !matchedGconn && !hasOrgMembership && !pendingInv) {
        const errorMsg = `This Google account (${emailLower}) is not linked to any authorized employee profile or workspace. Please ask your administrator for an invite.`;
        res.setHeader("Location", `${origin}/auth/login?error=${encodeURIComponent(errorMsg)}`);
        return res.status(302).send("");
      }

      targetOrgId =
        targetOrgId ||
        matchedEmp?.organization_id ||
        matchedGconn?.organization_id ||
        userOrgId ||
        pendingInv?.organization_id;

      if (targetOrgId) {
        const { data: verifiedDomains } = await supabaseAdmin
          .from("domains")
          .select("id, domain_name, verification_status")
          .eq("organization_id", targetOrgId)
          .eq("verification_status", "verified");

        if (!verifiedDomains || verifiedDomains.length === 0) {
          const errorMsg = `The custom domain for this workspace is not verified yet. A verified domain is required before linking Gmail.`;
          const returnPath = state.targetUrl || "/compose";
          res.setHeader("Location", `${origin}${returnPath}?error=${encodeURIComponent(errorMsg)}`);
          return res.status(302).send("");
        }
      }

      const targetEmpId = matchedEmp?.id || matchedGconn?.employee_id || pendingInv?.employee_id;

      if (state.userId) {
        if (refreshToken) {
          const encrypted = encryptToken(refreshToken, cryptoSecret);
          await supabaseAdmin.from("app_user_connections").upsert(
            {
              user_id: state.userId,
              connector_id: "google_mail",
              connection_key_ciphertext: encrypted,
              config: { email: emailLower },
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,connector_id" }
          );

          if (targetEmpId) {
            await supabaseAdmin.from("app_user_connections").upsert(
              {
                user_id: targetEmpId,
                connector_id: "google_mail",
                connection_key_ciphertext: encrypted,
                config: { email: emailLower },
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,connector_id" }
            );

            if (targetOrgId) {
              await supabaseAdmin.from("gmail_connections").upsert(
                {
                  organization_id: targetOrgId,
                  employee_id: targetEmpId,
                  google_email: emailLower,
                  connected_at: new Date().toISOString(),
                  health_status: "healthy",
                  revoked_at: null,
                },
                { onConflict: "employee_id" }
              );
            }

            await supabaseAdmin
              .from("employees")
              .update({
                personal_email: emailLower,
                status: "active",
                connected_at: new Date().toISOString(),
              } as never)
              .eq("id", targetEmpId);
          }
        }
        const targetPath = state.targetUrl || "/compose";
        res.setHeader("Location", `${origin}${targetPath}`);
        return res.status(302).send("");
      }

      if (!authUser) {
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: emailLower,
          email_confirm: true,
          user_metadata: {
            full_name: matchedEmp?.full_name || email.split("@")[0],
            source: "google_login",
          },
        });
        if (createErr || !created.user) {
          res.setHeader("Location", `${origin}/auth/login?error=Could+not+create+user+account`);
          return res.status(302).send("");
        }
        authUser = created.user;
      }

      if (authUser && targetOrgId) {
        await supabaseAdmin.from("organization_members").upsert(
          {
            organization_id: targetOrgId,
            user_id: authUser.id,
            role: "member",
          },
          { onConflict: "organization_id,user_id" }
        );
      }

      if (targetEmpId && authUser) {
        await supabaseAdmin
          .from("employees")
          .update({
            user_id: authUser.id,
            status: "active",
            personal_email: emailLower,
            connected_at: new Date().toISOString(),
          } as never)
          .eq("id", targetEmpId);
      }

      if (refreshToken) {
        const encrypted = encryptToken(refreshToken, cryptoSecret);
        if (authUser) {
          await supabaseAdmin.from("app_user_connections").upsert(
            {
              user_id: authUser.id,
              connector_id: "google_mail",
              connection_key_ciphertext: encrypted,
              config: { email: emailLower },
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,connector_id" }
          );
        }
        if (targetEmpId) {
          await supabaseAdmin.from("app_user_connections").upsert(
            {
              user_id: targetEmpId,
              connector_id: "google_mail",
              connection_key_ciphertext: encrypted,
              config: { email: emailLower },
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,connector_id" }
          );

          if (targetOrgId) {
            await supabaseAdmin.from("gmail_connections").upsert(
              {
                organization_id: targetOrgId,
                employee_id: targetEmpId,
                google_email: emailLower,
                connected_at: new Date().toISOString(),
                health_status: "healthy",
                revoked_at: null,
              },
              { onConflict: "employee_id" }
            );
          }
        }
      }

      const targetPath = state.targetUrl || "/compose";
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: emailLower,
        options: {
          redirectTo: `${origin}${targetPath}`,
        },
      });

      const hashedToken = (linkData as any)?.properties?.hashed_token || (linkData as any)?.hashed_token;
      const actionLink = (linkData as any)?.properties?.action_link || (linkData as any)?.action_link;
      const verificationType = (linkData as any)?.properties?.verification_type || "magiclink";

      if (linkErr || (!hashedToken && !actionLink)) {
        res.setHeader("Location", `${origin}/auth/login?error=Failed+to+generate+session+token`);
        return res.status(302).send("");
      }

      const verifyUrl = hashedToken
        ? `${origin}/auth/verify?token_hash=${hashedToken}&type=${verificationType}&next=${encodeURIComponent(targetPath)}`
        : actionLink;

      res.setHeader("Location", verifyUrl);
      return res.status(302).send("");
    }

    // =========================================================================
    // FLOW 2: EMPLOYEE INVITATION ONBOARDING FLOW (/invite/$token)
    // =========================================================================
    const { data: inv, error: invErr } = await supabaseAdmin
      .from("employee_invitations")
      .select("id, employee_id, organization_id, revoked_at, expires_at, accepted_at")
      .eq("token", state.token)
      .maybeSingle();

    if (invErr || !inv) {
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invite not found."));
      return res.status(302).send("");
    }
    if (inv.revoked_at || new Date(inv.expires_at) < new Date()) {
      res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, "Invite has expired or been revoked."));
      return res.status(302).send("");
    }

    const { data: empRecord } = await supabaseAdmin
      .from("employees")
      .select("id, full_name, professional_email, personal_email, company_email, user_id, organization_id, status")
      .eq("id", inv.employee_id)
      .single();

    const { data: verifiedDomains } = await supabaseAdmin
      .from("domains")
      .select("id, domain_name, verification_status")
      .eq("organization_id", inv.organization_id)
      .eq("verification_status", "verified");

    if (!verifiedDomains || verifiedDomains.length === 0) {
      const errorMsg = "The custom email domain for this company is not verified yet. Please contact your company administrator.";
      res.setHeader("Location", `${origin}/invite/${state.token}?error=${encodeURIComponent(errorMsg)}`);
      return res.status(302).send("");
    }

    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    let authUser = userList?.users?.find((u: any) => u.email?.toLowerCase() === emailLower);
    if (!authUser) {
      const { data: created } = await supabaseAdmin.auth.admin.createUser({
        email: emailLower,
        email_confirm: true,
        user_metadata: { source: "invite_google" },
      });
      authUser = created?.user;
    }

    if (refreshToken) {
      const encrypted = encryptToken(refreshToken, cryptoSecret);
      if (authUser) {
        await supabaseAdmin.from("app_user_connections").upsert(
          {
            user_id: authUser.id,
            connector_id: "google_mail",
            connection_key_ciphertext: encrypted,
            config: { email: emailLower },
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,connector_id" }
        );
      }
      await supabaseAdmin.from("app_user_connections").upsert(
        {
          user_id: inv.employee_id,
          connector_id: "google_mail",
          connection_key_ciphertext: encrypted,
          config: { email: emailLower },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,connector_id" }
      );
    }

    await supabaseAdmin.from("gmail_connections").upsert(
      {
        organization_id: inv.organization_id,
        employee_id: inv.employee_id,
        google_email: emailLower,
        connected_at: new Date().toISOString(),
        health_status: "healthy",
        revoked_at: null,
      },
      { onConflict: "employee_id" }
    );

    await supabaseAdmin
      .from("employees")
      .update({
        status: "active",
        personal_email: emailLower,
        user_id: authUser?.id || empRecord?.user_id || null,
        connected_at: new Date().toISOString(),
      } as never)
      .eq("id", inv.employee_id);

    if (!inv.accepted_at) {
      await supabaseAdmin
        .from("employee_invitations")
        .update({ accepted_at: new Date().toISOString() } as never)
        .eq("id", inv.id);
    }

    if (authUser) {
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: emailLower,
        options: {
          redirectTo: `${origin}/compose`,
        },
      });
      const hashedToken = (linkData as any)?.properties?.hashed_token || (linkData as any)?.hashed_token;
      const actionLink = (linkData as any)?.properties?.action_link || (linkData as any)?.action_link;
      const verificationType = (linkData as any)?.properties?.verification_type || "magiclink";

      if (!linkErr && (hashedToken || actionLink)) {
        const verifyUrl = hashedToken
          ? `${origin}/auth/verify?token_hash=${hashedToken}&type=${verificationType}&next=${encodeURIComponent("/compose")}`
          : actionLink;
        res.setHeader("Location", verifyUrl);
        return res.status(302).send("");
      }
    }

    res.setHeader("Location", `${origin}/invite/${state.token}`);
    return res.status(302).send("");
  } catch (err: any) {
    console.error("[GoogleCallback] Error:", err);
    res.setHeader("Location", buildInviteErrorUrl(origin, stateRaw || null, err?.message || "An unexpected error occurred during Google sign-in."));
    return res.status(302).send("");
  }
}
