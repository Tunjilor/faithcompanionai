export type CardFormat = "square" | "landscape";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function drawVerseCard(
  canvas: HTMLCanvasElement,
  verseText: string,
  reference: string,
  format: CardFormat = "square"
) {
  const W = format === "square" ? 1080 : 1200;
  const H = format === "square" ? 1080 : 630;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W * 0.7, H);
  bg.addColorStop(0, "#0e0422");
  bg.addColorStop(0.5, "#170537");
  bg.addColorStop(1, "#090116");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Purple glow — top-left
  const g1 = ctx.createRadialGradient(W * 0.17, H * 0.17, 0, W * 0.17, H * 0.17, W * 0.58);
  g1.addColorStop(0, "rgba(124, 58, 237, 0.45)");
  g1.addColorStop(0.55, "rgba(124, 58, 237, 0.12)");
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // Orange glow — bottom-right
  const g2 = ctx.createRadialGradient(W * 0.86, H * 0.87, 0, W * 0.86, H * 0.87, W * 0.44);
  g2.addColorStop(0, "rgba(249, 115, 22, 0.32)");
  g2.addColorStop(0.55, "rgba(249, 115, 22, 0.08)");
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // Soft center glow
  const g3 = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.5);
  g3.addColorStop(0, "rgba(139, 92, 246, 0.07)");
  g3.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, W, H);

  const PAD = W * 0.1;
  const CW = W - PAD * 2;

  // Decorative star at top
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${W * 0.038}px Georgia, serif`;
  ctx.fillStyle = "rgba(196, 167, 247, 0.6)";
  ctx.fillText("\u2736", W / 2, H * 0.11);

  // Verse text — auto-size to fit
  const raw = verseText.trim() || "Your verse will appear here";
  const displayText = `\u201C${raw}\u201D`;

  let fontSize = format === "square" ? 56 : 44;
  const maxLines = format === "square" ? 9 : 6;
  let lines: string[] = [];

  while (fontSize >= 26) {
    ctx.font = `italic ${fontSize}px Georgia, "Times New Roman", serif`;
    lines = wrapText(ctx, displayText, CW);
    if (lines.length <= maxLines) break;
    fontSize -= 3;
  }
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines - 1);
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = (last.length > 50 ? last.slice(0, 48) : last) + "\u2026\u201D";
  }

  const lineH = fontSize * 1.52;
  const totalH = lines.length * lineH;
  const startY = H * 0.47 - totalH / 2;

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, startY + i * lineH);
  });

  // Reference
  const refSize = W * 0.026;
  ctx.font = `600 ${refSize}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = "rgba(196, 167, 247, 0.78)";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const refLabel = reference.trim() ? `\u2014 ${reference.trim()}` : "\u2014 Scripture Reference";
  ctx.fillText(refLabel, W / 2, startY + totalH + H * 0.058);

  // Gradient divider
  const divY = H * 0.876;
  const gradLine = ctx.createLinearGradient(PAD, divY, W - PAD, divY);
  gradLine.addColorStop(0, "rgba(255,255,255,0)");
  gradLine.addColorStop(0.3, "rgba(255,255,255,0.15)");
  gradLine.addColorStop(0.7, "rgba(255,255,255,0.15)");
  gradLine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = gradLine;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, divY);
  ctx.lineTo(W - PAD, divY);
  ctx.stroke();

  // Wordmark
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${W * 0.022}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fillText("Faith Companion AI", W / 2, H * 0.925);

  ctx.font = `${W * 0.016}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillText("faithcompanionai.com", W / 2, H * 0.959);
}
