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

export type PushState =
  | "unsupported"
  | "not-configured"
  | "denied"
  | "available"
  | "subscribed";

const PUBLIC_KEY = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY?.trim();
const SUBSCRIPTIONS_URL = import.meta.env.VITE_PUSH_SUBSCRIPTIONS_URL?.trim();

const toBytes = (value: string): Uint8Array<ArrayBuffer> => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const raw = atob((value + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
};

export function getPushState(
  subscription?: PushSubscription | null,
): PushState {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  )
    return "unsupported";
  if (!PUBLIC_KEY || !SUBSCRIPTIONS_URL) return "not-configured";
  if (Notification.permission === "denied") return "denied";
  return subscription ? "subscribed" : "available";
}

export async function currentPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;
  return (await navigator.serviceWorker.ready).pushManager.getSubscription();
}

async function syncSubscription(
  method: "PUT" | "DELETE",
  body: PushSubscriptionRequest,
): Promise<void> {
  if (!SUBSCRIPTIONS_URL) throw new Error("PUSH_NOT_CONFIGURED");
  const response = await fetch(SUBSCRIPTIONS_URL, {
    method,
    credentials: "include",
    headers: { "content-type": "application/json", "x-lbb-client": "web" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`PUSH_SYNC_FAILED_${response.status}`);
}

export async function subscribeToPush(
  preferences: PushPreference[],
): Promise<PushSubscription> {
  if (!PUBLIC_KEY || !SUBSCRIPTIONS_URL) throw new Error("PUSH_NOT_CONFIGURED");
  const permission = await Notification.requestPermission();
  if (permission !== "granted")
    throw new Error(`PUSH_PERMISSION_${permission.toUpperCase()}`);
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: toBytes(PUBLIC_KEY),
    }));
  try {
    await syncSubscription("PUT", {
      subscription: subscription.toJSON() as PushSubscriptionRecord,
      preferences,
    });
    return subscription;
  } catch (error) {
    if (!existing) await subscription.unsubscribe();
    throw error;
  }
}

export async function unsubscribeFromPush(
  preferences: PushPreference[],
): Promise<void> {
  const subscription = await currentPushSubscription();
  if (!subscription) return;
  await syncSubscription("DELETE", {
    subscription: subscription.toJSON() as PushSubscriptionRecord,
    preferences,
  });
  await subscription.unsubscribe();
}
