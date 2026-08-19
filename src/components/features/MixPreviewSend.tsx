"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { Field, PixelInput } from "@/components/ui/PixelInput";
import { TermsAcceptance } from "@/components/features/TermsAcceptance";
import { useSound } from "@/components/providers/SoundProvider";
import {
  clearMixtapeDraft,
  loadMixtapeDraft,
  saveMixtapeDraft,
  type MixtapeDraft,
} from "@/lib/mixtape-draft";
import type { MixShare } from "@/lib/mixtape-link";
import type { MixtapePayload } from "@/types";

const TERMS_STORAGE_KEY = "little-letter-accepted-terms";

type UsageInfo = {
  demo?: boolean;
  freeAvailable: boolean;
  credits: number;
  canSend: boolean;
  price: string;
};

type Props = {
  mix: MixShare;
  mixPath: string;
};

export function MixPreviewSend({ mix, mixPath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { play } = useSound();
  const [draft, setDraft] = useState<MixtapeDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [shareExample, setShareExample] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(TERMS_STORAGE_KEY) === "1") {
        setAcceptedTerms(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stored = loadMixtapeDraft();
    const fromCreate = searchParams.get("from") === "create";
    const tracksMatch =
      stored &&
      mix.tracks.length > 0 &&
      stored.trackIds.join(",") === mix.tracks.join(",");

    if (!fromCreate && !tracksMatch) {
      setReady(true);
      return;
    }

    const next: MixtapeDraft = {
      recipientName: stored?.recipientName || mix.to || "",
      recipientEmail: stored?.recipientEmail || "",
      senderName: stored?.senderName || mix.from || "",
      senderEmail: stored?.senderEmail || "",
      title: stored?.title || mix.title || "",
      dedication: stored?.dedication || mix.note || "",
      trackIds: mix.tracks,
      customTracks: mix.extras ?? stored?.customTracks ?? [],
    };
    saveMixtapeDraft(next);
    setDraft(next);
    setReady(true);
  }, [mix, searchParams]);

  useEffect(() => {
    if (!draft) return;
    const email = draft.senderEmail.trim();
    const qs = new URLSearchParams({
      kind: "mixtape",
      trackCount: String(Math.max(1, draft.trackIds.length)),
      t: String(Date.now()),
    });
    if (email) qs.set("email", email);
    void fetch(`/api/usage?${qs.toString()}`, { cache: "no-store" })
      .then((r) => r.json() as Promise<UsageInfo>)
      .then((data) => {
        setUsage(data);
        setNeedsPayment(!(data.demo || data.canSend));
      })
      .catch(() => {
        /* ignore */
      });
  }, [draft]);

  function updateAcceptedTerms(next: boolean) {
    setAcceptedTerms(next);
    try {
      sessionStorage.setItem(TERMS_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function validate(d: MixtapeDraft): string | null {
    if (!d.recipientName.trim()) return "Who is this mix for?";
    if (!d.recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.recipientEmail)) {
      return "Need a valid recipient email.";
    }
    if (!d.senderName.trim()) return "Add your name on the cassette label.";
    if (!d.senderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.senderEmail.trim())) {
      return "Add your email so we can track free sends.";
    }
    if (!d.title.trim()) return "Give the mixtape a title.";
    if (!acceptedTerms) {
      return "Please agree to the Terms, Privacy Policy, and Refund Policy before sending.";
    }
    return null;
  }

  async function sendMixtape() {
    if (!draft) return;
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      setPaying(false);
      setSending(false);
      return;
    }
    setSending(true);
    setError("");
    play("whoosh");
    saveMixtapeDraft(draft);

    const payload: MixtapePayload = {
      recipientName: draft.recipientName.trim(),
      recipientEmail: draft.recipientEmail.trim(),
      senderName: draft.senderName.trim(),
      senderEmail: draft.senderEmail.trim(),
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
        setNeedsPayment(true);
        setError(data.error ?? "Payment required for extra sends.");
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
      clearMixtapeDraft();
      router.push("/success?kind=mixtape");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send mixtape");
      setSending(false);
    }
  }

  async function startPayment() {
    if (!draft) return;
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      return;
    }
    saveMixtapeDraft(draft);
    setPaying(true);
    setError("");
    play("click");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnPath: mixPath,
          kind: "mixtape",
          trackCount: Math.max(1, draft.trackIds.length),
          senderEmail: draft.senderEmail.trim(),
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

  useEffect(() => {
    if (!ready || !draft) return;
    const sessionId = searchParams.get("session_id");
    const paid = searchParams.get("paid");
    const cancelled = searchParams.get("cancelled");
    if (cancelled) {
      setError("Payment cancelled. You can still send from this preview.");
      return;
    }
    if (paid && sessionId) {
      void (async () => {
        setPaying(true);
        try {
          const verify = await fetch("/api/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              senderEmail: draft.senderEmail.trim(),
            }),
          });
          const verifyData = await verify.json();
          if (!verify.ok) {
            throw new Error(verifyData.error ?? "Could not verify payment");
          }
          await sendMixtape();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Payment verify failed");
          setPaying(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, draft, searchParams]);

  if (!ready || !draft) return null;

  const demo = usage?.demo ?? false;
  const priceLabel = usage?.price ?? "£1.25";

  return (
    <PixelWindow title="send_this_mix.bat" icon="💌" liftOnHover={false}>
      <p className="font-display text-sm text-[var(--ll-ink)]">
        Like how it sounds? Mail this mixtape from here — no need to go back.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Their email" htmlFor="preview-mix-to-email">
          <PixelInput
            id="preview-mix-to-email"
            type="email"
            value={draft.recipientEmail}
            onChange={(e) => {
              const recipientEmail = e.target.value;
              setDraft((d) => {
                if (!d) return d;
                const next = { ...d, recipientEmail };
                saveMixtapeDraft(next);
                return next;
              });
            }}
            placeholder="friend@email.com"
            required
          />
        </Field>
        <Field label="Your email" htmlFor="preview-mix-from-email">
          <PixelInput
            id="preview-mix-from-email"
            type="email"
            value={draft.senderEmail}
            onChange={(e) => {
              const senderEmail = e.target.value;
              setDraft((d) => {
                if (!d) return d;
                const next = { ...d, senderEmail };
                saveMixtapeDraft(next);
                return next;
              });
            }}
            placeholder="you@email.com"
            required
          />
        </Field>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-[var(--ll-lavender)] bg-white/50 px-3 py-3 dark:bg-white/5">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[#8b5e34]"
          checked={shareExample}
          onChange={(e) => setShareExample(e.target.checked)}
        />
        <span className="text-sm text-[var(--ll-muted)]">
          Share a short preview on the homepage
        </span>
      </label>

      <div className="mt-4">
        <TermsAcceptance
          checked={acceptedTerms}
          onChange={updateAcceptedTerms}
          id="mix-preview-accept-terms"
        />
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        {needsPayment && !demo ? (
          <PixelButton
            size="lg"
            onClick={() => void startPayment()}
            disabled={paying || sending || !acceptedTerms}
          >
            {paying ? "Opening checkout..." : `💳 Pay ${priceLabel} & send mix`}
          </PixelButton>
        ) : (
          <PixelButton
            size="lg"
            onClick={() => void sendMixtape()}
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
    </PixelWindow>
  );
}
