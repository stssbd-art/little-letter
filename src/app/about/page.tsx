import type { Metadata } from "next";
import Link from "next/link";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { PixelButton } from "@/components/ui/PixelButton";
import { Mascot } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "About — Send Letters & Mixtapes Online",
  description:
    "Little Letter is a nostalgic place to send warm email letters and romantic mixtapes that feel handmade.",
  alternates: { canonical: "/about" },
};

const REASONS = [
  {
    icon: "🍀",
    text: "Because kindness travels better with personality.",
  },
  {
    icon: "💌",
    text: "Because email can still feel like opening a sealed note.",
  },
  {
    icon: "⭐",
    text: "Because nostalgia should feel magical — not cluttered.",
  },
  {
    icon: "🌈",
    text: "Because the internet is better when it carries smiles.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          About
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          Soft notes, mixtapes, and a little pixel magic.
        </p>
      </div>

      <PixelWindow title="about_little_letter.txt" icon="📖">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
          <div className="shrink-0">
            <Mascot />
          </div>
          <div className="min-w-0 flex-1 space-y-3 text-[var(--ll-ink)]">
            <h2 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
              About Little Letter
            </h2>
            <p className="font-display text-base leading-relaxed">
              Once upon a dial-up connection, the internet was full of glitter
              GIFs, guestbook signatures, and notes that felt handmade. Little
              Letter brings that cosy magic back — polished for today, soft
              enough to make you smile.
            </p>
            <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
              Write to friends, family, partners, or colleagues. Choose an
              occasion and a style, add a personal note, and we&apos;ll help craft
              a warm message that never sounds like a factory greeting card.
              Then we send it as a beautiful retro HTML email. Or burn a
              romantic mixtape — pick songs, label a cassette, and email a
              playable mix.
            </p>
            <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
              Meet Pip the Envelope — our tiny mascot who believes every inbox
              deserves a little sparkle. Hit play on the retro MP3 deck, then
              send someone a note.
            </p>
          </div>
        </div>
      </PixelWindow>

      <PixelWindow title="a_little_about_me.txt" icon="💌">
        <div className="mx-auto max-w-2xl space-y-3 text-center text-[var(--ll-ink)] sm:text-left">
          <h2 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
            A Little About Me
          </h2>
          <p className="font-display text-base leading-relaxed">
            I&apos;m just a simple girl, dreaming, creating, and trying little
            things along the way. I&apos;m not really good at any one thing —
            but I&apos;ve always believed that trying never hurts.
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
            With a little inspiration and influence from someone special, one of
            those little ideas became{" "}
            <span className="font-semibold text-[var(--ll-ink)]">
              Little Letter
            </span>{" "}
            — a whimsical place for old-school feelings.
          </p>
          <p className="text-sm leading-relaxed text-[var(--ll-muted)]">
            So, write something you mean. Send a little letter. Make a mixtape.{" "}
            <span className="font-semibold text-[var(--ll-pink-deep)]">
              Send someone a little piece of you.
            </span>
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="why_we_exist.ini" icon="💫">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="text-center font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-left sm:text-base">
            Why we exist
          </h2>
          <ul className="space-y-3">
            {REASONS.map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-3 text-left text-sm leading-relaxed text-[var(--ll-ink)]"
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--ll-lavender)] bg-[#fff6df]/80 text-base dark:bg-white/5"
                  aria-hidden
                >
                  {item.icon}
                </span>
                <span className="pt-1.5">{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center pt-1 sm:justify-start">
            <Link href="/create">
              <PixelButton>Create your first letter</PixelButton>
            </Link>
          </div>
        </div>
      </PixelWindow>
    </div>
  );
}
