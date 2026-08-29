// Server-side employee onboarding email dispatcher.
// Automatically triggered when an employee connects their Google account via invite link.

export interface OnboardingEmailParams {
  toEmail: string; // Personal Gmail address (e.g. femiseyi101@gmail.com)
  employeeName: string;
  professionalEmail: string; // (e.g. olafemi.seyi@mailcoy.com)
  organizationName: string;
}

export async function sendEmployeeOnboardingEmail(params: OnboardingEmailParams): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("[OnboardingEmail] RESEND_API_KEY is not set. Skipping onboarding email dispatch.");
    return;
  }

  const { toEmail, employeeName, professionalEmail, organizationName } = params;
  const firstName = employeeName ? employeeName.split(" ")[0] : "there";

  const subject = `⚡ Action Required: Finish setting up ${professionalEmail} in Gmail`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #0f172a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 6px;">
          ${organizationName} · Business Email
        </div>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0; line-height: 1.3;">
          Welcome to your business address
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Hi <strong>${firstName}</strong>,
        </p>
        <p style="font-size: 14.5px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
          Your professional address <strong style="color: #0f172a; font-family: monospace;">${professionalEmail}</strong> has been linked to this Gmail inbox!
        </p>

        <!-- Status Card -->
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 600; color: #166534; margin-bottom: 2px;">
            ✅ Inbound Emails are Active
          </div>
          <div style="font-size: 13px; color: #15803d; line-height: 1.4;">
            Any client or customer emails sent to <strong>${professionalEmail}</strong> will automatically arrive right here in your Gmail inbox.
          </div>
        </div>

        <!-- Outbound Action Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
            ⚡ Final 1-Minute Step: Enable Sending from Gmail
          </div>
          <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 16px 0;">
            To send and reply to emails as <strong>${professionalEmail}</strong> directly from Gmail (on desktop, iPhone, and Android):
          </p>

          <ol style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.7;">
            <li style="margin-bottom: 8px;">
              Your 1-click Google OAuth connection has automatically authorized your Send-As alias.
            </li>
            <li style="margin-bottom: 8px;">
              When composing a new message or replying in Gmail, tap or click the <strong>"From"</strong> line and choose <strong>${professionalEmail}</strong>.
            </li>
            <li style="margin-bottom: 8px;">
              You can set it as your default sending address anytime in <strong><a href="https://mail.google.com/mail/u/0/#settings/accounts" target="_blank" style="color: #2563eb; text-decoration: underline;">Gmail Settings → Accounts and Import</a></strong>.
            </li>
          </ol>
        </div>

        <!-- CTA Button -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #0f172a;">
              <a href="https://mail.google.com/mail/u/0/#settings/accounts" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                Open Gmail Settings ↗
              </a>
            </td>
          </tr>
        </table>

        <!-- Mobile Note -->
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px;">
          <div style="font-size: 12.5px; font-weight: 600; color: #1e40af; margin-bottom: 2px;">
            📱 Mobile Users (iPhone & Android):
          </div>
          <div style="font-size: 12px; color: #1e3a8a; line-height: 1.5;">
            Open the link above in your phone's browser (Safari or Chrome). Once saved, it will immediately sync to your native Gmail mobile app so you can send as <strong>${professionalEmail}</strong> on the go!
          </div>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
        Sent via ${organizationName} workspace email router · Powered by Mailcoy<br>
        If you have questions, please contact your workspace administrator.
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mailcoy Setup <router@mailcoy.com>",
        to: [toEmail],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("[OnboardingEmail] Failed to send onboarding email:", errText);
    } else {
      console.log(`[OnboardingEmail] Successfully sent setup guide to ${toEmail}`);
    }
  } catch (err) {
    console.error("[OnboardingEmail] Error dispatching email:", err);
  }
}
