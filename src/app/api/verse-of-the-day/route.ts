// src/app/api/verse/route.ts
import { NextResponse } from "next/server";
import { extractOutputText, getModel, getOpenAI } from "@/lib/openai-ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Generates a short, warm “verse response” (references only) for a user prompt.
 * This route is optional if you're already doing everything via /api/ask.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt as string | undefined;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing 'prompt' (string)." }, { status: 400 });
    }

    const client = getOpenAI();
    const model = getModel();

    const resp = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a helpful Christian assistant. Return 3–5 relevant Bible references (references only, no long quotes) plus a 1–2 sentence encouragement. Avoid long scripture quotations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const answer = extractOutputText(resp);

    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
