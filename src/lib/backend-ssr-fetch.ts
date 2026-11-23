import { getBackendBaseUrl, isLiveBackend } from "./backend-api";

const SSR_RATE_LIMIT_HEADER = "X-LBB-SSR-Token";

let installed = false;

export function installBackendSsrFetchCredential() {
  if (installed) return;
  installed = true;

  if (!isLiveBackend() || typeof process === "undefined") return;

  const token = (process.env.LBB_SSR_RATE_LIMIT_TOKEN ?? "").trim();
  if (!token) return;

  const backendOrigin = getBackendBaseUrl();
  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = (input: string | URL | Request, init?: RequestInit) => {
    const request = new Request(input, init);
    const url = new URL(request.url);

    if (url.origin !== backendOrigin || !url.pathname.startsWith("/api/v1/")) {
      return originalFetch(input, init);
    }

    const headers = new Headers(request.headers);
    headers.set(SSR_RATE_LIMIT_HEADER, token);

    return originalFetch(
      new Request(request, {
        headers,
        redirect: "error",
      }),
    );
  };
}
