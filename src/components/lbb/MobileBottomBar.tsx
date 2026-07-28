import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function MobileBottomBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();

  const itemCls =
    "flex flex-1 flex-col items-center justify-center gap-1 transition-transform active:scale-90";
  const color = (active: boolean) =>
    ({ color: active ? "var(--lbb-red)" : "rgba(255,255,255,0.55)" });

  return (
    <nav
      dir="rtl"
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-[150] flex border-t border-white/[0.08] md:hidden"
      style={{
        height: "calc(64px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(16px)",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      <Link to="/" className={itemCls} style={color(pathname === "/")}>
        <Home size={22} strokeWidth={1.5} />
        <span className="text-[10px]">خانه</span>
      </Link>
      <Link to="/shop" className={itemCls} style={color(pathname === "/shop")}>
        <LayoutGrid size={22} strokeWidth={1.5} />
        <span className="text-[10px]">فروشگاه</span>
      </Link>
      <Link to="/search" className={itemCls} style={color(pathname === "/search")}>
        <Search size={22} strokeWidth={1.5} />
        <span className="text-[10px]">جستجو</span>
      </Link>
      <Link to="/wishlist" className={itemCls} style={color(pathname === "/wishlist")}>
        <div className="relative">
          <Heart size={22} strokeWidth={1.5} />
          {wishCount > 0 && (
            <span className="absolute -top-1 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lbb-red)] px-1 text-[9px] font-bold text-white">
              {wishCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">علاقه‌مندی</span>
      </Link>
      <button onClick={openDrawer} className={itemCls} style={color(false)} aria-label="سبد خرید">
        <div className="relative">
          <ShoppingBag size={22} strokeWidth={1.5} />
          {count > 0 && (
            <span className="absolute -top-1 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lbb-red)] px-1 text-[9px] font-bold text-white">
              {count}
            </span>
          )}
        </div>
        <span className="text-[10px]">سبد</span>
      </button>
    </nav>
  );
}
