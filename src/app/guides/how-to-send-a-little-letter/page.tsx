import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  CONTENT_UPDATED,
  formatContentDate,
} from "@/lib/content-updated";
import {
  CARD_PRICE_LABEL,
  MIX_MULTI_SONG_LABEL,
  MIX_ONE_SONG_LABEL,
} from "@/lib/usage-labels";

export const metadata: Metadata = {
  title: "How to Send a Little Letter, Card, or Mixtape",
  description:
    "Step-by-step: write or generate a letter, send a digital greeting card, or burn a mixtape — then email it with Little Letter.",
  alternates: { canonical: "/guides/how-to-send-a-little-letter" },
  openGraph: {
    title: "How to send a Little Letter",
    description:
      "A practical walkthrough of letters, digital cards, and mixtapes.",
    url: "/guides/how-to-send-a-little-letter",
    type: "article",
  },
};

const STEPS = [
  {
    title: "1. Choose what you’re sending",
    body: (
      <>
        Use{" "}
        <Link href="/create" className="underline underline-offset-2">
          Create
        </Link>{" "}
        for a personal letter,{" "}
        <Link href="/cards" className="underline underline-offset-2">
          Cards
        </Link>{" "}
        for an illustrated e-card, or{" "}
        <Link href="/mixtape" className="underline underline-offset-2">
          Mixtape
        </Link>{" "}
        for a cassette-style mix with a dedication. Pick the format that matches
        how you want the moment to feel — words, a visual card, or songs.
      </>
    ),
  },
  {
    title: "2. Add real details",
    body: (
      <>
        Include the recipient’s name and email, your name, and your email (so
        you get a copy and we can track free/paid sends honestly). For letters,
        choose an occasion and either write the message yourself or ask for a
        draft you can edit. Short, specific details beat generic greetings.
      </>
    ),
  },
  {
    title: "3. Preview before you send",
    body: (
      <>
        Open the preview to check the envelope, stationery, or card flip, and
        read the message out loud once. You can add an optional voice note on
        letters and mixtapes. When it feels right, accept the terms and send —
        or schedule a letter/card for later if the moment needs timing.
      </>
    ),
  },
  {
    title: "4. Know the pricing",
    body: (
      <>
        Letters are free to send with no send limit. Digital greeting cards are{" "}
        {CARD_PRICE_LABEL} each (paid securely with Stripe). Your first mixtape
        is free; extra mixes are {MIX_ONE_SONG_LABEL} for one song or{" "}
        {MIX_MULTI_SONG_LABEL} for two or more. Pricing lives on the FAQ and
        product pages so it stays consistent.
      </>
    ),
  },
  {
    title: "5. After it lands",
    body: (
      <>
        Recipients get a warm HTML email (and a plain-text version). Cards open
        on the Little Letter site as an animated illustrated page. Mixtapes
        include a play link. Ask them to check spam if nothing appears in a few
        minutes — new senders sometimes land there first.
      </>
    ),
  },
];

export default function HowToSendGuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="How to send a Little Letter">
        A practical walkthrough — not a marketing page. Last updated{" "}
        {formatContentDate(CONTENT_UPDATED.guides)}.
      </PageHeader>

      <PixelWindow title="why_this_exists.txt" icon="💌">
        <p className="ll-copy text-sm leading-relaxed text-[var(--ll-muted)]">
          Little Letter is a small delivery tool for kind emails: handwritten-feeling
          letters, illustrated digital cards, and playable mixtapes. This guide
          explains the real steps people use on the site, including what is free
          and what is paid, so you can send something without guessing.
        </p>
      </PixelWindow>

      {STEPS.map((step) => (
        <PixelWindow key={step.title} title="howto.step" icon="✏️">
          <h2 className="font-display text-base text-[var(--ll-ink)]">
            {step.title}
          </h2>
          <p className="mt-2 ll-copy text-sm leading-relaxed text-[var(--ll-muted)]">
            {step.body}
          </p>
        </PixelWindow>
      ))}

      <PixelWindow title="next_steps.exe" icon="➡️">
        <p className="mb-4 text-sm leading-relaxed text-[var(--ll-muted)]">
          More answers live in the{" "}
          <Link href="/faq" className="underline underline-offset-2">
            FAQ
          </Link>
          . If something fails to send, try again once — timeouts restore credits
          automatically when a paid send does not go out.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/create">
            <PixelButton>Write a letter</PixelButton>
          </Link>
          <Link href="/cards">
            <PixelButton variant="secondary">Browse cards</PixelButton>
          </Link>
          <Link href="/mixtape">
            <PixelButton variant="secondary">Make a mixtape</PixelButton>
          </Link>
        </div>
      </PixelWindow>
    </div>
  );
}
