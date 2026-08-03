import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, Search, Heart, ArrowUpLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";
import { categoryImage } from "@/lib/category-images";
import { products, fmtToman } from "@/lib/products";
import { productImage } from "@/lib/product-images";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { TechLabel } from "@/components/lbb/ui/primitives";

type NavLink =
  | { label: string; latin: string; to: "/" | "/shop" | "/lookbook" | "/collections" | "/journal" | "/about" | "/contact" }
  | { label: string; latin: string; to: "/$category"; category: string };

const PRIMARY: NavLink[] = [
  { label: "فروشگاه", latin: "SHOP ALL", to: "/shop" },
  { label: "هودی", latin: "HOODIES", to: "/$category", category: "hoodies" },
  { label: "شلوار", latin: "PANTS", to: "/$category", category: "pants" },
  { label: "کتونی", latin: "FOOTWEAR", to: "/$category", category: "shoes" },
  { label: "لوک‌بوک", latin: "LOOKBOOK", to: "/lookbook" },
];

const SECONDARY: NavLink[] = [
  { label: "کالکشن‌ها", latin: "COLLECTIONS", to: "/collections" },
  { label: "ژورنال", latin: "JOURNAL", to: "/journal" },
  { label: "درباره ما", latin: "ABOUT", to: "/about" },
  { label: "تماس", latin: "CONTACT", to: "/contact" },
];

function hrefOf(l: NavLink) {
  return l.to === "/$category" ? `/${l.category}` : l.to;
}

