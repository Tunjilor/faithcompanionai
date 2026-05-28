// src/app/api/quiz/leaderboard/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function titleCase(s: string) {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = String(url.searchParams.get("category") || "general").trim();
    const limitParam = Number(url.searchParams.get("limit") || 10);
    const limit = Number.isFinite(limitParam) ? Math.max(3, Math.min(limitParam, 25)) : 10;

    const attempts = await db.quizAttempt.findMany({
      where: {
        category,
        shareId: { not: null },
      },
      orderBy: [
        { score: "desc" },
        { createdAt: "asc" },
      ],
      take: limit,
      select: {
        id: true,
        email: true,
        score: true,
        total: true,
        createdAt: true,
        shareId: true,
      },
    });

    const items = attempts.map((row, index) => {
      const displayName =
        row.email && row.email.includes("@")
          ? row.email.split("@")[0]
          : `Player ${index + 1}`;

      const percent = row.total ? Math.round((row.score / row.total) * 100) : 0;

      return {
        rank: index + 1,
        displayName,
        score: row.score,
        total: row.total,
        percent,
        createdAt: row.createdAt.toISOString(),
        shareId: row.shareId,
        href: row.shareId ? `/biblequiz/results/${row.shareId}` : null,
      };
    });

    return NextResponse.json({
      ok: true,
      category,
      categoryName: titleCase(category),
      items,
    });
  } catch (err: any) {
    console.error("GET /api/quiz/leaderboard error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load leaderboard." },
      { status: 500 }
    );
  }
}