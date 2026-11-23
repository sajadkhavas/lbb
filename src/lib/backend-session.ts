import { BackendApiError, getBackendBaseUrl } from "@/lib/backend-api";

let csrfReady = false;
let csrfPromise: Promise<void> | null = null;

export async function ensureBackendCsrf(): Promise<void> {
  if (csrfReady) return;
  if (csrfPromise) return csrfPromise;

  csrfPromise = (async () => {
    let response: Response;
    try {
      response = await fetch(`${getBackendBaseUrl()}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch {
      throw new BackendApiError("برقراری نشست امن با Backend انجام نشد.", {
        code: "csrf_network_error",
      });
    }

    if (!response.ok && response.status !== 204) {
      throw new BackendApiError("Backend نشست امن مرورگر را آماده نکرد.", {
        status: response.status,
        code: "csrf_bootstrap_failed",
      });
    }

    csrfReady = true;
  })();

  try {
    await csrfPromise;
  } finally {
    csrfPromise = null;
  }
}

export function resetBackendCsrf() {
  csrfReady = false;
}
