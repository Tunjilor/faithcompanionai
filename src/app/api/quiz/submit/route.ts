import { NextResponse } from "next/server";
import { gradeAndSaveAttempt } from "@/lib/quiz";

export async function POST(req: Request) {
  const body = await req.json();

  const attemptId = body?.attemptId as string;
  const answers = body?.answers as Record<string, "A" | "B" | "C" | "D">;

  if (!attemptId || !answers || typeof answers !== "object") {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  try {
    const result = await gradeAndSaveAttempt({ attemptId, answers });
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "submit_failed" }, { status: 500 });
  }
}
