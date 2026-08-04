import { chromium } from "playwright";

const origin = "http://127.0.0.1:4173";
const productRoute = "/product/lbb-classic-hoodie";
const failures = [];
const browser = await chromium.launch({ headless: true });
const routes = [
  "/cart",
  "/checkout",
  "/contact",
  "/order-confirmation",
  "/track-order",
  "/shipping-returns",
  "/terms",
  "/privacy",
  productRoute,
];

for (const width of [390, 768, 1440, 1920]) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: width < 900 ? 1000 : 1080 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) {
        errors.push(message.text());
      }
    });

    const response = await page.goto(origin + route, { waitUntil: "networkidle" });
    if (!response || response.status() >= 400) failures.push(`${width}px ${route}: status ${response?.status()}`);
    if ((await page.locator("h1").count()) !== 1) failures.push(`${width}px ${route}: expected one h1`);
    if ((await page.locator("html").getAttribute("dir")) !== "rtl") failures.push(`${width}px ${route}: html not rtl`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) failures.push(`${width}px ${route}: horizontal overflow ${overflow}px`);
    if (errors.length) failures.push(`${width}px ${route}: ${errors.join(" | ")}`);
    await page.close();
  }
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto(origin + "/checkout", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle" });
  if ((await page.getByText("سبد خرید خالی است", { exact: true }).count()) !== 1) failures.push("empty checkout not blocked");

  await page.evaluate(() => {
    localStorage.setItem(
      "lbb-cart-v1",
      JSON.stringify([
        {
          slug: "lbb-classic-hoodie",
          name: "هودی کلاسیک LBB",
          price: 1_850_000,
          color: "#0A0A0A",
          size: "L",
          qty: 2,
        },
      ]),
    );
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByLabel("نام و نام‌خانوادگی").fill("کاربر آزمایشی");
  await page.getByLabel("شماره موبایل").fill("09123456789");
  await page.getByLabel("استان").selectOption("تهران");
  await page.getByLabel("شهر").fill("تهران");
  await page.getByLabel("آدرس کامل").fill("تهران، خیابان آزمایشی، پلاک ۱۲");
  await page.getByLabel("کد پستی").fill("1234567890");
  await page.getByRole("button", { name: "مشاهده خلاصه نمایشی" }).click();

  if ((await page.locator('input[type="radio"]').count()) !== 0) failures.push("payment radios remain");
  if ((await page.getByText(/زرین‌پال|ایدی‌پی/).count()) !== 0) failures.push("named payment gateway remains");

  await page.getByRole("button", { name: "ساخت پیش‌نمایش سفارش" }).click();
  await page.waitForURL(`${origin}/order-confirmation`);
  const current = new URL(page.url());
  if (current.searchParams.size !== 0) failures.push("preview URL contains query data");

  const stored = await page.evaluate(() => sessionStorage.getItem("lbb-demo-orders-v1") ?? "");
  let ref = "";
  try {
    ref = JSON.parse(stored)?.[0]?.ref ?? "";
  } catch {
    failures.push("stored demo summary is invalid JSON");
  }
  if (!/^\d{6}$/.test(ref)) failures.push("latest demo ref missing from sessionStorage");
  for (const secret of ["کاربر آزمایشی", "09123456789", "1234567890", "خیابان آزمایشی"]) {
    if (stored.includes(secret)) failures.push(`personal value leaked into sessionStorage: ${secret}`);
  }

  const confirmationHeading = page.getByRole("heading", {
    level: 1,
    name: "پیش‌نمایش سفارش ساخته شد",
  });
  await confirmationHeading.waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await confirmationHeading.waitFor();

  await page.goto(origin + "/track-order", { waitUntil: "networkidle" });
  await page.getByLabel("کد مرجع شش‌رقمی").fill(ref || "000000");
  await page.getByRole("button", { name: "بررسی" }).click();
  if ((await page.getByText("ثبت نشده", { exact: true }).count()) !== 1) failures.push("track page did not show truthful status");

  await page.goto(origin + "/cart", { waitUntil: "networkidle" });
  if ((await page.getByText("سبد خرید شما خالی است", { exact: true }).count()) !== 1) failures.push("cart not cleared after preview");
  await context.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin + "/contact", { waitUntil: "networkidle" });
  if ((await page.locator("form").count()) !== 0) failures.push("contact still has fake form");
  if ((await page.locator('a[href="https://www.instagram.com/lbbclo"]').count()) < 1) failures.push("official Instagram missing");

  for (const route of ["/checkout", "/contact", "/shipping-returns", "/terms", "/privacy", productRoute]) {
    await page.goto(origin + route, { waitUntil: "networkidle" });
    const body = await page.locator("body").innerText();
    for (const forbidden of [
      "زرین‌پال",
      "ایدی‌پی",
      "پیام شما ارسال شد",
      "ارسال به سراسر ایران، معمولاً ۲ تا ۵ روز کاری",
      "امکان مرجوعی و تعویض تا ۷ روز پس از دریافت",
      "پرداخت در محل تهران",
    ]) {
      if (body.includes(forbidden)) failures.push(`${route}: unsupported claim: ${forbidden}`);
    }
  }
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}
console.log("F6 final browser validation passed.");
