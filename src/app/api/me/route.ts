// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { readSessionToken, sessionCookieName } from "@/lib/session";
import {
  ensureGuestCookie,
  guestTrialStatus,
  actorKeyForGuest,
  readGuestName,
} from "@/lib/guest";

type SessionPayload = {
  uid: string;
  exp: number;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeGuestDisplayName(guestId: string) {
  const suffix = guestId.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `FaithFriend-${suffix || "GUEST"}`;
}

function makeUserDisplayName(email: string) {
  const local = email.split("@")[0]?.trim() || "member";
  const cleaned = local.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
  return cleaned || "member";
}

export async function GET() {
  const secret = process.env.SESSION_SECRET;
  const cookieStore = cookies();

  if (!secret) {
    return NextResponse.json(
      {
        premium: false,
        isPremium: false,
        authed: false,
        signedIn: false,
        userId: null,
        email: null,
        premiumUntil: null,
        customerId: null,
        subscriptionId: null,
        actorKey: null,
        guestName: null,
        displayName: null,
        guest: null,
        debug: { step: "missing_secret" },
      },
      { status: 500 }
    );
  }

  const token = cookieStore.get(sessionCookieName())?.value;
  const payload = token ? readSessionToken<SessionPayload>(token, secret) : null;
  const isAuthed = !!payload && Date.now() <= payload.exp;

  if (isAuthed) {
    // 3-second timeout — a slow Neon cold start must not block the entire page.
    // If DB is unavailable, return a guest-like response so the UI still renders.
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const user = await Promise.race([
      db.user.findUnique({ where: { id: payload!.uid } }).catch(() => null),
      timeout,
    ]);

    if (!user) {
      return NextResponse.json({
        premium: false,
        isPremium: false,
        authed: false,
        signedIn: false,
        userId: null,
        email: null,
        premiumUntil: null,
        customerId: null,
        subscriptionId: null,
        actorKey: null,
        guestName: null,
        displayName: null,
        guest: null,
        debug: { step: "user_not_found" },
      });
    }

    const now = new Date();
    const premium =
      user.isPremium &&
      (!user.premiumUntil || user.premiumUntil.getTime() > now.getTime());

    const displayName = user.displayName?.trim() || makeUserDisplayName(user.email);
    const referralCount = await db.user.count({ where: { referredBy: user.id } }).catch(() => 0);

    return NextResponse.json({
      premium,
      isPremium: premium,
      authed: true,
      signedIn: true,
      userId: user.id,
      email: user.email,
      premiumUntil: user.premiumUntil ? user.premiumUntil.toISOString() : null,
      customerId: user.stripeCustomerId ?? null,
      subscriptionId: user.stripeSubscriptionId ?? null,
      actorKey: `user:${user.id}`,
      guestName: displayName,
      displayName,
      hasPassword: !!user.passwordHash,
      referralCount,
      guest: null,
      debug: { step: "ok_authed" },
    });
  }

  const guest = ensureGuestCookie(cookieStore as any, secret);
  const trial = guestTrialStatus(guest, 3);
  const savedGuestName = readGuestName(cookieStore as any);
  const guestName = savedGuestName || makeGuestDisplayName(guest.id);

  return NextResponse.json({
    premium: false,
    isPremium: false,
    authed: false,
    signedIn: false,
    userId: null,
    email: null,
    premiumUntil: null,
    customerId: null,
    subscriptionId: null,
    actorKey: actorKeyForGuest(guest.id),
    guestName,
    displayName: guestName,
    guest: {
      id: guest.id,
      createdAt: guest.createdAt,
      trial,
    },
    debug: { step: "ok_guest" },
  });
}