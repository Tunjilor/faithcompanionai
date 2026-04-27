// src/app/blog/content.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  publishDate: string; // ISO date "YYYY-MM-DD" — post is hidden until this date
  readTime: string;
  keywords: string[];
  description: string;
  body: ReactNode;
};

/**
 * Returns true when today's date (UTC) is on or after the post's publishDate.
 * Compares ISO date strings directly — no timezone ambiguity for date-only scheduling.
 */
export function isPublished(post: BlogPost): boolean {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  return post.publishDate <= today;
}

/** All posts that are published as of right now, sorted newest first. */
export function getPublishedPosts(): BlogPost[] {
  return POSTS.filter(isPublished).sort(
    (a, b) => b.publishDate.localeCompare(a.publishDate)
  );
}

// ── Shared prose classes ─────────────────────────────────────────────────────
const h2 = "mt-8 text-2xl font-bold text-white md:text-3xl";
const h3 = "mt-6 text-xl font-bold text-white";
const p  = "mt-4 text-sm leading-7 text-white/75 md:text-base";
const li = "text-sm leading-7 text-white/75 md:text-base";
const ul = "mt-4 space-y-2 pl-4 list-disc marker:text-orange-400";
const ol = "mt-4 space-y-2 pl-4 list-decimal marker:text-orange-400";
const blockquote = "mt-4 border-l-4 border-orange-400 pl-4 italic text-sm text-white/65 leading-7";
const card = "mt-4 rounded-2xl border border-white/10 bg-white/5 p-5";
const qaQ = "font-semibold text-white text-sm";
const qaA = "mt-1 text-sm text-white/70 leading-6";
const cta = "mt-8 rounded-[24px] border border-white/10 bg-white/5 p-6 text-center";

