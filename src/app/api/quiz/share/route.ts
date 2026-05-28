// src/app/api/quiz/share/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import { readSessionToken, sessionCookieName } from "@/lib/session";
import { ensureGuestCookie } from "@/lib/guest";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SessionPayload = { uid: string; exp: number };

function makeShareId() {
  return crypto.randomBytes(16).toString("hex");
}

function getBaseUrl(reqHeaders: Headers) {
  // 1) Prefer explicit config (set this in production)
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  // 2) Proxy/Vercel style headers
  const xfProto = reqHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const xfHost = reqHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (xfProto && xfHost) return `${xfProto}://${xfHost}`;

  // 3) Origin header
  const origin = reqHeaders.get("origin");
  if (origin) return origin.replace(/\/+$/, "");

  // 4) Local fallback
  return "http://localhost:3000";
}

async function getActorKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return { ok: false as const, error: "missing_secret" as const };

  const c = cookies();
  const token = c.get(sessionCookieName())?.value;
  const payload = token ? readSessionToken<SessionPayload>(token, secret) : null;
  const isAuthed = !!payload && Date.now() <= payload.exp;

  if (isAuthed) {
    const user = await db.user.findUnique({ where: { id: payload!.uid } });
    if (user) return { ok: true as const, actorKey: `user:${user.id}` };
  }

  const guest = ensureGuestCookie(secret);
  return { ok: true as const, actorKey: `guest:${guest.id}` };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { attemptId?: string };
    const attemptId = String(body?.attemptId || "").trim();
    if (!attemptId) {
      return NextResponse.json({ ok: false, error: "missing_attemptId" }, { status: 400 });
    }

    const ident = await getActorKey();
    if (!ident.ok) return NextResponse.json({ ok: false, error: ident.error }, { status: 500 });

    const attempt = await db.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) return NextResponse.json({ ok: false, error: "attempt_not_found" }, { status: 404 });

    if (!attempt.actorKey || attempt.actorKey !== ident.actorKey) {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    const baseUrl = getBaseUrl(headers());
    const makeAbs = (shareId: string) => `${baseUrl}/biblequiz/results/${shareId}`;

    // Already shared
    if (attempt.shareId) {
      return NextResponse.json({
        ok: true,
        shareId: attempt.shareId,
        shareUrl: makeAbs(attempt.shareId),
      });
    }

    // Try create shareId (retry only on unique collision)
    for (let i = 0; i < 2; i++) {
      const shareId = makeShareId();
      try {
        const updated = await db.quizAttempt.update({
          where: { id: attemptId },
          data: { shareId, sharedAt: new Date() },
        });

        return NextResponse.json({
          ok: true,
          shareId: updated.shareId,
          shareUrl: makeAbs(updated.shareId!),
        });
      } catch (err: any) {
        const isUnique =
          err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
        if (!isUnique || i === 1) throw err;
      }
    }

    return NextResponse.json({ ok: false, error: "share_failed" }, { status: 500 });
  } catch (err) {
    console.error("SHARE QUIZ ERROR:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}