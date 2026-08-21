import {
  getCardDesign,
  isCardDesignId,
  type CardDesignId,
} from "@/lib/card-designs";

/** Static SVG cover art for emails / img tags — mirrors web CardSceneArt (no animation). */
export function buildCardSceneSvg(designId: CardDesignId): string {
  const d = getCardDesign(designId);
  const { accent, border } = d;
  const g = designId.replace(/[^a-z0-9]/gi, "");

  switch (designId) {
    case "balloon-bash":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9fd4ff"/><stop offset="55%" stop-color="#ffe8f0"/><stop offset="100%" stop-color="#fff6df"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <ellipse cx="40" cy="40" rx="28" ry="14" fill="#fff" opacity=".7"/><ellipse cx="200" cy="30" rx="34" ry="16" fill="#fff" opacity=".65"/>
        ${balloon(55, 70, 28, "#ff6b8a", accent)}${balloon(120, 55, 32, "#6bcBff", accent)}${balloon(185, 78, 26, "#ffd166", accent)}
        ${balloon(90, 100, 22, "#c084fc", accent)}${balloon(155, 105, 20, "#7ed957", accent)}
        <ellipse cx="120" cy="158" rx="110" ry="14" fill="#ffe0a8" opacity=".9"/>`
      );
    case "cake-candles":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff0d4"/><stop offset="100%" stop-color="#f5c98a"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <circle cx="30" cy="28" r="2" fill="${accent}"/><circle cx="70" cy="36" r="2" fill="${accent}"/><circle cx="120" cy="24" r="2.5" fill="${accent}"/><circle cx="170" cy="32" r="2" fill="${accent}"/><circle cx="210" cy="28" r="2" fill="${accent}"/>
        <ellipse cx="120" cy="148" rx="70" ry="10" fill="${border}" opacity=".35"/>
        <rect x="55" y="95" width="130" height="45" rx="6" fill="#fff8ee" stroke="${border}" stroke-width="2"/>
        <path d="M55 105 Q70 95 85 105 Q100 115 115 105 Q130 95 145 105 Q160 115 175 105 Q185 98 185 105 L185 115 L55 115 Z" fill="#ffb4c8"/>
        <rect x="75" y="70" width="90" height="30" rx="5" fill="#fffaf0" stroke="${border}" stroke-width="2"/>
        <path d="M75 80 Q88 72 100 80 Q112 88 124 80 Q136 72 148 80 Q158 86 165 80 L165 88 L75 88 Z" fill="#ffd6e8"/>
        <rect x="93" y="48" width="4" height="22" rx="1" fill="#f6d58a"/><ellipse cx="95" cy="44" rx="5" ry="7" fill="#ff9f43"/>
        <rect x="118" y="48" width="4" height="22" rx="1" fill="#f6d58a"/><ellipse cx="120" cy="44" rx="5" ry="7" fill="#ff9f43"/>
        <rect x="143" y="48" width="4" height="22" rx="1" fill="#f6d58a"/><ellipse cx="145" cy="44" rx="5" ry="7" fill="#ff9f43"/>`
      );
    case "confetti-pop":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe0f0"/><stop offset="50%" stop-color="#fff6df"/><stop offset="100%" stop-color="#d4f0ff"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <circle cx="120" cy="80" r="36" fill="#fff" opacity=".55"/>
        <text x="120" y="92" text-anchor="middle" font-size="42">🎊</text>
        <rect x="28" y="24" width="8" height="5" rx="1" fill="#ff6b8a" transform="rotate(20 28 24)"/>
        <rect x="60" y="50" width="7" height="4" rx="1" fill="#ffd166" transform="rotate(-15 60 50)"/>
        <rect x="180" y="30" width="8" height="5" rx="1" fill="#6bcBff" transform="rotate(35 180 30)"/>
        <rect x="200" y="70" width="6" height="4" rx="1" fill="#9b7bff"/>
        <rect x="40" y="100" width="7" height="5" rx="1" fill="#7ed957" transform="rotate(10 40 100)"/>
        <rect x="160" y="110" width="8" height="4" rx="1" fill="${accent}" transform="rotate(-25 160 110)"/>
        <rect x="90" y="20" width="6" height="4" rx="1" fill="#ff9f68"/>
        <rect x="140" y="55" width="7" height="5" rx="1" fill="#ff6b8a"/>`
      );
    case "blush-hearts":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe4ec"/><stop offset="100%" stop-color="#fde8d8"/></linearGradient>
        <radialGradient id="${g}gl" cx="50%" cy="45%" r="40%"><stop offset="0%" stop-color="#ffb4c8" stop-opacity=".7"/><stop offset="100%" stop-color="#ffb4c8" stop-opacity="0"/></radialGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><ellipse cx="120" cy="75" rx="90" ry="60" fill="url(#${g}gl)"/>
        ${heart(70, 55, 1.1, "#ff8fab")}${heart(130, 45, 1.4, accent)}${heart(160, 85, 0.9, "#ff6b8a")}${heart(95, 95, 0.75, "#f472b6")}`
      );
    case "rose-garden":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f8e0e8"/><stop offset="60%" stop-color="#fff5f0"/><stop offset="100%" stop-color="#e8f0d8"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><ellipse cx="120" cy="150" rx="100" ry="18" fill="#c5d4a0" opacity=".7"/>
        ${rose(40, 88, "#c97888", border)}${rose(85, 80, accent, border)}${rose(130, 88, "#c97888", border)}${rose(175, 80, accent, border)}${rose(210, 90, "#c97888", border)}`
      );
    case "starlit-love":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2238"/><stop offset="70%" stop-color="#2a3550"/><stop offset="100%" stop-color="#3d2f4a"/></linearGradient>
        <radialGradient id="${g}gl" cx="70%" cy="30%" r="30%"><stop offset="0%" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset="100%" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><ellipse cx="170" cy="45" rx="55" ry="45" fill="url(#${g}gl)"/>
        <circle cx="170" cy="45" r="22" fill="#f7ecd4"/><circle cx="178" cy="40" r="6" fill="#2a3550" opacity=".25"/>
        ${stars()}${heart(95, 115, 1, "#ff8fab")}`
      );
    case "buddy-highfive":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dfead0"/><stop offset="50%" stop-color="#f5f7ec"/><stop offset="100%" stop-color="#a3b875"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <ellipse cx="50" cy="40" rx="30" ry="12" fill="#fff" opacity=".7"/><ellipse cx="190" cy="35" rx="36" ry="14" fill="#fff" opacity=".65"/>
        <circle cx="95" cy="95" r="22" fill="#ffe0b8" stroke="${border}" stroke-width="2"/><circle cx="145" cy="95" r="22" fill="#ffe0b8" stroke="${border}" stroke-width="2"/>
        <path d="M115 100 Q120 108 125 100" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="88" cy="90" r="3" fill="${accent}"/><circle cx="102" cy="90" r="3" fill="${accent}"/><circle cx="138" cy="90" r="3" fill="${accent}"/><circle cx="152" cy="90" r="3" fill="${accent}"/>
        <path d="M117 78 L120 55 L123 78 Z" fill="#7ed957" stroke="${border}" stroke-width="1"/>
        <circle cx="20" cy="130" r="6" fill="#ffb4c8"/><circle cx="55" cy="130" r="6" fill="#ffd166"/><circle cx="180" cy="130" r="6" fill="#c084fc"/><circle cx="215" cy="130" r="6" fill="#7ed957"/>`
      );
    case "rainbow-note":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0f0ff"/><stop offset="100%" stop-color="#fff6df"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <path d="M20 130 Q120 20 220 130" fill="none" stroke="#ff6b8a" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 123 Q120 15 220 123" fill="none" stroke="#ff9f68" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 116 Q120 10 220 116" fill="none" stroke="#ffd166" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 109 Q120 5 220 109" fill="none" stroke="#7ed957" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 102 Q120 0 220 102" fill="none" stroke="#6bcBff" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 95 Q120 -5 220 95" fill="none" stroke="#9b7bff" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="55" cy="125" rx="28" ry="14" fill="#fff" opacity=".85"/><ellipse cx="185" cy="128" rx="32" ry="15" fill="#fff" opacity=".85"/>`
      );
    case "clover-luck":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e4f0d8"/><stop offset="100%" stop-color="#d8ead0"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        ${clover(50, accent)}${clover(100, "#7aab6a")}${clover(150, accent)}${clover(190, "#7aab6a")}
        <circle cx="120" cy="40" r="3" fill="#ffd166"/>`
      );
    case "sunflower-thanks":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff3c4"/><stop offset="100%" stop-color="#e8f0d4"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><circle cx="200" cy="30" r="22" fill="#ffd166"/>
        ${sunflower(60, accent, border)}${sunflower(120, accent, border)}${sunflower(175, accent, border)}`
      );
    case "sparkler-congrats":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffe8a3"/><stop offset="50%" stop-color="#ffd6e8"/><stop offset="100%" stop-color="#d4e8ff"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        ${sparkler(60, accent)}${sparkler(120, accent)}${sparkler(180, accent)}`
      );
    case "soft-sorry":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0ecf8"/><stop offset="100%" stop-color="#e8e4f0"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        ${cloud(50, 70, 1)}${cloud(130, 55, 1.3)}${cloud(190, 85, 0.9)}
        ${heart(120, 115, 1, accent)}`
      );
    case "wedding-rings":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f8f0e4"/><stop offset="100%" stop-color="#f0e4d4"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <circle cx="105" cy="80" r="28" fill="none" stroke="${border}" stroke-width="6"/><circle cx="135" cy="80" r="28" fill="none" stroke="${accent}" stroke-width="6"/>
        <circle cx="105" cy="80" r="22" fill="#fffcf7"/><circle cx="135" cy="80" r="22" fill="#fffcf7"/>
        <circle cx="40" cy="40" r="3" fill="#ffd166"/><circle cx="70" cy="55" r="3" fill="#ffd166"/><circle cx="170" cy="40" r="3" fill="#ffd166"/><circle cx="200" cy="55" r="3" fill="#ffd166"/>
        <path d="M60 140 Q120 120 180 140" fill="none" stroke="#e8c98a" stroke-width="3"/>`
      );
    case "cap-toss":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0e8f8"/><stop offset="100%" stop-color="#e8f0d4"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <rect x="95" y="45" width="50" height="12" rx="2" fill="${accent}"/><polygon points="120,30 145,45 95,45" fill="${accent}"/>
        <rect x="140" y="45" width="4" height="28" fill="#ffd166"/><circle cx="142" cy="76" r="5" fill="#ff6b8a"/>
        <rect x="70" y="100" width="100" height="40" rx="4" fill="#fff" stroke="${border}" stroke-width="2"/>
        <text x="120" y="125" text-anchor="middle" font-size="11" fill="${accent}" font-family="Georgia, serif">GRAD</text>`
      );
    case "promo-rocket":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#ffe8d4"/><stop offset="100%" stop-color="#e0f0ff"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <circle cx="30" cy="30" r="1.5" fill="${accent}" opacity=".4"/><circle cx="80" cy="50" r="1.5" fill="${accent}" opacity=".4"/><circle cx="200" cy="40" r="1.5" fill="${accent}" opacity=".4"/>
        <polygon points="120,35 145,95 120,85 95,95" fill="#fff8ee" stroke="${border}" stroke-width="2"/>
        <circle cx="120" cy="65" r="8" fill="#6bcBff" stroke="${accent}" stroke-width="2"/>
        <polygon points="95,95 110,95 100,115" fill="#ff6b8a"/><polygon points="145,95 130,95 140,115" fill="#ff6b8a"/>
        <polygon points="112,95 120,125 128,95" fill="#ffd166"/>`
      );
    case "valentine-box":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffd0dc"/><stop offset="100%" stop-color="#ffe4ec"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <rect x="70" y="70" width="100" height="70" rx="8" fill="#fff8fa" stroke="${accent}" stroke-width="3"/>
        <path d="M70 78 L120 110 L170 78" fill="none" stroke="${accent}" stroke-width="3"/>
        ${heart(120, 40, 1.2, "#ff6b8a")}${heart(45, 50, 0.7, "#ff8fab")}${heart(195, 50, 0.7, "#ff8fab")}`
      );
    case "tulip-mum":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe4ec"/><stop offset="100%" stop-color="#e8f0d4"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><ellipse cx="120" cy="150" rx="100" ry="16" fill="#c5d4a0" opacity=".75"/>
        ${tulip(55, "#ff8fab", border)}${tulip(95, accent, border)}${tulip(135, "#f472b6", border)}${tulip(175, "#ffb4c8", border)}`
      );
    case "tie-dad":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d8e4f0"/><stop offset="100%" stop-color="#e8e0d0"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <rect x="95" y="40" width="50" height="18" rx="3" fill="${accent}"/><polygon points="105,58 120,100 135,58" fill="${accent}"/>
        <polygon points="112,58 120,88 128,58" fill="#ffd166" opacity=".5"/><rect x="100" y="100" width="40" height="8" rx="2" fill="${border}"/>
        <rect x="55" y="120" width="130" height="22" rx="4" fill="#fff" stroke="${border}" stroke-width="2"/>
        <text x="120" y="135" text-anchor="middle" font-size="10" fill="${accent}" font-family="Georgia, serif">for dad</text>`
      );
    case "honey-classic":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff6df"/><stop offset="100%" stop-color="#f0e4c8"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <rect x="55" y="55" width="130" height="80" rx="8" fill="#fffbf2" stroke="${border}" stroke-width="3"/>
        <path d="M55 70 L120 105 L185 70" fill="none" stroke="${accent}" stroke-width="3"/>
        <circle cx="120" cy="95" r="14" fill="#f6d58a" stroke="${accent}" stroke-width="2"/>
        <path d="M114 95 L118 99 L128 88" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="40" cy="40" r="4" fill="#ffd166"/><circle cx="200" cy="40" r="4" fill="#ffd166"/>`
      );
    case "moon-whisper":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e2840"/><stop offset="100%" stop-color="#3a2e48"/></linearGradient>
        <radialGradient id="${g}gl" cx="30%" cy="35%" r="35%"><stop offset="0%" stop-color="#ffe9a8" stop-opacity=".4"/><stop offset="100%" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><ellipse cx="70" cy="50" rx="50" ry="45" fill="url(#${g}gl)"/>
        <path d="M70 30 A22 22 0 1 0 70 74 A16 16 0 1 1 70 30" fill="#f5ecd8"/>
        ${stars()}
        <ellipse cx="170" cy="120" rx="40" ry="10" fill="#2a3550" opacity=".5"/>`
      );
    case "pearl-locket":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f3e8f4"/><stop offset="100%" stop-color="#efe4f0"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <line x1="120" y1="18" x2="120" y2="48" stroke="${border}" stroke-width="2"/><circle cx="120" cy="16" r="4" fill="#e8d0e0" stroke="${accent}" stroke-width="1.5"/>
        <circle cx="120" cy="95" r="42" fill="#fff8fb" stroke="${border}" stroke-width="3"/>
        ${heart(120, 72, 1, accent)}
        <circle cx="40" cy="35" r="2.5" fill="#fff"/><circle cx="200" cy="40" r="2.5" fill="#fff"/>`
      );
    case "daisy-duo":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff6d8"/><stop offset="100%" stop-color="#e4f0d4"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/><ellipse cx="120" cy="150" rx="110" ry="16" fill="#c5d4a0" opacity=".75"/>
        <line x1="85" y1="145" x2="85" y2="95" stroke="#6f8a45" stroke-width="3"/><line x1="155" y1="145" x2="155" y2="88" stroke="#6f8a45" stroke-width="3"/>
        ${daisy(85, 78, border, accent)}${daisy(155, 70, border, accent)}`
      );
    case "ivory-veil":
      return svg(
        g,
        `<defs><linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f7f1e8"/><stop offset="100%" stop-color="#efe6d8"/></linearGradient></defs>
        <rect width="240" height="160" fill="url(#${g}bg)"/>
        <path d="M70 55 Q120 30 170 55 Q155 110 120 130 Q85 110 70 55 Z" fill="#fffcf8" stroke="${border}" stroke-width="2"/>
        <circle cx="100" cy="78" r="7" fill="#f0e4d4" stroke="${accent}" stroke-width="1.5"/>
        <circle cx="120" cy="72" r="8" fill="#fff8ee" stroke="${accent}" stroke-width="1.5"/>
        <circle cx="140" cy="78" r="7" fill="#f0e4d4" stroke="${accent}" stroke-width="1.5"/>
        <circle cx="120" cy="88" r="5" fill="#d4c0a0"/>
        <path d="M55 135 Q120 115 185 135" fill="none" stroke="#e8c98a" stroke-width="2.5"/>
        <circle cx="40" cy="35" r="2.5" fill="#fff"/><circle cx="200" cy="40" r="2.5" fill="#fff"/>`
      );
    default:
      return buildCardSceneSvg("honey-classic");
  }
}

export function cardSceneSvgResponse(designId: string): string | null {
  if (!isCardDesignId(designId)) return null;
  return buildCardSceneSvg(designId);
}

function svg(_g: string, body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" width="240" height="160" role="img" aria-hidden="true">${body}</svg>`;
}

