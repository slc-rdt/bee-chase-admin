/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
};

module.exports = nextConfig;
