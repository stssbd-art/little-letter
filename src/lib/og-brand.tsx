import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const ogAlt = `${SITE_NAME} — Send a letter or mixtape online`;
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Fetch a TTF subset from Google Fonts (Satori needs ttf/otf/woff, not woff2). */
async function loadGoogleFont(font: string, text: string, weight = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(
    text
  )}`;
  // Avoid Chrome UAs — Google returns woff2 for those, which Satori cannot parse.
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LittleLetterBot/1.0)",
      },
    })
  ).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );
  if (!resource?.[1]) {
    throw new Error(`Failed to find font file for ${font}`);
  }
  const response = await fetch(resource[1]);
  if (!response.ok) {
    throw new Error(`Failed to download font ${font}`);
  }
  return response.arrayBuffer();
}

export async function createBrandOpenGraphImage() {
  const logoText = "Little Letter";
  const headline = "Send a letter or mixtape online";
  const sub = SITE_TAGLINE;
  const kicker = "FOR SOMEONE YOU MISS";
  const fontBlob = `${logoText}${headline}${sub}${kicker}0123456789£.·`;

  const [pixelFont, displayFont] = await Promise.all([
    loadGoogleFont("Press+Start+2P", fontBlob, 400),
    loadGoogleFont("Quicksand", fontBlob, 600),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#faf4e8",
          color: "#3d2f22",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse at 12% 0%, rgba(246, 213, 138, 0.75), transparent 48%), radial-gradient(ellipse at 88% 100%, rgba(197, 212, 160, 0.45), transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(232, 184, 109, 0.35), transparent 45%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(61, 47, 34, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(61, 47, 34, 0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            display: "flex",
            flexDirection: "column",
            border: "5px solid #d2a35a",
            borderRadius: 28,
            background: "rgba(255, 251, 242, 0.92)",
            boxShadow: "8px 10px 0 rgba(214, 163, 90, 0.45)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 28px",
              borderBottom: "3px solid #d2a35a",
              background: "linear-gradient(180deg, #e8cdb6 0%, #d8c09a 100%)",
            }}
          >
            <div style={{ fontSize: 28, display: "flex" }}>✉️</div>
            <div
              style={{
                fontFamily: "Pixel",
                fontSize: 16,
                letterSpacing: 1,
                color: "#3d2f22",
                display: "flex",
              }}
            >
              little_letter.exe
            </div>
            <div style={{ flex: 1, display: "flex" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  background: "#c5d4a0",
                  border: "1px solid #8a7a62",
                }}
              />
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  background: "#ffe8a3",
                  border: "1px solid #8a7a62",
                }}
              />
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  background: "#c4a574",
                  border: "1px solid #8a7a62",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "48px 56px",
            }}
          >
            <div
              style={{
                fontFamily: "Display",
                fontSize: 22,
                letterSpacing: 4,
                color: "#8b5e34",
                display: "flex",
                marginBottom: 18,
              }}
            >
              {kicker}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 72, display: "flex", lineHeight: 1 }}>
                ✉️
              </div>
              <div
                style={{
                  fontFamily: "Pixel",
                  fontSize: 48,
                  lineHeight: 1.3,
                  color: "#8b5e34",
                  textShadow: "3px 3px 0 rgba(214, 158, 46, 0.35)",
                  display: "flex",
                }}
              >
                {logoText}
              </div>
            </div>

            <div
              style={{
                fontFamily: "Display",
                fontSize: 36,
                lineHeight: 1.25,
                maxWidth: 900,
                color: "#3d2f22",
                display: "flex",
                marginBottom: 18,
              }}
            >
              {headline}
            </div>

            <div
              style={{
                fontFamily: "Display",
                fontSize: 24,
                lineHeight: 1.4,
                maxWidth: 860,
                color: "#7a654f",
                display: "flex",
              }}
            >
              {sub}
            </div>

            <div
              style={{
                marginTop: 36,
                display: "flex",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 22px",
                  borderRadius: 16,
                  border: "3px solid #8b5e34",
                  background:
                    "linear-gradient(180deg, #f6d58a 0%, #8b5e34 100%)",
                  color: "#fffdf6",
                  fontFamily: "Display",
                  fontSize: 20,
                }}
              >
                Create a letter
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 22px",
                  borderRadius: 16,
                  border: "3px solid #6f8a45",
                  background:
                    "linear-gradient(180deg, #c5d4a0 0%, #5f7538 100%)",
                  color: "#fffdf6",
                  fontFamily: "Display",
                  fontSize: 20,
                }}
              >
                Send a mixtape
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      emoji: "twemoji",
      fonts: [
        {
          name: "Pixel",
          data: pixelFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Display",
          data: displayFont,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
