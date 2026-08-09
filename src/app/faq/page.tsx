import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Little Letter.",
};

const FAQS = [
  {
    q: "Is this really free to try?",
    a: "Your first letter is free. After that, each extra letter costs £0.50 (paid securely with Stripe).",
  },
  {
    q: "How do payments work?",
    a: "Send one letter free. For the next ones, tap Pay £0.50 & send, complete Stripe Checkout, then your letter goes out automatically.",
  },
  {
    q: "How do I send to any email for free?",
    a: "Email delivery still uses Gmail (GMAIL_USER + GMAIL_APP_PASSWORD). The £0.50 is only for extra sends after your first free letter.",
  },
  {
    q: "How are messages written?",
    a: "We use the OpenAI API to craft unique, personal notes based on the occasion, style, and details you provide — with a warm local fallback if the API is unavailable.",
  },
  {
    q: "Will my letter look cute in the inbox?",
    a: "Recipients get a retro-styled HTML email with pastel gradients, pixel decorations, and a cosy Little Letter footer.",
  },
  {
    q: "What is the MP3 player on the home page?",
    a: "A little Winamp-style deck for vibes. Press play/pause, skip tracks, and enjoy a daily quote on the green LCD screen while you write.",
  },
  {
    q: "Can I send a mixtape?",
    a: "Yes — open Mixtape, label a cassette, pick 3–6 nineties tracks, add a dedication, and email it. Your first two mixtapes are free; extras are £0.50. The email includes a Play button that opens a remix deck where tracks crossfade into each other (demo audio streams).",
  },
  {
    q: "Can I mute the sounds?",
    a: "Absolutely. Use the speaker button in the header. Sounds start muted by default so nothing surprises you.",
  },
  {
    q: "Is my data stored?",
    a: "Letter drafts live in your browser session. Guestbook entries are saved on the server in a simple local file for this demo. Never put secrets in the guestbook.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes — the whole experience is responsive, from Pip the Envelope to the message creator windows.",
  },
  {
    q: "Dark mode?",
    a: "Toggle the sun/moon button in the header for evening listening vibes.",
  },
];
export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          FAQ
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          Tiny answers for curious hearts.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((item, i) => (
          <PixelWindow
            key={item.q}
            title={`question_${String(i + 1).padStart(2, "0")}.faq`}
            icon="❓"
          >
            <h2 className="font-display text-base text-[var(--ll-ink)]">
              {item.q}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ll-muted)]">
              {item.a}
            </p>
          </PixelWindow>
        ))}
      </div>

      <div className="flex justify-center">
        <Link href="/create">
          <PixelButton>Ready to write? 💌</PixelButton>
        </Link>
      </div>
    </div>
  );
}
