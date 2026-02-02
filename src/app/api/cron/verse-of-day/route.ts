import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // prewarm
  const origin = url.origin;
  await fetch(`${origin}/api/verse/today`, { cache: "no-store" });

  return NextResponse.json({ ok: true });
}
