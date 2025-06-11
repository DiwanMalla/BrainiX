import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "**.kajabi-cdn.com",
      },
      {
        protocol: "https",
        hostname: "**.website-files.com",
      },
      {
        protocol: "https",
        hostname: "svgrepo.com",
      },
      {
        protocol: "https",
        hostname: "th.bing.com",
      },
      {
        protocol: "https",
        hostname: "motionbgs.com",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        // Prevent Turbopack from bundling certain packages
        "*.wasm": ["parallel"],
        "*.woff2": ["parallel"],
      },
    },
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
