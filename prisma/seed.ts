import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Q = {
  category: string;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: "A" | "B" | "C" | "D";
  explanation?: string;
};

const questions: Q[] = [
  // -------------------------
  // BIBLE BASICS (1–20)
  // -------------------------
  {
    category: "Bible Basics",
    prompt: "In the beginning, God created the ____ and the earth.",
    optionA: "sun",
    optionB: "heavens",
    optionC: "sea",
    optionD: "stars",
    answer: "B",
    explanation: "Genesis 1:1 — 'the heavens and the earth.'",
  },
  {
    category: "Bible Basics",
    prompt: "Who built the ark?",
    optionA: "Moses",
    optionB: "Noah",
    optionC: "Abraham",
    optionD: "David",
    answer: "B",
    explanation: "Noah built the ark (Genesis 6).",
  },
  {
    category: "Bible Basics",
    prompt: "What is the first book of the Bible?",
    optionA: "Exodus",
    optionB: "Genesis",
    optionC: "Matthew",
    optionD: "Psalms",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "Jesus was born in which town?",
    optionA: "Nazareth",
    optionB: "Jerusalem",
    optionC: "Bethlehem",
    optionD: "Capernaum",
    answer: "C",
  },
  {
    category: "Bible Basics",
    prompt: "Who led Israel out of Egypt?",
    optionA: "Joshua",
    optionB: "Moses",
    optionC: "Samuel",
    optionD: "Elijah",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "How many days and nights did it rain in the flood narrative?",
    optionA: "7",
    optionB: "12",
    optionC: "40",
    optionD: "100",
    answer: "C",
  },
  {
    category: "Bible Basics",
    prompt: "Which of these is NOT one of the Gospels?",
    optionA: "Matthew",
    optionB: "Mark",
    optionC: "Luke",
    optionD: "Romans",
    answer: "D",
  },
  {
    category: "Bible Basics",
    prompt: "The Psalms are primarily:",
    optionA: "laws",
    optionB: "letters",
    optionC: "songs/poems",
    optionD: "genealogies",
    answer: "C",
  },
  {
    category: "Bible Basics",
    prompt: "Who was swallowed by a great fish?",
    optionA: "Jonah",
    optionB: "Job",
    optionC: "James",
    optionD: "John",
    answer: "A",
  },
  {
    category: "Bible Basics",
    prompt: "Who betrayed Jesus?",
    optionA: "Peter",
    optionB: "Thomas",
    optionC: "Judas Iscariot",
    optionD: "Matthew",
    answer: "C",
  },
  {
    category: "Bible Basics",
    prompt: "Which commandment says, 'You shall not steal'?",
    optionA: "6th",
    optionB: "7th",
    optionC: "8th",
    optionD: "9th",
    answer: "C",
  },
  {
    category: "Bible Basics",
    prompt: "Paul wrote many New Testament letters. Paul was formerly known as:",
    optionA: "Silas",
    optionB: "Saul",
    optionC: "Simeon",
    optionD: "Stephen",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "Who interpreted dreams for Pharaoh in Egypt?",
    optionA: "Joseph",
    optionB: "Jacob",
    optionC: "Isaac",
    optionD: "Aaron",
    answer: "A",
  },
  {
    category: "Bible Basics",
    prompt: "The Lord’s Prayer begins with:",
    optionA: "O God, help us",
    optionB: "Our Father in heaven",
    optionC: "Blessed are the poor",
    optionD: "Glory to God",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "Which is the last book of the Bible?",
    optionA: "Jude",
    optionB: "Revelation",
    optionC: "Acts",
    optionD: "Hebrews",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "What sea did Moses cross when leaving Egypt (as commonly named)?",
    optionA: "Dead Sea",
    optionB: "Sea of Galilee",
    optionC: "Red Sea",
    optionD: "Mediterranean Sea",
    answer: "C",
  },
  {
    category: "Bible Basics",
    prompt: "Which disciple doubted Jesus’ resurrection until seeing evidence?",
    optionA: "Andrew",
    optionB: "Thomas",
    optionC: "James",
    optionD: "Philip",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "Which book describes the early church after Jesus’ resurrection and ascension?",
    optionA: "Acts",
    optionB: "Proverbs",
    optionC: "Leviticus",
    optionD: "Habakkuk",
    answer: "A",
  },
  {
    category: "Bible Basics",
    prompt: "Who defeated Goliath?",
    optionA: "Saul",
    optionB: "David",
    optionC: "Solomon",
    optionD: "Samuel",
    answer: "B",
  },
  {
    category: "Bible Basics",
    prompt: "Which is known as the “wisdom literature” of the Bible?",
    optionA: "Proverbs",
    optionB: "Joshua",
    optionC: "Nahum",
    optionD: "Malachi",
    answer: "A",
  },

  // -------------------------
  // LIFE OF JESUS (21–35)
  // -------------------------
  {
    category: "Life of Jesus",
    prompt: "Jesus’ first recorded miracle in John’s Gospel was:",
    optionA: "walking on water",
    optionB: "feeding 5,000",
    optionC: "turning water into wine",
    optionD: "healing a blind man",
    answer: "C",
  },
  {
    category: "Life of Jesus",
    prompt: "The Sermon on the Mount is found primarily in which Gospel?",
    optionA: "Matthew",
    optionB: "Mark",
    optionC: "Luke",
    optionD: "John",
    answer: "A",
  },
  {
    category: "Life of Jesus",
    prompt: "Jesus was baptized by:",
    optionA: "John the Baptist",
    optionB: "Peter",
    optionC: "Paul",
    optionD: "James",
    answer: "A",
  },
  {
    category: "Life of Jesus",
    prompt: "The Last Supper was a meal associated with:",
    optionA: "Pentecost",
    optionB: "Passover",
    optionC: "Purim",
    optionD: "Hanukkah",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "Which prayer did Jesus teach as a model for His followers?",
    optionA: "The Aaronic Blessing",
    optionB: "The Lord’s Prayer",
    optionC: "The Prayer of Jabez",
    optionD: "Solomon’s Prayer",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "Jesus said the greatest commandments are to love God and:",
    optionA: "obey the law perfectly",
    optionB: "love your neighbor as yourself",
    optionC: "give all your possessions away",
    optionD: "avoid all sinners",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "Where was Jesus crucified (as commonly named)?",
    optionA: "Bethany",
    optionB: "Golgotha",
    optionC: "Nazareth",
    optionD: "Cana",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "On the third day after His death, Jesus:",
    optionA: "remained in the tomb",
    optionB: "was resurrected",
    optionC: "was replaced by a disciple",
    optionD: "sent angels only",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "Who helped carry Jesus’ cross?",
    optionA: "Simon of Cyrene",
    optionB: "Barabbas",
    optionC: "Nicodemus",
    optionD: "Zacchaeus",
    answer: "A",
  },
  {
    category: "Life of Jesus",
    prompt: "Jesus’ parables are best described as:",
    optionA: "legal codes",
    optionB: "symbolic stories teaching spiritual truths",
    optionC: "genealogical records",
    optionD: "lists of kings",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "The Holy Spirit came upon the disciples at:",
    optionA: "Christmas",
    optionB: "Easter",
    optionC: "Pentecost",
    optionD: "Passover",
    answer: "C",
  },
  {
    category: "Life of Jesus",
    prompt: "Jesus told Nicodemus that one must be ____ to see the kingdom of God.",
    optionA: "perfect",
    optionB: "born again",
    optionC: "wealthy",
    optionD: "educated",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "Which disciple walked on water briefly toward Jesus?",
    optionA: "John",
    optionB: "Peter",
    optionC: "Matthew",
    optionD: "Thomas",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "Jesus summarized His mission as 'to seek and to save the ____.'",
    optionA: "wise",
    optionB: "lost",
    optionC: "strong",
    optionD: "rich",
    answer: "B",
  },
  {
    category: "Life of Jesus",
    prompt: "The Transfiguration involved Jesus appearing radiant with:",
    optionA: "Moses and Elijah",
    optionB: "Abraham and Isaac",
    optionC: "David and Solomon",
    optionD: "Peter and Paul",
    answer: "A",
  },

  // -------------------------
  // THEOLOGY & PRACTICE (36–50)
  // -------------------------
  {
    category: "Theology",
    prompt: "Grace is best described as:",
    optionA: "earning God’s favor by works",
    optionB: "God’s unmerited favor",
    optionC: "following traditions perfectly",
    optionD: "punishment for sin",
    answer: "B",
  },
  {
    category: "Theology",
    prompt: "Faith (biblically) is often defined as confidence in what we ____ and assurance about what we do not see.",
    optionA: "hear",
    optionB: "hope for",
    optionC: "fear",
    optionD: "own",
    answer: "B",
  },
  {
    category: "Theology",
    prompt: "The Trinity teaches that God is:",
    optionA: "three gods",
    optionB: "one God in three persons",
    optionC: "one person with three names only",
    optionD: "a created being",
    answer: "B",
  },
  {
    category: "Theology",
    prompt: "Sanctification refers to:",
    optionA: "God’s process of making believers holy",
    optionB: "a political movement",
    optionC: "earning salvation",
    optionD: "a festival in Israel",
    answer: "A",
  },
  {
    category: "Theology",
    prompt: "The Great Commission calls believers to:",
    optionA: "build large buildings",
    optionB: "make disciples of all nations",
    optionC: "memorize all proverbs",
    optionD: "avoid all non-believers",
    answer: "B",
  },
  {
    category: "Theology",
    prompt: "Repentance most accurately means:",
    optionA: "feeling bad only",
    optionB: "turning from sin toward God",
    optionC: "denying wrongdoing",
    optionD: "hiding mistakes",
    answer: "B",
  },
  {
    category: "Theology",
    prompt: "Justification is best described as:",
    optionA: "God declaring a sinner righteous through Christ",
    optionB: "a believer becoming sinless instantly",
    optionC: "a ritual washing",
    optionD: "reward for charity",
    answer: "A",
  },
  {
    category: "Theology",
    prompt: "Prayer is primarily:",
    optionA: "a way to control outcomes",
    optionB: "communication with God",
    optionC: "a performance for others",
    optionD: "only for emergencies",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "The 'fruit of the Spirit' includes love, joy, peace, and:",
    optionA: "revenge",
    optionB: "patience",
    optionC: "envy",
    optionD: "pride",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "Forgiveness in Christian teaching is:",
    optionA: "optional if people apologize",
    optionB: "commanded as we have been forgiven",
    optionC: "only for family members",
    optionD: "the same as ignoring wrong",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "The Bible teaches love is:",
    optionA: "only a feeling",
    optionB: "patient and kind",
    optionC: "always self-seeking",
    optionD: "unimportant",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "Humility is best shown by:",
    optionA: "thinking less of yourself always",
    optionB: "serving others and valuing them",
    optionC: "never speaking",
    optionD: "avoiding responsibility",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "Biblical wisdom is primarily:",
    optionA: "street smarts only",
    optionB: "skillful living grounded in reverence for God",
    optionC: "ability to win arguments",
    optionD: "knowledge without obedience",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "The church is best described as:",
    optionA: "a building",
    optionB: "the community/body of believers",
    optionC: "a political party",
    optionD: "a private club",
    answer: "B",
  },
  {
    category: "Christian Living",
    prompt: "A key Christian virtue emphasized in the New Testament is:",
    optionA: "selfish ambition",
    optionB: "love",
    optionC: "hypocrisy",
    optionD: "partiality",
    answer: "B",
  },
];

async function main() {
  console.log("🌱 Seeding questions...");

  // Wipe only the quiz question bank (safe)
  await prisma.quizAttemptQuestion.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();

  await prisma.question.createMany({
    data: questions,
  });

  const count = await prisma.question.count();
  console.log(`✅ Seed complete. Inserted ${count} questions.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
