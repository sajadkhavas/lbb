/* Push-only extension imported by the generated Workbox worker. */
self.addEventListener("push", (event) => {
  if (!event.data) return;
  event.waitUntil(
    (async () => {
      let payload;
      try {
        payload = event.data.json();
      } catch {
        return;
      }
      if (!payload || typeof payload.title !== "string") return;
      const url =
        typeof payload.url === "string" && payload.url.startsWith("/")
          ? payload.url
          : "/";
      await self.registration.showNotification(payload.title, {
        body: typeof payload.body === "string" ? payload.body : undefined,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: typeof payload.tag === "string" ? payload.tag : undefined,
        data: { url },
        renotify: false,
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(
    event.notification.data?.url || "/",
    self.location.origin,
  );
  if (target.origin !== self.location.origin) target.pathname = "/";
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const existing = windows.find(
        (client) => new URL(client.url).origin === self.location.origin,
      );
      if (existing) {
        await existing.navigate(target.href);
        return existing.focus();
      }
      return self.clients.openWindow(target.href);
    })(),
  );
});
