import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // Only measure coverage for the pure lib modules we can unit-test in
      // isolation (no Next.js server actions / React components that need a DOM
      // or a real database connection).
      include: ["src/lib/**/*.ts"],
      // Exclude test files themselves and server-only infrastructure files
      // that require a live database / Next.js runtime (unmockable in unit tests)
      exclude: [
        "src/lib/**/*.test.ts",
        "src/lib/auth.ts",
        "src/lib/auth.config.ts",
        "src/lib/prisma.ts",
      ],
      reporter: ["text", "lcov", "json-summary"],
      // Output to standard location so any coverage tool can find it
      reportsDirectory: "./coverage",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
