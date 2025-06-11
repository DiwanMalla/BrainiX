import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'kajabi-storefronts-production.kajabi-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'assets-global.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'svgrepo.com',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'motionbgs.com',
      },
    ],
  },
};

export default nextConfig;
