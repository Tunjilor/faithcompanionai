// src/app/api/cron/daily-email/route.ts
//
// Runs hourly via Vercel Cron (see vercel.json or crons config).
// For each opted-in user whose local emailTime hour matches the current UTC
// hour translated to their timezone, generates and sends a devotional email.
//
// Content rotation:
//   Mon / Wed  → verse
//   Tue / Thu  → devotional
//   Fri / Sat / Sun → prayer

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOpenAI, getModel, extractOutputText } from "@/lib/openai-ts";
import { sendDevotionalEmail } from "@/lib/email";
import {
  makeUnsubscribeToken,
  hourInTimezone,
  parseEmailHour,
  contentTypeForDate,
} from "@/lib/email-prefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── AI content generation ────────────────────────────────────────────────────

const PROMPTS = {
  verse: {
    system:
      "You are a Christian faith assistant. Write a short daily devotional email (150-200 words) built around one encouraging Bible verse. Format: start with the verse reference in bold, then the verse text in quotes, then a 2-3 sentence reflection. End with one short action step. No markdown headings.",
    user: "Give me an encouraging Bible verse and reflection for today.",
  },
  devotional: {
    system:
      "You are a Christian devotional writer. Write a daily devotional (200-250 words) with a title, a Bible reference, a reflection paragraph, and a closing prayer (2-3 sentences). No markdown headings. Plain text only.",
    user: "Write a daily devotional for today focused on faith and trust in God.",
  },
  prayer: {
    system:
      "You are a Christian prayer writer. Write a morning prayer (150-200 words) suitable for starting the day. Include 1-2 Bible references inline. Warm, personal tone. No markdown headings.",
    user: "Write a morning prayer for strength, guidance, and gratitude.",
  },
} as const;

async function generateContent(
  type: "verse" | "devotional" | "prayer"
): Promise<string> {
  const client = getOpenAI();
  const model = getModel();
  const { system, user } = PROMPTS[type];

  const resp = await client.responses.create({
    model,
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
  });

  return extractOutputText(resp);
}

// ── Subject lines ─────────────────────────────────────────────────────────────

function subjectFor(type: "verse" | "devotional" | "prayer"): string {
  const day = new Date().toLocaleDateString("en-US", { weekday: "long" });
  if (type === "verse") return `Your ${day} verse — Faith Companion AI`;
  if (type === "devotional") return `${day} devotional — Faith Companion AI`;
  return `A prayer for your ${day}`;
}

// ── Cron handler ─────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const expected = process.env.CRON_SECRET;

    if (!expected) {
      return NextResponse.json({ ok: false, error: "CRON_SECRET not set" }, { status: 500 });
    }

    // Accept secret via Authorization header (Vercel cron) or ?secret= (manual testing)
    const authHeader = req.headers.get("authorization") ?? "";
    const querySecret = url.searchParams.get("secret") ?? "";
    const authorized =
      authHeader === `Bearer ${expected}` || querySecret === expected;

    if (!authorized) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      return NextResponse.json({ ok: false, error: "SESSION_SECRET not set" }, { status: 500 });
    }

    const now = new Date();
    const currentUtcHour = now.getUTCHours();

    // Find all opted-in users
    const users = await db.user.findMany({
      where: { emailOptIn: true },
      select: { id: true, email: true, emailTime: true, emailTimezone: true },
    });

    if (users.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, skipped: 0, reason: "no opted-in users" });
    }

    // Filter to users whose local hour matches their chosen emailTime hour
    const due = users.filter((u) => {
      const localHour = hourInTimezone(now, u.emailTimezone);
      const wantedHour = parseEmailHour(u.emailTime);
      return localHour === wantedHour;
    });

    if (due.length === 0) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        skipped: users.length,
        utcHour: currentUtcHour,
        reason: "no users due this hour",
      });
    }

    // Determine content type from server's UTC day (representative — most users
    // will be within ±12h so this is close enough for a daily rotation)
    const contentType = contentTypeForDate(now, "UTC");

    // Check for cached content for today
    const dayKey = now.toISOString().slice(0, 10); // "2025-04-20"
    const cacheKey = `daily-email:${contentType}:${dayKey}`;

    let contentText: string;

    const cached = await db.aiCache.findUnique({
      where: { cacheKey },
      select: { outputText: true },
    });

    if (cached) {
      contentText = cached.outputText;
    } else {
      contentText = await generateContent(contentType);
      await db.aiCache.create({
        data: {
          cacheKey,
          kind: "daily-email",
          translation: "",
          inputJson: JSON.stringify({ contentType, dayKey }),
          outputText: contentText,
        },
      });
    }

    const subject = subjectFor(contentType);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://faithcompanionai.com";

    let sent = 0;
    let failed = 0;

    for (const user of due) {
      try {
        const token = makeUnsubscribeToken(user.id, sessionSecret);
        const unsubscribeUrl = `${baseUrl}/api/email/unsubscribe?uid=${user.id}&token=${token}`;

        await sendDevotionalEmail({
          to: user.email,
          subject,
          contentType,
          contentText,
          unsubscribeUrl,
        });

        sent++;
      } catch (err) {
        console.error(`[daily-email] Failed for ${user.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      skipped: users.length - due.length,
      contentType,
      dayKey,
      utcHour: currentUtcHour,
    });
  } catch (err: any) {
    console.error("[daily-email] cron error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
