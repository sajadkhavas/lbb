export type PushSubscriptionRecord = {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
};

export type PushPreference = "product_updates" | "editorial";

export type PushSubscriptionRequest = {
  subscription: PushSubscriptionRecord;
  preferences: PushPreference[];
};

import { getBackendBaseUrl, isLiveBackend } from "@/lib/backend-api";
import { ensureBackendCsrf } from "@/lib/backend-session";

export type PushState = "unsupported" | "not-configured" | "denied" | "available" | "subscribed";

let publicKey: string | null = null;
const GUEST_TOKEN_KEY = "lbb.push.guest-token.v1";

function guestToken(): string {
  const saved = localStorage.getItem(GUEST_TOKEN_KEY);
  if (saved) return saved;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const generated = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  localStorage.setItem(GUEST_TOKEN_KEY, generated);
  return generated;
}

export async function initializePush(): Promise<void> {
  if (!isLiveBackend() || typeof window === "undefined") return;
  const response = await fetch(`${getBackendBaseUrl()}/api/web-push/config`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return;
  const payload = (await response.json()) as {
    data?: { enabled?: boolean; publicKey?: string | null };
  };
  publicKey = payload.data?.enabled ? (payload.data.publicKey ?? null) : null;
}

const toBytes = (value: string): Uint8Array<ArrayBuffer> => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const raw = atob((value + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
};

export function getPushState(subscription?: PushSubscription | null): PushState {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  )
    return "unsupported";
  if (!publicKey || !isLiveBackend()) return "not-configured";
  if (Notification.permission === "denied") return "denied";
  return subscription ? "subscribed" : "available";
}

export async function currentPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;
  return (await navigator.serviceWorker.ready).pushManager.getSubscription();
}

async function syncSubscription(
  method: "POST" | "DELETE",
  subscription: PushSubscription,
  preferences: PushPreference[],
): Promise<void> {
  if (!publicKey) throw new Error("PUSH_NOT_CONFIGURED");
  await ensureBackendCsrf();
  const session = await fetch(`${getBackendBaseUrl()}/api/v1/auth/me`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const customer = session.ok;
  if (!customer && session.status !== 401) throw new Error("PUSH_SESSION_UNAVAILABLE");
  const token = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/)?.[1];
  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth)
    throw new Error("PUSH_INVALID_SUBSCRIPTION");
  const response = await fetch(
    `${getBackendBaseUrl()}/api/web-push/${customer ? "" : "guest/"}subscriptions`,
    {
      method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        ...(token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {}),
      },
      body: JSON.stringify({
        endpoint: json.endpoint,
        ...(method === "POST"
          ? { keys: json.keys, contentEncoding: "aes128gcm", preferences }
          : {}),
        ...(!customer ? { guestToken: guestToken(), marketingEnabled: true } : {}),
        ...(customer && method === "POST" && localStorage.getItem(GUEST_TOKEN_KEY)
          ? { guestToken: localStorage.getItem(GUEST_TOKEN_KEY) }
          : {}),
      }),
    },
  );
  if (!response.ok) throw new Error(`PUSH_SYNC_FAILED_${response.status}`);
}

export async function subscribeToPush(preferences: PushPreference[]): Promise<PushSubscription> {
  if (!publicKey) throw new Error("PUSH_NOT_CONFIGURED");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error(`PUSH_PERMISSION_${permission.toUpperCase()}`);
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: toBytes(publicKey),
    }));
  try {
    await syncSubscription("POST", subscription, preferences);
    return subscription;
  } catch (error) {
    if (!existing) await subscription.unsubscribe();
    throw error;
  }
}

export async function unsubscribeFromPush(preferences: PushPreference[]): Promise<void> {
  const subscription = await currentPushSubscription();
  if (!subscription) return;
  await syncSubscription("DELETE", subscription, preferences);
  await subscription.unsubscribe();
}
