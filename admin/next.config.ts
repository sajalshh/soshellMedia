import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // All API calls go through BACKEND_URL env var — no rewrites needed in production.
  // In dev: set BACKEND_URL=http://localhost:3001 in .env.local
};

export default nextConfig;
