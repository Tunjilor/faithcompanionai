// src/app/quiz/result/[id]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 700,
          background: "#0b1220",
          color: "white",
        }}
      >
        Faith Companion AI
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
