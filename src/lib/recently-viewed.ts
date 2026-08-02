const KEY = "lbb-recently-viewed-v1";
const MAX = 8;

function readList(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string" && s.length > 0);
  } catch {
    return [];
  }
}

/** Reads recently viewed product slugs (most recent first) from localStorage. */
export function getRecentlyViewed(excludeSlug?: string): string[] {
  if (typeof window === "undefined") return [];
  return readList().filter((s) => s !== excludeSlug);
}

/** Records a product slug as recently viewed (moves it to the front). */
export function recordRecentlyViewed(slug: string) {
  if (typeof window === "undefined") return;
  if (typeof slug !== "string" || !slug) return;
  try {
    const next = [slug, ...readList().filter((s) => s !== slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}
