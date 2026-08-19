"use client";

import { useEffect, useRef, useState } from "react";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import {
  clearVoiceBlob,
  loadVoiceBlob,
  pickRecorderMime,
  saveVoiceBlob,
  type VoiceKind,
} from "@/lib/voice-note-client";
import { MAX_VOICE_SECONDS } from "@/lib/voice-note";

type Props = {
  kind: VoiceKind;
};

export function VoiceNoteRecorder({ kind }: Props) {
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const urlRef = useRef<string | null>(null);
  const tickRef = useRef<number | null>(null);

  function setPreview(next: string | null) {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = next;
    setUrl(next);
  }

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== "undefined";
    setSupported(ok);
    if (!ok) return;

    void loadVoiceBlob(kind).then((blob) => {
      if (blob) setPreview(URL.createObjectURL(blob));
    });

    return () => {
      stopTracks();
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function stopTicker() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime();
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        stopTracks();
        stopTicker();
        setRecording(false);
        if (blob.size < 80) {
          setError("That recording was too short. Try again.");
          return;
        }
        setPreview(URL.createObjectURL(blob));
        void saveVoiceBlob(kind, blob);
      };
      recorder.start();
      setSeconds(0);
      setRecording(true);
      tickRef.current = window.setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= MAX_VOICE_SECONDS) {
            recorder.stop();
            return MAX_VOICE_SECONDS;
          }
          return next;
        });
      }, 1000);
    } catch {
      setError("Microphone permission is needed to record a voice note.");
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  async function removeNote() {
    stopRecording();
    stopTracks();
    setPreview(null);
    setSeconds(0);
    setError("");
    await clearVoiceBlob(kind);
  }

  return (
    <PixelWindow title="voice_note.wav" icon="🎙️" liftOnHover={false}>
      <p className="font-display text-base text-[var(--ll-ink)]">
        Add a voice note (optional)
      </p>
      <p className="mt-1 text-sm text-[var(--ll-muted)]">
        {supported
          ? `Tap Record, speak for up to ${MAX_VOICE_SECONDS} seconds, then Stop. It goes with the email as an audio file.`
          : "Recording isn’t available in this browser. You can still send the written note."}
      </p>

      {recording ? (
        <p className="mt-3 font-pixel text-[10px] text-[var(--ll-pink-deep)]">
          Recording… {seconds}s / {MAX_VOICE_SECONDS}s
        </p>
      ) : null}

      {url ? (
        <audio className="mt-3 w-full" controls src={url} preload="metadata">
          Your browser can’t play this clip.
        </audio>
      ) : null}

      {error ? (
        <p className="mt-2 text-sm text-rose-700">{error}</p>
      ) : null}

      {supported ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {recording ? (
            <PixelButton type="button" size="lg" onClick={stopRecording}>
              ⏹ Stop
            </PixelButton>
          ) : (
            <PixelButton type="button" size="lg" onClick={() => void startRecording()}>
              {url ? "🎙️ Re-record" : "🎙️ Record voice"}
            </PixelButton>
          )}
          {url && !recording ? (
            <PixelButton type="button" variant="ghost" onClick={() => void removeNote()}>
              Remove
            </PixelButton>
          ) : null}
        </div>
      ) : null}
    </PixelWindow>
  );
}
