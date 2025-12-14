import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
        domains: ['images.unsplash.com'],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "dskvbzjjfsblibqsgvtu.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;