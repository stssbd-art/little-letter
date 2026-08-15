import { NextResponse } from "next/server";
import { listSharedExamples } from "@/lib/shared-examples";

export const dynamic = "force-dynamic";

/** Public read — examples are written only from send APIs via the store helper. */
export async function GET() {
  const entries = await listSharedExamples();
  return NextResponse.json({ entries });
}