function NavItem({
  l,
  className,
  onClick,
  children,
}: {
  l: NavLink;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  if (l.to === "/$category") {
    return (
      <Link
        to="/$category"
        params={{ category: l.category }}
        className={className}
        onClick={onClick}
      >
        {children ?? l.label}
      </Link>
    );
  }
  return (
    <Link to={l.to} className={className} onClick={onClick}>
      {children ?? l.label}
    </Link>
  );
}

function Count({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="num absolute -left-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center bg-signal px-[3px] text-[9px] font-bold leading-none text-bone">
      {n.toLocaleString("fa-IR")}
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { count, openDrawer } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useFocusTrap(menuOpen, menuRef, closeMenu);
  useFocusTrap(searchOpen, searchRef, closeSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes both overlays.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const term = q.trim();
  const suggestions = useMemo(() => {
    if (!term) return [];
    return products
      .filter(
        (p) =>
          p.name.includes(term) ||
          p.latinName.toLowerCase().includes(term.toLowerCase()) ||
          p.shortDescription.includes(term) ||
          CATEGORIES[p.category].nameFa.includes(term),
      )
      .slice(0, 6);
  }, [term]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term) return;
    setSearchOpen(false);
    setMenuOpen(false);
    navigate({ to: "/search", search: { q: term } });
  };

  const isLight = theme === "light";
  const ink = isLight ? "text-obsidian" : "text-bone";
  const barSkin = scrolled
    ? isLight
      ? "border-b border-hairline-ink bg-bone/90 backdrop-blur-xl"
      : "border-b border-hairline bg-obsidian/85 backdrop-blur-xl"
    : "border-b border-transparent bg-transparent";
  const iconBtn = `relative grid tap-target place-items-center transition-colors duration-[220ms] ${ink} hover:text-signal`;

  return (
    <>
      <nav
        aria-label="ناوبری اصلی"
        dir="rtl"
        className={`fixed inset-x-0 z-[100] transition-colors duration-300 ${barSkin}`}
        style={{ top: offsetTop }}
      >
        <div
          className="lbb-shell grid items-center gap-4"
          style={{
            height: "var(--lbb-nav-h)",
            gridTemplateColumns: "auto minmax(0,1fr) auto",
          }}
        >
          {/* mark */}
          <Link to="/" aria-label="LBB — خانه" className="flex shrink-0 items-center gap-2">
            <Logo size={34} />
            <span className="font-display text-[20px] font-black leading-none tracking-[-0.04em] text-signal md:text-[23px]">
              LBB
            </span>
          </Link>


          {/* desktop links */}
          <ul className="hidden min-w-0 items-center justify-center gap-8 lg:flex">
            {PRIMARY.map((l) => {
              const active = pathname === hrefOf(l);
              return (
                <li key={hrefOf(l)} className="relative">
                  <NavItem
                    l={l}
                    className={`tech transition-colors duration-[220ms] ${
                      active ? "text-signal" : `${ink} opacity-70 hover:opacity-100`
                    }`}
                  >
                    {l.label}
                  </NavItem>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2 inset-x-0 h-px bg-signal"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* actions */}
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              aria-label="جست‌وجو"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
            >
              <Search size={18} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <Link
              to="/wishlist"
              aria-label={`علاقه‌مندی‌ها (${wishCount})`}
              className={`${iconBtn} hidden sm:grid`}
            >
              <Heart size={18} strokeWidth={1.5} aria-hidden="true" />
              <Count n={wishCount} />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`سبد خرید (${count})`}
              className={iconBtn}
            >
              <ShoppingBag size={18} strokeWidth={1.5} aria-hidden="true" />
              <Count n={count} />
            </button>

            <button
              type="button"
              aria-label="منو"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={`${iconBtn} ms-1`}
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------- search overlay ---------------- */}
      {searchOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[210] bg-obsidian/80 backdrop-blur-md"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div
            ref={searchRef}
            role="dialog"
            aria-modal="true"
            aria-label="جست‌وجوی محصولات"
            className="mx-auto w-full max-w-[720px] border-b border-hairline bg-obsidian px-4 pb-6 pt-5 md:mt-[10vh] md:border md:px-8 md:pb-8"
          >
            <div className="flex items-center justify-between">
              <TechLabel tone="signal">SEARCH</TechLabel>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="بستن جست‌وجو"
                className="grid tap-target place-items-center text-metal hover:text-bone"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="mt-3 flex items-center gap-3 border-b border-hairline pb-3">
              <Search size={20} className="shrink-0 text-mute" aria-hidden="true" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                enterKeyHint="search"
                placeholder="نام محصول، دسته یا کد…"
                aria-label="عبارت جست‌وجو"
                className="h-11 w-full min-w-0 bg-transparent text-base text-bone outline-none placeholder:text-mute"
              />
              <button type="submit" className="tech shrink-0 text-signal disabled:opacity-40" disabled={!term}>
                برو
              </button>
            </form>

            {term && suggestions.length === 0 && (
              <p className="mt-6 text-sm text-metal">نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید.</p>
            )}

            {suggestions.length > 0 && (
              <ul className="mt-4 max-h-[52vh] overflow-y-auto">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: s.slug }}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-3 border-b border-hairline-soft py-2.5 transition-colors hover:bg-carbon"
                    >
                      <img
                        src={productImage(s.slug)}
                        alt=""
                        width={44}
                        height={55}
                        loading="lazy"
                        decoding="async"
                        className="h-[55px] w-11 shrink-0 object-cover"
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[13px] font-semibold text-bone">{s.name}</span>
                        <span className="num mt-0.5 text-[11px] text-metal">{fmtToman(s.price)}</span>
                      </span>
                      <ArrowUpLeft
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-mute transition-colors group-hover:text-signal"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ---------------- full-screen editorial menu ---------------- */}
      {menuOpen && (
        <div
          ref={menuRef}
          dir="rtl"
          role="dialog"
          aria-modal="true"
          aria-label="منوی اصلی"
          className="fixed inset-0 z-[200] flex flex-col overflow-y-auto bg-obsidian"
        >
          <div
            className="lbb-shell sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-hairline bg-obsidian/95 backdrop-blur"
            style={{ height: "var(--lbb-nav-h)" }}
          >
            <span className="font-display text-[22px] font-black tracking-[-0.06em] text-signal">LBB</span>
            <button
              type="button"
              aria-label="بستن منو"
              onClick={() => setMenuOpen(false)}
              className="grid tap-target place-items-center border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="lbb-shell grid flex-1 gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-12">
            {/* index list */}
            <nav aria-label="فهرست بخش‌ها" className="min-w-0">
              <TechLabel tone="signal">INDEX / 001</TechLabel>
              <ul className="mt-4 flex flex-col">
                {PRIMARY.map((l, i) => (
                  <li key={hrefOf(l)} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <NavItem
                      l={l}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-baseline justify-between gap-4 border-b border-hairline py-3.5"
                    >
                      <span className="min-w-0 truncate text-display-3 text-bone transition-colors group-hover:text-signal">
                        {l.label}
                      </span>
                      <span className="tech shrink-0 text-mute">{l.latin}</span>
                    </NavItem>
                  </li>
                ))}
              </ul>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {SECONDARY.map((l) => (
                  <li key={hrefOf(l)}>
                    <NavItem
                      l={l}
                      onClick={() => setMenuOpen(false)}
                      className="tech text-metal transition-colors hover:text-bone"
                    >
                      {l.label}
                    </NavItem>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
                <a
                  href="https://www.instagram.com/lbbclo"
                  target="_blank"
                  rel="noreferrer"
                  className="tech text-metal transition-colors hover:text-signal"
                >
                  INSTAGRAM / @LBBCLO
                </a>
                <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
                <span className="tech text-mute">TEHRAN, IR</span>
              </div>
            </nav>

            {/* category plates */}
            <div className="min-w-0">
              <TechLabel>CATEGORIES</TechLabel>
              <div className="mt-4 grid grid-cols-2 gap-px bg-hairline">
                {CATEGORY_SLUGS.map((s, i) => (
                  <Link
                    key={s}
                    to="/$category"
                    params={{ category: s }}
                    onClick={() => setMenuOpen(false)}
                    className="group relative block overflow-hidden bg-obsidian fade-up"
                    style={{ animationDelay: `${60 + i * 40}ms` }}
                  >
                    <div className="relative" style={{ aspectRatio: "4/3" }}>
                      <img
                        src={categoryImage(s)}
                        alt={`دستهٔ ${CATEGORIES[s].nameFa}`}
                        width={800}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 1024px) 50vw, 22vw"
                        className="absolute inset-0 h-full w-full object-cover opacity-70 frame-zoom transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(5,5,5,0.9), rgba(5,5,5,0.05))",
                        }}
                      />
                      <span className="absolute bottom-2.5 right-3 text-sm font-bold text-bone">
                        {CATEGORIES[s].nameFa}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
