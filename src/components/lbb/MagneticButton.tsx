import { useRef, type ReactNode } from "react";

/** Wraps a link/button and applies a subtle magnetic hover pull. Respects prefers-reduced-motion. */
export function MagneticButton({
  as: As = "a",
  className,
  children,
  href,
  strength = 0.35,
  ...rest
}: {
  as?: "a" | "button";
  className?: string;
  children: ReactNode;
  href?: string;
  strength?: number;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  const Comp = As as "a";
  return (
    <Comp
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block transition-transform duration-200 ease-out ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}
