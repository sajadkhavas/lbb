import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, LayoutGrid, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useNavigationOverlay } from "@/lib/navigation-overlay";

const ITEM =
  "relative flex flex-1 flex-col items-center justify-center gap-1 tap-target transition-colors duration-[var(--dur-micro)] ease-[var(--ease-lbb-standard)]";

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="num absolute -left-2 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-signal px-1 text-[9px] font-bold text-obsidian">
      {count.toLocaleString("fa-IR")}
    </span>
  );
}

export function MobileBottomBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { active, open, dismissForNavigation } = useNavigationOverlay();
  const { count, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  const itemClass = (activeItem: boolean) =>
    `${ITEM} ${activeItem ? "text-signal" : "text-metal hover:text-bone"}`;

  const openCart = () => {
    dismissForNavigation();
    openDrawer();
  };

  return (
    <nav
      dir="rtl"
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-[var(--z-nav)] flex border-t border-hairline bg-[var(--lbb-surface-glass)] shadow-raised backdrop-blur-xl md:hidden"
      style={{
        height: "calc(64px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <Link
        to="/"
        className={itemClass(pathname === "/")}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        <Home size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[10px] font-semibold">خانه</span>
      </Link>
      <Link
        to="/shop"
        className={itemClass(pathname === "/shop" || /^\/(hoodies|pants|tshirts|shoes|socks)$/.test(pathname))}
        aria-current={pathname === "/shop" ? "page" : undefined}
      >
        <LayoutGrid size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[10px] font-semibold">فروشگاه</span>
      </Link>
      <button
        type="button"
        onClick={() => open("search")}
        aria-label="باز کردن جست‌وجو"
        aria-haspopup="dialog"
        aria-expanded={active === "search"}
        className={itemClass(active === "search" || pathname === "/search")}
      >
        <Search size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[10px] font-semibold">جست‌وجو</span>
      </button>
      <Link
        to="/wishlist"
        className={itemClass(pathname === "/wishlist")}
        aria-current={pathname === "/wishlist" ? "page" : undefined}
      >
        <span className="relative">
          <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
          <Badge count={wishlistCount} />
        </span>
        <span className="text-[10px] font-semibold">علاقه‌مندی</span>
      </Link>
      <button
        type="button"
        onClick={openCart}
        aria-label={`باز کردن سبد خرید (${count.toLocaleString("fa-IR")})`}
        aria-haspopup="dialog"
        className={itemClass(false)}
      >
        <span className="relative" aria-hidden="true">
          <ShoppingBag size={20} strokeWidth={1.5} />
          <Badge count={count} />
        </span>
        <span className="text-[10px] font-semibold">سبد</span>
      </button>
    </nav>
  );
}
