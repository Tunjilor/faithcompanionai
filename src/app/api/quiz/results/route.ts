import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { readSessionToken, sessionCookieName } from "@/lib/session";

type SessionPayload = { uid: string; exp: number };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const category = String(body?.category || "general");
  const mode = String(body?.mode || "trivia");
  const score = Number(body?.score || 0);
  const total = Number(body?.total || 0);

  // optional attach to user if logged in
  const secret = process.env.SESSION_SECRET!;
  const token = (await cookies()).get(sessionCookieName())?.value;
  const payload = token ? readSessionToken<SessionPayload>(token, secret) : null;
  const userId = payload && Date.now() < payload.exp ? payload.uid : null;

  const result = await db.quizResult.create({
    data: { category, mode, score, total, userId: userId || undefined },
  });

  return NextResponse.json({ id: result.id });
}
