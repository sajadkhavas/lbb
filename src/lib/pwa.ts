/**
 * Production PWA registration + install state.
 * Native installation remains progressive enhancement and is only prompted
 * after an explicit user action.
 */
const SW_URL = "/sw.js";

type InstallChoice = { outcome: "accepted" | "dismissed"; platform: string };
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
};

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<() => void>();
let installEventsPrepared = false;

function notifyInstallListeners() {
  installListeners.forEach((listener) => listener());
}

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

export function prepareWebAppInstall() {
  if (typeof window === "undefined" || installEventsPrepared) return;
  installEventsPrepared = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
    notifyInstallListeners();
  });
  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    notifyInstallListeners();
  });
}

export function subscribeWebAppInstall(listener: () => void) {
  installListeners.add(listener);
  return () => installListeners.delete(listener);
}

export function isStandaloneWebApp(): boolean {
  if (typeof window === "undefined") return false;
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

export function isIosWebKitDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function canPromptWebAppInstall(): boolean {
  return deferredInstallPrompt !== null && !isStandaloneWebApp();
}

export async function promptWebAppInstall(): Promise<InstallChoice | null> {
  const prompt = deferredInstallPrompt;
  if (!prompt || isStandaloneWebApp()) return null;
  await prompt.prompt();
  const choice = await prompt.userChoice;
  if (choice.outcome === "accepted") deferredInstallPrompt = null;
  notifyInstallListeners();
  return choice;
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
    // Offline support and Push are progressive enhancement and must never break the app.
  }
}
