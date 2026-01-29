// src/app/api/quiz/results/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email =
      typeof body?.email === "string" && body.email.trim()
        ? body.email.trim()
        : null;

    const category =
      typeof body?.category === "string" && body.category.trim()
        ? body.category.trim()
        : "general";

    const score = Number(body?.score ?? 0);
    const total = Number(body?.total ?? 0);

    if (!Number.isFinite(score) || !Number.isFinite(total)) {
      return NextResponse.json({ error: "Invalid score/total" }, { status: 400 });
    }

    const result = await db.quizResult.create({
      data: {
        category,
        score,
        total,
        ...(email ? { email } : {}),
      },
    });

    return NextResponse.json({ id: result.id });
  } catch {
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}
