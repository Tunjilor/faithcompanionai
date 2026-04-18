// src/app/blog/content.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readTime: string;
  keywords: string[];
  description: string;
  body: ReactNode;
};

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

// ── Posts registry ────────────────────────────────────────────────────────────
export const POSTS: BlogPost[] = [
  {
    slug: "bible-quiz-questions-and-answers",
    title: "60 Bible Quiz Questions and Answers (Easy, Medium & Hard)",
    excerpt:
      "From general Bible knowledge to women of the Bible, parables, and church history — 60 curated questions with answers for trivia nights, family devotionals, and personal study.",
    date: "April 18, 2026",
    dateISO: "2026-04-18",
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
    readTime: "10 min read",
    keywords: ["daily devotional guide", "devotional for beginners", "how to start a devotional", "morning devotional"],
    description:
      "A complete daily devotional guide for beginners. Covers the 4-part devotional structure, a 7-day starter reading plan, the best time of day to do devotionals, and tips to make the habit stick.",
    body: post3Body,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
