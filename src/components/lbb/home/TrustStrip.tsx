import { useEffect, useRef } from "react";
import { Truck, RotateCcw, Lock, Phone } from "lucide-react";

const ITEMS = [
  { Icon: Truck, title: "ارسال به سراسر ایران", sub: "ارسال رایگان بالای ۵۰۰ هزار تومان" },
  { Icon: RotateCcw, title: "مرجوعی آسان", sub: "تا ۷ روز بدون سوال" },
  { Icon: Lock, title: "پرداخت امن", sub: "درگاه بانکی معتبر" },
  { Icon: Phone, title: "پشتیبانی", sub: "۹ صبح تا ۹ شب" },
];

export function TrustStrip() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;
      const ctx = gsap.context(() => {
        gsap.from(".trust-item", {
          x: -20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 85%" },
        });
      }, root);
      cleanup = () => ctx.revert();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section ref={ref} dir="rtl" className="bg-[#0A0A0A] px-5 py-10 md:px-10" aria-label="مزایای خرید از LBB">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-white/[0.07]">
        {ITEMS.map(({ Icon, title, sub }) => (
          <div key={title} className="trust-item flex items-start gap-3 px-2">
            <Icon size={24} className="shrink-0 text-[var(--lbb-red)]" aria-hidden="true" />
            <div>
              <p className="text-[13px] font-semibold text-white font-display">
                {title}
              </p>
              <p className="mt-1 text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
