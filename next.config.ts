import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ngrok-free.app", // ✅ dev
      },
      {
        protocol: "http",
        hostname: "localhost", // ✅ local dev
      },
      {
        protocol: "http",
        hostname: "10.53.51.134", // ✅ LAN dev
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "api.tbeautyparlour.com", // ✅ new backend domain
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.tbeautyparlour.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
