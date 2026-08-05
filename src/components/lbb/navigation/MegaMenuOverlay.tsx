import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpLeft, X } from "lucide-react";
import { useRef } from "react";
import { categoryImage } from "@/lib/category-images";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import {
  EDITORIAL_NAVIGATION,
  PERSONAL_NAVIGATION,
  SERVICE_NAVIGATION,
  isNavigationItemActive,
} from "@/lib/navigation";
import { useNavigationOverlay } from "@/lib/navigation-overlay";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { TechLabel } from "@/components/lbb/ui/primitives";
import { NavigationLink } from "@/components/lbb/navigation/NavigationLink";

export function MegaMenuOverlay({ offsetTop = 0 }: { offsetTop?: number }) {
  const { close, dismissForNavigation } = useNavigationOverlay();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(true, panelRef, close);

  return (
    <div dir="rtl" className="fixed inset-0 z-[var(--z-overlay)]">
      <button
        type="button"
        aria-label="بستن منوی فروشگاه"
        onClick={close}
        className="absolute inset-0 bg-[var(--lbb-surface-overlay)] backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="منوی فروشگاه"
        className="absolute inset-x-0 overflow-y-auto border-b border-hairline bg-obsidian shadow-overlay"
        style={{
          top: `calc(${offsetTop}px + var(--lbb-nav-h))`,
          maxHeight: `calc(100svh - ${offsetTop}px - var(--lbb-nav-h))`,
        }}
      >
        <div className="lbb-shell py-6 lg:py-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <TechLabel tone="signal">SHOP INDEX / F12</TechLabel>
              <h2 className="mt-2 text-display-3 text-bone">انتخاب سریع، بدون حدس</h2>
              <p className="mt-2 max-w-[54ch] text-sm leading-7 text-metal">
                دسته‌ها در سطح اول قرار گرفته‌اند؛ هر مسیر مستقیماً به صفحه قابل‌اشتراک و
                قابل‌جست‌وجوی خودش می‌رسد.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="بستن منوی فروشگاه"
              className="tap-target grid shrink-0 place-items-center border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <section aria-labelledby="mega-categories">
              <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3">
                <h3 id="mega-categories" className="tech text-bone">
                  دسته‌های محصول
                </h3>
                <Link
                  to="/shop"
                  data-autofocus
                  onClick={dismissForNavigation}
                  className="tech flex min-h-11 items-center gap-2 text-signal"
                >
                  همه محصولات
                  <ArrowUpLeft size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-5">
                {CATEGORY_SLUGS.map((slug) => {
                  const active = pathname === `/${slug}`;
                  return (
                    <Link
                      key={slug}
                      to="/$category"
                      params={{ category: slug }}
                      onClick={dismissForNavigation}
                      aria-current={active ? "page" : undefined}
                      className="group relative min-w-0 overflow-hidden border border-hairline bg-carbon focus-visible:ring-2 focus-visible:ring-signal"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img
                          src={categoryImage(slug)}
                          alt=""
                          width={640}
                          height={800}
                          loading="lazy"
                          decoding="async"
                          className="frame-zoom h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-100"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"
                        />
                        <span className="absolute inset-x-0 bottom-0 p-3">
                          <span
                            className={`block text-sm font-black ${active ? "text-signal" : "text-bone"}`}
                          >
                            {CATEGORIES[slug].nameFa}
                          </span>
                          <span className="tech mt-1 block text-metal">{slug.toUpperCase()}</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            <aside className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
              <nav aria-labelledby="mega-editorial">
                <h3 id="mega-editorial" className="tech border-b border-hairline pb-3 text-bone">
                  داستان و کالکشن
                </h3>
                <ul className="mt-2">
                  {EDITORIAL_NAVIGATION.map((item) => (
                    <li key={String(item.to)}>
                      <NavigationLink
                        item={item}
                        active={isNavigationItemActive(pathname, item)}
                        onNavigate={dismissForNavigation}
                        className="group flex min-h-14 items-center justify-between gap-4 border-b border-hairline-soft py-2"
                      >
                        <span>
                          <span className="block text-sm font-bold text-bone transition-colors group-hover:text-signal">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-[11px] text-mute">
                            {item.description}
                          </span>
                        </span>
                        <ArrowUpLeft
                          size={15}
                          aria-hidden="true"
                          className="text-mute group-hover:text-signal"
                        />
                      </NavigationLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="grid grid-cols-2 gap-5">
                <nav aria-labelledby="mega-service">
                  <h3 id="mega-service" className="tech text-bone">
                    راهنما
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {SERVICE_NAVIGATION.slice(0, 4).map((item) => (
                      <li key={String(item.to)}>
                        <NavigationLink
                          item={item}
                          onNavigate={dismissForNavigation}
                          className="text-xs leading-6 text-metal transition-colors hover:text-bone"
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
                <nav aria-labelledby="mega-personal">
                  <h3 id="mega-personal" className="tech text-bone">
                    شخصی
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {PERSONAL_NAVIGATION.map((item) => (
                      <li key={String(item.to)}>
                        <NavigationLink
                          item={item}
                          onNavigate={dismissForNavigation}
                          className="text-xs leading-6 text-metal transition-colors hover:text-bone"
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
