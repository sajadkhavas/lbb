import type { ApiFailure, ApiSuccess, CategoryDto } from "@/lib/backend-api";
import {
  BackendApiError,
  getBackendBaseUrl,
  LBB_CONTRACT_VERSION,
  listCategories,
} from "@/lib/backend-api";
import { ensureBackendCsrf } from "@/lib/backend-session";

export type StorefrontCategoryDto = CategoryDto & {
  parentPublicId?: string | null;
  depth?: number;
  icon?: string | null;
  showInHeader?: boolean;
  showOnHome?: boolean;
};

export type AccountCartStateItem = {
  variantId: string;
  slug: string;
  name: string;
  quantity: number;
  priceToman: number;
  colorLabel: string | null;
  sizeLabel: string | null;
};

export type AccountStorefrontState = {
  wishlistSlugs: string[];
  cartItems: AccountCartStateItem[];
};

export type ContactInquiryInput = {
  fullName: string;
  mobile?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  website?: string;
};

export type ContactInquiryResult = {
  inquiry: {
    id: string;
    type: "contact" | "gift" | "corporate";
    status: string;
  };
};

export type PublicOrderTracking = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  deliveryMethod: string | null;
  placedAt: string | null;
  confirmedAt: string | null;
  preparingAt: string | null;
  readyAt: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  trackingCode: string | null;
  shipment: null | {
    status: string;
    carrier: string | null;
    trackingReference: string | null;
    readyAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
};

function requestHeaders(init: RequestInit): Headers {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const method = (init.method ?? "GET").toUpperCase();
  if (typeof document !== "undefined" && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith("XSRF-TOKEN="));
    if (entry) {
      headers.set("X-XSRF-TOKEN", decodeURIComponent(entry.slice("XSRF-TOKEN=".length)));
    }
  }

  return headers;
}

async function requestFinal<T>(path: `/api/v1/${string}`, init: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers: requestHeaders(init),
    });
  } catch {
    throw new BackendApiError("ارتباط با Backend برقرار نشد.", {
      code: "backend_network_error",
    });
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;
  if (!payload) {
    throw new BackendApiError("پاسخ Backend قابل خواندن نیست.", {
      status: response.status,
      code: "backend_invalid_json",
    });
  }

  if (payload.meta?.contractVersion !== LBB_CONTRACT_VERSION) {
    throw new BackendApiError("نسخه قرارداد Backend با Frontend هم‌خوان نیست.", {
      status: response.status,
      code: "contract_version_mismatch",
      meta: payload.meta,
    });
  }

  if (!response.ok || payload.success !== true) {
    const failure = payload as ApiFailure;
    throw new BackendApiError(failure.message || "درخواست Backend ناموفق بود.", {
      status: response.status,
      code: failure.code,
      errors: failure.errors,
      meta: failure.meta,
    });
  }

  return payload;
}

export async function listStorefrontCategories(): Promise<StorefrontCategoryDto[]> {
  const response = await listCategories();
  return response.data as StorefrontCategoryDto[];
}

export async function submitContactInquiry(input: ContactInquiryInput) {
  return requestFinal<ContactInquiryResult>("/api/v1/inquiries", {
    method: "POST",
    body: JSON.stringify({
      type: "contact",
      fullName: input.fullName.trim(),
      mobile: input.mobile?.trim() || null,
      email: input.email?.trim() || null,
      subject: input.subject?.trim() || null,
      message: input.message.trim(),
      website: input.website ?? "",
      metadata: { source: "storefront-contact" },
    }),
  });
}

export async function trackPublicOrder(input: { orderNumber: string; mobile: string }) {
  return requestFinal<PublicOrderTracking>("/api/v1/orders/track", {
    method: "POST",
    body: JSON.stringify({
      orderNumber: input.orderNumber.trim(),
      mobile: input.mobile.trim(),
    }),
  });
}

export async function getAccountStorefrontState() {
  return requestFinal<AccountStorefrontState>("/api/v1/account/storefront-state");
}

export async function replaceAccountWishlist(slugs: string[]) {
  await ensureBackendCsrf();
  return requestFinal<AccountStorefrontState>("/api/v1/account/wishlist", {
    method: "PUT",
    body: JSON.stringify({ slugs: [...new Set(slugs.filter(Boolean))].slice(0, 100) }),
  });
}

export async function replaceAccountCart(items: Array<{ variantId: string; quantity: number }>) {
  await ensureBackendCsrf();
  return requestFinal<AccountStorefrontState>("/api/v1/account/cart", {
    method: "PUT",
    body: JSON.stringify({
      items: items
        .filter((item) => item.variantId && Number.isFinite(item.quantity))
        .map((item) => ({
          variantId: item.variantId,
          quantity: Math.min(20, Math.max(1, Math.floor(item.quantity))),
        }))
        .slice(0, 50),
    }),
  });
}
