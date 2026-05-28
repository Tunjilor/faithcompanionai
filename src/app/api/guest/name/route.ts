// src/app/api/guest/name/route.ts
import { NextResponse } from "next/server";
import { setGuestName, sanitizeDisplayName } from "@/lib/guestName";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name ?? "";
  const clean = sanitizeDisplayName(name);

  if (!clean) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  setGuestName(clean);
  return NextResponse.json({ ok: true, name: clean });
}