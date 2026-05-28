// src/app/api/me/profile/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db, withDbRetry } from "@/lib/db";
import { readSessionToken, sessionCookieName } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SessionPayload = { uid: string; exp: number };

async function getAuthedUid(): Promise<string | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  const token = cookies().get(sessionCookieName())?.value;
  if (!token) return null;
  const payload = readSessionToken<SessionPayload>(token, secret);
  if (!payload || Date.now() > payload.exp) return null;
  return payload.uid;
}

// PATCH /api/me/profile — update displayName and/or password
export async function PATCH(req: Request) {
  const uid = await getAuthedUid();
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: { displayName?: string; password?: string; currentPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updates: { displayName?: string; passwordHash?: string } = {};

  // ── Display name ─────────────────────────────────────────────────────────
  if (body.displayName !== undefined) {
    const name = body.displayName.trim();
    if (name.length > 0 && name.length < 3) {
      return NextResponse.json({ error: "Display name must be at least 3 characters." }, { status: 400 });
    }
    if (name.length > 32) {
      return NextResponse.json({ error: "Display name must be 32 characters or fewer." }, { status: 400 });
    }
    if (name.length > 0 && !/^[a-zA-Z0-9 _'-]+$/.test(name)) {
      return NextResponse.json({ error: "Display name may only contain letters, numbers, spaces, hyphens, apostrophes, and underscores." }, { status: 400 });
    }
    updates.displayName = name.length > 0 ? name : null as any;
  }

  // ── Password ─────────────────────────────────────────────────────────────
  if (body.password !== undefined) {
    const newPw = body.password;

    if (newPw === "") {
      // Clearing the password — require current password confirmation
      if (!body.currentPassword) {
        return NextResponse.json({ error: "Enter your current password to remove it." }, { status: 400 });
      }
      const user = await withDbRetry(() => db.user.findUnique({ where: { id: uid } }));
      if (!user?.passwordHash) {
        return NextResponse.json({ error: "No password is set." }, { status: 400 });
      }
      const match = await bcrypt.compare(body.currentPassword, user.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }
      updates.passwordHash = null as any;
    } else {
      // Setting a new password
      if (newPw.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      // If user already has a password, require current password
      const user = await withDbRetry(() => db.user.findUnique({ where: { id: uid } }));
      if (user?.passwordHash) {
        if (!body.currentPassword) {
          return NextResponse.json({ error: "Enter your current password to set a new one." }, { status: 400 });
        }
        const match = await bcrypt.compare(body.currentPassword, user.passwordHash);
        if (!match) {
          return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
        }
      }
      updates.passwordHash = await bcrypt.hash(newPw, 12);
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = await withDbRetry(() =>
    db.user.update({
      where: { id: uid },
      data: updates,
      select: { displayName: true, email: true, passwordHash: true },
    })
  );

  return NextResponse.json({
    ok: true,
    displayName: updated.displayName ?? null,
    hasPassword: !!updated.passwordHash,
  });
}

// GET /api/me/profile — return current profile fields
export async function GET() {
  const uid = await getAuthedUid();
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const user = await withDbRetry(() =>
    db.user.findUnique({
      where: { id: uid },
      select: { displayName: true, email: true, passwordHash: true },
    })
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    displayName: user.displayName ?? null,
    email: user.email,
    hasPassword: !!user.passwordHash,
  });
}
