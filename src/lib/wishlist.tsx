import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WishlistCtx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => boolean;
  remove: (slug: string) => void;
  replace: (slugs: string[]) => void;
  clear: () => void;
  count: number;
  hydrated: boolean;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "lbb-wishlist-v1";

function normalizeWishlist(values: unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") continue;
    const slug = value.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= 100) break;
  }

  return out;
}

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? normalizeWishlist(parsed) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSlugs(readWishlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {
      /* Storage may be unavailable. */
    }
  }, [slugs, hydrated]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    let added = false;
    setSlugs((previous) => {
      if (previous.includes(slug)) return previous.filter((item) => item !== slug);
      added = true;
      return normalizeWishlist([...previous, slug]);
    });
    return added;
  }, []);

  const remove = useCallback(
    (slug: string) => setSlugs((previous) => previous.filter((item) => item !== slug)),
    [],
  );

  const replace = useCallback((next: string[]) => setSlugs(normalizeWishlist(next)), []);
  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo(
    () => ({ slugs, has, toggle, remove, replace, clear, count: slugs.length, hydrated }),
    [slugs, has, toggle, remove, replace, clear, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const context = useContext(Ctx);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
