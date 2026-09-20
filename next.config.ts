import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  agentRules: false,
  compiler: {
    emotion: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
