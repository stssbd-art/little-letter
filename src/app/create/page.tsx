import type { Metadata } from "next";
import { MessageForm } from "@/components/features/MessageForm";

export const metadata: Metadata = {
  title: "Create & Send a Letter Online",
  description:
    "Create a cute personal letter online and email it to someone you care about. First letter free, then £0.50.",
  alternates: { canonical: "/create" },
  keywords: [
    "send a letter online",
    "email a love letter",
    "send cute message by email",
    "personal letter generator",
  ],
};

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="font-pixel text-sm leading-relaxed text-[var(--ll-pink-deep)] sm:text-base">
          Create a Little Letter
        </h1>
        <p className="mt-2 font-display text-[var(--ll-muted)]">
          Tell us who it&apos;s for — first letter free, then £0.50 each.
        </p>
      </div>
      <MessageForm />
    </div>
  );
}
