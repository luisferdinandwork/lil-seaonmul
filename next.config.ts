import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // Add these settings to prevent timeouts
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
};

export default nextConfig;