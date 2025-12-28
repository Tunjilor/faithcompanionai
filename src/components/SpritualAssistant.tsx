"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Role = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  ts: number;
};

const STORAGE_KEY = "fc_chat_history_v1";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatTxt(messages: ChatMessage[]) {
  return messages
    .map((m) => {
      const t = new Date(m.ts).toLocaleString();
      const who = m.role === "assistant" ? "Assistant" : "You";
      return `[${t}] ${who}: ${m.content}`;
    })
    .join("\n\n");
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
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
  const [open, setOpen] = useState(true); // or false if it should be closed by default
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Load saved conversation on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      } else {
        // initial greeting if no history
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content:
              "Hello! I'm your Faith Companion AI assistant. I'm here to provide spiritual guidance, answer Bible questions, and help you grow in faith. How can I help you today?",
            ts: Date.now(),
          },
        ]);
      }
    } catch {
      // fallback greeting
      setMessages([
        {
          id: uid(),
          role: "assistant",
          content:
            "Hello! I'm your Faith Companion AI assistant. How can I help you today?",
          ts: Date.now(),
        },
      ]);
    }
  }, []);

  // Auto-save whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Keep scrolled to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const canDownload = useMemo(() => messages.length > 0, [messages.length]);

  function send() {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // TODO: Replace this stub with your real API call
    const assistantMsg: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: "Got it. (Hook me up to your /api/ask route next and I’ll answer for real.)",
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
  }

  function clearConversation() {
    const ok = confirm("Clear this conversation? This cannot be undone.");
    if (!ok) return;

    const greeting: ChatMessage = {
      id: uid(),
      role: "assistant",
      content:
        "Hello! I'm your Faith Companion AI assistant. How can I help you today?",
      ts: Date.now(),
    };

    setMessages([greeting]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([greeting]));
    } catch {}
  }

  function downloadTxt() {
    const content = formatTxt(messages);
    downloadFile(`faithcompanionai-chat-${Date.now()}.txt`, content, "text/plain");
  }

  function downloadJson() {
    downloadFile(
      `faithcompanionai-chat-${Date.now()}.json`,
      JSON.stringify(messages, null, 2),
      "application/json"
    );
  }

  if (!open) {
    // If you have a floating button, return it here
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
        aria-label="Open Spiritual Assistant"
      >
        Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[92vw] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-3 text-white">
        <div className="flex items-center gap-2 font-semibold">
          <span>Spiritual Assistant</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/20"
            onClick={clearConversation}
            title="Clear conversation"
          >
            Clear
          </button>
          <button
            className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/20 disabled:opacity-50"
            onClick={downloadTxt}
            disabled={!canDownload}
            title="Download as TXT"
          >
            TXT
          </button>
          <button
            className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/20 disabled:opacity-50"
            onClick={downloadJson}
            disabled={!canDownload}
            title="Download as JSON"
          >
            JSON
          </button>
          <button
            className="rounded-md bg-white/15 px-2 py-1 text-xs hover:bg-white/20"
            onClick={() => setOpen(false)}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="h-[360px] overflow-y-auto px-4 py-3">
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={[
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                m.role === "assistant"
                  ? "bg-slate-100 text-slate-900"
                  : "ml-auto bg-purple-100 text-slate-900",
              ].join(" ")}
            >
              {m.content}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-black/10 bg-white px-3 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Ask a spiritual question..."
          className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          onClick={send}
          className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Send
        </button>
      </div>
    </div>
  );
}

