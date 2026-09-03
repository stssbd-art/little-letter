"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { Field, PixelInput, PixelTextarea } from "@/components/ui/PixelInput";
import { useSound } from "@/components/providers/SoundProvider";
import { encodeMixShare, decodeMixShare } from "@/lib/mixtape-link";
import {
  clearMixtapeDraft,
  draftHasSongs,
  EMPTY_MIXTAPE_DRAFT,
  loadMixtapeDraft,
  saveMixtapeDraft,
  type MixtapeDraft,
} from "@/lib/mixtape-draft";
import {
  getTracksByIds,
  MAX_MIXTAPE_TRACKS,
  MIN_MIXTAPE_TRACKS,
  MIX_TRACKS,
  type MixTrack,
} from "@/lib/tracks";
import { loadYouTubeApi, type YtPlayer } from "@/lib/youtube";
import { YouTubeSongSearch } from "@/components/features/YouTubeSongSearch";
import { TermsAcceptance } from "@/components/features/TermsAcceptance";
import { VoiceNoteRecorder } from "@/components/features/VoiceNoteRecorder";
import { clearVoiceBlob, loadVoicePayloadSafe } from "@/lib/voice-note-client";
import type { MixtapePayload } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  MIX_MULTI_SONG_LABEL,
  MIX_ONE_SONG_LABEL,
} from "@/lib/usage-labels";
import { getCheckoutUrl, prefetchCheckout } from "@/lib/checkout-client";

const TERMS_STORAGE_KEY = "little-letter-accepted-terms";

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

const emptyDraft = EMPTY_MIXTAPE_DRAFT;

