/* eslint-disable react-refresh/only-export-components -- provider and hook intentionally share one context module. */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./products";

type QuickViewCtx = {
  product: Product | null;
  open: (product: Product, trigger?: HTMLElement | null) => void;
  close: () => void;
};

const Ctx = createContext<QuickViewCtx | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const open = useCallback((nextProduct: Product, trigger?: HTMLElement | null) => {
    returnFocusRef.current =
      trigger ??
      (typeof document !== "undefined" && document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    setProduct(nextProduct);
  }, []);

  const close = useCallback(() => {
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    setProduct(null);
    if (target?.isConnected) requestAnimationFrame(() => target.focus());
  }, []);

  const value = useMemo(() => ({ product, open, close }), [product, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuickView() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuickView must be used inside QuickViewProvider");
  return ctx;
}
