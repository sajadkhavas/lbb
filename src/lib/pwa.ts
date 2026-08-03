const SW_URL = "/sw.js";

function isRefusedContext(): boolean {
  if (!import.meta.env.PROD || typeof window === "undefined") return true;
  if (window.self !== window.top) return true;
  if (new URL(window.location.href).searchParams.get("sw") === "off") return true;

  const hostname = window.location.hostname;
  return (
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev")
  );
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

/**
 * Registers the production worker only on first-party, top-level pages.
 * Refused contexts actively remove stale LBB workers so preview sessions never
 * inherit production caches.
 */
export async function registerPwa(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (isRefusedContext()) {
    await unregisterAppWorker();
    return;
  }

  try {
    const { registerSW } = await import("virtual:pwa-register");
    registerSW({
      immediate: true,
      onRegisterError(error) {
        if (import.meta.env.DEV) console.error("PWA registration failed", error);
      },
    });
  } catch (error) {
    if (import.meta.env.DEV) console.error("PWA module failed to load", error);
  }
}
