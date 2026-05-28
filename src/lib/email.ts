// src/lib/email.ts
export type DevotionalEmailPayload = {
  to: string;
  subject: string;
  contentType: "verse" | "devotional" | "prayer";
  contentText: string;
  unsubscribeUrl: string;
};

export async function sendDevotionalEmail(opts: DevotionalEmailPayload) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "Faith Companion AI <noreply@faithcompanionai.com>";

  const label =
    opts.contentType === "verse"
      ? "Today&rsquo;s Verse"
      : opts.contentType === "devotional"
      ? "Today&rsquo;s Devotional"
      : "Today&rsquo;s Prayer";

  const accentColor =
    opts.contentType === "verse"
      ? "#7c3aed"
      : opts.contentType === "devotional"
      ? "#f97316"
      : "#10b981";

  const contentHtml = opts.contentText
    .split("\n")
    .map((line) => {
      const escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return escaped.trim()
        ? `<p style="margin:0 0 12px;color:#1a1a1a;font-size:15px;line-height:1.7;">${escaped}</p>`
        : `<p style="margin:0 0 8px;">&nbsp;</p>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${opts.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f0ff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0ff;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#f97316);border-radius:20px 20px 0 0;padding:32px 36px;">
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.7);">
                Faith Companion AI
              </div>
              <div style="font-size:26px;font-weight:800;color:#fff;margin-top:8px;line-height:1.3;">
                ${label}
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#fff;padding:36px 36px 28px;border-left:1px solid #e9e0ff;border-right:1px solid #e9e0ff;">
              <div style="border-left:4px solid ${accentColor};padding-left:16px;margin-bottom:24px;">
                ${contentHtml}
              </div>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(to right,#7c3aed,#f97316);border-radius:999px;padding:1px;">
                    <a href="https://faithcompanionai.com/dashboard"
                       style="display:inline-block;padding:12px 28px;background:linear-gradient(to right,#7c3aed,#f97316);color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
                      Open Faith Companion &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f5ff;border:1px solid #e9e0ff;border-top:none;border-radius:0 0 20px 20px;padding:20px 36px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;">
                You&rsquo;re receiving this because you opted in to daily devotional emails.
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="${opts.unsubscribeUrl}" style="color:#7c3aed;text-decoration:underline;">
                  Unsubscribe
                </a>
                &nbsp;&middot;&nbsp;
                <a href="https://faithcompanionai.com/dashboard" style="color:#7c3aed;text-decoration:underline;">
                  Manage preferences
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  if (!resendApiKey) {
    console.log(`[DevotionalEmail - DEV] To: ${opts.to} | Subject: ${opts.subject}`);
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
      subject: opts.subject,
      html,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to send devotional email: ${text}`);
  }

  return { ok: true, provider: "resend" as const };
}

