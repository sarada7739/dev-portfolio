import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next dev による AGENTS.md への nextjs-agent-rules の自動追記を防ぐ
  agentRules: false,
  async rewrites() {
    return [
      {
        source: "/editions/:edition(classic|neon)",
        destination: "/editions/:edition.html",
      },
      { source: "/opengraph-image", destination: "/opengraph-image.png" },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

// 公式手順に従い、next dev で Cloudflare のバインディングを参照できるようにする
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
