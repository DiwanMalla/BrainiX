import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: '**.kajabi-cdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.website-files.com',
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
    deviceSizes: [640, 768, 1024, 1280, 1600],
    formats: ['image/webp'],
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.wasm': ['parallel'],
        '*.woff2': ['parallel'],
      },
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
    optimizePackageImports: ['@headlessui/react', '@mui/material', '@emotion/react'],
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable React Server Components
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
