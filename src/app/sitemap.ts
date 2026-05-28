import type { MetadataRoute } from "next";
import { POSTS } from "./blog/content";
import { TOPIC_SLUGS } from "./topics/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://faithcompanionai.com";
  const now = new Date();

  type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

  const static_pages: Array<{ route: string; priority: number; freq: Freq }> = [
    { route: "",                            priority: 1.0,  freq: "weekly"  },
    { route: "/pricing",                    priority: 0.95, freq: "monthly" },
    { route: "/biblequiz",                  priority: 0.9,  freq: "weekly"  },
    { route: "/tools/verse",                priority: 0.9,  freq: "weekly"  },
    { route: "/tools/prayer",               priority: 0.9,  freq: "weekly"  },
    { route: "/tools/devotional",           priority: 0.9,  freq: "weekly"  },
    { route: "/tools/bible-search",         priority: 0.9,  freq: "weekly"  },
    { route: "/tools/share-card",           priority: 0.8,  freq: "weekly"  },
    { route: "/tools/verse-finder",         priority: 0.8,  freq: "monthly" },
    { route: "/tools/scripture-memory",     priority: 0.8,  freq: "monthly" },
    { route: "/tools/prayer-journal",       priority: 0.8,  freq: "monthly" },
    { route: "/tools",                      priority: 0.75, freq: "monthly" },
    { route: "/daily-devotional",           priority: 0.9,  freq: "daily"   },
    { route: "/how-to-pray",                priority: 0.85, freq: "monthly" },
    { route: "/tithing",                    priority: 0.85, freq: "monthly" },
    { route: "/bible-verse-for-anxiety",    priority: 0.85, freq: "monthly" },
    { route: "/verse",                      priority: 0.8,  freq: "daily"   },
    { route: "/quiz",                       priority: 0.8,  freq: "weekly"  },
    { route: "/quiz/challenge",             priority: 0.75, freq: "weekly"  },
    { route: "/community",                  priority: 0.75, freq: "monthly" },
    { route: "/community/prayer-wall",      priority: 0.75, freq: "weekly"  },
    { route: "/blog",                       priority: 0.85, freq: "weekly"  },
    { route: "/resources",                  priority: 0.8,  freq: "weekly"  },
    { route: "/resources/christian-living", priority: 0.75, freq: "monthly" },
    { route: "/about",                      priority: 0.6,  freq: "monthly" },
    { route: "/faq",                        priority: 0.6,  freq: "monthly" },
    { route: "/contact",                    priority: 0.6,  freq: "monthly" },
    { route: "/support",                    priority: 0.55, freq: "monthly" },
    { route: "/privacy",                    priority: 0.4,  freq: "yearly"  },
    { route: "/terms",                      priority: 0.4,  freq: "yearly"  },
    { route: "/refund",                     priority: 0.4,  freq: "yearly"  },
  ];

  const blog_posts = POSTS.map((p) => ({
    route: `/blog/${p.slug}`,
    priority: 0.8,
    freq: "monthly" as Freq,
  }));

  const topic_pages = TOPIC_SLUGS.map((t) => ({
    route: `/topics/${t}`,
    priority: 0.8,
    freq: "monthly" as Freq,
  }));

  return [...static_pages, ...blog_posts, ...topic_pages].map(
    ({ route, priority, freq }) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
    })
  );
}
