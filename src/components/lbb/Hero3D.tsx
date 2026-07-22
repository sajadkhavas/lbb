import { Suspense, lazy, useEffect, useState } from "react";

// Lazy 3D scene — client only, never SSR
const Scene = lazy(() => import("./Hero3DScene"));

function useIsDesktop() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return ok;
}

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const desktop = useIsDesktop();

  if (!mounted || !desktop) {
    // Static gradient fallback (mobile + SSR)
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 60% 40%, rgba(232,0,29,0.5) 0%, rgba(232,0,29,0.15) 40%, rgba(10,10,10,0) 70%), #0A0A0A",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
        <Scene />
      </Suspense>
    </div>
  );
}
