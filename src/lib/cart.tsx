import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartLineRequest } from "@/lib/backend-api";
import { getBackendMode, type BackendMode } from "@/lib/backend-api";
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

type CartEnvelope = {
  schemaVersion: 1;
  mode: BackendMode;
  updatedAt: number;
  lines: CartLine[];
};

const Ctx = createContext<CartCtx | null>(null);
const PROTOTYPE_KEY = "lbb-cart-v1";
const LIVE_KEY = "lbb-cart-v2";
const MAX_QTY = 20;
const CART_SCHEMA_VERSION = 1 as const;

function storageKey(mode = getBackendMode()) {
  return mode === "live" ? LIVE_KEY : PROTOTYPE_KEY;
}

function isLineShape(value: unknown): value is CartLine {
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
    (line.variantId === undefined || typeof line.variantId === "string") &&
    (line.source === undefined || line.source === "prototype" || line.source === "backend") &&
    (line.color === undefined || typeof line.color === "string") &&
    (line.colorLabel === undefined || typeof line.colorLabel === "string") &&
    (line.size === undefined || typeof line.size === "string") &&
    (line.sizeLabel === undefined || typeof line.sizeLabel === "string")
  );
}

function lineIdentity(line: CartLine) {
  return line.variantId
    ? `variant:${line.variantId}`
    : `selection:${line.slug}:${line.color ?? ""}:${line.size ?? ""}`;
}

function normalizeQuantity(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

function normalizeCartLines(values: unknown[], mode = getBackendMode()): CartLine[] {
  const normalized: CartLine[] = [];
  for (const value of values) {
    if (!isLineShape(value)) continue;
    if (
      mode === "live" &&
      (value.source !== "backend" ||
        typeof value.variantId !== "string" ||
        value.variantId.length !== 26)
    ) {
      continue;
    }
    const line = { ...value, qty: normalizeQuantity(value.qty) };
    const identity = lineIdentity(line);
    const existingIndex = normalized.findIndex((item) => lineIdentity(item) === identity);
    if (existingIndex < 0) {
      normalized.push(line);
      continue;
    }
    const existing = normalized[existingIndex];
    normalized[existingIndex] = {
      ...existing,
      ...line,
      qty: normalizeQuantity(existing.qty + line.qty),
    };
  }
  return normalized;
}

function parseCart(raw: string | null, mode = getBackendMode()): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return normalizeCartLines(parsed, mode);
    if (!parsed || typeof parsed !== "object") return [];
    const envelope = parsed as Partial<CartEnvelope>;
    if (
      envelope.schemaVersion !== CART_SCHEMA_VERSION ||
      envelope.mode !== mode ||
      !Array.isArray(envelope.lines)
    ) {
      return [];
    }
    return normalizeCartLines(envelope.lines, mode);
  } catch {
    return [];
  }
}

function readCart(mode = getBackendMode()): CartLine[] {
  try {
    return parseCart(localStorage.getItem(storageKey(mode)), mode);
  } catch {
    return [];
  }
}

function persistCart(lines: CartLine[], mode = getBackendMode()) {
  const envelope: CartEnvelope = {
    schemaVersion: CART_SCHEMA_VERSION,
    mode,
    updatedAt: Date.now(),
    lines: normalizeCartLines(lines, mode),
  };
  localStorage.setItem(storageKey(mode), JSON.stringify(envelope));
}

function sameLines(left: CartLine[], right: CartLine[]) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function cartLinesToBackendItems(lines: CartLine[]): CartLineRequest[] {
  return normalizeCartLines(lines, "live").map((line) => ({
    variantId: line.variantId!,
    quantity: normalizeQuantity(line.qty),
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
      persistCart(lines);
    } catch {
      // Storage can be unavailable in private mode or after quota exhaustion.
    }
  }, [lines, hydrated]);

  useEffect(() => {
    const key = storageKey();
    const mode = getBackendMode();
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || event.key !== key) return;
      const next = parseCart(event.newValue, mode);
      setLines((previous) => (sameLines(previous, next) ? previous : next));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onPopState = () => setDrawerOpen(false);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const add = (line: CartLine) =>
    setLines((previous) => normalizeCartLines([...previous, line], getBackendMode()));

  const remove = (index: number) =>
    setLines((previous) => previous.filter((_, itemIndex) => itemIndex !== index));

  const setQty = (index: number, qty: number) =>
    setLines((previous) =>
      previous.map((line, itemIndex) =>
        itemIndex === index ? { ...line, qty: normalizeQuantity(qty) } : line,
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
