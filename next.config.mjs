/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      // Legacy capitalized URL redirects
      { source: "/Verse", destination: "/verse", permanent: true },
      { source: "/Refund", destination: "/refund", permanent: true },
      { source: "/Blog", destination: "/blog", permanent: true },
      { source: "/Blog/:path*", destination: "/blog/:path*", permanent: true },
      { source: "/Home", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/Courses", destination: "/", permanent: true },
      { source: "/WeeklyDevotional", destination: "/daily-devotional", permanent: true },
      { source: "/Search", destination: "/tools/bible-search", permanent: true },
      // Other legacy redirects
      { source: "/bible-quiz", destination: "/biblequiz", permanent: true },
      { source: "/sign-in", destination: "/login", permanent: true },
      { source: "/premium", destination: "/pricing", permanent: true },
    ];
  },
};
export default nextConfig;
