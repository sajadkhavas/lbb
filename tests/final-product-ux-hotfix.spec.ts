import { expect, test } from "@playwright/test";
import type { ProductDetailDto, ProductSummaryDto } from "../src/lib/backend-api";
import { backendCard, backendDecisionModel } from "../src/lib/backend-storefront";
import {
  canPurchaseVariant,
  selectedVariantAvailability,
} from "../src/lib/product-decision-policy";
import { isBackendQuickViewTarget } from "../src/lib/quickview";

const summary: ProductSummaryDto = {
  publicId: "01HOTFIXPRODUCT000000000001",
  slug: "hotfix-product",
  name: "محصول تست UX",
  shortDescription: "تست قرارداد کارت محصول",
  category: {
    publicId: "01HOTFIXCATEGORY0000000001",
    name: "بالاپوش",
    slug: "tops",
    seo: {
      slug: "tops",
      canonicalPath: "/tops",
      publication: "published",
    },
  },
  price: {
    from: { amount: 1_250_000, currency: "TOMAN" },
    to: { amount: 1_250_000, currency: "TOMAN" },
  },
  availability: true,
  stockState: "in_stock",
  colors: [
    {
      publicId: "01HOTFIXCOLOR000000000001",
      name: "مشکی",
      slug: "black",
      code: "BLACK",
      hex: "#111111",
    },
  ],
  sizes: [
    { publicId: "01HOTFIXSIZEM000000000001", name: "مدیوم", code: "M" },
    { publicId: "01HOTFIXSIZEL000000000001", name: "لارج", code: "L" },
  ],
  primaryImage: "https://api.lbb.example.test/storage/products/hotfix-1.webp",
  seo: {
    slug: "hotfix-product",
    canonicalPath: "/product/hotfix-product",
    publication: "published",
  },
};

const detail: ProductDetailDto = {
  ...summary,
  description: "توضیحات تست",
  publication: "published",
  collections: [],
  drops: [],
  variants: [
    {
      publicId: "01HOTFIXVARIANTM000000001",
      sku: "HOTFIX-M",
      color: summary.colors[0],
      size: summary.sizes[0],
      price: { amount: 1_250_000, currency: "TOMAN" },
      compareAtPrice: null,
      availability: true,
      stockState: "in_stock",
      isActive: true,
      mediaPublicIds: ["01HOTFIXMEDIA000000000001"],
    },
    {
      publicId: "01HOTFIXVARIANTL000000001",
      sku: "HOTFIX-L",
      color: summary.colors[0],
      size: summary.sizes[1],
      price: { amount: 1_250_000, currency: "TOMAN" },
      compareAtPrice: null,
      availability: false,
      stockState: "out_of_stock",
      isActive: true,
      mediaPublicIds: ["01HOTFIXMEDIA000000000001"],
    },
  ],
  media: [
    {
      publicId: "01HOTFIXMEDIA000000000001",
      role: "gallery",
      sortOrder: 1,
      alt: "تصویر تست محصول",
      width: 1024,
      height: 1280,
      colorPublicId: summary.colors[0].publicId,
      variantPublicId: null,
      url: summary.primaryImage!,
    },
  ],
  material: null,
  fabricComposition: null,
  fit: null,
  care: [],
  sizeGuide: null,
  breadcrumbs: [],
};

test("backend card keeps public sizes and is a valid Quick View target", () => {
  const card = backendCard({
    ...summary,
    previewImages: [
      summary.primaryImage!,
      "https://api.lbb.example.test/storage/products/hotfix-2.webp",
    ],
  } as ProductSummaryDto & { previewImages: string[] });

  expect(card.sizes.map((size) => size.code)).toEqual(["M", "L"]);
  expect(card.previewImages).toHaveLength(2);
  expect(isBackendQuickViewTarget(card)).toBe(true);
});

test("backend Quick View decision model keeps exact variant availability", () => {
  const model = backendDecisionModel(detail);
  const colorId = summary.colors[0].publicId;
  const mediumId = summary.sizes[0].publicId;
  const largeId = summary.sizes[1].publicId;

  const mediumAvailability = selectedVariantAvailability(model.variants, colorId, mediumId);
  const largeAvailability = selectedVariantAvailability(model.variants, colorId, largeId);

  expect(mediumAvailability).toBe("available");
  expect(largeAvailability).toBe("sold-out");
  expect(
    model.variants.find((variant) => variant.colorId === colorId && variant.sizeId === mediumId)
      ?.id,
  ).toBe(detail.variants[0].publicId);
  expect(
    canPurchaseVariant({
      commerceReady: model.readyForCommerce,
      productAvailability: model.stock.availability,
      variantAvailability: mediumAvailability,
    }),
  ).toBe(true);
  expect(
    canPurchaseVariant({
      commerceReady: model.readyForCommerce,
      productAvailability: model.stock.availability,
      variantAvailability: largeAvailability,
    }),
  ).toBe(false);
});

test("product card media fills its frame without the old image inset", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop", { waitUntil: "networkidle" });

  const media = page.locator(".product-card__media").first();
  await expect(media).toBeVisible();
  const image = media.locator("img").first();
  await expect(image).toBeVisible();

  const values = await image.evaluate((element) => {
    const style = getComputedStyle(element);
    const parent = element.parentElement?.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      objectFit: style.objectFit,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      widthDelta: parent ? Math.abs(parent.width - rect.width) : 999,
    };
  });

  expect(values.objectFit).toBe("cover");
  expect(values.paddingTop).toBe("0px");
  expect(values.paddingRight).toBe("0px");
  expect(values.paddingBottom).toBe("0px");
  expect(values.paddingLeft).toBe("0px");
  expect(values.widthDelta).toBeLessThanOrEqual(1);
});

test("PDP keeps mobile composition while desktop receives the polished surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/lbb-classic-hoodie", { waitUntil: "networkidle" });

  const panel = page.getByTestId("pdp-purchase-panel");
  const gallery = page.getByRole("region", { name: /گالری تصاویر/ });
  await expect(panel).toBeVisible();
  await expect(gallery).toBeVisible();

  const mobile = await panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      borderWidth: style.borderTopWidth,
      radius: style.borderTopLeftRadius,
      position: style.position,
    };
  });
  const mobileGalleryRadius = await gallery.evaluate(
    (element) => getComputedStyle(element).borderTopLeftRadius,
  );

  expect(mobile.borderWidth).toBe("0px");
  expect(mobile.radius).toBe("0px");
  expect(mobile.position).not.toBe("fixed");
  expect(Number.parseFloat(mobileGalleryRadius)).toBeGreaterThan(0);

  await page.setViewportSize({ width: 1440, height: 1000 });
  const desktop = await panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      borderWidth: style.borderTopWidth,
      radius: style.borderTopLeftRadius,
      backgroundColor: style.backgroundColor,
      position: style.position,
    };
  });
  const desktopGalleryRadius = await gallery.evaluate(
    (element) => getComputedStyle(element).borderTopLeftRadius,
  );

  expect(Number.parseFloat(desktop.borderWidth)).toBeGreaterThan(0);
  expect(Number.parseFloat(desktop.radius)).toBeGreaterThan(0);
  expect(desktop.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(desktop.position).toBe("sticky");
  expect(Number.parseFloat(desktopGalleryRadius)).toBeGreaterThanOrEqual(12);
});
