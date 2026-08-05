/* eslint-disable react-refresh/only-export-components -- provider and hook intentionally share one context module. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  closeOverlayHistory,
  dismissOverlayHistory,
  openOverlayHistory,
  type OverlayHistoryId,
} from "@/lib/overlay-history";

export type NavigationOverlay = Extract<OverlayHistoryId, "mega" | "menu" | "search">;

type NavigationOverlayContextValue = {
  active: NavigationOverlay | null;
  open: (overlay: NavigationOverlay) => void;
  close: () => void;
  dismissForNavigation: () => void;
};

const NavigationOverlayContext = createContext<NavigationOverlayContextValue | null>(null);

export function NavigationOverlayProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<NavigationOverlay | null>(null);

  const open = useCallback((overlay: NavigationOverlay) => {
    openOverlayHistory(overlay);
    setActive(overlay);
  }, []);

  const close = useCallback(() => {
    setActive((current) => {
      if (!current) return null;
      closeOverlayHistory(current, () => setActive(null));
      return current;
    });
  }, []);

  const dismissForNavigation = useCallback(() => {
    setActive((current) => {
      if (current) dismissOverlayHistory(current);
      return null;
    });
  }, []);

  useEffect(() => {
    const onPopState = () => setActive(null);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo(
    () => ({ active, open, close, dismissForNavigation }),
    [active, close, dismissForNavigation, open],
  );

  return (
    <NavigationOverlayContext.Provider value={value}>
      {children}
    </NavigationOverlayContext.Provider>
  );
}

export function useNavigationOverlay() {
  const context = useContext(NavigationOverlayContext);
  if (!context) {
    throw new Error("useNavigationOverlay must be used inside NavigationOverlayProvider");
  }
  return context;
}
