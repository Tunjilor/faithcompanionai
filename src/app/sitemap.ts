// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://faithcompanionai.com";
  const now = new Date();

  type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

  const pages: Array<{ route: string; priority: number; freq: Freq }> = [
    { route: "",                          priority: 1.0, freq: "weekly" },
    { route: "/tools/verse",              priority: 0.9, freq: "weekly" },
    { route: "/tools/prayer",             priority: 0.9, freq: "weekly" },
    { route: "/tools/devotional",         priority: 0.9, freq: "weekly" },
    { route: "/biblequiz",                priority: 0.9, freq: "weekly" },
    { route: "/pricing",                  priority: 0.9, freq: "monthly" },
    { route: "/resources",                priority: 0.85, freq: "weekly" },
    { route: "/tools/verse-finder",       priority: 0.75, freq: "monthly" },
    { route: "/community",                priority: 0.7, freq: "monthly" },
    { route: "/community/prayer-wall",    priority: 0.7, freq: "monthly" },
    { route: "/about",                    priority: 0.6, freq: "monthly" },
    { route: "/faq",                      priority: 0.6, freq: "monthly" },
    { route: "/contact",                  priority: 0.6, freq: "monthly" },
    { route: "/support",                  priority: 0.55, freq: "monthly" },
    { route: "/privacy",                  priority: 0.4, freq: "monthly" },
    { route: "/terms",                    priority: 0.4, freq: "monthly" },
    { route: "/refund",                   priority: 0.4, freq: "monthly" },
  ];

  return pages.map(({ route, priority, freq }) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));
}
