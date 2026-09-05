import { expect, test, type Page } from "@playwright/test";

const siteOrigin = "https://lbb.example.test";
const localOrigin = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";

function parseJsonLd(source: string[]) {
  return source.flatMap((entry) => {
    try {
      return [JSON.parse(entry) as Record<string, unknown>];
    } catch {
      return [];
    }
  });
}

async function jsonLd(page: Page) {
  return parseJsonLd(await page.locator('script[type="application/ld+json"]').allTextContents());
}

function schemaOfType(schemas: Record<string, unknown>[], type: string) {
  return schemas.find((schema) => schema["@type"] === type);
}

test("clean listings index while faceted states noindex to clean canonicals", async ({ page }) => {
  await page.goto("/shop", { waitUntil: "networkidle" });
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "index, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/shop`);

  await page.goto("/shop?sizes=M&sort=price-asc", { waitUntil: "networkidle" });
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/shop`);

  await page.goto("/hoodies?sizes=M&sort=price-asc", { waitUntil: "networkidle" });
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteOrigin}/hoodies`,
  );
});

test("internal search is crawlable-noindex, canonically clean and still shareable", async ({
  page,
}) => {
  await page.goto("/search?q=هودی&sizes=M", { waitUntil: "networkidle" });

  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteOrigin}/search`,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    `${siteOrigin}/search`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    new RegExp(`^${siteOrigin.replaceAll(".", "\\.")}/`),
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    new RegExp(`^${siteOrigin.replaceAll(".", "\\.")}/`),
  );
});

test("robots exposes noindex HTML to crawlers and advertises absolute sitemap", async ({
  request,
}) => {
  const response = await request.get(`${localOrigin}/robots.txt`);
  expect(response.ok()).toBe(true);
  const body = await response.text();

  expect(body).toContain("User-agent: *");
  expect(body).toContain("Allow: /");
  expect(body).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  expect(body).not.toContain("Disallow: /search");
  expect(body).not.toContain("Disallow: /cart");
  expect(body).not.toContain("Disallow: /checkout");
});

test("sitemap excludes query, utility and F14C draft product URLs", async ({ request }) => {
  const response = await request.get(`${localOrigin}/sitemap.xml`);
  expect(response.ok()).toBe(true);
  const xml = await response.text();

  expect(xml).toContain(`<loc>${siteOrigin}/</loc>`);
  expect(xml).toContain(`<loc>${siteOrigin}/shop</loc>`);
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  expect(locs.length).toBeGreaterThan(0);
  expect(locs.every((loc) => !loc.includes("?"))).toBe(true);

  for (const path of [
    "/search",
    "/cart",
    "/checkout",
    "/account",
    "/wishlist",
    "/order-confirmation",
    "/track-order",
    "/design-system",
  ]) {
    expect(xml).not.toContain(`<loc>${siteOrigin}${path}</loc>`);
  }

  expect(xml).not.toContain(`<loc>${siteOrigin}/product/oversized-black-hoodie</loc>`);
});

test("draft products cannot become Product or Offer structured-data facts", async ({ page }) => {
  await page.goto("/product/oversized-black-hoodie", { waitUntil: "networkidle" });

  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteOrigin}/product/oversized-black-hoodie`,
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    new RegExp(`^${siteOrigin.replaceAll(".", "\\.")}/`),
  );

  const schemas = await jsonLd(page);
  expect(schemaOfType(schemas, "Product")).toBeUndefined();
  expect(schemaOfType(schemas, "Offer")).toBeUndefined();

  const breadcrumbs = schemaOfType(schemas, "BreadcrumbList") as
    { itemListElement?: Array<{ item?: string }> } | undefined;
  expect(breadcrumbs).toBeTruthy();
  expect(breadcrumbs?.itemListElement?.every((item) => item.item?.startsWith(siteOrigin))).toBe(
    true,
  );
});

test("published journal detail exposes Article and absolute breadcrumb contracts", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get(`${localOrigin}/sitemap.xml`)).text();
  const match = sitemap.match(
    new RegExp(`<loc>${siteOrigin.replaceAll(".", "\\.")}(/journal/[^<]+)</loc>`),
  );
  expect(match?.[1]).toBeTruthy();

  await page.goto(match?.[1] ?? "/journal", { waitUntil: "networkidle" });
  const schemas = await jsonLd(page);
  const article = schemaOfType(schemas, "Article") as
    { datePublished?: string; mainEntityOfPage?: string; image?: string } | undefined;
  const breadcrumbs = schemaOfType(schemas, "BreadcrumbList") as
    { itemListElement?: Array<{ item?: string }> } | undefined;

  expect(article).toBeTruthy();
  expect(article?.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
  expect(article?.mainEntityOfPage).toMatch(
    new RegExp(`^${siteOrigin.replaceAll(".", "\\.")}/journal/`),
  );
  expect(article?.image).toMatch(/^https?:\/\//);
  expect(breadcrumbs?.itemListElement?.every((item) => item.item?.startsWith(siteOrigin))).toBe(
    true,
  );
});

test("homepage local schema stays verified and excludes retired search metadata", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const schemas = await jsonLd(page);
  const website = schemaOfType(schemas, "WebSite") as
    { potentialAction?: unknown } | undefined;
  const store = schemaOfType(schemas, "ClothingStore") as
    | {
        description?: string;
        address?: Record<string, unknown>;
        priceRange?: unknown;
        telephone?: unknown;
        openingHours?: unknown;
      }
    | undefined;

  expect(website).toBeTruthy();
  expect(website?.potentialAction).toBeUndefined();
  await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
  expect(store).toBeTruthy();
  expect(store?.description).toContain("پوشاک خیابانی");
  expect(store?.description).toContain("کرج");
  expect(store?.address?.["addressLocality"]).toBe("کرج");
  expect(store?.address?.["addressRegion"]).toBe("البرز");
  expect(store?.address?.["addressCountry"]).toBe("IR");
  expect(store?.address?.["streetAddress"]).toBeUndefined();
  expect(store?.priceRange).toBeUndefined();
  expect(store?.telephone).toBeUndefined();
  expect(store?.openingHours).toBeUndefined();
  expect(JSON.stringify(store)).not.toContain("تهران");
});

test("invalid dynamic and global routes are real noindex 404 responses", async ({ page }) => {
  const productResponse = await page.goto("/product/f20a-missing-product", {
    waitUntil: "networkidle",
  });
  expect(productResponse?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  expect(schemaOfType(await jsonLd(page), "Product")).toBeUndefined();

  const globalResponse = await page.goto("/f20a-definitely-missing-route", {
    waitUntil: "networkidle",
  });
  expect(globalResponse?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page).toHaveTitle("صفحه پیدا نشد | LBB");
});

test("canonical and social metadata basics use absolute production-origin URLs", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/`);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    `${siteOrigin}/`,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /LBB/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /LBB/);
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    /^https:\/\//,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});
