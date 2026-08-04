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

async function unregisterAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) =>
        (registration.active?.scriptURL ?? registration.installing?.scriptURL ?? "").endsWith(
          SW_URL,
        ),
      )
      .map((registration) => registration.unregister()),
  );
}

export async function registerPwa() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (isRefusedContext()) {
    await unregisterAppWorker();
    return;
  }

  try {
    await navigator.serviceWorker.register(SW_URL, { scope: "/", updateViaCache: "none" });
  } catch {
    // Offline support is progressive enhancement and must never break the app.
  }
}
