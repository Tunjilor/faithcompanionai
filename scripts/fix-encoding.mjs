// Comprehensive UTF-8 mojibake fixer.
// Handles sequences that were UTF-8 but decoded as Windows-1252 and re-saved.
// Each entry: [mojibake_string, correct_unicode_char]

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// ── Fix map ───────────────────────────────────────────────────────────────────
// UTF-8 bytes → Win-1252 codepoints (the double-encoded result we see in files)
// E2 80 A2 (•)  → â (E2) + € (80) + ¢ (A2)
// E2 80 94 (—)  → â (E2) + € (80) + " (94→U+201D)
// E2 80 99 (')  → â (E2) + € (80) + ' (99→U+2019)
// E2 80 9C (")  → â (E2) + € (80) + œ (9C→U+0153) [left dquote]
// E2 80 9D (")  → â (E2) + € (80) + " (9D→U+201D) [right dquote, alt]
// E2 80 A6 (…)  → â (E2) + € (80) + ¦ (A6)
// E2 9C 85 (✅) → â (E2) + œ (9C) + … (85→U+2026)
// E2 9C 93 (✓)  → â (E2) + œ (9C) + " (93→U+201D)
// E2 86 92 (→)  → â (E2) + † (86→U+2020) + ' (92→U+2019)
// E2 86 90 (←)  → â (E2) + † (86→U+2020) + [0x90 C1 ctrl]
// C2 A9 (©)     → Â (C2) + © (A9)
// C2 B7 (·)     → Â (C2) + · (B7)  [but ·=U+00B7 is also valid directly]

const FIXES = [
  // — em dash  (E2 80 94)  — Win-1252 0x94 → U+201D
  ['\u00E2\u20AC\u201D', '\u2014'],
  // ' right single quote / apostrophe  (E2 80 99)  — Win-1252 0x99 → U+2122 ™
  ['\u00E2\u20AC\u2122', '\u2019'],
  // – en dash  (E2 80 93)  — Win-1252 0x93 → U+201C "
  ['\u00E2\u20AC\u201C', '\u2013'],
  // " left double quote  (E2 80 9C)  — Win-1252 0x9C → U+0153 œ
  ['\u00E2\u20AC\u0153', '\u201C'],
  // • bullet  (E2 80 A2)
  ['\u00E2\u20AC\u00A2', '\u2022'],
  // … ellipsis  (E2 80 A6)
  ['\u00E2\u20AC\u00A6', '\u2026'],
  // → right arrow  (E2 86 92)
  ['\u00E2\u2020\u2019', '\u2192'],
  // ← left arrow  (E2 86 90) — 0x90 in Win-1252 not mapped, treated as U+0090 C1 ctrl
  ['\u00E2\u2020\u0090', '\u2190'],
  // ✅ green check  (E2 9C 85)
  ['\u00E2\u0153\u2026', '\u2705'],
  // ✓ check mark  (E2 9C 93)
  ['\u00E2\u0153\u201D', '\u2713'],
  // © copyright  (C2 A9)
  ['\u00C2\u00A9', '\u00A9'],
  // · middle dot  (C2 B7)
  ['\u00C2\u00B7', '\u00B7'],
];

// ── File walker ───────────────────────────────────────────────────────────────

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === 'node_modules' || entry === '.git' || entry === '.next') continue;
    const st = statSync(full);
    if (st.isDirectory()) results.push(...walk(full));
    else if (['.tsx', '.ts', '.js', '.jsx', '.html'].includes(extname(entry))) results.push(full);
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const files = walk('src').concat(walk('public'));
let fixedCount = 0;

for (const file of files) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }

  const original = src;
  for (const [bad, good] of FIXES) {
    if (src.includes(bad)) src = src.split(bad).join(good);
  }

  if (src !== original) {
    writeFileSync(file, src, 'utf8');
    console.log('FIXED:', file);
    fixedCount++;
  }
}

console.log(`\nDone. Fixed ${fixedCount} file(s).`);

// ── Report remaining suspicious bytes ────────────────────────────────────────
console.log('\n--- Remaining Latin-1 supplement sequences (U+0080–U+00FF) ---');
let anyLeft = false;
for (const file of files) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { continue; }
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (let j = 0; j < line.length; j++) {
      const code = line.charCodeAt(j);
      // Only flag the classic mojibake start byte â (U+00E2) still followed by suspicious chars
      if (code === 0x00E2) {
        const next = line.charCodeAt(j + 1);
        // If next char is in Win-1252 supplement range it's likely still mojibake
        if (next === 0x20AC || next === 0x2020 || next === 0x0153) {
          console.log(`  ${file}:${i + 1} col${j + 1}`, JSON.stringify(line.slice(Math.max(0, j - 5), j + 20)));
          anyLeft = true;
          break;
        }
      }
    }
  });
}
if (!anyLeft) console.log('  None found — all clean!');
