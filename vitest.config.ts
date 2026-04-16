import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['src/**/*.integration.test.{ts,tsx}'],
    environment: 'jsdom', 
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts']
  },
});