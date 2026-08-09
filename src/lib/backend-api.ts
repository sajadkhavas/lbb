export const LBB_CONTRACT_VERSION = "2026-08-09-f14-be-f1" as const;

export type BackendMode = "live" | "prototype";
export type StockState = "in_stock" | "low_stock" | "out_of_stock" | "unavailable";
export type DeliveryMethod = "standard" | "pickup";

export type Money = {
  amount: number;
  currency: "TOMAN";
};

export type ApiMeta = {
  requestId?: string;
  apiVersion: string;
  contractVersion: string;
  pagination?: Pagination;
  links?: {
    self?: string | null;
    next?: string | null;
    previous?: string | null;
  };
  replayed?: boolean;
  retryAfter?: number;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: ApiMeta;
  message?: string;
};

export type ApiFailure = {
  success: false;
  code: string;
  message: string;
  errors: Record<string, unknown>;
  meta: ApiMeta;
};

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  from: number | null;
  to: number | null;
  hasMore: boolean;
};

export type SeoDto = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug: string;
  canonicalPath: string;
  publication: "published";
  primaryImage?: string | null;
  updatedAt?: string | null;
  breadcrumbs?: Array<{ label: string; path: string }>;
  structuredData?: {
    name: string;
    description?: string | null;
    priceCurrency: "TOMAN";
    lowPrice?: number | null;
    highPrice?: number | null;
    availability: "in_stock" | "out_of_stock";
  };
};

export type CategoryDto = {
  publicId: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  productCount?: number;
  seo: SeoDto;
};

export type CollectionDto = {
  publicId: string;
  name: string;
  slug: string;
  description?: string | null;
  isFeatured?: boolean;
  productCount?: number;
  seo: SeoDto;
};

export type DropDto = {
  publicId: string;
  name: string;
  slug: string;
  description?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isFeatured?: boolean;
  seo: SeoDto;
};

export type ColorDto = {
  publicId: string;
  name: string;
  slug: string;
  code: string;
  hex: string | null;
};

export type SizeDto = {
  publicId: string;
  name: string;
  code: string;
};

export type ProductSummaryDto = {
  publicId: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  category: CategoryDto;
  price: { from: Money | null; to: Money | null };
  availability: boolean;
  stockState: StockState;
  colors: ColorDto[];
  sizes: SizeDto[];
  primaryImage: string | null;
  seo: SeoDto;
};

export type VariantDto = {
  publicId: string;
  sku: string | null;
  color: ColorDto | null;
  size: SizeDto | null;
  price: Money;
  compareAtPrice: Money | null;
  availability: boolean;
  stockState: StockState;
  isActive: true;
  mediaPublicIds: string[];
};

export type MediaDto = {
  publicId: string;
  role: string;
  sortOrder: number;
  alt: string | null;
  width: number | null;
  height: number | null;
  colorPublicId: string | null;
  variantPublicId: string | null;
  url: string;
};

export type SizeGuideDto = {
  publicId: string;
  name: string;
  description: string | null;
  unit: string;
  definitions: Array<{ publicId: string; code: string; label: string }>;
  sizes: Array<{
    size: SizeDto;
    measurements: Array<{
      definitionPublicId: string;
      code: string;
      value: string;
      notes: string | null;
    }>;
  }>;
};

export type ProductDetailDto = ProductSummaryDto & {
  description: string | null;
  publication: "published";
  collections: CollectionDto[];
  drops: DropDto[];
  variants: VariantDto[];
  media: MediaDto[];
  material: string | null;
  fabricComposition: string | null;
  fit: string | null;
  care: string[] | string | null;
  sizeGuide: SizeGuideDto | null;
  breadcrumbs: Array<{ label: string; path: string }>;
};

export type FacetsDto = {
  categories: CategoryDto[];
  collections: CollectionDto[];
  colors: ColorDto[];
  sizes: SizeDto[];
  price: { min: Money | null; max: Money | null };
  availability: Array<"in_stock" | "out_of_stock">;
  sorts: Array<"newest" | "price_asc" | "price_desc">;
};

export type CatalogQuery = {
  q?: string;
  category?: string;
  collection?: string;
  color?: string;
  size?: string;
  availability?: "in_stock" | "out_of_stock";
  min_price?: number;
  max_price?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  per_page?: number;
};

export type CustomerDto = {
  id: string;
  mobile: string;
  fullName: string | null;
  email: string | null;
  mobileVerified: boolean;
  marketingConsent: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OtpChallengeDto = {
  challengeId: string;
  expiresAt?: string;
  retryAfter?: number;
  testCode?: string;
};

export type CartLineRequest = {
  variantId: string;
  quantity: number;
  expectedUnitPriceToman?: number;
};

export type CustomerCheckoutInput = {
  fullName: string;
  mobile: string;
  province?: string | null;
  city?: string | null;
  address?: string | null;
  postalCode?: string | null;
  notes?: string | null;
};

export type CartRequest = {
  addressId?: string | null;
  customer?: CustomerCheckoutInput | null;
  deliveryMethod: DeliveryMethod;
  items: CartLineRequest[];
};

export type ValidatedCartItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  productCode: string | null;
  sku: string;
  colorName: string;
  sizeName: string;
  unitPriceToman: number;
  quantity: number;
  lineTotalToman: number;
  available: number;
  expectedUnitPriceToman?: number | null;
  unitPrice: Money;
  lineTotal: Money;
};

