import { NextResponse } from "next/server";
import {
  bumpVisitorCount,
  getVisitorCount,
  normalizeVisitorCount,
  VISITOR_BASELINE,
} from "@/lib/visitors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = normalizeVisitorCount(
      await Promise.race([
        getVisitorCount(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Visitor count timed out.")), 5_000)
        ),
      ])
    );
    return NextResponse.json({ count });
  } catch (err) {
    console.error("visitor count read failed", err);
    return NextResponse.json({ count: VISITOR_BASELINE });
  }
}

export async function POST() {
  try {
    const count = normalizeVisitorCount(
      await Promise.race([
        bumpVisitorCount(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Visitor bump timed out.")), 5_000)
        ),
      ])
    );
    return NextResponse.json({ count });
  } catch (err) {
    console.error("visitor count bump failed", err);
    return NextResponse.json({ count: VISITOR_BASELINE });
  }
}
