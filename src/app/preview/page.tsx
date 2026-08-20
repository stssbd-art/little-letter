import type { Metadata } from "next";
import { Suspense } from "react";
import { LetterPreview } from "@/components/features/LetterPreview";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Preview",
  description: "Preview your Little Letter before it flies through the internet.",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Preview your letter">
        First two letters free · then £0.99 each. Preview the envelope, then send.
      </PageHeader>
      <Suspense fallback={<p className="text-left text-sm text-[var(--ll-muted)]">Loading preview...</p>}>
        <LetterPreview />
      </Suspense>
    </div>
  );
}
