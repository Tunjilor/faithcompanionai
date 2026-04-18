// src/app/api/ask/route.ts
import { NextResponse } from "next/server";
import { enforceAskQuotaFromSessionOrThrow } from "@/lib/premium";
import { extractOutputText, getModel, getOpenAI } from "@/lib/openai-ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mode = "verse" | "prayer" | "devotional";
type Tone = "gentle" | "firm" | "short" | "detailed";

function systemForMode(mode: Mode, tone: Tone) {
  const toneLine =
    tone === "gentle"
      ? "Tone: gentle, compassionate, reassuring."
      : tone === "firm"
      ? "Tone: confident, bold, truth-filled, but not harsh."
      : tone === "short"
      ? "Tone: very concise, minimal words."
      : "Tone: detailed, clear, structured.";

  switch (mode) {
    case "verse":
      return `You are a helpful Christian faith assistant. ${toneLine}
Return 3–5 Bible references relevant to the user's request (references only, no long quotes), plus a 1–2 sentence encouragement and one simple next step.
Do not include long scripture quotations.`;

    case "prayer":
      return `You are a helpful Christian prayer assistant. ${toneLine}
Write a prayer. Include 1–3 Bible references (references only). Avoid long scripture quotations.`;

    case "devotional":
      return `You are a helpful Christian devotional writer. ${toneLine}
Write a devotional (250–450 words) with:
- Title
- Scripture references (1–3, references only)
- Reflection
- Prayer
- 2 Action Steps
Avoid long scripture quotations.`;

    default:
      return `You are a helpful Christian faith assistant. ${toneLine}`;
  }
}

export async function POST(req: Request) {
  try {
    const quotaInfo = await enforceAskQuotaFromSessionOrThrow();

    const body = await req.json();

    const prompt = body?.prompt as string | undefined;
    const mode = (body?.mode ?? "verse") as Mode;
    const name = (body?.name ?? "") as string;
    const situation = (body?.situation ?? "") as string;
    const tone = (body?.tone ?? "gentle") as Tone;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing 'prompt' (string)." },
        { status: 400 }
      );
    }

    const client = getOpenAI();
    const model = getModel();

    const personalization = [
      name ? `User name: ${name}` : null,
      situation ? `User situation: ${situation}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const userMessage = personalization
      ? `${personalization}\n\nUser request: ${prompt}`
      : prompt;

    const resp = await client.responses.create({
      model,
      input: [
        { role: "system", content: systemForMode(mode, tone) },
        { role: "user", content: userMessage },
      ],
      temperature: tone === "short" ? 0.4 : 0.7,
    });

    const answer = extractOutputText(resp);

    return NextResponse.json({
      answer,
      quota: quotaInfo,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || "Server error",
        code: err?.code || null,
      },
      { status: err?.status || 500 }
    );
  }
}