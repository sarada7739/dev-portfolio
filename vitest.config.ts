import { defineConfig } from "vitest/config";
import path from "node:path";

// テストでも tsconfig と同じ @/* エイリアスでモジュールを参照できるようにする
export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
