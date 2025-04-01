import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "img.clerk.com"], // Allow images from external domains
  },
};

export default nextConfig;
