import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dskvbzjjfsblibqsgvtu.supabase.co",
        pathname: "/storage/v1/object/public/**", // <-- this is required
      },
      {
        protocol: "https",
        hostname: "dskvbzjjfsblibqsgvtu.supabase.co",
        pathname: "/storage/v1/object/sign/**", // <-- keep this too
      },
    ],
  },
};

export default nextConfig;
