import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessCelebration } from "@/components/features/SuccessCelebration";

export const metadata: Metadata = {
  title: "Success",
  description: "Your little letter or mixtape has been sent!",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Suspense fallback={<p className="text-center text-sm">Almost there…</p>}>
        <SuccessCelebration />
      </Suspense>
    </div>
  );
}
