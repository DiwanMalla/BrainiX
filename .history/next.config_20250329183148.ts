import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "your-image-domain.com"], // Allow images from external domains
  },
};

export default nextConfig;
