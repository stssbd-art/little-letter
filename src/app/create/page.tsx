import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageForm } from "@/components/features/MessageForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Create & Send a Birthday Card or Letter Online",
  description:
    "A few words can mean so much. Write a heartfelt birthday card, thank-you, or love letter — yourself or with help. First two letters free, then £0.99. Add a spoken voice note.",
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
      <PageHeader title="Create a Little Letter">
        <p className="text-[var(--ll-ink)]">A few words can mean so much.</p>
        <p className="mt-2">
          Write a heartfelt birthday card, a sweet thank-you, a love letter, or
          simply something to brighten their day. Write it yourself or let us
          help you find the perfect words.
        </p>
        <ul className="mt-3 space-y-1.5 text-[var(--ll-ink)]">
          <li>
            ✨ Your first 2 letters are free, then just £0.99 each.
          </li>
          <li>🎙️ Make it extra special with a personal spoken voice note.</li>
        </ul>
      </PageHeader>
      <Suspense
        fallback={
          <p className="text-left text-sm text-[var(--ll-muted)]">
            Loading form…
          </p>
        }
      >
        <MessageForm />
      </Suspense>
    </div>
  );
}
