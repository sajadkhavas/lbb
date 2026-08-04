import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let destroy = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (time: number) => lenis.raf(time * 1000);
      // Without this, ScrollTrigger never updates while Lenis animates the
      // scroll position, so scroll-reveal sections stay hidden.
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      destroy = () => {
        gsap.ticker.remove(raf);
        lenis.off("scroll", ScrollTrigger.update);
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
