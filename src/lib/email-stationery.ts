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

/** Same washes as StationeryPaper on the website. */
export function stationeryPaperWash(stationery: LetterStationery): string {
  const a = stationery.accent;
  switch (stationery.decor) {
    case "blossom":
      return `radial-gradient(ellipse at 50% 0%, ${a}28, transparent 55%), linear-gradient(180deg, #fff8fb, #ffe8f0 45%, #fff6fa)`;
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
    case "halloween":
      return `linear-gradient(180deg, #fff6ea, #ffe0b8 42%, #fff1dc)`;
    case "halloween-ghost":
      return `linear-gradient(180deg, #f8f4ff, #efe6fa 45%, #f7f2ff)`;
    case "halloween-bats":
      return `linear-gradient(180deg, #2a1840 0%, #f7f1e8 38%, #fff6ea)`;
    default:
      return `linear-gradient(180deg, ${stationery.paperBg}, #fff6df 55%, ${stationery.paperBg})`;
  }
}

/** Lace-circle watermark like StationeryArt on the site (CSS-only for inbox support). */
function decorPattern(decor: LetterStationeryDecor, accent: string, border: string): string {
  switch (decor) {
    case "blossom":
      return `radial-gradient(circle at 16% 18%, #ffe4ec 0 18px, transparent 19px), radial-gradient(circle at 84% 14%, #fff 0 14px, transparent 15px), radial-gradient(circle at 72% 62%, #ffe8f0 0 22px, transparent 23px), radial-gradient(circle at 28% 72%, #ffd6e4 0 12px, transparent 13px)`;
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
    case "halloween":
      return `radial-gradient(circle at 78% 18%, #ffd27a 0 22px, transparent 24px), radial-gradient(circle at 18% 78%, #ffb347 0 16px, transparent 17px)`;
    case "halloween-ghost":
      return `radial-gradient(circle at 78% 16%, #fff 0 20px, transparent 22px), radial-gradient(circle at 20% 70%, ${accent}33 0 28px, transparent 29px)`;
    case "halloween-bats":
      return `radial-gradient(circle at 80% 18%, #ffb347 0 22px, transparent 24px)`;
    default:
      return "none";
  }
}

function decorPatternSize(decor: LetterStationeryDecor): string {
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
    case "blossom":
      return { caption: "cherry blossom · soft spring", tl: "🌸", tr: "🌸", bl: "💮", br: "✨" };
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
    case "halloween":
      return { caption: "pumpkin night · happy halloween", tl: "🎃", tr: "👻", bl: "🦇", br: "🍬" };
    case "halloween-ghost":
      return { caption: "ghost post · a gentle boo", tl: "👻", tr: "🌙", bl: "💜", br: "⭐" };
    case "halloween-bats":
      return { caption: "bat moon · under the night", tl: "🦇", tr: "🌙", bl: "🎃", br: "🦇" };
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
 * One sheet of paper in the inbox — no nested frames.
 * Stationery still changes the paper, ink, and seal. A soft flicker lives in
 * the style block; clients that ignore it just show a still letter.
 */
export function buildStationeryLetterCardHtml(
  parts: StationeryLetterEmailParts
): string {
  const s = parts.stationery;
  const bits = decorBits(s.decor);
  const bodyFont = stationeryFontStack(s.fontClass);
  const displayFont = stationeryDisplayStack();
  const scriptFont = stationeryScriptStack();
  const wash = stationeryPaperWash(s);
  const pattern = decorPattern(s.decor, s.accent, s.paperBorder);
  const patternSize = decorPatternSize(s.decor);
  const layeredBg = pattern === "none" ? wash : `${pattern}, ${wash}`;
  const messageSize =
    s.fontClass === "font-pixel" ? "13px" : s.fontClass === "font-script" ? "22px" : "17px";
  const messageLine = s.fontClass === "font-script" ? "1.85" : "1.75";

  const voice = parts.hasVoiceNote
    ? `<p style="margin:20px 0 0;font-family:${displayFont};font-size:13px;line-height:1.5;color:${s.muted};">
        🎙️ A voice note is attached — open the audio file in this email to hear it.
      </p>`
    : "";

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ll-sheet" style="max-width:560px;border:2px solid ${s.paperBorder};border-radius:22px;background-color:${s.paperBg};background-image:${layeredBg};background-size:${pattern === "none" ? "auto" : patternSize}, cover;">
  <tr>
    <td style="padding:32px 36px 28px;">
      <p style="margin:0;text-align:center;font-family:${scriptFont};font-size:26px;line-height:1.15;color:${s.accent};">
        <span class="ll-spark" style="font-family:${displayFont};font-size:12px;letter-spacing:1px;">${bits.tl}</span>
        &nbsp;${escapeHtml(bits.caption)}&nbsp;
        <span class="ll-spark ll-spark-late" style="font-family:${displayFont};font-size:12px;">${bits.tr}</span>
      </p>
      <p style="margin:18px 0 0;text-align:center;font-family:${displayFont};font-size:22px;font-weight:700;line-height:1.3;color:${s.ink};">
        ${escapeHtml(parts.subject)}
      </p>
      <table role="presentation" width="72%" align="center" cellspacing="0" cellpadding="0" style="margin:14px auto 0;">
        <tr>
          <td style="border-bottom:1px solid ${s.paperBorder};height:10px;font-size:0;line-height:0;">&nbsp;</td>
          <td width="36" align="center" class="ll-spark" style="width:36px;font-family:${displayFont};font-size:12px;line-height:1;color:${s.accent};">✦</td>
          <td style="border-bottom:1px solid ${s.paperBorder};height:10px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
      <p style="margin:16px 0 0;text-align:center;font-family:${displayFont};font-size:13px;line-height:1.4;color:${s.muted};">
        For ${escapeHtml(parts.recipientName)}
      </p>
      <div style="margin:22px 0 0;font-family:${bodyFont};font-size:${messageSize};line-height:${messageLine};color:${s.ink};">
        ${parts.messageHtml}
      </div>
      <p style="margin:26px 0 0;text-align:right;font-family:${scriptFont};font-size:32px;color:${s.accent};line-height:1.1;">
        — ${escapeHtml(parts.senderName)}
      </p>
      ${voice}
      <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin:26px auto 0;">
        <tr>
          <td class="ll-seal" align="center" width="64" height="64" style="width:64px;height:64px;border-radius:32px;background-color:${s.stampColors.bg};border:2px solid ${s.stampColors.border};font-size:26px;line-height:64px;color:${s.stampColors.ink};text-align:center;">
            ${s.sealEmoji}
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0;text-align:center;font-family:${displayFont};font-size:11px;line-height:1.45;letter-spacing:0.3px;color:${s.muted};">
        ${s.emoji} ${escapeHtml(s.title)} · ${escapeHtml(s.era)}
      </p>
    </td>
  </tr>
</table>`;
}

/** Prefer @import inside <style> — more clients keep it than bare <link>. */
export const STATIONERY_EMAIL_FONT_STYLE = `<style type="text/css">
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Press+Start+2P&family=Quicksand:wght@500;600;700&display=swap');
@media screen {
  .ll-spark { animation: ll-spark 2.8s ease-in-out infinite; }
  .ll-spark-late { animation-delay: 1.15s; }
  .ll-seal { animation: ll-seal 3.6s ease-in-out infinite; }
}
@keyframes ll-spark {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}
@keyframes ll-seal {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.72; }
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Press+Start+2P&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />`;
