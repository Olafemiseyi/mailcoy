// Server-side billing and quota lifecycle email dispatchers for Mailcoy.
// Powered by Resend for 100% inbox delivery and Mailcoy obsidian brand aesthetic.

export interface BaseBillingEmailParams {
  toEmail: string;
  ownerName: string;
  organizationName: string;
  planName?: string;
  renewalDate?: string;
  renewalAmount?: string;
  currentCount?: number;
  maxLimit?: number;
  graceEndDate?: string;
}

const EMAIL_FOOTER = `
  <tr>
    <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11.5px; color: #94a3b8; text-align: center; line-height: 1.5;">
      Mailcoy Technologies · Modern Business Email Operating System<br>
      Manage your workspace settings anytime at <a href="https://mailcoy.com/settings/billing" style="color: #2563eb; text-decoration: underline;">mailcoy.com/settings/billing</a>
    </td>
  </tr>
`;

async function dispatchEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("[BillingEmail] RESEND_API_KEY not set. Skipping email dispatch.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mailcoy Billing <billing@mailcoy.com>",
        to: [to],
        subject,
        html,
      }),
    });
    return res.ok;
  } catch (e) {
    console.error("[BillingEmail] Error dispatching email:", e);
    return false;
  }
}

/**
 * 1. Upcoming Renewal Reminder (3 Days Before Expiry)
 */
export async function sendUpcomingRenewalEmail(params: BaseBillingEmailParams): Promise<boolean> {
  const { toEmail, ownerName, organizationName, planName = "Growth Plan", renewalDate = "in 3 days", renewalAmount = "₦20,000" } = params;
  const firstName = ownerName ? ownerName.split(" ")[0] : "there";
  const subject = `⚡ Your Mailcoy subscription renews in 3 days (${organizationName})`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #0f172a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #34d399; margin-bottom: 4px;">Mailcoy Billing</div>
        <h3 style="font-size: 20px; font-weight: 700; margin: 0; line-height: 1.3;">Subscription Renewal in 3 Days</h3>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 30px;">
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0 0 16px 0; color: #334155;">Hello <strong>${firstName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
          This is a quick reminder that your <strong>${planName}</strong> subscription for <strong>${organizationName}</strong> will automatically renew on <strong>${renewalDate}</strong>.
        </p>
        <table width="100%" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-size: 13px;">
          <tr><td style="color: #64748b; padding: 4px 0;">Workspace:</td><td style="text-align: right; font-weight: 600; color: #0f172a;">${organizationName}</td></tr>
          <tr><td style="color: #64748b; padding: 4px 0;">Plan:</td><td style="text-align: right; font-weight: 600; color: #0f172a;">${planName}</td></tr>
          <tr><td style="color: #64748b; padding: 4px 0;">Renewal Amount:</td><td style="text-align: right; font-weight: 700; color: #059669;">${renewalAmount}</td></tr>
        </table>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 20px 0;">
          No action is required if your payment card on file is active.
        </p>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #0f172a;">
              <a href="https://mailcoy.com/settings/billing" target="_blank" style="display: inline-block; padding: 11px 24px; font-size: 13.5px; font-weight: 600; color: #ffffff; text-decoration: none;">
                Manage Billing & Invoices &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${EMAIL_FOOTER}
  </table>
</body>
</html>
  `;

  return dispatchEmail(toEmail, subject, html);
}

/**
 * 2. Payment Failed & 72-Hour Grace Period (Past Due)
 */
export async function sendPaymentFailedGraceEmail(params: BaseBillingEmailParams): Promise<boolean> {
  const { toEmail, ownerName, organizationName, planName = "Growth Plan", renewalAmount = "₦20,000", graceEndDate = "in 72 hours" } = params;
  const firstName = ownerName ? ownerName.split(" ")[0] : "there";
  const subject = `⚠️ Action Required: Payment failed for ${organizationName} (3-Day Grace Period)`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #0f172a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 30px; background: linear-gradient(135deg, #78350f 0%, #451a03 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #fde68a; margin-bottom: 4px;">Action Required</div>
        <h3 style="font-size: 20px; font-weight: 700; margin: 0; line-height: 1.3;">Payment Failed · 3-Day Grace Period Active</h3>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 30px;">
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0 0 16px 0; color: #334155;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
          We attempted to renew your <strong>${planName}</strong> subscription for <strong>${organizationName}</strong>, but the charge of <strong>${renewalAmount}</strong> was declined by your payment provider.
        </p>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
          <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 2px;">
            ⏳ 72-Hour Grace Period Activated
          </div>
          <div style="font-size: 12.5px; color: #b45309; line-height: 1.5;">
            Your team's custom domain emails will continue flowing normally for the next <strong>3 days</strong>. Please update your payment card before <strong>${graceEndDate}</strong> to prevent any service disruption.
          </div>
        </div>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #d97706;">
              <a href="https://mailcoy.com/settings/billing" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none;">
                Update Payment Card Now &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${EMAIL_FOOTER}
  </table>
</body>
</html>
  `;

  return dispatchEmail(toEmail, subject, html);
}

/**
 * 3. Subscription Expired & Routing Suspended (Grace Period Ended)
 */
