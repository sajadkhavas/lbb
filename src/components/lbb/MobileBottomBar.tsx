import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

const ITEM =
  "flex flex-1 flex-col items-center justify-center gap-1 tap-target transition-colors duration-[220ms] ease-[var(--ease-lbb)]";

function Badge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="num absolute -top-1.5 -left-2 flex h-4 min-w-4 items-center justify-center bg-signal px-1 text-[9px] font-bold text-bone">
      {n.toLocaleString("fa-IR")}
    </span>
  );
}

export function MobileBottomBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();

  const cls = (active: boolean) => `${ITEM} ${active ? "text-signal" : "text-metal"}`;

  return (
    <nav
      dir="rtl"
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-[150] flex border-t border-hairline bg-obsidian/95 backdrop-blur-xl md:hidden"
      style={{
        height: "calc(60px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <Link
        to="/"
        className={cls(pathname === "/")}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        <Home size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[10px]">خانه</span>
      </Link>
      <Link
        to="/shop"
        className={cls(pathname === "/shop")}
        aria-current={pathname === "/shop" ? "page" : undefined}
      >
        <LayoutGrid size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[10px]">فروشگاه</span>
      </Link>
      <Link
        to="/search"
        className={cls(pathname === "/search")}
        aria-current={pathname === "/search" ? "page" : undefined}
      >
        <Search size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[10px]">جست‌وجو</span>
      </Link>
      <Link
        to="/wishlist"
        className={cls(pathname === "/wishlist")}
        aria-current={pathname === "/wishlist" ? "page" : undefined}
      >
        <span className="relative">
          <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
          <Badge n={wishCount} />
        </span>
        <span className="text-[10px]">علاقه‌مندی</span>
      </Link>
      <button type="button" onClick={openDrawer} className={cls(false)}>
        <span className="relative">
          <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
          <Badge n={count} />
        </span>
        <span className="text-[10px]">سبد</span>
      </button>
    </nav>
  );
}
