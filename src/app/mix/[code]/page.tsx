import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CassetteDeck } from "@/components/features/CassetteDeck";
import { MixtapeRemixPlayer } from "@/components/features/MixtapeRemixPlayer";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { decodeMixShare } from "@/lib/mixtape-link";
import { loadMixShare } from "@/lib/mixtape-store";

type Props = {
  params: Promise<{ code: string }>;
};

async function resolveMix(code: string) {
  const raw = decodeURIComponent(code.trim());
  return decodeMixShare(raw) ?? (await loadMixShare(raw));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const mix = await resolveMix(code);
  return {
    title: mix ? `${mix.title} · Mixtape` : "Mixtape",
    description: mix
      ? `A mixtape for ${mix.to} from ${mix.from}`
      : "Open a Little Letter mixtape",
  };
}

export default async function MixPlayPage({ params }: Props) {
  const { code } = await params;
  const mix = await resolveMix(code);

  if (!mix) {
    notFound();
  }

  const hasMusic = mix.tracks.length > 0;

  return (
    <div className="space-y-8">
      {hasMusic ? (
        <MixtapeRemixPlayer mix={mix} />
      ) : (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <p className="font-pixel text-[9px] tracking-widest text-[var(--ll-muted)]">
              SIDE A · NOTE ONLY
            </p>
            <h1 className="mt-2 font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
              {mix.title}
            </h1>
            <p className="mt-2 font-display text-sm text-[var(--ll-muted)]">
              for {mix.to || "you"} · from {mix.from || "a friend"}
            </p>
          </div>
          <CassetteDeck
            title={mix.title}
            fromName={mix.from}
            toName={mix.to}
            tracks={[]}
            spinning={false}
          />
          {mix.note ? (
            <PixelWindow title="j_card.txt" icon="✉️" liftOnHover={false}>
              <p className="font-display text-base italic leading-relaxed text-[var(--ll-ink)]">
                “{mix.note}”
              </p>
            </PixelWindow>
          ) : null}
        </div>
      )}
      <div className="flex justify-center gap-3">
        <Link href="/mixtape">
          <PixelButton variant="secondary">Burn your own tape</PixelButton>
        </Link>
        <Link href="/">
          <PixelButton variant="ghost">Home</PixelButton>
        </Link>
      </div>
    </div>
  );
}
