import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MixtapePlayer } from "@/components/features/MixtapePlayer";
import { MixPreviewSend } from "@/components/features/MixPreviewSend";
import { ShareBar } from "@/components/features/ShareBar";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelWindow } from "@/components/ui/PixelWindow";
import { decodeMixShare } from "@/lib/mixtape-link";
import { loadMixShare } from "@/lib/mixtape-store";
import { SITE_URL } from "@/lib/constants";

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

  const shareUrl = `${SITE_URL}/mix/${encodeURIComponent(code.trim())}`;
  const shareText = `${mix.from} made a mixtape for ${mix.to}: “${mix.title}”`;
  const mixPath = `/mix/${encodeURIComponent(code.trim())}`;

  return (
    <div className="space-y-8">
      <MixtapePlayer mix={mix} />
      <Suspense fallback={null}>
        <MixPreviewSend mix={mix} mixPath={mixPath} />
      </Suspense>
      <PixelWindow title="share_this_mix.lnk" icon="📣" liftOnHover={false}>
        <ShareBar
          url={shareUrl}
          title={`${mix.title} · Little Letter mixtape`}
          text={shareText}
        />
      </PixelWindow>
      <div className="flex justify-start gap-3">
        <Link
          href={`/mixtape?restore=${encodeURIComponent(code.trim())}`}
        >
          <PixelButton variant="secondary">Continue editing &amp; send</PixelButton>
        </Link>
        <Link href="/">
          <PixelButton variant="ghost">Home</PixelButton>
        </Link>
      </div>
    </div>
  );
}
