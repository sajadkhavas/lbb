import { expect, test } from "@playwright/test";
import { backendCard, backendDecisionModel } from "../src/lib/backend-storefront";
import type { ProductDetailDto, ProductSummaryDto } from "../src/lib/backend-api";
import { mediaForColor } from "../src/lib/product-decision";
import {
  isUsableMannequinProfile,
  mannequinAssetTransform,
  type MannequinProfileDto,
} from "../src/lib/style-mannequin";

const validProfile: MannequinProfileDto = {
  enabled: true,
  assetUrl: "https://api.lbb.example.test/storage/mannequin-front.png",
  slot: "top",
  offsetX: 12.5,
  offsetY: -7.25,
  scale: 1.25,
  layer: 44,
  preset: "top-default",
};

const summaryPayload = {
  publicId: "01FC1TEST",
  slug: "fc1-test-product",
  name: "محصول تست مانکن",
  shortDescription: null,
  category: {
    publicId: "01FC1CATEGORY",
    name: "بالاپوش",
    slug: "tops",
    seo: {
      slug: "tops",
      canonicalPath: "/tops",
      publication: "published",
    },
  },
  price: { from: { amount: 1_000_000, currency: "TOMAN" }, to: null },
  availability: true,
  stockState: "in_stock",
  colors: [],
  sizes: [],
  primaryImage: null,
  seo: {
    slug: "fc1-test-product",
    canonicalPath: "/product/fc1-test-product",
    publication: "published",
  },
  mannequin: validProfile,
} satisfies ProductSummaryDto & { mannequin: MannequinProfileDto };

test.describe("FC1 2D style mannequin contract", () => {
  test("fails closed for incomplete or unsafe profiles", () => {
    expect(isUsableMannequinProfile({ ...validProfile, enabled: false })).toBe(false);
    expect(isUsableMannequinProfile({ ...validProfile, assetUrl: null })).toBe(false);
    expect(
      isUsableMannequinProfile({
        ...validProfile,
        slot: "invalid-slot" as MannequinProfileDto["slot"],
      }),
    ).toBe(false);
    expect(isUsableMannequinProfile({ ...validProfile, offsetX: 51 })).toBe(false);
    expect(isUsableMannequinProfile({ ...validProfile, scale: 2.01 })).toBe(false);
    expect(isUsableMannequinProfile({ ...validProfile, layer: 0 })).toBe(false);
  });

  test("accepts bounded server-backed profiles and builds a deterministic transform", () => {
    expect(isUsableMannequinProfile(validProfile)).toBe(true);
    expect(mannequinAssetTransform(validProfile)).toBe(
      "translate(-50%, -50%) translate(12.5%, -7.25%) scale(1.25)",
    );
  });

  test("maps the additive API field onto backend product cards without affecting legacy payloads", () => {
    expect(backendCard(summaryPayload).mannequin).toEqual(validProfile);

    const { mannequin: _mannequin, ...legacyPayload } = summaryPayload;
    expect(backendCard(legacyPayload).mannequin).toBeNull();
  });

  test("adds a usable live mannequin to PDP media and keeps it when color media changes", () => {
    const color = {
      publicId: "01FC1COLOR",
      name: "ذغالی",
      slug: "charcoal",
      code: "CHARCOAL",
      hex: "#333333",
    };
    const size = {
      publicId: "01FC1SIZE",
      name: "Large",
      code: "L",
    };
    const photo = {
      publicId: "01FC1MEDIA",
      role: "primary",
      sortOrder: 0,
      alt: "تصویر محصول تست مانکن",
      width: 1200,
      height: 1500,
      colorPublicId: color.publicId,
      variantPublicId: null,
      url: "https://api.lbb.example.test/storage/product-front.jpg",
    };
    const detailPayload = {
      ...summaryPayload,
      colors: [color],
      sizes: [size],
      description: null,
      publication: "published",
      collections: [],
      drops: [],
      variants: [
        {
          publicId: "01FC1VARIANT00000000000000",
          sku: "FC1-CHARCOAL-L",
          color,
          size,
          price: { amount: 1_000_000, currency: "TOMAN" },
          compareAtPrice: null,
          availability: true,
          stockState: "in_stock",
          isActive: true,
          mediaPublicIds: [photo.publicId],
        },
      ],
      media: [photo],
      material: null,
      fabricComposition: null,
      fit: null,
      care: null,
      sizeGuide: null,
      breadcrumbs: [],
      mannequin: validProfile,
    } satisfies ProductDetailDto & { mannequin: MannequinProfileDto };

    const model = backendDecisionModel(detailPayload);
    const mannequinMedia = model.media.find((item) => item.mannequin);

    expect(mannequinMedia?.mannequin).toEqual(validProfile);
    expect(mannequinMedia?.src).toBe(validProfile.assetUrl);
    expect(mediaForColor(model, color.publicId).map((item) => item.id)).toEqual([
      photo.publicId,
      `${detailPayload.publicId}:mannequin`,
    ]);
  });
});
