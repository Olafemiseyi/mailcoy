// Server-side employee onboarding email dispatcher.
// Automatically triggered when an employee connects their Google account via invite link.

export interface OnboardingEmailParams {
  toEmail?: string;
  recipientGmail?: string; // Support both naming styles
  employeeName?: string;
  professionalEmail: string; // (e.g. sarah.smith@apexlogistics.com)
  organizationName: string;
  appUrl?: string;
  smtpPassword?: string;
}

export async function sendEmployeeOnboardingEmail(params: OnboardingEmailParams): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("[OnboardingEmail] RESEND_API_KEY is not set. Skipping onboarding email dispatch.");
    return;
  }

  const destinationEmail = params.toEmail || params.recipientGmail;
  if (!destinationEmail) return;

  const { employeeName, professionalEmail, organizationName } = params;
  const firstName = employeeName ? employeeName.split(" ")[0] : "there";
  const origin = (params.appUrl || process.env.PUBLIC_APP_URL || "https://mailcoy.com").replace(/\/+$/, "");
  const composeUrl = `${origin}/compose`;

  const subject = `🎉 Welcome to ${organizationName}! Your business email ${professionalEmail} is ready`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; margin: 0; padding: 32px 12px; color: #f1f5f9;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);">
    <!-- Header -->
    <tr>
      <td style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0f172a 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #bae6fd; margin-bottom: 8px;">
          ${organizationName} · Business Email
        </div>
        <h1 style="font-size: 24px; font-weight: 800; margin: 0; line-height: 1.25; color: #ffffff;">
          Welcome to your official business address
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: #e2e8f0;">
          Hi <strong>${firstName}</strong>,
        </p>
        <p style="font-size: 14.5px; line-height: 1.6; color: #94a3b8; margin: 0 0 24px 0;">
          Your official business address <strong style="color: #38bdf8; font-family: monospace;">${professionalEmail}</strong> is now live and linked to this Gmail inbox!
        </p>

        <!-- Primary Action Card: Mailcoy Compose -->
        <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 24px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #38bdf8; margin-bottom: 4px;">
            🚀 Recommended: 1-Click Mailbox
          </div>
          <div style="font-size: 16px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
            Launch Mailcoy Compose
          </div>
          <p style="font-size: 13.5px; color: #94a3b8; line-height: 1.5; margin: 0 0 18px 0;">
            Send, reply, and manage all your corporate emails from a clean, high-speed interface with zero configuration needed:
          </p>

          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
            <tr>
              <td style="padding-bottom: 8px; vertical-align: top; width: 22px;">✍️</td>
              <td style="padding-bottom: 8px;"><strong>Official Signature:</strong> Your company signature is pre-loaded with official branding and your job title.</td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px; vertical-align: top; width: 22px;">🪄</td>
              <td style="padding-bottom: 8px;"><strong>Mailcoy AI Polish:</strong> Polish emails for tone and grammar with 1 click before sending.</td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px; vertical-align: top; width: 22px;">📥</td>
              <td style="padding-bottom: 8px;"><strong>Live Message Stream:</strong> Real-time inbox and sent dispatches with delivery status tracking.</td>
            </tr>
          </table>

          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td align="center" style="border-radius: 10px; background-color: #0284c7;">
                <a href="${composeUrl}" target="_blank" style="display: block; width: 100%; padding: 12px 0; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; text-align: center; border-radius: 10px;">
                  Open Mailcoy Compose ↗
                </a>
              </td>
            </tr>
          </table>
        </div>

        <!-- Mobile Install Tip (PWA) -->
        <div style="background-color: #131c2e; border: 1px solid #1e3a8a; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <div style="font-size: 13.5px; font-weight: 700; color: #60a5fa; margin-bottom: 6px;">
            📱 Install as a Mobile App (iPhone & Android)
          </div>
          <p style="font-size: 13px; color: #93c5fd; line-height: 1.5; margin: 0;">
            Open <a href="${composeUrl}" target="_blank" style="color: #ffffff; font-weight: 600; text-decoration: underline;">${composeUrl}</a> in your phone's browser (Safari or Chrome) and tap <strong>Share / Menu → "Add to Home Screen"</strong> for instant 1-tap app access!
          </p>
        </div>

        <!-- Native Gmail Tip -->
        <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
          <div style="font-size: 13.5px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">
            ✉️ Prefer your regular Gmail app?
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">
            Any incoming emails sent to <strong style="color: #f1f5f9;">${professionalEmail}</strong> will also arrive right in your regular Gmail inbox. You can reply directly to any incoming customer email on the go.
          </p>
        </div>

        <!-- Privacy & Security Guarantee -->
        <div style="background-color: #0b1324; border: 1px solid #1e293b; border-radius: 10px; padding: 14px 16px;">
          <div style="font-size: 12.5px; font-weight: 600; color: #38bdf8; margin-bottom: 2px;">
            🔒 100% Privacy Guarantee
          </div>
          <div style="font-size: 12px; color: #64748b; line-height: 1.4;">
            Your personal emails remain completely private and confidential. Mailcoy only routes business emails sent to and from your company address.
          </div>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 32px; background-color: #090d16; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; line-height: 1.5;">
        Sent via ${organizationName} workspace email router · Powered by Mailcoy<br>
        If you have questions, please contact your workspace administrator.
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { sendResendEmail } = await import("@/server/resendClient.server");
    const result = await sendResendEmail({
      from: `${organizationName} <router@mailcoy.com>`,
      to: destinationEmail,
      subject,
      html,
      idempotencyKey: `onboard_${destinationEmail}_${organizationName.replace(/[^a-zA-Z0-9]/g, "")}`,
      apiKey: resendApiKey,
    });

    if (!result.ok) {
      console.warn("[OnboardingEmail] Failed to send onboarding email:", result.error);
    } else {
      console.log(`[OnboardingEmail] Successfully sent welcome guide to ${destinationEmail} | id: ${result.id}`);

      // Record in email_logs so it displays in employee message activity & Compose feed
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let orgId = (params as any).organizationId;
        if (!orgId) {
          const { data: emp } = await supabaseAdmin
            .from("employees")
            .select("organization_id")
            .or(`personal_email.eq.${destinationEmail},company_email.eq.${professionalEmail},professional_email.eq.${professionalEmail}`)
            .maybeSingle();
          orgId = emp?.organization_id;
        }

        if (orgId) {
          await supabaseAdmin.from("email_logs").insert({
            organization_id: orgId,
            sender: `Mailcoy <router@mailcoy.com>`,
            receiver: professionalEmail || destinationEmail,
            subject,
            snippet: `Welcome to ${organizationName}! Your business email ${professionalEmail} is configured and ready for business mail.`,
            direction: "incoming",
            status: "delivered",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (logErr) {
        console.warn("[OnboardingEmail] Error logging to email_logs:", logErr);
      }
    }
  } catch (err) {
    console.error("[OnboardingEmail] Error dispatching email:", err);
  }
}

// Backwards compatibility alias
export const sendOnboardingEmail = sendEmployeeOnboardingEmail;

