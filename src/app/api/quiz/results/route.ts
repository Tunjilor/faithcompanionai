// src/app/api/quiz/results/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expects JSON body:
 * {
 *   email?: string,
 *   userId?: string,
 *   category: string,
 *   score: number,
 *   total?: number,
 *   timed?: boolean,
 *   durationSeconds?: number
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const category = String(body?.category || "");
    const score = Number(body?.score ?? 0);
    const total = Number(body?.total ?? 10);
    const timed = Boolean(body?.timed ?? false);
    const durationSeconds =
      body?.durationSeconds === null || body?.durationSeconds === undefined
        ? null
        : Number(body.durationSeconds);

    const email = body?.email ? String(body.email) : null;
    const userId = body?.userId ? String(body.userId) : null;

    if (!category) {
      return NextResponse.json({ error: "Missing category" }, { status: 400 });
    }

    if (!Number.isFinite(score) || score < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Invalid total" }, { status: 400 });
    }

    const attempt = await db.quizAttempt.create({
      data: {
        category,
        score,
        total,
        timed,
        durationSeconds: durationSeconds ?? undefined,
        email: email ?? undefined,
        userId: userId ?? undefined,
      },
      select: {
        id: true,
        category: true,
        score: true,
        total: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, attempt });
  } catch (err: any) {
    console.error("❌ Failed to create quiz attempt:", err);
    return NextResponse.json({ error: "Failed to save results" }, { status: 500 });
  }
}