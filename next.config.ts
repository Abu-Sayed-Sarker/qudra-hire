import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  allowedDevOrigins: ["10.10.29.153", "10.10.29.156"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
       {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
