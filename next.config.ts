import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance: tree-shake heavy libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Image optimization: AVIF → WebP fallback chain
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
