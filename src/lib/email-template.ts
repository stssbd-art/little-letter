import type { GeneratedLetter, MixtapePayload, Occasion } from "@/types";
import { OCCASIONS, SITE_URL } from "@/lib/constants";
import { getTracksByIds } from "@/lib/tracks";
import {
  getCardDesign,
  isCardDesignId,
} from "@/lib/card-designs";
import {
  getLetterStationery,
} from "@/lib/letter-stationery";

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
    pageBg: "linear-gradient(180deg,#fff6df 0%,#faf4e8 50%,#ffe8a3 100%)",
    cardBg: "#fffbf2",
    border: "#d2a35a",
    shadow: "#e6c98a",
    headerGrad: "linear-gradient(90deg,#f6d58a,#e8b86d,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#8b5e34",
    badgeBg: "#fff6df",
    badgeBorder: "#d2a35a",
    badgeInk: "#8b5e34",
    titleInk: "#8b5e34",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#8b5e34",
    badge: "make a wish · soft birthday glow",
    tagline: "a birthday note floated over for you",
    footerIcons: "🎂 ⭐ 🎁 ✨ 🧁",
    mission: "If this made their day brighter, mission accomplished.",
  },
  love: {
    pageBg: "linear-gradient(180deg,#fffbf2 0%,#faf4e8 50%,#fff6df 100%)",
    cardBg: "#fffbf2",
    border: "#c4a574",
    shadow: "#e6d5b0",
    headerGrad: "linear-gradient(90deg,#e8b86d,#c4a574,#a3b875)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#fff6df",
    badgeBorder: "#cbb892",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#6b4f36",
    badge: "soft hearts enclosed · handle with care",
    tagline: "a little love letter crossed the wires for you",
    footerIcons: "💌 ✨ ⭐ 🌈 ☁️",
    mission: "If this made your heart flutter, the mission succeeded.",
  },
  friendship: {
    pageBg: "linear-gradient(180deg,#f5f7ec 0%,#faf4e8 55%,#e8efd4 100%)",
    cardBg: "#fffbf2",
    border: "#a3b875",
    shadow: "#d7e3b8",
    headerGrad: "linear-gradient(90deg,#c5d4a0,#a3b875,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#6f8a45",
    badgeBg: "#f3f6e8",
    badgeBorder: "#a3b875",
    badgeInk: "#6f8a45",
    titleInk: "#6f8a45",
    bodyInk: "#3d2f22",
    msgBorder: "#d7e3b8",
    accent: "#6f8a45",
    badge: "high-five energy included",
    tagline: "a buddy note hopped across the internet",
    footerIcons: "🤝 ⭐ ☁️ ✨ 🌟",
    mission: "If this made you smile like a best friend would, yes.",
  },
  "good-luck": {
    pageBg: "linear-gradient(180deg,#f3f6e8 0%,#faf4e8 50%,#e8efd4 100%)",
    cardBg: "#fffbf2",
    border: "#c5d4a0",
    shadow: "#d7e3b8",
    headerGrad: "linear-gradient(90deg,#d7e3b8,#c5d4a0,#e8b86d)",
    headerInk: "#3d2f22",
    headerSub: "#6f8a45",
    badgeBg: "#f3f6e8",
    badgeBorder: "#c5d4a0",
    badgeInk: "#6f8a45",
    titleInk: "#6f8a45",
    bodyInk: "#3d2f22",
    msgBorder: "#d7e3b8",
    accent: "#6f8a45",
    badge: "lucky charms packed inside",
    tagline: "good luck stardust, specially for you",
    footerIcons: "🍀 ⭐ ✨ 🌈 ☁️",
    mission: "May this nudge the universe in your favour.",
  },
  "thinking-of-you": {
    pageBg: "linear-gradient(180deg,#f7f1e4 0%,#faf4e8 50%,#efe6d4 100%)",
    cardBg: "#fffbf2",
    border: "#cbb892",
    shadow: "#e6d5b0",
    headerGrad: "linear-gradient(90deg,#e6c98a,#cbb892,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#fff6df",
    badgeBorder: "#cbb892",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6d5b0",
    accent: "#6b4f36",
    badge: "you crossed my mind · soft wave",
    tagline: "someone paused to think of you today",
    footerIcons: "☁️ 💭 ⭐ ✨ 🕊️",
    mission: "If this felt like a warm tap on the shoulder, perfect.",
  },
  "thank-you": {
    pageBg: "linear-gradient(180deg,#fff6df 0%,#faf4e8 50%,#ffe8a3 100%)",
    cardBg: "#fffbf2",
    border: "#e8b86d",
    shadow: "#f6d58a",
    headerGrad: "linear-gradient(90deg,#ffe8a3,#f6d58a,#e8b86d)",
    headerInk: "#3d2f22",
    headerSub: "#8b5e34",
    badgeBg: "#fff6df",
    badgeBorder: "#e8b86d",
    badgeInk: "#8b5e34",
    titleInk: "#8b5e34",
    bodyInk: "#3d2f22",
    msgBorder: "#f6d58a",
    accent: "#8b5e34",
    badge: "gratitude petals enclosed",
    tagline: "a thank-you note with sunshine folded in",
    footerIcons: "🌻 ✨ ⭐ 🍃 ☁️",
    mission: "If this felt appreciated right back, lovely.",
  },
  congratulations: {
    pageBg: "linear-gradient(180deg,#fffbf2 0%,#faf4e8 50%,#f3f6e8 100%)",
    cardBg: "#fffbf2",
    border: "#c4a574",
    shadow: "#e6c98a",
    headerGrad: "linear-gradient(90deg,#f6d58a,#c4a574,#a3b875)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#fff6df",
    badgeBorder: "#c4a574",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#6b4f36",
    badge: "celebrate · you did it",
    tagline: "this win deserves a letter",
    footerIcons: "🎉 ⭐ ✨ 🏆 🌟",
    mission: "If this felt like a standing ovation, yes.",
  },
  sorry: {
    pageBg: "linear-gradient(180deg,#f7f1e4 0%,#faf4e8 55%,#efe6d4 100%)",
    cardBg: "#fffbf2",
    border: "#cbb892",
    shadow: "#e6d5b0",
    headerGrad: "linear-gradient(90deg,#e6d5b0,#cbb892,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#f7f1e4",
    badgeBorder: "#cbb892",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6d5b0",
    accent: "#6b4f36",
    badge: "soft apology · gentle words",
    tagline: "a sincere note, written carefully for you",
    footerIcons: "🕊️ 🤍 ☁️ ✨ ⭐",
    mission: "If this felt a little lighter, that was the hope.",
  },
  wedding: {
    pageBg: "linear-gradient(180deg,#fffbf2 0%,#faf4e8 50%,#fff6df 100%)",
    cardBg: "#fffbf2",
    border: "#d2a35a",
    shadow: "#e6c98a",
    headerGrad: "linear-gradient(90deg,#f6d58a,#e8b86d,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#8b5e34",
    badgeBg: "#fff6df",
    badgeBorder: "#d2a35a",
    badgeInk: "#8b5e34",
    titleInk: "#8b5e34",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#8b5e34",
    badge: "vows · petals · forever starts here",
    tagline: "a wedding wish crossed the wires for you",
    footerIcons: "💒 ✨ 🕊️ ⭐ 🥂",
    mission: "If this felt like a toast from afar, perfect.",
  },
  graduation: {
    pageBg: "linear-gradient(180deg,#f3f6e8 0%,#faf4e8 50%,#e8efd4 100%)",
    cardBg: "#fffbf2",
    border: "#a3b875",
    shadow: "#d7e3b8",
    headerGrad: "linear-gradient(90deg,#c5d4a0,#a3b875,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#6f8a45",
    badgeBg: "#f3f6e8",
    badgeBorder: "#a3b875",
    badgeInk: "#6f8a45",
    titleInk: "#6f8a45",
    bodyInk: "#3d2f22",
    msgBorder: "#d7e3b8",
    accent: "#6f8a45",
    badge: "caps off · you earned this",
    tagline: "a graduation cheer for the next chapter",
    footerIcons: "🎓 ⭐ 📜 ✨ 🌟",
    mission: "If this felt like a proud standing ovation, yes.",
  },
  promotion: {
    pageBg: "linear-gradient(180deg,#fff6df 0%,#faf4e8 50%,#efe6d4 100%)",
    cardBg: "#fffbf2",
    border: "#d2a35a",
    shadow: "#e6c98a",
    headerGrad: "linear-gradient(90deg,#f6d58a,#d2a35a,#c4a574)",
    headerInk: "#3d2f22",
    headerSub: "#8b5e34",
    badgeBg: "#fff6df",
    badgeBorder: "#d2a35a",
    badgeInk: "#8b5e34",
    titleInk: "#8b5e34",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#8b5e34",
    badge: "level up · new chapter unlocked",
    tagline: "a promotion cheer with soft sparkle",
    footerIcons: "⭐ ✨ 💼 🌟 🥂",
    mission: "If this felt like a high-five at work, lovely.",
  },
  "valentines-day": {
    pageBg: "linear-gradient(180deg,#fffbf2 0%,#faf4e8 50%,#fff6df 100%)",
    cardBg: "#fffbf2",
    border: "#c4a574",
    shadow: "#e6d5b0",
    headerGrad: "linear-gradient(90deg,#e8b86d,#c4a574,#a3b875)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#fff6df",
    badgeBorder: "#cbb892",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#6b4f36",
    badge: "valentine soft · heart enclosed",
    tagline: "a Valentine note made just for you",
    footerIcons: "💌 ✨ ⭐ 🌈 ☁️",
    mission: "If this made your heart flutter, mission succeeded.",
  },
  "mothers-day": {
    pageBg: "linear-gradient(180deg,#fff6df 0%,#faf4e8 50%,#f3f6e8 100%)",
    cardBg: "#fffbf2",
    border: "#cbb892",
    shadow: "#e6d5b0",
    headerGrad: "linear-gradient(90deg,#f6d58a,#cbb892,#a3b875)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#fff6df",
    badgeBorder: "#cbb892",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6d5b0",
    accent: "#6b4f36",
    badge: "for mum · with all the soft thanks",
    tagline: "a Mother's Day note wrapped in warmth",
    footerIcons: "🌻 ✨ ⭐ 🍃 🌈",
    mission: "If this felt like a hug from afar, perfect.",
  },
  "fathers-day": {
    pageBg: "linear-gradient(180deg,#f7f1e4 0%,#faf4e8 50%,#efe6d4 100%)",
    cardBg: "#fffbf2",
    border: "#c4a574",
    shadow: "#e6c98a",
    headerGrad: "linear-gradient(90deg,#e6c98a,#c4a574,#8b5e34)",
    headerInk: "#3d2f22",
    headerSub: "#6b4f36",
    badgeBg: "#f7f1e4",
    badgeBorder: "#c4a574",
    badgeInk: "#6b4f36",
    titleInk: "#6b4f36",
    bodyInk: "#3d2f22",
    msgBorder: "#e6c98a",
    accent: "#6b4f36",
    badge: "for dad · steady love enclosed",
    tagline: "a Father's Day note with quiet pride",
    footerIcons: "⭐ ☕ ✨ 🌟 ☁️",
    mission: "If this felt appreciated right back, lovely.",
  },
};

