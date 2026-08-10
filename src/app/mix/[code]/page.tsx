import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MixtapePlayer } from "@/components/features/MixtapePlayer";
import { PixelButton } from "@/components/ui/PixelButton";
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
      ? `A playable mixtape for ${mix.to} from ${mix.from}`
      : "Play a Little Letter mixtape",
  };
}

export default async function MixPlayPage({ params }: Props) {
  const { code } = await params;
  const mix = await resolveMix(code);

  if (!mix) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <MixtapePlayer mix={mix} />
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
