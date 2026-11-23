import { defineConfig, devices } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

const baseURL = externalBaseURL ?? "http://127.0.0.1:4173";

const defaultStorageState = {
  cookies: [],
  origins: [
    {
      origin: new URL(baseURL).origin,
      localStorage: [
        {
          name: "lbb_brand_intro_v1_seen",
          value: "1",
        },
      ],
    },
  ],
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "list",

  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.015,
    },
  },

  use: {
    baseURL,
    storageState: defaultStorageState,
    locale: "fa-IR",
    timezoneId: "Asia/Tehran",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  webServer: externalBaseURL
    ? undefined
    : {
        command: "node scripts/playwright-webserver.mjs",

        // Readiness must not trigger SSR before
        // Playwright itself reaches the target page.
        url: `${baseURL}/manifest.webmanifest`,

        reuseExistingServer: false,
        timeout: 180_000,

        env: {
          VITE_SITE_URL: "https://lbb.example.test",
          VITE_LBB_BACKEND_MODE: "prototype",
        },
      },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
