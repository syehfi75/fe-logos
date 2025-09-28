import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://images.pexels.com/**"),
      new URL("https://dummyimage.com/**"),
      new URL("https://api.afzan.co/**"),
    ],
  },
};

export default nextConfig;
