import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("lbb-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let hovering: HTMLElement | null = null;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const tick = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (hovering) {
        const rect = hovering.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.hypot(deltaX, deltaY);
        if (distance < 60) {
          const pull = 0.35 * (1 - distance / 60);
          targetX = mouseX - deltaX * pull;
          targetY = mouseY - deltaY * pull;
        }
      }

      cursorX += (targetX - cursorX) * 0.2;
      cursorY += (targetY - cursorY) * 0.2;
      dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    const onOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(
        "a,button,[data-cursor]",
      ) as HTMLElement | null;
      if (!target) return;
      hovering = target;
      dot.dataset.hover = "true";
    };

    const onOut = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(
        "a,button,[data-cursor]",
      ) as HTMLElement | null;
      if (!target) return;
      hovering = null;
      delete dot.dataset.hover;
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("lbb-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden items-center justify-center rounded-full border border-signal transition-[width,height,background-color] duration-200 md:flex"
      style={{ width: 12, height: 12, mixBlendMode: "difference" }}
    >
      <style>{`
        [data-hover="true"] {
          width: 40px !important;
          height: 40px !important;
          background-color: color-mix(in srgb, var(--lbb-signal) 20%, transparent);
        }
        [data-hover="true"] > span { opacity: 1 !important; }
      `}</style>
      <span className="text-[8px] font-bold uppercase tracking-widest text-bone opacity-0">
        View
      </span>
    </div>
  );
}
