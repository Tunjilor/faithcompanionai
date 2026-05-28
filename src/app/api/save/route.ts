// src/app/api/save/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requirePremiumUserFromSession } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SaveType = "answer" | "prayer" | "verse" | "plan_note";

const ALLOWED_TYPES: SaveType[] = ["answer", "prayer", "verse", "plan_note"];

export async function POST(req: Request) {
  try {
    const user = await requirePremiumUserFromSession();
    const body = await req.json();

    const type = String(body?.type || "") as SaveType;
    const title =
      typeof body?.title === "string" && body.title.trim()
        ? body.title.trim()
        : null;
    const content =
      typeof body?.content === "string" ? body.content.trim() : "";
    const reference =
      typeof body?.reference === "string" && body.reference.trim()
        ? body.reference.trim()
        : null;
    const metaJson =
      body?.meta && typeof body.meta === "object"
        ? JSON.stringify(body.meta)
        : null;

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid save type" }, { status: 400 });
    }

    const saved = await db.savedItem.create({
      data: {
        userId: user.id,
        type,
        title,
        content,
        reference,
        metaJson,
      },
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        reference: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      item: saved,
    });
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    const message =
      typeof err?.message === "string" ? err.message : "Failed to save";

    if (status >= 500) {
      console.error("POST /api/save error:", err);
    }

    return NextResponse.json({ error: message }, { status });
  }
}