import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Search, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";

const items = [
  { label: "خانه", href: "/", icon: Home },
  { label: "فروشگاه", href: "/shop", icon: LayoutGrid },
  { label: "جستجو", href: "/shop", icon: Search },
  { label: "سبد", href: "/cart", icon: ShoppingBag, showBadge: true },
  { label: "منو", href: "/about", icon: Menu },
];

export function MobileBottomBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();
  return (
    <nav
      dir="rtl"
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-[150] flex md:hidden border-t border-white/[0.08]"
      style={{
        height: "calc(64px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(16px)",
        fontFamily: "'Vazirmatn', sans-serif",
      }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const active = pathname === it.href;
        return (
          <Link
            key={it.label}
            to={it.href}
            className="flex flex-1 flex-col items-center justify-center gap-1 active:scale-90 transition-transform"
            style={{ color: active ? "var(--lbb-red)" : "rgba(255,255,255,0.55)" }}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={1.5} />
              {it.showBadge && count > 0 && (
                <span className="absolute -top-1 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lbb-red)] px-1 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[9px]">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
