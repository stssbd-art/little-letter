"use client";

import type { Occasion } from "@/types";

type SoundName = "click" | "sparkle" | "success" | "whoosh";

let audioCtx: AudioContext | null = null;
let siteGain: GainNode | null = null;
let siteHolds = 0;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

/** Clicks, sparkles, and other site sounds. Spooky cards duck this bus. */
function getSiteBus(): GainNode | null {
  const ctx = getCtx();
  if (!ctx) return null;
  if (!siteGain) {
    siteGain = ctx.createGain();
    siteGain.gain.value = siteHolds > 0 ? 0 : 1;
    siteGain.connect(ctx.destination);
  }
  return siteGain;
}

/** Silence clicks, sparkles, and the other site sounds. Nested holds are safe. */
export function holdSiteSounds() {
  siteHolds += 1;
  const ctx = getCtx();
  const bus = getSiteBus();
  if (!ctx || !bus) return;
  const now = ctx.currentTime;
  bus.gain.cancelScheduledValues(now);
  bus.gain.setValueAtTime(bus.gain.value, now);
  bus.gain.linearRampToValueAtTime(0, now + 0.05);
}

export function releaseSiteSounds() {
  siteHolds = Math.max(0, siteHolds - 1);
  if (siteHolds > 0) return;
  const ctx = getCtx();
  if (!ctx || !siteGain) return;
  const now = ctx.currentTime;
  siteGain.gain.cancelScheduledValues(now);
  siteGain.gain.setValueAtTime(siteGain.gain.value, now);
  siteGain.gain.linearRampToValueAtTime(1, now + 0.4);
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.04,
  delay = 0,
  out?: AudioNode | null
) {
  const ctx = getCtx();
  const dest = out ?? getSiteBus();
  if (!ctx || !dest) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(dest);

  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playSound(name: SoundName, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  if (siteHolds > 0) return;

  void getCtx()?.resume();

  switch (name) {
    case "click":
      tone(520, 0.06, "square", 0.03);
      tone(780, 0.05, "square", 0.02, 0.04);
      break;
    case "sparkle":
      tone(880, 0.08, "triangle", 0.03);
      tone(1320, 0.1, "triangle", 0.025, 0.05);
      tone(1760, 0.12, "sine", 0.02, 0.1);
      break;
    case "success":
      tone(523, 0.12, "triangle", 0.04);
      tone(659, 0.12, "triangle", 0.04, 0.1);
      tone(784, 0.18, "triangle", 0.045, 0.2);
      break;
    case "whoosh":
      tone(220, 0.25, "sawtooth", 0.015);
      tone(440, 0.2, "sine", 0.02, 0.05);
      break;
  }
}

type Phrase = {
  every: number;
  wave: OscillatorType;
  level: number;
  drone: Array<[number, number]>;
  notes: Array<[number, number, number]>;
};

/** Original cues only — short, quiet, and matched to the occasion. */
const CARD_PHRASES: Record<Occasion, Phrase> = {
  halloween: {
    every: 7.8,
    wave: "triangle",
    level: 0.04,
    drone: [
      [110, 0.036],
      [164.81, 0.024],
    ],
    notes: [
      [659.25, 0, 0.7],
      [587.33, 0.7, 0.6],
      [523.25, 1.35, 0.65],
      [493.88, 2.05, 0.6],
      [440, 2.7, 0.85],
      [523.25, 3.6, 0.6],
      [493.88, 4.2, 0.6],
      [440, 4.85, 0.65],
      [392, 5.5, 0.7],
      [440, 6.15, 0.9],
    ],
  },
  birthday: {
    every: 8.2,
    wave: "triangle",
    level: 0.036,
    drone: [
      [130.81, 0.028],
      [196, 0.018],
    ],
    notes: [
      [523.25, 0, 0.38],
      [659.25, 0.42, 0.38],
      [783.99, 0.84, 0.5],
      [659.25, 1.4, 0.36],
      [523.25, 1.82, 0.4],
      [587.33, 2.4, 0.36],
      [659.25, 2.82, 0.36],
      [523.25, 3.24, 0.7],
      [783.99, 4.2, 0.4],
      [880, 4.66, 0.4],
      [783.99, 5.12, 0.5],
      [659.25, 5.7, 0.8],
    ],
  },
  love: {
    every: 10,
    wave: "sine",
    level: 0.032,
    drone: [
      [110, 0.03],
      [164.81, 0.02],
    ],
    notes: [
      [440, 0, 0.9],
      [523.25, 0.95, 0.8],
      [659.25, 1.8, 1],
      [587.33, 2.9, 0.8],
      [523.25, 3.75, 0.9],
      [440, 4.75, 1.2],
      [493.88, 6.1, 0.8],
      [523.25, 7, 0.9],
      [440, 8, 1.4],
    ],
  },
  "valentines-day": {
    every: 10.2,
    wave: "sine",
    level: 0.03,
    drone: [
      [130.81, 0.026],
      [196, 0.018],
    ],
    notes: [
      [659.25, 0, 0.85],
      [587.33, 0.9, 0.7],
      [523.25, 1.7, 0.9],
      [440, 2.7, 1.1],
      [523.25, 4, 0.8],
      [659.25, 4.9, 0.9],
      [587.33, 5.9, 1.2],
      [523.25, 7.3, 1.5],
    ],
  },
  friendship: {
    every: 8.4,
    wave: "triangle",
    level: 0.032,
    drone: [
      [196, 0.024],
      [246.94, 0.016],
    ],
    notes: [
      [392, 0, 0.4],
      [493.88, 0.45, 0.4],
      [587.33, 0.9, 0.55],
      [493.88, 1.55, 0.4],
      [392, 2.05, 0.6],
      [440, 2.9, 0.4],
      [493.88, 3.35, 0.4],
      [587.33, 3.8, 0.7],
      [523.25, 4.7, 0.45],
      [493.88, 5.2, 0.45],
      [440, 5.7, 0.9],
    ],
  },
  "good-luck": {
    every: 8,
    wave: "triangle",
    level: 0.034,
    drone: [
      [146.83, 0.026],
      [220, 0.016],
    ],
    notes: [
      [293.66, 0, 0.4],
      [369.99, 0.45, 0.4],
      [440, 0.9, 0.55],
      [493.88, 1.55, 0.45],
      [587.33, 2.1, 0.7],
      [493.88, 3, 0.4],
      [440, 3.5, 0.4],
      [369.99, 4, 0.5],
      [440, 4.7, 0.45],
      [493.88, 5.2, 0.45],
      [587.33, 5.75, 1.1],
    ],
  },
  "thinking-of-you": {
    every: 12,
    wave: "sine",
    level: 0.022,
    drone: [
      [130.81, 0.02],
      [196, 0.012],
    ],
    notes: [
      [329.63, 0.2, 1.4],
      [392, 1.8, 1.3],
      [493.88, 3.3, 1.6],
      [440, 5.1, 1.4],
      [392, 6.7, 1.5],
      [329.63, 8.4, 2],
    ],
  },
  "thank-you": {
    every: 9,
    wave: "triangle",
    level: 0.03,
    drone: [
      [174.61, 0.024],
      [220, 0.016],
    ],
    notes: [
      [349.23, 0, 0.7],
      [440, 0.75, 0.65],
      [523.25, 1.5, 0.9],
      [440, 2.5, 0.6],
      [392, 3.2, 0.7],
      [349.23, 4, 1],
      [392, 5.2, 0.6],
      [440, 5.9, 0.7],
      [349.23, 6.8, 1.3],
    ],
  },
  congratulations: {
    every: 8.2,
    wave: "triangle",
    level: 0.034,
    drone: [
      [130.81, 0.026],
      [196, 0.018],
    ],
    notes: [
      [392, 0, 0.35],
      [523.25, 0.4, 0.4],
      [659.25, 0.85, 0.45],
      [783.99, 1.35, 0.7],
      [659.25, 2.2, 0.4],
      [523.25, 2.65, 0.45],
      [587.33, 3.3, 0.4],
      [659.25, 3.75, 0.5],
      [783.99, 4.4, 0.9],
      [659.25, 5.5, 0.5],
      [523.25, 6.1, 1],
    ],
  },
  sorry: {
    every: 11,
    wave: "sine",
    level: 0.022,
    drone: [
      [110, 0.022],
      [164.81, 0.014],
    ],
    notes: [
      [440, 0.2, 1.2],
      [415.3, 1.5, 1.1],
      [392, 2.8, 1.3],
      [349.23, 4.2, 1.2],
      [329.63, 5.6, 1.4],
      [349.23, 7.2, 1.1],
      [329.63, 8.5, 1.6],
    ],
  },
  wedding: {
    every: 12,
    wave: "sine",
    level: 0.024,
    drone: [
      [98, 0.02],
      [146.83, 0.014],
    ],
    notes: [
      [293.66, 0.3, 1.2],
      [392, 1.6, 1.1],
      [493.88, 2.9, 1.4],
      [440, 4.5, 1.1],
      [392, 5.8, 1.2],
      [349.23, 7.2, 1.1],
      [392, 8.5, 1.2],
      [293.66, 9.8, 1.6],
    ],
  },
  graduation: {
    every: 9,
    wave: "triangle",
    level: 0.032,
    drone: [
      [130.81, 0.026],
      [196, 0.016],
    ],
    notes: [
      [261.63, 0, 0.55],
      [329.63, 0.6, 0.5],
      [392, 1.15, 0.6],
      [523.25, 1.85, 0.9],
      [493.88, 2.9, 0.5],
      [440, 3.45, 0.5],
      [392, 4, 0.7],
      [440, 4.9, 0.5],
      [493.88, 5.45, 0.55],
      [523.25, 6.1, 1.3],
    ],
  },
  promotion: {
    every: 8.4,
    wave: "triangle",
    level: 0.032,
    drone: [
      [146.83, 0.024],
      [220, 0.016],
    ],
    notes: [
      [392, 0, 0.4],
      [440, 0.45, 0.35],
      [493.88, 0.85, 0.4],
      [587.33, 1.3, 0.6],
      [659.25, 2, 0.45],
      [587.33, 2.5, 0.4],
      [523.25, 3, 0.5],
      [587.33, 3.7, 0.4],
      [659.25, 4.15, 0.45],
      [783.99, 4.7, 1.1],
    ],
  },
  "mothers-day": {
    every: 11,
    wave: "sine",
    level: 0.028,
    drone: [
      [146.83, 0.024],
      [220, 0.016],
    ],
    notes: [
      [293.66, 0.2, 1],
      [369.99, 1.3, 0.9],
      [440, 2.3, 1.2],
      [493.88, 3.6, 0.9],
      [440, 4.6, 1],
      [369.99, 5.7, 0.9],
      [329.63, 6.7, 1],
      [293.66, 7.9, 1.6],
    ],
  },
  "fathers-day": {
    every: 10.4,
    wave: "triangle",
    level: 0.03,
    drone: [
      [98, 0.03],
      [146.83, 0.02],
    ],
    notes: [
      [196, 0, 0.9],
      [246.94, 1, 0.8],
      [293.66, 1.9, 1],
      [261.63, 3, 0.8],
      [246.94, 3.9, 0.9],
      [220, 4.9, 1.1],
      [246.94, 6.2, 0.8],
      [196, 7.2, 1.6],
    ],
  },
};

let cardBus: GainNode | null = null;
let cardVoices: OscillatorNode[] = [];
let cardTimer: number | null = null;
let cardHold = false;
let cardGeneration = 0;
let cardRetry: (() => void) | null = null;

function clearCardRetry() {
  if (!cardRetry) return;
  window.removeEventListener("pointerdown", cardRetry);
  cardRetry = null;
}

function getCardBus(): GainNode | null {
  const ctx = getCtx();
  if (!ctx) return null;
  if (!cardBus) {
    cardBus = ctx.createGain();
    cardBus.gain.value = 0.62;
    cardBus.connect(ctx.destination);
  }
  return cardBus;
}

function cardVoice(
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  delay: number
) {
  const ctx = getCtx();
  const dest = getCardBus();
  if (!ctx || !dest) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(dest);
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, start + Math.max(0.12, duration));
  osc.start(start);
  osc.stop(start + duration + 0.06);
  cardVoices.push(osc);
  osc.onended = () => {
    const index = cardVoices.indexOf(osc);
    if (index >= 0) cardVoices.splice(index, 1);
  };
}

