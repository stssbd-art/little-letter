import type { GeneratedLetter, MixtapePayload } from "@/types";
import { getTracksByIds } from "@/lib/tracks";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
  ];

  return lines.filter((line, i, arr) => !(line === "" && arr[i + 1] === "")).join("\n");
}

/** HTML only used for verified-domain Resend; Gmail sends text-only. */
export function buildLetterEmailHtml(letter: GeneratedLetter): string {
  const safeMessage = escapeHtml(letter.message).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(letter.subject)}</title>
</head>
<body style="margin:0;padding:24px 16px;font-family:Georgia,serif;color:#222;">
  <p>Hi ${escapeHtml(letter.form.recipientName)},</p>
  <div style="line-height:1.7;">${safeMessage}</div>
  <p>— ${escapeHtml(letter.form.senderName)}</p>
</body>
</html>`;
}

export function buildMixtapeEmailHtml(mix: MixtapePayload, playUrl: string): string {
  const tracks = getTracksByIds(mix.trackIds, mix.customTracks);
  const trackList = tracks
    .map(
      (t, i) =>
        `<li>${i + 1}. ${escapeHtml(t.title)} — ${escapeHtml(t.artist)}</li>`
    )
    .join("");

  const dedication = mix.dedication.trim()
    ? `<p style="font-style:italic;">${escapeHtml(mix.dedication).replace(/\n/g, "<br />")}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(mix.title)}</title>
</head>
<body style="margin:0;padding:24px 16px;font-family:Georgia,serif;color:#222;">
  <p>Hi ${escapeHtml(mix.recipientName)},</p>
  ${dedication}
  ${trackList ? `<ol>${trackList}</ol>` : ""}
  <p><a href="${escapeHtml(playUrl)}">${escapeHtml(playUrl)}</a></p>
  <p>— ${escapeHtml(mix.senderName)}</p>
</body>
</html>`;
}
