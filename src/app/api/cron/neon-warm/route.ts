
// src/app/api/cron/neon-warm/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

function isRetryableDbError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err || "");
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("PrismaClientInitializationError") ||
    msg.includes("Error in PostgreSQL connection") ||
    msg.includes("kind: Closed") ||
    msg.includes("P1001")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pingDbWithRetry(attempts = 3, delayMs = 1500) {
  let lastErr: unknown;

  for (let i = 0; i < attempts; i += 1) {
    try {
      await db.$queryRaw`SELECT 1`;
      return;
    } catch (err) {
      lastErr = err;
      if (!isRetryableDbError(err) || i === attempts - 1) {
        throw err;
      }
      await sleep(delayMs);
    }
  }

  throw lastErr;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    await pingDbWithRetry();

    return NextResponse.json({
      ok: true,
      warmed: true,
      tookMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("NEON WARM CRON ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        warmed: false,
        error: err?.message || "db_warm_failed",
        tookMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}