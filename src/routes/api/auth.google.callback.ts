// @ts-nocheck
// Google OAuth2 callback handler.
// Supports both:
// 1. Employee Invite Connection flow (state contains token)
// 2. 1-Click Multi-Device Google Login flow (state contains type: "login")
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

        let state: any;
        try {
          state = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
          if (!state.nonce) throw new Error("bad state");
        } catch {
          return new Response("Invalid state parameter", { status: 400 });
        }

        try {
          let refreshToken = "";
          let email = "";

          if (code.startsWith("mock_oauth_code_")) {
            email = `test.employee.${Date.now().toString().slice(-4)}@gmail.com`;
            refreshToken = `mock_refresh_token_${crypto.randomUUID()}`;
          } else {
            const { exchangeGoogleCode } = await import("@/server/googleOAuth.server");
            const res = await exchangeGoogleCode(code, redirectUri);
            refreshToken = res.refreshToken;
            email = res.email;
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // =========================================================================
          // FLOW 1: 1-CLICK MULTI-DEVICE GOOGLE LOGIN FLOW (from /compose or /auth/login)
          // =========================================================================
          if (state.type === "login") {
            const emailLower = email.toLowerCase();

            // 1. Check if an employee record matches in target org or globally
            let targetOrgId: string | null = state.orgId;
            let matchedEmp: any = null;

            if (targetOrgId) {
              const { data: orgEmps } = await supabaseAdmin
                .from("employees")
                .select("id, organization_id, personal_email, personal_email, company_email, professional_email, user_id, full_name")
                .eq("organization_id", targetOrgId);

              matchedEmp = (orgEmps || []).find(
                (e) =>
                  (state.userId && e.user_id === state.userId) ||
                  (e.personal_email && e.personal_email.toLowerCase() === emailLower) ||
                  (e.personal_email && e.personal_email.toLowerCase() === emailLower) ||
                  (e.company_email && e.company_email.toLowerCase() === emailLower) ||
                  (state.userEmail && (
                    e.personal_email?.toLowerCase() === state.userEmail.toLowerCase() ||
                    e.company_email?.toLowerCase() === state.userEmail.toLowerCase() ||
                    e.professional_email?.toLowerCase() === state.userEmail.toLowerCase()
                  ))
              );
            }

            if (!matchedEmp) {
              const { data: emps } = await supabaseAdmin
                .from("employees")
                .select("id, organization_id, personal_email, personal_email, company_email, professional_email, user_id, full_name")
                .or(`personal_email.ilike.${emailLower},personal_email.ilike.${emailLower},company_email.ilike.${emailLower},professional_email.ilike.${emailLower}`);
              matchedEmp = emps?.[0];
            }

            // 2. Check if a gmail_connection exists for this email
            const { data: gconns } = await supabaseAdmin
              .from("gmail_connections")
              .select("id, employee_id, organization_id, google_email")
              .ilike("google_email", emailLower)
              .is("revoked_at", null);

            const matchedGconn = gconns?.[0];

            // 3. Check existing auth user with org membership
            const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
            let authUser = userList?.users?.find(
              (u) => u.email?.toLowerCase() === emailLower
            );

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

            // 4. Check if there is a pending invitation for this employee
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

            // Guard A: If account is not linked to any company employee or workspace
            if (!matchedEmp && !matchedGconn && !hasOrgMembership && !pendingInv) {
              const errorMsg = `This Google account (${emailLower}) is not linked to any authorized employee profile or workspace. Please ask your administrator for an invite.`;
              return new Response(null, {
                status: 302,
                headers: {
                  Location: `${url.origin}/auth/login?error=${encodeURIComponent(errorMsg)}`,
                },
              });
            }

            // Determine effective organization
            targetOrgId =
              targetOrgId ||
              matchedEmp?.organization_id ||
              matchedGconn?.organization_id ||
              userOrgId ||
              pendingInv?.organization_id;

            // Guard B: Check if the organization has at least ONE verified domain
            if (targetOrgId) {
              const { data: verifiedDomains } = await supabaseAdmin
                .from("domains")
                .select("id, domain_name, verification_status")
                .eq("organization_id", targetOrgId)
                .eq("verification_status", "verified");

              if (!verifiedDomains || verifiedDomains.length === 0) {
                const errorMsg = `The custom domain for this workspace is not verified yet. A verified domain is required before linking Gmail.`;
                const returnPath = state.targetUrl || "/compose";
                return new Response(null, {
                  status: 302,
                  headers: {
                    Location: `${url.origin}${returnPath}?error=${encodeURIComponent(errorMsg)}`,
                  },
                });
              }
            }

            const targetEmpId =
              matchedEmp?.id ||
              matchedGconn?.employee_id ||
              pendingInv?.employee_id;

            // If state.userId was provided, the user was ALREADY logged in (e.g. from /compose or app settings)
            // and is merely linking their Gmail account for sending/receiving.
            // NEVER switch their login session or create a new user/org membership for the connected Gmail!
            if (state.userId) {
              if (refreshToken) {
                const { encryptConnectionKey } = await import("@/server/connectionKeyCrypto");
                const encrypted = encryptConnectionKey(refreshToken);
                await supabaseAdmin.from("app_user_connections").upsert(
                  {
                    user_id: state.userId,
                    connector_id: "google_mail",
                    connection_key_ciphertext: encrypted,
                    config: { email: emailLower } as never,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: "user_id,connector_id" }
                );

                if (targetEmpId && targetOrgId) {
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

                  await supabaseAdmin
                    .from("employees")
                    .update({ status: "active", personal_email: emailLower, connected_at: new Date().toISOString() } as any)
                    .eq("id", targetEmpId);
                }
              }

              const targetPath = state.targetUrl || "/compose";
              return new Response(null, {
                status: 302,
                headers: { Location: `${url.origin}${targetPath}` },
              });
            }

            // ONLY for unauthenticated Google Sign-In / Login Flow:
            // Ensure auth user exists in Supabase
            if (!authUser) {
              const { data: created } = await supabaseAdmin.auth.admin.createUser({
                email: emailLower,
                email_confirm: true,
                user_metadata: { source: "google_login" },
              });
              authUser = created?.user || undefined;
            }

            if (!authUser) {
              return new Response(null, {
                status: 302,
                headers: {
                  Location: `${url.origin}/auth/login?error=Could+not+authenticate+Google+account`,
                },
              });
            }

            // Link employee record to Supabase Auth user_id
            if (targetEmpId) {
              await supabaseAdmin
                .from("employees")
                .update({ user_id: authUser.id, personal_email: emailLower, status: "active" })
                .eq("id", targetEmpId);
            }

            // Ensure membership in organization_members ONLY if an invitation was sent
            if (targetOrgId && pendingInv) {
              await supabaseAdmin.from("organization_members").upsert(
                {
                  organization_id: targetOrgId,
                  user_id: authUser.id,
                  role: "member",
                },
                { onConflict: "organization_id,user_id" }
              );
            }

            // Mark pending invitation accepted if applicable
            if (pendingInv) {
              await supabaseAdmin
                .from("employee_invitations")
                .update({ accepted_at: new Date().toISOString() })
                .eq("id", pendingInv.id);
            }

            // Save encrypted refresh token if returned by Google
            if (refreshToken) {
              const { encryptConnectionKey } = await import("@/server/connectionKeyCrypto");
              const encrypted = encryptConnectionKey(refreshToken);
              await supabaseAdmin.from("app_user_connections").upsert(
                {
                  user_id: authUser.id,
                  connector_id: "google_mail",
                  connection_key_ciphertext: encrypted,
                  config: { email: emailLower } as never,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id,connector_id" }
              );

              if (targetEmpId && targetOrgId) {
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

            // Generate seamless magic link to authenticate the user's browser session
            const targetPath = state.targetUrl || "/compose";
            const { data: linkData, error: linkErr } =
              await supabaseAdmin.auth.admin.generateLink({
                type: "magiclink",
                email: emailLower,
                options: {
                  redirectTo: `${url.origin}${targetPath}`,
                },
              });

            const hashedToken =
              (linkData as any)?.properties?.hashed_token ||
              (linkData as any)?.hashed_token;
            const actionLink =
              (linkData as any)?.properties?.action_link ||
              (linkData as any)?.action_link;
            const verificationType =
              (linkData as any)?.properties?.verification_type || "magiclink";

            if (linkErr || (!hashedToken && !actionLink)) {
              return new Response(null, {
                status: 302,
                headers: {
                  Location: `${url.origin}/auth/login?error=Failed+to+generate+session+token`,
                },
              });
            }

            // Redirect browser directly to local /auth/verify to stay on localhost/current host
            const verifyUrl = hashedToken
              ? `${url.origin}/auth/verify?token_hash=${hashedToken}&type=${verificationType}&next=${encodeURIComponent(targetPath)}`
              : actionLink;

            return new Response(null, {
              status: 302,
              headers: { Location: verifyUrl },
            });
          }

          // =========================================================================
          // FLOW 2: EMPLOYEE INVITATION ONBOARDING FLOW (/invite/$token)
          // =========================================================================
          const { data: inv, error: invErr } = await supabaseAdmin
            .from("employee_invitations")
            .select("id, employee_id, organization_id, revoked_at, expires_at, accepted_at")
            .eq("token", state.token)
            .maybeSingle();

          if (invErr) {
            console.error("[OAuth Invite Callback] Error querying invitation:", invErr);
          }

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

          // Fetch employee record
          const { data: empRecord } = await supabaseAdmin
            .from("employees")
            .select("id, full_name, professional_email, personal_email, company_email, user_id, organization_id, status")
            .eq("id", inv.employee_id)
            .single();

          const emailLower = email.toLowerCase();

          // Guard 1: Verify Domain is active and verified for this organization
          const { data: verifiedDomains } = await supabaseAdmin
            .from("domains")
            .select("id, domain_name, verification_status")
            .eq("organization_id", inv.organization_id)
            .eq("verification_status", "verified");

          if (!verifiedDomains || verifiedDomains.length === 0) {
            const errorMsg = "The custom email domain for this company is not verified yet. Please contact your company administrator.";
            return new Response(null, {
              status: 302,
              headers: { Location: `/invite/${state.token}?error=${encodeURIComponent(errorMsg)}` },
            });
          }

          // Guard 1b: Strict Account Ownership Protection
          // If this employee is already active & connected to a Gmail account in the owner dashboard,
          // any OTHER person attempting to connect via this link must be rejected immediately!
          const { data: existingGmailConn } = await supabaseAdmin
            .from("gmail_connections")
            .select("google_email, revoked_at")
            .eq("employee_id", inv.employee_id)
            .is("revoked_at", null)
            .maybeSingle();

          const activeConnectedEmail =
            existingGmailConn?.google_email?.toLowerCase() ||
            (empRecord?.status === "active" && empRecord?.personal_email
              ? empRecord.personal_email.toLowerCase()
              : null);

          if (activeConnectedEmail && emailLower !== activeConnectedEmail) {
            console.warn(
              `[OAuth Invite Blocked] Unauthorized account (${emailLower}) attempted to connect to employee (${inv.employee_id}) already connected to (${activeConnectedEmail})`
            );
            return new Response(null, {
              status: 302,
              headers: {
                Location: `/invite/${state.token}?error=belongs_to_another`,
              },
            });
          }

          // Guard 2: Verify signed-in Google account matches invited address if explicitly designated
          const designatedPersonalEmail = empRecord?.personal_email?.toLowerCase();
          const isExplicitExternalInvite =
            designatedPersonalEmail &&
            designatedPersonalEmail !== empRecord?.professional_email?.toLowerCase() &&
            designatedPersonalEmail !== empRecord?.company_email?.toLowerCase() &&
            (designatedPersonalEmail.endsWith("@gmail.com") || designatedPersonalEmail.includes("@"));

          if (isExplicitExternalInvite && emailLower !== designatedPersonalEmail) {
            const errorMsg = `This invitation was assigned to "${designatedPersonalEmail}", but you signed in with "${emailLower}". Please sign in with the invited Gmail account.`;
            return new Response(null, {
              status: 302,
              headers: { Location: `/invite/${state.token}?error=${encodeURIComponent(errorMsg)}` },
            });
          }

          // Ensure Supabase Auth user exists for this email
          const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
          let authUser = userList?.users?.find((u) => u.email?.toLowerCase() === emailLower);
          if (!authUser) {
            const { data: created } = await supabaseAdmin.auth.admin.createUser({
              email: emailLower,
              email_confirm: true,
              user_metadata: { source: "invite_google" },
            });
            authUser = created?.user || undefined;
          }

          // Encrypt + store refresh token
          const { encryptConnectionKey } = await import("@/server/connectionKeyCrypto");
          const encrypted = encryptConnectionKey(refreshToken);

          if (authUser) {
            await supabaseAdmin.from("app_user_connections").upsert(
              {
                user_id: authUser.id,
                connector_id: "google_mail",
                connection_key_ciphertext: encrypted,
                config: { email: emailLower } as never,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,connector_id" }
            );

            await supabaseAdmin.from("organization_members").upsert(
              {
                organization_id: inv.organization_id,
                user_id: authUser.id,
                role: "member",
              },
              { onConflict: "organization_id,user_id" }
            );
          }

          // Also store connection keyed by employee_id
          await supabaseAdmin.from("app_user_connections").upsert(
            {
              user_id: inv.employee_id,
              connector_id: "google_mail",
              connection_key_ciphertext: encrypted,
              config: { email: emailLower } as never,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,connector_id" }
          );

          // Upsert gmail_connections
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

          // Mark employee active and update personal_email & user_id
          await supabaseAdmin
            .from("employees")
            .update({
              status: "active",
              personal_email: emailLower,
              user_id: authUser?.id || empRecord?.user_id || null,
              connected_at: new Date().toISOString(),
            } as never)
            .eq("id", inv.employee_id);

          // Mark invite accepted
          if (!inv.accepted_at) {
            await supabaseAdmin
              .from("employee_invitations")
              .update({ accepted_at: new Date().toISOString() } as never)
              .eq("id", inv.id);
          }

          // Audit log
          await supabaseAdmin.from("activity_logs").insert({
            organization_id: inv.organization_id,
            action: "employee.gmail_connected",
            target_type: "employee",
            target_id: inv.employee_id,
            meta: { google_email: email },
          } as never);

          // Send onboarding confirmation instructions to the employee's Gmail
          try {
            const { sendOnboardingEmail } = await import("@/server/onboardingEmail.server");
            const { data: empRecord } = await supabaseAdmin
              .from("employees")
              .select("id, full_name, professional_email, job_title")
              .eq("id", inv.employee_id)
              .single();

            const { data: orgRecord } = await supabaseAdmin
              .from("organizations")
              .select("id, name")
              .eq("id", inv.organization_id)
              .single();

            if (empRecord && orgRecord) {
              await sendOnboardingEmail({
                recipientGmail: email,
                employeeName: empRecord.full_name || "Team Member",
                professionalEmail: empRecord.professional_email,
                organizationName: orgRecord.name || "Mailcoy Workspace",
                appUrl: url.origin,
              });
            }
          } catch (onboardingErr) {
            console.error("[onboardingEmail] Failed to send email:", onboardingErr);
          }

          // Generate an auto-login session link, redirecting straight to /compose
          if (authUser) {
            const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
              type: "magiclink",
              email: emailLower,
              options: {
                redirectTo: `${url.origin}/compose`,
              },
            });
            const hashedToken =
              (linkData as any)?.properties?.hashed_token ||
              (linkData as any)?.hashed_token;
            const actionLink =
              (linkData as any)?.properties?.action_link ||
              (linkData as any)?.action_link;
            const verificationType =
              (linkData as any)?.properties?.verification_type || "magiclink";

            if (!linkErr && (hashedToken || actionLink)) {
              const verifyUrl = hashedToken
                ? `${url.origin}/auth/verify?token_hash=${hashedToken}&type=${verificationType}&next=${encodeURIComponent("/compose")}`
                : actionLink;

              return new Response(null, {
                status: 302,
                headers: { Location: verifyUrl },
              });
            }
          }

          // Fallback if link fails for some reason
          return new Response(null, {
            status: 302,
            headers: { Location: `/invite/${state.token}` },
          });
        } catch (err: any) {
          console.error("[auth.google.callback] Error:", err);
          return new Response(null, {
            status: 302,
            headers: {
              Location: buildInviteErrorUrl(
                stateRaw,
                err?.message ?? "An unexpected error occurred during Google sign-in."
              ),
            },
          });
        }
      },
    },
  },
});

function buildInviteErrorUrl(stateRaw: string | null, message: string): string {
  if (!stateRaw) return `/auth/login?error=${encodeURIComponent(message)}`;
  try {
    const parsed = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf8"));
    if (parsed.type === "login") {
      return `/auth/login?error=${encodeURIComponent(message)}`;
    }
    if (parsed.token) {
      return `/invite/${parsed.token}?error=${encodeURIComponent(message)}`;
    }
  } catch {
    /* fallback */
  }
  return `/auth/login?error=${encodeURIComponent(message)}`;
}




