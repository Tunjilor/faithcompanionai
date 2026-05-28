// src/app/api/cron/premium-expiry-reminder/route.ts
//
// Runs once daily via Vercel Cron (see vercel.json).
// Finds active premium users whose subscription expires in exactly 7 days or
// 2 days and sends a warm reminder email inviting them to subscribe.
//
// Deduplication: the cron runs at 09:00 UTC daily. Each reminder window covers
// a 24-hour band (e.g. now+7d to now+8d) so each user receives at most one
// email per tier per billing cycle.

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendPremiumExpiryReminderEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // 24-hour windows centered on exactly 7 and 2 days from now
  const day = 24 * 60 * 60 * 1000;
  const sevenDayStart = new Date(now.getTime() + 7 * day);
  const sevenDayEnd   = new Date(now.getTime() + 8 * day);
  const twoDayStart   = new Date(now.getTime() + 2 * day);
  const twoDayEnd     = new Date(now.getTime() + 3 * day);

  const [sevenDayUsers, twoDayUsers] = await Promise.all([
    db.user.findMany({
      where: {
        isPremium: true,
        premiumUntil: { gte: sevenDayStart, lt: sevenDayEnd },
      },
      select: { email: true },
    }),
    db.user.findMany({
      where: {
        isPremium: true,
        premiumUntil: { gte: twoDayStart, lt: twoDayEnd },
      },
      select: { email: true },
    }),
  ]);

  const results = { sent7day: 0, sent2day: 0, errors: 0 };

  for (const user of sevenDayUsers) {
    try {
      await sendPremiumExpiryReminderEmail({ to: user.email, daysLeft: 7 });
      results.sent7day++;
    } catch (err) {
      console.error("[premium-expiry-reminder] 7-day email failed", user.email, err);
      results.errors++;
    }
  }

  for (const user of twoDayUsers) {
    try {
      await sendPremiumExpiryReminderEmail({ to: user.email, daysLeft: 2 });
      results.sent2day++;
    } catch (err) {
      console.error("[premium-expiry-reminder] 2-day email failed", user.email, err);
      results.errors++;
    }
  }

  console.log("[premium-expiry-reminder] done", results);
  return NextResponse.json({ ok: true, ...results });
}
