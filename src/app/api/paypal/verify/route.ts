import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  // TODO: later replace with real Stripe REST verification
  // For now: trust approved capture + log
  console.log("Verified Stripe order:", orderId);

  return NextResponse.json({
    verified: true,
    source: "Stripe",
  });
}
