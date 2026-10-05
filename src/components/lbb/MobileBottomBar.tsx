import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronUp,
  Heart,
  Home,
  Instagram,
  LayoutGrid,
  MessageCircle,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useNavigationOverlay } from "@/lib/navigation-overlay";

const ITEM =
  "relative flex flex-1 flex-col items-center justify-center gap-1 tap-target transition-colors duration-[var(--dur-micro)] ease-[var(--ease-lbb-standard)]";

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="num absolute -left-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[9px] font-bold text-obsidian">
      {count.toLocaleString("fa-IR")}
    </span>
  );
}

function FloatingActions() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const update = () => setShowScrollTop(window.scrollY > 480);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      dir="rtl"
      className="fixed bottom-[calc(98px+env(safe-area-inset-bottom))] right-4 z-[calc(var(--z-nav)+1)] flex flex-col items-end gap-2 md:bottom-6 md:right-6"
    >
      {supportOpen ? (
        <div className="mb-1 flex flex-col gap-2 rounded-2xl border border-hairline bg-obsidian/95 p-2 shadow-raised backdrop-blur-xl">
          <a
            href="https://wa.me/989028584879"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-bone transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="ارتباط با پشتیبانی در واتساپ"
          >
            <MessageCircle size={19} aria-hidden="true" />
            واتساپ
          </a>
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-bone transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="ارتباط با LBB در اینستاگرام"
          >
            <Instagram size={19} aria-hidden="true" />
            اینستاگرام
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setSupportOpen((open) => !open)}
        aria-expanded={supportOpen}
        aria-label={supportOpen ? "بستن راه‌های پشتیبانی" : "باز کردن راه‌های پشتیبانی"}
        className="grid h-12 w-12 place-items-center rounded-full border border-signal/50 bg-signal text-obsidian shadow-raised transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone"
      >
        {supportOpen ? (
          <X size={21} aria-hidden="true" />
        ) : (
          <MessageCircle size={21} aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="بازگشت به بالای صفحه"
        className={`grid h-11 w-11 place-items-center rounded-full border border-hairline bg-obsidian/90 text-bone shadow-raised backdrop-blur-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ChevronUp size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

export function MobileBottomBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { active, open, dismissForNavigation } = useNavigationOverlay();
  const { count, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  const shopActive =
    pathname === "/shop" || /^\/(hoodies|pants|tshirts|shoes|socks)$/.test(pathname);
  const itemClass = (activeItem: boolean) =>
    `${ITEM} ${activeItem ? "text-signal" : "text-metal hover:text-bone"}`;

  const openCart = () => {
    dismissForNavigation();
    openDrawer();
  };

  return (
    <>
      <FloatingActions />
      <nav
        dir="rtl"
        aria-label="ناوبری موبایل"
        className="fixed inset-x-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-[var(--z-nav)] flex overflow-visible rounded-[24px] border border-hairline bg-[var(--lbb-surface-glass)] shadow-raised backdrop-blur-xl sm:inset-x-6 md:hidden"
        style={{ height: "72px" }}
      >
        <Link
          to="/"
          className={itemClass(pathname === "/")}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <Home size={20} strokeWidth={1.5} aria-hidden="true" />
          <span className="text-[10px] font-semibold">خانه</span>
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
          to="/shop"
          className="group relative flex flex-1 flex-col items-center justify-end pb-2 text-bone focus-visible:outline-none"
          aria-current={shopActive ? "page" : undefined}
          aria-label="فروشگاه"
        >
          <span
            className={`absolute -top-5 grid h-14 w-14 place-items-center rounded-full border-[3px] border-obsidian bg-signal text-obsidian shadow-[0_12px_30px_rgba(0,0,0,0.38)] transition-transform group-active:scale-95 ${
              shopActive ? "ring-2 ring-bone/80" : ""
            }`}
          >
            <LayoutGrid size={24} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="text-[10px] font-black text-bone">فروشگاه</span>
        </Link>

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
    </>
  );
}
