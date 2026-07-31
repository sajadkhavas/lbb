import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";

type QuickViewCtx = {
  product: Product | null;
  open: (p: Product) => void;
  close: () => void;
};

const Ctx = createContext<QuickViewCtx | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const open = useCallback((p: Product) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [product, close]);

  const value = useMemo(() => ({ product, open, close }), [product, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuickView() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuickView must be used inside QuickViewProvider");
  return ctx;
}