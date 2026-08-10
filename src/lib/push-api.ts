import { BackendApiError, getBackendBaseUrl, type ApiFailure, type ApiSuccess } from "@/lib/backend-api";
import { ensureBackendCsrf } from "@/lib/backend-session";

export type WebPushConfig = {
  enabled: boolean;
  publicKey: string | null;
};

export type WebPushStatus = {
  activeCount: number;
};

function headers(init: RequestInit): Headers {
  const value = new Headers(init.headers);
  value.set("Accept", "application/json");
  if (init.body) value.set("Content-Type", "application/json");

  const method = (init.method ?? "GET").toUpperCase();
  if (typeof document !== "undefined" && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith("XSRF-TOKEN="));
    if (entry) value.set("X-XSRF-TOKEN", decodeURIComponent(entry.slice("XSRF-TOKEN=".length)));
  }
  return value;
}

async function request<T>(path: `/api/web-push/${string}`, init: RequestInit = {}) {
  const method = (init.method ?? "GET").toUpperCase();
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) await ensureBackendCsrf();

  let response: Response;
  try {
    response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers: headers(init),
    });
  } catch {
    throw new BackendApiError("ارتباط با سرویس اعلان برقرار نشد.", {
      code: "web_push_network_error",
    });
  }

  let payload: ApiSuccess<T> | ApiFailure;
  try {
    payload = (await response.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new BackendApiError("پاسخ سرویس اعلان قابل خواندن نیست.", {
      status: response.status,
      code: "web_push_invalid_json",
    });
  }

  if (!response.ok || payload.success !== true) {
    const failure = payload as ApiFailure;
    throw new BackendApiError(failure.message || "درخواست اعلان ناموفق بود.", {
      status: response.status,
      code: failure.code,
      errors: failure.errors,
      meta: failure.meta,
    });
  }
  return payload;
}

export function getWebPushConfig() {
  return request<WebPushConfig>("/api/web-push/config");
}

export function getWebPushStatus() {
  return request<WebPushStatus>("/api/web-push/subscriptions");
}

export function registerWebPushSubscription(subscription: PushSubscription) {
  const json = subscription.toJSON();
  return request<{ subscriptionId: string; activeCount: number }>("/api/web-push/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: json.keys,
      contentEncoding: PushManager.supportedContentEncodings?.[0] ?? "aes128gcm",
    }),
  });
}

export function revokeWebPushSubscription(endpoint: string) {
  return request<WebPushStatus>("/api/web-push/subscriptions", {
    method: "DELETE",
    body: JSON.stringify({ endpoint }),
  });
}

export function sendWebPushTest() {
  return request<{ sent: number; failed: number; revoked: number }>("/api/web-push/test", {
    method: "POST",
  });
}