function balloon(cx: number, cy: number, r: number, fill: string, accent: string) {
  return `<line x1="${cx}" y1="${cy + r}" x2="${cx}" y2="155" stroke="${accent}" stroke-width="1.2" opacity=".45"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.82}" ry="${r}" fill="${fill}"/>
  <ellipse cx="${cx - r * 0.25}" cy="${cy - r * 0.3}" rx="${r * 0.22}" ry="${r * 0.3}" fill="#fff" opacity=".35"/>
  <polygon points="${cx - 4},${cy + r - 2} ${cx + 4},${cy + r - 2} ${cx},${cy + r + 6}" fill="${fill}"/>`;
}

function heart(x: number, y: number, s: number, fill: string) {
  return `<path d="M ${x} ${y + 8 * s}
    C ${x} ${y - 4 * s}, ${x - 16 * s} ${y - 4 * s}, ${x - 16 * s} ${y + 6 * s}
    C ${x - 16 * s} ${y + 18 * s}, ${x} ${y + 28 * s}, ${x} ${y + 28 * s}
    C ${x} ${y + 28 * s}, ${x + 16 * s} ${y + 18 * s}, ${x + 16 * s} ${y + 6 * s}
    C ${x + 16 * s} ${y - 4 * s}, ${x} ${y - 4 * s}, ${x} ${y + 8 * s} Z" fill="${fill}" opacity=".85"/>`;
}

