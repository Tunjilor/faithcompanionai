import BrandHeader from "@/components/BrandHeader";

const RESOURCES = [
  {
    title: "Study Bibles",
    description:
      "Explore trusted study Bibles to deepen your understanding of Scripture.",
  },
  {
    title: "Prayer Journals",
    description:
      "Guided and open-format journals to support a consistent prayer life.",
  },
  {
    title: "Devotional Books",
    description:
      "Daily devotionals focused on Scripture, reflection, and application.",
  },
  {
    title: "Christian Living",
    description:
      "Resources to help apply biblical principles to everyday life.",
  },
  {
    title: "Scripture Memory",
    description:
      "Tools and methods to help you memorize and retain God’s Word.",
  },
  {
    title: "Faith & Growth",
    description:
      "Materials designed to encourage spiritual maturity and growth.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <BrandHeader
        title="Christian Resources"
        subtitle="Carefully selected tools and materials to support your daily walk with God."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((item) => (
          <div
            key={item.title}
            className="brand-surface p-6 transition hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="brand-surface p-6 text-sm text-slate-600">
        More resources and recommendations will continue to be added over time.
      </div>
    </div>
  );
}
