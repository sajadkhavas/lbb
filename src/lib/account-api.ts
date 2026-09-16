import {
  BackendApiError,
  getBackendBaseUrl,
  type ApiFailure,
  type ApiSuccess,
  type CustomerDto,
} from "@/lib/backend-api";

export type CustomerAddressDto = {
  id: string;
  title: string;
  recipientName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CustomerAddressInput = {
  title: string;
  recipientName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string | null;
  isDefault?: boolean;
};

export type CustomerProfileInput = {
  fullName?: string | null;
  email?: string | null;
  marketingConsent?: boolean;
};

function requestHeaders(init: RequestInit): Headers {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const method = (init.method ?? "GET").toUpperCase();
  if (typeof document !== "undefined" && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith("XSRF-TOKEN="));
    if (entry) headers.set("X-XSRF-TOKEN", decodeURIComponent(entry.slice("XSRF-TOKEN=".length)));
  }

  return headers;
}

async function accountRequest<T>(path: `/api/account/${string}`, init: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers: requestHeaders(init),
    });
  } catch {
    throw new BackendApiError("ارتباط با حساب کاربری برقرار نشد.", {
      code: "account_network_error",
    });
  }

  let payload: ApiSuccess<T> | ApiFailure;
  try {
    payload = (await response.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new BackendApiError("پاسخ حساب کاربری قابل خواندن نیست.", {
      status: response.status,
      code: "account_invalid_json",
    });
  }

  if (!response.ok || payload.success !== true) {
    const failure = payload as ApiFailure;
    throw new BackendApiError(failure.message || "درخواست حساب کاربری انجام نشد.", {
      status: response.status,
      code: failure.code || "account_error",
      errors: failure.errors ?? {},
      meta: failure.meta,
    });
  }

  return payload as ApiSuccess<T>;
}

export function updateCustomerProfile(input: CustomerProfileInput) {
  return accountRequest<{ user: CustomerDto }>("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function listCustomerAddresses() {
  return accountRequest<CustomerAddressDto[]>("/api/account/addresses");
}

export function createCustomerAddress(input: CustomerAddressInput) {
  return accountRequest<{ address: CustomerAddressDto }>("/api/account/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCustomerAddress(id: string, input: CustomerAddressInput) {
  return accountRequest<{ address: CustomerAddressDto }>(
    `/api/account/addresses/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function deleteCustomerAddress(id: string) {
  return accountRequest<never>(`/api/account/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
