import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpLeft, Instagram, X } from "lucide-react";
import { useRef } from "react";
import { CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";
import {
  BRAND_NAVIGATION,
  EDITORIAL_NAVIGATION,
  PERSONAL_NAVIGATION,
  SERVICE_NAVIGATION,
  isNavigationItemActive,
} from "@/lib/navigation";
import { useNavigationOverlay } from "@/lib/navigation-overlay";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { Logo } from "@/components/lbb/Logo";
import { NavigationLink } from "@/components/lbb/navigation/NavigationLink";
import { TechLabel } from "@/components/lbb/ui/primitives";

export function MobileMenuOverlay() {
  const { close, dismissForNavigation } = useNavigationOverlay();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(true, dialogRef, close);

  return (
    <div
      ref={dialogRef}
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="منوی اصلی"
      className="fixed inset-0 z-[var(--z-modal)] flex flex-col overflow-y-auto bg-obsidian"
    >
      <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-hairline bg-obsidian/95 px-4 backdrop-blur-xl md:px-8">
        <Link
          to="/"
          data-autofocus
          onClick={dismissForNavigation}
          aria-label="LBB — خانه"
          className="flex items-center gap-2"
        >
          <Logo size={34} />
          <span className="font-display text-xl font-black text-signal">LBB</span>
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="بستن منو"
          className="tap-target grid place-items-center border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="lbb-shell flex-1 py-6 md:py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <section aria-labelledby="mobile-categories">
            <div className="flex items-end justify-between gap-4 border-b border-hairline pb-3">
              <div>
                <TechLabel tone="signal">PRODUCT FIRST</TechLabel>
                <h2 id="mobile-categories" className="mt-2 text-display-3 text-bone">
                  دسته‌های محصول
                </h2>
              </div>
              <Link
                to="/shop"
                onClick={dismissForNavigation}
                className="tech flex min-h-11 items-center gap-2 text-signal"
              >
                همه
                <ArrowUpLeft size={14} aria-hidden="true" />
              </Link>
            </div>

            <ol className="mt-2">
              {CATEGORY_SLUGS.map((slug, index) => {
                const active = pathname === `/${slug}`;
                return (
                  <li key={slug}>
                    <Link
                      to="/$category"
                      params={{ category: slug }}
                      onClick={dismissForNavigation}
                      aria-current={active ? "page" : undefined}
                      className="group grid min-h-[72px] grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline-soft"
                    >
                      <span className="num text-xs text-mute">0{index + 1}</span>
                      <span
                        className={`text-2xl font-black transition-colors md:text-4xl ${active ? "text-signal" : "text-bone group-hover:text-signal"}`}
                      >
                        {CATEGORIES[slug].nameFa}
                      </span>
                      <span className="tech text-mute">{slug.toUpperCase()}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          <aside className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <nav aria-labelledby="mobile-editorial">
              <h2 id="mobile-editorial" className="tech border-b border-hairline pb-3 text-bone">
                کالکشن و محتوا
              </h2>
              <ul className="mt-2">
                {EDITORIAL_NAVIGATION.map((item) => (
                  <li key={String(item.to)}>
                    <NavigationLink
                      item={item}
                      active={isNavigationItemActive(pathname, item)}
                      onNavigate={dismissForNavigation}
                      className="group flex min-h-14 items-center justify-between gap-4 border-b border-hairline-soft"
                    >
                      <span>
                        <span className="block text-sm font-bold text-bone group-hover:text-signal">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-[11px] text-mute">{item.description}</span>
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

            <div className="grid grid-cols-2 gap-6">
              <nav aria-labelledby="mobile-personal">
                <h2 id="mobile-personal" className="tech text-bone">
                  شخصی
                </h2>
                <ul className="mt-3 space-y-2.5">
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
              <nav aria-labelledby="mobile-service">
                <h2 id="mobile-service" className="tech text-bone">
                  راهنما
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {SERVICE_NAVIGATION.map((item) => (
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

            <nav aria-labelledby="mobile-brand" className="border-t border-hairline pt-6">
              <h2 id="mobile-brand" className="sr-only">
                برند
              </h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {BRAND_NAVIGATION.map((item) => (
                  <li key={String(item.to)}>
                    <NavigationLink
                      item={item}
                      onNavigate={dismissForNavigation}
                      className="tech text-mute transition-colors hover:text-bone"
                    />
                  </li>
                ))}
              </ul>
              <a
                href="https://www.instagram.com/lbbclo"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-2 border border-hairline px-4 text-xs text-metal transition-colors hover:border-signal hover:text-signal"
              >
                <Instagram size={15} aria-hidden="true" />
                @LBBCLO
              </a>
            </nav>
          </aside>
        </div>
      </div>
    </div>
  );
}
