import { readFileSync, writeFileSync } from 'fs';

let src = readFileSync('src/app/dashboard/page.tsx', 'utf8');
const CRLF = '\r\n';

function rep(from, to, label) {
  const count = src.split(from).length - 1;
  if (count === 0) { console.error('NOT FOUND: ' + label); process.exit(1); }
  if (count > 1) { console.error('AMBIGUOUS (' + count + '): ' + label); process.exit(1); }
  src = src.replace(from, to);
  console.log('OK:', label);
}

// 1) Add EmailPrefs type + HOUR_OPTIONS after StreakData
rep(
  '  isNewDay: boolean;\r\n};\r\n\r\n//',
  '  isNewDay: boolean;\r\n};\r\n\r\n' +
  'type EmailPrefs = {\r\n' +
  '  emailOptIn: boolean;\r\n' +
  '  emailTime: string;\r\n' +
  '  emailTimezone: string;\r\n' +
  '};\r\n\r\n' +
  'const HOUR_OPTIONS = Array.from({ length: 18 }, (_, i) => {\r\n' +
  '  const h = i + 5;\r\n' +
  '  const label = h < 12 ? h + \':00 AM\' : h === 12 ? \'12:00 PM\' : (h - 12) + \':00 PM\';\r\n' +
  '  return { value: String(h).padStart(2, \'0\') + \':00\', label };\r\n' +
  '});\r\n\r\n' +
  '//',
  'types+HOUR_OPTIONS'
);

// 2) Add email state vars after journalFilter
rep(
  'useState<"all" | "unanswered" | "answered">("all");\r\n',
  'useState<"all" | "unanswered" | "answered">("all");\r\n' +
  '  const [emailPrefs, setEmailPrefs] = useState<EmailPrefs | null>(null);\r\n' +
  '  const [emailPrefsDraft, setEmailPrefsDraft] = useState<EmailPrefs | null>(null);\r\n' +
  '  const [emailPrefsSaving, setEmailPrefsSaving] = useState(false);\r\n' +
  '  const [emailPrefsStatus, setEmailPrefsStatus] = useState<"" | "saved" | "error">("");\r\n',
  'state vars'
);

// 3) Update load() to also fetch email-prefs
rep(
  '          const [savedRes] = await Promise.all([\r\n' +
  '            fetch("/api/saved", { cache: "no-store" }),\r\n' +
  '          ]);\r\n' +
  '          const savedData = savedRes.ok ? await savedRes.json() : { items: [] };\r\n' +
  '          if (!cancelled) setSavedItems(savedData.items || []);',
  '          const [savedRes, emailPrefsRes] = await Promise.all([\r\n' +
  '            fetch("/api/saved", { cache: "no-store" }),\r\n' +
  '            fetch("/api/me/email-prefs", { cache: "no-store" }),\r\n' +
  '          ]);\r\n' +
  '          const savedData = savedRes.ok ? await savedRes.json() : { items: [] };\r\n' +
  '          if (!cancelled) setSavedItems(savedData.items || []);\r\n\r\n' +
  '          if (emailPrefsRes.ok) {\r\n' +
  '            const prefs = await emailPrefsRes.json();\r\n' +
  '            if (!cancelled) {\r\n' +
  '              const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;\r\n' +
  '              const withTz: EmailPrefs = (prefs.emailTimezone === "UTC" && tz)\r\n' +
  '                ? { ...prefs, emailTimezone: tz } : prefs;\r\n' +
  '              setEmailPrefs(withTz);\r\n' +
  '              setEmailPrefsDraft(withTz);\r\n' +
  '            }\r\n' +
  '          }',
  'load fetch'
);