function rose(x: number, cy: number, fill: string, border: string) {
  return `<line x1="${x}" y1="150" x2="${x}" y2="${cy + 10}" stroke="#6f8a45" stroke-width="3"/>
  <ellipse cx="${x - 8}" cy="${cy + 30}" rx="7" ry="4" fill="#7aab6a" transform="rotate(-25 ${x - 8} ${cy + 30})"/>
  <circle cx="${x}" cy="${cy}" r="14" fill="${fill}"/><circle cx="${x - 5}" cy="${cy - 3}" r="7" fill="#fff" opacity=".25"/><circle cx="${x}" cy="${cy}" r="5" fill="${border}" opacity=".5"/>`;
}

function clover(x: number, fill: string) {
  return `<line x1="${x}" y1="140" x2="${x}" y2="95" stroke="#4a7a3a" stroke-width="3"/>
  <circle cx="${x}" cy="76" r="10" fill="${fill}"/><circle cx="${x - 12}" cy="88" r="10" fill="${fill}"/><circle cx="${x + 12}" cy="88" r="10" fill="${fill}"/><circle cx="${x}" cy="100" r="10" fill="${fill}"/>
  <circle cx="${x}" cy="88" r="4" fill="#4a7a3a"/>`;
}

function sunflower(x: number, accent: string, border: string) {
  const petals = Array.from({ length: 12 }, (_, p) => {
    const a = (p * 30 * Math.PI) / 180;
    const cx = x + Math.cos(a) * 18;
    const cy = 95 + Math.sin(a) * 18;
    return `<ellipse cx="${cx}" cy="${cy}" rx="7" ry="12" fill="#ffd166" transform="rotate(${p * 30} ${cx} ${cy})"/>`;
  }).join("");
  return `<line x1="${x}" y1="150" x2="${x}" y2="100" stroke="#6f8a45" stroke-width="4"/>${petals}<circle cx="${x}" cy="95" r="12" fill="${accent}" stroke="${border}" stroke-width="2"/>`;
}

