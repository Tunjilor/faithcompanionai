// src/app/biblequiz/results/[shareId]/share-buttons.tsx
"use client";

import React, { useMemo, useState } from "react";

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function buildTwitterIntent(text: string, url: string) {
  const u = new URL("https://twitter.com/intent/tweet");
  u.searchParams.set("text", text);
  u.searchParams.set("url", url);
  return u.toString();
}

function buildFacebookShare(url: string) {
  const u = new URL("https://www.facebook.com/sharer/sharer.php");
  u.searchParams.set("u", url);
  return u.toString();
}

function buildWhatsAppShare(text: string, url: string) {
  const u = new URL("https://wa.me/");
  u.searchParams.set("text", `${text} ${url}`.trim());
  return u.toString();
}

export default function ShareButtons({
  shareUrl,
  shareText,
}: {
  shareUrl: string;
  shareText: string;
}) {
  const [copied, setCopied] = useState(false);

  const links = useMemo(() => {
    return {
      x: buildTwitterIntent(shareText, shareUrl),
      fb: buildFacebookShare(shareUrl),
      wa: buildWhatsAppShare(shareText, shareUrl),
    };
  }, [shareText, shareUrl]);

  async function copyLink() {
    // Best experience on HTTPS: clipboard API
    if (typeof window !== "undefined" && window.isSecureContext && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      } catch {
        // fall through to prompt
      }
    }

    // No deprecated execCommand: use prompt fallback
    window.prompt("Copy this link:", shareUrl);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-white font-bold">Share</div>
          <div className="text-xs text-white/60">Copy link or share to your favorite platform.</div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyLink}
            className={classNames(
              "rounded-md px-4 py-2 text-sm font-semibold transition",
              copied ? "bg-green-600 text-white" : "bg-white/10 text-white hover:bg-white/15"
            )}
            title="Copy link"
          >
            {copied ? "Copied ✅" : "Copy link"}
          </button>

          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
            title="Share to X"
          >
            Share to X
          </a>

          <a
            href={links.fb}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
            title="Share to Facebook"
          >
            Facebook
          </a>

          <a
            href={links.wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
            title="Share to WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block rounded-xl bg-black/40 p-3 text-xs text-white/70 break-all hover:text-white"
        title="Open share link"
      >
        {shareUrl}
      </a>
    </div>
  );
}