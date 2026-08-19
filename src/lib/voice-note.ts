export type VoiceNotePayload = {
  mimeType: string;
  filename: string;
  data: string;
};

export const MAX_VOICE_BYTES = 1_800_000;
export const MAX_VOICE_SECONDS = 60;

const ALLOWED_TYPES = new Set([
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/x-m4a",
  "audio/aac",
  "audio/mp3",
]);

export function voiceFilenameForMime(mimeType: string) {
  const mime = mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) {
    return "voice-note.m4a";
  }
  if (mime.includes("mpeg") || mime.includes("mp3")) return "voice-note.mp3";
  if (mime.includes("ogg")) return "voice-note.ogg";
  if (mime.includes("wav")) return "voice-note.wav";
  return "voice-note.webm";
}

function normalizeMime(raw: string) {
  return raw.split(";")[0]?.trim().toLowerCase() ?? "";
}

/** Accept a recorded clip from the client, or null if none / invalid. */
export function parseVoiceNote(raw: unknown): VoiceNotePayload | null {
  if (raw == null) return null;
  if (typeof raw !== "object") {
    throw new Error("Voice note is invalid.");
  }
  const obj = raw as Record<string, unknown>;
  if (!obj.data && !obj.mimeType) return null;

  const mimeType = typeof obj.mimeType === "string" ? normalizeMime(obj.mimeType) : "";
  const data = typeof obj.data === "string" ? obj.data.replace(/\s/g, "") : "";
  if (!mimeType || !data) {
    throw new Error("Voice note is incomplete.");
  }
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("That audio format isn’t supported. Try recording again.");
  }
  if (!/^[A-Za-z0-9+/]+=*$/.test(data) || data.length > MAX_VOICE_BYTES * 2) {
    throw new Error("Voice note is too large. Keep it under a minute.");
  }

  let content: Buffer;
  try {
    content = Buffer.from(data, "base64");
  } catch {
    throw new Error("Voice note could not be read.");
  }
  if (content.length < 80) {
    throw new Error("Voice note is empty. Record again.");
  }
  if (content.length > MAX_VOICE_BYTES) {
    throw new Error("Voice note is too large. Keep it under a minute.");
  }

  const filename =
    typeof obj.filename === "string" && /^voice-note\.(webm|m4a|mp3|ogg|wav)$/i.test(obj.filename)
      ? obj.filename.toLowerCase()
      : voiceFilenameForMime(mimeType);

  return { mimeType, filename, data };
}

export function voiceNoteToAttachment(note: VoiceNotePayload) {
  return {
    filename: note.filename,
    contentType: note.mimeType,
    content: Buffer.from(note.data, "base64"),
  };
}