function sparkler(x: number, accent: string) {
  const lines = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((ang) => {
      const rad = (ang * Math.PI) / 180;
      const colors = ["#ff6b8a", "#ffd166", "#6bcBff", accent];
      const c = colors[(ang / 45) % 4];
      return `<line x1="${x}" y1="85" x2="${x + Math.cos(rad) * 28}" y2="${85 + Math.sin(rad) * 28}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`;
    })
    .join("");
  return `<rect x="${x - 2}" y="90" width="4" height="50" rx="1" fill="#c4a574"/>${lines}<circle cx="${x}" cy="85" r="5" fill="#fff6df" stroke="${accent}" stroke-width="2"/>`;
}

function cloud(x: number, y: number, s: number) {
  return `<ellipse cx="${x}" cy="${y}" rx="${28 * s}" ry="${16 * s}" fill="#fff" opacity=".9"/>
  <ellipse cx="${x - 18 * s}" cy="${y + 4}" rx="${18 * s}" ry="${12 * s}" fill="#fff" opacity=".85"/>
  <ellipse cx="${x + 16 * s}" cy="${y + 2}" rx="${16 * s}" ry="${11 * s}" fill="#fff" opacity=".85"/>`;
}

function tulip(x: number, fill: string, border: string) {
  return `<line x1="${x}" y1="145" x2="${x}" y2="90" stroke="#6f8a45" stroke-width="3"/>
  <ellipse cx="${x - 10}" cy="115" rx="8" ry="4" fill="#7aab6a"/>
  <path d="M${x} 55 Q${x - 16} 75 ${x - 10} 90 Q${x} 82 ${x + 10} 90 Q${x + 16} 75 ${x} 55 Z" fill="${fill}" stroke="${border}" stroke-width="1"/>`;
}

function daisy(cx: number, cy: number, border: string, accent: string) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const px = cx + Math.cos(a) * 18;
    const py = cy + Math.sin(a) * 18;
    return `<ellipse cx="${px}" cy="${py}" rx="7" ry="12" fill="#fffdf5" stroke="${border}" stroke-width="1" transform="rotate(${i * 45} ${px} ${py})"/>`;
  }).join("");
  return `${petals}<circle cx="${cx}" cy="${cy}" r="10" fill="#ffd166" stroke="${accent}" stroke-width="2"/>`;
}

function stars() {
  const pts = [
    [20, 20],
    [50, 40],
    [90, 15],
    [110, 55],
    [140, 25],
    [190, 70],
    [210, 20],
    [30, 80],
    [100, 90],
    [160, 100],
  ];
  return pts
    .map(
      ([cx, cy], i) =>
        `<circle cx="${cx}" cy="${cy}" r="${i % 3 === 0 ? 1.8 : 1}" fill="#ffe9a8"/>`
    )
    .join("");
}
