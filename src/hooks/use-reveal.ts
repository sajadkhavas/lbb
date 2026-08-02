import { useEffect, useRef } from "react";

type RevealOptions = {
  /** Selector (scoped to root) for the items to animate; defaults to direct children. */
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  once?: boolean;
};

/**
 * SSR-safe scroll-reveal hook. Dynamically imports GSAP + ScrollTrigger inside
 * an effect, fades/translates matched elements into place once, and cleans up
 * the ScrollTrigger on unmount. No-ops entirely under prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement>(opts: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const {
      selector = ":scope > *",
      y = 32,
      stagger = 0.08,
      duration = 0.8,
      start = "top 82%",
    } = opts;

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const targets = root.querySelectorAll(selector);
        if (!targets.length) return;
        gsap.fromTo(
          targets,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            stagger,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start, once: true },
          },
        );
      }, root);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
