import { Link } from "@tanstack/react-router";
import { CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";

/**
 * Honest upcoming-drop teaser.
 *
 * A rolling client-side countdown implied a launch date that did not exist.
 * This section now communicates the real state without manufacturing urgency.
 */
export function NewDropCountdown() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-obsidian px-6 py-20 md:px-10"
      aria-labelledby="drop-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--lbb-signal) 0, var(--lbb-signal) 1px, transparent 1px, transparent 24px)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--lbb-signal) 22%, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center gap-7 text-center">
        <TechLabel tone="signal">DROP 002 / IN DEVELOPMENT</TechLabel>
        <h2 id="drop-title" className="text-display-2 text-bone">
          دراپ بعدی در حال طراحی است
        </h2>
        <p className="max-w-xl text-lede">
          تاریخ انتشار پس از نهایی‌شدن تولید اعلام می‌شود. تا آن زمان، تمام قطعه‌های موجود
          دراپ ۰۰۱ را می‌توانی در فروشگاه ببینی.
        </p>

        <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-hairline bg-carbon px-4 py-5">
            <p className="tech text-mute">STATUS</p>
            <p className="mt-2 text-sm font-bold text-bone">در حال توسعه</p>
          </div>
          <div className="rounded-xl border border-hairline bg-carbon px-4 py-5">
            <p className="tech text-mute">CURRENT DROP</p>
            <p className="mt-2 text-sm font-bold text-bone">DROP 001</p>
          </div>
          <div className="rounded-xl border border-hairline bg-carbon px-4 py-5">
            <p className="tech text-mute">ANNOUNCEMENT</p>
            <p className="mt-2 text-sm font-bold text-bone">فقط از کانال رسمی LBB</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/shop" className={`${CtaClasses("signal")} rounded-xl`}>
            مشاهده دراپ ۰۰۱
          </Link>
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            className={`${CtaClasses("line")} rounded-xl`}
          >
            اینستاگرام رسمی
          </a>
        </div>
      </div>
    </section>
  );
}
