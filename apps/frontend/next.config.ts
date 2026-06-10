import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Manually define the monorepo root directory for Turbopack to prevent it from going to C:\Dotun_Projects
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
