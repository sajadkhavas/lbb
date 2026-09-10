export type Product3dCapabilitySignals = {
  viewportWidth: number;
  saveData: boolean;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  webgl2: boolean;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
  };
};

export function shouldEnableProduct3dViewer(signals: Product3dCapabilitySignals): boolean {
  if (signals.viewportWidth < 1024) return false;
  if (signals.saveData) return false;
  if (!signals.webgl2) return false;
  if (signals.deviceMemory !== null && signals.deviceMemory < 4) return false;
  if (signals.hardwareConcurrency !== null && signals.hardwareConcurrency < 4) return false;

  return true;
}

export function detectProduct3dViewerCapability(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  const nav = navigator as NavigatorWithHints;
  const canvas = document.createElement("canvas");
  let webgl2 = false;

  try {
    const context = canvas.getContext("webgl2", {
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    webgl2 = Boolean(context);

    if (context) {
      const loseContext = context.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
    }
  } catch {
    webgl2 = false;
  }

  return shouldEnableProduct3dViewer({
    viewportWidth: window.innerWidth,
    saveData: nav.connection?.saveData === true,
    deviceMemory:
      typeof nav.deviceMemory === "number" && Number.isFinite(nav.deviceMemory)
        ? nav.deviceMemory
        : null,
    hardwareConcurrency:
      typeof nav.hardwareConcurrency === "number" && Number.isFinite(nav.hardwareConcurrency)
        ? nav.hardwareConcurrency
        : null,
    webgl2,
  });
}
