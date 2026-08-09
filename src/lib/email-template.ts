import type { GeneratedLetter, MixtapePayload } from "@/types";
import { OCCASIONS } from "@/lib/constants";
import { getTracksByIds } from "@/lib/tracks";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildLetterEmailHtml(letter: GeneratedLetter): string {
  const occasion =
    OCCASIONS.find((o) => o.value === letter.form.occasion)?.emoji ?? "💌";
  const safeMessage = escapeHtml(letter.message).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(letter.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#faf4e8;font-family:'Trebuchet MS',Verdana,sans-serif;color:#3d2f22;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#fff6df 0%,#faf4e8 50%,#eef2e0 100%);padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#fffbf2;border:4px solid #d2a35a;border-radius:18px;overflow:hidden;box-shadow:0 8px 0 #e6c98a;">
          <tr>
            <td style="background:linear-gradient(90deg,#e8b86d,#c4a574,#a3b875);padding:18px 22px;text-align:center;">
              <div style="font-size:28px;letter-spacing:2px;">✨ ${occasion} ✨</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:#3d2f22;margin-top:6px;">Little Letter</div>
              <div style="font-size:12px;color:#5c3d1e;margin-top:4px;">a tiny note flew across the internet for you</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px 10px;text-align:center;">
              <div style="display:inline-block;background:#fff6df;border:2px dashed #d2a35a;border-radius:12px;padding:8px 14px;font-size:13px;color:#8b5e34;">
                ⭐ pixel warmth included ⭐
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 8px;">
              <h1 style="margin:0 0 14px;font-size:20px;color:#8b5e34;font-family:Georgia,serif;">
                For ${escapeHtml(letter.form.recipientName)}
              </h1>
              <div style="font-size:15px;line-height:1.7;color:#3d2f22;background:#fff;border:2px solid #e6c98a;border-radius:14px;padding:20px;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;text-align:center;">
              <div style="font-size:22px;letter-spacing:6px;">🦋 💌 ⭐ 🍀 ☁️</div>
              <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
                Sent with care from <strong style="color:#8b5e34;">${escapeHtml(letter.form.senderName)}</strong><br />
                via Little Letter — cosy notes for cosy people
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#9ca3af;">
          ✉️ If this made you smile, the mission succeeded.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildMixtapeEmailHtml(mix: MixtapePayload, playUrl: string): string {
  const tracks = getTracksByIds(mix.trackIds);
  const trackRows = tracks
    .map(
      (t, i) =>
        `<tr>
          <td style="padding:8px 10px;border-bottom:1px dashed #cbb892;font-family:monospace;font-size:12px;color:#8b5e34;width:28px;">${i + 1}.</td>
          <td style="padding:8px 10px;border-bottom:1px dashed #cbb892;">
            <div style="font-size:14px;color:#3d2f22;font-weight:bold;">${escapeHtml(t.title)}</div>
            <div style="font-size:11px;color:#7a654f;margin-top:2px;">${escapeHtml(t.artist)} · ${escapeHtml(t.year)}</div>
          </td>
        </tr>`
    )
    .join("");

  const dedication = mix.dedication.trim()
    ? `<div style="margin-top:16px;padding:14px 16px;background:#fff6df;border:2px dashed #d2a35a;border-radius:12px;font-size:14px;line-height:1.6;color:#3d2f22;font-style:italic;">
        “${escapeHtml(mix.dedication).replace(/\n/g, "<br />")}”
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(mix.title)}</title>
</head>
<body style="margin:0;padding:0;background:#1c1610;font-family:'Trebuchet MS',Verdana,sans-serif;color:#f5ecd9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#2a2218 0%,#1c1610 55%,#241c14 100%);padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#322a22;border:4px solid #8b5e34;border-radius:18px;overflow:hidden;box-shadow:0 10px 0 #1a1510;">
          <tr>
            <td style="background:linear-gradient(90deg,#5c3d1e,#8b5e34,#6b4f36);padding:18px 22px;text-align:center;">
              <div style="font-size:26px;letter-spacing:3px;">📼</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:#fff6df;margin-top:6px;">A mixtape for you</div>
              <div style="font-size:12px;color:#f6d58a;margin-top:4px;">hand-labelled · Side A · DJ 30-sec remix</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 22px 8px;">
              <div style="background:linear-gradient(135deg,#f7ecd4,#e4c078);border:3px solid #8b5e34;border-radius:12px;padding:16px 18px;color:#3d2f22;">
                <div style="font-family:monospace;font-size:10px;letter-spacing:2px;color:#8b5e34;">CASSETTE LABEL</div>
                <div style="font-family:Georgia,serif;font-size:22px;margin-top:6px;">${escapeHtml(mix.title)}</div>
                <div style="font-size:12px;margin-top:6px;color:#5c3d1e;">
                  for <strong>${escapeHtml(mix.recipientName)}</strong> · from <strong>${escapeHtml(mix.senderName)}</strong>
                </div>
              </div>
              ${dedication}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 22px 6px;text-align:center;">
              <a href="${escapeHtml(playUrl)}" style="display:inline-block;background:linear-gradient(180deg,#f6d58a,#e8b86d);color:#3d2f22;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:999px;border:3px solid #8b5e34;box-shadow:0 4px 0 #5c3d1e;">
                ▶ Play this mixtape
              </a>
              <div style="margin-top:10px;font-size:11px;color:#cbb892;">
                Opens a DJ remix deck — 30-second slices that fade into each other
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 22px 8px;">
              <div style="font-family:monospace;font-size:11px;letter-spacing:2px;color:#e6c98a;margin-bottom:8px;">TRACKLIST</div>
              <table role="presentation" width="100%" style="background:#241c16;border:2px solid #5c4a34;border-radius:12px;overflow:hidden;">
                ${trackRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 22px 26px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbb892;line-height:1.6;">
                Hit play and let the DJ mix run — 30 seconds per track, then the next drop.<br />
                <span style="color:#8a7a62;font-size:11px;">Titles are 90s favourites; playback uses free demo streams.</span>
              </p>
              <p style="margin:14px 0 0;font-size:11px;color:#8a7a62;word-break:break-all;">
                ${escapeHtml(playUrl)}
              </p>
              <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;">
                Sent with care via <strong style="color:#f6d58a;">Little Letter</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
