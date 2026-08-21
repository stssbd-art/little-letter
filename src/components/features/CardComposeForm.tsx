"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GreetingCard } from "@/components/features/GreetingCard";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { Field, PixelInput, PixelSelect, PixelTextarea } from "@/components/ui/PixelInput";
import { useLetter } from "@/components/providers/LetterProvider";
import { useSound } from "@/components/providers/SoundProvider";
import { getCardDesign, type CardDesignId } from "@/lib/card-designs";
import { OCCASIONS, RELATIONSHIPS } from "@/lib/constants";
import type { Relationship } from "@/types";

type Props = {
  designId: CardDesignId;
};

export function CardComposeForm({ designId }: Props) {
  const design = getCardDesign(designId);
  const occasionMeta = OCCASIONS.find((o) => o.value === design.occasion);
  const router = useRouter();
  const { setForm, setLetter } = useLetter();
  const { play } = useSound();

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("friend");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [helpLoading, setHelpLoading] = useState(false);

  async function helpWrite() {
    setError("");
    setHelpLoading(true);
    play("click");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName.trim() || "friend",
          recipientEmail: recipientEmail.trim() || "preview@example.com",
          senderName: senderName.trim() || "you",
          senderEmail: senderEmail.trim() || "you@example.com",
          relationship,
          occasion: design.occasion,
          style: "cute",
          customNote: `Write a short greeting-card style message for the "${design.title}" card.`,
          writeMode: "ai",
          ownSubject: "",
          ownMessage: "",
          cardDesign: designId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not draft a message");
      setSubject(data.subject ?? "");
      setMessage(data.message ?? "");
      play("sparkle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setHelpLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    play("click");

    try {
      const trimmedMessage = message.trim();
      if (!recipientName.trim() || !senderName.trim()) {
        throw new Error("Add both names so the card feels personal.");
      }
      if (!recipientEmail.trim() || !senderEmail.trim()) {
        throw new Error("Both emails are needed to send the card.");
      }
      if (trimmedMessage.length < 8) {
        throw new Error("Write a little more — at least a short wish.");
      }
      if (trimmedMessage.length > 4000) {
        throw new Error("Keep the message under 4000 characters.");
      }

      const form = {
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim(),
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim().toLowerCase(),
        relationship,
        occasion: design.occasion,
        style: "cute" as const,
        customNote: "",
        writeMode: "own" as const,
        ownSubject: subject.trim(),
        ownMessage: trimmedMessage,
        cardDesign: designId,
      };

      setForm(form);
      setLetter({
        subject:
          subject.trim() ||
          `${design.title} for ${recipientName.trim()}`,
        message: trimmedMessage,
        form,
        createdAt: new Date().toISOString(),
      });

      play("whoosh");
      router.push("/preview?from=card");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/cards"
          className="font-display text-sm text-[var(--ll-pink-deep)] underline-offset-2 hover:underline"
        >
          ← All cards
        </Link>
        <p className="font-pixel text-[8px] text-[var(--ll-muted)]">
          {occasionMeta?.emoji} {occasionMeta?.label} card
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="rounded-3xl border-[3px] p-4 sm:p-6"
          style={{
            background: design.pageBg,
            borderColor: design.border,
            boxShadow: `6px 6px 0 ${design.border}55`,
          }}
        >
          <GreetingCard
            designId={designId}
            recipientName={recipientName.trim() || "friend"}
            subject={subject.trim() || design.title}
            message={
              message.trim() ||
              "Write your wish on the right — it appears here live."
            }
            senderName={senderName.trim() || "you"}
            occasionLabel={occasionMeta?.label}
          />
        </motion.div>

        <PixelWindow title="personalise_card.exe" icon={design.emoji}>
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm text-[var(--ll-muted)]">
              {design.blurb}. Fill in the details, then preview &amp; send —
              each e-card is £1.25 (no free card allowance).
              They’ll get an email with a button to open the animated card on
              the website.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="To (name)" htmlFor="card-to-name">
                <PixelInput
                  id="card-to-name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Alex"
                  required
                />
              </Field>
              <Field label="To (email)" htmlFor="card-to-email">
                <PixelInput
                  id="card-to-email"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="alex@email.com"
                  required
                />
              </Field>
              <Field label="From (name)" htmlFor="card-from-name">
                <PixelInput
                  id="card-from-name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Sam"
                  required
                />
              </Field>
              <Field label="From (email)" htmlFor="card-from-email">
                <PixelInput
                  id="card-from-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                />
              </Field>
            </div>

            <Field label="Relationship" htmlFor="card-relationship">
              <PixelSelect
                id="card-relationship"
                value={relationship}
                onChange={(e) =>
                  setRelationship(e.target.value as Relationship)
                }
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </PixelSelect>
            </Field>

            <Field label="Card title (optional)" htmlFor="card-subject">
              <PixelInput
                id="card-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={design.title}
                maxLength={120}
              />
            </Field>

            <Field label="Your message" htmlFor="card-message">
              <PixelTextarea
                id="card-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a short warm wish…"
                rows={6}
                required
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              <PixelButton
                type="button"
                variant="ghost"
                disabled={helpLoading || loading}
                onClick={helpWrite}
              >
                {helpLoading ? "Drafting…" : "✨ Help me write"}
              </PixelButton>
              <PixelButton type="submit" disabled={loading || helpLoading}>
                {loading ? "Opening preview…" : "Preview & send card →"}
              </PixelButton>
            </div>

            {error ? (
              <p className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
          </form>
        </PixelWindow>
      </div>
    </div>
  );
}
