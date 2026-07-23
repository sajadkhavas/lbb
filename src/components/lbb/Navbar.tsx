import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { label: "خانه", href: "/" },
  { label: "فروشگاه", href: "/shop" },
  { label: "هودی", href: "/hoodies" },
  { label: "شلوار", href: "/pants" },
  { label: "کتونی", href: "/shoes" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس", href: "/contact" },
];

export function Navbar({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const linkBase = isLight ? "text-black/80 hover:text-[var(--lbb-red)]" : "text-white/80 hover:text-[var(--lbb-red)]";
  const barBg = scrolled
    ? isLight
      ? "border-b border-black/[0.06] bg-white/85 backdrop-blur-xl"
      : "border-b border-white/[0.07] bg-black/85 backdrop-blur-xl"
    : "bg-transparent";

  return (
    <>
      <nav
        role="navigation"
        aria-label="ناوبری اصلی"
        dir="rtl"
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${barBg}`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-8">
          {/* Logo (right in RTL = first) */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <span className="font-display text-[26px] font-black leading-none text-[var(--lbb-red)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              LBB
            </span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lbb-red)]"
              style={{ animation: "lbb-blink 0.8s infinite" }}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={`relative text-sm ${linkBase} transition-colors`}
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-1.5 right-0 left-0 h-0.5 bg-[var(--lbb-red)]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Left cluster */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center">
              {searchOpen && (
                <input
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                  type="search"
                  placeholder="جستجو..."
                  className={`w-[200px] rounded-md border px-3 py-1.5 text-xs outline-none transition-all ${isLight ? "border-black/10 bg-white text-black" : "border-white/15 bg-black text-white"}`}
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                />
              )}
              <button
                aria-label="جستجو"
                onClick={() => setSearchOpen((v) => !v)}
                className={`p-2 ${textColor} hover:text-[var(--lbb-red)]`}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            </div>
            <Link to="/cart" aria-label="سبد خرید" className={`relative p-2 ${textColor} hover:text-[var(--lbb-red)]`}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lbb-red)] px-1 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <a
              href="/shop"
              className="hidden md:inline-flex h-9 items-center rounded-md bg-[var(--lbb-red)] px-4 text-[11px] font-bold text-white hover:brightness-110"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              خرید کن
            </a>
            <button
              aria-label="منو"
              onClick={() => setOpen(true)}
              className={`lg:hidden p-2 ${textColor}`}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
        <style>{`@keyframes lbb-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      </nav>

      {/* Fullscreen menu */}
      {open && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[200] flex flex-col bg-[#0A0A0A] lg:hidden"
          style={{ animation: "lbb-slide-down 0.4s cubic-bezier(0.76,0,0.24,1)" }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display text-[22px] font-black text-[var(--lbb-red)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>LBB</span>
            <button aria-label="بستن" onClick={() => setOpen(false)}>
              <X size={26} className="text-white" />
            </button>
          </div>
          <ul className="flex flex-1 flex-col items-center justify-center gap-6" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {links.map((l, i) => (
              <li
                key={l.href}
                style={{ animation: `lbb-fade-up 0.5s ${i * 0.06}s both ease-out` }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-3xl font-semibold text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 py-6 text-center text-xs text-white/40" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            اینستاگرام:{" "}
            <a href="https://www.instagram.com/lbbclo" className="text-white/70">
              @lbbclo
            </a>
          </div>
          <style>{`
            @keyframes lbb-slide-down { from { transform: translateY(-100%); } to { transform: none; } }
            @keyframes lbb-fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
          `}</style>
        </div>
      )}
    </>
  );
}
