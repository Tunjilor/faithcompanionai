// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://faithcompanionai.com";

  const routes = [
    "",
    "/about",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/refund",
    "/pricing",
    "/resources",
    "/saved",
    "/dashboard",
    "/biblequiz",
    "/tools/verse",
    "/tools/prayer",
    "/tools/devotional",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency:
      route === ""
        ? "weekly"
        : route.startsWith("/tools")
        ? "weekly"
        : route === "/pricing" || route === "/resources" || route === "/biblequiz" || route === "/saved"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/pricing" || route === "/resources" || route === "/saved"
        ? 0.9
        : route.startsWith("/tools") || route === "/biblequiz"
        ? 0.85
        : 0.7,
  }));
}