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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PixelWindow title="about_little_letter.txt" icon="📖">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Mascot />
          <div className="space-y-4 text-[var(--ll-ink)]">
            <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
              About Little Letter
            </h1>
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
              deserves a little sparkle. Hit play on the retro MP3 deck, then send
              someone a note.
            </p>
          </div>
        </div>
      </PixelWindow>

      <PixelWindow title="a_little_about_me.txt" icon="💌">
        <div className="space-y-4 text-[var(--ll-ink)]">
          <h2 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
            A Little About Me 💌
          </h2>
          <p className="font-display text-base leading-relaxed">
            I&apos;m just a simple girl, dreaming, creating, and trying little
            things along the way. I&apos;m not really good at any one thing —
            but I&apos;ve always believed that trying never hurts. ✨
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
            </span>{" "}
            💌
          </p>
        </div>
      </PixelWindow>

      <PixelWindow title="why_we_exist.ini" icon="💫">
        <ul className="space-y-3 text-sm text-[var(--ll-ink)]">
          <li>🍀 Because kindness travels better with personality.</li>
          <li>💌 Because email can still feel like opening a sealed note.</li>
          <li>⭐ Because nostalgia should feel magical — not cluttered.</li>
          <li>🦋 Because the internet is better when it carries smiles.</li>
        </ul>
        <div className="mt-6">
          <Link href="/create">
            <PixelButton>Create your first letter</PixelButton>
          </Link>
        </div>
      </PixelWindow>
    </div>
  );
}
