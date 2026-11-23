import type { SeoDto } from "@/lib/backend-api";

function normalizeFallback(path: string) {
  const value = path.startsWith("/") ? path : `/${path}`;
  return value === "/" ? "/" : value.replace(/\/+$/, "");
}

export function backendCanonicalPath(
  seo: Pick<SeoDto, "canonicalPath"> | null | undefined,
  fallback: string,
) {
  const safeFallback = normalizeFallback(fallback);
  const candidate = seo?.canonicalPath?.trim();
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) return safeFallback;
  if (candidate.includes("?") || candidate.includes("#") || candidate.includes("\\")) {
    return safeFallback;
  }
  try {
    const url = new URL(candidate, "https://lbb.invalid");
    if (url.origin !== "https://lbb.invalid" || url.search || url.hash) return safeFallback;
    const normalized = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return normalized || safeFallback;
  } catch {
    return safeFallback;
  }
}

export function sitemapLastmod(value: string | null | undefined) {
  const raw = value?.trim();
  if (!raw || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(raw)) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