export async function sendSubscriptionExpiredEmail(params: BaseBillingEmailParams): Promise<boolean> {
  const { toEmail, ownerName, organizationName } = params;
  const firstName = ownerName ? ownerName.split(" ")[0] : "there";
  const subject = `🛑 Email routing paused for ${organizationName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #0f172a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 30px; background: linear-gradient(135deg, #881337 0%, #4c0519 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #fecdd3; margin-bottom: 4px;">Service Alert</div>
        <h3 style="font-size: 20px; font-weight: 700; margin: 0; line-height: 1.3;">Email Routing Paused for ${organizationName}</h3>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 30px;">
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0 0 16px 0; color: #334155;">Hello <strong>${firstName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
          Your 72-hour grace period for <strong>${organizationName}</strong> has ended without a successful renewal. Inbound and outbound email routing for additional team addresses has been temporarily paused.
        </p>
        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 700; color: #9f1239; margin-bottom: 2px;">
            🔒 Workspace Status: Suspended
          </div>
          <div style="font-size: 12.5px; color: #be123c; line-height: 1.5;">
            Your DNS configurations, aliases, signatures, and employee connections are safely preserved. Renewing your subscription will immediately restore full inbox delivery.
          </div>
        </div>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #e11d48;">
              <a href="https://mailcoy.com/settings/billing" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none;">
                Renew Subscription to Restore Routing &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${EMAIL_FOOTER}
  </table>
</body>
</html>
  `;

  return dispatchEmail(toEmail, subject, html);
}

/**
 * 4. Free Plan Quota Warning (80% / 40 of 50 Emails)
 */
export async function sendQuotaWarningEmail(params: BaseBillingEmailParams): Promise<boolean> {
  const { toEmail, ownerName, organizationName, currentCount = 40, maxLimit = 50 } = params;
  const firstName = ownerName ? ownerName.split(" ")[0] : "there";
  const remaining = Math.max(0, maxLimit - currentCount);
  const subject = `📊 80% of free monthly email quota reached (${currentCount}/${maxLimit})`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #0f172a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #fbbf24; margin-bottom: 4px;">Free Plan Usage Alert</div>
        <h3 style="font-size: 20px; font-weight: 700; margin: 0; line-height: 1.3;">80% of Monthly Free Quota Used</h3>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 30px;">
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0 0 16px 0; color: #334155;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
          You have routed <strong>${currentCount} of your ${maxLimit} free monthly emails</strong> for <strong>${organizationName}</strong>.
        </p>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 8px; color: #0f172a;">
            <span>Monthly Quota</span>
            <span>${currentCount} / ${maxLimit} Emails (${remaining} Remaining)</span>
          </div>
          <div style="background: #cbd5e1; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #f59e0b; width: ${(currentCount / maxLimit) * 100}%; height: 100%;"></div>
          </div>
        </div>
        <p style="font-size: 13.5px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
          To avoid missing incoming client inquiries, upgrade to <strong>Starter Pro</strong> for just <strong>₦7,500/mo ($9/mo)</strong> to get <strong>unlimited email routing</strong> and up to 5 team inboxes.
        </p>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #0f172a;">
              <a href="https://mailcoy.com/settings/billing" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
                Upgrade to Starter Pro (Unlimited) &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${EMAIL_FOOTER}
  </table>
</body>
</html>
  `;

  return dispatchEmail(toEmail, subject, html);
}

/**
 * 5. Free Plan Quota Reached (100% / 50 of 50 Emails)
 */
export async function sendQuotaExceededEmail(params: BaseBillingEmailParams): Promise<boolean> {
  const { toEmail, ownerName, organizationName, maxLimit = 50 } = params;
  const firstName = ownerName ? ownerName.split(" ")[0] : "there";
  const subject = `🔒 Free monthly email limit reached (${maxLimit}/${maxLimit}) – ${organizationName}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px; color: #0f172a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <tr>
      <td style="padding: 24px 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f43f5e; margin-bottom: 4px;">Limit Reached</div>
        <h3 style="font-size: 20px; font-weight: 700; margin: 0; line-height: 1.3;">Monthly Free Email Limit Reached (${maxLimit}/${maxLimit})</h3>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 30px;">
        <p style="font-size: 14.5px; line-height: 1.6; margin: 0 0 16px 0; color: #334155;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
          You have reached your <strong>${maxLimit} free monthly emails limit</strong> for <strong>${organizationName}</strong>. Routing for your custom domain has been paused until your quota resets next month.
        </p>
        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 700; color: #9f1239; margin-bottom: 2px;">
            ⚡ Upgrade to Unlock Instant Unlimited Routing
          </div>
          <div style="font-size: 12.5px; color: #be123c; line-height: 1.5;">
            Upgrade to <strong>Starter Pro (₦7,500/mo)</strong> to instantly unlock unlimited email routing, team aliases, and company HTML signatures.
          </div>
        </div>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background-color: #0f172a;">
              <a href="https://mailcoy.com/settings/billing" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">
                Upgrade to Unlimited Now &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${EMAIL_FOOTER}
  </table>
</body>
</html>
  `;

  return dispatchEmail(toEmail, subject, html);
}
