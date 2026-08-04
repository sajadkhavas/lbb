import { Link } from "@tanstack/react-router";
import { CtaClasses } from "@/components/lbb/ui/primitives";

/**
 * Social announcement CTA.
 *
 * Until a real newsletter API and consent storage are connected, this section
 * must not pretend to subscribe an address or display a false success state.
 */
export function Newsletter() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-carbon px-6 py-20 md:px-10"
      aria-labelledby="newsletter-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--lbb-signal) 14%, transparent)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center">
        <p className="tech text-signal">OFFICIAL UPDATES</p>
        <h2 id="newsletter-title" className="text-display-2 text-bone">
          از دراپ بعدی جا نمونی
        </h2>
        <p className="max-w-lg text-lede">
          زمان انتشار، پشت‌صحنه طراحی و موجودشدن قطعه‌های جدید ابتدا در صفحه رسمی LBB اعلام می‌شود.
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            className={`${CtaClasses("signal")} rounded-xl`}
          >
            دنبال کردن @LBBCLO
          </a>
          <Link to="/contact" className={`${CtaClasses("line")} rounded-xl`}>
            تماس با LBB
          </Link>
        </div>
      </div>
    </section>
  );
}