// 4) Add handler functions before handlePrayerAnswered
rep(
  '  function handlePrayerAnswered(',
  '  async function handleEmailPrefsSave() {\r\n' +
  '    if (!emailPrefsDraft) return;\r\n' +
  '    setEmailPrefsSaving(true);\r\n' +
  '    setEmailPrefsStatus("");\r\n' +
  '    try {\r\n' +
  '      const res = await fetch("/api/me/email-prefs", {\r\n' +
  '        method: "PATCH",\r\n' +
  '        headers: { "content-type": "application/json" },\r\n' +
  '        body: JSON.stringify(emailPrefsDraft),\r\n' +
  '      });\r\n' +
  '      if (!res.ok) throw new Error("Failed to save");\r\n' +
  '      const updated: EmailPrefs = await res.json();\r\n' +
  '      setEmailPrefs(updated);\r\n' +
  '      setEmailPrefsDraft(updated);\r\n' +
  '      setEmailPrefsStatus("saved");\r\n' +
  '      setTimeout(() => setEmailPrefsStatus(""), 3000);\r\n' +
  '    } catch {\r\n' +
  '      setEmailPrefsStatus("error");\r\n' +
  '    } finally {\r\n' +
  '      setEmailPrefsSaving(false);\r\n' +
  '    }\r\n' +
  '  }\r\n\r\n' +
  '  function handleEmailPrefsToggle(on: boolean) {\r\n' +
  '    setEmailPrefsDraft(d => d ? { ...d, emailOptIn: on } : d);\r\n' +
  '  }\r\n\r\n' +
  '  function handleEmailPrefsField(field: keyof EmailPrefs, value: string | boolean) {\r\n' +
  '    setEmailPrefsDraft(d => d ? { ...d, [field]: value } : d);\r\n' +
  '  }\r\n\r\n' +
  '  function handlePrayerAnswered(',
  'handlers'
);

// 5) Insert email prefs UI section before the Prayer Journal JSX section.
//    Anchor: the <h2> for My Prayer Journal is unique; walk back to find
//    the <section> opening, then the JSX comment line before it.
const pjH2 = '<h2 className="text-2xl font-bold text-white">My Prayer Journal</h2>';
const pjIdx = src.indexOf(pjH2);
if (pjIdx === -1) { console.error('Could not find My Prayer Journal h2'); process.exit(1); }

// Walk back to the <section> that wraps it
let secIdx = pjIdx;
while (secIdx > 0 && !src.startsWith('<section', secIdx)) secIdx--;

// Find start of the <section line
let secLineStart = secIdx;
while (secLineStart > 0 && src[secLineStart - 1] !== '\n') secLineStart--;

// The line before that is the JSX comment line — step back one line
let prevLineEnd = secLineStart - 1;               // points at \n
if (src[prevLineEnd - 1] === '\r') prevLineEnd--;  // skip \r
let prevLineStart = prevLineEnd;
while (prevLineStart > 0 && src[prevLineStart - 1] !== '\n') prevLineStart--;

// Step back one more line (blank separator)
let blankEnd = prevLineStart - 1;
if (src[blankEnd - 1] === '\r') blankEnd--;
let blankStart = blankEnd;
while (blankStart > 0 && src[blankStart - 1] !== '\n') blankStart--;

// We insert starting from blankStart (before the blank line that precedes the comment)
const insertAt = blankStart;
console.log('Inserting before line:', JSON.stringify(src.slice(insertAt, insertAt + 60)));

