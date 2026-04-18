// src/app/api/streak/ping/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function utcDateKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function daysBetween(earlier: string, later: string): number {
  const a = new Date(earlier + "T00:00:00Z");
  const b = new Date(later + "T00:00:00Z");
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export async function POST() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = utcDateKey();

    const existing = await db.userStreak.findUnique({
      where: { userId: user.id },
    });

    // First visit ever
    if (!existing) {
      const streak = await db.userStreak.create({
        data: { userId: user.id, currentStreak: 1, longestStreak: 1, lastActivityDate: today },
      });
      return NextResponse.json({ currentStreak: streak.currentStreak, longestStreak: streak.longestStreak, isNewDay: true });
    }

    // Already counted today
    if (existing.lastActivityDate === today) {
      return NextResponse.json({ currentStreak: existing.currentStreak, longestStreak: existing.longestStreak, isNewDay: false });
    }

    const gap = daysBetween(existing.lastActivityDate, today);

    // Consecutive day: extend streak
    const newCurrent = gap === 1 ? existing.currentStreak + 1 : 1;
    const newLongest = Math.max(existing.longestStreak, newCurrent);

    const streak = await db.userStreak.update({
      where: { userId: user.id },
      data: { currentStreak: newCurrent, longestStreak: newLongest, lastActivityDate: today },
    });

    return NextResponse.json({ currentStreak: streak.currentStreak, longestStreak: streak.longestStreak, isNewDay: true });
  } catch (err: any) {
    console.error("POST /api/streak/ping error:", err);
    return NextResponse.json({ error: "Failed to update streak." }, { status: 500 });
  }
}
