import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MixtapeRemixPlayer } from "@/components/features/MixtapeRemixPlayer";
import { PixelButton } from "@/components/ui/PixelButton";
import { decodeMixShare } from "@/lib/mixtape-link";

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const mix = decodeMixShare(code);
  return {
    title: mix ? `${mix.title} · Mixtape` : "Mixtape",
    description: mix
      ? `A playable mixtape for ${mix.to} from ${mix.from}`
      : "Play a Little Letter mixtape",
  };
}

export default async function MixPlayPage({ params }: Props) {
  const { code } = await params;
  const mix = decodeMixShare(code);

  if (!mix) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <MixtapeRemixPlayer mix={mix} />
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