function themeFor(occasion: Occasion): FrameTheme {
  return THEMES[occasion] ?? THEMES["thinking-of-you"];
}

/** Common inbox-safe emoji for the Open your card button. */
function cardOpenEmoji(designId: string): string {
  const byId: Record<string, string> = {
    "balloon-bash": "🎈",
    "cake-candles": "🎂",
    "confetti-pop": "🎊",
    "blush-hearts": "💕",
    "rose-garden": "🌹",
    "starlit-love": "🌙",
    "buddy-highfive": "🤝",
    "rainbow-note": "🌈",
    "clover-luck": "🍀",
    "sunflower-thanks": "🌻",
    "sparkler-congrats": "🎉",
    "soft-sorry": "💙",
    "wedding-rings": "💒",
    "cap-toss": "🎓",
    "promo-rocket": "🚀",
    "valentine-box": "💝",
    "tulip-mum": "🌷",
    "tie-dad": "👔",
    "honey-classic": "💌",
    "moon-whisper": "🌙",
    "pearl-locket": "🤍",
    "daisy-duo": "🌼",
    "ivory-veil": "💐",
  };
  return byId[designId] ?? "💌";
}

function themeForLetter(letter: GeneratedLetter): FrameTheme {
  const base = themeFor(letter.form.occasion);
  const designId = letter.form.cardDesign;
  if (designId && isCardDesignId(designId)) {
    const design = getCardDesign(designId);
    return {
      ...base,
      pageBg: design.pageBg,
      cardBg: design.cardBg,
      border: design.border,
      shadow: design.border,
      headerGrad: `linear-gradient(90deg,${design.border},${design.accent})`,
      headerInk: design.ink,
      headerSub: design.muted,
      badgeBg: design.cardBg,
      badgeBorder: design.border,
      badgeInk: design.accent,
      titleInk: design.accent,
      bodyInk: design.ink,
      msgBorder: design.border,
      accent: design.accent,
      badge: design.badge,
      tagline: design.blurb,
      footerIcons: design.sparkles.join(" "),
    };
  }

  /* Letters always pick up stationery colours (classic-honey included). */
  const s = getLetterStationery(letter.form.stationery);
  return {
    ...base,
    pageBg: `linear-gradient(180deg,${s.envelopeBack[0]} 0%,#faf4e8 45%,${s.envelopeFront[1]}33 100%)`,
    cardBg: s.paperBg,
    border: s.envelopeStroke,
    shadow: s.envelopeFront[1],
    headerGrad: `linear-gradient(90deg,${s.envelopeBack[0]},${s.envelopeBack[1]},${s.envelopeFront[0]})`,
    headerInk: s.ink,
    headerSub: s.muted,
    badgeBg: s.stampColors.bg,
    badgeBorder: s.stampColors.border,
    badgeInk: s.stampColors.ink,
    titleInk: s.accent,
    bodyInk: s.ink,
    msgBorder: s.paperBorder,
    accent: s.accent,
    badge:
      s.id === "classic-honey"
        ? base.badge
        : `${s.emoji} ${s.title} · ${s.era}`,
    tagline: s.id === "classic-honey" ? base.tagline : s.blurb,
    footerIcons: `${s.emoji} ✉️ ${s.sealEmoji} ✨`,
  };
}

