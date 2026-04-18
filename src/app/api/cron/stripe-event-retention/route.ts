// src/app/api/cron/stripe-event-retention/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Missing CRON_SECRET" }, { status: 500 });
  }

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Keep 90 days of Stripe webhook event IDs (idempotency history)
  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90);

  const result = await db.stripeEvent.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return NextResponse.json({ ok: true, deleted: result.count });
}
 
 