import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    qualities: [70, 75, 80, 85],
    unoptimized: true,
  },
};

export default nextConfig;
