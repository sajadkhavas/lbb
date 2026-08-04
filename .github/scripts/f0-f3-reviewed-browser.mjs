import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const failures = [];
const widths = [390, 768, 1440, 1920];
const knownRootDocumentErrors = [
  "<html> cannot be a child of <#document>",
  "<head> cannot be a child of <#document>",
  "<body> cannot be a child of <#document>",
];

async function inspectPage(route, width) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  const errors = [];
  const failedResources = new Set();
  const lovableRequests = new Set();

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (text.startsWith("Failed to load resource:")) return;
    if (!knownRootDocumentErrors.some((known) => text.includes(known))) {
      errors.push(`console: ${text}`);
    }
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("request", (request) => {
    if (request.url().includes("/__l5e/")) lovableRequests.add(request.url());
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.origin !== origin || response.status() < 400) return;
    if (response.request().resourceType() === "document") return;
    failedResources.add(`${response.status()} ${url.pathname}`);
  });

  const response = await page.goto(origin + route, { waitUntil: "networkidle" });
  if (!response || (response.status() >= 400 && route === "/")) {
    failures.push(`${width}px ${route}: status ${response?.status() ?? "none"}`);
  }
  await page.reload({ waitUntil: "networkidle" });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 2) failures.push(`${width}px ${route}: horizontal overflow ${overflow}px`);
  if (errors.length) failures.push(`${width}px ${route}: ${errors.join(" | ")}`);
  if (failedResources.size) {
    failures.push(`${width}px ${route}: resources ${Array.from(failedResources).join(" | ")}`);
  }
  if (lovableRequests.size) {
    failures.push(`${width}px ${route}: Lovable-only assets requested`);
  }

  await page.close();
}

for (const width of widths) {
  await inspectPage("/", width);
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin + "/", { waitUntil: "networkidle" });

  await page.getByRole("heading", { name: /استایل/ }).waitFor();
  await page.getByRole("heading", { name: "دراپ بعدی در حال طراحی است" }).waitFor();

  if ((await page.locator('input[type="email"]').count()) !== 0) {
    failures.push("homepage still exposes a fake newsletter email form");
  }
  if ((await page.locator('img[src*="/__l5e/"]').count()) !== 0) {
    failures.push("homepage logo still depends on a Lovable-only asset");
  }
  if ((await page.locator('a[href="/lookbook"]', { hasText: "مشاهده لوک‌بوک" }).count()) === 0) {
    failures.push("hero secondary CTA does not lead to the lookbook");
  }

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = schemas.map((text) => JSON.parse(text));
  const website = parsed.find((schema) => schema["@type"] === "WebSite");
  const organization = parsed.find((schema) => schema["@type"] === "Organization");
  const store = parsed.find((schema) => schema["@type"] === "ClothingStore");
  const absolute = (value) => typeof value === "string" && value.startsWith("https://lbb.example.test/");
  if (!website || !absolute(website.url)) failures.push("WebSite schema URL is not absolute");
  if (!organization || !absolute(organization.url) || !absolute(organization.logo)) {
    failures.push("Organization schema URLs are not absolute");
  }
  if (!store || !absolute(store.url) || !absolute(store.logo)) {
    failures.push("ClothingStore schema URLs are not absolute");
  }
  if (!website?.potentialAction?.target?.urlTemplate?.startsWith("https://lbb.example.test/search")) {
    failures.push("SearchAction URL template is not absolute");
  }

  const menuButton = page.getByRole("button", { name: "منو" });
  await menuButton.click();
  const menu = page.getByRole("dialog", { name: "منوی اصلی" });
  await menu.waitFor();
  if (!(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null))) {
    failures.push("main menu did not move focus into the dialog");
  }
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "detached" });

  const searchButton = page.getByRole("button", { name: "جست‌وجو" });
  await searchButton.click();
  const searchDialog = page.getByRole("dialog", { name: "جست‌وجوی محصولات" });
  await searchDialog.waitFor();
  await page.getByRole("searchbox", { name: "عبارت جست‌وجو" }).fill("هودی");
  await page.getByText("هودی کلاسیک LBB", { exact: true }).first().waitFor();
  await page.keyboard.press("Escape");
  await searchDialog.waitFor({ state: "detached" });

  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  const cart = page.getByRole("button", { name: /باز کردن سبد خرید/ });
  if ((await cart.count()) !== 1) failures.push("mobile cart action is not uniquely labelled");
  if ((await page.locator('a[href="#main"]').count()) !== 1) failures.push("homepage skip link is missing");
  await page.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  if (await page.evaluate(() => document.documentElement.classList.contains("lbb-custom-cursor"))) {
    failures.push("custom cursor remains enabled under reduced motion");
  }
  await context.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const response = await page.goto(origin + "/missing-f0-f3-page", { waitUntil: "networkidle" });
  if (!response || ![200, 404].includes(response.status())) {
    failures.push(`not-found route returned ${response?.status() ?? "none"}`);
  }
  await page.getByRole("heading", { name: "این صفحه وجود ندارد" }).waitFor();
  await page.close();
}

{
  const sw = await fetch(origin + "/sw.js");
  const swText = await sw.text();
  if (!sw.ok || !swText.includes("lbb-2026-08-f0-f3")) {
    failures.push("production service worker is not served as a static asset");
  }

  const manifest = await fetch(origin + "/manifest.webmanifest");
  const data = await manifest.json();
  if (!manifest.ok || data.theme_color !== "#050505" || data.background_color !== "#050505") {
    failures.push("web manifest is missing the reviewed design-token colors");
  }
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log("Reviewed F0-F3 browser and foundation behavior passed.");
