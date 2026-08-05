export type OverlayHistoryId = "mega" | "menu" | "search" | "cart" | "quickview";

const HISTORY_KEY = "__lbbOverlay";

function browserReady() {
  return typeof window !== "undefined" && typeof window.history !== "undefined";
}

function currentState(): Record<string, unknown> {
  if (!browserReady()) return {};
  const state = window.history.state;
  return state && typeof state === "object" ? { ...state } : {};
}

export function currentOverlayHistoryId(): OverlayHistoryId | null {
  if (!browserReady()) return null;
  const value = currentState()[HISTORY_KEY];
  return value === "mega" ||
    value === "menu" ||
    value === "search" ||
    value === "cart" ||
    value === "quickview"
    ? value
    : null;
}

export function openOverlayHistory(id: OverlayHistoryId) {
  if (!browserReady()) return;
  const state = currentState();
  if (currentOverlayHistoryId()) {
    window.history.replaceState({ ...state, [HISTORY_KEY]: id }, "", window.location.href);
    return;
  }
  window.history.pushState({ ...state, [HISTORY_KEY]: id }, "", window.location.href);
}

export function closeOverlayHistory(id: OverlayHistoryId, fallback: () => void) {
  if (!browserReady() || currentOverlayHistoryId() !== id) {
    fallback();
    return;
  }
  window.history.back();
}

export function dismissOverlayHistory(id: OverlayHistoryId) {
  if (!browserReady() || currentOverlayHistoryId() !== id) return;
  const state = currentState();
  delete state[HISTORY_KEY];
  window.history.replaceState(state, "", window.location.href);
}
