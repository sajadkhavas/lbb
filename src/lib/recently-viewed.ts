const KEY = "lbb-recently-viewed-v1";
const MAX = 8;

/** Reads recently viewed product slugs (most recent first) from localStorage. */
export function getRecentlyViewed(excludeSlug?: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.filter((s) => s !== excludeSlug);
  } catch {
    return [];
  }
}

/** Records a product slug as recently viewed (moves it to the front). */
export function recordRecentlyViewed(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}
