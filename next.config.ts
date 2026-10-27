import os from "os";
import type { NextConfig } from "next";

function getAllowedDevOrigins(): string[] {
  const origins = new Set<string>([
    "localhost",
    "127.0.0.1",
    "192.168.100.7",
  ]);

  const interfaces = os.networkInterfaces();
  for (const list of Object.values(interfaces)) {
    for (const iface of list ?? []) {
      if (iface.family === "IPv4" && !iface.internal && iface.address) {
        origins.add(iface.address);
      }
    }
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: getAllowedDevOrigins(),
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
