import type { GeneratedLetter, MixtapePayload, Occasion } from "@/types";
import { OCCASIONS, SITE_URL } from "@/lib/constants";
import { getTracksByIds } from "@/lib/tracks";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type FrameTheme = {
  pageBg: string;
  cardBg: string;
  border: string;
  shadow: string;
  headerGrad: string;
  headerInk: string;
  headerSub: string;
  badgeBg: string;
  badgeBorder: string;
  badgeInk: string;
  titleInk: string;
  bodyInk: string;
  msgBorder: string;
  accent: string;
  badge: string;
  tagline: string;
  footerIcons: string;
  mission: string;
};

const THEMES: Record<Occasion, FrameTheme> = {
  birthday: {
    pageBg: "linear-gradient(180deg,#fff6df 0%,#ffe8c8 45%,#fde68a 100%)",
    cardBg: "#fffbf2",
    border: "#e8b86d",
    shadow: "#f6d58a",
    headerGrad: "linear-gradient(90deg,#f6d58a,#e8b86d,#fbbf24)",
    headerInk: "#3d2f22",
    headerSub: "#5c3d1e",
    badgeBg: "#fff6df",
    badgeBorder: "#e8b86d",
    badgeInk: "#8b5e34",
    titleInk: "#8b5e34",
    bodyInk: "#3d2f22",
    msgBorder: "#f6d58a",
    accent: "#b45309",
    badge: "🎂 make a wish · blow the candles 🎂",
    tagline: "a birthday note floated over for you",
    footerIcons: "🎈 🎁 ⭐ 🧁 🎉",
    mission: "If this made their day brighter, mission accomplished.",
  },
  love: {
    pageBg: "linear-gradient(180deg,#fff1f2 0%,#ffe4e6 50%,#faf4e8 100%)",
    cardBg: "#fffbf7",
    border: "#fb7185",
    shadow: "#fecdd3",
    headerGrad: "linear-gradient(90deg,#fb7185,#f472b6,#e8b86d)",
    headerInk: "#4c0519",
    headerSub: "#9f1239",
    badgeBg: "#fff1f2",
    badgeBorder: "#fb7185",
    badgeInk: "#be123c",
    titleInk: "#be123c",
    bodyInk: "#3d2f22",
    msgBorder: "#fecdd3",
    accent: "#be123c",
    badge: "♥ soft hearts enclosed · handle with care ♥",
    tagline: "a little love letter crossed the wires for you",
    footerIcons: "💌 🌹 ✨ 💕 🦋",
    mission: "If this made your heart flutter, the mission succeeded.",
  },
  friendship: {
    pageBg: "linear-gradient(180deg,#ecfdf5 0%,#faf4e8 55%,#d1fae5 100%)",
    cardBg: "#fffbf2",
    border: "#34d399",
    shadow: "#a7f3d0",
    headerGrad: "linear-gradient(90deg,#6ee7b7,#34d399,#e8b86d)",
    headerInk: "#064e3b",
    headerSub: "#047857",
    badgeBg: "#ecfdf5",
    badgeBorder: "#34d399",
    badgeInk: "#047857",
    titleInk: "#047857",
    bodyInk: "#3d2f22",
    msgBorder: "#a7f3d0",
    accent: "#047857",
    badge: "🤝 high-five energy included 🤝",
    tagline: "a buddy note hopped across the internet",
    footerIcons: "🌟 🤝 🍀 ☁️ ✨",
    mission: "If this made you smile like a best friend would, yes.",
  },
  "good-luck": {
    pageBg: "linear-gradient(180deg,#f0fdf4 0%,#faf4e8 50%,#dcfce7 100%)",
    cardBg: "#fffbf2",
    border: "#4ade80",
    shadow: "#bbf7d0",
    headerGrad: "linear-gradient(90deg,#86efac,#4ade80,#e8b86d)",
    headerInk: "#14532d",
    headerSub: "#166534",
    badgeBg: "#f0fdf4",
    badgeBorder: "#4ade80",
    badgeInk: "#166534",
    titleInk: "#166534",
    bodyInk: "#3d2f22",
    msgBorder: "#bbf7d0",
    accent: "#15803d",
    badge: "🍀 lucky charms packed inside 🍀",
    tagline: "good luck stardust, specially for you",
    footerIcons: "🍀 ⭐ 🌈 ✨ 🦋",
    mission: "May this nudge the universe in your favour.",
  },
  "thinking-of-you": {
    pageBg: "linear-gradient(180deg,#eef2ff 0%,#faf4e8 50%,#e0e7ff 100%)",
    cardBg: "#fffbf2",
    border: "#a5b4fc",
    shadow: "#c7d2fe",
    headerGrad: "linear-gradient(90deg,#a5b4fc,#818cf8,#e8b86d)",
    headerInk: "#312e81",
    headerSub: "#4338ca",
    badgeBg: "#eef2ff",
    badgeBorder: "#a5b4fc",
    badgeInk: "#4338ca",
    titleInk: "#4338ca",
    bodyInk: "#3d2f22",
    msgBorder: "#c7d2fe",
    accent: "#4338ca",
    badge: "🌈 you crossed my mind · soft wave 🌈",
    tagline: "someone paused to think of you today",
    footerIcons: "🌈 ☁️ 💭 ⭐ 🕊️",
    mission: "If this felt like a warm tap on the shoulder, perfect.",
  },
  "thank-you": {
    pageBg: "linear-gradient(180deg,#fffbeb 0%,#faf4e8 50%,#fef3c7 100%)",
    cardBg: "#fffbf2",
    border: "#f59e0b",
    shadow: "#fde68a",
    headerGrad: "linear-gradient(90deg,#fcd34d,#f59e0b,#e8b86d)",
    headerInk: "#78350f",
    headerSub: "#92400e",
    badgeBg: "#fffbeb",
    badgeBorder: "#f59e0b",
    badgeInk: "#92400e",
    titleInk: "#92400e",
    bodyInk: "#3d2f22",
    msgBorder: "#fde68a",
    accent: "#b45309",
    badge: "🌻 gratitude petals enclosed 🌻",
    tagline: "a thank-you note with sunshine folded in",
    footerIcons: "🌻 ✨ 💛 🍃 ⭐",
    mission: "If this felt appreciated right back, lovely.",
  },
  congratulations: {
    pageBg: "linear-gradient(180deg,#fdf4ff 0%,#faf4e8 50%,#fce7f3 100%)",
    cardBg: "#fffbf2",
    border: "#e879f9",
    shadow: "#f5d0fe",
    headerGrad: "linear-gradient(90deg,#f0abfc,#e879f9,#e8b86d)",
    headerInk: "#701a75",
    headerSub: "#a21caf",
    badgeBg: "#fdf4ff",
    badgeBorder: "#e879f9",
    badgeInk: "#a21caf",
    titleInk: "#a21caf",
    bodyInk: "#3d2f22",
    msgBorder: "#f5d0fe",
    accent: "#a21caf",
    badge: "🎉 confetti mode · you did it 🎉",
    tagline: "celebrate — this win deserves a letter",
    footerIcons: "🎉 🏆 ⭐ ✨ 🥳",
    mission: "If this felt like a standing ovation, yes.",
  },
  sorry: {
    pageBg: "linear-gradient(180deg,#eff6ff 0%,#faf4e8 55%,#dbeafe 100%)",
    cardBg: "#fffbf2",
    border: "#60a5fa",
    shadow: "#bfdbfe",
    headerGrad: "linear-gradient(90deg,#93c5fd,#60a5fa,#c4a574)",
    headerInk: "#1e3a8a",
    headerSub: "#1d4ed8",
    badgeBg: "#eff6ff",
    badgeBorder: "#60a5fa",
    badgeInk: "#1d4ed8",
    titleInk: "#1d4ed8",
    bodyInk: "#3d2f22",
    msgBorder: "#bfdbfe",
    accent: "#1d4ed8",
    badge: "💙 soft apology · gentle words 💙",
    tagline: "a sincere note, written carefully for you",
    footerIcons: "💙 🕊️ 🤍 ☁️ ✨",
    mission: "If this felt a little lighter, that was the hope.",
  },
};

