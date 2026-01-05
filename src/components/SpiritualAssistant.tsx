"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Msg = {
  role: "assistant" | "user";
  content: string;
  ts: number;
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const STORAGE_KEY = "fcai_chat_v1";

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function SpiritualAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Msg[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const listRef = useRef<HTMLDivElement | null>(null);

  // Seed message if empty
  useEffect(() => {
    if (msgs.length > 0) return;
    setMsgs([
      {
        role: "assistant",
        content:
          "Hello! I’m your Faith Companion AI assistant. I can help with Scripture-based encouragement, short prayers, and faith questions. What would you like help with today?",
        ts: Date.now(),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {
      // ignore
    }
  }, [msgs]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, msgs]);

  const transcript = useMemo(() => {
    return msgs
      .map((m) => {
        const who = m.role === "user" ? "You" : "Assistant";
        const time = new Date(m.ts).toLocaleString();
        return `[${time}] ${who}: ${m.content}`;
      })
      .join("\n\n");
  }, [msgs]);

  function addUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMsgs((prev) => [
      ...prev,
      { role: "user", content: trimmed, ts: Date.now() },
      {
        role: "assistant",
        content:
          "Thanks — I’m ready. (Next step: we’ll wire this to your AI endpoint. For now this is a UI + transcript saver.)",
        ts: Date.now() + 1,
      },
    ]);
    setInput("");
  }

  function clearChat() {
    setMsgs([
      {
        role: "assistant",
        content:
          "Hello! I’m your Faith Companion AI assistant. How can I help you today?",
        ts: Date.now(),
      },
    ]);
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
          aria-label="Open Spiritual Assistant"
        >
          💬 <span className="hidden sm:inline">Spiritual Assistant</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-white">
            <div className="font-semibold">Spiritual Assistant</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/25"
                aria-label="Reset conversation"
                title="Reset"
              >
                ↻
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/25"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="px-4 py-3">
            <div className="text-xs font-semibold text-white/70">Quick Actions</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/tools/prayer"
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/15 hover:text-white"
              >
                Generate a Prayer
              </Link>
              <Link
                href="/tools/verse"
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/15 hover:text-white"
              >
                Find a Verse
              </Link>
              <Link
                href="/tools/devotional"
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/15 hover:text-white"
              >
                Daily Devotional
              </Link>
            </div>

            {/* Save/Download */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  // already saved in localStorage via effect; this is just user feedback behavior
                  // could later show toast
                }}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                Save Conversation
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadText(
                    `faith-companion-chat-${new Date()
                      .toISOString()
                      .slice(0, 10)}.txt`,
                    transcript
                  )
                }
                className="rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
              >
                Download (.txt)
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="max-h-[48vh] space-y-3 overflow-y-auto px-4 pb-4"
          >
            {msgs.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-white/10 text-white"
                    : "bg-white/5 text-white/80"
                )}
              >
                {m.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            className="border-t border-white/10 bg-black/40 px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              addUserMessage(input);
            }}
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a spiritual question..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/15"
                aria-label="Send"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
