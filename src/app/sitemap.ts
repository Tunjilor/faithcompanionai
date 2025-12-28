import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://faithcompanionai.com";

  const routes = [
    "/",
    "/dashboard",
    "/pricing",
    "/biblequiz",
    "/resources",
    "/community/prayer-wall",
    "/tools/verse",
    "/tools/prayer",
    "/tools/devotional",
    "/tools/prayer-journal",
    "/tools/scripture-memory",
    "/tools/verse-finder",
    "/about",
    "/privacy",
    "/terms",
    "/refund",
    "/faq",
    "/contact",
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
