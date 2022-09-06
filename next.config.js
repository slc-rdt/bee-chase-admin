/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["bluejack.binus.ac.id", "ui-avatars.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/games/:id",
        destination: "/games/:id/missions",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${process.env.BEECHASE_API_URL}/:path*`,
      },
      {
        source: "/bluejack/:path*",
        destination: `${process.env.BLUEJACK_API_URL}/:path*`,
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

module.exports = withBundleAnalyzer(nextConfig);
