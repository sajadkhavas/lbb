export type PendingCheckout = {
  schemaVersion: 1;
  orderId: string;
  orderNumber: string;
  paymentAvailable: boolean;
  paymentIdempotencyKey: string;
  committedAt: number;
};

type CommitAttempt = {
  schemaVersion: 1;
  quoteId: string;
  idempotencyKey: string;
  createdAt: number;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const PENDING_CHECKOUT_KEY = "lbb-checkout-pending-v1";
export const CHECKOUT_COMMIT_KEY = "lbb-checkout-commit-v1";
const SCHEMA_VERSION = 1 as const;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function fresh(timestamp: number) {
  return Number.isFinite(timestamp) && timestamp > 0 && Date.now() - timestamp <= MAX_AGE_MS;
}

function validPending(value: unknown): value is PendingCheckout {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    record.schemaVersion === SCHEMA_VERSION &&
    typeof record.orderId === "string" &&
    record.orderId.length > 0 &&
    typeof record.orderNumber === "string" &&
    record.orderNumber.length > 0 &&
    typeof record.paymentAvailable === "boolean" &&
    typeof record.paymentIdempotencyKey === "string" &&
    record.paymentIdempotencyKey.length > 0 &&
    typeof record.committedAt === "number" &&
    fresh(record.committedAt)
  );
}

export function readPendingCheckout(storage = browserStorage()): PendingCheckout | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (validPending(parsed)) return parsed;
    storage.removeItem(PENDING_CHECKOUT_KEY);
    return null;
  } catch {
    try {
      storage.removeItem(PENDING_CHECKOUT_KEY);
    } catch {
      // Ignore unavailable storage.
    }
    return null;
  }
}

export function persistPendingCheckout(
  input: Omit<PendingCheckout, "schemaVersion" | "committedAt">,
  storage = browserStorage(),
): PendingCheckout {
  const record: PendingCheckout = {
    schemaVersion: SCHEMA_VERSION,
    ...input,
    committedAt: Date.now(),
  };
  if (!storage) return record;
  try {
    storage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(record));
  } catch {
    // Keep the in-memory handoff usable for this session when persistence is unavailable.
  }
  return record;
}

export function clearPendingCheckoutForOrder(orderId: string, storage = browserStorage()) {
  if (!storage) return;
  const current = readPendingCheckout(storage);
  if (!current || current.orderId !== orderId) return;
  try {
    storage.removeItem(PENDING_CHECKOUT_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}

function readCommitAttempt(storage: StorageLike, quoteId: string): CommitAttempt | null {
  try {
    const raw = storage.getItem(CHECKOUT_COMMIT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CommitAttempt>;
    if (
      parsed.schemaVersion === SCHEMA_VERSION &&
      parsed.quoteId === quoteId &&
      typeof parsed.idempotencyKey === "string" &&
      parsed.idempotencyKey.length > 0 &&
      typeof parsed.createdAt === "number" &&
      fresh(parsed.createdAt)
    ) {
      return parsed as CommitAttempt;
    }
    return null;
  } catch {
    return null;
  }
}

export function getOrCreateCheckoutCommitKey(
  quoteId: string,
  createKey: () => string,
  storage = browserStorage(),
) {
  if (!storage) return createKey();
  const existing = readCommitAttempt(storage, quoteId);
  if (existing) return existing.idempotencyKey;
  const attempt: CommitAttempt = {
    schemaVersion: SCHEMA_VERSION,
    quoteId,
    idempotencyKey: createKey(),
    createdAt: Date.now(),
  };
  try {
    storage.setItem(CHECKOUT_COMMIT_KEY, JSON.stringify(attempt));
  } catch {
    // The returned key remains stable for the current invocation only when storage is unavailable.
  }
  return attempt.idempotencyKey;
}

export function clearCheckoutCommitKey(quoteId: string, storage = browserStorage()) {
  if (!storage) return;
  const current = readCommitAttempt(storage, quoteId);
  if (!current) return;
  try {
    storage.removeItem(CHECKOUT_COMMIT_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
