import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["src/**/*.integration.test.{ts,tsx}"],
          environment: "node",
          globals: true,
          setupFiles: ["./src/__tests__/setup.ts"],
        },
      },
      {
        test: {
          name: "integration",
          include: ["src/**/*.integration.test.{ts,tsx}"],
          environment: "node",
          globals: true,
        },
      },
    ],
  },
});
