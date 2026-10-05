"use client";

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

const HALLOWEEN_EVERY = 7.8;
const HALLOWEEN_NOTES: Array<[number, number, number]> = [
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
];

let cardBus: GainNode | null = null;
let cardVoices: OscillatorNode[] = [];
let cardTimer: number | null = null;
let cardHold = false;
let cardGeneration = 0;

function getCardBus(): GainNode | null {
  const ctx = getCtx();
  if (!ctx) return null;
  if (!cardBus) {
    cardBus = ctx.createGain();
    cardBus.gain.value = 1;
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

function singHalloween() {
  cardVoice(110, HALLOWEEN_EVERY - 0.2, "sine", 0.036, 0);
  cardVoice(164.81, HALLOWEEN_EVERY - 0.2, "sine", 0.024, 0);
  for (const [freq, delay, duration] of HALLOWEEN_NOTES) {
    cardVoice(freq, duration, "triangle", 0.04, delay);
    cardVoice(freq / 2, duration + 0.15, "sine", 0.014, delay);
  }
}

export function stopCardMusic() {
  cardGeneration += 1;
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

/** Quiet minor music-box line for an open Halloween card. */
export function startCardMusic() {
  stopCardMusic();
  const token = cardGeneration;
  const ctx = getCtx();
  if (!ctx) return;

  const begin = () => {
    if (token !== cardGeneration) return;
    holdSiteSounds();
    cardHold = true;
    const fire = () => {
      if (token !== cardGeneration) return;
      singHalloween();
    };
    fire();
    cardTimer = window.setInterval(fire, HALLOWEEN_EVERY * 1000);
  };

  if (ctx.state === "running") begin();
  else {
    void ctx.resume().then(() => {
      if (ctx.state === "running") begin();
    });
  }
}