// ── Post 1 ───────────────────────────────────────────────────────────────────
const post1Body: ReactNode = (
  <article>
    <p className={p}>
      Whether you're hosting a church trivia night, studying with your family, or just testing your own
      Scripture knowledge, Bible quiz questions are one of the most engaging ways to grow in faith.
      Below you'll find 60 curated Bible quiz questions and answers across six categories — from easy
      questions for beginners to harder ones that will challenge even seasoned believers.
    </p>

    <h2 className={h2}>General Bible Knowledge (Easy)</h2>
    <p className={p}>These are great starting questions for any age group or mixed-knowledge audience.</p>
    <div className="mt-4 space-y-4">
      {[
        ["How many books are in the Bible?", "66 (39 Old Testament, 27 New Testament)"],
        ["What is the shortest verse in the Bible?", '"Jesus wept." — John 11:35'],
        ["Who built the ark?", "Noah (Genesis 6–7)"],
        ["In what city was Jesus born?", "Bethlehem (Luke 2:4–7)"],
        ["Who baptized Jesus?", "John the Baptist (Matthew 3:13–17)"],
        ["What was Jesus's first miracle?", "Turning water into wine at Cana (John 2:1–11)"],
        ["How many disciples did Jesus choose?", "12 (Luke 6:12–16)"],
        ["Who denied Jesus three times?", "Peter (Luke 22:54–62)"],
        ["What is the last book of the Bible?", "Revelation"],
        ["Who was swallowed by a great fish?", "Jonah (Jonah 1:17)"],
      ].map(([q, a], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>Q{i + 1}. {q}</div>
          <div className={qaA}>A: {a}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Old Testament Questions (Medium)</h2>
    <div className="mt-4 space-y-4">
      {[
        ["Who was the first king of Israel?", "Saul (1 Samuel 10:1)"],
        ["Which Psalm begins with 'The Lord is my shepherd'?", "Psalm 23"],
        ["How many days did it rain during Noah's flood?", "40 days and 40 nights (Genesis 7:12)"],
        ["Who climbed a sycamore tree to see Jesus?", "Zacchaeus (Luke 19:1–4)"],
        ["Which woman hid Israelite spies in Jericho?", "Rahab (Joshua 2)"],
        ["Who wrote most of the Psalms?", "King David (73 of 150 Psalms)"],
        ["What sign did God give Noah after the flood?", "A rainbow (Genesis 9:13)"],
        ["Who was sold into slavery by his brothers?", "Joseph (Genesis 37:28)"],
        ["What did God give Moses on Mount Sinai?", "The Ten Commandments (Exodus 20)"],
        ["Which prophet was taken up to heaven in a chariot of fire?", "Elijah (2 Kings 2:11)"],
      ].map(([q, a], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>Q{i + 11}. {q}</div>
          <div className={qaA}>A: {a}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>New Testament Questions (Medium)</h2>
    <div className="mt-4 space-y-4">
      {[
        ["Who wrote most of the New Testament letters?", "The Apostle Paul (13 letters)"],
        ["What are the four Gospels?", "Matthew, Mark, Luke, and John"],
        ["Who was the first to see the risen Jesus?", "Mary Magdalene (John 20:14–16)"],
        ["What did Jesus call the two greatest commandments?", "Love God and love your neighbor (Matthew 22:37–39)"],
        ["Which disciple walked on water with Jesus?", "Peter (Matthew 14:28–29)"],
        ["What miracle fed 5,000 people?", "Jesus multiplied 5 loaves and 2 fish (John 6:1–14)"],
        ["Who was struck blind on the road to Damascus?", "Saul (later Paul) (Acts 9:1–9)"],
        ["What is the fruit of the Spirit?", "Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control (Galatians 5:22–23)"],
        ["Who asked Pilate for Jesus' body?", "Joseph of Arimathea (John 19:38)"],
        ["What gift did the Holy Spirit give at Pentecost?", "The ability to speak in other tongues (Acts 2:1–4)"],
      ].map(([q, a], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>Q{i + 21}. {q}</div>
          <div className={qaA}>A: {a}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Women of the Bible (Medium)</h2>
    <div className="mt-4 space-y-4">
      {[
        ["Who said 'Where you go I will go'?", "Ruth, to her mother-in-law Naomi (Ruth 1:16)"],
        ["Which woman was a judge who led Israel to victory?", "Deborah (Judges 4–5)"],
        ["Who became queen of Persia and saved the Jewish people?", "Esther (Esther 7)"],
        ["Which woman was the first to see the risen Jesus?", "Mary Magdalene (John 20:14–16)"],
        ["Who prayed fervently for a child and received Samuel?", "Hannah (1 Samuel 1)"],
        ["Which prophetess led Israel in song after the Red Sea crossing?", "Miriam (Exodus 15:20–21)"],
        ["Who sold purple cloth and was Paul's first European convert?", "Lydia (Acts 16:14–15)"],
        ["Which woman betrayed Samson to his enemies?", "Delilah (Judges 16:19)"],
        ["Who was the wife of Abraham and mother of Isaac?", "Sarah (Genesis 21:2–3)"],
        ["Which woman anointed Jesus' feet with expensive perfume?", "Mary of Bethany (John 12:3)"],
      ].map(([q, a], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>Q{i + 31}. {q}</div>
          <div className={qaA}>A: {a}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Parables of Jesus (Hard)</h2>
    <div className="mt-4 space-y-4">
      {[
        ["In the Prodigal Son, what did the father give the returning son?", "A robe, ring, sandals, and a feast (Luke 15:22–23)"],
        ["In the Parable of the Sower, what happened to seed on rocky ground?", "It sprouted but withered because it had no root (Matthew 13:5–6)"],
        ["In the Ten Virgins, why were five called foolish?", "They brought no extra oil for their lamps (Matthew 25:3)"],
        ["In the Talents, what did the one-talent servant do?", "He buried it in the ground out of fear (Matthew 25:18)"],
        ["What is the Parable of the Mustard Seed about?", "The kingdom of heaven starting small and growing large (Matthew 13:31–32)"],
        ["In the Good Samaritan, who finally helped the wounded man?", "A Samaritan — considered an outsider by Jews (Luke 10:33)"],
        ["In the Rich Man and Lazarus, where did Lazarus go after death?", "To Abraham's side (paradise) (Luke 16:22)"],
        ["In the Lost Sheep, what does the shepherd do with the found sheep?", "Carries it on his shoulders and calls friends to celebrate (Luke 15:5–6)"],
        ["What is the Parable of the Unforgiving Servant about?", "A man forgiven a huge debt who refused to forgive a small one (Matthew 18:23–35)"],
        ["In the Sheep and the Goats, what separates them?", "How they treated the poor, hungry, and imprisoned (Matthew 25:31–46)"],
      ].map(([q, a], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>Q{i + 41}. {q}</div>
          <div className={qaA}>A: {a}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Theology and Church History (Hard)</h2>
    <div className="mt-4 space-y-4">
      {[
        ["What does 'justification by faith' mean?", "Being declared righteous by God through faith in Christ, not by works (Romans 3:28)"],
        ["What is the Hypostatic Union?", "The doctrine that Jesus is fully God and fully human in one person (Council of Chalcedon, 451 AD)"],
        ["Who nailed the 95 Theses to the Wittenberg church door?", "Martin Luther in 1517, sparking the Protestant Reformation"],
        ["What did the Council of Nicaea (325 AD) address?", "The nature of Christ — affirming he is fully divine (against Arianism)"],
        ["What is sanctification?", "The ongoing process of being made holy and transformed into Christlikeness (2 Corinthians 3:18)"],
        ["Who translated the Bible into Latin (the Vulgate)?", "Jerome, at the request of Pope Damasus I"],
        ["What does 'sola scriptura' mean?", "Scripture alone is the final authority for faith and practice (Reformation principle)"],
        ["What is the Great Commission?", "Jesus' command to make disciples of all nations (Matthew 28:19–20)"],
        ["When was the Great Schism between East and West?", "1054 AD, dividing into Roman Catholic and Eastern Orthodox churches"],
        ["Who founded the Methodist movement?", "John Wesley in 18th-century England"],
      ].map(([q, a], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>Q{i + 51}. {q}</div>
          <div className={qaA}>A: {a}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>How to Use These Bible Quiz Questions</h2>
    <p className={p}>
      These Bible quiz questions and answers work well in many settings. Here are some of the most
      popular ways people use them:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Church trivia nights</strong> — organize by category and use as team rounds</li>
      <li className={li}><strong>Family devotional time</strong> — pick 5 questions per night, discuss the answers together</li>
      <li className={li}><strong>Sunday school classes</strong> — mix easy and medium questions for mixed-age groups</li>
      <li className={li}><strong>Personal Bible study</strong> — test your own knowledge and look up the passages you miss</li>
      <li className={li}><strong>Youth group games</strong> — split into teams and use harder questions for tie-breakers</li>
    </ul>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Take an interactive Bible quiz</div>
      <p className="mt-2 text-sm text-white/65">
        Faith Companion AI includes a live Bible quiz with 6 categories, shareable scores, and a leaderboard.
        Free to play — no account required.
      </p>
      <Link
        href="/biblequiz"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Take the Bible Quiz →
      </Link>
    </div>
  </article>
);

// ── Post 2 ───────────────────────────────────────────────────────────────────
const post2Body: ReactNode = (
  <article>
    <p className={p}>
      Many people want to pray but don't know where to start. Maybe you feel like your words are not
      good enough, or you're not sure of the right format. The good news is that there is no perfect
      formula for prayer. God cares about your heart, not the poetry of your words. This guide walks
      you through a simple, Scripture-grounded method for writing and speaking a personal prayer.
    </p>

    <div className={blockquote}>
      "Do not be anxious about anything, but in every situation, by prayer and petition, with
      thanksgiving, present your requests to God." — Philippians 4:6
    </div>

    <h2 className={h2}>What Is a Personal Prayer?</h2>
    <p className={p}>
      A personal prayer is a direct, honest conversation with God about your own life, needs, feelings,
      and gratitude. Unlike liturgical prayers (written prayers from a tradition), personal prayers come
      from your own experience and words. They can be spoken aloud, whispered, or written in a journal.
      They can be long or short — from a one-sentence cry for help to a structured 20-minute reflection.
    </p>
    <p className={p}>
      The Bible is full of examples of personal prayers: David's raw honesty in the Psalms, Hannah's
      weeping prayer for a child (1 Samuel 1:10–11), and even Jesus' prayer in Gethsemane — "Not my
      will, but yours be done" (Luke 22:42). Every one of these was deeply personal.
    </p>

    <h2 className={h2}>The ACTS Method: A Simple Framework</h2>
    <p className={p}>
      One of the most widely taught frameworks for personal prayer is the ACTS method. It gives
      structure without being rigid, and it ensures your prayer covers the full range of what prayer
      is meant to be.
    </p>

    <h3 className={h3}>A — Adoration</h3>
    <p className={p}>
      Begin by praising God for who he is — not for what he does, but for his character. This shifts
      your focus from your problems to God's greatness.
    </p>
    <div className={blockquote}>
      Example: "Lord, you are holy and faithful. You are the God who does not change, who keeps every
      promise. I worship you simply because you are God."
    </div>

    <h3 className={h3}>C — Confession</h3>
    <p className={p}>
      Bring your failures, sins, and shortcomings honestly before God. This is not to earn forgiveness
      (you already have it in Christ) but to keep your relationship with God honest and uncluttered.
    </p>
    <div className={blockquote}>
      Example: "Father, I confess that I have been anxious this week instead of trusting you. I have
      said words that were unkind. Forgive me and help me to do better."
    </div>

    <h3 className={h3}>T — Thanksgiving</h3>
    <p className={p}>
      Thank God specifically for things in your life — big and small. Research consistently shows that
      gratitude shifts mental and emotional state. In prayer, it also reorients your perspective.
    </p>
    <div className={blockquote}>
      Example: "Thank you for another morning. Thank you for the people in my life who love me. Thank
      you for your Word, which gives me direction when I feel lost."
    </div>

    <h3 className={h3}>S — Supplication</h3>
    <p className={p}>
      Now bring your specific requests. Be honest and specific. Pray for yourself, for the people you
      love, and for situations beyond your control.
    </p>
    <div className={blockquote}>
      Example: "Lord, I need wisdom for this decision at work. Please give my friend strength as she
      goes through this illness. And help me to trust you even when I can't see what you're doing."
    </div>

    <h2 className={h2}>Step-by-Step Guide to Writing a Personal Prayer</h2>
    <ol className={ol}>
      <li className={li}><strong>Choose a quiet space and time.</strong> Prayer doesn't require silence, but for beginners, removing distractions helps. Morning, evening, or lunch — pick what works for your rhythm.</li>
      <li className={li}><strong>Start with a simple opening.</strong> "Lord," "Father," "God," or "Heavenly Father" — any is fine. You're starting a conversation, not writing a legal document.</li>
      <li className={li}><strong>Praise before you request.</strong> Even one sentence of worship shifts the tone of the whole prayer. Try starting with something God has done or a quality you admire in him.</li>
      <li className={li}><strong>Be specific, not vague.</strong> "Help me" is fine, but "Help me find peace about this job decision by the end of this week" is more honest and more connected to your real situation.</li>
      <li className={li}><strong>Use Scripture in your prayer.</strong> You can pray Bible verses directly. "Lord, your Word says you work all things together for good (Romans 8:28). I'm trusting that even this situation is in your hands."</li>
      <li className={li}><strong>Include others.</strong> Praying for others (intercession) expands your heart and aligns your desires with God's.</li>
      <li className={li}><strong>Close with trust.</strong> End your prayer by releasing the outcome to God. "Your will be done" is one of the most powerful prayer closings in Scripture.</li>
    </ol>

    <h2 className={h2}>Common Types of Personal Prayers</h2>
    <ul className={ul}>
      <li className={li}><strong>Morning prayer</strong> — a brief prayer of surrender and focus before your day begins</li>
      <li className={li}><strong>Prayer of gratitude</strong> — deliberately thanking God for specific blessings</li>
      <li className={li}><strong>Prayer for guidance</strong> — asking for wisdom in a decision or direction in life</li>
      <li className={li}><strong>Prayer of lament</strong> — expressing grief, confusion, or pain honestly to God</li>
      <li className={li}><strong>Intercessory prayer</strong> — praying on behalf of someone else's needs</li>
      <li className={li}><strong>Prayer of surrender</strong> — releasing a situation or outcome fully to God's will</li>
    </ul>

    <h2 className={h2}>A Complete Example: Personal Prayer for Anxiety</h2>
    <div className={card}>
      <p className="text-sm italic leading-7 text-white/75">
        "Heavenly Father, I come to you today carrying a weight of worry that I haven't been able to
        shake. You know the situation I'm facing — you know it better than I do. Your Word tells me
        not to be anxious, but to bring my requests to you with thanksgiving (Philippians 4:6). So I
        am doing that now.
        <br /><br />
        Thank you that you are in control, even when everything around me feels uncertain. Thank you
        for the people in my life who love me, and for another day to seek you.
        <br /><br />
        I confess that I have let fear lead me more than faith this week. Forgive me, and help me
        to choose trust.
        <br /><br />
        Lord, I need your peace that passes understanding (Philippians 4:7) — the kind that doesn't
        make logical sense but settles my heart anyway. Guard my mind and heart today. Help me to
        take the next step in front of me, not the ten steps I can't see yet.
        <br /><br />
        Not my will, but yours be done. Amen."
      </p>
    </div>

    <h2 className={h2}>Should Prayers Be Long or Short?</h2>
    <p className={p}>
      Jesus himself warned against prayers that are long for the sake of sounding impressive: "When
      you pray, do not keep on babbling like pagans, for they think they will be heard because of their
      many words" (Matthew 6:7). A sincere two-sentence prayer is worth more than a long performance.
    </p>
    <p className={p}>
      That said, spending extended time in prayer — what Christians call "the prayer closet" — can
      deepen your relationship with God significantly. The goal is quality of connection, not quantity
      of words.
    </p>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Generate a personal prayer instantly</div>
      <p className="mt-2 text-sm text-white/65">
        Faith Companion AI can generate a Scripture-grounded prayer tailored to your exact situation — any
        topic, any tone. Free to try, no account required.
      </p>
      <Link
        href="/tools/prayer"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Write a Prayer →
      </Link>
    </div>
  </article>
);

// ── Post 3 ───────────────────────────────────────────────────────────────────
const post3Body: ReactNode = (
  <article>
    <p className={p}>
      A daily devotional is one of the simplest and most powerful spiritual habits you can build.
      It doesn't require hours of time or years of Bible study experience. If you're just getting started
      — or restarting after a long gap — this guide will walk you through what a devotional is, how to
      structure one, and how to make it a consistent part of your day.
    </p>

    <h2 className={h2}>What Is a Daily Devotional?</h2>
    <p className={p}>
      A daily devotional is a short, intentional time set aside to read Scripture, reflect on it, and
      respond in prayer. The word "devotional" comes from "devotion" — it's an act of dedicating time
      specifically to God. Most devotionals last between 10 and 30 minutes, though some people spend
      much longer.
    </p>
    <p className={p}>
      Devotionals are distinct from Bible study, which tends to be more academic and in-depth. A
      devotional is meant to be personal and practical — connecting Scripture to your everyday life
      rather than analyzing it for its own sake.
    </p>

    <div className={blockquote}>
      "Your word is a lamp for my feet, a light on my path." — Psalm 119:105
    </div>

    <h2 className={h2}>Why Start a Daily Devotional?</h2>
    <p className={p}>
      The benefits of consistent devotional practice are well-documented — both spiritually and
      psychologically. Here's what regular devotional time tends to produce over time:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Reduced anxiety</strong> — Scripture and prayer consistently lower stress hormones and shift focus away from worry</li>
      <li className={li}><strong>Increased clarity</strong> — spending quiet time in reflection before the day begins helps with decision-making and focus</li>
      <li className={li}><strong>Deeper faith</strong> — consistent exposure to Scripture builds a framework for understanding life's challenges</li>
      <li className={li}><strong>Stronger relationships</strong> — people who pray regularly tend to extend more grace to others</li>
      <li className={li}><strong>A sense of rhythm</strong> — devotionals provide a daily anchor that grounds the rest of your routine</li>
    </ul>

    <h2 className={h2}>The Basic Structure of a Devotional</h2>
    <p className={p}>
      There is no single required format for a devotional. But most effective devotionals follow a
      pattern with four parts:
    </p>

    <h3 className={h3}>1. Stillness (1–2 minutes)</h3>
    <p className={p}>
      Before you open your Bible or read anything, take a moment to be quiet. Put your phone face-down.
      Take a few slow breaths. The goal is to shift your mind from the noise of your day into a
      receptive, present state. Psalm 46:10 says "Be still, and know that I am God." This isn't wasted
      time — it makes everything that follows more effective.
    </p>

    <h3 className={h3}>2. Scripture Reading (5–10 minutes)</h3>
    <p className={p}>
      Read a passage of Scripture. For beginners, a few approaches work well:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Start with the Gospels</strong> — Matthew, Mark, Luke, or John. These are the most direct accounts of Jesus' life and teaching.</li>
      <li className={li}><strong>Use a reading plan</strong> — many apps and websites offer structured reading plans that guide you through the Bible in a year or at your own pace.</li>
      <li className={li}><strong>Start with Psalms and Proverbs</strong> — both books speak directly to daily life, emotion, and wisdom.</li>
      <li className={li}><strong>Follow a theme</strong> — pick a topic like peace, gratitude, or courage, and read verses related to it.</li>
    </ul>

    <h3 className={h3}>3. Reflection (5–10 minutes)</h3>
    <p className={p}>
      After reading, ask yourself three questions about the passage:
    </p>
    <ol className={ol}>
      <li className={li}><strong>What does this say about God?</strong> — his character, his actions, his promises</li>
      <li className={li}><strong>What does this say about me?</strong> — how does it challenge, encourage, or correct me?</li>
      <li className={li}><strong>What is one thing I can do differently today?</strong> — a practical response to what you've read</li>
    </ol>
    <p className={p}>
      Writing your reflections in a journal significantly increases retention and makes the practice
      feel more personal. You don't need to write much — even two or three sentences is valuable.
    </p>

    <h3 className={h3}>4. Prayer (3–5 minutes)</h3>
    <p className={p}>
      Close your devotional with prayer. Use what you read to inform what you pray. If you read about
      God's faithfulness, thank him for a specific way he has been faithful in your life. If you read
      about forgiveness, confess something you've been holding onto. The devotional and the prayer
      should connect.
    </p>

    <h2 className={h2}>When Should You Do Your Devotional?</h2>
    <p className={p}>
      The best time for a devotional is the time you can actually keep consistently. Here's how
      different times of day work for different people:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Morning</strong> — most commonly recommended; sets the tone for the day before distractions begin. Even 10 minutes before checking your phone makes a measurable difference.</li>
      <li className={li}><strong>Lunchtime</strong> — a good reset point. Works well for people who can't manage mornings and need a midday anchor.</li>
      <li className={li}><strong>Evening</strong> — helps with reflection on the day and sleep quality. Works best for those who wind down slowly.</li>
    </ul>
    <p className={p}>
      Consistency matters more than timing. A devotional you do at 9pm every night beats one you
      theoretically plan to do at 6am but skip most days.
    </p>

    <h2 className={h2}>Beginner's First Week: A Sample Plan</h2>
    <div className="mt-4 space-y-3">
      {[
        ["Day 1", "Read Psalm 23. Reflect: What does it mean that God is your shepherd? Pray: thank God for one way he has provided for you."],
        ["Day 2", "Read Matthew 5:1–12 (the Beatitudes). Reflect: Which beatitude speaks to where you are right now? Pray about it honestly."],
        ["Day 3", "Read Proverbs 3:5–6. Reflect: Where are you leaning on your own understanding instead of trusting God? Pray for guidance in one area."],
        ["Day 4", "Read John 15:1–11 (the vine and branches). Reflect: What does 'abiding in Christ' look like in your daily routine? Pray to stay connected."],
        ["Day 5", "Read Romans 8:28–39. Reflect: What situation in your life do you need to believe this passage about? Pray over it."],
        ["Day 6", "Read James 1:2–5. Reflect: Is there a current trial that God might be using to grow you? Pray for perspective and wisdom."],
        ["Day 7", "Review the week. What themes came up? What felt most alive or challenging? Write three things you're grateful for and pray a simple prayer of thanksgiving."],
      ].map(([day, plan], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{day}</div>
          <div className={qaA}>{plan}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Tips to Make Your Devotional Stick</h2>
    <ul className={ul}>
      <li className={li}><strong>Keep it short at first.</strong> Ten consistent minutes beats forty inconsistent ones. Build the habit before adding length.</li>
      <li className={li}><strong>Use the same spot.</strong> A physical location — a chair, a desk, a corner of your bedroom — creates a mental anchor for the practice.</li>
      <li className={li}><strong>Don't let perfect be the enemy of good.</strong> If you miss a day, start again the next day. Guilt about missed devotionals is not spiritually productive.</li>
      <li className={li}><strong>Tell someone.</strong> Accountability partners improve habit formation dramatically. Even texting a friend "had my devotional this morning" makes a difference.</li>
      <li className={li}><strong>Use a devotional guide if you need direction.</strong> Structured guides remove the decision fatigue of "what do I read today?"</li>
    </ul>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Generate a daily devotional in seconds</div>
      <p className="mt-2 text-sm text-white/65">
        Faith Companion AI creates personalized devotionals with Scripture, reflection, prayer, and
        action steps — tailored to your topic and situation. Free to try.
      </p>
      <Link
        href="/tools/devotional"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Get a Devotional →
      </Link>
    </div>
  </article>
);

// ── Post 4 ───────────────────────────────────────────────────────────────────
const post4Body: ReactNode = (
  <article>
    <p className={p}>
      Sometimes you don&apos;t need more information — you need the <em>right</em> word at the right
      time. The Bible speaks to every season of life, but finding the verse that truly connects to
      your situation can feel overwhelming. Here is a simple approach that works.
    </p>

    <h2 className={h2}>Start With Where You Are</h2>
    <p className={p}>
      Instead of searching randomly, begin with honesty. The most effective way to find a verse
      that lands is to name exactly what you are feeling or facing before you search.
    </p>
    <ul className={ul}>
      <li className={li}>Are you feeling anxious or overwhelmed?</li>
      <li className={li}>Are you waiting for direction and feeling stuck?</li>
      <li className={li}>Are you struggling with forgiveness — of someone else, or yourself?</li>
      <li className={li}>Are you grieving, doubting, or quietly losing hope?</li>
    </ul>
    <p className={p}>
      God meets you where you are — not where you think you should be. Naming it honestly is the
      first step to finding a word that actually speaks to it.
    </p>

    <h2 className={h2}>Look for Themes, Not Just Keywords</h2>
    <p className={p}>
      A common mistake is searching for exact phrases — &ldquo;Bible verse about anxiety&rdquo; or
      &ldquo;verse about waiting.&rdquo; These searches often return the same five popular verses
      regardless of your specific situation. Instead, think in broader themes:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Peace</strong> — not just the absence of worry, but the presence of God in the storm</li>
      <li className={li}><strong>Strength</strong> — particularly when you feel like you have none left</li>
      <li className={li}><strong>Hope</strong> — for when the future feels closed off or uncertain</li>
      <li className={li}><strong>Guidance</strong> — for decisions, crossroads, and moments of confusion</li>
      <li className={li}><strong>Comfort</strong> — for grief, loss, and the kind of pain that is hard to name</li>
    </ul>
    <p className={p}>
      Scripture often speaks in deeper ways than simple keyword matching. A passage about God leading
      Israel through the wilderness may say more about your career uncertainty than a verse with
      &ldquo;work&rdquo; in it.
    </p>

    <h2 className={h2}>Sit With the Verse</h2>
    <p className={p}>
      When you find a verse that resonates, resist the urge to immediately move on. The habit of
      collecting verses without absorbing them is one of the main reasons Scripture feels distant
      rather than alive.
    </p>
    <ul className={ul}>
      <li className={li}><strong>Read it slowly</strong> — read it once for words, once for meaning, once for application</li>
      <li className={li}><strong>Read the surrounding passage</strong> — context almost always deepens the meaning</li>
      <li className={li}><strong>Reflect before responding</strong> — ask: <em>What is God showing me here?</em></li>
      <li className={li}><strong>Write it down</strong> — copying a verse by hand significantly increases how deeply it sticks</li>
    </ul>

    <h2 className={h2}>Match the Verse to Your Specific Situation</h2>
    <p className={p}>
      There is a difference between a verse that is generally encouraging and a verse that speaks
      directly to <em>your</em> situation. Here are some examples of how to match more precisely:
    </p>
    <div className="mt-4 space-y-4">
      {[
        ["Anxious about a decision", "Proverbs 3:5–6 — lean not on your own understanding"],
        ["Feeling forgotten or unseen", "Isaiah 49:15–16 — God has engraved you on his hands"],
        ["Exhausted and depleted", "Isaiah 40:31 — those who hope in the Lord renew their strength"],
        ["Struggling to forgive", "Colossians 3:13 — forgive as the Lord forgave you"],
        ["Grieving a loss", "Psalm 34:18 — the Lord is close to the brokenhearted"],
        ["Afraid of what is coming", "2 Timothy 1:7 — God has not given us a spirit of fear"],
      ].map(([situation, verse], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{situation}</div>
          <div className={qaA}>{verse}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>A Simpler Way to Find the Right Verse</h2>
    <p className={p}>
      If you are not sure where to start, or you have tried searching and keep landing on the same
      generic results, a guided tool can help bridge the gap between what you are experiencing and
      the Scripture that speaks to it.
    </p>
    <p className={p}>
      Faith Companion AI&apos;s verse tool asks you what you are going through — and then finds
      Scripture matched to your specific situation, not a general topic. You describe your moment;
      it finds the word for it.
    </p>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Find a verse for your situation</div>
      <p className="mt-2 text-sm text-white/65">
        Describe what you are going through and receive a Scripture passage that speaks directly
        to it — with reflection and context. Free to try, no account required.
      </p>
      <Link
        href="/tools/verse"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Find My Verse →
      </Link>
    </div>

    <h2 className={h2}>Final Thought</h2>
    <p className={p}>
      You don&apos;t need to search endlessly. The Bible is not a catalogue to be exhausted — it
      is a living word that meets you in specific moments. Start with where you are, look for the
      theme beneath the feeling, and give the verse space to land.
    </p>
    <p className={p}>
      Sometimes the right verse is not far away. It just needs to be revealed.
    </p>
  </article>
);

// ── Post 5 ───────────────────────────────────────────────────────────────────
const post5Body: ReactNode = (
  <article>
    <p className={p}>
      Anxiety often comes from trying to control what we cannot. The mind races through every
      possible outcome, rehearsing problems that haven&apos;t happened yet and replaying ones that
      already have. Scripture gently, consistently reminds us that we were never meant to carry
      everything on our own.
    </p>

    <h2 className={h2}>Scripture</h2>
    <div className={blockquote}>
      &ldquo;Cast all your anxiety on Him because He cares for you.&rdquo; — 1 Peter 5:7
    </div>
    <p className={p}>
      The word &ldquo;cast&rdquo; is deliberate. It is not passive — it is an active transfer.
      You pick it up, and you throw it toward God. Not because He is obligated to take it, but
      because He <em>cares for you</em> — personally, specifically, right now.
    </p>

    <h2 className={h2}>Reflection</h2>
    <p className={p}>
      What are you holding onto today that you were never meant to carry?
    </p>
    <p className={p}>
      Anxiety and overthinking are often symptoms of something deeper: the belief that if we
      stop monitoring the situation, something will go wrong. That if we relax our grip, things
      will fall apart. God&apos;s invitation in 1 Peter 5:7 is a direct challenge to that belief.
      He says: you can let go, because I have it.
    </p>
    <p className={p}>
      This doesn&apos;t mean the situation goes away. It means you are no longer carrying it
      alone. God invites you to release it — not all at once, but step by step, moment by moment,
      as often as it returns to your hands.
    </p>

    <h2 className={h2}>Prayer</h2>
    <div className={card}>
      <p className="text-sm italic leading-7 text-white/75">
        Lord, I bring my anxious thoughts to You — the worries I&apos;ve been turning over in
        my mind, the fears I&apos;ve been rehearsing, the outcomes I&apos;ve been trying to
        control.
        <br /><br />
        I confess that I have been carrying what was meant for Your hands. Help me to release
        it — not just once, but every time it comes back. Remind me that Your care for me is
        not general or distant, but personal and present.
        <br /><br />
        Where my mind runs ahead into tomorrow&apos;s problems, bring me back to today. Where
        I reach for control, help me choose trust instead. Give me the peace that comes not
        from resolved circumstances, but from a settled heart.
        <br /><br />
        Amen.
      </p>
    </div>

    <h2 className={h2}>Action Step</h2>
    <p className={p}>
      Take one specific thing that is weighing on you today — not a category of worry, but one
      actual thing — and consciously release it in prayer. Name it out loud if you can. Hand it
      to God specifically, and notice what shifts when you do.
    </p>
    <p className={p}>
      If it comes back (and it likely will), repeat the transfer. The practice of repeatedly
      releasing the same worry is not a sign of weak faith — it is faithfulness in action.
    </p>

    <h2 className={h2}>Going Deeper</h2>
    <p className={p}>
      Anxiety takes many forms. Some days it is a quiet undercurrent; other days it crowds out
      everything else. A devotional built around your specific situation — not a general one, but
      one that knows what you are carrying — can help you find the right Scripture, the right
      prayer, and the right action step for today.
    </p>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Get a devotional for what you&apos;re carrying today</div>
      <p className="mt-2 text-sm text-white/65">
        Describe your situation and receive a personalized devotional with Scripture, reflection,
        a prayer, and one action step. Free to try — no account required.
      </p>
      <Link
        href="/tools/devotional"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Get My Devotional →
      </Link>
    </div>

    <h2 className={h2}>Final Thought</h2>
    <p className={p}>
      Peace doesn&apos;t come from having all the answers. It doesn&apos;t come from the worry
      resolving, the situation improving, or the uncertainty disappearing.
    </p>
    <p className={p}>
      It comes from trusting the One who already holds what you cannot.
    </p>
  </article>
);

// ── Post 6 ───────────────────────────────────────────────────────────────────
const post6Body: ReactNode = (
  <article>
    <p className={p}>
      Many people want to pray more — but struggle to stay consistent. They start well, miss a
      few days, feel guilty, and quietly give up. Then the cycle repeats. The problem is rarely
      a lack of desire. It is a lack of a system simple enough to survive a hard week.
    </p>
    <p className={p}>
      The key to a daily prayer habit is not more discipline. It is more simplicity.
    </p>

    <h2 className={h2}>Start Smaller Than You Think You Need To</h2>
    <p className={p}>
      The biggest mistake people make when building a prayer habit is starting too ambitiously.
      They commit to thirty minutes every morning, miss two days in a row, and conclude that
      they are not &ldquo;the kind of person&rdquo; who prays consistently. They were never going
      to maintain thirty minutes — not at the start.
    </p>
    <p className={p}>
      A sustainable prayer habit begins small enough to be almost embarrassing:
    </p>
    <ul className={ul}>
      <li className={li}><strong>One minute</strong> — that is all. Set a timer if you need to.</li>
      <li className={li}><strong>One honest sentence</strong> — &ldquo;God, I am tired and I need help today.&rdquo; That is a real prayer.</li>
      <li className={li}><strong>One moment of connection</strong> — presence matters more than performance.</li>
    </ul>
    <p className={p}>
      Once the habit exists — once you are showing up every day — you can expand it naturally.
      You cannot expand a habit that has not yet formed. Build the streak first. Length comes later.
    </p>

    <h2 className={h2}>Attach Prayer to Something You Already Do</h2>
    <p className={p}>
      Habits form most reliably when they are &ldquo;stacked&rdquo; onto existing routines. If you
      try to add prayer as a free-floating commitment with no anchor, it is easy to forget or
      deprioritise. If you attach it to something you already do every day, it becomes automatic.
    </p>
    <div className="mt-4 space-y-3">
      {[
        ["Waking up", "Before you check your phone, say one sentence to God. It takes ten seconds and frames the entire morning."],
        ["Before eating", "A brief prayer of gratitude before a meal is one of the oldest Christian traditions — and one of the most sustainable."],
        ["Before sleeping", "A short prayer reviewing the day — what you are grateful for, what you struggled with, what you are releasing — takes two minutes and improves sleep quality."],
        ["During a commute", "If you drive or walk anywhere regularly, that time can become consistent prayer time. No extra minutes required."],
        ["With your coffee or tea", "Physical ritual plus spiritual ritual. The warm drink becomes the trigger."],
      ].map(([anchor, note], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{anchor}</div>
          <div className={qaA}>{note}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Be Honest — Not Impressive</h2>
    <p className={p}>
      One of the most common reasons people feel disconnected in prayer is that they are
      performing rather than conversing. They use language they would never use normally, try to
      say the right things in the right order, and end up feeling like they are reading a script
      rather than talking to someone who knows them.
    </p>
    <p className={p}>
      Prayer is not about perfect words. The Psalms are full of anger, confusion, grief, and
      doubt — all directed at God, all considered Scripture. Jesus described prayer as going to
      your room, closing the door, and talking to your Father in private (Matthew 6:6). The image
      is intimate and honest, not formal and polished.
    </p>
    <div className={blockquote}>
      &ldquo;The Lord is near to all who call on him, to all who call on him in truth.&rdquo; — Psalm 145:18
    </div>
    <p className={p}>
      &ldquo;In truth&rdquo; means honestly — as you actually are, not as you think you should
      be. That is what God draws near to.
    </p>

    <h2 className={h2}>Handle the Gap When You Miss a Day</h2>
    <p className={p}>
      You will miss a day. That is not a failure — it is part of building any habit. What matters
      is what you do next. The single most important rule for habit recovery:
    </p>
    <p className={p}>
      <strong>Never miss twice in a row.</strong>
    </p>
    <p className={p}>
      One missed day is a pause. Two missed days is the beginning of stopping. When you miss,
      do not compound it with guilt — just show up the next day with something small. The habit
      is not broken until you decide it is.
    </p>

    <h2 className={h2}>Use Structure When You Need It</h2>
    <p className={p}>
      Some days you know what to pray about. Other days you sit down and your mind goes blank,
      or you feel so overwhelmed that you cannot find the words. For those days, structure helps.
    </p>
    <p className={p}>
      A simple framework many people find useful is ACTS — Adoration, Confession, Thanksgiving,
      Supplication. You don&apos;t need to cover all four every time. Even one section gives your
      prayer shape when shapelessness is the problem.
    </p>
    <p className={p}>
      You can also use a tool to help find the words — especially when you are praying about a
      specific situation and are not sure how to express it.
    </p>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Generate a prayer for your situation</div>
      <p className="mt-2 text-sm text-white/65">
        Describe what you are going through and receive a personal, Scripture-grounded prayer in
        seconds — honest in tone, specific to your situation. Free to try, no account required.
      </p>
      <Link
        href="/tools/prayer"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Write a Prayer →
      </Link>
    </div>

    <h2 className={h2}>Final Thought</h2>
    <p className={p}>
      Consistency grows from simplicity. The prayer habit that sustains you for years will
      probably not look like the one you imagined when you started — grand and long and perfectly
      structured. It will look like a small, honest, repeated practice that you kept showing up
      to even when it felt like nothing.
    </p>
    <p className={p}>
      Start small. Attach it to something real. Be honest. Miss a day and come back. Let it grow
      at its own pace. That is how a habit becomes a foundation.
    </p>
  </article>
);

// ── Post 7 ───────────────────────────────────────────────────────────────────
const post7Body: ReactNode = (
  <article>
    <p className={p}>
      Feeling lost is disorienting — but it is not a failure. Many of the most significant
      moments in Scripture begin with someone who did not know where they were going. Abraham
      left without knowing his destination. Moses spent forty years in the wilderness before his
      calling became clear. The disciples were scattered and confused before they were sent.
    </p>
    <p className={p}>
      Feeling directionless is often not the end of God&apos;s work in you. It is frequently
      the beginning of the next part.
    </p>

    <h2 className={h2}>Scripture</h2>
    <div className={blockquote}>
      &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo; — Psalm 119:105
    </div>
    <p className={p}>
      Notice what the psalmist does not say. He does not say God is a floodlight illuminating
      the entire road ahead. He says a lamp — enough light for the next step, and the one after
      that. This is the normal experience of following God: not a clear view of the destination,
      but sufficient light for the immediate step.
    </p>
    <p className={p}>
      When you feel lost, the question is rarely &ldquo;What is my whole future?&rdquo;
      It is: &ldquo;What is the next faithful step I can take today?&rdquo;
    </p>

    <h2 className={h2}>More Verses for Seasons of Uncertainty</h2>
    <div className="mt-4 space-y-4">
      {[
        ["Proverbs 3:5–6", "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."],
        ["Isaiah 30:21", "Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, 'This is the way; walk in it.'"],
        ["Jeremiah 29:11", "\"For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.\""],
        ["James 1:5", "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."],
        ["Psalm 37:23–24", "The Lord makes firm the steps of the one who delights in him; though he may stumble, he will not fall, for the Lord upholds him with his hand."],
      ].map(([ref, text], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{ref}</div>
          <div className={qaA}>&ldquo;{text}&rdquo;</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Reflection</h2>
    <p className={p}>
      God does not always reveal the whole path — and this is not withholding. It is an
      invitation to trust. A map with every detail given upfront requires no faith. A lamp that
      lights the next step requires you to keep walking toward the One holding it.
    </p>
    <p className={p}>
      What are you waiting to know before you take the next step? Is it possible that step is
      already clearer than you are admitting — and that what you are really waiting for is
      certainty about the one after that?
    </p>

    <h2 className={h2}>What To Do When You Feel Directionless</h2>
    <ul className={ul}>
      <li className={li}><strong>Pause</strong> — stop trying to force clarity through more thinking. Stillness often precedes direction (Psalm 46:10).</li>
      <li className={li}><strong>Pray honestly</strong> — tell God exactly where you are. Not a polished version, but the real one: &ldquo;I don&apos;t know where I&apos;m going and I need help.&rdquo;</li>
      <li className={li}><strong>Read slowly</strong> — sit with one passage rather than scanning many. Let it settle rather than searching for a quick answer.</li>
      <li className={li}><strong>Take one step</strong> — pick the most faithful thing you can do today and do it. Direction often comes through movement, not waiting.</li>
      <li className={li}><strong>Talk to someone</strong> — isolation amplifies confusion. A trusted friend, mentor, or pastor can offer perspective that feels impossible to find alone.</li>
    </ul>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Find a verse for where you are right now</div>
      <p className="mt-2 text-sm text-white/65">
        Describe your situation and receive a Scripture passage matched to it — with reflection
        and context for your specific season. Free to try, no account required.
      </p>
      <Link
        href="/tools/verse"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Find My Verse →
      </Link>
    </div>

    <h2 className={h2}>Final Thought</h2>
    <p className={p}>
      Direction does not come all at once. It rarely arrives as a clear vision of the whole
      journey — more often it comes as a quiet sense of the next right thing, confirmed as you
      move toward it.
    </p>
    <p className={p}>
      You are not lost in a way that is beyond God&apos;s ability to orient you. The lamp is
      still on. Take the next step toward it.
    </p>
  </article>
);

// ── Post 8 ───────────────────────────────────────────────────────────────────
const post8Body: ReactNode = (
  <article>
    <p className={p}>
      Most people expect God&apos;s guidance to arrive dramatically — a burning bush, an audible
      voice, an unmistakable sign. When it doesn&apos;t, they conclude either that God is not
      speaking, or that they are somehow unable to hear Him. Neither is usually true.
    </p>
    <p className={p}>
      God&apos;s guidance is often quiet. It arrives in small impressions, gentle convictions,
      and the slow accumulation of clarity over time. Learning to recognise it is less about
      developing a special spiritual gift and more about cultivating a particular kind of
      attention.
    </p>

    <h2 className={h2}>The Four Primary Ways God Guides</h2>
    <p className={p}>
      While God can guide in any way He chooses, most believers across centuries of Christian
      tradition have identified four consistent channels:
    </p>

    <div className="mt-4 space-y-4">
      {[
        [
          "Scripture",
          "The most reliable source of guidance. Not just verses that confirm what you already want to do, but the sustained reading of Scripture that shapes how you think about everything. Hebrews 4:12 calls it living and active — it is not a static reference book but a living word that speaks into present situations.",
        ],
        [
          "Inner peace (or the absence of it)",
          "Colossians 3:15 says to let the peace of Christ act as an umpire in your heart. The presence of deep, persistent peace — even in a difficult or counterintuitive direction — is often a sign of alignment. The persistent absence of peace, especially about a decision you are trying to force, is worth paying attention to.",
        ],
        [
          "Wise counsel",
          "Proverbs 15:22 says plans fail for lack of counsel, but with many advisors they succeed. God regularly speaks through other people — particularly those who know you well, love you honestly, and have no stake in your decision. Be cautious of counsel that only ever confirms what you already want.",
        ],
        [
          "Circumstances",
          "Open and closed doors are not always guidance — sometimes a closed door is worth knocking on again. But the pattern of circumstances over time, read alongside Scripture and prayer, often points in a direction worth noticing.",
        ],
      ].map(([channel, explanation], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{channel}</div>
          <div className={qaA}>{explanation}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Why We Miss It</h2>
    <p className={p}>
      The most common reason people struggle to hear God&apos;s guidance is not spiritual
      deficiency — it is noise and pace. Modern life runs fast and loud, and quiet impressions
      are easily drowned out by the volume of everything else competing for attention.
    </p>
    <ul className={ul}>
      <li className={li}><strong>We are moving too fast</strong> — guidance that arrives as a quiet impression requires enough stillness to notice it</li>
      <li className={li}><strong>We are looking for the wrong thing</strong> — expecting a dramatic sign while missing the quiet, consistent nudge</li>
      <li className={li}><strong>We are already decided</strong> — seeking guidance while hoping for confirmation of a decision already made is not listening; it is lobbying</li>
      <li className={li}><strong>We are not in Scripture</strong> — God&apos;s voice is most consistently heard by people who are regularly in His Word</li>
    </ul>

    <h2 className={h2}>How to Practise Listening</h2>
    <p className={p}>
      Hearing God is less a one-time event than a cultivated practice. Here is what that
      looks like practically:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Slow down deliberately</strong> — build even five minutes of silence into your day. Psalm 46:10: &ldquo;Be still, and know that I am God.&rdquo;</li>
      <li className={li}><strong>Read Scripture expectantly</strong> — approach it asking &ldquo;What does God want to say to me today?&rdquo; rather than just completing a reading plan</li>
      <li className={li}><strong>Pray with open hands</strong> — come to God without a pre-decided outcome, genuinely willing to hear something unexpected</li>
      <li className={li}><strong>Write it down</strong> — impressions you journal have a way of becoming clearer over time; patterns emerge that single moments do not reveal</li>
      <li className={li}><strong>Test what you hear</strong> — genuine guidance from God will not contradict Scripture, will not require you to harm others, and will often be confirmed through more than one channel</li>
    </ul>

    <h2 className={h2}>What Guidance Usually Feels Like</h2>
    <p className={p}>
      People often describe genuine divine guidance as arriving with:
    </p>
    <ul className={ul}>
      <li className={li}>A persistent, quiet sense rather than a loud, urgent feeling</li>
      <li className={li}>Peace that does not depend on the outcome being easy or comfortable</li>
      <li className={li}>Consistency — it does not change dramatically day to day based on mood</li>
      <li className={li}>Confirmation from more than one source over time</li>
      <li className={li}>A direction that serves others, not just yourself</li>
    </ul>
    <p className={p}>
      Urgency and pressure are more often signs of anxiety than guidance. God rarely rushes.
    </p>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Reflect with a personalized devotional</div>
      <p className="mt-2 text-sm text-white/65">
        If you are seeking guidance on something specific, a devotional tailored to your situation
        can help you slow down, hear Scripture speak, and take a clear next step.
      </p>
      <Link
        href="/tools/devotional"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Get a Devotional →
      </Link>
    </div>

    <h2 className={h2}>Final Thought</h2>
    <p className={p}>
      God is speaking — through His Word, through the peace that settles or the restlessness
      that signals, through the people around you, and through the pattern of your circumstances.
      The question is rarely whether He is speaking. It is whether we are slow enough, and
      still enough, to hear it.
    </p>
    <p className={p}>
      Slow down. Create the space. The guidance is often closer than you think.
    </p>
  </article>
);

// ── Post 9 ───────────────────────────────────────────────────────────────────
const post9Body: ReactNode = (
  <article>
    <p className={p}>
      Spiritual growth does not require complexity. It does not require an hour a day, a
      structured reading plan, a prayer journal with colour-coded tabs, or any particular level
      of biblical knowledge. What it requires is consistency — small, repeated contact with God
      over time, compounding quietly in the background of your life.
    </p>
    <p className={p}>
      The people who grow most in faith over the long run are rarely those who had the most
      intense seasons. They are those who showed up in the ordinary ones.
    </p>

    <h2 className={h2}>The Core of a Daily Spiritual Routine</h2>
    <p className={p}>
      Strip it down to three elements. These can be done in five minutes or extended to thirty.
      The length matters less than the practice.
    </p>
    <div className="mt-4 space-y-4">
      {[
        [
          "Read one verse",
          "Not a chapter, not a passage — one verse. Read it slowly. Read it again. Let a single thought from Scripture be the anchor for your day. This is not about volume. It is about contact.",
        ],
        [
          "Reflect for one minute",
          "Ask one question about what you just read: What does this tell me about God, about myself, or about today? You do not need a profound answer. You need the habit of asking.",
        ],
        [
          "Pray briefly",
          "One honest sentence is enough. \"God, I need help today.\" \"Thank you for this morning.\" \"I don't know what I'm doing — please guide me.\" Prayer is a relationship, not a performance. It does not need length to be real.",
        ],
      ].map(([step, explanation], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{i + 1}. {step}</div>
          <div className={qaA}>{explanation}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Why Simplicity Works</h2>
    <p className={p}>
      Complex routines fail because they are hard to maintain when life gets hard — and life
      always gets hard. A routine that requires thirty minutes of undisturbed silence collapses
      the moment you have a difficult week, a sick child, a stressful season at work, or travel.
    </p>
    <p className={p}>
      A routine that requires five minutes does not. It survives bad mornings. It survives
      travel. It survives the seasons where nothing feels spiritual. And because it survives,
      it compounds.
    </p>
    <div className={blockquote}>
      &ldquo;Let us not become weary in doing good, for at the proper time we will reap a harvest
      if we do not give up.&rdquo; — Galatians 6:9
    </div>

    <h2 className={h2}>Build the Routine Around Your Life</h2>
    <p className={p}>
      The best spiritual routine is the one you will actually do. A few practical anchors that
      work for most people:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Morning</strong> — before the noise of the day begins. Even before coffee if possible. Sets the tone for everything that follows.</li>
      <li className={li}><strong>Midday pause</strong> — a brief reset between the morning and afternoon. Good for a single verse and a one-line prayer.</li>
      <li className={li}><strong>Before sleep</strong> — a review of the day: one thing you are grateful for, one thing you are releasing, a short prayer. Ends the day with God rather than a phone.</li>
    </ul>
    <p className={p}>
      You do not need all three. Pick the one that fits your natural rhythm and do it every day
      before adding others.
    </p>

    <h2 className={h2}>What to Do When It Feels Empty</h2>
    <p className={p}>
      Some days your routine will feel alive. Most days it will feel ordinary. Some days it will
      feel like nothing at all. This is normal — and it is not a sign that the practice is not
      working.
    </p>
    <p className={p}>
      Spiritual growth is not primarily felt in the moment of the devotional. It is felt weeks
      and months later, when you respond to something differently, handle pressure with more
      steadiness, or find that your instinct is now more patient than it used to be. The
      fruit comes slowly. The practice comes daily.
    </p>
    <ul className={ul}>
      <li className={li}>On dry days, shorten the routine rather than skip it — maintain the contact, even if it is minimal</li>
      <li className={li}>Do not evaluate the quality of your quiet time by how you felt during it</li>
      <li className={li}>Return the next day regardless of how the last one felt</li>
    </ul>

    <h2 className={h2}>Expanding the Routine Over Time</h2>
    <p className={p}>
      Once the basic habit is stable — once it has survived a few hard weeks and you are still
      showing up — you can expand it naturally. Add a second verse. Extend the prayer. Start
      a brief journal. Read a chapter instead of a single verse. The expansion should feel like
      a natural overflow, not a new obligation.
    </p>
    <p className={p}>
      The goal is not to build an impressive spiritual practice. It is to build an honest,
      consistent one. Those are not the same thing.
    </p>

    <div className={cta}>
      <div className="text-lg font-bold text-white">Start your routine today</div>
      <p className="mt-2 text-sm text-white/65">
        A personalized devotional is a simple way to begin — Scripture, reflection, a short
        prayer, and one action step, tailored to your situation. Takes five minutes. Free to try.
      </p>
      <Link
        href="/tools/devotional"
        className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
      >
        Get a Devotional →
      </Link>
    </div>

    <h2 className={h2}>Final Thought</h2>
    <p className={p}>
      Consistency matters more than intensity. One verse, one minute of reflection, one honest
      prayer — every day — will do more for your spiritual life than an occasional hour-long
      session followed by weeks of nothing.
    </p>
    <p className={p}>
      Start small. Start today. Keep showing up.
    </p>
  </article>
);

// ── Post 10 ──────────────────────────────────────────────────────────────────
const post10Body: ReactNode = (
  <article>
    <p className={p}>
      A personal devotional practice is one of the most quietly powerful things a person can
      build. It doesn&apos;t require special equipment, a perfect schedule, or years of theological
      training. It requires a few minutes, a willing heart, and the decision to show up
      consistently — even imperfectly.
    </p>
    <p className={p}>
      If you&apos;ve tried before and stopped, that&apos;s normal. Most people start too big, miss a day,
      and conclude they&apos;re not disciplined enough. The problem is almost never discipline. It&apos;s
      almost always the size of the commitment they made.
    </p>

    <h2 className={h2}>What Is a Personal Devotional?</h2>
    <p className={p}>
      A devotional is a brief, intentional time set aside to connect with God through Scripture,
      reflection, and prayer. It&apos;s different from a church service, a Bible study group, or
      reading theology. It&apos;s private. It&apos;s personal. And it&apos;s yours.
    </p>
    <p className={p}>
      The word &ldquo;devotional&rdquo; comes from &ldquo;devotion&rdquo; — a word that implies loyalty and
      attention. That&apos;s the heart of it. Not a performance or a checklist, but a daily
      turning of your attention toward God.
    </p>
    <div className={blockquote}>
      &ldquo;But when you pray, go into your room, close the door and pray to your Father, who is
      unseen. Then your Father, who sees what is done in secret, will reward you.&rdquo; — Matthew 6:6
    </div>

    <h2 className={h2}>Choose a Format That Fits Your Life</h2>
    <p className={p}>
      There is no single correct format. The best devotional is the one you will actually do.
      Here are four simple approaches — start with whichever feels most natural.
    </p>
    <div className="mt-4 space-y-4">
      {[
        [
          "Read + Reflect",
          "Read one passage or verse slowly. Ask: What is God saying here? What does this tell me about my day? Write a sentence if you want, or just sit with the thought. Five minutes is enough.",
        ],
        [
          "Guided Devotional",
          "Use a daily devotional resource — a written one, an app, or an AI-generated devotional tailored to your situation. Good for people who find a blank page intimidating. The structure does the heavy lifting.",
        ],
        [
          "Prayer Journal",
          "Write your prayers rather than speaking them. Many people find this deepens honesty. Start with gratitude, move to requests, end with listening — a minute of silence for whatever comes to mind.",
        ],
        [
          "Scripture Memory",
          "Choose one verse per week to memorise. Read it each morning, write it by hand, recite it before sleep. Over a year, 52 verses become a reservoir you carry with you everywhere.",
        ],
      ].map(([format, desc], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{format}</div>
          <div className={qaA}>{desc}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>How to Start — Practically</h2>
    <p className={p}>
      Don&apos;t begin by finding the perfect time or buying the perfect journal. Begin today with
      what you have. Here is the simplest possible starting point:
    </p>
    <ol className={ol}>
      <li className={li}>Pick a time slot — morning works best for most people, but any consistent time is fine.</li>
      <li className={li}>Read one verse. Psalm 23, John 3:16, or whatever comes to mind. Volume doesn&apos;t matter yet.</li>
      <li className={li}>Pray one honest sentence. It can be as simple as &ldquo;God, I&apos;m here. Help me today.&rdquo;</li>
      <li className={li}>Do it again tomorrow. That&apos;s the whole practice in its first week.</li>
    </ol>
    <p className={p}>
      After two weeks of consistency, you can add: a second verse, a brief journal entry, or
      a specific prayer topic. But not before. Build the habit first, then build on the habit.
    </p>

    <h2 className={h2}>What to Do When It&apos;s Hard to Start</h2>
    <p className={p}>
      Every devotional practice hits dry stretches. There will be mornings when you sit down
      and feel nothing — no inspiration, no connection, no particular sense that anything is
      happening. This is not failure. It is the ordinary texture of a long-term spiritual practice.
    </p>
    <ul className={ul}>
      <li className={li}><strong>Lower the bar temporarily.</strong> If five minutes feels impossible, do one minute. Read a single verse and say amen. Done is better than perfect.</li>
      <li className={li}><strong>Change the format.</strong> If reading feels stale, try praying out loud. If silence feels empty, try writing. Variety within structure is healthy.</li>
      <li className={li}><strong>Return without guilt.</strong> If you miss a day — or a week — come back without ceremony. God doesn&apos;t require an explanation. Just begin again.</li>
      <li className={li}><strong>Tell God how you feel.</strong> &ldquo;I don&apos;t feel like doing this&rdquo; is a perfectly honest prayer. Honesty is always better than performance.</li>
    </ul>
    <div className={blockquote}>
      &ldquo;The Lord is near to all who call on him, to all who call on him in truth.&rdquo; — Psalm 145:18
    </div>

    <h2 className={h2}>Making It Last</h2>
    <p className={p}>
      The devotional practices that last are the ones attached to existing habits. Pair your
      devotional with something you already do every day — morning coffee, breakfast, your
      commute, or the first ten minutes at your desk. The existing habit becomes a trigger that
      carries the new one.
    </p>
    <p className={p}>
      Over time, the practice becomes less about discipline and more about desire. You will
      start to miss it on the days you skip. That shift — from obligation to longing — is one
      of the quiet signs of genuine spiritual growth.
    </p>

    <div className={cta}>
      <p className="text-base font-bold text-white">Ready to begin your devotional practice?</p>
      <p className="mt-2 text-sm text-white/65">
        Generate a personalised devotional in seconds — tailored to your situation, grounded in Scripture.
      </p>
      <a
        href="/tools/devotional"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
      >
        Start My Devotional Today
      </a>
    </div>
  </article>
);

// ── Post 11 ──────────────────────────────────────────────────────────────────
const post11Body: ReactNode = (
  <article>
    <p className={p}>
      There are seasons when faith feels solid — when prayer comes easily, Scripture speaks
      clearly, and God feels close. And there are seasons when it does not. When prayer feels
      like talking to a wall, the Bible feels flat, and the certainty you once had seems to
      have quietly slipped away.
    </p>
    <p className={p}>
      If you are in that second kind of season, this is for you. And the first thing to say
      is this: weak faith is still faith. A flickering candle is still light. Bringing a
      struggling, honest, half-believing prayer to God is not a failure — it is exactly what
      faith looks like in hard seasons.
    </p>

    <h2 className={h2}>You Are Not the First</h2>
    <p className={p}>
      The people in Scripture whose faith we most admire were not strangers to doubt, distance,
      and weariness. Their honesty is part of what makes their stories worth reading.
    </p>
    <div className="mt-4 space-y-4">
      {[
        [
          "David — Psalm 22:1",
          "\"My God, my God, why have you forsaken me?\" David felt abandoned. He said so directly to God. He did not perform confidence he did not have. And he kept praying.",
        ],
        [
          "Elijah — 1 Kings 19:4",
          "After his greatest victory, Elijah collapsed under a tree and asked God to let him die. God's response was not rebuke — it was food, rest, and a gentle voice.",
        ],
        [
          "Thomas — John 20:25",
          "\"Unless I see... I will not believe.\" Jesus did not exclude Thomas for his doubt. He showed up for him specifically. Doubt did not disqualify him from the story.",
        ],
        [
          "The father in Mark 9:24",
          "\"I do believe; help me overcome my unbelief.\" This is one of the most honest prayers in the Bible. Jesus did not ask for more faith first. He answered as-is.",
        ],
      ].map(([person, desc], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{person}</div>
          <div className={qaA}>{desc}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Why Faith Weakens — Common Causes</h2>
    <p className={p}>
      Understanding why faith weakens can take some of the shame out of it. It is rarely a
      character flaw. It is usually one of these:
    </p>
    <ul className={ul}>
      <li className={li}><strong>Exhaustion.</strong> Spiritual dryness often tracks physical and emotional depletion. The soul gets tired. Rest is not unspiritual — it is sometimes the most faithful thing you can do.</li>
      <li className={li}><strong>Unanswered prayer.</strong> When you asked and nothing came, or something came that you did not ask for, trust erodes. This is honest. It deserves honest engagement, not cheerful deflection.</li>
      <li className={li}><strong>Grief or loss.</strong> Loss reorders everything, including how God feels. The silence after loss is one of the most disorienting spiritual experiences there is.</li>
      <li className={li}><strong>Disconnection from practice.</strong> Faith is not purely intellectual. When the habits that feed it — prayer, Scripture, community — fade, the sense of God's presence often fades with them. Not because God has moved, but because the channels of connection have narrowed.</li>
      <li className={li}><strong>Intellectual questions.</strong> Sometimes doubts about what you believe arise. This is normal adult faith development. Doubt that is brought honestly into conversation with God is different from doubt that is suppressed or avoided.</li>
    </ul>

    <h2 className={h2}>What to Do When Faith Feels Distant</h2>
    <p className={p}>
      There is no formula that makes weak faith instantly strong. But there are practices that
      create the conditions for faith to recover — slowly, quietly, and more solidly than before.
    </p>
    <div className="mt-4 space-y-4">
      {[
        [
          "Bring it to God as it is",
          "Don't wait until you feel more faith to pray. Bring the weakness itself. \"God, I don't feel close to you right now, and I don't know why. I'm here anyway.\" That prayer is already an act of faith.",
        ],
        [
          "Return to small practices",
          "Don't try to recover your faith all at once. Read one Psalm. Pray one sentence. Light one candle if that helps. The goal is not spiritual intensity — it's reestablishing contact.",
        ],
        [
          "Read the Psalms of lament",
          "Psalms 22, 42, 43, 88, and 139 were written for seasons like this. They are the language of faith under pressure. Read them slowly and let someone else's honest words become yours for now.",
        ],
        [
          "Tell someone",
          "Isolation amplifies spiritual dryness. You don't have to announce a crisis — just say to one person you trust: \"I'm in a hard season with my faith.\" Being known is part of how faith recovers.",
        ],
        [
          "Rest without guilt",
          "Sometimes the most faithful act is to stop pushing and simply rest. God met Elijah with food and sleep before He gave him a word. Rest is not giving up. It is receiving.",
        ],
      ].map(([step, desc], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{step}</div>
          <div className={qaA}>{desc}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>A Word About Waiting</h2>
    <p className={p}>
      Recovery from spiritual dryness rarely happens in a single moment. It usually happens
      the way spring comes — incrementally, almost imperceptibly, until one day you notice
      that something has shifted. The practice during the dry season is simply to remain —
      to keep showing up, however quietly, until the season turns.
    </p>
    <div className={blockquote}>
      &ldquo;He gives strength to the weary and increases the power of the weak. Even youths grow tired
      and weary, and young men stumble and fall; but those who hope in the Lord will renew their
      strength.&rdquo; — Isaiah 40:29–31
    </div>
    <p className={p}>
      Weak faith that keeps showing up is exactly what that verse is for. The promise is not
      for those who already feel strong. It is for those who are weary and keep hoping anyway.
    </p>

    <div className={cta}>
      <p className="text-base font-bold text-white">Start where you are</p>
      <p className="mt-2 text-sm text-white/65">
        A short, honest prayer — even one sentence — is enough. Let us help you find the words for right now.
      </p>
      <a
        href="/tools/prayer"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
      >
        Generate a Prayer for Today
      </a>
    </div>
  </article>
);

// ── Post 12 ──────────────────────────────────────────────────────────────────
const post12Body: ReactNode = (
  <article>
    <p className={p}>
      Busyness is the default mode of modern life. The calendar fills itself. Notifications
      arrive before you have processed the last ones. Rest gets deferred until the weekend,
      or the next holiday, or some future season that never quite arrives. And somewhere in
      the noise, the interior life — the part of you that knows God, reflects, prays, and
      pays attention — gets crowded out.
    </p>
    <p className={p}>
      Staying spiritually grounded in a busy world is not about finding more time. Most people
      do not have more time. It is about what you do with the moments you already have.
    </p>

    <h2 className={h2}>What &ldquo;Grounded&rdquo; Actually Means</h2>
    <p className={p}>
      To be spiritually grounded is to have an interior anchor that holds when the surface of
      life is turbulent. It is not a feeling of constant peace — it is a return point. When
      anxiety spikes, when you react badly, when the day gets away from you, a grounded person
      has something to come back to.
    </p>
    <p className={p}>
      That anchor is built, not inherited. It is constructed through small, repeated acts of
      attention — moments when you deliberately turn toward God instead of away from Him.
    </p>
    <div className={blockquote}>
      &ldquo;You will keep in perfect peace those whose minds are steadfast, because they trust in you.&rdquo;
      — Isaiah 26:3
    </div>

    <h2 className={h2}>The Real Problem: Attention, Not Time</h2>
    <p className={p}>
      People often frame spiritual groundedness as a time problem — &ldquo;I would pray more if I had
      more time.&rdquo; But most of the moments that erode spiritual groundedness are not time problems.
      They are attention problems.
    </p>
    <ul className={ul}>
      <li className={li}>Checking your phone before getting out of bed sets a tone before you have chosen one.</li>
      <li className={li}>Eating lunch while scrolling means a natural pause for reflection disappears into content consumption.</li>
      <li className={li}>Driving in silence is rare because silence has become uncomfortable, so the radio or podcast fills it.</li>
      <li className={li}>The last minutes before sleep go to a screen, not stillness.</li>
    </ul>
    <p className={p}>
      None of these are moral failures. But they add up to a life where the quiet interior
      space that faith needs to breathe in gets almost entirely colonised by noise.
    </p>

    <h2 className={h2}>Small Moments That Build Groundedness</h2>
    <p className={p}>
      You do not need long periods of uninterrupted silence. You need small moments, reclaimed
      intentionally and used consistently. Here are six that fit inside an ordinary busy day:
    </p>
    <div className="mt-4 space-y-4">
      {[
        [
          "The first sixty seconds of the morning",
          "Before your phone, before your plan for the day — one conscious breath, one sentence of prayer. \"God, this day is yours. Help me live it well.\" Sixty seconds. It sets a different tone than headlines.",
        ],
        [
          "The commute reset",
          "Whether you drive, take transit, or walk — treat some portion of your commute as prayer time. No podcast, no music. Talk to God about what you're walking into. It is wasted time anyway; repurpose it.",
        ],
        [
          "The midday pause",
          "A two-minute stop at midday: What has happened this morning? How am I feeling? Is there anything I need to release or confess before the afternoon? You don't need a journal — just the questions.",
        ],
        [
          "Scripture as a daily anchor",
          "One verse, read slowly, once a day. Not a chapter. Not a reading plan you will fall behind on. One verse. Let it accompany you through the day like a phrase of music that replays quietly in the background.",
        ],
        [
          "The transition prayer",
          "Between activities — leaving work, arriving home, before a meeting — pause for ten seconds and deliberately hand the next thing to God. \"I'm walking into this. Help me be present.\" Small acts of surrender accumulate.",
        ],
        [
          "The evening review",
          "Before sleep, ask three questions: Where did I see God today? Where did I miss Him? What am I grateful for? Three questions, three answers, three minutes. Ends the day with intentionality rather than passivity.",
        ],
      ].map(([moment, desc], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{moment}</div>
          <div className={qaA}>{desc}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>Guarding the Interior Life</h2>
    <p className={p}>
      Spiritual groundedness also requires some intentional limits on what you let in. Not
      a retreat from the world — but the same basic principle as physical health: what you
      consume affects how you feel, and some things deplete faster than they restore.
    </p>
    <ul className={ul}>
      <li className={li}><strong>News and social media in the morning</strong> activates anxiety and comparison before the day has begun. Push them back by even thirty minutes.</li>
      <li className={li}><strong>Chronic noise</strong> — background TV, constant podcasts, always-on music — fills the silence that reflection requires. Build in some quiet daily, even briefly.</li>
      <li className={li}><strong>Saying yes to everything</strong> creates a schedule with no margin. Margin is where spiritual life actually happens. Protect some of it.</li>
    </ul>

    <h2 className={h2}>When Busy Seasons Become Spiritually Dry Seasons</h2>
    <p className={p}>
      Sometimes the busyness wins. You look up after several weeks and realise you have been
      running on fumes spiritually. The tank is empty, prayer feels impossible, and you cannot
      remember the last time you felt genuinely connected to God.
    </p>
    <p className={p}>
      This is not the time for a grand recovery programme. It is time for the simplest
      possible re-entry: one honest prayer, today. Not a plan, not a schedule — just a
      return. God does not require an explanation for the absence. He simply receives the
      return.
    </p>
    <div className={blockquote}>
      &ldquo;Come near to God and he will come near to you.&rdquo; — James 4:8
    </div>

    <div className={cta}>
      <p className="text-base font-bold text-white">Take a grounding moment right now</p>
      <p className="mt-2 text-sm text-white/65">
        A personalised devotional — tailored to your day and situation — in under a minute.
      </p>
      <a
        href="/tools/devotional"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
      >
        Generate My Devotional
      </a>
    </div>
  </article>
);

// ── Post 13 ──────────────────────────────────────────────────────────────────
const post13Body: ReactNode = (
  <article>
    <p className={p}>
      Difficult times are not the exception to life — they are part of it. Illness, loss,
      financial pressure, broken relationships, grief, uncertainty about the future: at some
      point, everyone faces seasons that require more strength than they feel they have.
    </p>
    <p className={p}>
      Scripture is not silent on this. The Bible was written by people who faced real hardship —
      exile, persecution, poverty, grief, war — and who found, in the midst of it, that God
      was not absent. The verses below are not platitudes. They are tested words from people
      who needed exactly what you need right now.
    </p>

    <h2 className={h2}>When You Feel You Cannot Keep Going</h2>
    <div className="mt-4 space-y-4">
      {[
        [
          "Joshua 1:9",
          "\"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\"",
          "This was spoken to Joshua before the most daunting task of his life. The command to be strong is grounded in a fact: God is present. Courage is not the absence of fear — it is movement in the presence of it, anchored in who goes with you.",
        ],
        [
          "Isaiah 40:31",
          "\"But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.\"",
          "Notice that the promise begins with walking, not soaring. Strength is renewed incrementally. Some days it feels like flight; most days it simply feels like continuing to walk without collapsing. Both are included.",
        ],
        [
          "Psalm 46:1",
          "\"God is our refuge and strength, an ever-present help in trouble.\"",
          "\"Ever-present\" — not occasional, not conditional, not distant. Trouble does not drive God away. It is precisely where this verse says He shows up.",
        ],
      ].map(([ref, verse, reflection], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{ref}</div>
          <div className="mt-1 italic text-sm text-white/60 leading-6">{verse}</div>
          <div className={qaA + " mt-2"}>{reflection}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>When You Are Exhausted</h2>
    <div className="mt-4 space-y-4">
      {[
        [
          "Matthew 11:28–29",
          "\"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.\"",
          "Jesus does not say \"push through\" or \"try harder.\" He says come. Weariness is a valid reason to approach God, not something to overcome before you are allowed to. The invitation is specifically for the exhausted.",
        ],
        [
          "Psalm 23:4",
          "\"Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.\"",
          "The valley is real — it is not bypassed or denied. What changes is not the difficulty of the path but the presence of a companion on it. That presence is what makes fear manageable.",
        ],
        [
          "2 Corinthians 12:9",
          "\"My grace is sufficient for you, for my power is made perfect in weakness.\"",
          "This is one of the most counterintuitive promises in Scripture. The place where you feel most depleted is not where God is least present — it is where His strength is most clearly at work, because it cannot be mistaken for your own.",
        ],
      ].map(([ref, verse, reflection], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{ref}</div>
          <div className="mt-1 italic text-sm text-white/60 leading-6">{verse}</div>
          <div className={qaA + " mt-2"}>{reflection}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>When You Are Afraid</h2>
    <div className="mt-4 space-y-4">
      {[
        [
          "Isaiah 41:10",
          "\"So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.\"",
          "Four promises in two verses: presence, identity (\"I am your God\"), active help, and upholding. The verb \"uphold\" implies something that would otherwise fall being held up from beneath. God's strength under yours.",
        ],
        [
          "Philippians 4:6–7",
          "\"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.\"",
          "The peace promised here is not the peace of a resolved situation — it is peace that \"transcends understanding,\" which means it can exist before circumstances change. It comes through prayer, not through outcomes.",
        ],
        [
          "Psalm 34:18",
          "\"The Lord is close to the brokenhearted and saves those who are crushed in spirit.\"",
          "Not the confident. Not the composed. The brokenhearted, the crushed. If that is where you are, this verse is addressed to you specifically.",
        ],
      ].map(([ref, verse, reflection], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{ref}</div>
          <div className="mt-1 italic text-sm text-white/60 leading-6">{verse}</div>
          <div className={qaA + " mt-2"}>{reflection}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>When You Need to Keep Going</h2>
    <div className="mt-4 space-y-4">
      {[
        [
          "Romans 8:38–39",
          "\"For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.\"",
          "Paul wrote this from prison. The list is deliberately exhaustive — every category of threat, every dimension of existence. Nothing qualifies as an exception. Whatever you are facing is included in \"nor anything else in all creation.\"",
        ],
        [
          "Jeremiah 29:11",
          "\"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.\"",
          "This was written to exiles — people in the worst season of Israel's national life, displaced and uncertain. The promise of a future was spoken into that, not after it.",
        ],
        [
          "James 1:2–4",
          "\"Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance. Let perseverance finish its work so that you may be mature and complete, not lacking anything.\"",
          "This is not a call to pretend difficulty is fine. It is a call to see difficulty as raw material. What feels like it is breaking you may also be building something in you that cannot be built any other way.",
        ],
      ].map(([ref, verse, reflection], i) => (
        <div key={i} className={card}>
          <div className={qaQ}>{ref}</div>
          <div className="mt-1 italic text-sm text-white/60 leading-6">{verse}</div>
          <div className={qaA + " mt-2"}>{reflection}</div>
        </div>
      ))}
    </div>

    <h2 className={h2}>How to Pray With These Verses</h2>
    <p className={p}>
      Reading a verse is one thing. Praying it back to God is another — and often more
      powerful. Take any verse above and speak it as a prayer:
    </p>
    <ul className={ul}>
      <li className={li}>Read it aloud slowly.</li>
      <li className={li}>Replace the pronouns: &ldquo;You are my refuge and strength. You are an ever-present help in my trouble.&rdquo;</li>
      <li className={li}>Sit with it for thirty seconds.</li>
      <li className={li}>Tell God honestly where you are: &ldquo;I need this to be true right now.&rdquo;</li>
    </ul>
    <p className={p}>
      You are not alone in what you are facing. That is not a greeting-card sentiment — it
      is the consistent, tested claim of Scripture across thousands of years. You are not
      the first to need strength you did not have, and the God who gave it then is unchanged.
    </p>

    <div className={cta}>
      <p className="text-base font-bold text-white">Find the right verse for your situation</p>
      <p className="mt-2 text-sm text-white/65">
        Tell us what you&apos;re facing and get a personalised Scripture with reflection — in seconds.
      </p>
      <a
        href="/tools/verse"
        className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-95 transition"
      >
        Find a Verse for My Situation
      </a>
    </div>
  </article>
);

// ── Posts registry ────────────────────────────────────────────────────────────
export const POSTS: BlogPost[] = [
  {
    slug: "bible-quiz-questions-and-answers",
    title: "60 Bible Quiz Questions and Answers (Easy, Medium & Hard)",
    excerpt:
      "From general Bible knowledge to women of the Bible, parables, and church history — 60 curated questions with answers for trivia nights, family devotionals, and personal study.",
    date: "April 18, 2026",
    dateISO: "2026-04-18",
    publishDate: "2026-04-18",
    readTime: "12 min read",
    keywords: ["bible quiz questions and answers", "bible trivia", "bible knowledge test", "christian quiz"],
    description:
      "60 Bible quiz questions and answers across 6 categories: General, Old Testament, New Testament, Women of the Bible, Parables, and Theology. Perfect for trivia nights, Sunday school, and personal study.",
    body: post1Body,
  },
  {
    slug: "how-to-write-a-personal-prayer",
    title: "How to Write a Personal Prayer: A Step-by-Step Guide",
    excerpt:
      "No perfect formula required. Learn the ACTS method, see a complete example prayer for anxiety, and discover how to make your prayers more honest, specific, and Scripture-grounded.",
    date: "April 17, 2026",
    dateISO: "2026-04-17",
    publishDate: "2026-04-17",
    readTime: "9 min read",
    keywords: ["how to write a personal prayer", "prayer guide", "personal prayer examples", "how to pray"],
    description:
      "Learn how to write a personal prayer with the ACTS method (Adoration, Confession, Thanksgiving, Supplication). Includes a full prayer example for anxiety, step-by-step instructions, and Scripture references.",
    body: post2Body,
  },
  {
    slug: "daily-devotional-guide-for-beginners",
    title: "Daily Devotional Guide for Beginners: Start Your Morning Practice",
    excerpt:
      "Everything you need to begin a consistent devotional habit — the four-part structure, a 7-day starter plan, tips for making it stick, and answers to common beginner questions.",
    date: "April 16, 2026",
    dateISO: "2026-04-16",
    publishDate: "2026-04-16",
    readTime: "10 min read",
    keywords: ["daily devotional guide", "devotional for beginners", "how to start a devotional", "morning devotional"],
    description:
      "A complete daily devotional guide for beginners. Covers the 4-part devotional structure, a 7-day starter reading plan, the best time of day to do devotionals, and tips to make the habit stick.",
    body: post3Body,
  },
  {
    slug: "find-right-bible-verse",
    title: "How to Find the Right Bible Verse for Your Situation",
    excerpt:
      "You don't need to search endlessly. Learn how to match Scripture to exactly what you're going through — with a simple approach that goes beyond keyword searches.",
    date: "May 1, 2026",
    dateISO: "2026-05-01",
    publishDate: "2026-05-01",
    readTime: "6 min read",
    keywords: ["find bible verse for situation", "right bible verse", "bible verse for my situation", "how to find scripture", "personalized bible verse"],
    description:
      "Learn how to find the right Bible verse for your situation. Move beyond generic keyword searches — use themes, honest reflection, and a step-by-step approach to find Scripture that speaks directly to where you are.",
    body: post4Body,
  },
  {
    slug: "devotional-anxiety",
    title: "A Daily Devotional for Anxiety and Overthinking",
    excerpt:
      "Anxiety often comes from trying to control what we cannot. This devotional — grounded in 1 Peter 5:7 — offers Scripture, reflection, prayer, and one action step for releasing what you were never meant to carry.",
    date: "May 8, 2026",
    dateISO: "2026-05-08",
    publishDate: "2026-05-08",
    readTime: "5 min read",
    keywords: ["devotional for anxiety", "daily devotional anxiety", "overthinking devotional", "christian anxiety", "bible verses anxiety devotional"],
    description:
      "A daily devotional for anxiety and overthinking grounded in 1 Peter 5:7. Includes Scripture, personal reflection, a full prayer, and one practical action step for releasing what you were never meant to carry.",
    body: post5Body,
  },
  {
    slug: "daily-prayer-habit",
    title: "How to Build a Daily Prayer Habit That Actually Sticks",
    excerpt:
      "Many people want to pray more but struggle with consistency. The key isn't more discipline — it's more simplicity. Here's how to build a prayer habit that survives a hard week.",
    date: "May 15, 2026",
    dateISO: "2026-05-15",
    publishDate: "2026-05-15",
    readTime: "7 min read",
    keywords: ["daily prayer habit", "how to pray consistently", "prayer habit tips", "build a prayer routine", "christian prayer habit"],
    description:
      "Learn how to build a daily prayer habit that actually sticks. Covers habit stacking, starting small, honesty over performance, handling missed days, and using structure when you need it.",
    body: post6Body,
  },
  {
    slug: "verses-for-direction",
    title: "Bible Verses for When You Feel Lost or Directionless",
    excerpt:
      "Feeling lost is often the beginning of guidance, not the end of it. Five Bible verses for uncertain seasons — with reflection and practical steps for finding your next direction.",
    date: "June 1, 2026",
    dateISO: "2026-06-01",
    publishDate: "2026-06-01",
    readTime: "6 min read",
    keywords: ["bible verses feeling lost", "verses for direction", "bible verse when lost", "scripture for uncertainty", "feeling directionless christian"],
    description:
      "Bible verses for when you feel lost or directionless. Five passages for uncertain seasons — including Psalm 119:105, Proverbs 3:5–6, and Isaiah 30:21 — with reflection, practical steps, and a tool to find your verse.",
    body: post7Body,
  },
  {
    slug: "hear-gods-guidance",
    title: "How to Hear God's Guidance in Everyday Life",
    excerpt:
      "God's guidance is often quiet, not dramatic. Learn the four channels God uses, why we miss them, and how to practise the kind of attention that makes guidance recognisable.",
    date: "July 1, 2026",
    dateISO: "2026-07-01",
    publishDate: "2026-07-01",
    readTime: "7 min read",
    keywords: ["how to hear god's guidance", "hearing god's voice", "how does god guide us", "discerning god's will", "recognizing god's guidance"],
    description:
      "Learn how to hear God's guidance in everyday life. Covers the four channels God uses — Scripture, inner peace, wise counsel, and circumstances — plus why we miss guidance and how to practise listening.",
    body: post8Body,
  },
  {
    slug: "spiritual-growth-routine",
    title: "A Simple Daily Routine for Spiritual Growth",
    excerpt:
      "Spiritual growth doesn't require complexity. A simple three-part daily routine — one verse, one minute of reflection, one honest prayer — practised consistently will do more than occasional intensity.",
    date: "September 1, 2026",
    dateISO: "2026-09-01",
    publishDate: "2026-09-01",
    readTime: "6 min read",
    keywords: ["daily spiritual routine", "spiritual growth routine", "simple devotional routine", "christian daily habit", "spiritual growth tips"],
    description:
      "Build a simple daily routine for spiritual growth. Three-part approach: read one verse, reflect for one minute, pray briefly. Covers why simplicity sustains consistency, habit anchoring, and what to do when it feels empty.",
    body: post9Body,
  },
  {
    slug: "start-devotional-practice",
    title: "How to Start a Personal Devotional Practice",
    excerpt:
      "A personal devotional practice doesn't require special equipment, a perfect schedule, or years of Bible knowledge. It requires a few minutes, a willing heart, and one honest prayer.",
    date: "November 1, 2027",
    dateISO: "2027-11-01",
    publishDate: "2027-11-01",
    readTime: "6 min read",
    keywords: ["how to start a devotional", "personal devotional practice", "daily devotional for beginners", "how to do a devotional", "devotional routine"],
    description:
      "Learn how to start a personal devotional practice that fits your life. Covers what a devotional is, how to choose a format, what to do when it feels hard, and how to make it a lasting habit.",
    body: post10Body,
  },
  {
    slug: "faith-feels-weak",
    title: "What to Do When Your Faith Feels Weak",
    excerpt:
      "Weak faith is still faith. When God feels distant and prayer feels hollow, there are honest, practical things you can do — and Scripture is full of people who felt exactly as you do.",
    date: "October 1, 2027",
    dateISO: "2027-10-01",
    publishDate: "2027-10-01",
    readTime: "6 min read",
    keywords: ["faith feels weak", "struggling with faith", "spiritual dryness", "doubt and faith", "when god feels distant"],
    description:
      "Encouragement and practical steps for when your faith feels weak or distant. Covers why faith weakens, biblical examples of doubt and dryness, and what to do when prayer feels hollow.",
    body: post11Body,
  },
  {
    slug: "stay-grounded",
    title: "How to Stay Spiritually Grounded in a Busy World",
    excerpt:
      "Staying spiritually grounded in a busy world isn't about finding more time — it's about what you do with the moments you already have. Six small practices that fit inside an ordinary day.",
    date: "September 1, 2026",
    dateISO: "2026-09-01",
    publishDate: "2026-09-01",
    readTime: "6 min read",
    keywords: ["stay spiritually grounded", "spiritual grounding", "faith in busy life", "spiritual discipline", "staying connected to god"],
    description:
      "Learn how to stay spiritually grounded in a busy, distracted world. Six small daily practices — morning prayer, commute resets, midday pauses, and evening reviews — that build an interior anchor without requiring more time.",
    body: post12Body,
  },
  {
    slug: "verses-for-strength",
    title: "Bible Verses for Strength During Difficult Times",
    excerpt:
      "Nine tested verses for when life requires more strength than you feel you have — with honest reflections on what each one actually means, and how to pray them.",
    date: "August 1, 2026",
    dateISO: "2026-08-01",
    publishDate: "2026-08-01",
    readTime: "7 min read",
    keywords: ["bible verses for strength", "scripture for difficult times", "bible verses for hard times", "strength bible verse", "verses for encouragement"],
    description:
      "Nine Bible verses for strength during difficult times — covering exhaustion, fear, grief, and perseverance. Each verse includes an honest reflection and a simple way to pray it.",
    body: post13Body,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