export type CartTotals = {
  subtotal: Money;
  deliveryFee: Money;
  packagingFee: Money;
  discount: Money;
  grandTotal: Money;
};

export type CartValidationDto = {
  items: ValidatedCartItem[];
  delivery: { method: DeliveryMethod; zoneId: string | null };
  totals: CartTotals;
  currency: "TOMAN";
};

export type CheckoutQuoteDto = CartValidationDto & {
  quoteId: string;
  status: string;
  expiresAt: string;
};

export type OrderItemDto = {
  id?: string;
  productId?: string;
  variantId?: string;
  productName?: string;
  variantName?: string;
  sku?: string | null;
  colorName?: string | null;
  sizeName?: string | null;
  quantity?: number;
  unitPriceToman?: number;
  lineTotalToman?: number;
  [key: string]: unknown;
};

export type OrderDto = {
  id: string;
  number: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentStatusLabel: string;
  currency: "TOMAN";
  delivery: {
    method: DeliveryMethod;
    methodLabel: string;
    feeToman: number;
    fee: Money;
    zone: { id: string; name: string } | null;
  };
  totals: {
    subtotalToman: number;
    deliveryFeeToman: number;
    packagingFeeToman: number;
    discountToman: number;
    grandTotalToman: number;
    subtotal: Money;
    deliveryFee: Money;
    packagingFee: Money;
    discount: Money;
    grandTotal: Money;
  };
  itemCount: number;
  processing: { minDays: number; maxDays: number };
  recipient: {
    fullName: string;
    mobile: string;
    province: string | null;
    city: string | null;
    address: string | null;
    postalCode: string | null;
    notes: string | null;
  };
  fulfillment: {
    trackingCode: string | null;
    confirmedAt: string | null;
    preparingAt: string | null;
    readyAt: string | null;
    dispatchedAt: string | null;
    deliveredAt: string | null;
  };
  shipment: Record<string, unknown> | null;
  items: OrderItemDto[];
  payments: Array<Record<string, unknown>>;
  returns: Array<Record<string, unknown>>;
  exchanges: Array<Record<string, unknown>>;
  refunds: Array<Record<string, unknown>>;
  timeline: Array<{ from: string | null; to: string; label: string; createdAt: string | null }>;
  reservationExpiresAt: string | null;
  canCancel: boolean;
  placedAt: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string | null;
};

export type CheckoutCommitDto = {
  order: OrderDto;
  payment: {
    available: boolean;
    state: "ready" | "disabled";
    initiationEndpoint: string | null;
  };
};

export type PaymentAttemptDto = {
  id?: string;
  status?: string;
  authority?: string | null;
  redirectUrl?: string | null;
  [key: string]: unknown;
};

export type PaymentInitiationDto = {
  order: OrderDto;
  payment: PaymentAttemptDto;
};

export type PaymentVerificationDto = {
  verified: boolean;
  order: OrderDto;
  payment: PaymentAttemptDto;
};

export class BackendApiError extends Error {
  status: number;
  code: string;
  errors: Record<string, unknown>;
  meta?: ApiMeta;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      errors?: Record<string, unknown>;
      meta?: ApiMeta;
    } = {},
  ) {
    super(message);
    this.name = "BackendApiError";
    this.status = options.status ?? 0;
    this.code = options.code ?? "backend_error";
    this.errors = options.errors ?? {};
    this.meta = options.meta;
  }
}

const clean = (value: string | undefined) => value?.trim().replace(/\/$/, "") ?? "";

export function getBackendMode(): BackendMode {
  const explicit = clean(import.meta.env.VITE_LBB_BACKEND_MODE);
  if (explicit === "live" || explicit === "prototype") return explicit;
  return import.meta.env.PROD ? "live" : "prototype";
}

export function isLiveBackend(): boolean {
  return getBackendMode() === "live";
}

export function getBackendBaseUrl(): string {
  const raw = clean(import.meta.env.VITE_LBB_API_BASE_URL);
  if (!raw) {
    throw new BackendApiError(
      "آدرس Backend برای حالت live تنظیم نشده است.",
      { code: "backend_not_configured" },
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new BackendApiError("آدرس Backend معتبر نیست.", { code: "backend_url_invalid" });
  }

  const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !local) {
    throw new BackendApiError("Backend live باید روی HTTPS در دسترس باشد.", {
      code: "backend_https_required",
    });
  }

  return parsed.origin;
}

