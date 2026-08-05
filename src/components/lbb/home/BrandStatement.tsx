import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import { BRAND } from "@/lib/brand";

export function BrandStatement() {
  return (
    <section
      dir="rtl"
      className="relative isolate grid min-h-[72svh] place-items-center overflow-hidden bg-signal px-[var(--lbb-gutter)] py-20 text-obsidian"
      aria-labelledby="brand-statement-title"
    >
      <span aria-hidden="true" className="absolute inset-0 grid-marks opacity-20" />
      <div className="relative mx-auto w-full max-w-[var(--lbb-shell-max)]">
        <TechLabel tone="inverse">LBB / KARAJ / MAHESTAN</TechLabel>
        <h2
          id="brand-statement-title"
          className="mt-6 max-w-[12ch] text-[clamp(3.25rem,10vw,10rem)] font-black leading-[0.82] tracking-[-0.06em]"
        >
          پوشاکی برای حرکت؛ نه فقط برای نگاه.
        </h2>
        <div className="mt-10 grid gap-7 border-t border-obsidian/35 pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p className="max-w-[58ch] text-sm font-semibold leading-8 text-obsidian/80">
            {BRAND.shortIntroduction} زبان بصری LBB از فرم آزاد، رنگ‌های تیره و جزئیات روشن ساخته
            می‌شود؛ اما انتخاب هر قطعه بر پایهٔ جنس، تن‌خور و اندازهٔ واقعی آن است.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className={CtaClasses("bone", "lg")}>
              انتخاب قطعهٔ نخست
              <ArrowUpLeft size={17} aria-hidden="true" />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center justify-center border border-obsidian px-6 text-sm font-black text-obsidian transition-colors hover:bg-obsidian hover:text-bone"
            >
              دربارهٔ LBB
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
