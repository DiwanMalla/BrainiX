import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "img.clerk.com",
      "plus.unsplash.com",
      "kajabi-storefronts-production.kajabi-cdn.com",
      "assets-global.website-files.com",
      "svgrepo.com",
      "th.bing.com",
      "motionbgs.com",
      "via.placeholder.com",
    ], // Allow images from external domains
  },
};

export default nextConfig;