const ui =
  '\r\n' +
  '      {/* -- Daily Email Devotionals -- */}\r\n' +
  '      {signedIn && emailPrefsDraft && (\r\n' +
  '        <section className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-6">\r\n' +
  '          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">\r\n' +
  '            <div>\r\n' +
  '              <h2 className="text-xl font-bold text-white">Daily Email Devotionals</h2>\r\n' +
  '              <p className="mt-1 text-sm text-white/60">\r\n' +
  '                Receive a verse, devotional, or prayer straight to your inbox each morning.\r\n' +
  '              </p>\r\n' +
  '            </div>\r\n' +
  '            <button\r\n' +
  '              type="button"\r\n' +
  '              onClick={() => handleEmailPrefsToggle(!emailPrefsDraft.emailOptIn)}\r\n' +
  '              className={[\r\n' +
  '                "mt-3 sm:mt-0 flex h-8 w-14 shrink-0 items-center rounded-full transition-colors",\r\n' +
  '                emailPrefsDraft.emailOptIn\r\n' +
  '                  ? "bg-gradient-to-r from-purple-600 to-orange-500"\r\n' +
  '                  : "bg-white/10",\r\n' +
  '              ].join(" ")}\r\n' +
  '            >\r\n' +
  '              <span\r\n' +
  '                className={[\r\n' +
  '                  "ml-1 h-6 w-6 rounded-full bg-white shadow transition-transform",\r\n' +
  '                  emailPrefsDraft.emailOptIn ? "translate-x-6" : "translate-x-0",\r\n' +
  '                ].join(" ")}\r\n' +
  '              />\r\n' +
  '            </button>\r\n' +
  '          </div>\r\n' +
  '\r\n' +
  '          {emailPrefsDraft.emailOptIn && (\r\n' +
  '            <div className="mt-5 grid gap-4 sm:grid-cols-2">\r\n' +
  '              <div>\r\n' +
  '                <label className="block text-xs font-semibold text-white/60">Delivery time</label>\r\n' +
  '                <select\r\n' +
  '                  value={emailPrefsDraft.emailTime}\r\n' +
  '                  onChange={(e) => handleEmailPrefsField("emailTime", e.target.value)}\r\n' +
  '                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"\r\n' +
  '                >\r\n' +
  '                  {HOUR_OPTIONS.map((o) => (\r\n' +
  '                    <option key={o.value} value={o.value}>{o.label}</option>\r\n' +
  '                  ))}\r\n' +
  '                </select>\r\n' +
  '              </div>\r\n' +
  '              <div>\r\n' +
  '                <label className="block text-xs font-semibold text-white/60">Timezone</label>\r\n' +
  '                <input\r\n' +
  '                  type="text"\r\n' +
  '                  value={emailPrefsDraft.emailTimezone}\r\n' +
  '                  onChange={(e) => handleEmailPrefsField("emailTimezone", e.target.value)}\r\n' +
  '                  placeholder="e.g. America/New_York"\r\n' +
  '                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"\r\n' +
  '                />\r\n' +
  '                <p className="mt-1 text-xs text-white/35">\r\n' +
  '                  Auto-detected. Use IANA format (e.g. Europe/London).\r\n' +
  '                </p>\r\n' +
  '              </div>\r\n' +
  '            </div>\r\n' +
  '          )}\r\n' +
  '\r\n' +
  '          <div className="mt-5 flex flex-wrap items-center gap-3">\r\n' +
  '            <button\r\n' +
  '              type="button"\r\n' +
  '              onClick={handleEmailPrefsSave}\r\n' +
  '              disabled={emailPrefsSaving}\r\n' +
  '              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"\r\n' +
  '            >\r\n' +
  '              {emailPrefsSaving ? "Saving..." : "Save preferences"}\r\n' +
  '            </button>\r\n' +
  '            {emailPrefsStatus === "saved" && (\r\n' +
  '              <span className="text-sm font-semibold text-emerald-400">Saved!</span>\r\n' +
  '            )}\r\n' +
  '            {emailPrefsStatus === "error" && (\r\n' +
  '              <span className="text-sm font-semibold text-red-400">Failed to save. Try again.</span>\r\n' +
  '            )}\r\n' +
  '          </div>\r\n' +
  '\r\n' +
  '          {!emailPrefsDraft.emailOptIn && (\r\n' +
  '            <p className="mt-4 text-xs text-white/35">\r\n' +
  '              Schedule: verses Mon and Wed, devotionals Tue and Thu, prayers Fri through Sun.\r\n' +
  '            </p>\r\n' +
  '          )}\r\n' +
  '        </section>\r\n' +
  '      )}\r\n';

src = src.slice(0, insertAt) + ui + src.slice(insertAt);
writeFileSync('src/app/dashboard/page.tsx', src, 'utf8');
console.log('All done. Total lines:', src.split('\n').length);
