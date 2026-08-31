import {
  MAX_VOICE_BYTES,
  voiceFilenameForMime,
  type VoiceNotePayload,
} from "@/lib/voice-note";

const DB_NAME = "little-letter";
const STORE = "voice";

export type VoiceKind = "letter" | "mixtape";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Could not open storage"));
  });
}

export async function saveVoiceBlob(kind: VoiceKind, blob: Blob) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(blob, kind);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save voice note"));
  });
  db.close();
}

export async function loadVoiceBlob(kind: VoiceKind): Promise<Blob | null> {
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(kind);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error ?? new Error("Could not load voice note"));
  });
  db.close();
  return blob;
}

export async function clearVoiceBlob(kind: VoiceKind) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(kind);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Could not clear voice note"));
    });
    db.close();
  } catch {
    /* ignore */
  }
}

export function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

export async function loadVoicePayload(
  kind: VoiceKind
): Promise<VoiceNotePayload | null> {
  const blob = await loadVoiceBlob(kind);
  if (!blob) return null;
  return blobToVoicePayload(blob);
}

/** Never block Send on a stuck IndexedDB read. */
export async function loadVoicePayloadSafe(
  kind: VoiceKind,
  timeoutMs = 2500
): Promise<VoiceNotePayload | null> {
  try {
    return await Promise.race([
      loadVoicePayload(kind),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), timeoutMs);
      }),
    ]);
  } catch {
    return null;
  }
}

export async function blobToVoicePayload(blob: Blob): Promise<VoiceNotePayload> {
  if (blob.size > MAX_VOICE_BYTES) {
    throw new Error("Voice note is too large. Keep it under a minute.");
  }
  const mimeType = (blob.type || "audio/webm").split(";")[0]?.trim() || "audio/webm";
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return {
    mimeType,
    filename: voiceFilenameForMime(mimeType),
    data: btoa(binary),
  };
}
