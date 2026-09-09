import { expect, test } from "@playwright/test";
import { backendCard } from "../src/lib/backend-storefront";
import type { ProductSummaryDto } from "../src/lib/backend-api";
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
    const payload = {
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

    expect(backendCard(payload).mannequin).toEqual(validProfile);

    const { mannequin: _mannequin, ...legacyPayload } = payload;
    expect(backendCard(legacyPayload).mannequin).toBeNull();
  });
});
