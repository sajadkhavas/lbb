import {
  getBackendBaseUrl,
  LBB_CONTRACT_VERSION,
  type ApiSuccess,
} from "@/lib/backend-api";

export type ProductMannequinModel3dDto = {
  url: string;
  format: "glb";
  bytes: number;
};

const MAX_MODEL_BYTES = 12 * 1024 * 1024;

function isTrustedModel(
  value: unknown,
  backendOrigin: string,
): value is ProductMannequinModel3dDto {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ProductMannequinModel3dDto>;
  if (candidate.format !== "glb") return false;
  if (typeof candidate.url !== "string" || candidate.url.trim() === "") return false;
  if (
    typeof candidate.bytes !== "number" ||
    !Number.isFinite(candidate.bytes) ||
    candidate.bytes <= 0 ||
    candidate.bytes > MAX_MODEL_BYTES
  ) {
    return false;
  }

  try {
    const base = new URL(backendOrigin);
    const url = new URL(candidate.url, backendOrigin);

    return (
      url.origin === base.origin &&
      url.pathname.startsWith("/api/v1/products/") &&
      url.pathname.endsWith("/mannequin-3d/file")
    );
  } catch {
    return false;
  }
}

export async function getProductMannequinModel3d(
  productSlug: string,
): Promise<ProductMannequinModel3dDto | null> {
  const backendOrigin = getBackendBaseUrl();
  const url = `${backendOrigin}/api/v1/products/${encodeURIComponent(productSlug)}/mannequin-3d`;

  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as ApiSuccess<unknown>;
    if (
      payload.success !== true ||
      payload.meta?.contractVersion !== LBB_CONTRACT_VERSION ||
      !isTrustedModel(payload.data, backendOrigin)
    ) {
      return null;
    }

    return {
      ...payload.data,
      url: new URL(payload.data.url, backendOrigin).toString(),
    };
  } catch {
    // 3D is progressive enhancement. Any discovery/network/contract error must leave
    // the already-rendered 2D mannequin untouched rather than breaking the PDP.
    return null;
  }
}

export { isTrustedModel as isTrustedProductMannequinModel3d };
