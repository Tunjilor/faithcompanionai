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
          "/dashboard/",
          "/saved",
          "/saved/",
          "/login",
          "/sign-in",
          "/profile",
          "/profile/",
          "/reset-password",
          "/resources/favorites",
          "/resources/wrapped",
          "/premium",
        ],
      },
    ],
    sitemap: "https://faithcompanionai.com/sitemap.xml",
    host: "https://faithcompanionai.com",
  };
}
