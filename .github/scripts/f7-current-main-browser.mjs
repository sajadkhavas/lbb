import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const routes = [
  "/collections",
  "/collections/drop-01-shabgard",
  "/collections/drop-02-atashe-sorkh",
  "/collections/capsule-denim",
  "/lookbook",
  "/journal",
  "/journal/chetori-hoodie-eversayz-ro-bepoosim",
  "/journal/tarikhche-farhang-khiaboni-iran",
  "/journal/rahnama-negahdari-libas-streetwear",
  "/journal/rangbandi-dar-street-fashion",
  "/journal/materials-101-parche-shenasi",
  "/about",
  "/faq",
];
const widths = [390, 768, 1440, 1920];
const failures = [];
const browser = await chromium.launch({ headless: true });

for (const width of widths) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: width <= 768 ? 1000 : 1080 } });
    const errors = [];
    const badResponses = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) {
        errors.push(message.text());
      }
    });
    page.on("response", (response) => {
      const url = new URL(response.url());
      if (url.origin === origin && response.status() >= 400 && response.request().resourceType() !== "document") {
        badResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    const response = await page.goto(origin + route, { waitUntil: "networkidle" });
    if (!response || response.status() >= 400) failures.push(`${width}px ${route}: document ${response?.status()}`);
    const h1Count = await page.locator("h1").count();
    if (h1Count !== 1) failures.push(`${width}px ${route}: expected one h1, got ${h1Count}`);
    if ((await page.locator("html").getAttribute("dir")) !== "rtl") failures.push(`${width}px ${route}: html is not rtl`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) failures.push(`${width}px ${route}: horizontal overflow ${overflow}px`);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(350);
    const imagesOkay = await page.locator("main img").evaluateAll((images) =>
      images.every(
        (image) => image.complete && image.naturalWidth > 0 && image.hasAttribute("alt"),
      ),
    );
    if (!imagesOkay) failures.push(`${width}px ${route}: image failed or alt attribute missing`);

    await page.reload({ waitUntil: "networkidle" });
    if ((await page.locator("h1").count()) !== 1) failures.push(`${width}px ${route}: refresh lost heading`);
    if (errors.length) failures.push(`${width}px ${route}: ${errors.join(" | ")}`);
    if (badResponses.length) failures.push(`${width}px ${route}: ${badResponses.join(" | ")}`);
    await page.close();
  }
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin + "/collections/not-real", { waitUntil: "networkidle" });
  if ((await page.getByRole("heading", { level: 1, name: "این کالکشن پیدا نشد" }).count()) !== 1) {
    failures.push("invalid collection slug lacks designed h1 state");
  }
  await page.goto(origin + "/journal/not-real", { waitUntil: "networkidle" });
  if ((await page.getByRole("heading", { level: 1, name: "این مقاله پیدا نشد" }).count()) !== 1) {
    failures.push("invalid journal slug lacks designed h1 state");
  }
  await page.goto(origin + "/lookbook", { waitUntil: "networkidle" });
  const opener = page.locator('button[aria-haspopup="dialog"]').first();
  if ((await opener.count()) === 0) failures.push("lookbook has no dialog opener");
  else {
    await opener.click();
    if ((await page.getByRole("dialog").count()) !== 1) failures.push("lookbook dialog did not open");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Escape");
    if ((await page.getByRole("dialog").count()) !== 0) failures.push("lookbook dialog did not close with Escape");
  }
  await page.goto(origin + "/faq", { waitUntil: "networkidle" });
  const details = page.locator("details").first();
  if ((await details.count()) === 0) failures.push("FAQ has no disclosure items");
  else {
    await details.locator("summary").click();
    if ((await details.getAttribute("open")) === null) failures.push("FAQ disclosure did not open");
  }
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}
console.log("F7 current-main validation passed.");
