import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // R2 バケットは Cloudflare 接続（T-013）後に用意する。それまでキャッシュ無効で運用
  // incrementalCache: r2IncrementalCache,
});
