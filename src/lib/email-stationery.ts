import type { LetterStationery, LetterStationeryDecor } from "@/lib/letter-stationery";

/** Match site fonts (layout.tsx) as closely as email clients allow. */
export function stationeryFontStack(
  fontClass: LetterStationery["fontClass"]
): string {
  switch (fontClass) {
    case "font-script":
      return "'Great Vibes','Segoe Script','Apple Chancery','Brush Script MT',cursive";
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
  return "'Great Vibes','Segoe Script','Apple Chancery','Brush Script MT',cursive";
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

/** Lace-circle watermark like StationeryArt on the site (CSS-only for inbox support). */
function decorPattern(decor: LetterStationeryDecor, accent: string, border: string): string {
  switch (decor) {
    case "lace":
      return `radial-gradient(circle at 12px 12px, transparent 3px, ${accent}33 3.5px, ${accent}22 7px, transparent 8px)`;
    case "roses":
      return `repeating-linear-gradient(transparent, transparent 26px, ${border}55 26px, ${border}55 27px)`;
    case "story":
      return `repeating-linear-gradient(transparent, transparent 28px, ${border}66 28px, ${border}66 29px)`;
    case "toys":
      return `repeating-linear-gradient(45deg, ${accent}55 0 12px, transparent 12px 24px)`;
    case "berries":
      return `radial-gradient(circle at 18% 22%, #ffe0e8 0 28px, transparent 29px), radial-gradient(circle at 82% 18%, #fff 0 22px, transparent 23px), radial-gradient(circle at 70% 70%, #ffe8ee 0 34px, transparent 35px)`;
    case "hearts":
      return `radial-gradient(circle at 20% 25%, ${accent}55 0 6px, transparent 7px), radial-gradient(circle at 80% 22%, ${accent}44 0 5px, transparent 6px)`;
    case "moon":
      return `radial-gradient(circle at 78% 16%, #fff8d8 0 26px, transparent 28px), radial-gradient(circle at 18% 28%, #e8e4f8 0 14px, transparent 15px)`;
    default:
      return "none";
  }
}

function decorPatternSize(decor: LetterStationeryDecor): string {
  if (decor === "lace") return "24px 24px";
  if (decor === "roses" || decor === "story") return "100% 27px";
  if (decor === "toys") return "24px 24px";
  return "auto";
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
  messageText: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  hasVoiceNote?: boolean;
};

/**
 * Mirrors StationeryPaper on /preview — same chrome, lace/pattern, script body.
 * No separate “Little Letter” brand strip inside the paper (that’s only site chrome).
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
  const pattern = decorPattern(s.decor, s.accent, s.paperBorder);
  const patternSize = decorPatternSize(s.decor);
  const layeredBg =
    pattern === "none"
      ? wash
      : `${pattern}, ${wash}`;
  const messageSize = s.fontClass === "font-pixel" ? "13px" : s.fontClass === "font-script" ? "22px" : "16px";
  const messageLine = s.fontClass === "font-script" ? "1.85" : "1.75";

  const voice = parts.hasVoiceNote
    ? `<div style="margin-top:14px;padding:12px 14px;background:${s.stampColors.bg};border:2px dashed ${s.stampColors.border};border-radius:12px;font-size:13px;line-height:1.5;color:${s.ink};font-family:${displayFont};">
        🎙️ A voice note is attached — open the audio file in this email to hear it.
      </div>`
    : "";

  /*
   * Structure matches StationeryPaper:
   * outer border → patterned paper → caption → corners + chrome → subject → dashed letter body
   */
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border:3px solid ${s.paperBorder};border-radius:16px;overflow:hidden;box-shadow:6px 8px 0 rgba(61,47,34,0.16);">
  <tr>
    <td style="background-color:${s.paperBg};background-image:${layeredBg};background-size:${pattern === "none" ? "auto" : patternSize}, cover;padding:14px 12px 12px;">
      <!-- inner dashed frame (site inset border) -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:2px dashed ${s.paperBorder};border-radius:12px;">
        <tr>
          <td style="padding:12px 14px 0;text-align:center;">
            <p style="margin:0;font-size:13px;color:${s.accent};font-family:${displayFont};opacity:0.85;">
              ${escapeHtml(bits.caption)}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 10px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:28px;font-size:20px;line-height:1;vertical-align:top;">${bits.tl}</td>
                <td style="vertical-align:middle;padding:0 4px;">
                  <!-- chrome strip — same as StationeryPaper -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:2px solid ${s.paperBorder};border-radius:10px;background-color:rgba(255,255,255,0.72);">
                    <tr>
                      <td style="padding:10px 12px;">
                        <p style="margin:0;font-family:${pixelFont};font-size:10px;letter-spacing:0.8px;color:${s.accent};line-height:1.45;">
                          ${s.emoji} ${escapeHtml(s.title)}
                        </p>
                        <p style="margin:5px 0 0;font-family:${displayFont};font-size:11px;color:${s.muted};line-height:1.4;">
                          ${escapeHtml(s.era)} · ${escapeHtml(s.blurb)}
                        </p>
                      </td>
                      <td style="width:44px;text-align:center;font-size:24px;padding-right:8px;vertical-align:middle;">${s.sealEmoji}</td>
                    </tr>
                  </table>
                </td>
                <td style="width:28px;font-size:20px;line-height:1;text-align:right;vertical-align:top;">${bits.tr}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 18px 6px;">
            <p style="margin:0;font-family:${displayFont};font-size:16px;font-weight:700;line-height:1.35;color:${s.accent};">
              ${escapeHtml(parts.subject)}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 18px 14px;">
            <div style="border:1px dashed ${s.paperBorder};border-radius:12px;background-color:rgba(255,255,255,0.55);padding:18px 16px;">
              <p style="margin:0;font-family:${displayFont};font-size:12px;color:${s.muted};line-height:1.5;">
                To: ${escapeHtml(parts.recipientName)} &lt;${escapeHtml(parts.recipientEmail)}&gt;
              </p>
              <div style="margin:16px 0 0;font-family:${bodyFont};font-size:${messageSize};line-height:${messageLine};color:${s.ink};">
                ${parts.messageHtml}
              </div>
              <p style="margin:22px 0 0;text-align:right;font-family:${scriptFont};font-size:26px;color:${s.accent};line-height:1.15;">
                — ${escapeHtml(parts.senderName)}
              </p>
            </div>
            ${voice}
          </td>
        </tr>
        <tr>
          <td style="padding:0 10px 12px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:28px;font-size:18px;line-height:1;">${bits.bl}</td>
                <td style="text-align:center;font-size:12px;color:${s.muted};font-family:${displayFont};">&nbsp;</td>
                <td style="width:28px;font-size:18px;line-height:1;text-align:right;">${bits.br}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

/** Prefer @import inside <style> — more clients keep it than bare <link>. */
export const STATIONERY_EMAIL_FONT_STYLE = `<style type="text/css">
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Press+Start+2P&family=Quicksand:wght@500;600;700&display=swap');
</style>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Press+Start+2P&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />`;
