//src/app/api/verse/route.ts

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
    const length = body?.length === "long" ? "long" : "short";

    // SIMPLE deterministic output (no OpenAI needed here yet)
    const verses = [
      "Philippians 4:6-7",
      "Matthew 6:34",
      "1 Peter 5:7",
      "Psalm 94:19",
      "Isaiah 41:10",
    ];

    const encouragement =
      length === "long"
        ? "Trust God with your worries. He cares deeply for you and invites you to rest in His peace, even when life feels overwhelming."
        : "Trust God with your worries; He cares for you.";

    const nextStep =
      length === "long"
        ? "Take 5–10 minutes today to pray honestly. Give each worry to God and ask for His peace to guard your heart."
        : "Spend a few minutes in prayer, giving your anxiety to God.";

    return NextResponse.json({
      verses,
      encouragement,
      nextStep,
    });
  } catch (err) {
    console.error("Verse error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}