import { o as __toESM } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/googleOAuth.server-nkhxNtYg.js
var SCOPES = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/gmail.send",
	"https://www.googleapis.com/auth/gmail.compose",
	"https://www.googleapis.com/auth/gmail.readonly",
	"https://www.googleapis.com/auth/gmail.settings.basic"
];
async function getOAuth2Client() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not set");
	if (!clientSecret) throw new Error("GOOGLE_CLIENT_SECRET is not set");
	const { google } = await import("../_libs/googleapis+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	return new google.auth.OAuth2(clientId, clientSecret);
}
/** Build the Google authorization URL. redirectUri must match Google Cloud Console. */
async function buildGoogleAuthUrl(redirectUri, state) {
	return (await getOAuth2Client()).generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		scope: SCOPES,
		redirect_uri: redirectUri,
		state
	});
}
/** Exchange the code from the callback for tokens. Returns { accessToken, refreshToken, email }. */
async function exchangeGoogleCode(code, redirectUri) {
	const oauth2 = await getOAuth2Client();
	const { tokens } = await oauth2.getToken({
		code,
		redirect_uri: redirectUri
	});
	if (!tokens.refresh_token) throw new Error("Google did not return a refresh token. Make sure prompt=consent is set and the user hasn't already granted access.");
	const { google } = await import("../_libs/googleapis+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	oauth2.setCredentials(tokens);
	const { data: profile } = await google.oauth2({
		version: "v2",
		auth: oauth2
	}).userinfo.get();
	return {
		accessToken: tokens.access_token ?? "",
		refreshToken: tokens.refresh_token,
		email: profile.email ?? ""
	};
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
async function addGmailSendAsAlias(opts) {
	const oauth2 = await getOAuth2Client();
	oauth2.setCredentials({ refresh_token: opts.refreshToken });
	const { google } = await import("../_libs/googleapis+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const gmail = google.gmail({
		version: "v1",
		auth: oauth2
	});
	if (((await gmail.users.settings.sendAs.list({ userId: "me" })).data.sendAs ?? []).find((a) => a.sendAsEmail?.toLowerCase() === opts.sendAsEmail.toLowerCase())) return "exists";
	await gmail.users.settings.sendAs.create({
		userId: "me",
		requestBody: {
			sendAsEmail: opts.sendAsEmail,
			displayName: opts.displayName,
			replyToAddress: opts.replyToEmail ?? opts.sendAsEmail,
			isDefault: false,
			treatAsAlias: true
		}
	});
	return "created";
}
//#endregion
export { addGmailSendAsAlias, buildGoogleAuthUrl, exchangeGoogleCode };
