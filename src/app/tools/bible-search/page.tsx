"use client";

import { useState } from "react";
import { Search, BookOpen, Loader2, X } from "lucide-react";

type SearchMode = "reference" | "keyword";
type Translation = "web" | "kjv" | "asv";

type ApiVerse = {
  reference: string;
  text: string;
  translation_name: string;
  verses?: Array<{ book_name: string; chapter: number; verse: number; text: string }>;
};

type LocalVerse = {
  reference: string;
  text: string;
  keywords: string[];
};

// ── Verse dataset for keyword search ──────────────────────────────────────────

const VERSE_DATA: LocalVerse[] = [
  // Love
  { reference: "John 3:16", text: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.", keywords: ["love", "god", "salvation", "eternal", "believe", "world"] },
  { reference: "1 Corinthians 13:4-5", text: "Love is patient and is kind. Love doesn't envy. Love doesn't brag, is not proud, doesn't behave itself inappropriately, doesn't seek its own way, is not provoked, takes no account of evil.", keywords: ["love", "patient", "patience", "kindness", "kind"] },
  { reference: "Romans 8:38-39", text: "For I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing will be able to separate us from the love of God which is in Christ Jesus our Lord.", keywords: ["love", "god", "separate", "death", "eternal"] },
  { reference: "1 John 4:8", text: "He who doesn't love doesn't know God, for God is love.", keywords: ["love", "god", "know"] },
  { reference: "John 15:13", text: "Greater love has no one than this: to lay down one's life for one's friends.", keywords: ["love", "sacrifice", "friend", "friendship"] },
  // Faith
  { reference: "Hebrews 11:1", text: "Now faith is assurance of things hoped for, proof of things not seen.", keywords: ["faith", "hope", "assurance", "believe"] },
  { reference: "Romans 10:17", text: "So faith comes by hearing, and hearing by the word of God.", keywords: ["faith", "hearing", "word", "bible", "scripture"] },
  { reference: "2 Corinthians 5:7", text: "For we walk by faith, not by sight.", keywords: ["faith", "walk", "sight", "trust"] },
  { reference: "Matthew 17:20", text: "He said to them, 'Because of your little faith. For most certainly I tell you, if you have faith as a grain of mustard seed, you will tell this mountain, \"Move from here to there,\" and it will move; and nothing will be impossible for you.'", keywords: ["faith", "mountain", "mustard", "impossible", "believe"] },
  { reference: "Hebrews 11:6", text: "Without faith it is impossible to be well pleasing to him, for he who comes to God must believe that he exists, and that he is a rewarder of those who seek him.", keywords: ["faith", "please", "believe", "seek", "god", "reward"] },
  // Hope
  { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, says Yahweh, plans for welfare and not for evil, to give you a future and a hope.", keywords: ["hope", "future", "plans", "good", "god"] },
  { reference: "Romans 15:13", text: "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.", keywords: ["hope", "joy", "peace", "spirit", "believe"] },
  { reference: "Lamentations 3:22-23", text: "It is of Yahweh's loving kindness that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness.", keywords: ["hope", "mercy", "new", "morning", "compassion", "faithful", "faithfulness"] },
  { reference: "Psalm 31:24", text: "Be strong, and let your heart take courage, all you who hope in Yahweh.", keywords: ["hope", "strength", "courage", "strong", "heart"] },
  // Peace
  { reference: "John 14:27", text: "Peace I leave with you. My peace I give to you. Not as the world gives, I give to you. Don't let your heart be troubled, neither let it be afraid.", keywords: ["peace", "afraid", "trouble", "heart", "world", "anxiety"] },
  { reference: "Philippians 4:6-7", text: "In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.", keywords: ["peace", "anxiety", "anxious", "worry", "prayer", "thanksgiving", "guard", "heart"] },
  { reference: "Isaiah 26:3", text: "You will keep whoever's mind is steadfast in perfect peace, because he trusts in you.", keywords: ["peace", "trust", "mind", "steadfast", "perfect"] },
  { reference: "Colossians 3:15", text: "And let the peace of God rule in your hearts, to which also you were called in one body; and be thankful.", keywords: ["peace", "heart", "thankful", "gratitude", "body", "called"] },
  // Strength
  { reference: "Philippians 4:13", text: "I can do all things through Christ, who strengthens me.", keywords: ["strength", "strong", "power", "christ", "all things"] },
  { reference: "Isaiah 40:31", text: "But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.", keywords: ["strength", "strong", "wait", "eagle", "renew", "weary", "faint"] },
  { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble.", keywords: ["strength", "refuge", "help", "trouble", "god"] },
  { reference: "2 Corinthians 12:9", text: "He has said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Most gladly therefore I will rather glory in my weaknesses, that the power of Christ may rest on me.", keywords: ["strength", "grace", "weakness", "power", "sufficient", "perfect"] },
  { reference: "Ephesians 6:10", text: "Finally, be strong in the Lord, and in the strength of his might.", keywords: ["strength", "strong", "lord", "power", "might"] },
  // Fear
  { reference: "Isaiah 41:10", text: "Don't be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.", keywords: ["fear", "afraid", "strength", "help", "god", "courage"] },
  { reference: "2 Timothy 1:7", text: "For God didn't give us a spirit of fear, but of power, love, and self-control.", keywords: ["fear", "afraid", "power", "love", "spirit", "self-control", "courage"] },
  { reference: "Psalm 23:4", text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.", keywords: ["fear", "death", "comfort", "shepherd", "evil", "valley"] },
  { reference: "Deuteronomy 31:6", text: "Be strong and courageous. Don't be afraid or scared of them; for Yahweh your God himself is who goes with you. He will not fail you nor forsake you.", keywords: ["fear", "courage", "strong", "forsake", "god", "afraid"] },
  // Prayer
  { reference: "Matthew 6:9-13", text: "Pray like this: 'Our Father in heaven, may your name be kept holy. Let your Kingdom come. Let your will be done on earth as it is in heaven. Give us today our daily bread. Forgive us our debts, as we also forgive our debtors. Bring us not into temptation, but deliver us from the evil one.'", keywords: ["prayer", "lord's prayer", "father", "kingdom", "forgive", "heaven", "daily"] },
  { reference: "1 Thessalonians 5:16-18", text: "Rejoice always. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.", keywords: ["prayer", "pray", "rejoice", "joy", "thanks", "thanksgiving", "will"] },
  { reference: "James 5:16", text: "Confess your offenses to one another, and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.", keywords: ["prayer", "pray", "healing", "confess", "righteous", "effective"] },
  { reference: "Mark 11:24", text: "Therefore I tell you, all things whatever you pray and ask for, believe that you have received them, and you shall have them.", keywords: ["prayer", "pray", "ask", "believe", "receive", "faith"] },
  // Salvation
  { reference: "Romans 10:9", text: "That if you will confess with your mouth that Jesus is Lord, and believe in your heart that God raised him from the dead, you will be saved.", keywords: ["salvation", "saved", "confess", "believe", "jesus", "lord", "resurrection"] },
  { reference: "Ephesians 2:8-9", text: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God, not of works, that no one would boast.", keywords: ["salvation", "saved", "grace", "faith", "gift", "works"] },
  { reference: "Acts 4:12", text: "There is salvation in no one else, for there is no other name under heaven that is given among men, by which we must be saved!", keywords: ["salvation", "saved", "jesus", "name", "heaven"] },
  // Grace
  { reference: "Romans 5:8", text: "But God commends his own love toward us, in that while we were yet sinners, Christ died for us.", keywords: ["grace", "love", "sin", "sinner", "christ", "died", "sacrifice"] },
  { reference: "1 Peter 5:10", text: "But may the God of all grace, who called you to his eternal glory by Christ Jesus, after you have suffered a little while, restore, establish, strengthen, and settle you.", keywords: ["grace", "glory", "eternal", "strength", "restore", "suffer"] },
  { reference: "Titus 2:11", text: "For the grace of God has appeared, bringing salvation to all men.", keywords: ["grace", "salvation", "god", "appear"] },
  // Forgiveness
  { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.", keywords: ["forgiveness", "forgive", "confess", "sin", "cleanse", "faithful"] },
  { reference: "Ephesians 4:32", text: "And be kind to one another, tender-hearted, forgiving each other, just as God also in Christ forgave you.", keywords: ["forgiveness", "forgive", "kind", "tender", "heart", "compassion"] },
  { reference: "Colossians 3:13", text: "bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.", keywords: ["forgiveness", "forgive", "bear", "complaint"] },
  { reference: "Psalm 103:12", text: "As far as the east is from the west, so far has he removed our transgressions from us.", keywords: ["forgiveness", "sin", "transgression", "remove", "mercy"] },
  // Wisdom
  { reference: "James 1:5", text: "But if any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach; and it will be given to him.", keywords: ["wisdom", "ask", "god", "give", "knowledge", "prayer"] },
  { reference: "Proverbs 3:5-6", text: "Trust in Yahweh with all your heart, and don't lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.", keywords: ["wisdom", "trust", "heart", "path", "understand", "acknowledge", "guide"] },
  { reference: "Proverbs 9:10", text: "The fear of Yahweh is the beginning of wisdom. The knowledge of the Holy One is understanding.", keywords: ["wisdom", "fear", "knowledge", "holy", "begin"] },
  // Courage
  { reference: "Joshua 1:9", text: "Haven't I commanded you? Be strong and courageous. Don't be afraid. Don't be dismayed, for Yahweh your God is with you wherever you go.", keywords: ["courage", "strong", "afraid", "fear", "god", "dismayed"] },
  { reference: "Psalm 27:1", text: "Yahweh is my light and my salvation. Whom shall I fear? Yahweh is the strength of my life. Of whom shall I be afraid?", keywords: ["courage", "fear", "afraid", "light", "salvation", "strength"] },
  // Joy
  { reference: "Psalm 16:11", text: "You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.", keywords: ["joy", "life", "presence", "pleasure", "eternal", "path"] },
  { reference: "Nehemiah 8:10", text: "Then he said to them, 'Go your way. Eat the fat, drink the sweet, and send portions to him for whom nothing is prepared; for today is holy to our Lord. Don't be grieved; for the joy of Yahweh is your strength.'", keywords: ["joy", "strength", "holy", "lord", "strength"] },
  { reference: "John 15:11", text: "I have spoken these things to you, that my joy may remain in you, and that your joy may be made full.", keywords: ["joy", "full", "remain", "jesus", "complete"] },
  { reference: "Philippians 4:4", text: "Rejoice in the Lord always! Again I will say, rejoice!", keywords: ["joy", "rejoice", "lord", "always", "praise"] },
  // Trust
  { reference: "Psalm 37:5", text: "Commit your way to Yahweh. Trust also in him, and he will do this.", keywords: ["trust", "commit", "way", "god", "lord"] },
  { reference: "Psalm 56:3-4", text: "When I am afraid, I will put my trust in you. In God, I praise his word. In God, I put my trust. I will not be afraid. What can flesh do to me?", keywords: ["trust", "afraid", "fear", "praise", "word"] },
  { reference: "Psalm 9:10", text: "Those who know your name will put their trust in you, for you, Yahweh, have not forsaken those who seek you.", keywords: ["trust", "name", "seek", "forsake", "know", "god"] },
  // Healing
  { reference: "Psalm 30:2", text: "Yahweh my God, I cried to you, and you have healed me.", keywords: ["healing", "heal", "prayer", "cry", "god"] },
  { reference: "Isaiah 53:5", text: "But he was pierced for our transgressions. He was crushed for our iniquities. The punishment that brought our peace was on him; and by his wounds we are healed.", keywords: ["healing", "heal", "peace", "sin", "wound", "transgression", "jesus"] },
  { reference: "Jeremiah 17:14", text: "Heal me, O Yahweh, and I will be healed. Save me, and I will be saved; for you are my praise.", keywords: ["healing", "heal", "save", "salvation", "praise"] },
  // Anxiety / Worry
  { reference: "1 Peter 5:7", text: "Casting all your worries on him, because he cares for you.", keywords: ["anxiety", "worry", "anxious", "care", "cast", "burden"] },
  { reference: "Matthew 6:25-27", text: "Therefore I tell you, don't be anxious for your life: what you will eat, or what you will drink; nor yet for your body, what you will wear. Isn't life more than food, and the body more than clothing? See the birds of the sky, that they don't sow, neither do they reap, nor gather into barns. Your heavenly Father feeds them. Aren't you of much more value than they? Which of you, by being anxious, can add one moment to his lifespan?", keywords: ["anxiety", "worry", "anxious", "life", "food", "bird", "trust", "fear"] },
  // Comfort
  { reference: "2 Corinthians 1:3-4", text: "Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, who comforts us in all our affliction, that we may be able to comfort those who are in any affliction, through the comfort with which we ourselves are comforted by God.", keywords: ["comfort", "affliction", "mercy", "blessing", "god"] },
  { reference: "Matthew 11:28-29", text: "Come to me, all you who labor and are heavily burdened, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and humble in heart; and you will find rest for your souls.", keywords: ["comfort", "rest", "burden", "labor", "soul", "gentle", "humble", "weary"] },
  { reference: "Revelation 21:4", text: "He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain, any more. The first things have passed away.", keywords: ["comfort", "heaven", "death", "pain", "cry", "mourning", "eternal", "hope"] },
  // Scripture / Word
  { reference: "2 Timothy 3:16-17", text: "Every Scripture is God-breathed and profitable for teaching, for reproof, for correction, and for instruction in righteousness, that each person who belongs to God may be complete, thoroughly equipped for every good work.", keywords: ["bible", "scripture", "word", "god", "teach", "truth", "equip"] },
  { reference: "Psalm 119:105", text: "Your word is a lamp to my feet, and a light for my path.", keywords: ["bible", "scripture", "word", "light", "path", "guide", "lamp"] },
  { reference: "Hebrews 4:12", text: "For the word of God is living and active, and sharper than any two-edged sword, piercing even to the dividing of soul and spirit, of both joints and marrow, and is able to discern the thoughts and intentions of the heart.", keywords: ["bible", "scripture", "word", "living", "sharp", "sword", "truth"] },
  // Blessing
  { reference: "Numbers 6:24-26", text: "Yahweh bless you, and keep you. Yahweh make his face shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace.", keywords: ["blessing", "bless", "peace", "grace", "face", "god"] },
  { reference: "Ephesians 1:3", text: "Blessed be the God and Father of our Lord Jesus Christ, who has blessed us with every spiritual blessing in the heavenly places in Christ.", keywords: ["blessing", "bless", "spiritual", "heaven", "christ", "god"] },
  { reference: "Matthew 5:3", text: "Blessed are the poor in spirit, for theirs is the Kingdom of Heaven.", keywords: ["blessing", "bless", "spirit", "kingdom", "heaven", "beatitude"] },
  // Resurrection / Easter
  { reference: "John 11:25-26", text: "Jesus said to her, 'I am the resurrection and the life. He who believes in me will still live, even if he dies. Whoever lives and believes in me will never die. Do you believe this?'", keywords: ["resurrection", "easter", "life", "death", "believe", "eternal", "jesus"] },
  { reference: "1 Corinthians 15:55-57", text: "Death, where is your sting? Hades, where is your victory? The sting of death is sin, and the power of sin is the law. But thanks be to God, who gives us the victory through our Lord Jesus Christ!", keywords: ["resurrection", "easter", "death", "victory", "sin", "christ", "jesus"] },
  // Shepherd
  { reference: "Psalm 23:1-3", text: "Yahweh is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He guides me in the paths of righteousness for his name's sake.", keywords: ["shepherd", "sheep", "guide", "rest", "restore", "soul", "path", "peace", "psalm 23"] },
];

// ── Translation labels ─────────────────────────────────────────────────────────

const TRANSLATIONS: { value: Translation; label: string }[] = [
  { value: "web", label: "WEB" },
  { value: "kjv", label: "KJV" },
  { value: "asv", label: "ASV" },
];

// ── Keyword search helpers ─────────────────────────────────────────────────────

function searchKeyword(query: string): LocalVerse[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/);

  const scored = VERSE_DATA.map((v) => {
    const kws = v.keywords;
    let score = 0;
    for (const term of terms) {
      for (const kw of kws) {
        if (kw === term) score += 3;
        else if (kw.includes(term) || term.includes(kw)) score += 1;
      }
    }
    return { verse: v, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((s) => s.verse);
}

// Simple heuristic: does the query look like a Bible reference?
function looksLikeReference(q: string) {
  return /^[1-3]?\s*[a-z]+\s+\d+:\d+/i.test(q.trim());
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BibleSearchPage() {
  const [mode, setMode] = useState<SearchMode>("reference");
  const [query, setQuery] = useState("");
  const [translation, setTranslation] = useState<Translation>("web");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refResult, setRefResult] = useState<ApiVerse | null>(null);
  const [kwResults, setKwResults] = useState<LocalVerse[] | null>(null);

  function clearResults() {
    setRefResult(null);
    setKwResults(null);
    setError("");
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    clearResults();

    if (mode === "reference") {
      setLoading(true);
      try {
        const url = `https://bible-api.com/${encodeURIComponent(q)}?translation=${translation}`;
        const res = await fetch(url);
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(body || `Could not find "${q}". Check the reference and try again.`);
        }
        const data: ApiVerse = await res.json();
        if (!data.text) throw new Error(`No text found for "${q}".`);
        setRefResult(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      const results = searchKeyword(q);
      if (results.length === 0) {
        setError(`No verses found for "${q}". Try words like peace, love, faith, hope, or strength.`);
      } else {
        setKwResults(results);
      }
    }
  }

  const hasResults = refResult !== null || (kwResults !== null && kwResults.length > 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
      <header className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
          <BookOpen size={13} />
          Scripture Lookup
        </div>
        <h1 className="text-3xl font-bold text-white md:text-4xl">Bible Search</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Look up any verse by reference (e.g.{" "}
          <button
            type="button"
            className="underline decoration-white/30 hover:decoration-white/70"
            onClick={() => { setMode("reference"); setQuery("John 3:16"); }}
          >
            John 3:16
          </button>
          {" "}or{" "}
          <button
            type="button"
            className="underline decoration-white/30 hover:decoration-white/70"
            onClick={() => { setMode("reference"); setQuery("Psalm 23"); }}
          >
            Psalm 23
          </button>
          ) or search by keyword (e.g.{" "}
          <button
            type="button"
            className="underline decoration-white/30 hover:decoration-white/70"
            onClick={() => { setMode("keyword"); setQuery("peace"); }}
          >
            peace
          </button>
          {" "}or{" "}
          <button
            type="button"
            className="underline decoration-white/30 hover:decoration-white/70"
            onClick={() => { setMode("keyword"); setQuery("strength"); }}
          >
            strength
          </button>
          ).
        </p>
      </header>

      {/* Search card */}
      <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl md:p-8">

        {/* Mode toggle */}
        <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
          {(["reference", "keyword"] as SearchMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); clearResults(); }}
              className={[
                "flex-1 rounded-lg py-2 text-sm font-semibold transition",
                mode === m
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              {m === "reference" ? "By Reference" : "By Keyword"}
            </button>
          ))}
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              {mode === "reference" ? "Bible Reference" : "Keyword or Theme"}
            </label>
            <div className="relative mt-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  mode === "reference"
                    ? "e.g. John 3:16, Romans 8:28, Psalm 23:1-3"
                    : "e.g. peace, faith, hope, strength, forgiveness"
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-10 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); clearResults(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {mode === "reference" && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Translation</label>
              <div className="mt-2 flex gap-2">
                {TRANSLATIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTranslation(t.value)}
                    className={[
                      "rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                      translation === t.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Searching...</>
            ) : (
              <><Search size={16} /> Search Scripture</>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Reference result */}
        {refResult && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {refResult.translation_name}
            </div>
            <div className="mb-3 text-base font-bold text-slate-900">{refResult.reference}</div>
            <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">{refResult.text.trim()}</p>
          </div>
        )}

        {/* Keyword results */}
        {kwResults && kwResults.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 text-sm font-semibold text-slate-700">
              {kwResults.length} verse{kwResults.length !== 1 ? "s" : ""} found
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {kwResults.map((v) => (
                <div
                  key={v.reference}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-2 text-xs font-bold text-purple-700">{v.reference}</div>
                  <p className="text-sm leading-6 text-slate-700">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular searches */}
      {!hasResults && !error && (
        <div className="mt-8">
          <div className="mb-3 text-sm font-semibold text-white/70">Popular searches</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "John 3:16", mode: "reference" as SearchMode, q: "John 3:16" },
              { label: "Psalm 23", mode: "reference" as SearchMode, q: "Psalm 23" },
              { label: "Romans 8:28", mode: "reference" as SearchMode, q: "Romans 8:28" },
              { label: "Philippians 4:13", mode: "reference" as SearchMode, q: "Philippians 4:13" },
              { label: "Jeremiah 29:11", mode: "reference" as SearchMode, q: "Jeremiah 29:11" },
              { label: "peace", mode: "keyword" as SearchMode, q: "peace" },
              { label: "strength", mode: "keyword" as SearchMode, q: "strength" },
              { label: "love", mode: "keyword" as SearchMode, q: "love" },
              { label: "hope", mode: "keyword" as SearchMode, q: "hope" },
              { label: "faith", mode: "keyword" as SearchMode, q: "faith" },
              { label: "anxiety", mode: "keyword" as SearchMode, q: "anxiety" },
              { label: "healing", mode: "keyword" as SearchMode, q: "healing" },
            ].map(({ label, mode: m, q }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setMode(m); setQuery(q); }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
