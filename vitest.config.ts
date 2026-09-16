import { defineConfig } from "vitest/config";
import path from "node:path";

// tsconfig の @/* エイリアスに合わせる
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
