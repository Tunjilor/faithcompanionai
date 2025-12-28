import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://faithcompanionai.com";

  const routes = [
    "",
    "/about",
    "/pricing",
    "/dashboard",
    "/tools/verse",
    "/tools/prayer",
    "/tools/devotional",
    "/tools/prayer-journal",
    "/tools/scripture-memory",
    "/tools/verse-finder",
    "/community",
    "/community/prayer-wall",
    "/biblequiz",
    "/resources",
    "/resources/christian-living",
    "/resources/favorites",
    "/privacy",
    "/terms",
    "/refund",
    "/faq",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

