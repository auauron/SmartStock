import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './E2E',
  /* The E2E suite shares one Supabase test user/database, so keep tests serialized. */
  workers: 1,
  fullyParallel: false,
  /* Clear any leftover data from aborted/manual runs before tests start. */
  globalSetup: './E2E/helpers/globalSetup.ts',
  /* Run this script after all tests complete */
  globalTeardown: './E2E/helpers/globalTeardown.ts',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:5174',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  //  Run your local dev server before starting the tests */
  webServer: {
    command: 'npx vite --mode test --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: false,
  },

});
