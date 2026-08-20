import { NextResponse } from "next/server";
import { Resvg } from "@resvg/resvg-js";
import { cardSceneSvgResponse } from "@/lib/card-scene-svg";

export const runtime = "nodejs";

type Params = { params: Promise<{ designId: string }> };

export async function GET(req: Request, { params }: Params) {
  const { designId } = await params;
  const svg = cardSceneSvgResponse(designId);
  if (!svg) {
    return NextResponse.json({ error: "Unknown card design" }, { status: 404 });
  }

  const wantSvg = new URL(req.url).searchParams.get("format") === "svg";
  if (wantSvg) {
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  }

  // PNG for email clients (Gmail etc. often block SVG in <img>)
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 840 },
    background: "transparent",
  });
  const png = resvg.render().asPng();

  return new NextResponse(Buffer.from(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
