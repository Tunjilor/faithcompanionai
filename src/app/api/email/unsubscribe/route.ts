// src/app/api/email/unsubscribe/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/email-prefs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const secret = process.env.SESSION_SECRET;
  if (!secret || !uid || !token) {
    return htmlResponse("Invalid unsubscribe link.", false);
  }

  if (!verifyUnsubscribeToken(uid, token, secret)) {
    return htmlResponse("This unsubscribe link is invalid or has expired.", false);
  }

  await db.user.update({
    where: { id: uid },
    data: { emailOptIn: false },
  });

  return htmlResponse("You have been unsubscribed from daily devotional emails.", true);
}

function htmlResponse(message: string, success: boolean) {
  const color = success ? "#10b981" : "#ef4444";
  const icon = success ? "&#10003;" : "&#10007;";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Unsubscribe &mdash; Faith Companion AI</title>
<style>
  body{margin:0;padding:0;background:#07070a;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .card{max-width:420px;width:90%;background:#111;border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:40px 32px;text-align:center;}
  .icon{font-size:48px;color:${color};margin-bottom:16px;}
  h1{color:#fff;font-size:22px;margin:0 0 12px;}
  p{color:rgba(255,255,255,.65);font-size:14px;line-height:1.6;margin:0 0 24px;}
  a{display:inline-block;padding:12px 24px;background:linear-gradient(to right,#7c3aed,#f97316);color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;}
</style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${success ? "Unsubscribed" : "Invalid link"}</h1>
    <p>${message}${success ? " You can re-enable emails anytime from your dashboard." : ""}</p>
    <a href="https://faithcompanionai.com/dashboard">Back to dashboard</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: success ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
