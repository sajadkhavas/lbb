import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Instagram, MapPin } from "lucide-react";
import {
  BRAND_NAVIGATION,
  EDITORIAL_NAVIGATION,
  PERSONAL_NAVIGATION,
  SERVICE_NAVIGATION,
  SHOP_NAVIGATION,
} from "@/lib/navigation";
import { BRAND, BRAND_COPY } from "@/lib/brand";
import { NavigationLink } from "@/components/lbb/navigation/NavigationLink";
import { Logo } from "@/components/lbb/Logo";
import { TrustMarks } from "@/components/lbb/TrustMarks";
import { TechLabel } from "@/components/lbb/ui/primitives";

function FooterList({ title, items }: { title: string; items: typeof SHOP_NAVIGATION }) {
  const id = `footer-${title.replace(/\s+/g, "-")}`;
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="tech text-bone">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={`${String(item.to)}-${item.label}`}>
            <NavigationLink
              item={item}
              className="text-sm leading-7 text-metal transition-colors hover:text-signal"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Global dark footer. The theme prop remains for compatibility with existing routes. */
export function Footer(_props: { theme?: "dark" | "light" } = {}) {
  return (
    <footer dir="rtl" className="border-t border-hairline bg-obsidian pb-bottombar md:pb-0">
      <div className="lbb-shell py-12 md:py-16">
        <div className="grid gap-8 border-b border-hairline pb-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
          <div>
            <TechLabel tone="signal">LBB / KARAJ / MAHESTAN</TechLabel>
            <p className="mt-3 max-w-[16ch] text-display-2 text-bone">{BRAND.slogan}</p>
            <p className="mt-4 max-w-[54ch] text-sm leading-8 text-metal">
              پوشاک شهری با اطلاعات روشن دربارهٔ جنس، تن‌خور، اندازه و موجودی؛ برای انتخابی که به
              ظاهر و حرکت روزمرهٔ شما نزدیک باشد.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/shop"
              className="group flex min-h-14 items-center justify-between bg-signal px-5 text-sm font-black text-obsidian"
            >
              {BRAND_COPY.primaryCta}
              <ArrowUpLeft size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/account"
              className="group flex min-h-14 items-center justify-between border border-hairline px-5 text-sm font-black text-bone transition-colors hover:border-signal"
            >
              حساب کاربری
              <ArrowUpLeft
                size={18}
                aria-hidden="true"
                className="text-mute group-hover:text-signal"
              />
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div className="min-w-0">
            <Logo size={48} withWordmark />
            <p className="mt-4 max-w-xs text-sm leading-7 text-metal">{BRAND.descriptor}</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-metal">
              <MapPin size={16} className="mt-1 shrink-0 text-signal" aria-hidden="true" />
              <span>{BRAND_COPY.storeLocationLabel}</span>
            </p>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 border border-hairline px-4 text-metal transition-colors hover:border-signal hover:text-signal"
            >
              <Instagram size={16} aria-hidden="true" />
              <span className="tech">{BRAND.instagramHandle.toUpperCase()}</span>
            </a>
            <TrustMarks />
          </div>

          <FooterList title="خرید" items={SHOP_NAVIGATION} />
          <FooterList title="کالکشن و محتوا" items={EDITORIAL_NAVIGATION} />
          <FooterList title="پشتیبانی" items={SERVICE_NAVIGATION} />
          <div className="grid grid-cols-2 gap-6 sm:col-span-2 lg:col-span-1 lg:grid-cols-1">
            <FooterList title="شخصی" items={PERSONAL_NAVIGATION} />
            <FooterList title="برند" items={BRAND_NAVIGATION} />
          </div>
        </div>

        <div className="grid gap-4 border-t border-hairline pt-6 text-mute md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="tech">© 2026 LBB — KARAJ / MAHESTAN</p>
            <p className="mt-2 text-[11px] leading-6">{BRAND.shortIntroduction}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/terms" className="text-xs transition-colors hover:text-bone">
              قوانین
            </Link>
            <Link to="/privacy" className="text-xs transition-colors hover:text-bone">
              حریم خصوصی
            </Link>
            <Link to="/contact" className="text-xs transition-colors hover:text-bone">
              تماس
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
