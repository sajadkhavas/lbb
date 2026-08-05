import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  closeOverlayHistory,
  dismissOverlayHistory,
  openOverlayHistory,
} from "@/lib/overlay-history";

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  color?: string;
  size?: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  add: (line: CartLine) => void;
  remove: (index: number) => void;
  setQty: (index: number, qty: number) => void;
  clear: () => void;
  subtotal: number;
  hydrated: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  dismissDrawer: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lbb-cart-v1";
const MAX_QTY = 20;

function isValidLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.slug === "string" &&
    line.slug.length > 0 &&
    typeof line.name === "string" &&
    line.name.length > 0 &&
    typeof line.price === "number" &&
    Number.isFinite(line.price) &&
    line.price > 0 &&
    typeof line.qty === "number" &&
    Number.isInteger(line.qty) &&
    line.qty > 0 &&
    line.qty <= MAX_QTY &&
    (line.color === undefined || typeof line.color === "string") &&
    (line.size === undefined || typeof line.size === "string")
  );
}

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLines(readCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      // Storage can be unavailable in private mode or after quota exhaustion.
    }
  }, [lines, hydrated]);

  useEffect(() => {
    const onPopState = () => setDrawerOpen(false);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const add = (line: CartLine) =>
    setLines((previous) => {
      if (!isValidLine(line)) return previous;
      const index = previous.findIndex(
        (item) => item.slug === line.slug && item.color === line.color && item.size === line.size,
      );
      if (index >= 0) {
        const copy = [...previous];
        copy[index] = {
          ...copy[index],
          qty: Math.min(MAX_QTY, copy[index].qty + line.qty),
        };
        return copy;
      }
      return [...previous, { ...line, qty: Math.min(MAX_QTY, line.qty) }];
    });

  const remove = (index: number) =>
    setLines((previous) => previous.filter((_, itemIndex) => itemIndex !== index));

  const setQty = (index: number, qty: number) =>
    setLines((previous) =>
      previous.map((line, itemIndex) =>
        itemIndex === index
          ? { ...line, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(qty))) }
          : line,
      ),
    );

  const clear = () => setLines([]);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);

  const openDrawer = useCallback(() => {
    openOverlayHistory("cart");
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    closeOverlayHistory("cart", () => setDrawerOpen(false));
  }, []);

  const dismissDrawer = useCallback(() => {
    dismissOverlayHistory("cart");
    setDrawerOpen(false);
  }, []);

  return (
    <Ctx.Provider
      value={{
        lines,
        count,
        add,
        remove,
        setQty,
        clear,
        subtotal,
        hydrated,
        drawerOpen,
        openDrawer,
        closeDrawer,
        dismissDrawer,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const context = useContext(Ctx);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
