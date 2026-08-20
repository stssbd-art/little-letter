import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { Resvg } from "@resvg/resvg-js";
import { CARD_DESIGNS } from "../src/lib/card-designs";
import { buildCardSceneSvg } from "../src/lib/card-scene-svg";

const outDir = join(process.cwd(), "public", "ecards");
mkdirSync(outDir, { recursive: true });

for (const design of CARD_DESIGNS) {
  const svg = buildCardSceneSvg(design.id);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 840 },
    background: "transparent",
  });
  const png = Buffer.from(resvg.render().asPng());
  const file = join(outDir, `${design.id}.png`);
  writeFileSync(file, png);
  console.log("wrote", design.id);
}

console.log(`Done — ${CARD_DESIGNS.length} covers in public/ecards/`);
