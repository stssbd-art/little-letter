import type { GeneratedLetter, MixtapePayload } from "@/types";
import { OCCASIONS, SITE_URL } from "@/lib/constants";
import { getTracksByIds } from "@/lib/tracks";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function whyFooter(senderName: string) {
  return `<p style="margin:18px 0 0;font-size:11px;color:#8a7a62;line-height:1.6;max-width:520px;">
    You received this because <strong>${escapeHtml(senderName)}</strong> sent you a personal note with
    <a href="${escapeHtml(SITE_URL)}" style="color:#8b5e34;">Little Letter</a>.
    This is a one-off message, not a mailing list.
  </p>`;
}

export function buildLetterEmailText(letter: GeneratedLetter): string {
  return [
    `Little Letter for ${letter.form.recipientName}`,
    "",
    letter.message,
    "",
    `— ${letter.form.senderName}`,
    "",
    `Sent with Little Letter (${SITE_URL})`,
    "This is a personal one-off message, not a newsletter.",
  ].join("\n");
}

export function buildMixtapeEmailText(mix: MixtapePayload, playUrl: string): string {
  const tracks = getTracksByIds(mix.trackIds);
  const list = tracks
    .map((t, i) => `${i + 1}. ${t.title} — ${t.artist} (${t.year})`)
    .join("\n");

  return [
    `A mixtape for ${mix.recipientName}: ${mix.title}`,
    `From: ${mix.senderName}`,
    mix.dedication.trim() ? `\n“${mix.dedication.trim()}”\n` : "",
    list ? `Tracklist:\n${list}\n` : "",
    `Play your mixtape:\n${playUrl}`,
    "",
    `Sent with Little Letter (${SITE_URL})`,
    "This is a personal one-off message, not a newsletter.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildLetterEmailHtml(letter: GeneratedLetter): string {
  const occasion =
    OCCASIONS.find((o) => o.value === letter.form.occasion)?.emoji ?? "💌";
  const safeMessage = escapeHtml(letter.message).replace(/\n/g, "<br />");
  const preheader = `${letter.form.senderName} sent you a personal letter on Little Letter.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(letter.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#faf4e8;font-family:Georgia,'Times New Roman',serif;color:#3d2f22;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf4e8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#fffbf2;border:2px solid #d2a35a;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#f0d9a0;padding:18px 22px;text-align:center;">
              <div style="font-size:22px;">${occasion}</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:#3d2f22;margin-top:6px;">Little Letter</div>
              <div style="font-size:12px;color:#5c3d1e;margin-top:4px;">A personal note for you</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px 8px;">
              <h1 style="margin:0 0 14px;font-size:20px;color:#8b5e34;font-family:Georgia,serif;">
                For ${escapeHtml(letter.form.recipientName)}
              </h1>
              <div style="font-size:15px;line-height:1.7;color:#3d2f22;background:#fff;border:1px solid #e6c98a;border-radius:10px;padding:20px;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#7a654f;line-height:1.5;">
                Sent with care from <strong style="color:#8b5e34;">${escapeHtml(letter.form.senderName)}</strong>
              </p>
            </td>
          </tr>
        </table>
        ${whyFooter(letter.form.senderName)}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildMixtapeEmailHtml(mix: MixtapePayload, playUrl: string): string {
  const tracks = getTracksByIds(mix.trackIds);
  const hasMusic = tracks.length > 0;
  const preheader = `${mix.senderName} made you a mixtape: ${mix.title}`;

  const trackRows = tracks
    .map(
      (t, i) =>
        `<tr>
          <td style="padding:8px 10px;border-bottom:1px solid #cbb892;font-family:Georgia,serif;font-size:12px;color:#8b5e34;width:28px;">${i + 1}.</td>
          <td style="padding:8px 10px;border-bottom:1px solid #cbb892;">
            <div style="font-size:14px;color:#3d2f22;font-weight:bold;">${escapeHtml(t.title)}</div>
            <div style="font-size:11px;color:#7a654f;margin-top:2px;">${escapeHtml(t.artist)} · ${escapeHtml(t.year)}</div>
          </td>
        </tr>`
    )
    .join("");

  const dedication = mix.dedication.trim()
    ? `<div style="margin-top:16px;padding:14px 16px;background:#fff6df;border:1px dashed #d2a35a;border-radius:10px;font-size:14px;line-height:1.6;color:#3d2f22;font-style:italic;">
        “${escapeHtml(mix.dedication).replace(/\n/g, "<br />")}”
      </div>`
    : "";

  const playBlock = hasMusic
    ? `<tr>
            <td style="padding:18px 22px 6px;text-align:center;">
              <a href="${escapeHtml(playUrl)}" style="display:inline-block;background:#e8b86d;color:#3d2f22;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:8px;border:2px solid #8b5e34;">
                Play this mixtape
              </a>
              <div style="margin-top:10px;font-size:11px;color:#7a654f;">
                About 30 seconds of each song, then the next track
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 22px 8px;">
              <div style="font-size:11px;letter-spacing:1px;color:#8b5e34;margin-bottom:8px;">TRACKLIST</div>
              <table role="presentation" width="100%" style="background:#fffbf2;border:1px solid #d2a35a;border-radius:10px;overflow:hidden;">
                ${trackRows}
              </table>
            </td>
          </tr>`
    : `<tr>
            <td style="padding:18px 22px 6px;text-align:center;">
              <a href="${escapeHtml(playUrl)}" style="display:inline-block;background:#e8b86d;color:#3d2f22;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:8px;border:2px solid #8b5e34;">
                Open the cassette
              </a>
            </td>
          </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(mix.title)}</title>
</head>
<body style="margin:0;padding:0;background:#faf4e8;font-family:Georgia,'Times New Roman',serif;color:#3d2f22;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf4e8;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#fffbf2;border:2px solid #8b5e34;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#e8b86d;padding:18px 22px;text-align:center;">
              <div style="font-family:Georgia,serif;font-size:22px;color:#3d2f22;">A mixtape for you</div>
              <div style="font-size:12px;color:#5c3d1e;margin-top:4px;">Hand-labelled · Side A</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 22px 8px;">
              <div style="background:#fff6df;border:2px solid #d2a35a;border-radius:10px;padding:16px 18px;color:#3d2f22;">
                <div style="font-size:10px;letter-spacing:1px;color:#8b5e34;">CASSETTE LABEL</div>
                <div style="font-family:Georgia,serif;font-size:22px;margin-top:6px;">${escapeHtml(mix.title)}</div>
                <div style="font-size:12px;margin-top:6px;color:#5c3d1e;">
                  for <strong>${escapeHtml(mix.recipientName)}</strong> · from <strong>${escapeHtml(mix.senderName)}</strong>
                </div>
              </div>
              ${dedication}
            </td>
          </tr>
          ${playBlock}
          <tr>
            <td style="padding:18px 22px 26px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#7a654f;line-height:1.6;word-break:break-all;">
                ${escapeHtml(playUrl)}
              </p>
              <p style="margin:14px 0 0;font-size:12px;color:#7a654f;">
                Sent with care via Little Letter
              </p>
            </td>
          </tr>
        </table>
        ${whyFooter(mix.senderName)}
      </td>
    </tr>
  </table>
</body>
</html>`;
}
