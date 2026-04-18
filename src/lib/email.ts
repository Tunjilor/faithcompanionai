// src/lib/email.ts
export async function sendMagicLinkEmail(opts: {
  to: string;
  magicLink: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "Faith Companion AI <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.log("\n[Magic Link Email - DEV FALLBACK]");
    console.log(`To: ${opts.to}`);
    console.log(`Link: ${opts.magicLink}\n`);
    return { ok: true, provider: "dev-console" as const };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [opts.to],
      subject: "Your Faith Companion AI sign-in link",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Sign in to Faith Companion AI</h2>
          <p>Click the button below to securely sign in:</p>
          <p>
            <a href="${opts.magicLink}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;border-radius:999px;">
              Sign in
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p style="word-break:break-all;">${opts.magicLink}</p>
          <p>This link will expire soon for your security.</p>
        </div>
      `,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to send email: ${text}`);
  }

  return { ok: true, provider: "resend" as const };
}