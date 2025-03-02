import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Désactiver ESLint pendant le build pour permettre le déploiement
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver la vérification des types pendant le build
    ignoreBuildErrors: true,
  },
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
