"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { Field, PixelInput, PixelTextarea } from "@/components/ui/PixelInput";
import { useSound } from "@/components/providers/SoundProvider";
import { STORAGE_KEYS } from "@/lib/constants";
import { encodeMixShare } from "@/lib/mixtape-link";
import {
  getTracksByIds,
  MAX_MIXTAPE_TRACKS,
  MIN_MIXTAPE_TRACKS,
  MIX_TRACKS,
  type MixTrack,
} from "@/lib/tracks";
import { YouTubeSongSearch } from "@/components/features/YouTubeSongSearch";
import type { MixtapePayload } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UsageInfo = {
  demo?: boolean;
  freeAvailable: boolean;
  freeLeft?: number;
  freeTotal?: number;
  credits: number;
  canSend: boolean;
  price: string;
  priceOneSong?: string;
  priceMultiSong?: string;
};

const emptyDraft = {
  recipientName: "",
  recipientEmail: "",
  senderName: "",
  title: "",
  dedication: "",
  trackIds: [] as string[],
  customTracks: [] as MixTrack[],
};

export function MixtapeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { play } = useSound();
  const [draft, setDraft] = useState(emptyDraft);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [shareExample, setShareExample] = useState(false);

  const selected = getTracksByIds(draft.trackIds, draft.customTracks);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.mixtapeDraft);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<typeof emptyDraft>;
        setDraft({
          ...emptyDraft,
          ...parsed,
          trackIds: Array.isArray(parsed.trackIds) ? parsed.trackIds : [],
          customTracks: Array.isArray(parsed.customTracks)
            ? parsed.customTracks
            : [],
        });
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(STORAGE_KEYS.mixtapeDraft, JSON.stringify(draft));
  }, [draft, ready]);

  async function refreshUsage() {
    const count = Math.max(1, draft.trackIds.length || 1);
    const res = await fetch(
      `/api/usage?kind=mixtape&trackCount=${count}&t=${Date.now()}`,
      { cache: "no-store" }
    );
    const data = (await res.json()) as UsageInfo;
    if (res.ok) {
      setUsage(data);
      setNeedsPayment(!(data.demo || data.canSend));
    }
  }

  useEffect(() => {
    void refreshUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.trackIds.length]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paid = searchParams.get("paid");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      setError(
        "Payment cancelled. Your first mixtape is free; extra mixes are £1.25 for 1 song, or £1.55 for 2+ songs."
      );
      return;
    }

    if (paid && sessionId && ready) {
      void (async () => {
        setPaying(true);
        setError("");
        try {
          const verify = await fetch("/api/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const verifyData = await verify.json();
          if (!verify.ok) {
            throw new Error(verifyData.error ?? "Could not verify payment");
          }
          await refreshUsage();
          // sendMixtape navigates to /success — do not bounce back to empty form
          await sendMixtape();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Payment verify failed");
          setPaying(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Stripe return
  }, [searchParams, ready]);

  function toggleTrack(id: string) {
    play("click");
    setDraft((prev) => {
      if (prev.trackIds.includes(id)) {
        return {
          ...prev,
          trackIds: prev.trackIds.filter((t) => t !== id),
          customTracks: prev.customTracks.filter((t) => t.id !== id),
        };
      }
      if (prev.trackIds.length >= MAX_MIXTAPE_TRACKS) return prev;
      return { ...prev, trackIds: [...prev.trackIds, id] };
    });
  }

  function addTrack(track: MixTrack) {
    play("click");
    setDraft((prev) => {
      if (prev.trackIds.includes(track.id) || prev.trackIds.length >= MAX_MIXTAPE_TRACKS) {
        return prev;
      }
      const customTracks = track.id.startsWith("yt:")
        ? [...prev.customTracks.filter((t) => t.id !== track.id), track]
        : prev.customTracks;
      return {
        ...prev,
        trackIds: [...prev.trackIds, track.id],
        customTracks,
      };
    });
  }

  function validate(): string | null {
    if (!draft.recipientName.trim()) return "Who is this mix for?";
    if (!draft.recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.recipientEmail)) {
      return "Need a valid recipient email.";
    }
    if (!draft.senderName.trim()) return "Add your name on the cassette label.";
    if (!draft.title.trim()) return "Give the mixtape a title.";
    if (draft.trackIds.length < MIN_MIXTAPE_TRACKS) {
      return `Pick at least ${MIN_MIXTAPE_TRACKS} song${MIN_MIXTAPE_TRACKS === 1 ? "" : "s"} for the mix.`;
    }
    return null;
  }

  async function sendMixtape() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setSending(true);
    setError("");
    play("whoosh");

    const payload: MixtapePayload = {
      recipientName: draft.recipientName.trim(),
      recipientEmail: draft.recipientEmail.trim(),
      senderName: draft.senderName.trim(),
      title: draft.title.trim(),
      dedication: draft.dedication.trim(),
      trackIds: draft.trackIds,
      customTracks: draft.customTracks,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/send-mixtape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, shareExample }),
      });
      const data = await res.json();

      if (res.status === 402) {
        const count = Math.max(1, draft.trackIds.length || 1);
        const latest = await fetch(
          `/api/usage?kind=mixtape&trackCount=${count}&t=${Date.now()}`,
          { cache: "no-store" }
        ).then((r) => r.json() as Promise<UsageInfo>);
        if (latest?.demo || latest?.canSend) {
          setUsage(latest);
          setNeedsPayment(false);
          setError("Demo mode is on — try Send again (no payment).");
        } else {
          setNeedsPayment(true);
          setError(data.error ?? "Payment required for extra sends.");
        }
        setSending(false);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Failed to send mixtape");

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#f6d58a", "#8b5e34", "#3d2f22", "#cbb892", "#e8b86d"],
      });
      play("success");
      try {
        sessionStorage.setItem(
          "little-letter-last-mix",
          JSON.stringify({
            title: payload.title,
            to: payload.recipientName,
            from: payload.senderName,
          })
        );
      } catch {
        /* ignore */
      }
      sessionStorage.removeItem(STORAGE_KEYS.mixtapeDraft);
      router.push("/success?kind=mixtape");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send mixtape");
      setSending(false);
    }
  }

  async function startPayment() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setPaying(true);
    setError("");
    play("click");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnPath: "/mixtape",
          kind: "mixtape",
          trackCount: Math.max(1, draft.trackIds.length),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment");
      window.location.href = data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  const songCount = Math.max(1, draft.trackIds.length || 1);
  const priceLabel =
    usage?.price ??
    (songCount <= 1
      ? usage?.priceOneSong ?? "£1.25"
      : usage?.priceMultiSong ?? "£1.55");
  const demo = usage?.demo ?? false;
  const freeLeft = usage?.freeAvailable ?? true;
  const freeRemaining = usage?.freeLeft ?? 1;
  const paidReady = (usage?.credits ?? 0) > 0;

  return (
    <div className="space-y-6">
      <PixelWindow title="pricing.ini" icon={demo ? "🧪" : "💷"} liftOnHover={false}>
        <p className="font-display text-sm text-[var(--ll-ink)]">
          {demo
            ? "Demo mode — sends are free for testing. No payment asked right now."
            : freeLeft
              ? `Your first mixtape is free (${freeRemaining} left). After that: £1.25 for 1 song · £1.55 for 2 or more. Current pick (${songCount} song${songCount === 1 ? "" : "s"}): ${priceLabel}.`
              : paidReady
                ? `You have ${usage?.credits} paid mixtape credit${usage?.credits === 1 ? "" : "s"} ready.`
                : `Your free mixtape is used. Extra mixes are £1.25 for 1 song · £1.55 for 2 or more. Current pick (${songCount} song${songCount === 1 ? "" : "s"}): ${priceLabel}.`}
        </p>
      </PixelWindow>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
        <div className="space-y-4">
          <CassetteDeck
            title={draft.title}
            fromName={draft.senderName}
            toName={draft.recipientName}
            tracks={selected}
            spinning={selected.length > 0}
          />
          <p className="text-center font-pixel text-[8px] leading-relaxed text-[var(--ll-muted)]">
            Hand-labelled · Side A forever · pick at least {MIN_MIXTAPE_TRACKS}{" "}
            song{MIN_MIXTAPE_TRACKS === 1 ? "" : "s"}
          </p>
        </div>

        <PixelWindow title="make_a_mix.bat" icon="📼" liftOnHover={false}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (needsPayment && !demo) void startPayment();
              else void sendMixtape();
            }}
          >
            <Field label="Mixtape title" htmlFor="mix-title">
              <PixelInput
                id="mix-title"
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="Songs for rainy Tuesdays"
                maxLength={60}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="For" htmlFor="mix-to">
                <PixelInput
                  id="mix-to"
                  value={draft.recipientName}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, recipientName: e.target.value }))
                  }
                  placeholder="Alex"
                  required
                />
              </Field>
              <Field label="From" htmlFor="mix-from">
                <PixelInput
                  id="mix-from"
                  value={draft.senderName}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, senderName: e.target.value }))
                  }
                  placeholder="You"
                  required
                />
              </Field>
            </div>

            <Field label="Their email" htmlFor="mix-email">
              <PixelInput
                id="mix-email"
                type="email"
                value={draft.recipientEmail}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, recipientEmail: e.target.value }))
                }
                placeholder="friend@email.com"
                required
              />
            </Field>

            <Field
              label="Dedication (optional)"
              htmlFor="mix-note"
              hint="A short note on the J-card"
            >
              <PixelTextarea
                id="mix-note"
                value={draft.dedication}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, dedication: e.target.value }))
                }
                placeholder="These songs remind me of that summer…"
                maxLength={400}
              />
            </Field>

            <div>
              <div className="mb-2 flex items-end justify-between gap-2">
                <p className="font-display text-sm text-[var(--ll-ink)]">
                  Songs
                </p>
                <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
                  {draft.trackIds.length}/{MAX_MIXTAPE_TRACKS} · min{" "}
                  {MIN_MIXTAPE_TRACKS}
                </p>
              </div>
              <p className="mb-2 text-xs text-[var(--ll-muted)]">
                Pick from the crate, or search YouTube and add a song.
              </p>

              {selected.length ? (
                <ul className="mb-3 space-y-1 rounded-xl border-2 border-[#d2a35a] bg-[#fff6df]/80 p-2">
                  {selected.map((track, i) => (
                    <li
                      key={track.id}
                      className="flex items-center gap-2 px-1 py-1"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-[#8b5e34] font-pixel text-[8px] text-[#fff6df]">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm text-[var(--ll-ink)]">
                          {track.title}
                        </span>
                        <span className="block truncate font-pixel text-[7px] text-[var(--ll-muted)]">
                          {track.artist}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleTrack(track.id)}
                        className="font-pixel text-[8px] text-[var(--ll-muted)] hover:text-[var(--ll-ink)]"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <YouTubeSongSearch
                selectedIds={draft.trackIds}
                full={draft.trackIds.length >= MAX_MIXTAPE_TRACKS}
                onAdd={addTrack}
              />

              <p className="mb-1 mt-3 font-pixel text-[8px] text-[var(--ll-muted)]">
                From our crate
              </p>
              <ul className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl border-2 border-[var(--ll-lavender)] bg-[#fffbf2]/70 p-2 dark:bg-white/5">
                {MIX_TRACKS.map((track) => {
                  const on = draft.trackIds.includes(track.id);
                  const order = draft.trackIds.indexOf(track.id);
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => toggleTrack(track.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition",
                          on
                            ? "border-[#8b5e34] bg-[#fff6df] shadow-[2px_2px_0_#d2a35a]"
                            : "border-transparent hover:border-[#cbb892] hover:bg-white/60 dark:hover:bg-white/10"
                        )}
                        aria-pressed={on}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm font-pixel text-[9px]",
                            on
                              ? "bg-[#8b5e34] text-[#fff6df]"
                              : "bg-[#ebe1cd] text-[#6b5a44]"
                          )}
                        >
                          {on ? order + 1 : "+"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-sm text-[var(--ll-ink)]">
                            {track.mood === "romantic" ? "♥ " : ""}
                            {track.title}
                          </span>
                          <span className="block truncate font-pixel text-[7px] text-[var(--ll-muted)]">
                            {track.artist} · {track.year}
                            {track.mood === "romantic" ? " · romantic" : ""}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {error ? (
              <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/50 px-3 py-3 dark:bg-white/5">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#8b5e34]"
                checked={shareExample}
                onChange={(e) => setShareExample(e.target.checked)}
              />
              <span>
                <span className="block font-display text-sm text-[var(--ll-ink)]">
                  Share a short preview on the homepage
                </span>
                <span className="mt-0.5 block text-xs text-[var(--ll-muted)]">
                  Optional example for others — names, tape title, and a short
                  dedication line. Never the email.
                </span>
              </span>
            </label>

            <div className="flex flex-wrap gap-3 pt-1">
              {draft.trackIds.length >= MIN_MIXTAPE_TRACKS &&
              draft.title.trim() ? (
                <Link
                  href={`/mix/${encodeURIComponent(
                    encodeMixShare({
                      title: draft.title.trim() || "Untitled Mix",
                      from: draft.senderName.trim() || "a friend",
                      to: draft.recipientName.trim() || "someone special",
                      note: draft.dedication.trim(),
                      tracks: draft.trackIds,
                      extras: draft.customTracks,
                    })
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PixelButton type="button" variant="secondary">
                    ▶ Preview mix
                  </PixelButton>
                </Link>
              ) : null}
              {needsPayment && !demo ? (
                <PixelButton
                  type="submit"
                  size="lg"
                  disabled={paying || sending}
                >
                  {paying ? "Opening checkout..." : `💳 Pay ${priceLabel} & send mix`}
                </PixelButton>
              ) : (
                <PixelButton
                  type="submit"
                  size="lg"
                  disabled={sending || paying}
                >
                  {sending || paying
                    ? "Posting the tape..."
                    : demo
                      ? "📼 Send mixtape (demo)"
                      : "📼 Mail the mixtape"}
                </PixelButton>
              )}
            </div>
          </form>
        </PixelWindow>
      </div>
    </div>
  );
}
