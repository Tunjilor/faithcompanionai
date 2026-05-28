"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

type Platform = "android" | "ios" | null;

const DISMISSED_KEY = "faithai_a2hs_dismissed";
const DELAY_MS = 30_000;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return null;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function AddToHomeScreen() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  // deferredPrompt holds the BeforeInstallPromptEvent for Android
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    // Don't show if already installed or previously dismissed
    if (isStandalone()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const detected = detectPlatform();
    if (!detected) return;
    setPlatform(detected);

    // Android: capture beforeinstallprompt
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // Show banner after delay
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(DISMISSED_KEY)) {
        setVisible(true);
      }
    }, DELAY_MS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  async function handleInstall() {
    if (deferredPrompt) {
      // Android Chrome native install prompt
      (deferredPrompt as unknown as { prompt: () => void }).prompt();
      dismiss();
    } else {
      // iOS or unsupported — just dismiss; user sees the instructions tooltip
      dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Add Faith Companion AI to your home screen"
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe-or-4 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-xs"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 1rem)" }}
    >
      <div className="rounded-2xl border border-white/10 bg-[#1a0533]/95 shadow-2xl backdrop-blur-xl p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-orange-500">
            <Download size={18} className="text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-snug">
              Add Faith Companion AI
            </p>
            {platform === "ios" ? (
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                Tap <span className="font-semibold text-white/80">Share</span> then{" "}
                <span className="font-semibold text-white/80">Add to Home Screen</span> for the
                best experience.
              </p>
            ) : (
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                Install the app for quick access, offline reading, and a distraction-free experience.
              </p>
            )}
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white/80 transition"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>

        {/* Action buttons (Android + generic) */}
        {platform !== "ios" && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 py-2 text-xs font-semibold text-white hover:opacity-95 transition"
            >
              Install app
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 rounded-full border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition"
            >
              Not now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
