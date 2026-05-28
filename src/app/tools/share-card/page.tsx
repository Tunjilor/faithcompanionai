"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, ImageIcon, Sparkles } from "lucide-react";
import { drawVerseCard, type CardFormat } from "@/lib/drawVerseCard";

const PRESETS = [
  { text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.", ref: "John 3:16" },
  { text: "I can do all things through Christ, who strengthens me.", ref: "Philippians 4:13" },
  { text: "For I know the plans I have for you, says the Lord, plans for welfare and not for evil, to give you a future and a hope.", ref: "Jeremiah 29:11" },
  { text: "Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.", ref: "Proverbs 3:5-6" },
  { text: "Peace I leave with you. My peace I give to you. Not as the world gives, I give to you. Do not let your heart be troubled, neither let it be afraid.", ref: "John 14:27" },
  { text: "Don\u2019t be afraid, for I am with you. Don\u2019t be dismayed, for I am your God. I will strengthen you. Yes, I will help you.", ref: "Isaiah 41:10" },
];

export default function ShareCardPage() {
  const [text, setText] = useState(PRESETS[0].text);
  const [reference, setReference] = useState(PRESETS[0].ref);
  const [format, setFormat] = useState<CardFormat>("square");
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawVerseCard(canvas, text, reference, format);
  }, [text, reference, format]);

  function applyPreset(p: { text: string; ref: string }) {
    setText(p.text);
    setReference(p.ref);
  }

  function getFilename() {
    const slug = (reference || "verse").replace(/[^a-z0-9]/gi, "-").toLowerCase().slice(0, 30);
    return `faith-companion-${slug}.png`;
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getFilename();
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      await new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob);
          resolve();
        }, "image/png");
      });
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSharing(true);
    try {
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/png")
      );
      if (!blob) return;
      const file = new File([blob], getFilename(), { type: "image/png" });

      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: reference || "Bible Verse",
          text: `${text}\n\u2014 ${reference}\n\nFaith Companion AI`,
        });
      } else if (navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setShareLabel("Copied!");
        setTimeout(() => setShareLabel("Share"), 2500);
      } else {
        downloadBlob(blob);
      }
    } catch {
      // cancelled or permission denied
    } finally {
      setSharing(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
          <ImageIcon size={13} />
          Verse Cards
        </div>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Share Card Generator</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Turn any Bible verse into a beautiful image card. Download as PNG and share on
          Instagram, Facebook, Twitter/X, or anywhere you spread the Word.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left — controls */}
        <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl md:p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Verse text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="Type or paste your verse text here..."
                className="mt-2 w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Scripture reference</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. John 3:16"
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-slate-700">Format</div>
              <div className="flex gap-2">
                {(["square", "landscape"] as CardFormat[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={[
                      "rounded-full border px-4 py-2 text-xs font-semibold transition",
                      format === f
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-400",
                    ].join(" ")}
                  >
                    {f === "square" ? "Square (Instagram)" : "Landscape (Twitter/X)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <Download size={15} />
                {downloading ? "Saving..." : "Download PNG"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={sharing}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <Share2 size={15} />
                {sharing ? "Sharing..." : shareLabel}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Sparkles size={12} />
              Popular verses
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.ref}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-600 transition hover:border-slate-300 hover:bg-white"
                >
                  <span className="font-semibold text-slate-800">{p.ref}</span>
                  {"  "}
                  <span className="line-clamp-1">{p.text.slice(0, 70)}&hellip;</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div className="flex flex-col gap-4">
          <div
            className="overflow-hidden rounded-[24px] border border-white/10 shadow-2xl"
            style={{ aspectRatio: format === "square" ? "1/1" : "1200/630" }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs font-semibold text-white/60 mb-2">Tips for sharing</div>
            <ul className="space-y-1.5 text-xs text-white/50">
              <li>
                <span className="text-white/70 font-medium">Instagram:</span>{" "}
                Square format (1080&times;1080) fills the feed perfectly.
              </li>
              <li>
                <span className="text-white/70 font-medium">Twitter/X &amp; Facebook:</span>{" "}
                Landscape format (1200&times;630) matches link preview cards.
              </li>
              <li>
                <span className="text-white/70 font-medium">Mobile:</span>{" "}
                Tap Share to send directly from your photo library or stories.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
