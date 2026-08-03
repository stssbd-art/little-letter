import type { GeneratedLetter } from "@/types";
import { OCCASIONS } from "@/lib/constants";

export function buildLetterEmailHtml(letter: GeneratedLetter): string {
  const occasion =
    OCCASIONS.find((o) => o.value === letter.form.occasion)?.emoji ?? "💌";
  const safeMessage = letter.message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${letter.subject}</title>
</head>
<body style="margin:0;padding:0;background:#fce7f3;font-family:'Trebuchet MS',Verdana,sans-serif;color:#4a3f55;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#fce7f3 0%,#e0f2fe 50%,#d1fae5 100%);padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#fffaf5;border:4px solid #f9a8d4;border-radius:18px;overflow:hidden;box-shadow:0 8px 0 #fbcfe8;">
          <tr>
            <td style="background:linear-gradient(90deg,#fda4af,#c4b5fd,#86efac);padding:18px 22px;text-align:center;">
              <div style="font-size:28px;letter-spacing:2px;">✨ ${occasion} ✨</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:#4c1d95;margin-top:6px;">Little Letter</div>
              <div style="font-size:12px;color:#6b21a8;margin-top:4px;">a tiny note flew across the internet for you</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 26px 10px;text-align:center;">
              <div style="display:inline-block;background:#fdf2f8;border:2px dashed #f9a8d4;border-radius:12px;padding:8px 14px;font-size:13px;color:#9d174d;">
                🌸 pixel hugs included 🌸
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 8px;">
              <h1 style="margin:0 0 14px;font-size:20px;color:#7c3aed;font-family:Georgia,serif;">
                For ${letter.form.recipientName}
              </h1>
              <div style="font-size:15px;line-height:1.7;color:#4a3f55;background:#fff;border:2px solid #e9d5ff;border-radius:14px;padding:20px;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;text-align:center;">
              <div style="font-size:22px;letter-spacing:6px;">🦋 💌 ⭐ 🌸 ☁️</div>
              <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
                Sent with care from <strong style="color:#db2777;">${letter.form.senderName}</strong><br />
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
