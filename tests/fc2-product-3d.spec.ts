import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { isTrustedProductMannequinModel3d } from "../src/lib/product-3d-api";
import {
  shouldEnableProduct3dViewer,
  type Product3dCapabilitySignals,
} from "../src/lib/product-3d-capability";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const capable: Product3dCapabilitySignals = {
  viewportWidth: 1440,
  saveData: false,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  webgl2: true,
};

test.describe("FC2 progressive product 3D viewer", () => {
  test("enables 3D only for desktop-class capable devices", () => {
    expect(shouldEnableProduct3dViewer(capable)).toBe(true);
    expect(shouldEnableProduct3dViewer({ ...capable, viewportWidth: 767 })).toBe(false);
    expect(shouldEnableProduct3dViewer({ ...capable, viewportWidth: 1023 })).toBe(false);
    expect(shouldEnableProduct3dViewer({ ...capable, saveData: true })).toBe(false);
    expect(shouldEnableProduct3dViewer({ ...capable, deviceMemory: 2 })).toBe(false);
    expect(shouldEnableProduct3dViewer({ ...capable, hardwareConcurrency: 2 })).toBe(false);
    expect(shouldEnableProduct3dViewer({ ...capable, webgl2: false })).toBe(false);
  });

  test("accepts only bounded same-origin streamed GLB contracts", () => {
    const origin = "https://api.lbb.example.test";
    const valid = {
      url: `${origin}/api/v1/products/hoodie/mannequin-3d/file?v=123`,
      format: "glb" as const,
      bytes: 2_000_000,
    };

    expect(isTrustedProductMannequinModel3d(valid, origin)).toBe(true);
    expect(
      isTrustedProductMannequinModel3d(
        { ...valid, url: "https://cdn.example.invalid/model.glb" },
        origin,
      ),
    ).toBe(false);
    expect(
      isTrustedProductMannequinModel3d(
        { ...valid, url: `${origin}/storage/private/model.glb` },
        origin,
      ),
    ).toBe(false);
    expect(isTrustedProductMannequinModel3d({ ...valid, bytes: 13 * 1024 * 1024 }, origin)).toBe(
      false,
    );
  });

  test("keeps Three.js behind the selected 3D gallery panel", () => {
    const gallery = readFileSync(resolve(root, "src/components/lbb/product/Gallery.tsx"), "utf8");
    const viewer = readFileSync(
      resolve(root, "src/components/lbb/product/ProductModel3dViewer.tsx"),
      "utf8",
    );
    const route = readFileSync(resolve(root, "src/routes/product.$slug.tsx"), "utf8");

    expect(gallery).toContain('lazy(() =>');
    expect(gallery).toContain('index === active ? (');
    expect(gallery).toContain('detectProduct3dViewerCapability()');
    expect(gallery).toContain('getProductMannequinModel3d(productSlug)');
    expect(viewer).toContain('from "three"');
    expect(viewer).toContain('GLTFLoader');
    expect(viewer).toContain('OrbitControls');
    expect(route).toContain('productSlug={product.slug} enable3d');
  });

  test("preserves the 2D mannequin as the explicit renderer failure fallback", () => {
    const gallery = readFileSync(resolve(root, "src/components/lbb/product/Gallery.tsx"), "utf8");

    expect(gallery).toContain('setModel3dBroken(true)');
    expect(gallery).toContain('<StyleMannequin');
    expect(gallery).toContain('onError={handleModel3dError}');
  });
});
