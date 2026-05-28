/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: "/bible-quiz",
        destination: "/biblequiz",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/premium",
        destination: "/pricing",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
