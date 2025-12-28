import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";

type FAQ = {
  q: string;
  a: string;
};

const FAQS: FAQ[] = [
  {
    q: "What is Faith Companion AI?",
    a: "Faith Companion AI is an AI-powered spiritual companion that provides personalized Bible verses, prayers, and devotionals based on your needs and circumstances.",
  },
  {
    q: "Is Faith Companion AI free to use?",
    a: "Yes. Free users have limited daily access to certain features. Premium unlocks unlimited AI-generated prayers, devotionals, and verse generation.",
  },
  {
    q: "How does premium work?",
    a: "Premium gives you unlimited AI-generated prayers, devotionals, and verse generation for $5.99/month. Free users have limited daily access to devotionals.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel directly through your PayPal account. Your access continues until the end of your current billing period.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. All payments are processed by PayPal and never stored by us. Your financial information is completely secure.",
  },
  {
    q: "What Bible translations do you use?",
    a: "We support KJV, NKJV, NIV, and ESV translations for Bible verses. You can select your preferred translation when generating content.",
  },
  {
    q: "Can I share the content I generate?",
    a: "Absolutely! We encourage sharing verses, prayers, and devotionals on social media to spread encouragement. Use our built-in sharing buttons or download as images.",
  },
  {
    q: "How accurate are the Bible verses?",
    a: "Our AI uses real Scripture from trusted Bible translations. However, we always recommend verifying verses with your own Bible for study purposes.",
  },
  {
    q: "Can Faith Companion AI generate prayers for anxiety, healing, or guidance?",
    a: "Yes. You can choose a topic like anxiety, healing, gratitude, strength, or guidance and generate a Bible-based prayer tailored to your request.",
  },
  {
    q: "Can I save my favorite content?",
    a: "Yes! Use the 'Save to Favorites' button to store verses, prayers, and devotionals. They're saved in your browser's local storage.",
  },
  {
    q: "Does Faith Companion AI store my prayers or personal data?",
    a: "Favorites and saved content are stored locally in your browser. Payment information is processed securely by PayPal. If you contact us or subscribe, we may receive your email address.",
  },
  {
    q: "What features do you offer?",
    a: "We offer daily Bible verses, AI-generated prayers and devotionals, a Prayer Journal to track your prayers, Scripture Memory flashcards, a Prayer Wall for community prayer requests, Bible quizzes, and an AI spiritual chat assistant.",
  },
  {
    q: "What can the AI chat assistant help with?",
    a: "Our AI assistant provides Bible-based spiritual guidance, answers faith questions, and offers encouragement. It has some limitations and can't perform actions like saving content. For feature requests or suggestions, please use our Contact page.",
  },
  {
    q: "Do you offer refunds?",
    a: "Due to the instant digital nature of our service, subscriptions are non-refundable. However, you can cancel anytime to prevent future charges.",
  },
  {
    q: "Is this a replacement for church or Bible study?",
    a: "No. Faith Companion AI is a supplement to your spiritual life, not a replacement for community worship, Bible study, or pastoral guidance.",
  },
  {
    q: "Can I use Faith Companion AI on my phone?",
    a: "Yes — Faith Companion AI is mobile-friendly and works on phones, tablets, and desktop browsers.",
  },
  {
    q: "How do I contact support?",
    a: "Use the Contact page to reach our support team with questions, feedback, or feature requests.",
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <BrandHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Faith Companion AI."
      />

      <div className="fc-surface p-6">
        <div className="space-y-5">
          {FAQS.map((item) => (
            <section
              key={item.q}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {item.q}
              </h2>
              <p className="mt-2 text-white/75 leading-relaxed">{item.a}</p>
            </section>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fc-surface p-6">
        <h2 className="text-xl font-semibold text-white">Still have questions?</h2>
        <p className="mt-2 text-white/75">
          We&apos;re here to help! Reach out to our support team.
        </p>

        <div className="mt-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
