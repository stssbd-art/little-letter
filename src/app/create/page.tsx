import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageForm } from "@/components/features/MessageForm";

export const metadata: Metadata = {
  title: "Create & Send a Birthday Card or Letter Online",
  description:
    "Create a digital birthday card, occasion wish, or personal letter and email it to someone you care about. First two letters free, then £0.99.",
  alternates: { canonical: "/create" },
  keywords: [
    "birthday card online",
    "create digital card",
    "send wish by email",
    "email a love letter",
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
          Birthday cards, thank you notes, love letters, and more — write it
          yourself or get help. First two letters free, then £0.99 each.
        </p>
      </div>
      <Suspense
        fallback={
          <p className="text-center text-sm text-[var(--ll-muted)]">
            Loading form…
          </p>
        }
      >
        <MessageForm />
      </Suspense>
    </div>
  );
}
