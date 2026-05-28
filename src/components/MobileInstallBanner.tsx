"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISSED_KEY = "faithai_install_banner_dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function MobileInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua);
    const android = /android/i.test(ua);
    if (!ios && !android) return;

    setIsIos(ios);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // Show after a short engagement delay
    const timer = setTimeout(() => {
      if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  async function handleInstall() {
    if (deferredPrompt) {
      (deferredPrompt as unknown as { prompt: () => void }).prompt();
    }
    dismiss();
  }

  if (!visible) return null;

  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-purple-500/20 bg-purple-900/20 px-4 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-snug">
          Add Faith Companion to your home screen
        </p>
        {isIos ? (
          <p className="mt-1 text-xs text-white/60 leading-relaxed">
            Tap <span className="font-semibold text-white/80">Share</span> then{" "}
            <span className="font-semibold text-white/80">Add to Home Screen</span> for daily access.
          </p>
        ) : (
          <p className="mt-1 text-xs text-white/60 leading-relaxed">
            Get daily access without opening a browser.
          </p>
        )}
      </div>
      {!isIos && (
        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
        >
          Add now
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
