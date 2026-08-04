const KEY = "lbb_recent_searches";
const MAX = 8;

export function normalizeSearchTerm(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

const identity = (value: string) => normalizeSearchTerm(value).toLocaleLowerCase("fa-IR");

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    const unique = new Map<string, string>();
    parsed.forEach((entry) => {
      if (typeof entry !== "string") return;
      const term = normalizeSearchTerm(entry);
      if (term && !unique.has(identity(term))) unique.set(identity(term), term);
    });
    return Array.from(unique.values()).slice(0, MAX);
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  const term = normalizeSearchTerm(query);
  if (!term) return;
  try {
    const key = identity(term);
    const next = [term, ...getRecentSearches().filter((item) => identity(item) !== key)].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function removeRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  try {
    const key = identity(query);
    const next = getRecentSearches().filter((item) => identity(item) !== key);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Ignore unavailable storage.
  }
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