function assertContract(meta: ApiMeta | undefined) {
  if (!meta?.contractVersion) {
    throw new BackendApiError("Backend نسخه قرارداد را اعلام نکرد.", {
      code: "contract_version_missing",
      meta,
    });
  }
  if (meta.contractVersion !== LBB_CONTRACT_VERSION) {
    throw new BackendApiError(
      `نسخه Backend با Frontend هم‌خوان نیست (${meta.contractVersion}).`,
      { code: "contract_version_mismatch", meta },
    );
  }
}

async function request<T>(
  path: `/api/v1/${string}`,
  init: RequestInit = {},
): Promise<ApiSuccess<T>> {
  const url = `${getBackendBaseUrl()}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new BackendApiError("ارتباط با Backend برقرار نشد.", {
      code: "backend_network_error",
    });
  }

  let payload: ApiSuccess<T> | ApiFailure;
  try {
    payload = (await response.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new BackendApiError("پاسخ Backend قابل خواندن نیست.", {
      status: response.status,
      code: "backend_invalid_json",
    });
  }

  assertContract(payload.meta);

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

function queryString(query: CatalogQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const value = params.toString();
  return value ? `?${value}` : "";
}

const get = <T>(path: `/api/v1/${string}`) => request<T>(path);
const post = <T>(path: `/api/v1/${string}`, body?: unknown, headers?: HeadersInit) =>
  request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
  });

export async function listProducts(query: CatalogQuery = {}) {
  return get<ProductSummaryDto[]>(`/api/v1/products${queryString(query)}` as `/api/v1/${string}`);
}

export async function searchProducts(query: CatalogQuery & { q: string }) {
  return get<ProductSummaryDto[]>(`/api/v1/search${queryString(query)}` as `/api/v1/${string}`);
}

export async function getProduct(slug: string) {
  return get<ProductDetailDto>(`/api/v1/products/${encodeURIComponent(slug)}`);
}

export async function listCategories() {
  return get<CategoryDto[]>("/api/v1/categories");
}

export async function getCategory(slug: string) {
  return get<CategoryDto>(`/api/v1/categories/${encodeURIComponent(slug)}`);
}

export async function listCollections() {
  return get<CollectionDto[]>("/api/v1/collections");
}

export async function getCollection(slug: string, query: CatalogQuery = {}) {
  return get<{ collection: CollectionDto; products: ProductSummaryDto[] }>(
    `/api/v1/collections/${encodeURIComponent(slug)}${queryString(query)}` as `/api/v1/${string}`,
  );
}

export async function getCatalogFacets() {
  return get<FacetsDto>("/api/v1/catalog/facets");
}

export async function requestOtp(mobile: string) {
  return post<OtpChallengeDto>("/api/v1/auth/otp/request", { mobile });
}

export async function verifyOtp(input: { mobile: string; challengeId: string; code: string }) {
  return post<{ user: CustomerDto }>("/api/v1/auth/otp/verify", input);
}

export async function getCurrentCustomer() {
  return get<{ user: CustomerDto }>("/api/v1/auth/me");
}

export async function logoutCustomer() {
  return post<null>("/api/v1/auth/logout");
}

export async function validateCart(input: CartRequest) {
  return post<CartValidationDto>("/api/v1/cart/validate", input);
}

export async function createCheckoutQuote(input: CartRequest) {
  return post<CheckoutQuoteDto>("/api/v1/checkout/quote", input);
}

export async function commitCheckout(quoteId: string, idempotencyKey: string) {
  return post<CheckoutCommitDto>(
    "/api/v1/checkout/commit",
    { quoteId },
    { "Idempotency-Key": idempotencyKey },
  );
}

export async function listOrders(page = 1, perPage = 10) {
  return get<OrderDto[]>(`/api/v1/account/orders?page=${page}&perPage=${perPage}`);
}

export async function getOrder(orderId: string) {
  return get<{ order: OrderDto }>(`/api/v1/account/orders/${encodeURIComponent(orderId)}`);
}

export async function cancelOrder(orderId: string) {
  return post<{ order: OrderDto }>(
    `/api/v1/account/orders/${encodeURIComponent(orderId)}/cancel`,
  );
}

export async function initiatePayment(orderId: string, idempotencyKey: string) {
  return post<PaymentInitiationDto>(
    `/api/v1/orders/${encodeURIComponent(orderId)}/payments`,
    undefined,
    { "Idempotency-Key": idempotencyKey },
  );
}

export async function verifyPayment(authority: string, status: string) {
  return post<PaymentVerificationDto>("/api/v1/payments/verify", { authority, status });
}

export function createIdempotencyKey(scope: "checkout" | "payment") {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `lbb:${scope}:${random}`;
}

export function isAuthenticationError(error: unknown): error is BackendApiError {
  return error instanceof BackendApiError && (error.status === 401 || error.status === 403);
}

export function backendErrorMessage(error: unknown) {
  return error instanceof BackendApiError ? error.message : "خطای نامشخص در ارتباط با Backend.";
}
