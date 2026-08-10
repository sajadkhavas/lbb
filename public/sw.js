/* LBB production service worker — network-first pages, cache-first hashed assets + Web Push. */
const VERSION = "lbb-2026-08-web-push";
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;
const OWN_CACHES = new Set([PAGE_CACHE, ASSET_CACHE]);
const MAX_PAGE_ENTRIES = 40;
const MAX_ASSET_ENTRIES = 200;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("lbb-") && !OWN_CACHES.has(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const overflow = keys.length - maxEntries;
  if (overflow <= 0) return;
  await Promise.all(keys.slice(0, overflow).map((request) => cache.delete(request)));
}

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      void trim(PAGE_CACHE, MAX_PAGE_ENTRIES);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
    void trim(ASSET_CACHE, MAX_ASSET_ENTRIES);
  }
  return response;
}

function safeNotificationUrl(value) {
  try {
    const url = new URL(typeof value === "string" ? value : "/account", self.location.origin);
    if (url.origin !== self.location.origin) return "/account";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/account";
  }
}

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data?.text() ?? "" };
  }

  const title = typeof payload.title === "string" && payload.title.trim() ? payload.title : "LBB";
  const body = typeof payload.body === "string" ? payload.body : "";
  const url = safeNotificationUrl(payload.url);

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: typeof payload.icon === "string" ? payload.icon : "/icons/icon-192.png",
      badge: typeof payload.badge === "string" ? payload.badge : "/icons/icon-192.png",
      tag: typeof payload.tag === "string" ? payload.tag : undefined,
      data: { ...(payload.data && typeof payload.data === "object" ? payload.data : {}), url },
      dir: "rtl",
      lang: "fa",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const path = safeNotificationUrl(event.notification.data?.url);
  const target = new URL(path, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clients) => {
      const sameOrigin = clients.find((client) => new URL(client.url).origin === self.location.origin);
      if (sameOrigin) {
        if ("navigate" in sameOrigin) await sameOrigin.navigate(target);
        return sameOrigin.focus();
      }
      return self.clients.openWindow(target);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname === "/sw.js" ||
    url.pathname === "/sitemap.xml" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/~oauth")
  )
    return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (["image", "script", "style", "font"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
  }
});
