/**
 * Guarded service-worker registration.
 *
 * The worker is a static public asset so Nitro/Cloudflare always publishes it
 * at `/sw.js`; registration stays disabled in development and preview frames.
 */
const SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true;
  if (new URL(window.location.href).searchParams.get("sw") === "off") return true;

  const hostname = window.location.hostname;
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;
  if (hostname === "lovableproject.com" || hostname.endsWith(".lovableproject.com")) return true;
  if (hostname === "lovableproject-dev.com" || hostname.endsWith(".lovableproject-dev.com"))
    return true;
  if (hostname === "beta.lovable.dev" || hostname.endsWith(".beta.lovable.dev")) return true;
  return false;
}

async function unregisterAppWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => {
        const scriptUrl =
          registration.active?.scriptURL ??
          registration.installing?.scriptURL ??
          registration.waiting?.scriptURL ??
          "";
        return scriptUrl.endsWith(SW_URL);
      })
      .map((registration) => registration.unregister()),
  );
}

function announceUpdate(registration: ServiceWorkerRegistration): void {
  if (!registration.waiting) return;
  window.dispatchEvent(
    new CustomEvent("lbb:pwa-update", {
      detail: async () => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      },
    }),
  );
}

export async function registerPwa(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (isRefusedContext()) {
    await unregisterAppWorker();
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_URL, {
      scope: "/",
      updateViaCache: "none",
    });
    announceUpdate(registration);
    registration.addEventListener("updatefound", () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener("statechange", () => {
        if (installing.state === "installed" && navigator.serviceWorker.controller) {
          announceUpdate(registration);
        }
      });
    });
    // Never reload behind the shopper's back. The update banner above is the
    // explicit hand-off; the next normal navigation receives the new worker.
  } catch {
    // Offline support is progressive enhancement and must never break the app.
  }
}
