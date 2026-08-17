import type { Metadata } from "next";
import { Suspense } from "react";
import { LetterPreview } from "@/components/features/LetterPreview";

export const metadata: Metadata = {
  title: "Preview",
  description: "Preview your Little Letter before it flies through the internet.",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Preview your letter
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          First two letters free · then £0.99 each. Open the envelope, then send.
        </p>
      </div>
      <Suspense fallback={<p className="text-center text-sm text-[var(--ll-muted)]">Loading preview...</p>}>
        <LetterPreview />
      </Suspense>
    </div>
  );
}
