"use client";

import { useEffect, useRef, useState } from "react";
import { X, Download, Share2, ImageIcon } from "lucide-react";
import { drawVerseCard, type CardFormat } from "@/lib/drawVerseCard";

type Props = {
  initialText?: string;
  initialReference?: string;
  onClose: () => void;
};

export default function ShareCardModal({
  initialText = "",
  initialReference = "",
  onClose,
}: Props) {
  const [text, setText] = useState(initialText);
  const [reference, setReference] = useState(initialReference);
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

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

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
      // user cancelled or permission denied
    } finally {
      setSharing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-t-[28px] sm:rounded-[28px] border border-white/10 bg-[#0e0422] shadow-2xl max-h-[95dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={17} className="text-purple-400" />
            <span className="font-semibold text-white">Share Card</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Canvas preview */}
          <div
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            style={{ aspectRatio: format === "square" ? "1/1" : "1200/630" }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>

          {/* Format toggle */}
          <div className="flex gap-2">
            {(["square", "landscape"] as CardFormat[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  format === f
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-white/10 bg-white/5 text-white/55 hover:bg-white/10 hover:text-white/80",
                ].join(" ")}
              >
                {f === "square" ? "Square 1:1" : "Landscape 16:9"}
              </button>
            ))}
          </div>

          {/* Editable fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5">
                Verse text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Type or paste verse text..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5">
                Scripture reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. John 3:16"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 transition"
            >
              <Download size={15} />
              {downloading ? "Saving..." : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 disabled:opacity-60 transition"
            >
              <Share2 size={15} />
              {sharing ? "Sharing..." : shareLabel}
            </button>
          </div>

          <p className="text-xs text-white/30">
            Square format is ideal for Instagram. Landscape works best on Twitter/X and Facebook.
          </p>
        </div>
      </div>
    </div>
  );
}
