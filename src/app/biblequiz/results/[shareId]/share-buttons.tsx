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
  tierLabel,
}: {
  shareUrl: string;
  shareText: string;
  tierLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const links = useMemo(() => {
    return {
      x: buildTwitterIntent(shareText, shareUrl),
      fb: buildFacebookShare(shareUrl),
      wa: buildWhatsAppShare(shareText, shareUrl),
    };
  }, [shareText, shareUrl]);

  async function copyLink() {
    if (typeof window !== "undefined" && window.isSecureContext && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
        return;
      } catch {
        // fall through
      }
    }
    window.prompt("Copy this link:", shareUrl);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: "My Bible Quiz Result", text: shareText, url: shareUrl });
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // user cancelled or not supported — fall through silently
    }
  }

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-black/40 p-5 sm:p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="text-base font-bold text-white">Challenge a friend to discover their faith journey</div>
        <div className="mt-1 text-xs text-white/60">
          {tierLabel
            ? `You scored as a "${tierLabel}" — see if they can match it.`
            : "Share your result and see how your friends compare."}
        </div>
      </div>

      {/* Mobile-first: native share as primary */}
      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          className={classNames(
            "mb-3 w-full rounded-full py-3 text-sm font-semibold transition",
            shared
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-purple-600 to-orange-500 text-white hover:opacity-95"
          )}
        >
          {shared ? "Shared!" : "Share Your Result"}
        </button>
      )}

      {/* Platform buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className={classNames(
            "rounded-full px-4 py-2 text-xs font-semibold transition",
            copied ? "bg-green-600 text-white" : "bg-white/10 text-white hover:bg-white/15"
          )}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>

        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition"
        >
          Share on X
        </a>

        <a
          href={links.fb}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition"
        >
          Facebook
        </a>

        <a
          href={links.wa}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition"
        >
          WhatsApp
        </a>
      </div>

      {/* Share link preview */}
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block truncate rounded-xl bg-black/30 px-3 py-2 text-xs text-white/50 hover:text-white/80 transition"
        title="Open share link"
      >
        {shareUrl}
      </a>
    </div>
  );
}
