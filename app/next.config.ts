import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'maps.googleapis.com', 'staticmap.openstreetmap.de'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'staticmap.openstreetmap.de',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
