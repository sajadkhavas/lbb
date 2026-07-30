const KEY = "lbb_recent_searches";
const MAX = 8;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(q: string) {
  if (typeof window === "undefined") return;
  const term = q.trim();
  if (!term) return;
  const cur = getRecentSearches().filter((t) => t !== term);
  const next = [term, ...cur].slice(0, MAX);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeRecentSearch(q: string) {
  if (typeof window === "undefined") return;
  const next = getRecentSearches().filter((t) => t !== q);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
