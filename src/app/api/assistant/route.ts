// src/app/api/assistant/route.ts
import { NextResponse } from "next/server";
import { enforceAskQuotaFromSessionOrThrow } from "@/lib/premium";
import { extractOutputText, getModel, getOpenAI } from "@/lib/openai-ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are a calm, Scripture-grounded Christian faith assistant called "Spiritual Assistant."
Help users with Bible questions, faith encouragement, short prayers, devotional reflections, and spiritual guidance.
Keep responses concise (2–4 sentences), warm, and conversational.
Cite a Bible reference where naturally relevant, but don't force it into every response.
Never preach — simply encourage and guide.`;

type HistoryMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const quotaInfo = await enforceAskQuotaFromSessionOrThrow();

    const body = await req.json().catch(() => null);
    const message = body?.message as string | undefined;
    const history: HistoryMsg[] = Array.isArray(body?.history) ? body.history : [];

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Missing message." }, { status: 400 });
    }

    const client = getOpenAI();
    const model = getModel();

    // chat.completions natively supports alternating user/assistant history;
    // responses.create() does not accept role:"assistant" turns in its input array
    const recentHistory = history.slice(-10);
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message.trim() },
    ];

    const resp = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    });

    const reply = resp.choices[0]?.message?.content?.trim() ?? "";

    if (!reply) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 500 });
    }

    return NextResponse.json({ reply, quota: quotaInfo });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error", code: err?.code || null },
      { status: err?.status || 500 }
    );
  }
}
