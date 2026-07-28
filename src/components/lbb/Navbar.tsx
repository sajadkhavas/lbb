import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, Search, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";
import { products } from "@/lib/products";
import { productImage } from "@/lib/product-images";
import { fmtToman } from "@/lib/products";

type NavLink =
  | { label: string; to: "/" | "/shop" | "/about" | "/contact" | "/lookbook" }
  | { label: string; to: "/$category"; category: string };

const links: NavLink[] = [
  { label: "خانه", to: "/" },
  { label: "فروشگاه", to: "/shop" },
  { label: "هودی", to: "/$category", category: "hoodies" },
  { label: "شلوار", to: "/$category", category: "pants" },
  { label: "کتونی", to: "/$category", category: "shoes" },
  { label: "لوک‌بوک", to: "/lookbook" },
  { label: "درباره ما", to: "/about" },
  { label: "تماس", to: "/contact" },
];

function NavItem({ l, className, onClick }: { l: NavLink; className?: string; onClick?: () => void }) {
  if (l.to === "/$category") {
    return (
      <Link to="/$category" params={{ category: l.category }} className={className} onClick={onClick}>
        {l.label}
      </Link>
    );
  }
  return (
    <Link to={l.to} className={className} onClick={onClick}>
      {l.label}
    </Link>
  );
}

export function Navbar({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { count, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchOpen]);

  const term = q.trim();
  const suggestions = term
    ? products
        .filter(
          (p) =>
            p.name.includes(term) ||
            p.shortDescription.includes(term) ||
            CATEGORIES[p.category].nameFa.includes(term),
        )
        .slice(0, 5)
    : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term) return;
    setSearchOpen(false);
    navigate({ to: "/search", search: { q: term } });
  };

  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const linkBase = isLight
    ? "text-black/80 hover:text-[var(--lbb-red)]"
    : "text-white/80 hover:text-[var(--lbb-red)]";
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
          <Link to="/" className="flex shrink-0 items-center gap-1.5" aria-label="LBB خانه">
            <span
              className="text-[26px] font-black leading-none text-[var(--lbb-red)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LBB
            </span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lbb-red)]"
              style={{ animation: "lbb-blink 0.8s infinite" }}
            />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {links.map((l) => {
              const href = l.to === "/$category" ? `/${l.category}` : l.to;
              const active = pathname === href;
              return (
                <span key={href} className="relative">
                  <NavItem
                    l={l}
                    className={`text-sm ${linkBase} transition-colors`}
                  />
                  {active && (
                    <span className="absolute -bottom-1.5 right-0 left-0 h-0.5 bg-[var(--lbb-red)]" />
                  )}
                </span>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div ref={boxRef} className="relative flex items-center">
              {searchOpen && (
                <form onSubmit={submit}>
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    type="search"
                    placeholder="جستجو در LBB..."
                    aria-label="جستجو"
                    className={`w-[200px] rounded-md border px-3 py-1.5 text-xs outline-none transition-all md:w-[260px] ${
                      isLight
                        ? "border-black/10 bg-white text-black"
                        : "border-white/15 bg-black text-white"
                    }`}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  />
                </form>
              )}
              {searchOpen && suggestions.length > 0 && (
                <ul className="absolute top-11 right-0 z-50 w-[280px] overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl md:w-[320px]">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: s.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-black/[0.04]"
                      >
                        <img
                          src={productImage(s.slug)}
                          alt=""
                          width={40}
                          height={50}
                          loading="lazy"
                          className="h-[50px] w-10 rounded object-cover"
                        />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-xs font-semibold text-black">{s.name}</span>
                          <span className="text-[11px] text-gray-500">{fmtToman(s.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button
                aria-label="جستجو"
                onClick={() => setSearchOpen((v) => !v)}
                className={`p-2 ${textColor} hover:text-[var(--lbb-red)]`}
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            </div>

            <Link
              to="/wishlist"
              aria-label="علاقه‌مندی‌ها"
              className={`relative hidden p-2 sm:block ${textColor} hover:text-[var(--lbb-red)]`}
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lbb-red)] px-1 text-[9px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>

            <button
              onClick={openDrawer}
              aria-label="سبد خرید"
              className={`relative p-2 ${textColor} hover:text-[var(--lbb-red)]`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--lbb-red)] px-1 text-[9px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>

            <Link
              to="/shop"
              className="hidden h-9 items-center rounded-md bg-[var(--lbb-red)] px-4 text-[11px] font-bold text-white hover:brightness-110 md:inline-flex"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              خرید کن
            </Link>
            <button
              aria-label="منو"
              onClick={() => setOpen(true)}
              className={`p-2 lg:hidden ${textColor}`}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
        <style>{`@keyframes lbb-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      </nav>

      {open && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[200] flex flex-col bg-[#0A0A0A] lg:hidden"
          style={{ animation: "lbb-slide-down 0.4s cubic-bezier(0.76,0,0.24,1)" }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span
              className="text-[22px] font-black text-[var(--lbb-red)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LBB
            </span>
            <button aria-label="بستن" onClick={() => setOpen(false)}>
              <X size={26} className="text-white" />
            </button>
          </div>
          <ul
            className="flex flex-1 flex-col items-center justify-center gap-5"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {links.map((l, i) => (
              <li
                key={l.to === "/$category" ? l.category : l.to}
                style={{ animation: `lbb-fade-up 0.5s ${i * 0.05}s both ease-out` }}
              >
                <NavItem
                  l={l}
                  onClick={() => setOpen(false)}
                  className="text-3xl font-semibold text-white"
                />
              </li>
            ))}
          </ul>
          <div className="flex justify-center gap-2 pb-4">
            {CATEGORY_SLUGS.map((s) => (
              <Link
                key={s}
                to="/$category"
                params={{ category: s }}
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] text-white/70"
              >
                {CATEGORIES[s].nameFa}
              </Link>
            ))}
          </div>
          <div
            className="border-t border-white/10 py-6 text-center text-xs text-white/40"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
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
