import { redirect } from "next/navigation";

/** Alias so /refunds never 404s if someone types the URL. */
export default function RefundsAliasPage() {
  redirect("/terms#refunds");
}
