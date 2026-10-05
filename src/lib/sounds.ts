"use client";

type SoundName = "click" | "sparkle" | "success" | "whoosh" | "spooky";

const WELCOME_SESSION_KEY = "little-letter-welcome-played-v3";

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

/** Clicks, sparkles, and the welcome tune. Spooky cards duck this bus. */
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

/** Silence every site sound except the spooky card. Nested holds are safe. */
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

function slide(
  from: number,
  to: number,
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
  osc.connect(gain);
  gain.connect(dest);
  const start = ctx.currentTime + delay;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** High creak: noise with a rising band-pass, like a rusty hinge. */
function creak(duration: number, volume: number, delay: number, out: AudioNode) {
  const ctx = getCtx();
  if (!ctx) return;
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 14;
  const gain = ctx.createGain();
  src.connect(filter);
  filter.connect(gain);
  gain.connect(out);
  const start = ctx.currentTime + delay;
  filter.frequency.setValueAtTime(280, start);
  filter.frequency.exponentialRampToValueAtTime(2200, start + duration * 0.72);
  filter.frequency.exponentialRampToValueAtTime(640, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  src.start(start);
  src.stop(start + duration + 0.02);
}
function flutter(
  duration: number,
  volume: number,
  delay: number,
  freq: number,
  q = 0.7,
  out?: AudioNode | null
) {
  const ctx = getCtx();
  const dest = out ?? getSiteBus();
  if (!ctx || !dest) return;
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ctx.createGain();
  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  src.start(start);
  src.stop(start + duration + 0.02);
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

/**
 * Slow lullaby welcome — low sine notes, no bright music-box sparkle.
 * Only marks itself played after AudioContext is actually running,
 * so a blocked autoplay attempt can retry on the next tap.
 */
export async function playWelcomeAmbience(muted: boolean): Promise<boolean> {
  if (muted || typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(WELCOME_SESSION_KEY) === "1") return false;
  } catch {
    /* private mode */
  }

  const ctx = getCtx();
  if (!ctx || siteHolds > 0) return false;

  try {
    if (ctx.state !== "running") {
      await ctx.resume();
    }
  } catch {
    return false;
  }
  if (ctx.state !== "running") return false;

  try {
    sessionStorage.setItem(WELCOME_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }

  // Quiet descending lullaby in a lower register
  const notes: Array<[number, number, number]> = [
    [392.0, 0, 0.032],
    [349.23, 1.15, 0.03],
    [329.63, 2.3, 0.028],
    [293.66, 3.45, 0.028],
    [261.63, 4.7, 0.03],
    [293.66, 6.0, 0.026],
    [246.94, 7.2, 0.03],
  ];

  for (const [freq, delay, vol] of notes) {
    tone(freq, 1.7, "sine", vol, delay);
    tone(freq / 2, 2.1, "sine", vol * 0.35, delay);
  }

  tone(130.81, 8.4, "sine", 0.018, 0);
  tone(196.0, 8.2, "sine", 0.012, 0.4);

  return true;
}

export function playSound(name: SoundName, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  if (name !== "spooky" && siteHolds > 0) return;

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
    case "spooky": {
      const ear = getCtx()?.destination ?? null;
      if (!ear) break;
      // Sudden low hit, then a clashing stab.
      tone(40, 0.45, "sine", 0.18, 0, ear);
      flutter(0.28, 0.1, 0, 70, 0.5, ear);
      tone(622, 0.28, "sawtooth", 0.045, 0.06, ear);
      tone(659, 0.28, "square", 0.032, 0.06, ear);
      tone(932, 0.22, "sawtooth", 0.028, 0.1, ear);
      // Rising shriek that drops into a moan.
      slide(280, 1680, 0.42, "sawtooth", 0.05, 0.16, ear);
      slide(420, 1420, 0.36, "square", 0.022, 0.2, ear);
      slide(1500, 160, 0.95, "sawtooth", 0.04, 0.55, ear);
      slide(980, 110, 0.85, "triangle", 0.035, 0.62, ear);
      creak(1.1, 0.07, 0.35, ear);
      // Leftover dread, two notes a semitone apart.
      tone(49, 2.4, "sine", 0.09, 1.15, ear);
      tone(52, 2.2, "sine", 0.055, 1.2, ear);
      flutter(1.6, 0.05, 1.2, 140, 0.6, ear);
      break;
    }
  }
}
