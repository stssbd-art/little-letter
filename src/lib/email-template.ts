import { readFileSync } from "fs";
import path from "path";
import type { GeneratedLetter, MixtapePayload } from "@/types";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getTracksByIds } from "@/lib/tracks";

export const EMAIL_LOGO_CID = "ll-logo";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Absolute URL for Resend / clients that load remote images. */
export function emailLogoUrl() {
  return `${SITE_URL}/email-logo.jpg`;
}

/** Inline JPEG bytes for Gmail CID embedding (shows without remote load). */
export function getEmailLogoBuffer(): Buffer {
  return readFileSync(path.join(process.cwd(), "public", "email-logo.jpg"));
}

function logoBlock(opts?: { useCid?: boolean }) {
  const src = opts?.useCid ? `cid:${EMAIL_LOGO_CID}` : emailLogoUrl();
  return `<div style="margin:0 0 20px;text-align:left;">
  <a href="${escapeHtml(SITE_URL)}" style="text-decoration:none;">
    <img
      src="${src}"
      alt="${escapeHtml(SITE_NAME)}"
      width="220"
      height="147"
      style="display:block;width:220px;max-width:100%;height:auto;border:0;outline:none;"
    />
  </a>
</div>`;
}

/** Plain personal note — same shape as a normal Gmail message. */
export function buildLetterEmailText(letter: GeneratedLetter): string {
  return [
    `Hi ${letter.form.recipientName},`,
    "",
    letter.message,
    "",
    letter.form.senderName.trim()
      ? `— ${letter.form.senderName.trim()}`
      : "",
    "",
    `Sent with ${SITE_NAME}`,
  ]
    .filter((line, i, arr) => !(line === "" && arr[i + 1] === ""))
    .join("\n");
}

export function buildMixtapeEmailText(mix: MixtapePayload, playUrl: string): string {
  const tracks = getTracksByIds(mix.trackIds, mix.customTracks);
  const list = tracks
    .map((t, i) => `${i + 1}. ${t.title} — ${t.artist}`)
    .join("\n");

  const lines = [
    `Hi ${mix.recipientName},`,
    "",
    mix.dedication.trim() ? mix.dedication.trim() : "",
    mix.dedication.trim() ? "" : "",
    list ? list : "",
    list ? "" : "",
    playUrl,
    "",
    mix.senderName.trim() ? `— ${mix.senderName.trim()}` : "",
    "",
    `Sent with ${SITE_NAME}`,
  ];

  return lines.filter((line, i, arr) => !(line === "" && arr[i + 1] === "")).join("\n");
}

export function buildLetterEmailHtml(
  letter: GeneratedLetter,
  opts?: { useCid?: boolean }
): string {
  const safeMessage = escapeHtml(letter.message).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(letter.subject)}</title>
</head>
<body style="margin:0;padding:24px 16px;background:#faf4e8;font-family:Georgia,'Times New Roman',serif;color:#3d2f22;">
  <div style="max-width:560px;margin:0 auto;background:#fffbf2;border:1px solid #e6c98a;border-radius:12px;padding:24px;">
    ${logoBlock(opts)}
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(letter.form.recipientName)},</p>
    <div style="font-size:16px;line-height:1.7;color:#3d2f22;">${safeMessage}</div>
    <p style="margin:18px 0 0;font-size:16px;">— ${escapeHtml(letter.form.senderName)}</p>
  </div>
  <p style="max-width:560px;margin:14px auto 0;font-size:11px;color:#8a7a62;text-align:center;">
    Sent with <a href="${escapeHtml(SITE_URL)}" style="color:#8b5e34;">${escapeHtml(SITE_NAME)}</a>
  </p>
</body>
</html>`;
}

export function buildMixtapeEmailHtml(
  mix: MixtapePayload,
  playUrl: string,
  opts?: { useCid?: boolean }
): string {
  const tracks = getTracksByIds(mix.trackIds, mix.customTracks);
  const trackList = tracks
    .map(
      (t, i) =>
        `<li style="margin:0 0 6px;">${i + 1}. ${escapeHtml(t.title)} — ${escapeHtml(t.artist)}</li>`
    )
    .join("");

  const dedication = mix.dedication.trim()
    ? `<p style="font-style:italic;line-height:1.6;">${escapeHtml(mix.dedication).replace(/\n/g, "<br />")}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(mix.title)}</title>
</head>
<body style="margin:0;padding:24px 16px;background:#faf4e8;font-family:Georgia,'Times New Roman',serif;color:#3d2f22;">
  <div style="max-width:560px;margin:0 auto;background:#fffbf2;border:1px solid #e6c98a;border-radius:12px;padding:24px;">
    ${logoBlock(opts)}
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(mix.recipientName)},</p>
    ${dedication}
    ${trackList ? `<ol style="padding-left:20px;margin:12px 0;font-size:15px;line-height:1.5;">${trackList}</ol>` : ""}
    <p style="margin:16px 0;">
      <a href="${escapeHtml(playUrl)}" style="display:inline-block;background:#e8b86d;color:#3d2f22;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:8px;border:2px solid #8b5e34;">
        Play this mixtape
      </a>
    </p>
    <p style="margin:12px 0 0;font-size:12px;color:#7a654f;word-break:break-all;">${escapeHtml(playUrl)}</p>
    <p style="margin:18px 0 0;font-size:16px;">— ${escapeHtml(mix.senderName)}</p>
  </div>
  <p style="max-width:560px;margin:14px auto 0;font-size:11px;color:#8a7a62;text-align:center;">
    Sent with <a href="${escapeHtml(SITE_URL)}" style="color:#8b5e34;">${escapeHtml(SITE_NAME)}</a>
  </p>
</body>
</html>`;
}
