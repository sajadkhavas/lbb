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
  clear: () => void;
  count: number;
};

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "lbb-wishlist-v1";

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of parsed) {
      if (typeof s === "string" && s.length > 0 && !seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
    }
    return out;
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
      /* ignore */
    }
  }, [slugs, hydrated]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    let added = false;
    setSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      added = true;
      return [...prev, slug];
    });
    return added;
  }, []);

  const remove = useCallback(
    (slug: string) => setSlugs((prev) => prev.filter((s) => s !== slug)),
    [],
  );

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo(
    () => ({ slugs, has, toggle, remove, clear, count: slugs.length }),
    [slugs, has, toggle, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist must be used inside WishlistProvider");
  return c;
}
