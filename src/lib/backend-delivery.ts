import {
  BackendApiError,
  LBB_CONTRACT_VERSION,
  getBackendBaseUrl,
  type ApiFailure,
  type ApiSuccess,
  type DeliveryMethod,
} from "@/lib/backend-api";

export type DeliveryOptionDto = {
  method: DeliveryMethod;
  label: string;
  enabled: boolean;
  feeToman: number;
};

export type DeliveryOptionsDto = {
  zone: {
    id: string;
    name: string;
    minimumOrderToman: number | null;
    freeDeliveryThresholdToman: number | null;
    packagingFeeToman: number;
    processing: { minDays: number; maxDays: number };
  } | null;
  methods: DeliveryOptionDto[];
};

export async function getDeliveryOptions(
  input: {
    province?: string | null;
    city?: string | null;
    subtotalToman?: number | null;
  } = {},
) {
  const params = new URLSearchParams();
  if (input.province?.trim()) params.set("province", input.province.trim());
  if (input.city?.trim()) params.set("city", input.city.trim());
  if (input.subtotalToman !== undefined && input.subtotalToman !== null) {
    params.set("subtotalToman", String(Math.max(0, Math.floor(input.subtotalToman))));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  let response: Response;
  try {
    response = await fetch(`${getBackendBaseUrl()}/api/v1/delivery/options${suffix}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new BackendApiError("امکان دریافت روش‌های ارسال از Backend وجود ندارد.", {
      code: "backend_network_error",
    });
  }

  let payload: ApiSuccess<DeliveryOptionsDto> | ApiFailure;
  try {
    payload = (await response.json()) as ApiSuccess<DeliveryOptionsDto> | ApiFailure;
  } catch {
    throw new BackendApiError("پاسخ روش‌های ارسال قابل خواندن نیست.", {
      status: response.status,
      code: "backend_invalid_json",
    });
  }

  if (payload.meta?.contractVersion !== LBB_CONTRACT_VERSION) {
    throw new BackendApiError("نسخه قرارداد روش‌های ارسال با Frontend هم‌خوان نیست.", {
      status: response.status,
      code: "contract_version_mismatch",
      meta: payload.meta,
    });
  }

  if (!response.ok || payload.success !== true) {
    const failure = payload as ApiFailure;
    throw new BackendApiError(failure.message || "دریافت روش‌های ارسال ناموفق بود.", {
      status: response.status,
      code: failure.code,
      errors: failure.errors,
      meta: failure.meta,
    });
  }

  return payload;
}
