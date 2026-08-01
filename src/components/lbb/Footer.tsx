import { Link, type LinkProps } from "@tanstack/react-router";
import { Instagram, ArrowUpLeft } from "lucide-react";
import { CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";
import { TechLabel } from "@/components/lbb/ui/primitives";

type Item = { label: string; to: LinkProps["to"]; params?: LinkProps["params"] };

const HELP: Item[] = [
  { label: "راهنمای سایز", to: "/size-guide" },
  { label: "ارسال و مرجوعی", to: "/shipping-returns" },
  { label: "پیگیری سفارش", to: "/track-order" },
  { label: "سوالات متداول", to: "/faq" },
  { label: "تماس با ما", to: "/contact" },
];

const BRAND: Item[] = [
  { label: "درباره LBB", to: "/about" },
  { label: "کالکشن‌ها", to: "/collections" },
  { label: "ژورنال", to: "/journal" },
  { label: "لوک‌بوک", to: "/lookbook" },
  { label: "قوانین و مقررات", to: "/terms" },
  { label: "حریم خصوصی", to: "/privacy" },
];

/**
 * The footer is dark-only in the new identity; `theme` is still accepted so
 * existing call sites keep compiling, but it no longer changes the skin.
 */
export function Footer(_props: { theme?: "dark" | "light" } = {}) {

  return (
    <footer dir="rtl" className="border-t border-hairline bg-obsidian pb-bottombar md:pb-0">
      {/* oversized wordmark band */}
      <div className="lbb-shell overflow-hidden pt-14 md:pt-20">
        <p
          aria-hidden="true"
          className="font-display font-black leading-[0.8] tracking-[-0.06em] text-carbon-2 select-none"
          style={{ fontSize: "clamp(4.5rem, 16vw, 15rem)" }}
        >
          LBB
        </p>
      </div>

      <div className="lbb-shell grid gap-10 pt-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <TechLabel tone="signal">LBB / TEHRAN</TechLabel>
          <p className="mt-4 max-w-xs text-sm leading-7 text-metal">
            استریت‌ویر ایرانی با برش‌های واقعی و جنس ماندگار. طراحی و تولید در تهران.
          </p>
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 border border-hairline px-3 py-2 text-metal transition-colors hover:border-signal hover:text-signal"
          >
            <Instagram size={15} aria-hidden="true" />
            <span className="tech">@LBBCLO</span>
          </a>
        </div>

        <nav aria-labelledby="ft-shop" className="min-w-0">
          <h2 id="ft-shop" className="tech text-bone">
            خرید
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {CATEGORY_SLUGS.map((s) => (
              <li key={s}>
                <Link
                  to="/$category"
                  params={{ category: s }}
                  className="text-sm text-metal transition-colors hover:text-signal"
                >
                  {CATEGORIES[s].nameFa}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/shop" className="text-sm text-bone transition-colors hover:text-signal">
                همهٔ محصولات
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="ft-help" className="min-w-0">
          <h2 id="ft-help" className="tech text-bone">
            پشتیبانی
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {HELP.map((i) => (
              <li key={String(i.to)}>
                <Link to={i.to} className="text-sm text-metal transition-colors hover:text-signal">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <nav aria-labelledby="ft-brand">
            <h2 id="ft-brand" className="tech text-bone">
              برند
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {BRAND.map((i) => (
                <li key={String(i.to)}>
                  <Link to={i.to} className="text-sm text-metal transition-colors hover:text-signal">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/shop"
            className="group mt-8 flex items-center justify-between gap-3 border border-hairline px-4 py-3 transition-colors hover:border-signal"
          >
            <span className="text-sm font-bold text-bone">شروع خرید</span>
            <ArrowUpLeft
              size={16}
              aria-hidden="true"
              className="text-metal transition-colors group-hover:text-signal"
            />
          </Link>
        </div>
      </div>

      <div className="lbb-shell mt-14 flex flex-col gap-2 border-t border-hairline py-6 text-mute md:flex-row md:items-center md:justify-between">
        <span className="tech">© 2026 LBB — ALL RIGHTS RESERVED</span>
        <span className="text-xs">طراحی و ساخت در تهران</span>
      </div>
    </footer>
  );
}