export function MixtapeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { play } = useSound();
  const [draft, setDraft] = useState<MixtapeDraft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [shareExample, setShareExample] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const hydratedRef = useRef(false);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const indexRef = useRef(0);
  const tracksRef = useRef<MixTrack[]>([]);
  const pendingPlayIdRef = useRef<string | null>(null);
  const playerReadyRef = useRef(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(TERMS_STORAGE_KEY) === "1") {
        setAcceptedTerms(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function updateAcceptedTerms(next: boolean) {
    setAcceptedTerms(next);
    try {
      sessionStorage.setItem(TERMS_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function hasAcceptedTerms() {
    if (acceptedTerms) return true;
    try {
      return sessionStorage.getItem(TERMS_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  }

  const selected = getTracksByIds(draft.trackIds, draft.customTracks);

  useEffect(() => {
    tracksRef.current = selected;
    if (!selected.length) {
      setPlaying(false);
      setPlayIndex(0);
      indexRef.current = 0;
      try {
        playerRef.current?.pauseVideo();
      } catch {
        /* ignore */
      }
      return;
    }
    if (playIndex >= selected.length) {
      const next = selected.length - 1;
      setPlayIndex(next);
      indexRef.current = next;
    }
  }, [selected, playIndex]);

  useEffect(() => {
    indexRef.current = playIndex;
  }, [playIndex]);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const seedId =
      MIX_TRACKS[0]?.youtubeId ||
      selected[0]?.youtubeId ||
      "dQw4w9WgXcQ";

    const startPending = () => {
      const pending = pendingPlayIdRef.current;
      if (!pending || !playerRef.current) return;
      pendingPlayIdRef.current = null;
      try {
        playerRef.current.loadVideoById(pending);
        playerRef.current.playVideo();
        setPlaying(true);
        setPlayerError("");
      } catch {
        setPlayerError("Couldn’t start playback — tap Play on the deck.");
      }
    };

    const mountPlayer = async () => {
      const container = hostRef.current;
      if (!container) {
        if (!cancelled && tries++ < 40) {
          window.setTimeout(() => void mountPlayer(), 50);
        }
        return;
      }

      try {
        const YT = await loadYouTubeApi();
        if (cancelled) return;

        try {
          playerRef.current?.destroy();
        } catch {
          /* ignore */
        }
        const mount = document.createElement("div");
        mount.style.width = "100%";
        mount.style.height = "100%";
        container.replaceChildren(mount);

        playerRef.current = new YT.Player(mount, {
          videoId: seedId,
          width: "100%",
          height: "100%",
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            controls: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              playerReadyRef.current = true;
              setPlayerReady(true);
              setPlayerError("");
              startPending();
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const { ENDED, PLAYING, PAUSED } = YT.PlayerState;
              if (event.data === PLAYING) setPlaying(true);
              if (event.data === PAUSED) setPlaying(false);
              if (event.data === ENDED) {
                const list = tracksRef.current;
                if (list.length < 2) {
                  setPlaying(false);
                  return;
                }
                const next = (indexRef.current + 1) % list.length;
                setPlayIndex(next);
                indexRef.current = next;
                try {
                  event.target.loadVideoById(list[next]!.youtubeId);
                  event.target.playVideo();
                } catch {
                  setPlaying(false);
                }
              }
            },
            onError: () => {
              if (cancelled) return;
              setPlayerError("This track couldn’t play — trying the next one.");
              setPlaying(false);
              const list = tracksRef.current;
              if (list.length < 2) return;
              const next = (indexRef.current + 1) % list.length;
              window.setTimeout(() => {
                if (cancelled) return;
                setPlayIndex(next);
                indexRef.current = next;
                try {
                  playerRef.current?.loadVideoById(list[next]!.youtubeId);
                  playerRef.current?.playVideo();
                } catch {
                  /* ignore */
                }
              }, 400);
            },
          },
        });
      } catch {
        if (!cancelled) {
          playerReadyRef.current = false;
          setPlayerReady(false);
          setPlayerError("Could not load the music player. Check your connection.");
        }
      }
    };

    void mountPlayer();

    return () => {
      cancelled = true;
      pendingPlayIdRef.current = null;
      playerReadyRef.current = false;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setPlayerReady(false);
      setPlaying(false);
    };
    // Mount once for the form session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playTrackAt(list: MixTrack[], next: number) {
    const nextTrack = list[next];
    if (!nextTrack) return;
    setPlayIndex(next);
    indexRef.current = next;
    setPlayerError("");
    const player = playerRef.current;
    if (player && playerReadyRef.current) {
      try {
        player.loadVideoById(nextTrack.youtubeId);
        player.playVideo();
        setPlaying(true);
      } catch {
        pendingPlayIdRef.current = nextTrack.youtubeId;
        setPlayerError("Couldn’t switch track — tap Play on the deck.");
      }
    } else {
      pendingPlayIdRef.current = nextTrack.youtubeId;
    }
  }

  function playSelected() {
    const list = tracksRef.current;
    if (!list.length) return;
    play("click");
    playTrackAt(list, Math.min(indexRef.current, list.length - 1));
  }

  function stopSelected() {
    const player = playerRef.current;
    play("click");
    try {
      player?.pauseVideo();
    } catch {
      /* ignore */
    }
    setPlaying(false);
  }

  function prevSelected() {
    const list = tracksRef.current;
    if (list.length < 2) return;
    play("click");
    const next = (indexRef.current - 1 + list.length) % list.length;
    playTrackAt(list, next);
  }

  function nextSelected() {
    const list = tracksRef.current;
    if (list.length < 2) return;
    play("click");
    const next = (indexRef.current + 1) % list.length;
    playTrackAt(list, next);
  }

  useEffect(() => {
    let next = loadMixtapeDraft() ?? emptyDraft;

    // Restore from Preview mix link (?restore=code) so a new tab keeps songs
    const restoreCode = searchParams.get("restore");
    if (restoreCode) {
      try {
        const mix = decodeMixShare(decodeURIComponent(restoreCode.trim()));
        if (mix?.tracks?.length) {
          next = {
            ...next,
            title: next.title || mix.title || "",
            senderName: next.senderName || mix.from || "",
            recipientName: next.recipientName || mix.to || "",
            dedication: next.dedication || mix.note || "",
            trackIds: mix.tracks,
            customTracks: mix.extras ?? [],
          };
          saveMixtapeDraft(next);
        }
      } catch {
        /* ignore bad restore codes */
      }
    }

    setDraft(next);
    hydratedRef.current = true;
    setReady(true);

    // Drop ?restore= so refresh doesn't fight Stripe return params
    if (restoreCode && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("restore") && !url.searchParams.has("paid")) {
        url.searchParams.delete("restore");
        window.history.replaceState({}, "", `${url.pathname}${url.search}`);
      }
    }
    // Only hydrate once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !hydratedRef.current) return;
    saveMixtapeDraft(draft);
  }, [draft, ready]);

  function resolveDraft(): MixtapeDraft {
    if (draftHasSongs(draft) && draft.recipientEmail.trim()) return draft;
    const stored = loadMixtapeDraft();
    if (stored && draftHasSongs(stored)) return stored;
    return draft;
  }

  async function refreshUsage() {
    const count = Math.max(1, draft.trackIds.length || 1);
    const email = draft.senderEmail.trim();
    const qs = new URLSearchParams({
      kind: "mixtape",
      trackCount: String(count),
      t: String(Date.now()),
    });
    if (email) qs.set("email", email);
    const res = await fetch(`/api/usage?${qs.toString()}`, {
      cache: "no-store",
    });
    const data = (await res.json()) as UsageInfo;
    if (res.ok) {
      setUsage(data);
      setNeedsPayment(!(data.demo || data.canSend));
    }
  }

  useEffect(() => {
    void refreshUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.trackIds.length, draft.senderEmail]);

  useEffect(() => {
    if (!needsPayment || !draft.senderEmail.trim()) return;
    prefetchCheckout({
      returnPath: "/mixtape",
      kind: "mixtape",
      trackCount: Math.max(1, draft.trackIds.length),
      senderEmail: draft.senderEmail.trim(),
    });
  }, [needsPayment, draft.senderEmail, draft.trackIds.length]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paid = searchParams.get("paid");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      setError(
        `Payment cancelled. Your first mixtape is free; extra mixes are ${MIX_ONE_SONG_LABEL} for 1 song, or ${MIX_MULTI_SONG_LABEL} for 2+ songs.`
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
            body: JSON.stringify({
              sessionId,
              senderEmail: resolveDraft().senderEmail.trim(),
            }),
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

  function removeTrack(id: string) {
    play("click");
    setDraft((prev) => {
      const nextIds = prev.trackIds.filter((t) => t !== id);
      const nextCustoms = prev.customTracks.filter((t) => t.id !== id);
      const nextList = getTracksByIds(nextIds, nextCustoms);
      window.setTimeout(() => {
        if (!nextList.length) {
          try {
            playerRef.current?.pauseVideo();
          } catch {
            /* ignore */
          }
          setPlaying(false);
          return;
        }
        const currentId = tracksRef.current[indexRef.current]?.id;
        const stillHere = nextList.findIndex((t) => t.id === currentId);
        playTrackAt(nextList, stillHere >= 0 ? stillHere : 0);
      }, 0);
      return {
        ...prev,
        trackIds: nextIds,
        customTracks: nextCustoms,
      };
    });
  }

  function toggleTrack(id: string) {
    play("click");
    setDraft((prev) => {
      if (prev.trackIds.includes(id)) {
        // Already on the tape — audition it (use Remove to drop it)
        const list = getTracksByIds(prev.trackIds, prev.customTracks);
        const idx = list.findIndex((t) => t.id === id);
        window.setTimeout(() => playTrackAt(list, idx >= 0 ? idx : 0), 0);
        return prev;
      }
      if (prev.trackIds.length >= MAX_MIXTAPE_TRACKS) return prev;
      const nextIds = [...prev.trackIds, id];
      const nextList = getTracksByIds(nextIds, prev.customTracks);
      const addedAt = nextList.findIndex((t) => t.id === id);
      window.setTimeout(
        () => playTrackAt(nextList, addedAt >= 0 ? addedAt : nextList.length - 1),
        0
      );
      return { ...prev, trackIds: nextIds };
    });
  }

  function addTrack(track: MixTrack) {
    play("click");
    setDraft((prev) => {
      if (prev.trackIds.includes(track.id)) {
        const list = getTracksByIds(prev.trackIds, prev.customTracks);
        const existing = list.findIndex((t) => t.id === track.id);
        window.setTimeout(() => playTrackAt(list, existing >= 0 ? existing : 0), 0);
        return prev;
      }
      if (prev.trackIds.length >= MAX_MIXTAPE_TRACKS) return prev;
      const customTracks = track.id.startsWith("yt:")
        ? [...prev.customTracks.filter((t) => t.id !== track.id), track]
        : prev.customTracks;
      const nextIds = [...prev.trackIds, track.id];
      const nextList = getTracksByIds(nextIds, customTracks);
      window.setTimeout(() => playTrackAt(nextList, nextList.length - 1), 0);
      return {
        ...prev,
        trackIds: nextIds,
        customTracks,
      };
    });
  }

  function validate(d: MixtapeDraft = resolveDraft()): string | null {
    if (!d.recipientName.trim()) return "Who is this mix for?";
    if (!d.recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.recipientEmail)) {
      return "Need a valid recipient email.";
    }
    if (!d.senderName.trim()) return "Add your name on the cassette label.";
    if (
      !d.senderEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.senderEmail.trim())
    ) {
      return "Add your email so we can track free sends (not shown to them).";
    }
    if (!d.title.trim()) return "Give the mixtape a title.";
    if (d.trackIds.length < MIN_MIXTAPE_TRACKS) {
      return `Pick at least ${MIN_MIXTAPE_TRACKS} song${MIN_MIXTAPE_TRACKS === 1 ? "" : "s"} for the mix.`;
    }
    if (!hasAcceptedTerms()) {
      return "Please agree to the Terms, Privacy Policy, and Refund Policy before sending.";
    }
    return null;
  }

  async function sendMixtape() {
    const current = resolveDraft();
    if (current !== draft && draftHasSongs(current)) {
      setDraft(current);
    }
    const problem = validate(current);
    if (problem) {
      setError(problem);
      setPaying(false);
      setSending(false);
      return;
    }

    setSending(true);
    setError("");
    play("whoosh");
    saveMixtapeDraft(current);

    const payload: MixtapePayload = {
      recipientName: current.recipientName.trim(),
      recipientEmail: current.recipientEmail.trim(),
      senderName: current.senderName.trim(),
      senderEmail: current.senderEmail.trim(),
      title: current.title.trim(),
      dedication: current.dedication.trim(),
      trackIds: current.trackIds,
      customTracks: current.customTracks,
      createdAt: new Date().toISOString(),
    };

    try {
      const voiceNote = await loadVoicePayloadSafe("mixtape");
      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 35_000);
      let res: Response;
      try {
        res = await fetch("/api/send-mixtape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, shareExample, voiceNote }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(abortTimer);
      }
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(
          res.status === 504 || res.status >= 500
            ? "Send timed out. Please try again — any used credit should be restored automatically."
            : "Could not send mixtape. Please try again."
        );
      }

      if (res.status === 402) {
        const count = Math.max(1, current.trackIds.length || 1);
        const qs = new URLSearchParams({
          kind: "mixtape",
          trackCount: String(count),
          t: String(Date.now()),
        });
        if (current.senderEmail.trim()) {
          qs.set("email", current.senderEmail.trim());
        }
        const latest = await fetch(`/api/usage?${qs.toString()}`, {
          cache: "no-store",
        }).then((r) => r.json() as Promise<UsageInfo>);
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
      await clearVoiceBlob("mixtape");
      clearMixtapeDraft();
      router.push("/success?kind=mixtape");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send mixtape");
      setSending(false);
    }
  }

  async function startPayment() {
    const current = resolveDraft();
    if (current !== draft && draftHasSongs(current)) {
      setDraft(current);
    }
    const problem = validate(current);
    if (problem) {
      setError(problem);
      return;
    }
    // Flush before leaving for Stripe so return / other tabs keep the mix
    saveMixtapeDraft(current);
    setPaying(true);
    setError("");
    play("click");
    try {
      const url = await getCheckoutUrl({
        returnPath: "/mixtape",
        kind: "mixtape",
        trackCount: Math.max(1, current.trackIds.length),
        senderEmail: current.senderEmail.trim(),
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  const songCount = Math.max(1, draft.trackIds.length || 1);
  const priceLabel =
    usage?.price ??
    (songCount <= 1
      ? usage?.priceOneSong ?? MIX_ONE_SONG_LABEL
      : usage?.priceMultiSong ?? MIX_MULTI_SONG_LABEL);
  const demo = usage?.demo ?? false;
  const freeLeft = usage?.freeAvailable ?? true;
  const freeRemaining = usage?.freeLeft ?? 1;
  const paidReady = (usage?.credits ?? 0) > 0;

  function previewMixHref(): string | null {
    if (!draft.trackIds.length) return null;
    try {
      const code = encodeMixShare({
        title: draft.title.trim() || "Untitled Mix",
        from: draft.senderName.trim() || "a friend",
        to: draft.recipientName.trim() || "someone special",
        note: draft.dedication.trim(),
        tracks: draft.trackIds,
        extras: draft.customTracks,
      });
      return `/mix/${encodeURIComponent(code)}?from=create`;
    } catch {
      return null;
    }
  }

  const previewHref = previewMixHref();

  const previewMixButton = previewHref ? (
    <Link
      href={previewHref}
      target="_blank"
      rel="noreferrer"
      onClick={() => saveMixtapeDraft(draft)}
    >
      <PixelButton type="button" variant="secondary">
        ▶ Preview mix
      </PixelButton>
    </Link>
  ) : (
    <PixelButton type="button" variant="secondary" disabled>
      ▶ Preview mix
    </PixelButton>
  );

  return (
    <div className="space-y-6">
      <PixelWindow title="pricing.ini" icon={demo ? "🧪" : "💷"} liftOnHover={false}>
        <p className="font-display text-sm text-[var(--ll-ink)]">
          {demo
            ? "Demo mode — sends are free for testing. No payment asked right now."
            : freeLeft
              ? `Your first mixtape is free (${freeRemaining} left). After that: ${MIX_ONE_SONG_LABEL} for 1 song · ${MIX_MULTI_SONG_LABEL} for 2 or more. Current pick (${songCount} song${songCount === 1 ? "" : "s"}): ${priceLabel}.`
              : paidReady
                ? `You have ${usage?.credits} paid mixtape credit${usage?.credits === 1 ? "" : "s"} ready.`
                : `Your free mixtape is used. Extra mixes are ${MIX_ONE_SONG_LABEL} for 1 song · ${MIX_MULTI_SONG_LABEL} for 2 or more. Current pick (${songCount} song${songCount === 1 ? "" : "s"}): ${priceLabel}.`}
        </p>
      </PixelWindow>

      <VoiceNoteRecorder kind="mixtape" />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr] lg:items-start">
        <div className="space-y-4">
          <CassetteDeck
            title={draft.title}
            fromName={draft.senderName}
            toName={draft.recipientName}
            tracks={selected}
            spinning={playing}
            loading={!playerReady}
            nowPlaying={selected[playIndex] ?? null}
            className="max-w-none"
            screenRef={hostRef}
            onPlay={playSelected}
            onStop={stopSelected}
            onPrev={prevSelected}
            onNext={nextSelected}
            controlsDisabled={selected.length === 0}
            prevDisabled={selected.length < 2}
            nextDisabled={selected.length < 2}
          >
            <YouTubeSongSearch
              selectedIds={draft.trackIds}
              full={draft.trackIds.length >= MAX_MIXTAPE_TRACKS}
              onAdd={addTrack}
              className="rounded-lg border border-[#1a1510]/70 bg-[#fff6df]/15 p-2"
            />
          </CassetteDeck>
          {playerError ? (
            <p className="text-left text-xs text-[var(--ll-pink-deep)]">{playerError}</p>
          ) : (
            <p className="text-left font-pixel text-[8px] leading-relaxed text-[var(--ll-muted)]">
              {selected.length
                ? playing
                  ? `Now playing · ${selected[playIndex]?.title ?? "your mix"}`
                  : "Tap a song under the deck to audition it"
                : `Hand-labelled · Side A forever · pick at least ${MIN_MIXTAPE_TRACKS} song${MIN_MIXTAPE_TRACKS === 1 ? "" : "s"}`}
            </p>
          )}

          <div className="rounded-xl border-2 border-[#d2a35a] bg-[#fff6df]/80 p-3">
            <div className="mb-2 flex items-end justify-between gap-2">
              <p className="font-display text-sm text-[var(--ll-ink)]">Your mix</p>
              <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
                {draft.trackIds.length}/{MAX_MIXTAPE_TRACKS} · min{" "}
                {MIN_MIXTAPE_TRACKS}
              </p>
            </div>
            {selected.length ? (
              <ul className="space-y-1">
                {selected.map((track, i) => (
                  <li
                    key={track.id}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-1 py-1",
                      i === playIndex && playing
                        ? "bg-[#f6d58a]/50"
                        : "hover:bg-[#f6d58a]/25"
                    )}
                  >
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      onClick={() => {
                        play("click");
                        playTrackAt(selected, i);
                      }}
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
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTrack(track.id)}
                      className="font-pixel text-[8px] text-[var(--ll-muted)] hover:text-[var(--ll-ink)]"
                    >
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-pixel text-[8px] leading-relaxed text-[var(--ll-muted)]">
                Pick songs below — they’ll line up here.
              </p>
            )}
          </div>

          <div className="rounded-xl border-2 border-[var(--ll-lavender)] bg-[#fffbf2]/80 p-3 dark:bg-white/5">
            <p className="mb-1 font-display text-sm text-[var(--ll-ink)]">
              From our crate
            </p>
            <p className="mb-2 text-xs text-[var(--ll-muted)]">
              Tap a track to add it to the mix.
            </p>
            <ul className="ll-song-scroll max-h-72 space-y-1.5 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/70 p-2 pr-1 dark:bg-white/5">
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

          <div className="flex flex-wrap justify-start gap-3">
            {previewMixButton}
            <PixelButton
              type="button"
              size="lg"
              disabled={!previewHref || sending || paying || !acceptedTerms}
              onClick={() => {
                const form = document.getElementById("mix-title")?.closest("form");
                form?.requestSubmit();
              }}
            >
              {sending || paying
                ? "Posting the tape..."
                : needsPayment && !demo
                  ? `💳 Pay ${priceLabel} & send mix`
                  : demo
                    ? "📼 Send mixtape (demo)"
                    : "📼 Mail the mixtape"}
            </PixelButton>
          </div>
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

            <Field
              label="Your email"
              htmlFor="mix-sender-email"
              hint="Tracks your free mixtape — not shown on the cassette"
            >
              <PixelInput
                id="mix-sender-email"
                type="email"
                value={draft.senderEmail}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, senderEmail: e.target.value }))
                }
                placeholder="you@email.com"
                required
              />
            </Field>

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
                  Share a short preview on The Wall
                </span>
                <span className="mt-0.5 block text-xs text-[var(--ll-muted)]">
                  Optional peek for others on The Wall — names, tape title, and a
                  short dedication line. Never the email.
                </span>
              </span>
            </label>

            <TermsAcceptance
              checked={acceptedTerms}
              onChange={updateAcceptedTerms}
              id="mixtape-accept-terms"
            />

            <div className="flex flex-wrap gap-3 pt-1">
              {previewMixButton}
              {needsPayment && !demo ? (
                <PixelButton
                  type="submit"
                  size="lg"
                  disabled={paying || sending || !acceptedTerms}
                >
                  {paying ? "Opening checkout..." : `💳 Pay ${priceLabel} & send mix`}
                </PixelButton>
              ) : (
                <PixelButton
                  type="submit"
                  size="lg"
                  disabled={sending || paying || !acceptedTerms}
                >
                  {sending || paying
                    ? "Posting the tape..."
                    : demo
                      ? "📼 Send mixtape (demo)"
                      : "📼 Mail the mixtape"}
                </PixelButton>
              )}
            </div>
            {!previewHref ? (
              <p className="text-xs text-[var(--ll-muted)]">
                Add at least one song to unlock Preview mix.
              </p>
            ) : null}
          </form>
        </PixelWindow>
      </div>
    </div>
  );
}
