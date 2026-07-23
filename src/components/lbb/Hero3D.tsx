import { Suspense, lazy, useEffect, useState } from "react";

const Scene = lazy(() => import("./Hero3DScene"));

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    setMounted(true);
    const check = () => setDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted || !desktop) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 grid place-items-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(232,0,29,0.15) 0%, transparent 60%)",
        }}
      >
        <span
          className="font-black text-[var(--lbb-red)] opacity-20"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 120 }}
        >
          LBB
        </span>
      </div>
    );
  }
  return (
    <div className="absolute inset-0">
      <Suspense fallback={<div className="absolute inset-0" />}>
        <Scene />
      </Suspense>
    </div>
  );
}
