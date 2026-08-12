import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";

export const metadata: Metadata = {
  title: "FAQ — Sending Letters & Mixtapes",
  description:
    "How to send a letter or mixtape online with Little Letter, pricing, email delivery, and more.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "Is this really free to try?",
    a: "Your first two letters are free. After that, each extra letter costs £0.99 (paid securely with Stripe). Mixtapes are £1.25 for 1 song, or £1.55 for 2 or more songs.",
  },
  {
    q: "How do payments work?",
    a: "Send two letters free. For the next ones, tap Pay £0.99 & send, complete Stripe Checkout, then your message goes out automatically. Mixtapes use Stripe too (£1.25 / £1.55).",
  },
  {
    q: "How do I send to any email?",
    a: "Email delivery uses Gmail (GMAIL_USER + GMAIL_APP_PASSWORD). Recipients can be any address. Stripe charges apply only after your free letter allowance, and for every mixtape.",
  },
  {
    q: "Why did my letter go to spam?",
    a: "Some inboxes are strict with new senders. Ask the recipient to move it to Primary/Inbox and mark “Not spam”, or add your Little Letter Gmail address to their contacts. That usually fixes future deliveries. Using a well-known Gmail account (not a brand-new one) also helps.",
  },
  {
    q: "How are messages written?",
    a: "We use the OpenAI API to craft unique, personal notes based on the occasion, style, and details you provide — with a warm local fallback if the API is unavailable.",
  },
  {
    q: "Will my letter look cute in the inbox?",
    a: "Recipients get a warm HTML email with a clear plain-text version too — designed to look personal, not like a marketing blast.",
  },
  {
    q: "What is the MP3 player on the home page?",
    a: "A little Winamp-style deck for vibes. Press play/pause, skip tracks, and enjoy a daily quote on the green LCD screen while you write.",
  },
  {
    q: "Can I send a mixtape?",
    a: "Yes — open Mixtape, label a cassette, pick one or more romantic tracks, add an optional dedication, and email it. The Play link opens a mix of the original songs (via YouTube) — about 30 seconds per track, then the next. Pricing: £1.25 for 1 song, £1.55 for 2 or more.",
  },
  {
    q: "Can I mute the sounds?",
    a: "Absolutely. Use the speaker button in the header. Sounds start muted by default so nothing surprises you.",
  },
  {
    q: "Is my data stored?",
    a: "Letter drafts live in your browser session. Guestbook entries are saved on the server in a simple local file. Never put secrets in the guestbook.",
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
