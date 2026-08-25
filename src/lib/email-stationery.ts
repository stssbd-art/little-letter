import type { LetterStationery, LetterStationeryDecor } from "@/lib/letter-stationery";

/** Match site fonts (layout.tsx) as closely as email clients allow. */
export function stationeryFontStack(
  fontClass: LetterStationery["fontClass"]
): string {
  switch (fontClass) {
    case "font-script":
      return "'Great Vibes','Segoe Script','Apple Chancery',Georgia,cursive";
    case "font-pixel":
      return "'Press Start 2P','Courier New',Courier,monospace";
    default:
      return "Quicksand,Nunito,'Trebuchet MS',Verdana,sans-serif";
  }
}

export function stationeryDisplayStack() {
  return "Quicksand,Nunito,'Trebuchet MS',Verdana,sans-serif";
}

export function stationeryScriptStack() {
  return "'Great Vibes','Segoe Script','Apple Chancery',Georgia,cursive";
}

export function stationeryPixelStack() {
  return "'Press Start 2P','Courier New',Courier,monospace";
}

/** Same washes as StationeryPaper on the website. */
export function stationeryPaperWash(stationery: LetterStationery): string {
  const a = stationery.accent;
  switch (stationery.decor) {
    case "lace":
      return `radial-gradient(ellipse at 50% 0%, ${a}33, transparent 55%), linear-gradient(180deg, #faf3e6, #f3e6d0)`;
    case "deco":
      return `linear-gradient(135deg, #f4efe4 0%, #e8dfc8 50%, #f0e8d4 100%)`;
    case "roses":
      return `linear-gradient(180deg, #fff5f2, #ffe8e4 40%, #fff8f6)`;
    case "berries":
      return `linear-gradient(180deg, #fff6f8, #ffe8ee 45%, #fff8fa)`;
    case "story":
      return `linear-gradient(180deg, #f8fbff, #eef4fa 50%, #f7fafc)`;
    case "botanical":
      return `linear-gradient(160deg, #f5ecd8, #e8f0d8 40%, #f2ead8)`;
    case "hearts":
      return `radial-gradient(circle at 80% 10%, ${a}44, transparent 40%), linear-gradient(180deg, #fff0f3, #ffe4ea)`;
    case "cake":
      return `linear-gradient(180deg, #fffaf0, #fff3dc 50%, #fff8ec)`;
    case "birds":
      return `linear-gradient(180deg, #f8faf2, #eef4e4 50%, #f5f8ee)`;
    case "toys":
      return `linear-gradient(180deg, #fff8f0, #ffe8d4 45%, #fff4e8)`;
    case "moon":
      return `linear-gradient(180deg, #f7f5fc, #ebe8f8 45%, #f5f3fa)`;
    default:
      return `linear-gradient(180deg, ${stationery.paperBg}, #fff6df 55%, ${stationery.paperBg})`;
  }
}

type DecorBits = {
  caption: string;
  tl: string;
  tr: string;
  bl: string;
  br: string;
};

