import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartLineRequest } from "@/lib/backend-api";
import { getBackendMode } from "@/lib/backend-api";
import {
  closeOverlayHistory,
  dismissOverlayHistory,
  openOverlayHistory,
} from "@/lib/overlay-history";

export type CartLine = {
  slug: string;
  name: string;
  /** Last displayed unit price. In live mode this is never the checkout authority. */
  price: number;
  variantId?: string;
  source?: "prototype" | "backend";
  color?: string;
  colorLabel?: string;
  size?: string;
  sizeLabel?: string;
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
const PROTOTYPE_KEY = "lbb-cart-v1";
const LIVE_KEY = "lbb-cart-v2";
const MAX_QTY = 20;

function storageKey() {
  return getBackendMode() === "live" ? LIVE_KEY : PROTOTYPE_KEY;
}

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
    (line.variantId === undefined || typeof line.variantId === "string") &&
    (line.source === undefined || line.source === "prototype" || line.source === "backend") &&
    (line.color === undefined || typeof line.color === "string") &&
    (line.colorLabel === undefined || typeof line.colorLabel === "string") &&
    (line.size === undefined || typeof line.size === "string") &&
    (line.sizeLabel === undefined || typeof line.sizeLabel === "string")
  );
}

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(isValidLine);
    if (getBackendMode() === "live") {
      return valid.filter(
        (line) =>
          line.source === "backend" &&
          typeof line.variantId === "string" &&
          line.variantId.length === 26,
      );
    }
    return valid;
  } catch {
    return [];
  }
}

export function cartLinesToBackendItems(lines: CartLine[]): CartLineRequest[] {
  return lines
    .filter(
      (line) =>
        line.source === "backend" &&
        typeof line.variantId === "string" &&
        line.variantId.length === 26,
    )
    .map((line) => ({
      variantId: line.variantId!,
      quantity: Math.min(MAX_QTY, Math.max(1, Math.floor(line.qty))),
      expectedUnitPriceToman: Math.max(1, Math.floor(line.price)),
    }));
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
      localStorage.setItem(storageKey(), JSON.stringify(lines));
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
      if (
        getBackendMode() === "live" &&
        (line.source !== "backend" || !line.variantId || line.variantId.length !== 26)
      ) {
        return previous;
      }
      const index = previous.findIndex((item) =>
        line.variantId && item.variantId
          ? item.variantId === line.variantId
          : item.slug === line.slug && item.color === line.color && item.size === line.size,
      );
      if (index >= 0) {
        const copy = [...previous];
        copy[index] = {
          ...copy[index],
          ...line,
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
