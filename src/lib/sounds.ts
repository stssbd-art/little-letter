"use client";

type SoundName = "click" | "sparkle" | "success" | "whoosh";

const WELCOME_SESSION_KEY = "little-letter-welcome-played";

let audioCtx: AudioContext | null = null;

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

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.04,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const start = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Soft music-box style pad — about 3.5s, very quiet. */
export function playWelcomeAmbience(muted: boolean) {
  if (muted || typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(WELCOME_SESSION_KEY) === "1") return false;
    sessionStorage.setItem(WELCOME_SESSION_KEY, "1");
  } catch {
    /* private mode */
  }

  void getCtx()?.resume();

  // Gentle pentatonic lullaby (Hz) — triangle + sine for a soft cute feel
  const notes: Array<[number, number, number]> = [
    [523.25, 0, 0.014], // C5
    [659.25, 0.35, 0.012], // E5
    [783.99, 0.7, 0.013], // G5
    [880.0, 1.05, 0.011], // A5
    [783.99, 1.45, 0.012], // G5
    [659.25, 1.85, 0.011], // E5
    [698.46, 2.25, 0.01], // F5
    [523.25, 2.7, 0.014], // C5
  ];

  for (const [freq, delay, vol] of notes) {
    tone(freq, 0.85, "triangle", vol, delay);
    tone(freq * 2, 0.7, "sine", vol * 0.35, delay + 0.04);
  }

  // Soft low pad underneath
  tone(261.63, 3.4, "sine", 0.008, 0);
  tone(392.0, 3.2, "sine", 0.006, 0.15);

  return true;
}

export function playSound(name: SoundName, muted: boolean) {
  if (muted || typeof window === "undefined") return;

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
