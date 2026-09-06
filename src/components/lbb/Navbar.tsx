import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, UserRound, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { Logo } from "@/components/lbb/Logo";
import { useNavigationOverlay } from "@/lib/navigation-overlay";
import {
  isMerchantNavigationItemActive,
  MerchantNavigationLink,
} from "@/components/lbb/navigation/MerchantNavigationLink";
import { MegaMenuOverlay } from "@/components/lbb/navigation/MegaMenuOverlay";
import { MobileMenuOverlay } from "@/components/lbb/navigation/MobileMenuOverlay";
import { SearchOverlay } from "@/components/lbb/navigation/SearchOverlay";
import { useStorefrontControl } from "@/lib/storefront-control";

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="num absolute -left-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-signal px-1 text-[9px] font-bold leading-none text-obsidian">
      {count.toLocaleString("fa-IR")}
    </span>
  );
}

export function Navbar({
  theme = "dark",
  offsetTop = 0,
}: {
  theme?: "dark" | "light";
  offsetTop?: number;
}) {
  const { navigation, brand } = useStorefrontControl();
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { active, open, dismissForNavigation } = useNavigationOverlay();
  const { count, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = theme === "light";
  const ink = isLight && !scrolled ? "text-obsidian" : "text-bone";
  const barSkin = scrolled
    ? "border-b border-hairline bg-[var(--lbb-surface-glass)] shadow-raised backdrop-blur-xl"
    : isLight
      ? "border-b border-transparent bg-transparent"
      : "border-b border-transparent bg-gradient-to-b from-obsidian/75 to-transparent";
  const iconClass = `relative grid tap-target place-items-center border border-transparent transition-colors ${ink} hover:border-hairline hover:text-signal`;
  const shopActive = navigation.shop.some((item) => isMerchantNavigationItemActive(pathname, item));

  const openCart = () => {
    dismissForNavigation();
    openDrawer();
  };

  return (
    <>
      <nav
        dir="rtl"
        aria-label="ناوبری اصلی"
        className={`fixed inset-x-0 z-[var(--z-nav)] transition-[background-color,border-color,box-shadow] duration-[var(--dur-state)] ${barSkin}`}
        style={{ top: offsetTop }}
      >
        <div
          className="lbb-shell flex items-center justify-between gap-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto]"
          style={{ height: "var(--lbb-nav-h)" }}
        >
          <Link
            to="/"
            aria-label={`${brand.nameFa} — خانه`}
            className="flex min-w-0 shrink-0 items-center gap-2"
          >
            <Logo size={34} />
            <span className="hidden font-display text-xl font-black leading-none tracking-[-0.05em] text-signal sm:inline md:text-2xl">
              {brand.nameFa}
            </span>
          </Link>

          <div className="hidden min-w-0 items-center justify-center lg:flex">
            <ul className="flex items-center gap-1">
              <li>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={active === "mega"}
                  aria-controls="lbb-mega-menu"
                  onClick={() => open("mega")}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      open("mega");
                    }
                  }}
                  className={`tech flex min-h-11 items-center gap-1.5 px-4 transition-colors ${
                    shopActive || active === "mega"
                      ? "text-signal"
                      : `${ink} opacity-75 hover:opacity-100`
                  }`}
                >
                  فروشگاه
                  <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={`transition-transform ${active === "mega" ? "rotate-180" : ""}`}
                  />
                </button>
              </li>
              {navigation.editorial.map((item) => {
                const current = isMerchantNavigationItemActive(pathname, item);
                return (
                  <li key={`${item.href}-${item.label}`}>
                    <MerchantNavigationLink
                      item={item}
                      onNavigate={dismissForNavigation}
                      className={`tech flex min-h-11 items-center px-4 transition-colors ${
                        current ? "text-signal" : `${ink} opacity-75 hover:opacity-100`
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 [&_svg]:block [&_svg]:shrink-0">
            <button
              type="button"
              aria-label="جست‌وجو"
              aria-haspopup="dialog"
              aria-expanded={active === "search"}
              onClick={() => open("search")}
              className={iconClass}
            >
              <Search size={18} strokeWidth={1.6} aria-hidden="true" />
            </button>

            <Link
              to="/account"
              aria-label="حساب کاربری"
              aria-current={pathname === "/account" ? "page" : undefined}
              className={`${iconClass} hidden sm:grid ${pathname === "/account" ? "text-signal" : ""}`}
            >
              <UserRound size={18} strokeWidth={1.6} aria-hidden="true" />
            </Link>

            <Link
              to="/wishlist"
              aria-label={`علاقه‌مندی‌ها (${wishlistCount.toLocaleString("fa-IR")})`}
              aria-current={pathname === "/wishlist" ? "page" : undefined}
              className={`${iconClass} hidden sm:grid ${pathname === "/wishlist" ? "text-signal" : ""}`}
            >
              <Heart size={18} strokeWidth={1.6} aria-hidden="true" />
              <CountBadge count={wishlistCount} />
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`سبد خرید (${count.toLocaleString("fa-IR")})`}
              aria-haspopup="dialog"
              className={iconClass}
            >
              <ShoppingBag size={18} strokeWidth={1.6} aria-hidden="true" />
              <CountBadge count={count} />
            </button>

            <button
              type="button"
              aria-label="منوی اصلی"
              aria-haspopup="dialog"
              aria-expanded={active === "menu"}
              onClick={() => open("menu")}
              className={`${iconClass} ms-0.5`}
            >
              <Menu size={20} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {active === "mega" ? (
        <div id="lbb-mega-menu">
          <MegaMenuOverlay offsetTop={offsetTop} />
        </div>
      ) : null}
      {active === "menu" ? <MobileMenuOverlay /> : null}
      {active === "search" ? <SearchOverlay /> : null}
    </>
  );
}