function themeFor(occasion: Occasion): FrameTheme {
  return THEMES[occasion] ?? THEMES["thinking-of-you"];
}

function whyFooter(senderName: string, accent: string) {
  return `<p style="margin:18px 0 0;font-size:11px;color:#8a7a62;line-height:1.6;max-width:520px;">
    You received this because <strong>${escapeHtml(senderName)}</strong> sent you a personal note with
    <a href="${escapeHtml(SITE_URL)}" style="color:${accent};">Little Letter</a>.
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
  const tracks = getTracksByIds(mix.trackIds, mix.customTracks);
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
  const meta = OCCASIONS.find((o) => o.value === letter.form.occasion);
  const emoji = meta?.emoji ?? "💌";
  const label = meta?.label ?? "Note";
  const theme = themeFor(letter.form.occasion);
  const safeMessage = escapeHtml(letter.message).replace(/\n/g, "<br />");
  const preheader = `${letter.form.senderName} sent you a ${label.toLowerCase()} letter on Little Letter.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(letter.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#faf4e8;font-family:'Trebuchet MS',Verdana,sans-serif;color:${theme.bodyInk};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${theme.pageBg};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:${theme.cardBg};border:4px solid ${theme.border};border-radius:18px;overflow:hidden;box-shadow:0 8px 0 ${theme.shadow};">
          <tr>
            <td style="background:${theme.headerGrad};padding:18px 22px;text-align:center;">
              <div style="font-size:28px;letter-spacing:2px;">✨ ${emoji} ✨</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:${theme.headerInk};margin-top:6px;">Little Letter</div>
              <div style="font-size:12px;color:${theme.headerSub};margin-top:4px;">${theme.tagline}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 26px 8px;text-align:center;">
              <div style="display:inline-block;background:${theme.badgeBg};border:2px dashed ${theme.badgeBorder};border-radius:12px;padding:8px 14px;font-size:13px;color:${theme.badgeInk};">
                ${theme.badge}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 8px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:1px;color:${theme.accent};text-transform:uppercase;">
                ${escapeHtml(label)} · category frame
              </p>
              <h1 style="margin:0 0 14px;font-size:20px;color:${theme.titleInk};font-family:Georgia,serif;">
                For ${escapeHtml(letter.form.recipientName)}
              </h1>
              <div style="font-size:15px;line-height:1.7;color:${theme.bodyInk};background:#fff;border:2px solid ${theme.msgBorder};border-radius:14px;padding:20px;">
                ${safeMessage}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;text-align:center;">
              <div style="font-size:22px;letter-spacing:6px;">${theme.footerIcons}</div>
              <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
                Sent with care from <strong style="color:${theme.accent};">${escapeHtml(letter.form.senderName)}</strong><br />
                via Little Letter — cosy notes for cosy people
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-size:11px;color:#9ca3af;">
          ✉️ ${theme.mission}
        </p>
        ${whyFooter(letter.form.senderName, theme.accent)}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildMixtapeEmailHtml(mix: MixtapePayload, playUrl: string): string {
  const tracks = getTracksByIds(mix.trackIds, mix.customTracks);
  const hasMusic = tracks.length > 0;
  const preheader = `${mix.senderName} made you a mixtape: ${mix.title}`;

  const trackRows = tracks
    .map(
      (t, i) =>
        `<tr>
          <td style="padding:8px 10px;border-bottom:1px dashed #cbb892;font-family:monospace;font-size:12px;color:#f6d58a;width:28px;">${i + 1}.</td>
          <td style="padding:8px 10px;border-bottom:1px dashed #cbb892;">
            <div style="font-size:14px;color:#fff6df;font-weight:bold;">${escapeHtml(t.title)}</div>
            <div style="font-size:11px;color:#cbb892;margin-top:2px;">${escapeHtml(t.artist)} · ${escapeHtml(t.year)}</div>
          </td>
        </tr>`
    )
    .join("");

  const dedication = mix.dedication.trim()
    ? `<div style="margin-top:16px;padding:14px 16px;background:#fff6df;border:2px dashed #d2a35a;border-radius:12px;font-size:14px;line-height:1.6;color:#3d2f22;font-style:italic;">
        “${escapeHtml(mix.dedication).replace(/\n/g, "<br />")}”
      </div>`
    : "";

  const playBlock = hasMusic
    ? `<tr>
            <td style="padding:18px 22px 6px;text-align:center;">
              <a href="${escapeHtml(playUrl)}" style="display:inline-block;background:linear-gradient(180deg,#f6d58a,#e8b86d);color:#3d2f22;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:999px;border:3px solid #8b5e34;box-shadow:0 4px 0 #5c3d1e;">
                ▶ Play this mixtape
              </a>
              <div style="margin-top:10px;font-size:11px;color:#cbb892;">
                Romantic mix — ~30 seconds of each original song
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
          </tr>`
    : `<tr>
            <td style="padding:18px 22px 6px;text-align:center;">
              <a href="${escapeHtml(playUrl)}" style="display:inline-block;background:linear-gradient(180deg,#f6d58a,#e8b86d);color:#3d2f22;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:999px;border:3px solid #8b5e34;box-shadow:0 4px 0 #5c3d1e;">
                📼 Open the cassette
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
<body style="margin:0;padding:0;background:#1c1610;font-family:'Trebuchet MS',Verdana,sans-serif;color:#f5ecd9;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#2a2218 0%,#1c1610 55%,#241c14 100%);padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#322a22;border:4px solid #8b5e34;border-radius:18px;overflow:hidden;box-shadow:0 10px 0 #1a1510;">
          <tr>
            <td style="background:linear-gradient(90deg,#5c3d1e,#8b5e34,#6b4f36);padding:18px 22px;text-align:center;">
              <div style="font-size:26px;letter-spacing:3px;">📼</div>
              <div style="font-family:Georgia,serif;font-size:22px;color:#fff6df;margin-top:6px;">A mixtape for you</div>
              <div style="font-size:12px;color:#f6d58a;margin-top:4px;">hand-labelled · Side A · ${hasMusic ? "30-sec romantic mix" : "note only"}</div>
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
          ${playBlock}
          <tr>
            <td style="padding:18px 22px 26px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbb892;line-height:1.6;">
                Hit play and listen to the mix — about 30 seconds of each original song.
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
        ${whyFooter(mix.senderName, "#e8b86d")}
      </td>
    </tr>
  </table>
</body>
</html>`;
}
