import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("lbb-custom-cursor");

    const dot = dotRef.current!;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    let hovering: HTMLElement | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
    };

    const tick = () => {
      // magnetic pull
      if (hovering) {
        const r = hovering.getBoundingClientRect();
        const hx = r.left + r.width / 2;
        const hy = r.top + r.height / 2;
        const dx = mx - hx, dy = my - hy;
        const dist = Math.hypot(dx, dy);
        if (dist < 60) {
          const pull = 0.35 * (1 - dist / 60);
          mx = mx - dx * pull;
          my = my - dy * pull;
        }
      }
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a,button,[data-cursor]") as HTMLElement | null;
      if (t) {
        hovering = t;
        dot.dataset.hover = "true";
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("a,button,[data-cursor]") as HTMLElement | null;
      if (t) {
        hovering = null;
        delete dot.dataset.hover;
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("lbb-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:flex items-center justify-center rounded-full border border-[var(--lbb-red)] transition-[width,height,background-color] duration-200"
      style={{
        width: 12, height: 12,
        mixBlendMode: "difference",
      }}
    >
      <style>{`
        [data-hover="true"] {
          width: 40px !important; height: 40px !important;
          background-color: rgba(232,0,29,0.2);
        }
        [data-hover="true"] > span { opacity: 1 !important; }
      `}</style>
      <span
        ref={labelRef}
        className="text-[8px] font-bold uppercase tracking-widest text-white opacity-0"
      >
        View
      </span>
    </div>
  );
}
