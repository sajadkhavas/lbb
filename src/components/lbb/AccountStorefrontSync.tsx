import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentCustomer, isAuthenticationError, isLiveBackend } from "@/lib/backend-api";
import { useCart, type CartLine } from "@/lib/cart";
import {
  getAccountStorefrontState,
  replaceAccountCart,
  replaceAccountWishlist,
  type AccountCartStateItem,
} from "@/lib/final-technical-api";
import { useWishlist } from "@/lib/wishlist";

const AUTH_EVENT = "lbb:customer-authenticated";
const LOGOUT_EVENT = "lbb:customer-logged-out";

function remoteCartLine(item: AccountCartStateItem): CartLine {
  return {
    slug: item.slug,
    name: item.name,
    price: item.priceToman,
    variantId: item.variantId,
    source: "backend",
    colorLabel: item.colorLabel ?? undefined,
    sizeLabel: item.sizeLabel ?? undefined,
    qty: item.quantity,
  };
}

function mergeCart(local: CartLine[], remote: AccountCartStateItem[]) {
  const byVariant = new Map<string, CartLine>();

  for (const item of remote) {
    byVariant.set(item.variantId, remoteCartLine(item));
  }

  for (const line of local) {
    if (line.source !== "backend" || !line.variantId) continue;
    const existing = byVariant.get(line.variantId);
    if (!existing) {
      byVariant.set(line.variantId, line);
      continue;
    }
    byVariant.set(line.variantId, {
      ...existing,
      qty: Math.min(20, Math.max(existing.qty, line.qty)),
    });
  }

  return [...byVariant.values()];
}

export function AccountStorefrontSync() {
  const { lines, hydrated: cartHydrated, replace: replaceLocalCart } = useCart();
  const { slugs, hydrated: wishlistHydrated, replace: replaceLocalWishlist } = useWishlist();
  const [authenticated, setAuthenticated] = useState(false);
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  const applyingRemote = useRef(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const probeAuthentication = useCallback(async () => {
    if (!isLiveBackend()) return;
    try {
      await getCurrentCustomer();
      setAuthenticated(true);
    } catch (error) {
      if (isAuthenticationError(error)) {
        setAuthenticated(false);
        setInitialSyncDone(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLiveBackend()) return;
    void probeAuthentication();

    const onAuthenticated = () => {
      setInitialSyncDone(false);
      setAuthenticated(true);
    };
    const onLoggedOut = () => {
      setAuthenticated(false);
      setInitialSyncDone(false);
    };

    window.addEventListener(AUTH_EVENT, onAuthenticated);
    window.addEventListener(LOGOUT_EVENT, onLoggedOut);
    return () => {
      window.removeEventListener(AUTH_EVENT, onAuthenticated);
      window.removeEventListener(LOGOUT_EVENT, onLoggedOut);
    };
  }, [probeAuthentication]);

  useEffect(() => {
    if (!authenticated || !cartHydrated || !wishlistHydrated || initialSyncDone) return;

    let cancelled = false;
    const run = async () => {
      try {
        const remote = (await getAccountStorefrontState()).data;
        if (cancelled) return;

        const mergedWishlist = [...new Set([...remote.wishlistSlugs, ...slugs])].slice(0, 100);
        const mergedCart = mergeCart(lines, remote.cartItems);

        await replaceAccountWishlist(mergedWishlist);
        const canonical = (
          await replaceAccountCart(
            mergedCart
              .filter((line) => line.variantId)
              .map((line) => ({ variantId: line.variantId!, quantity: line.qty })),
          )
        ).data;
        if (cancelled) return;

        applyingRemote.current = true;
        replaceLocalWishlist(canonical.wishlistSlugs);
        replaceLocalCart(canonical.cartItems.map(remoteCartLine));
        queueMicrotask(() => {
          applyingRemote.current = false;
        });
        setInitialSyncDone(true);
      } catch (error) {
        if (isAuthenticationError(error)) {
          setAuthenticated(false);
          setInitialSyncDone(false);
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    authenticated,
    cartHydrated,
    initialSyncDone,
    lines,
    replaceLocalCart,
    replaceLocalWishlist,
    slugs,
    wishlistHydrated,
  ]);

  useEffect(() => {
    if (!authenticated || !initialSyncDone || applyingRemote.current) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);

    syncTimer.current = setTimeout(() => {
      void Promise.all([
        replaceAccountWishlist(slugs),
        replaceAccountCart(
          lines
            .filter((line) => line.source === "backend" && line.variantId)
            .map((line) => ({ variantId: line.variantId!, quantity: line.qty })),
        ),
      ]).catch((error) => {
        if (isAuthenticationError(error)) {
          setAuthenticated(false);
          setInitialSyncDone(false);
        }
      });
    }, 600);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [authenticated, initialSyncDone, lines, slugs]);

  return null;
}

export function notifyCustomerAuthenticated() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
}

export function notifyCustomerLoggedOut() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LOGOUT_EVENT));
}
