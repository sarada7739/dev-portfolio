import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next dev が AGENTS.md に nextjs-agent-rules ブロックを自動追記するのを止める
  agentRules: false,
};

export default nextConfig;

// Cloudflare bindings を next dev から参照できるようにする（公式手順）
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
