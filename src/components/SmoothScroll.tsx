import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let destroy = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }] = await Promise.all([
        import("lenis"),
        import("gsap"),
      ]);
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      destroy = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  return <>{children}</>;
}
