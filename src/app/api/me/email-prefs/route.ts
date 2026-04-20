// src/app/api/me/email-prefs/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromSession } from "@/lib/premium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await db.user.findUnique({
    where: { id: user.id },
    select: { emailOptIn: true, emailTime: true, emailTimezone: true },
  });

  return NextResponse.json(row ?? { emailOptIn: false, emailTime: "07:00", emailTimezone: "UTC" });
}

export async function PATCH(req: Request) {
  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { emailOptIn, emailTime, emailTimezone } = body as {
    emailOptIn?: boolean;
    emailTime?: string;
    emailTimezone?: string;
  };

  const data: Record<string, unknown> = {};
  if (typeof emailOptIn === "boolean") data.emailOptIn = emailOptIn;
  if (typeof emailTime === "string" && /^\d{2}:\d{2}$/.test(emailTime)) data.emailTime = emailTime;
  if (typeof emailTimezone === "string" && emailTimezone.length > 0 && emailTimezone.length < 80) {
    data.emailTimezone = emailTimezone;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data,
    select: { emailOptIn: true, emailTime: true, emailTimezone: true },
  });

  return NextResponse.json(updated);
}
