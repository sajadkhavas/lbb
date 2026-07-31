import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, Search, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";
import { categoryImage } from "@/lib/category-images";
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

export function Navbar({ theme = "dark", offsetTop = 0 }: { theme?: "dark" | "light"; offsetTop?: number }) {
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
        className={`fixed inset-x-0 z-[100] transition-all duration-300 ${barBg}`}
        style={{ top: offsetTop }}
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
          className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-[#0A0A0A] lg:hidden"
          style={{
            animation: "lbb-slide-down 0.4s cubic-bezier(0.76,0,0.24,1)",
            fontFamily: "'Vazirmatn', sans-serif",
          }}
        >
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0A0A0A]/95 px-4 backdrop-blur">
            <span
              className="text-[22px] font-black text-[var(--lbb-red)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              LBB
            </span>
            <button
              aria-label="بستن منو"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* search */}
          <form
            onSubmit={(e) => {
              submit(e);
              if (term) setOpen(false);
            }}
            className="px-4 pt-4"
            style={{ animation: "lbb-fade-up 0.4s both ease-out" }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3">
              <Search size={17} className="text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="دنبال چی می‌گردی؟"
                aria-label="جستجوی محصولات"
                className="h-12 w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/35"
              />
            </div>
          </form>

          {/* category cards */}
          <div className="grid grid-cols-2 gap-3 px-4 pt-5">
            {CATEGORY_SLUGS.map((s, i) => (
              <Link
                key={s}
                to="/$category"
                params={{ category: s }}
                onClick={() => setOpen(false)}
                className="relative overflow-hidden rounded-2xl"
                style={{ animation: `lbb-fade-up 0.45s ${0.05 + i * 0.05}s both ease-out` }}
              >
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src={categoryImage(s)}
                    alt={CATEGORIES[s].nameFa}
                    width={900}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.1))",
                    }}
                  />
                  <span
                    className="absolute bottom-2.5 right-3 text-[16px] font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {CATEGORIES[s].nameFa}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* links */}
          <ul className="mt-5 flex flex-col px-4">
            {links.map((l, i) => (
              <li
                key={l.to === "/$category" ? l.category : l.to}
                style={{ animation: `lbb-fade-up 0.45s ${0.15 + i * 0.04}s both ease-out` }}
              >
                <NavItem
                  l={l}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-white/[0.06] py-3.5 text-[17px] font-semibold text-white/90"
                />
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-2 px-4">
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[var(--lbb-red)] text-[13px] font-bold text-white"
            >
              شروع خرید
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setOpen(false)}
              className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 text-white"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={18} />
            </Link>
          </div>

          <div className="mt-8 border-t border-white/10 px-4 py-6 text-center text-xs text-white/40">
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
