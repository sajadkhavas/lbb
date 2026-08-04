export const FREE_SHIPPING_THRESHOLD = 2_000_000;
export const STANDARD_SHIPPING_FEE = 60_000;

const DEMO_ORDERS_KEY = "lbb-demo-orders-v1";
const MAX_DEMO_ORDERS = 5;

export type DemoOrderSummary = {
  ref: string;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
};

export function shippingFeeFor(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function createDemoOrderRef(): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const value = crypto.getRandomValues(new Uint32Array(1))[0] % 900_000;
    return String(100_000 + value);
  }
  return String(100_000 + Math.floor(Math.random() * 900_000));
}

function isDemoOrder(value: unknown): value is DemoOrderSummary {
  if (!value || typeof value !== "object") return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.ref === "string" &&
    /^\d{6}$/.test(order.ref) &&
    typeof order.itemCount === "number" &&
    Number.isInteger(order.itemCount) &&
    order.itemCount > 0 &&
    typeof order.subtotal === "number" &&
    Number.isFinite(order.subtotal) &&
    order.subtotal > 0 &&
    typeof order.shipping === "number" &&
    Number.isFinite(order.shipping) &&
    order.shipping >= 0 &&
    typeof order.total === "number" &&
    Number.isFinite(order.total) &&
    order.total === order.subtotal + order.shipping &&
    typeof order.createdAt === "string" &&
    !Number.isNaN(Date.parse(order.createdAt))
  );
}

function readDemoOrders(): DemoOrderSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(DEMO_ORDERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isDemoOrder) : [];
  } catch {
    return [];
  }
}

export function saveDemoOrder(order: DemoOrderSummary): boolean {
  if (typeof window === "undefined" || !isDemoOrder(order)) return false;
  try {
    const next = [order, ...readDemoOrders().filter((item) => item.ref !== order.ref)].slice(
      0,
      MAX_DEMO_ORDERS,
    );
    window.sessionStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function latestDemoOrder(): DemoOrderSummary | undefined {
  return readDemoOrders()[0];
}

export function findDemoOrder(ref: string): DemoOrderSummary | undefined {
  if (!/^\d{6}$/.test(ref)) return undefined;
  return readDemoOrders().find((order) => order.ref === ref);
}
