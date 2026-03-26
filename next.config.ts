import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["picsum.photos", "cloud.appwrite.io"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
