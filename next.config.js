/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // All requests to /api/* will be proxied
        destination: "https://chat-shat-backend.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
