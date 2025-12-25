import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  if (!orderId) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  // TODO: later replace with real PayPal REST verification
  // For now: trust approved capture + log
  console.log("Verified PayPal order:", orderId);

  return NextResponse.json({
    verified: true,
    source: "paypal",
  });
}