function sing(phrase: Phrase) {
  for (const [freq, volume] of phrase.drone) {
    cardVoice(freq, phrase.every - 0.2, "sine", volume, 0);
  }
  for (const [freq, delay, duration] of phrase.notes) {
    cardVoice(freq, duration, phrase.wave, phrase.level, delay);
    cardVoice(freq / 2, duration + 0.15, "sine", phrase.level * 0.35, delay);
  }
}

/** Closed cards stay softer. Opening brings the same tune forward a little. */
export function setCardMusicOpen(open: boolean) {
  const ctx = getCtx();
  const bus = getCardBus();
  if (!ctx || !bus) return;
  const now = ctx.currentTime;
  const next = open ? 1 : 0.62;
  bus.gain.cancelScheduledValues(now);
  bus.gain.setValueAtTime(bus.gain.value, now);
  bus.gain.linearRampToValueAtTime(next, now + 0.35);
}

export function stopCardMusic() {
  cardGeneration += 1;
  clearCardRetry();
  if (cardTimer != null) {
    window.clearInterval(cardTimer);
    cardTimer = null;
  }
  const now = getCtx()?.currentTime ?? 0;
  for (const osc of cardVoices) {
    try {
      osc.stop(now);
    } catch {
      /* already ended */
    }
  }
  cardVoices = [];
  if (cardHold) {
    releaseSiteSounds();
    cardHold = false;
  }
}

/** Soft occasion tune. Other site sounds stay quiet until this stops. */
export function startCardMusic(occasion: Occasion) {
  stopCardMusic();
  const token = cardGeneration;
  const ctx = getCtx();
  if (!ctx) return;

  const begin = () => {
    if (token !== cardGeneration || cardHold) return;
    clearCardRetry();
    holdSiteSounds();
    cardHold = true;
    const phrase = CARD_PHRASES[occasion];
    const fire = () => {
      if (token !== cardGeneration) return;
      sing(phrase);
    };
    fire();
    cardTimer = window.setInterval(fire, phrase.every * 1000);
  };

  const armRetry = () => {
    if (token !== cardGeneration || cardRetry) return;
    cardRetry = () => {
      void ctx.resume().then(() => {
        if (ctx.state === "running") begin();
      });
    };
    window.addEventListener("pointerdown", cardRetry);
  };

  if (ctx.state === "running") begin();
  else {
    void ctx.resume().then(() => {
      if (token !== cardGeneration) return;
      if (ctx.state === "running") begin();
      else armRetry();
    });
  }
}
