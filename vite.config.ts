// @lovable.dev/vite-tanstack-config already provides TanStack Start, React,
// Tailwind, tsconfig paths, Nitro, aliases, dedupe and the development sandbox.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

const sensitivePath =
  /^\/(?:cart|checkout|order-confirmation|track-order|wishlist|account|orders|admin|api|~oauth)(?:\/|$)/;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 600,
      reportCompressedSize: true,
      sourcemap: false,
    },
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        outDir: "dist/client",
        devOptions: { enabled: false },
        manifest: false,
        includeAssets: ["favicon.png", "apple-touch-icon.png", "icons/*.png", "brand/lbb-logo.svg"],
        workbox: {
          globPatterns: ["**/*.{js,css,woff2,svg}"],
          globIgnores: ["**/*.map"],
          maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
          navigateFallbackDenylist: [sensitivePath, /^\/sitemap\.xml$/, /^\/robots\.txt$/],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: sensitivePath,
              handler: "NetworkOnly",
            },
            {
              urlPattern: ({ url, request }: { url: URL; request: Request }) =>
                request.method === "GET" &&
                request.mode === "navigate" &&
                !/^\/(?:cart|checkout|order-confirmation|track-order|wishlist|account|orders|admin|api|~oauth)(?:\/|$)/.test(
                  url.pathname,
                ),
              handler: "NetworkFirst",
              options: {
                cacheName: "lbb-public-pages-v1",
                networkTimeoutSeconds: 4,
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                  purgeOnQuotaError: true,
                },
              },
            },
            {
              urlPattern: ({ url, request }: { url: URL; request: Request }) =>
                request.method === "GET" &&
                url.origin === self.location.origin &&
                request.destination === "image" &&
                !/^\/(?:checkout|order-confirmation|account|orders|admin|api)(?:\/|$)/.test(
                  url.pathname,
                ),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "lbb-public-images-v1",
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 14,
                  purgeOnQuotaError: true,
                },
              },
            },
          ],
        },
      }),
    ],
  },
});
