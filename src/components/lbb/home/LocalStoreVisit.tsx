import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Instagram, MapPin, MessageCircle } from "lucide-react";
import { CtaClasses, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { BRAND } from "@/lib/brand";
import { lifestyle2 } from "@/lib/product-images";

export function LocalStoreVisit() {
  return (
    <section
      dir="rtl"
      aria-labelledby="local-store-title"
      className="border-t border-hairline bg-carbon py-12 md:py-16"
    >
      <Shell className="grid overflow-hidden rounded-3xl border border-hairline bg-obsidian shadow-overlay lg:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden lg:min-h-[520px]">
          <img
            src={lifestyle2}
            alt="استایل پوشاک شهری LBB"
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent"
          />
          <span className="absolute bottom-5 right-5 rounded-xl border border-bone/30 bg-obsidian/80 px-4 py-3 text-sm font-black text-bone backdrop-blur">
            از مهستان، برای خیابان
          </span>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-9 lg:p-11">
          <TechLabel tone="signal">فروشگاه حضوری LBB</TechLabel>
          <h2 id="local-store-title" className="mt-5 text-display-2 text-bone">
            آنلاین ببین، در مهستان از نزدیک انتخاب کن.
          </h2>
          <p className="mt-5 max-w-[52ch] text-sm leading-8 text-metal">
            مدل‌ها را در سایت مقایسه کن و اگر دوست داشتی برای دیدن رنگ، جنس و تن‌خور از نزدیک به
            فروشگاه LBB در پاساژ مهستان کرج سر بزن.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-carbon p-4">
              <MapPin size={20} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-bone">آدرس فروشگاه</p>
                <p className="mt-1 text-xs leading-6 text-metal">{BRAND.physicalLocationShort}</p>
              </div>
            </div>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-hairline bg-carbon p-4 transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              <Instagram size={20} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-bone">مدل‌های تازه در اینستاگرام</p>
                <p className="mt-1 text-xs leading-6 text-metal">{BRAND.instagramHandle}</p>
              </div>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className={CtaClasses("signal", "lg")}>
              اطلاعات تماس و مراجعه
              <MapPin size={17} aria-hidden="true" />
            </Link>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className={CtaClasses("line", "lg")}
            >
              پیام در اینستاگرام
              <MessageCircle size={17} aria-hidden="true" />
            </a>
          </div>

          <Link
            to="/shop"
            className="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-xs font-black text-signal"
          >
            قبل از مراجعه محصولات را ببین
            <ArrowUpLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </Shell>
    </section>
  );
}
