import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    clientId: process.env.STRIPE_CLIENT_ID,
  });
}

