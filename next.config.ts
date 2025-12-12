import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
};

export default nextConfig;
