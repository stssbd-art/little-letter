import type { Metadata } from "next";
import { SuccessCelebration } from "@/components/features/SuccessCelebration";

export const metadata: Metadata = {
  title: "Success",
  description: "Your little letter has been sent!",
};

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SuccessCelebration />
    </div>
  );
}
