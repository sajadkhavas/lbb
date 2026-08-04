import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const failures = [];
const widths = [390, 768, 1440, 1920];
const normalRoutes = [
  "/shop",
  "/shop?sort=price-asc",
  "/shop?cats=hoodies,pants&colors=%230A0A0A&sizes=M&instock=true&sort=price-asc",
  "/hoodies",
  "/search?q=%D9%87%D9%88%D8%AF%DB%8C",
  "/product/lbb-classic-hoodie",
];
const knownRootDocumentErrors = [
  "<html> cannot be a child of <#document>",
  "<head> cannot be a child of <#document>",
  "<body> cannot be a child of <#document>",
];

const checkPage = async (page, route, width) => {
  const errors = [];
  const failedResources = new Set();
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (text.startsWith("Failed to load resource:")) return;
    if (!knownRootDocumentErrors.some((known) => text.includes(known))) {
      errors.push(`console: ${text}`);
    }
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() < 400 || response.request().resourceType() === "document") return;
    failedResources.add(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto(origin + route, { waitUntil: "networkidle" });
  if (!response || response.status() >= 400) {
    failures.push(`${width}px ${route}: status ${response?.status() ?? "none"}`);
    return;
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
};

for (const width of widths) {
  for (const route of normalRoutes) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await checkPage(page, route, width);
    await page.close();
  }
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin + "/shop", { waitUntil: "networkidle" });
  await page.getByLabel("مرتب‌سازی محصولات").click();
  await page.getByRole("option", { name: "ارزان‌ترین" }).click();
  await page.waitForURL(/sort=price-asc/);
  await page.getByText("فقط کالاهای موجود", { exact: true }).click();
  await page.waitForURL(/instock=true/);
  await page.goBack({ waitUntil: "networkidle" });
  if (!new URL(page.url()).searchParams.has("sort") || new URL(page.url()).searchParams.has("instock")) {
    failures.push("history back did not restore sort-only state");
  }
  await page.goBack({ waitUntil: "networkidle" });
  if (new URL(page.url()).pathname !== "/shop" || new URL(page.url()).search) {
    failures.push("history back did not restore clean /shop");
  }
  await page.goForward({ waitUntil: "networkidle" });
  if (new URL(page.url()).searchParams.get("sort") !== "price-asc") {
    failures.push("history forward did not restore sort state");
  }
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(origin + "/shop?sort=newest&cats=pants,hoodies,hoodies&bogus=1", {
    waitUntil: "networkidle",
  });
  const params = new URL(page.url()).searchParams;
  if (params.get("cats") !== "hoodies,pants" || params.has("sort") || params.has("bogus")) {
    failures.push(`canonical cleanup failed: ${page.url()}`);
  }

  const trigger = page.locator('button[aria-label^="نمای سریع"]').first();
  await trigger.evaluate((element) => element.setAttribute("data-qv-trigger", "true"));
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  if (!(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null))) {
    failures.push("Quick View did not move focus into dialog");
  }
  await page.keyboard.press("Shift+Tab");
  if (!(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null))) {
    failures.push("Quick View Shift+Tab escaped dialog");
  }
  await page.keyboard.press("Tab");
  if (!(await page.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null))) {
    failures.push("Quick View Tab escaped dialog");
  }
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  await page.waitForTimeout(100);
  if (!(await page.evaluate(() => document.activeElement?.getAttribute("data-qv-trigger") === "true"))) {
    failures.push("Quick View did not restore focus to trigger");
  }
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(origin + "/product/lbb-classic-hoodie", { waitUntil: "networkidle" });
  const gallery = page.getByRole("region", { name: /گالری تصاویر/ });
  await gallery.focus();
  await page.keyboard.press("End");
  await page.getByText("تصویر 4 از 4", { exact: true }).waitFor();
  await page.keyboard.press("Home");
  await page.getByText("تصویر 1 از 4", { exact: true }).waitFor();
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}
console.log("Owned F4/F5 browser behavior passed at 390, 768, 1440 and 1920.");
