// src/app/api/og/quiz-results/[shareId]/route.tsx
import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteProps = {
  params: {
    shareId: string;
  };
};

function titleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function pct(score: number, total: number) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

export async function GET(_req: Request, { params }: RouteProps) {
  const shareId = String(params.shareId || "").trim();

  const attempt = await db.quizAttempt.findFirst({
    where: { shareId },
    select: {
      category: true,
      score: true,
      total: true,
    },
  });

  const categoryName = attempt ? titleCase(attempt.category || "general") : "Bible Quiz";
  const score = attempt?.score ?? 0;
  const total = attempt?.total ?? 10;
  const percent = pct(score, total);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, rgba(88,28,135,1) 0%, rgba(124,58,237,1) 35%, rgba(234,88,12,1) 100%)",
          color: "white",
          padding: "56px",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "760px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                padding: "10px 18px",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Faith Companion AI
            </div>

            <div
              style={{
                fontSize: "72px",
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Bible Quiz Results
            </div>

            <div
              style={{
                fontSize: "30px",
                lineHeight: 1.3,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {categoryName}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "280px",
              height: "280px",
              borderRadius: "36px",
              background: "rgba(255,255,255,0.14)",
              border: "2px solid rgba(255,255,255,0.18)",
            }}
          >
            <div
              style={{
                fontSize: "96px",
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {score}/{total}
            </div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "34px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {percent}%
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.9)",
              maxWidth: "760px",
              lineHeight: 1.4,
            }}
          >
            Can your friends beat this score?
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            faithcompanionai.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}