import { useReveal } from "@/hooks/use-reveal";

export function BrandStatement() {
  const ref = useReveal<HTMLElement>({ selector: ".statement-inner", y: 0, duration: 1 });

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative grid min-h-[70svh] place-items-center overflow-hidden bg-signal px-6 py-24"
      aria-label="بیانیه برند"
    >
      <div className="statement-inner text-center">
        <span className="block text-[9vw] font-black leading-[0.95] text-bone">پوشاک</span>
        <span
          className="block font-black leading-[0.95] text-bone"
          style={{ fontSize: "13vw", letterSpacing: "-0.04em" }}
        >
          یه حرف
        </span>
        <span className="block text-[9vw] font-bold leading-[0.95] text-bone/50">می‌زنه.</span>
      </div>
      <span className="tech absolute bottom-8 inset-inline-start-8 rounded-full border border-bone/20 bg-obsidian/10 px-3 py-1.5 text-bone/70 backdrop-blur-sm">
        LBB ✦ استریت‌ویر تهران
      </span>
    </section>
  );
}
