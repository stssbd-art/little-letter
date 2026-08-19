import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageForm } from "@/components/features/MessageForm";
import { PageHeader } from "@/components/layout/PageHeader";

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
      <PageHeader title="Create a Little Letter">
        Birthday cards, thank you notes, love letters, and more — write it
        First two letters free, then £0.99 each. You can add a spoken voice note
        too.
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
