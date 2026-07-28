import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
  add: (l: CartLine) => void;
  remove: (idx: number) => void;
  setQty: (idx: number, qty: number) => void;
  clear: () => void;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "lbb-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);


  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = (l: CartLine) =>
    setLines((prev) => {
      const i = prev.findIndex(
        (x) => x.slug === l.slug && x.color === l.color && x.size === l.size,
      );
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + l.qty };
        return copy;
      }
      return [...prev, l];
    });
  const remove = (idx: number) =>
    setLines((prev) => prev.filter((_, i) => i !== idx));
  const setQty = (idx: number, qty: number) =>
    setLines((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, qty: Math.max(1, qty) } : l)),
    );
  const clear = () => setLines([]);

  const count = lines.reduce((a, b) => a + b.qty, 0);
  const subtotal = lines.reduce((a, b) => a + b.price * b.qty, 0);

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
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );

}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
