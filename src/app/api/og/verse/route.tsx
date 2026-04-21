import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawText = searchParams.get("text") || "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.";
  const ref = searchParams.get("ref") || "John 3:16";

  const text = rawText.length > 220 ? rawText.slice(0, 217) + "\u2026" : rawText;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#170537",
          position: "relative",
          overflow: "hidden",
          padding: "0 100px",
        }}
      >
        {/* Purple glow top-left */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "580px",
            height: "580px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.55) 0%, transparent 70%)",
          }}
        />
        {/* Orange glow bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.38) 0%, transparent 70%)",
          }}
        />

        {/* Star decoration */}
        <div
          style={{
            fontSize: "38px",
            color: "rgba(196,167,247,0.65)",
            marginBottom: "28px",
            lineHeight: 1,
          }}
        >
          &#10038;
        </div>

        {/* Verse text */}
        <div
          style={{
            fontSize: "40px",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.95)",
            textAlign: "center",
            lineHeight: 1.55,
            marginBottom: "24px",
            maxWidth: "960px",
          }}
        >
          &ldquo;{text}&rdquo;
        </div>

        {/* Reference */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "rgba(196,167,247,0.82)",
            letterSpacing: "0.02em",
          }}
        >
          &mdash; {ref}
        </div>

        {/* Bottom rule + branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <div
            style={{
              width: "320px",
              height: "1px",
              background: "rgba(255,255,255,0.12)",
              marginBottom: "10px",
            }}
          />
          <div style={{ fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>
            Faith Companion AI
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.26)" }}>
            faithcompanionai.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
