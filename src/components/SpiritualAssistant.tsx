"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw, X, Send } from "lucide-react";

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
  const [thinking, setThinking] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
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
          "Hello! I'm your Faith Companion AI assistant. I can help with Scripture-based encouragement, short prayers, and faith questions. What would you like help with today?",
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

  // Index of the assistant reply that follows the 3rd user message — where we inject the nudge
  const nudgeAfterIndex = useMemo(() => {
    let userCount = 0;
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].role === "user") userCount++;
      if (userCount === 3 && msgs[i].role === "assistant") return i;
    }
    return -1;
  }, [msgs]);

  const transcript = useMemo(() => {
    return msgs
      .map((m) => {
        const who = m.role === "user" ? "You" : "Assistant";
        const time = new Date(m.ts).toLocaleString();
        return `[${time}] ${who}: ${m.content}`;
      })
      .join("\n\n");
  }, [msgs]);

  async function addUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: Msg = { role: "user", content: trimmed, ts: Date.now() };
    setMsgs((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      // Pass the last 10 messages as history for context (excluding the one we just added)
      const history = msgs.slice(-10).map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json().catch(() => null);

      const replyContent = res.ok && data?.reply
        ? data.reply
        : data?.error === "LIMIT_REACHED" || res.status === 429
        ? "You've reached your daily limit. Upgrade to Premium for unlimited conversations."
        : data?.error || "Something went wrong. Please try again.";

      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: replyContent, ts: Date.now() },
      ]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reach the server. Please check your connection and try again.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function clearChat() {
    setMsgs([
      {
        role: "assistant",
        content:
          "Hello! I'm your Faith Companion AI assistant. How can I help you today?",
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
          {"💬"} <span className="hidden sm:inline">Spiritual Assistant</span>
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
                aria-label="Clear conversation"
                title="Clear chat (keeps widget open)"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/25"
                aria-label="Close chat"
                title="Close (conversation is saved)"
              >
                <X size={14} />
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
                  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
                  setSavedFlash(true);
                  setTimeout(() => setSavedFlash(false), 2000);
                }}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                {savedFlash ? "Saved \u2014 you can access this later." : "Save Conversation"}
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
              <button
                type="button"
                onClick={clearChat}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/50 hover:bg-white/10 hover:text-white/80"
              >
                Clear chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="max-h-[48vh] space-y-3 overflow-y-auto px-4 pb-4"
          >
            {msgs.map((m, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={cn(
                    "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-white/10 text-white"
                      : "bg-white/5 text-white/80"
                  )}
                >
                  {m.content}
                </div>
                {idx === nudgeAfterIndex && (
                  <div className="rounded-xl border border-orange-500/20 bg-orange-900/10 px-3 py-2.5 text-xs text-white/65 leading-relaxed">
                    Want deeper, longer conversations?{" "}
                    <Link href="/pricing" className="font-semibold text-orange-400 hover:text-orange-300">
                      Unlock Your Faith Journey
                    </Link>{" "}for extended guidance.
                  </div>
                )}
              </React.Fragment>
            ))}
            {thinking && (
              <div className="max-w-[92%] rounded-2xl bg-white/5 px-3 py-2 text-sm text-white/50">
                Thinking...
              </div>
            )}
          </div>

          {/* Premium soft hint */}
          <div className="mx-4 mb-1 mt-1 rounded-xl border border-purple-500/20 bg-purple-900/20 px-3 py-2 text-center">
            <p className="text-xs text-white/50">
              Want deeper, longer guidance?{" "}
              <span className="text-white/60">Premium unlocks more room to reflect.</span>{" "}
              <Link href="/pricing" className="font-semibold text-orange-400 hover:text-orange-300">
                Unlock Your Faith Journey
              </Link>
            </p>
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
                disabled={thinking}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/15 disabled:opacity-50"
                aria-label="Send"
              >
                {thinking ? "..." : <Send size={16} />}
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-white/30">
              Your conversation is not saved unless you click Save.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export { SpiritualAssistant };