/** Email-safe perforated postage stamp (matches the preview stamp). */
function postageStampHtml(letter: GeneratedLetter) {
  const s = getLetterStationery(letter.form.stationery);
  return `<div style="display:inline-block;transform:rotate(-6deg);vertical-align:top;">
    <div style="position:relative;width:58px;padding:6px 5px 5px;background:${s.stampColors.bg};color:${s.stampColors.ink};border:2px solid ${s.stampColors.border};box-shadow:2px 2px 0 rgba(61,47,34,0.16);font-family:Georgia,'Times New Roman',serif;text-align:center;background-image:radial-gradient(circle at 0 0,transparent 3px,${s.stampColors.bg} 3.5px),radial-gradient(circle at 100% 0,transparent 3px,${s.stampColors.bg} 3.5px),radial-gradient(circle at 0 100%,transparent 3px,${s.stampColors.bg} 3.5px),radial-gradient(circle at 100% 100%,transparent 3px,${s.stampColors.bg} 3.5px);background-size:10px 10px;background-position:-5px -5px,-5px -5px,-5px -5px,-5px -5px;">
      <div style="border:1px solid ${s.stampColors.border};padding:4px 3px 3px;">
        <div style="font-size:7px;letter-spacing:0.8px;opacity:0.85;">LITTLE LETTER</div>
        <div style="margin:4px auto;width:34px;height:28px;line-height:28px;background:#fffef8;border:1px solid ${s.stampColors.border};font-size:16px;">${s.emoji}</div>
        <div style="font-size:11px;font-weight:bold;letter-spacing:0.3px;">${escapeHtml(s.stampLabel)}</div>
      </div>
    </div>
  </div>`;
}

