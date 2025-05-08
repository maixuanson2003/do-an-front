import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // 👈 hoặc lớn hơn tùy file mp3
    },
  },
};

export default nextConfig;