function decorBits(decor: LetterStationeryDecor): DecorBits {
  switch (decor) {
    case "lace":
      return { caption: "❦ · Victorian lace · ❦", tl: "🥀", tr: "🥀", bl: "✿", br: "✿" };
    case "deco":
      return { caption: "1920 · ART DECO · GLAM", tl: "◆", tr: "◆", bl: "◇", br: "◇" };
    case "roses":
      return { caption: "♥ 1950s love letter ♥", tl: "🌹", tr: "🌹", bl: "🥀", br: "💋" };
    case "berries":
      return { caption: "strawberry cloud mail", tl: "🍓", tr: "☁️", bl: "🌸", br: "✨" };
    case "story":
      return { caption: "Once upon a letter…", tl: "🌙", tr: "☁️", bl: "📖", br: "⭐" };
    case "botanical":
      return { caption: "pressed flowers · cottage", tl: "🦋", tr: "🌿", bl: "🌸", br: "🍃" };
    case "hearts":
      return { caption: "be my valentine", tl: "💘", tr: "💝", bl: "♡", br: "♥" };
    case "cake":
      return { caption: "happy birthday · vintage card", tl: "🎂", tr: "🎈", bl: "🎁", br: "✨" };
    case "birds":
      return { caption: "thank you · friendship post", tl: "🕊️", tr: "✉️", bl: "💌", br: "🕊️" };
    case "toys":
      return { caption: "teddy starlight", tl: "🧸", tr: "🏠", bl: "⭐", br: "🌟" };
    case "moon":
      return { caption: "moonlit tea · soft twilight", tl: "🫖", tr: "🌙", bl: "⭐", br: "✨" };
    default:
      return { caption: "a little letter for you", tl: "💌", tr: "✨", bl: "✦", br: "✦" };
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export type StationeryLetterEmailParts = {
  stationery: LetterStationery;
  subject: string;
  messageHtml: string;
  /** Raw message text — used to avoid duplicating an existing greeting */
  messageText: string;
  recipientName: string;
  senderName: string;
  occasionLabel: string;
  hasVoiceNote?: boolean;
  brandTagline: string;
};

/**
 * Email-safe HTML that mirrors StationeryPaper on the website:
 * paper wash, decor corners, caption, chrome strip, fonts, dashed letter box.
 */
export function buildStationeryLetterCardHtml(
  parts: StationeryLetterEmailParts
): string {
  const s = parts.stationery;
  const bits = decorBits(s.decor);
  const bodyFont = stationeryFontStack(s.fontClass);
  const displayFont = stationeryDisplayStack();
  const scriptFont = stationeryScriptStack();
  const pixelFont = stationeryPixelStack();
  const wash = stationeryPaperWash(s);
  const messageSize = s.fontClass === "font-pixel" ? "13px" : "16px";
  const messageLine = s.fontClass === "font-script" ? "1.9" : "1.75";

  const greeting = /^(dear|hi|hello|hey)\b/i.test(parts.messageText.trim())
    ? ""
    : `<p style="margin:0 0 12px;font-size:14px;color:${s.muted};font-style:italic;font-family:${displayFont};">
        Dear ${escapeHtml(parts.recipientName)},
      </p>`;

  const voice = parts.hasVoiceNote
    ? `<div style="margin-top:14px;padding:12px 14px;background:${s.stampColors.bg};border:2px dashed ${s.stampColors.border};border-radius:12px;font-size:13px;line-height:1.5;color:${s.ink};font-family:${displayFont};">
        🎙️ A voice note is attached — open the audio file in this email to hear it.
      </div>`
    : "";

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border:4px solid ${s.paperBorder};border-radius:18px;overflow:hidden;box-shadow:0 8px 0 ${s.paperBorder};">
  <tr>
    <td style="background-color:${s.paperBg};background-image:${wash};padding:10px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:2px solid ${s.paperBorder};border-radius:14px;background-color:transparent;">
        <tr>
          <td style="padding:10px 14px 0;text-align:center;">
            <p style="margin:0;font-size:12px;letter-spacing:0.4px;color:${s.accent};font-family:${displayFont};opacity:0.9;">
              ${escapeHtml(bits.caption)}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:36px;font-size:22px;line-height:1;vertical-align:top;">${bits.tl}</td>
                <td style="text-align:center;vertical-align:middle;">
                  <div style="font-size:20px;letter-spacing:3px;line-height:1;color:${s.accent};">${s.emoji} ${s.sealEmoji} ${s.emoji}</div>
                  <div style="font-family:${displayFont};font-size:24px;font-weight:700;color:${s.accent};margin-top:6px;">Little Letter</div>
                  <div style="font-family:${displayFont};font-size:12px;color:${s.muted};margin-top:4px;">${escapeHtml(parts.brandTagline)}</div>
                </td>
                <td style="width:36px;font-size:22px;line-height:1;text-align:right;vertical-align:top;">${bits.tr}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:2px solid ${s.paperBorder};border-radius:10px;background:rgba(255,255,255,0.72);">
              <tr>
                <td style="padding:10px 12px;">
                  <p style="margin:0;font-family:${pixelFont};font-size:9px;letter-spacing:0.6px;color:${s.accent};line-height:1.4;">
                    ${s.emoji} ${escapeHtml(s.title)}
                  </p>
                  <p style="margin:4px 0 0;font-family:${displayFont};font-size:11px;color:${s.muted};line-height:1.4;">
                    ${escapeHtml(s.era)} · ${escapeHtml(s.blurb)}
                  </p>
                </td>
                <td style="width:40px;text-align:center;font-size:22px;padding-right:10px;">${s.sealEmoji}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px 0;">
            <p style="margin:0;font-family:${displayFont};font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${s.accent};">
              ${escapeHtml(parts.occasionLabel)} letter
            </p>
            <p style="margin:8px 0 0;font-family:${displayFont};font-size:12px;color:${s.muted};line-height:1.55;">
              <span style="opacity:0.8;">To</span>
              <strong style="color:${s.ink};"> ${escapeHtml(parts.recipientName)}</strong>
              <span style="opacity:0.5;"> · </span>
              <span style="opacity:0.8;">From</span>
              <strong style="color:${s.ink};"> ${escapeHtml(parts.senderName)}</strong>
            </p>
            <h1 style="margin:12px 0 0;font-family:${displayFont};font-size:20px;line-height:1.35;font-weight:700;color:${s.accent};">
              ${escapeHtml(parts.subject)}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 16px 8px;">
            <div style="border:2px dashed ${s.paperBorder};border-radius:14px;background:rgba(255,255,255,0.55);padding:18px 16px;font-family:${bodyFont};font-size:${messageSize};line-height:${messageLine};color:${s.ink};">
              ${greeting}
              <div style="margin:0;">${parts.messageHtml}</div>
              <p style="margin:20px 0 0;text-align:right;font-size:18px;color:${s.accent};">${s.sealEmoji}</p>
              <p style="margin:2px 0 0;text-align:right;font-family:${scriptFont};font-size:22px;color:${s.accent};line-height:1.2;">
                — ${escapeHtml(parts.senderName)}
              </p>
            </div>
            ${voice}
          </td>
        </tr>
        <tr>
          <td style="padding:6px 12px 12px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:36px;font-size:20px;line-height:1;">${bits.bl}</td>
                <td style="text-align:center;font-size:16px;letter-spacing:5px;color:${s.accent};">${s.emoji} ✉️ ${s.sealEmoji}</td>
                <td style="width:36px;font-size:20px;line-height:1;text-align:right;">${bits.br}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

export const STATIONERY_EMAIL_FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Press+Start+2P&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />`;
