import { NextResponse } from "next/server";
import { bumpVisitorCount, getVisitorCount } from "@/lib/visitors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getVisitorCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("visitor count read failed", err);
    return NextResponse.json({ count: 12847 });
  }
}

export async function POST() {
  try {
    const count = await bumpVisitorCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("visitor count bump failed", err);
    return NextResponse.json({ count: 12847 });
  }
}
