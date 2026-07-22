import { useEffect, useRef } from "react";

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    (async () => {
      const gsap = (await import("gsap")).default;
      const st = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(st.ScrollTrigger);
      const inner = ref.current?.querySelector("[data-manifesto-inner]");
      if (!inner || !ref.current) return;
      gsap.set(inner, { scale: 0.85 });
      const anim = gsap.to(inner, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      });
      cleanup = () => { anim.scrollTrigger?.kill(); anim.kill(); };
    })();
    return () => cleanup();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[var(--lbb-red)] px-6"
    >
      <div data-manifesto-inner className="text-center text-white">
        <p className="font-display font-black leading-[0.9]" style={{ fontSize: "8vw", letterSpacing: "-0.03em" }}>
          Not Just
        </p>
        <p className="font-display font-black leading-[0.85]" style={{ fontSize: "12vw", letterSpacing: "-0.04em" }}>
          Clothes.
        </p>
        <p
          className="font-display font-black leading-[0.9] text-white/40"
          style={{ fontSize: "8vw", letterSpacing: "-0.03em" }}
        >
          A Statement.
        </p>
      </div>
      <span className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.3em] text-white/50">
        Est. LBB ✦ Tehran
      </span>
    </section>
  );
}
