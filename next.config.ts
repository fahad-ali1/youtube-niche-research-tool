import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.youtube.com',
      },
    ],
  },
};

export default nextConfig;
