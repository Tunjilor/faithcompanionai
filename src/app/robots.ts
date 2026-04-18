// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/saved",
          "/login",
        ],
      },
    ],
    sitemap: "https://faithcompanionai.com/sitemap.xml",
    host: "https://faithcompanionai.com",
  };
}
