import { google } from "googleapis";
import { SITE_URL } from "@/lib/constants";

const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";

export function getGmailOAuthRedirectUri() {
  return `${SITE_URL}/api/gmail-setup/callback`;
}

export function createGmailOAuthClient() {
  const clientId = process.env.GMAIL_CLIENT_ID?.trim();
  const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  return new google.auth.OAuth2(clientId, clientSecret, getGmailOAuthRedirectUri());
}

export function getGmailSetupAuthUrl() {
  const oauth2 = createGmailOAuthClient();
  if (!oauth2) return null;

  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [GMAIL_SEND_SCOPE],
    include_granted_scopes: true,
  });
}

export async function exchangeGmailSetupCode(code: string) {
  const oauth2 = createGmailOAuthClient();
  if (!oauth2) throw new Error("Gmail OAuth is not configured.");

  const { tokens } = await oauth2.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Revoke app access at myaccount.google.com/permissions and try again."
    );
  }

  oauth2.setCredentials(tokens);
  let email = process.env.GMAIL_USER?.trim() || "";
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2 });
    const profile = await gmail.users.getProfile({ userId: "me" });
    email = profile.data.emailAddress || email;
  } catch {
    // gmail.send still works even if profile lookup fails
  }

  return {
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
    email,
  };
}

export function isGmailSetupConfigured() {
  return Boolean(
    process.env.GMAIL_CLIENT_ID?.trim() &&
      process.env.GMAIL_CLIENT_SECRET?.trim()
  );
}

export function verifyGmailSetupSecret(key: string | null) {
  const secret = process.env.GMAIL_SETUP_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  return key === secret;
}
