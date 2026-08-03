import type { Metadata } from "next";
import { LetterPreview } from "@/components/features/LetterPreview";

export const metadata: Metadata = {
  title: "Preview",
  description: "Preview your Little Letter before it flies through the internet.",
};

export default function PreviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Preview your letter
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          Open the envelope, read it once with your heart, then send.
        </p>
      </div>
      <LetterPreview />
    </div>
  );
}
