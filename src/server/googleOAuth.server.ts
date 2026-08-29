// Native Google OAuth2 helpers — server-only.
// Uses GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET from process.env.
// Replaces the Lovable connector gateway entirely.

const SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/gmail.settings.sharing",
  "https://www.googleapis.com/auth/gmail.send",
];

function getEnvVal(name: string): string | undefined {
  const val = process.env[name];
  return typeof val === "string" ? val.trim().replace(/^["']|["']$/g, "") : undefined;
}

async function getOAuth2Client() {
  const clientId = getEnvVal("GOOGLE_CLIENT_ID");
  const clientSecret = getEnvVal("GOOGLE_CLIENT_SECRET");
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured in environment variables.");
  if (!clientSecret) throw new Error("GOOGLE_CLIENT_SECRET is not configured in environment variables.");

  // Dynamic import to avoid bundling on client
  const { google } = await import("googleapis");
  return new google.auth.OAuth2(clientId, clientSecret);
}

/** Build the Google authorization URL. redirectUri must match Google Cloud Console. */
export async function buildGoogleAuthUrl(redirectUri: string, state: string): Promise<string> {
  const oauth2 = await getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
  });
}

/** Exchange the code from the callback for tokens. Returns { accessToken, refreshToken, email }. */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
): Promise<{ accessToken: string; refreshToken: string; email: string }> {
  const oauth2 = await getOAuth2Client();

  const { tokens } = await oauth2.getToken({ code, redirect_uri: redirectUri });
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Make sure prompt=consent is set and the user hasn't already granted access.",
    );
  }

  // Fetch Google profile email
  const { google } = await import("googleapis");
  oauth2.setCredentials(tokens);
  const oauth2Api = google.oauth2({ version: "v2", auth: oauth2 });
  const { data: profile } = await oauth2Api.userinfo.get();

  return {
    accessToken: tokens.access_token ?? "",
    refreshToken: tokens.refresh_token,
    email: profile.email ?? "",
  };
}

/** Send an email via Gmail API on behalf of a user using their stored refresh token. */
export async function sendGmailAs(opts: {
  refreshToken: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ messageId: string }> {
  const oauth2 = await getOAuth2Client();
  oauth2.setCredentials({ refresh_token: opts.refreshToken });

  const { google } = await import("googleapis");
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  const raw = makeRawEmail(opts.from, opts.to, opts.subject, opts.html);
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return { messageId: res.data.id ?? "" };
}

/** Verify a refresh token is still valid by doing a lightweight profile fetch. */
export async function verifyGmailToken(
  refreshToken: string,
): Promise<{ email: string; valid: boolean }> {
  try {
    const oauth2 = await getOAuth2Client();
    oauth2.setCredentials({ refresh_token: refreshToken });
    const { google } = await import("googleapis");
    const oauth2Api = google.oauth2({ version: "v2", auth: oauth2 });
    const { data: profile } = await oauth2Api.userinfo.get();
    return { email: profile.email ?? "", valid: true };
  } catch {
    return { email: "", valid: false };
  }
}

/**
 * Automatically adds the employee's professional email as a "Send As" alias in Gmail.
 * Google will dispatch a one-click verification email to the alias address.
 * The employee must click it — but since your MX routing delivers to their Gmail,
 * that verification email lands straight in their inbox.
 *
 * @param refreshToken  - The employee's stored Google refresh token.
 * @param sendAsEmail   - The professional address to register, e.g. "jane@acme.com".
 * @param displayName   - The name to show in the From field, e.g. "Jane Doe".
 * @param replyToEmail  - Optional reply-to override (usually same as sendAsEmail).
 * @returns "created" | "exists" — so callers can decide whether to show a toast.
 */
export async function addGmailSendAsAlias(opts: {
  refreshToken: string;
  sendAsEmail: string;
  displayName: string;
  replyToEmail?: string;
}): Promise<"created" | "exists"> {
  const oauth2 = await getOAuth2Client();
  oauth2.setCredentials({ refresh_token: opts.refreshToken });

  const { google } = await import("googleapis");
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  // Check if alias already exists so we don't send a duplicate verification email.
  const listRes = await gmail.users.settings.sendAs.list({ userId: "me" });
  const existing = (listRes.data.sendAs ?? []).find(
    (a) => a.sendAsEmail?.toLowerCase() === opts.sendAsEmail.toLowerCase(),
  );
  if (existing) return "exists";

  // Create the Send As alias — automatically configure secure Resend SMTP
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await gmail.users.settings.sendAs.create({
        userId: "me",
        requestBody: {
          sendAsEmail: opts.sendAsEmail,
          displayName: opts.displayName,
          replyToAddress: opts.replyToEmail ?? opts.sendAsEmail,
          isDefault: false,
          treatAsAlias: true,
          smtpMsa: {
            host: "smtp.resend.com",
            port: 465,
            securityMode: "ssl",
            username: "resend",
            password: resendKey,
          },
        },
      });
      return "created";
    } catch (smtpErr) {
      console.warn("[SendAs] smtpMsa setup error, falling back to standard alias:", smtpErr instanceof Error ? smtpErr.message : smtpErr);
      // fallback below
    }
  }

  // Fallback without smtpMsa — Gmail will prompt user to verify alias via email link
  await gmail.users.settings.sendAs.create({
    userId: "me",
    requestBody: {
      sendAsEmail: opts.sendAsEmail,
      displayName: opts.displayName,
      replyToAddress: opts.replyToEmail ?? opts.sendAsEmail,
      isDefault: false,
      treatAsAlias: true,
    },
  });

  return "created";
}

/**
 * Updates the Gmail signature for a specific Send As alias.
 * Call this after addGmailSendAsAlias — or any time the org signature changes.
 *
 * @param refreshToken - The employee's stored Google refresh token.
 * @param sendAsEmail  - The Send As alias to update the signature for.
 * @param signatureHtml - Raw HTML signature content.
 */
export async function updateGmailSignature(opts: {
  refreshToken: string;
  sendAsEmail: string;
  signatureHtml: string;
}): Promise<void> {
  const oauth2 = await getOAuth2Client();
  oauth2.setCredentials({ refresh_token: opts.refreshToken });

  const { google } = await import("googleapis");
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  await gmail.users.settings.sendAs.patch({
    userId: "me",
    sendAsEmail: opts.sendAsEmail,
    requestBody: { signature: opts.signatureHtml },
  });
}

// ── RFC 2822 email builder ──────────────────────────────────────────────────
function makeRawEmail(from: string, to: string, subject: string, html: string): string {
  const boundary = `boundary_${Date.now()}`;
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    "",
    html,
    "",
    `--${boundary}--`,
  ].join("\r\n");
  // Use btoa instead of Buffer to avoid Node.js polyfill leaking into client bundle
  const bytes = new TextEncoder().encode(message);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