function whyFooter(senderName: string, accent: string) {
  return `<p style="margin:18px 0 0;font-size:11px;color:#8a7a62;line-height:1.6;max-width:520px;">
    You received this because <strong>${escapeHtml(senderName)}</strong> sent you a personal note with
    <a href="${escapeHtml(SITE_URL)}" style="color:${accent};">Little Letter</a>.
    This is a one-off message, not a mailing list.
  </p>
  <p style="margin:10px 0 0;font-size:11px;color:#8a7a62;line-height:1.6;max-width:520px;">
    <strong style="color:${accent};">Please don’t reply to this email</strong> — replies won’t reach
    ${escapeHtml(senderName)}. This is a no-reply delivery from Little Letter.
  </p>`;
}

const NO_REPLY_TEXT =
  "Please don’t reply to this email — replies won’t reach the sender. This is a no-reply delivery from Little Letter.";

function voiceNoteHtml() {
  return `<div style="margin-top:16px;padding:12px 14px;background:#fff6df;border:2px dashed #d2a35a;border-radius:12px;font-size:13px;line-height:1.5;color:#5c3d1e;">
    🎙️ A voice note is attached — open the audio file in this email to hear it.
  </div>`;
}

export function buildLetterEmailText(
  letter: GeneratedLetter,
  hasVoiceNote = false,
  opts?: { openUrl?: string }
): string {
  const isCard = Boolean(
    letter.form.cardDesign && isCardDesignId(letter.form.cardDesign)
  );
  if (isCard && opts?.openUrl) {
    return [
      `${letter.form.senderName} sent you a digital card on Little Letter.`,
      "",
      `Open your animated card here:`,
      opts.openUrl,
      "",
      hasVoiceNote ? "A voice note is also attached to this email.\n" : "",
      "Please don’t reply to this email — replies won’t reach the sender.",
      `Sent with Little Letter (${SITE_URL})`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Little Letter for ${letter.form.recipientName}`,
    "",
    letter.message,
    hasVoiceNote ? "\nA voice note is attached to this email.\n" : "",
    `— ${letter.form.senderName}`,
    "",
    `Sent with Little Letter (${SITE_URL})`,
    "This is a personal one-off message, not a newsletter.",
    NO_REPLY_TEXT,
  ].join("\n");
}

export function buildMixtapeEmailText(
  mix: MixtapePayload,
  playUrl: string,
  hasVoiceNote = false
): string {
  const tracks = getTracksByIds(mix.trackIds, mix.customTracks);
  const list = tracks
    .map((t, i) => `${i + 1}. ${t.title} — ${t.artist} (${t.year})`)
    .join("\n");

  return [
    `A mixtape for ${mix.recipientName}: ${mix.title}`,
    `From: ${mix.senderName}`,
    mix.dedication.trim() ? `\n“${mix.dedication.trim()}”\n` : "",
    hasVoiceNote ? "A voice note is attached to this email.\n" : "",
    list ? `Tracklist:\n${list}\n` : "",
    `Play your mixtape:\n${playUrl}`,
    "",
    `Sent with Little Letter (${SITE_URL})`,
    "This is a personal one-off message, not a newsletter.",
    NO_REPLY_TEXT,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildLetterEmailHtml(
  letter: GeneratedLetter,
  hasVoiceNote = false,
  opts?: { openUrl?: string }
): string {
  const meta = OCCASIONS.find((o) => o.value === letter.form.occasion);
  const design =
    letter.form.cardDesign && isCardDesignId(letter.form.cardDesign)
      ? getCardDesign(letter.form.cardDesign)
      : null;
  const label = design?.title ?? meta?.label ?? "Note";
  const theme = themeForLetter(letter);
  const stationery = !design
    ? getLetterStationery(letter.form.stationery)
    : null;

  const safeMessage = escapeHtml(letter.message).replace(/\n/g, "<br />");
  const safeSubject = escapeHtml(letter.subject);
  const preheader = `${letter.form.senderName} sent you a ${design ? "digital card" : `${(meta?.label ?? "note").toLowerCase()} letter`} on Little Letter.`;

  const openUrl = opts?.openUrl?.trim() || "";

  // Digital cards: plain open-on-web teaser (full animated card is on the website)
  const cardBody =
    design && openUrl
      ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:420px;background:${design.cardBg};border:4px solid ${design.border};border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:28px 24px;text-align:center;background:${design.cardBg};">
              <p style="margin:0;font-size:11px;letter-spacing:1.5px;color:${design.accent};text-transform:uppercase;">
                Digital card
              </p>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${design.accent};margin-top:10px;font-weight:bold;line-height:1.25;">
                ${escapeHtml(design.title)}
              </div>
              <p style="margin:14px 0 0;font-size:15px;color:${design.ink};line-height:1.5;">
                ${escapeHtml(letter.form.senderName)} sent you a card
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:${design.muted};">
                For ${escapeHtml(letter.form.recipientName)}
              </p>
              <p style="margin:16px 0 0;font-size:14px;color:${design.muted};line-height:1.55;">
                Open it on the Little Letter website to see your illustrated card and message.
              </p>
              ${hasVoiceNote ? voiceNoteHtml() : ""}
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px auto 0;">
                <tr>
                  <td style="border-radius:12px;background:${design.accent};">
                    <a href="${escapeHtml(openUrl)}" style="display:inline-block;padding:14px 28px;font-family:Georgia,serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;line-height:1.35;">
                      <span style="font-size:20px;line-height:1;vertical-align:middle;">${cardOpenEmoji(design.id)}</span>
                      &nbsp;Open your card&nbsp;
                      <span style="font-size:18px;line-height:1;vertical-align:middle;">💌</span>
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:11px;color:${design.muted};line-height:1.5;word-break:break-all;">
                Or paste this link:<br />
                <a href="${escapeHtml(openUrl)}" style="color:${design.accent};">${escapeHtml(openUrl)}</a>
              </p>
              <p style="margin:18px 0 0;font-size:11px;color:${design.muted};line-height:1.5;">
                Please don’t reply to this email — replies won’t reach ${escapeHtml(letter.form.senderName)}.
              </p>
            </td>
          </tr>
        </table>`
      : design
        ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:420px;background:${design.cardBg};border:4px solid ${design.border};border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:22px 24px;background:${design.cardBg};">
              <h1 style="margin:0 0 6px;font-size:20px;color:${design.accent};font-family:Georgia,serif;">
                ${safeSubject}
              </h1>
              <p style="margin:0 0 16px;font-size:13px;color:${design.muted};">
                For ${escapeHtml(letter.form.recipientName)}
              </p>
              <div style="font-size:15px;line-height:1.75;color:${design.ink};border-top:2px dashed ${design.border};padding-top:16px;font-family:Georgia,'Times New Roman',serif;">
                ${safeMessage}
              </div>
              ${hasVoiceNote ? voiceNoteHtml() : ""}
              <p style="margin:20px 0 0;text-align:right;font-family:Georgia,serif;font-size:15px;color:${design.accent};">
                — ${escapeHtml(letter.form.senderName)}
              </p>
            </td>
          </tr>
        </table>`
      : `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${theme.cardBg};border:4px solid ${theme.border};border-radius:18px;overflow:hidden;box-shadow:0 8px 0 ${theme.shadow};">
          <tr>
            <td style="background:${theme.headerGrad};padding:16px 22px 14px;text-align:center;">
              <div style="font-size:20px;letter-spacing:3px;line-height:1;">✨ 💌 ✨</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:${theme.headerInk};margin-top:6px;font-weight:bold;">Little Letter</div>
              <div style="font-size:12px;color:${theme.headerSub};margin-top:4px;">${theme.tagline}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 22px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align:top;padding-right:12px;">
                    <div style="display:inline-block;background:${theme.badgeBg};border:2px dashed ${theme.badgeBorder};border-radius:12px;padding:7px 12px;font-size:12px;color:${theme.badgeInk};line-height:1.35;">
                      ${theme.badge}
                    </div>
                    <p style="margin:10px 0 0;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${theme.accent};">
                      ${escapeHtml(label)} letter
                    </p>
                  </td>
                  <td style="width:70px;text-align:right;vertical-align:top;">
                    ${postageStampHtml(letter)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 22px 8px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-bottom:2px dotted ${theme.msgBorder};padding-bottom:10px;margin-bottom:4px;">
                <tr>
                  <td style="font-size:12px;color:${theme.headerSub};line-height:1.55;">
                    <span style="opacity:0.75;">To</span>
                    <strong style="color:${theme.bodyInk};"> ${escapeHtml(letter.form.recipientName)}</strong>
                    <span style="opacity:0.55;"> · </span>
                    <span style="opacity:0.75;">From</span>
                    <strong style="color:${theme.bodyInk};"> ${escapeHtml(letter.form.senderName)}</strong>
                  </td>
                </tr>
              </table>
              <h1 style="margin:12px 0 14px;font-size:20px;line-height:1.35;color:${theme.titleInk};font-family:Georgia,'Times New Roman',serif;">
                ${safeSubject}
              </h1>
              <div style="font-size:15px;line-height:1.8;color:${theme.bodyInk};background:#fffef9;border:2px solid ${theme.msgBorder};border-radius:14px;padding:22px 20px;font-family:Georgia,'Times New Roman',serif;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.7);">
                ${
                  /^(dear|hi|hello|hey)\b/i.test(letter.message.trim())
                    ? ""
                    : `<p style="margin:0 0 12px;font-size:13px;color:${theme.headerSub};font-style:italic;">
                  Dear ${escapeHtml(letter.form.recipientName)},
                </p>`
                }
                <div style="margin:0;">${safeMessage}</div>
                <p style="margin:22px 0 0;text-align:right;font-size:16px;color:${theme.accent};">
                  ${stationery ? stationery.sealEmoji : "💌"}
                </p>
                <p style="margin:4px 0 0;text-align:right;font-size:15px;color:${theme.accent};">
                  — ${escapeHtml(letter.form.senderName)}
                </p>
              </div>
              ${hasVoiceNote ? voiceNoteHtml() : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 22px 24px;text-align:center;">
              <div style="font-size:18px;letter-spacing:5px;line-height:1.4;">${theme.footerIcons}</div>
              <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
                Sent with care via Little Letter — cosy notes for cosy people
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#8a7a62;line-height:1.5;">
                Please don’t reply to this email — replies won’t reach ${escapeHtml(letter.form.senderName)}.
              </p>
            </td>
          </tr>
        </table>`;

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
        ${cardBody}
        <p style="margin:18px 0 0;font-size:11px;color:#9ca3af;">
          💌 ${theme.mission}
        </p>
        ${whyFooter(letter.form.senderName, theme.accent)}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildMixtapeEmailHtml(
  mix: MixtapePayload,
  playUrl: string,
  hasVoiceNote = false
): string {
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
                Press play to hear the mix
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
              <div style="font-size:12px;color:#f6d58a;margin-top:4px;">hand-labelled · Side A · ${hasMusic ? "playable mix" : "note only"}</div>
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
              ${hasVoiceNote ? voiceNoteHtml() : ""}
            </td>
          </tr>
          ${playBlock}
          <tr>
            <td style="padding:18px 22px 26px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#cbb892;line-height:1.6;">
                Hit play and listen to the mix — each song plays in full, then the next begins.
              </p>
              <p style="margin:14px 0 0;font-size:11px;color:#8a7a62;word-break:break-all;">
                ${escapeHtml(playUrl)}
              </p>
              <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;">
                Sent with care via <strong style="color:#f6d58a;">Little Letter</strong>
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#8a7a62;line-height:1.5;">
                Please don’t reply to this email — replies won’t reach ${escapeHtml(mix.senderName)}.
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
