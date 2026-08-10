import { readFile } from "node:fs/promises";

const [manifestText, worker, pwa, pushApi, panel, root, navigation] = await Promise.all([
  readFile("public/manifest.webmanifest", "utf8"),
  readFile("public/sw.js", "utf8"),
  readFile("src/lib/pwa.ts", "utf8"),
  readFile("src/lib/push-api.ts", "utf8"),
  readFile("src/components/lbb/WebAppPushPanel.tsx", "utf8"),
  readFile("src/routes/__root.tsx", "utf8"),
  readFile("src/lib/navigation.ts", "utf8"),
]);

const manifest = JSON.parse(manifestText);
const failures = [];
const requireValue = (condition, message) => {
  if (!condition) failures.push(message);
};

requireValue(manifest.id === "/", "manifest must define stable app id /");
requireValue(manifest.start_url === "/" && manifest.scope === "/", "manifest start_url/scope must be root");
requireValue(manifest.display === "standalone", "manifest must remain standalone");
requireValue(Array.isArray(manifest.icons) && manifest.icons.some((icon) => icon.sizes === "512x512"), "manifest needs 512 icon");
requireValue(worker.includes('addEventListener("push"'), "service worker must handle push");
requireValue(worker.includes("showNotification"), "service worker must show visible notifications");
requireValue(worker.includes('addEventListener("notificationclick"'), "service worker must handle notification clicks");
requireValue(worker.includes("safeNotificationUrl"), "notification navigation must be same-origin sanitized");
requireValue(pwa.includes("beforeinstallprompt"), "PWA helper must capture install prompt");
requireValue(pwa.includes("appinstalled"), "PWA helper must track successful installation");
requireValue(root.includes("prepareWebAppInstall()"), "root must prepare install handling before route interaction");
requireValue(pushApi.includes('"/api/web-push/'), "Push API must use additive non-v1 namespace");
requireValue(pushApi.includes('credentials: "include"'), "Push API must preserve authenticated cookies");
requireValue(pushApi.includes("ensureBackendCsrf"), "Push mutations must use Sanctum CSRF bootstrap");
requireValue(panel.includes("Notification.requestPermission()"), "permission request must exist in explicit Push control");
requireValue(panel.includes("userVisibleOnly: true"), "PushManager subscription must require visible notifications");
requireValue(panel.includes("applicationServerKey"), "PushManager subscription must use VAPID public key");
requireValue(panel.includes("onClick={() => void enablePush()}"), "permission flow must be tied to explicit user action");
requireValue(!root.includes("Notification.requestPermission"), "root must never auto-prompt notification permission");
requireValue(navigation.includes('to: "/web-app"'), "Web App settings must be discoverable in personal navigation");

if (failures.length) {
  console.error("Web App / Push audit failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Web App / Push audit: PASS");
