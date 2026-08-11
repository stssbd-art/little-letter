import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE_NAME} — Send a letter or mixtape online`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #faf4e8 0%, #f0d9b5 55%, #e8b86d 100%)",
          color: "#3d2f22",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.7 }}>
          LITTLE LETTER
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 64,
            lineHeight: 1.15,
            fontWeight: 700,
            maxWidth: 900,
          }}
        >
          Send a letter or mixtape online
        </div>
        <div style={{ marginTop: 28, fontSize: 28, maxWidth: 820, opacity: 0.85 }}>
          Cute email letters · romantic cassette mixes · for someone you miss
        </div>
      </div>
    ),
    { ...size }
  );
}
