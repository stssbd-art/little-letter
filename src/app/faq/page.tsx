import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ — Sending Letters & Mixtapes",
  description:
    "How to send a letter or mixtape online with Little Letter, pricing, email delivery, and more.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "Is this really free to try?",
    a: "Your first two letters are free. After that, each extra letter costs £0.70 (paid securely with Stripe). E-cards are £1.25 each with no free allowance. Your first mixtape is free; extra mixes are £0.99 for 1 song, or £1.20 for 2 or more songs.",
  },
  {
    q: "How do payments work?",
    a: "Send two letters free. For the next ones, tap Pay £0.70 & send, complete Stripe Checkout, then your message goes out automatically. Your first mixtape is free; extra mixes use Stripe too (£0.99 / £1.20).",
  },
  {
    q: "How do I send to any email?",
    a: "Yes — put in any recipient email address and we’ll deliver the letter or mixtape there. You also get a copy in the inbox for the email you enter as the sender (so you can keep what you sent). Stripe charges apply only after your free letter allowance, and after your first free mixtape.",
  },
  {
    q: "Why did my letter go to spam?",
    a: "Sometimes inboxes are extra cautious with new messages. Ask your person to check Spam or Junk and mark the letter as “Not spam” — after that, the next ones usually land in the inbox. A short, friendly subject also helps.",
  },
  {
    q: "Can I write the letter myself?",
    a: "Yes. On Create, choose “I’ll write it myself,” then add a subject and your own message — no AI. Or pick “Help me write it” for an AI draft from your occasion and style.",
  },
  {
    q: "Can I add a voice note?",
    a: "Yes — optional on letters and mixtapes. Record up to 60 seconds before you send. It arrives as an audio attachment they can play in the email. You can skip it and send just the written note.",
  },
  {
    q: "How do free sends work without an account?",
    a: "You enter your email when creating a letter or mixtape. We track free/paid usage against that email (and browser cookies). Clearing cookies alone won’t reset your free allowance if you use the same email again. After free sends are used, Stripe charges apply.",
  },
  {
    q: "Can I get a refund?",
    a: `Once the email has been sent to your recipient, payments are non-refundable. If a charge went through but our system clearly failed to send the email, email ${CONTACT_EMAIL} and we’ll help with a credit or resend where reasonable. Landing in spam is not a refund reason after a successful send.`,
  },
  {
    q: "How do I contact you?",
    a: `Email ${CONTACT_EMAIL} — we read everything about privacy, refunds, or problems with a send.`,
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
    a: "Yes — open Mixtape, label a cassette, pick songs from the crate or search YouTube, add an optional dedication, and email it. The Play link opens the mix (via YouTube). Each song plays in full, then the next one starts. Your first mixtape is free; extra mixes are £0.99 for 1 song, £1.20 for 2 or more.",
  },
  {
    q: "Can I send a digital card?",
    a: "Yes — open Cards, browse designs by occasion, personalise one, then email it. The recipient gets a link to open the animated illustrated card on the Little Letter website. Each e-card is £1.25.",
  },
  {
    q: "Can I mute the sounds?",
    a: "Absolutely. Use the speaker button in the header. Sounds start muted by default so nothing surprises you.",
  },
  {
    q: "Is my data stored?",
    a: "Letter drafts live in your browser session. Guestbook entries and opt-in shared examples are saved on the server. Shared examples never store emails — only names and a short preview. Never put secrets in the guestbook.",
  },
  {
    q: "Can I show my letter on The Wall?",
    a: "Yes — when you send a letter or mixtape, tick “Share a short preview on The Wall.” It appears on The Wall as a short snippet (names + occasion or tape title). Emails and full private text stay private.",
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
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHeader title="FAQ">
        Tiny answers for curious hearts.
      </PageHeader>

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
            <p className="mt-2 ll-copy text-sm leading-relaxed text-[var(--ll-muted)]">
              {item.a}
            </p>
          </PixelWindow>
        ))}
      </div>

      <div className="flex justify-start">
        <Link href="/create">
          <PixelButton>Ready to write? ✉️</PixelButton>
        </Link>
      </div>
    </div>
  );
}
