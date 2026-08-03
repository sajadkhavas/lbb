import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();
const localBaseUrl = "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: "artifacts/playwright/results",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/playwright/results.json" }],
    ["html", { outputFolder: "artifacts/playwright/html", open: "never" }],
  ],
  use: {
    baseURL: externalBaseUrl || localBaseUrl,
    locale: "fa-IR",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    serviceWorkers: "allow",
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "npm run preview -- --host 127.0.0.1 --port 4173",
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ...process.env,
          VITE_SITE_URL: process.env.VITE_SITE_URL || "https://lbb.test",
        },
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
