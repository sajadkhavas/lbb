const KEY = "lbb-recently-viewed-v1";
const MAX = 8;

function readList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(parsed.filter((slug): slug is string => typeof slug === "string" && slug.trim().length > 0)),
    ).slice(0, MAX);
  } catch {
    return [];
  }
}

/** Reads recently viewed product slugs, most recent first. */
export function getRecentlyViewed(excludeSlug?: string): string[] {
  return readList().filter((slug) => slug !== excludeSlug);
}

/** Records a product slug and moves an existing entry to the front. */
export function recordRecentlyViewed(slug: string) {
  if (typeof window === "undefined" || typeof slug !== "string" || !slug.trim()) return;
  try {
    const cleanSlug = slug.trim();
    const next = [cleanSlug, ...readList().filter((item) => item !== cleanSlug)].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage is a progressive enhancement; never block the PDP.
  }
}
