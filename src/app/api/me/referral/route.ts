// src/app/api/me/referral/route.ts
// Called client-side after login if ?ref= was in the URL they arrived from.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const referrerId = typeof body?.referrerId === "string" ? body.referrerId.trim() : "";

    if (!referrerId || referrerId === user.id) {
      return NextResponse.json({ ok: false, reason: "invalid_referrer" });
    }

    // Fetch referredBy directly to avoid SessionUser type limitation
    const fullUser = await db.user.findUnique({ where: { id: user.id }, select: { referredBy: true } });
    if (fullUser?.referredBy) {
      return NextResponse.json({ ok: true, already: true });
    }

    // Verify referrer exists
    const referrer = await db.user.findUnique({ where: { id: referrerId }, select: { id: true } });
    if (!referrer) return NextResponse.json({ ok: false, reason: "referrer_not_found" });

    await db.user.update({ where: { id: user.id }, data: { referredBy: referrerId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/me/referral error:", err);
    return NextResponse.json({ error: "Failed to record referral." }, { status: 500 });
  }
}
