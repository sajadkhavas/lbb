import { defineConfig, devices } from "@playwright/test";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();
const localBaseUrl = "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 45_000,
  outputDir: "artifacts/playwright/visual-results",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}",
  reporter: [["list"], ["html", { outputFolder: "artifacts/playwright/visual-html", open: "never" }]],
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixelRatio: 0.005,
    },
  },
  use: {
    baseURL: externalBaseUrl || localBaseUrl,
    locale: "fa-IR",
    colorScheme: "dark",
    reducedMotion: "reduce",
    serviceWorkers: "block",
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "npm run preview -- --host 127.0.0.1 --port 4173",
        url: localBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
