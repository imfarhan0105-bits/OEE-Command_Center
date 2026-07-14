import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Compress responses
  compress: true,

  // Optimize package imports — tree-shake heavy libs so only used code is bundled
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "recharts",
      "gsap",
      "framer-motion",
    ],
  },
};

export default nextConfig;
