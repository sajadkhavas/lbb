import { AsyncLocalStorage } from "node:async_hooks";
import { getBackendBaseUrl, isLiveBackend } from "./backend-api";

type BootstrapScope = {
  response?: Promise<Response>;
  misses: number;
  hits: number;
};
const bootstrapScope = new AsyncLocalStorage<BootstrapScope>();

// Scope is created per SSR request, not per process or per user session.
export function withBackendSsrRequest<T>(work: () => Promise<T>): Promise<T> {
  const scope: BootstrapScope = { misses: 0, hits: 0 };
  return bootstrapScope.run(scope, async () => {
    try {
      return await work();
    } finally {
      if (process.env.LBB_SSR_PROFILE === "1" && scope.misses + scope.hits > 0) {
        console.info(`LBB_SSR_BOOTSTRAP misses=${scope.misses} hits=${scope.hits}`);
      }
    }
  });
}

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

    const outgoing = new Request(request, { headers, redirect: "error" });
    const scope = bootstrapScope.getStore();
    // Only the exact public bootstrap GET is shared. No cookies, auth,
    // query strings, custom request headers, or commerce endpoints.
    const eligible = scope && outgoing.method === "GET" &&
      url.pathname === "/api/v1/storefront/bootstrap" && url.search === "" &&
      !init?.signal && Array.from(headers.keys()).every(
        (key) => key === "accept" || key === SSR_RATE_LIMIT_HEADER.toLowerCase(),
      ) && headers.get("accept") === "application/json";
    if (!scope || !eligible) return originalFetch(outgoing);
    if (scope.response) {
      scope.hits++;
    } else {
      scope.misses++;
      const pending = originalFetch(outgoing);
      scope.response = pending;
      void pending.then((response) => {
        if (!response.ok && scope.response === pending) scope.response = undefined;
      }, () => {
        if (scope.response === pending) scope.response = undefined;
      });
    }
    // Each consumer receives its own body stream.
    return scope.response.then((response) => response.clone());
  };
}
