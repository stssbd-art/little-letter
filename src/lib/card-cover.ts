import { promises as fs } from "fs";
import path from "path";
import { Resvg } from "@resvg/resvg-js";
import {
  getCardDesign,
  isCardDesignId,
  type CardDesignId,
} from "@/lib/card-designs";
import { buildCardSceneSvg } from "@/lib/card-scene-svg";

/** Content-ID used in card email HTML (`cid:ll-card-cover`). */
export const CARD_COVER_CID = "ll-card-cover";

export type InlineImageAttachment = {
  cid: string;
  filename: string;
  contentType: string;
  content: Buffer;
};

async function readPublicCover(designId: CardDesignId): Promise<Buffer | null> {
  const file = path.join(process.cwd(), "public", "ecards", `${designId}.png`);
  try {
    return await fs.readFile(file);
  } catch {
    return null;
  }
}

function renderCoverPng(designId: CardDesignId): Buffer {
  const svg = buildCardSceneSvg(designId);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 840 },
    background: "transparent",
  });
  return Buffer.from(resvg.render().asPng());
}

/** PNG bytes for a card cover — public file first, else render from SVG. */
export async function getCardCoverPng(
  designId: string | undefined | null
): Promise<InlineImageAttachment | null> {
  if (!designId || !isCardDesignId(designId)) return null;
  const design = getCardDesign(designId);
  const fromDisk = await readPublicCover(design.id);
  const content = fromDisk ?? renderCoverPng(design.id);
  return {
    cid: CARD_COVER_CID,
    filename: `${design.id}.png`,
    contentType: "image/png",
    content,
  };
}
