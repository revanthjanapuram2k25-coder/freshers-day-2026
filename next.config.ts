import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "butterfly-historic-furnished-elegant.trycloudflare.com",
  ],
};

export default nextConfig;
