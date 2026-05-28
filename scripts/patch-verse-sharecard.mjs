import { readFileSync, writeFileSync } from 'fs';

let src = readFileSync('src/app/tools/verse/page.tsx', 'utf8');

function rep(from, to, label) {
  const count = src.split(from).length - 1;
  if (count === 0) { console.error('NOT FOUND:', label); process.exit(1); }
  if (count > 1)   { console.error('AMBIGUOUS (' + count + '):', label); process.exit(1); }
  src = src.replace(from, to);
  console.log('OK:', label);
}

// 1) Add ShareCardModal import after existing imports
rep(
  'import DenominationSelect, { getDenominationNote, readDenomination } from "@/components/DenominationSelect";',
  'import DenominationSelect, { getDenominationNote, readDenomination } from "@/components/DenominationSelect";\r\nimport ShareCardModal from "@/components/ShareCardModal";\r\nimport { ImageIcon } from "lucide-react";'
  , 'imports'
);

// 2) Add showShareCard state after isSaving state
rep(
  'const [isSaving, setIsSaving] = useState(false);',
  'const [isSaving, setIsSaving] = useState(false);\r\n  const [showShareCard, setShowShareCard] = useState(false);',
  'state'
);

// 3) Add Share Card button after the Reset button
rep(
  '          <button\r\n            type="button"\r\n            onClick={handleReset}\r\n            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"\r\n          >\r\n            Reset\r\n          </button>',
  '          <button\r\n            type="button"\r\n            onClick={handleReset}\r\n            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"\r\n          >\r\n            Reset\r\n          </button>\r\n\r\n          {result && (\r\n            <button\r\n              type="button"\r\n              onClick={() => setShowShareCard(true)}\r\n              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"\r\n            >\r\n              <ImageIcon size={15} />\r\n              Share Card\r\n            </button>\r\n          )}',
  'share card button'
);

// 4) Fix broken em dash in verse list (â€" → —)
src = src.replace(/â€"/g, '\u2014');
console.log('OK: fix em dash encoding');

// 5) Fix broken lock emoji (ðŸ"' → 🔒)
src = src.replace(/\uFFFD?ðŸ"'/g, '\uD83D\uDD12');
// Also handle the raw bytes version
src = src.replace(/\xF0\x9F\x94\x92/g, '\uD83D\uDD12');
// Simpler: just replace the mojibake sequence
src = src.replace('ðŸ"\'', '{"🔒"}');
console.log('OK: fix lock emoji (if present)');

// 6) Add ShareCardModal just before closing </main>
rep(
  '    </main>\r\n  );\r\n}',
  '      {showShareCard && result && (\r\n        <ShareCardModal\r\n          initialText={result.encouragement}\r\n          initialReference={result.verses[0] ?? ""}\r\n          onClose={() => setShowShareCard(false)}\r\n        />\r\n      )}\r\n    </main>\r\n  );\r\n}',
  'modal render'
);

writeFileSync('src/app/tools/verse/page.tsx', src, 'utf8');
console.log('Done. Lines:', src.split('\n').length);
