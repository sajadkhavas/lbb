import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpLeft, Clock3, Search, X } from "lucide-react";
import { categoryImage } from "@/lib/category-images";
import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/categories";
import { productImage } from "@/lib/product-images";
import { fmtToman, products } from "@/lib/products";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useNavigationOverlay } from "@/lib/navigation-overlay";
import { TechLabel } from "@/components/lbb/ui/primitives";

const RECENT_KEY = "lbb-recent-searches-v2";
const MAX_RECENT = 5;

type Suggestion =
  | {
      kind: "product";
      key: string;
      label: string;
      meta: string;
      slug: string;
      image: string;
    }
  | {
      kind: "category";
      key: string;
      label: string;
      meta: string;
      slug: string;
      image: string;
    };

function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function saveRecent(term: string): string[] {
  const normalized = term.trim();
  if (!normalized) return readRecent();
  const next = [normalized, ...readRecent().filter((item) => item !== normalized)].slice(
    0,
    MAX_RECENT,
  );
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Search history is an optional local enhancement.
  }
  return next;
}

export function SearchOverlay() {
  const { close, dismissForNavigation } = useNavigationOverlay();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useFocusTrap(true, dialogRef, close);

  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search).get("q")?.trim() ?? "";
    setQuery(urlQuery);
    setRecent(readRecent());
  }, []);

  const term = query.trim();
  const suggestions = useMemo<Suggestion[]>(() => {
    if (!term) return [];
    const needle = term.toLocaleLowerCase("fa-IR");
    const categories: Suggestion[] = CATEGORY_SLUGS.filter((slug) => {
      const category = CATEGORIES[slug];
      return `${category.nameFa} ${category.nameFaPlural} ${category.heroTagline}`
        .toLocaleLowerCase("fa-IR")
        .includes(needle);
    })
      .slice(0, 2)
      .map((slug) => ({
        kind: "category" as const,
        key: `category-${slug}`,
        label: CATEGORIES[slug].nameFa,
        meta: "دسته محصول",
        slug,
        image: categoryImage(slug),
      }));

    const productMatches: Suggestion[] = products
      .filter((product) =>
        `${product.name} ${product.latinName} ${product.shortDescription} ${product.sku}`
          .toLocaleLowerCase("fa-IR")
          .includes(needle),
      )
      .slice(0, 6 - categories.length)
      .map((product) => ({
        kind: "product" as const,
        key: `product-${product.slug}`,
        label: product.name,
        meta: fmtToman(product.price),
        slug: product.slug,
        image: productImage(product.slug),
      }));

    return [...categories, ...productMatches];
  }, [term]);

  useEffect(() => setActiveIndex(-1), [term]);

  const remember = (value: string) => setRecent(saveRecent(value));
  const dismissAfterNavigation = () => window.queueMicrotask(dismissForNavigation);

  const choose = (suggestion: Suggestion) => {
    remember(term || suggestion.label);
    if (suggestion.kind === "product") {
      navigate({ to: "/product/$slug", params: { slug: suggestion.slug } });
      dismissAfterNavigation();
      return;
    }
    navigate({ to: "/$category", params: { category: suggestion.slug } });
    dismissAfterNavigation();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!term) return;
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      choose(suggestions[activeIndex]);
      return;
    }
    remember(term);
    navigate({ to: "/search", search: { q: term } });
    dismissAfterNavigation();
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-[var(--z-modal)]">
      <button
        type="button"
        aria-label="بستن جست‌وجو"
        onClick={close}
        className="absolute inset-0 bg-[var(--lbb-surface-overlay)] backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="جست‌وجوی محصولات"
        className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1180px] flex-col bg-obsidian shadow-overlay md:mt-[6vh] md:min-h-0 md:max-h-[88vh] md:border md:border-hairline"
      >
        <header className="flex min-h-16 items-center justify-between border-b border-hairline px-4 md:px-7">
          <div>
            <TechLabel tone="signal">SEARCH / DISCOVERY</TechLabel>
            <p className="mt-1 text-xs text-metal">محصول، دسته، نام لاتین یا کد کالا</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="بستن جست‌وجو"
            className="tap-target grid place-items-center border border-hairline text-bone transition-colors hover:border-signal hover:text-signal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <section className="flex min-h-0 flex-col border-b border-hairline p-4 md:border-b-0 md:border-l md:p-7">
            <form onSubmit={submit} role="search" className="border-b border-hairline-strong">
              <label className="flex items-center gap-3">
                <Search size={22} className="shrink-0 text-signal" aria-hidden="true" />
                <input
                  data-autofocus
                  type="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && suggestions.length > 0) {
                      event.preventDefault();
                      setActiveIndex((current) => (current + 1) % suggestions.length);
                    }
                    if (event.key === "ArrowUp" && suggestions.length > 0) {
                      event.preventDefault();
                      setActiveIndex((current) =>
                        current <= 0 ? suggestions.length - 1 : current - 1,
                      );
                    }
                  }}
                  aria-label="عبارت جست‌وجو"
                  aria-controls={suggestions.length > 0 ? listboxId : undefined}
                  aria-activedescendant={
                    activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
                  }
                  placeholder="مثلاً هودی، BAGGY یا LBB-H01"
                  className="h-16 w-full min-w-0 bg-transparent text-lg font-semibold text-bone outline-none placeholder:text-mute md:text-2xl"
                />
                <button
                  type="submit"
                  disabled={!term}
                  className="tech min-h-11 shrink-0 px-3 text-signal disabled:opacity-35"
                >
                  جست‌وجو
                </button>
              </label>
            </form>

            <p className="sr-only" aria-live="polite">
              {term ? `${suggestions.length.toLocaleString("fa-IR")} پیشنهاد` : ""}
            </p>

            {term ? (
              suggestions.length > 0 ? (
                <ul id={listboxId} role="listbox" className="mt-4 min-h-0 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li key={suggestion.key} role="presentation">
                      <button
                        id={`${listboxId}-${index}`}
                        type="button"
                        role="option"
                        aria-selected={activeIndex === index}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => choose(suggestion)}
                        className={`group grid w-full grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-b border-hairline-soft p-2 text-right transition-colors ${
                          activeIndex === index ? "bg-carbon-2" : "hover:bg-carbon"
                        }`}
                      >
                        <img
                          src={suggestion.image}
                          alt=""
                          width={56}
                          height={70}
                          loading="lazy"
                          decoding="async"
                          className="h-[70px] w-14 object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-bone">
                            {suggestion.label}
                          </span>
                          <span className="tech mt-1 block text-mute">{suggestion.meta}</span>
                        </span>
                        <ArrowUpLeft
                          size={17}
                          aria-hidden="true"
                          className="text-mute transition-colors group-hover:text-signal"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                  <TechLabel tone="signal">NO MATCH</TechLabel>
                  <p className="mt-3 text-title text-bone">نتیجه مستقیم پیدا نشد</p>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-metal">
                    عبارت را کوتاه‌تر کن یا جست‌وجوی کامل را برای بررسی تمام توضیحات باز کن.
                  </p>
                  <button type="submit" formAction="/search" className="sr-only">
                    جست‌وجوی کامل
                  </button>
                </div>
              )
            ) : (
              <div className="py-6">
                <TechLabel>QUICK CATEGORIES</TechLabel>
                <div className="mt-4 flex flex-wrap gap-2">
                  {CATEGORY_SLUGS.map((slug) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => setQuery(CATEGORIES[slug].nameFa)}
                      className="min-h-11 border border-hairline px-4 text-xs font-semibold text-bone transition-colors hover:border-signal hover:text-signal"
                    >
                      {CATEGORIES[slug].nameFa}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="min-h-0 overflow-y-auto bg-carbon p-4 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <TechLabel>RECENT / LOCAL</TechLabel>
              {recent.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.removeItem(RECENT_KEY);
                    } catch {
                      // Optional browser storage may be unavailable.
                    }
                    setRecent([]);
                  }}
                  className="text-[11px] text-mute transition-colors hover:text-signal"
                >
                  پاک‌کردن
                </button>
              ) : null}
            </div>

            {recent.length > 0 ? (
              <ul className="mt-4 space-y-1">
                {recent.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => setQuery(item)}
                      className="flex min-h-11 w-full items-center gap-3 border-b border-hairline-soft text-right text-sm text-metal transition-colors hover:text-bone"
                    >
                      <Clock3 size={14} aria-hidden="true" className="shrink-0" />
                      <span className="truncate">{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-xs leading-6 text-mute">
                جست‌وجوهای اخیر فقط روی همین مرورگر نگه‌داری می‌شوند.
              </p>
            )}

            <div className="mt-8 border-t border-hairline pt-6">
              <TechLabel tone="signal">DISCOVERY PATHS</TechLabel>
              <div className="mt-4 grid gap-2">
                <Link
                  to="/collections"
                  onClick={dismissAfterNavigation}
                  className="group flex min-h-12 items-center justify-between border border-hairline px-4 text-sm font-bold text-bone transition-colors hover:border-signal"
                >
                  کالکشن‌های فعلی
                  <ArrowUpLeft
                    size={16}
                    aria-hidden="true"
                    className="text-mute group-hover:text-signal"
                  />
                </Link>
                <Link
                  to="/journal"
                  onClick={dismissAfterNavigation}
                  className="group flex min-h-12 items-center justify-between border border-hairline px-4 text-sm font-bold text-bone transition-colors hover:border-signal"
                >
                  راهنما و ژورنال
                  <ArrowUpLeft
                    size={16}
                    aria-hidden="true"
                    className="text-mute group-hover:text-signal"
                  />
                </Link>
                <Link
                  to="/search"
                  search={{ q: term }}
                  onClick={dismissAfterNavigation}
                  className="group flex min-h-12 items-center justify-between bg-signal px-4 text-sm font-bold text-obsidian"
                >
                  صفحه کامل جست‌وجو
                  <ArrowUpLeft size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