export async function sendPasswordResetEmail(opts: {
  to: string;
  resetLink: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "Faith Companion AI <noreply@faithcompanionai.com>";

  if (!resendApiKey) {
    console.log("\n[Password Reset Email - DEV FALLBACK]");
    console.log(`To: ${opts.to}`);
    console.log(`Link: ${opts.resetLink}\n`);
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
      subject: "Reset your Faith Companion AI password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Reset your password</h2>
          <p>Click the button below to set a new password for your Faith Companion AI account:</p>
          <p>
            <a href="${opts.resetLink}" style="display:inline-block;padding:12px 20px;background:linear-gradient(to right,#7c3aed,#f97316);color:#fff;text-decoration:none;border-radius:999px;font-weight:700;">
              Set new password
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p style="word-break:break-all;">${opts.resetLink}</p>
          <p>This link expires in 20 minutes. If you did not request a password reset, you can ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to send password reset email: ${text}`);
  }

  return { ok: true, provider: "resend" as const };
}

export async function sendPremiumExpiryReminderEmail(opts: {
  to: string;
  daysLeft: number;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "Faith Companion AI <noreply@faithcompanionai.com>";

  const subject =
    opts.daysLeft <= 2
      ? "Your free Premium access ends in 2 days"
      : "Your free Premium access ends in 7 days";

  const urgencyLine =
    opts.daysLeft <= 2
      ? "Just 2 days left on your free Premium access — we&rsquo;d love to keep you."
      : "You have 7 days left to enjoy your full Premium experience.";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f0ff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0ff;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#f97316);border-radius:20px 20px 0 0;padding:32px 36px;">
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.7);">Faith Companion AI</div>
            <div style="font-size:26px;font-weight:800;color:#fff;margin-top:8px;line-height:1.3;">Your Premium access is ending soon</div>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:36px;border-left:1px solid #e9e0ff;border-right:1px solid #e9e0ff;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1a1a1a;">${urgencyLine}</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1a1a1a;">As a Premium member, you&rsquo;ve had access to:</p>
            <ul style="margin:0 0 24px;padding-left:20px;color:#1a1a1a;font-size:15px;line-height:2.2;">
              <li>Unlimited personalized verses, prayers, and devotionals</li>
              <li>Your personal faith journal</li>
              <li>All quiz categories</li>
              <li>Deeper spiritual guidance</li>
            </ul>
            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#1a1a1a;">Continue your faith journey without interruption &mdash; subscribe to keep everything you&rsquo;ve built.</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(to right,#7c3aed,#f97316);border-radius:999px;padding:1px;">
                  <a href="https://faithcompanionai.com/pricing"
                     style="display:inline-block;padding:13px 32px;background:linear-gradient(to right,#7c3aed,#f97316);color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
                    Continue Premium &rarr;
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-size:13px;color:#888;">Monthly from $4.99 &bull; Cancel anytime</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f5ff;border:1px solid #e9e0ff;border-top:none;border-radius:0 0 20px 20px;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#888;">
              Faith Companion AI &bull;
              <a href="https://faithcompanionai.com" style="color:#7c3aed;text-decoration:underline;">faithcompanionai.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (!resendApiKey) {
    console.log(`[PremiumExpiryReminder - DEV] To: ${opts.to} | daysLeft: ${opts.daysLeft}`);
    return { ok: true, provider: "dev-console" as const };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: fromEmail, to: [opts.to], subject, html }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to send expiry reminder email: ${text}`);
  }

  return { ok: true, provider: "resend" as const };
}

export async function sendPremiumDowngradeEmail(opts: { to: string }) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "Faith Companion AI <noreply@faithcompanionai.com>";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Your Premium access has ended</title>
</head>
<body style="margin:0;padding:0;background:#f4f0ff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0ff;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#f97316);border-radius:20px 20px 0 0;padding:32px 36px;">
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.7);">Faith Companion AI</div>
            <div style="font-size:26px;font-weight:800;color:#fff;margin-top:8px;line-height:1.3;">Your Premium access has ended</div>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:36px;border-left:1px solid #e9e0ff;border-right:1px solid #e9e0ff;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              Thank you for being part of Faith Companion AI &mdash; it&rsquo;s been a joy walking alongside you.
            </p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              Your Premium subscription has ended, but your free access remains. You can still use all the core tools whenever you need them:
            </p>
            <ul style="margin:0 0 24px;padding-left:20px;color:#1a1a1a;font-size:15px;line-height:2.2;">
              <li>Personalized Bible verses</li>
              <li>Prayers for your situation</li>
              <li>Short devotionals</li>
              <li>Bible Quiz (free categories)</li>
            </ul>
            <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              Whenever you&rsquo;re ready to go deeper, Premium is here. No pressure &mdash; the free tools are yours forever.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(to right,#7c3aed,#f97316);border-radius:999px;padding:1px;">
                  <a href="https://faithcompanionai.com/tools/verse"
                     style="display:inline-block;padding:13px 32px;background:linear-gradient(to right,#7c3aed,#f97316);color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:700;">
                    Continue with free access &rarr;
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:16px 0 0;font-size:13px;color:#888;">
              Want to come back?
              <a href="https://faithcompanionai.com/pricing" style="color:#7c3aed;text-decoration:underline;">View Premium plans</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f5ff;border:1px solid #e9e0ff;border-top:none;border-radius:0 0 20px 20px;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#888;">
              Faith Companion AI &bull;
              <a href="https://faithcompanionai.com" style="color:#7c3aed;text-decoration:underline;">faithcompanionai.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (!resendApiKey) {
    console.log(`[PremiumDowngrade - DEV] To: ${opts.to}`);
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
      subject: "Your Premium access has ended — free access continues",
      html,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to send downgrade email: ${text}`);
  }

  return { ok: true, provider: "resend" as const };
}

export async function sendMagicLinkEmail(opts: {
  to: string;
  magicLink: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.EMAIL_FROM || "Faith Companion AI <noreply@faithcompanionai.com>";

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