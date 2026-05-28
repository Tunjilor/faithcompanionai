// src/app/api/saved/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePremiumUserFromSession } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requirePremiumUserFromSession();

    const items = await db.savedItem.findMany({
      where: {
        userId: user.id,
        isArchived: false,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        reference: true,
        createdAt: true,
        answeredAt: true,
        answerNote: true,
      },
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    const message =
      typeof err?.message === "string"
        ? err.message
        : "Failed to load saved items";

    if (status >= 500) {
      console.error("GET /api/saved error:", err);
    }

    return NextResponse.json({ error: message }, { status });
  }
}