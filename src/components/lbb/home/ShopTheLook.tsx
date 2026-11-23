import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Plus, X } from "lucide-react";
import { lifestyle1 } from "@/lib/product-images";
import { resolveEditorialProductReferences } from "@/lib/editorial-commerce";
import { Frame, SectionHead, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";

type Hotspot = { slug: string; x: number; y: number };

const HOTSPOTS: Hotspot[] = [
  { slug: "lbb-classic-hoodie", x: 32, y: 30 },
  { slug: "cargo-street-pants", x: 55, y: 68 },
  { slug: "urban-runner-sneaker", x: 68, y: 88 },
];

export function ShopTheLook() {
  const publicReferences = useMemo(() => {
    const allowed = new Map(
      resolveEditorialProductReferences(HOTSPOTS.map((hotspot) => hotspot.slug))
        .filter((reference) => reference.publishable)
        .map((reference) => [reference.slug, reference]),
    );
    return HOTSPOTS.flatMap((hotspot) => {
      const reference = allowed.get(hotspot.slug);
      return reference ? [{ ...hotspot, reference }] : [];
    });
  }, []);
  const [active, setActive] = useState(publicReferences[0]?.slug ?? null);

  return (
    <section
      dir="rtl"
      aria-labelledby="shop-look-title"
      className="border-t border-hairline bg-obsidian py-14 md:py-20"
      data-f17-editorial="home-shop-the-look"
    >
      <Shell>
        <SectionHead
          index="04"
          label="SHOP THE STORY"
          title={<span id="shop-look-title">تصویر را ببین، مسیر معتبر را ادامه بده</span>}
          lede="نقطه خرید فقط برای محصولی فعال می‌شود که برای انتشار عمومی آماده باشد؛ در غیر این صورت، تصویر به کالکشن و مسیرهای کشف متصل می‌ماند."
          action={
            <Link
              to="/lookbook"
              className="tech inline-flex min-h-11 items-center gap-2 text-signal"
            >
              مشاهده لوک‌بوک
              <ArrowUpLeft size={15} aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="relative min-w-0">
            <Frame
              src={lifestyle1}
              alt="روایت تصویری استریت‌ویر با لایه‌های تیره در فضای شبانه"
              ratio="4/5"
              zoom={false}
              width={1200}
              height={1500}
              sizes="(max-width: 1023px) 100vw, 58vw"
              className="border border-hairline"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-obsidian/35 to-transparent"
              />
              {publicReferences.map((hotspot, index) => {
                const selected = active === hotspot.slug;
                return (
                  <button
                    key={hotspot.slug}
                    type="button"
                    aria-label={`انتخاب ${hotspot.reference.product.name}`}
                    aria-pressed={selected}
                    onClick={() => setActive(hotspot.slug)}
                    className={`absolute z-10 grid h-11 w-11 place-items-center rounded-full border-4 shadow-overlay transition-[transform,background-color,color,border-color] hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      selected
                        ? "border-signal/30 bg-signal text-obsidian"
                        : "border-bone/30 bg-bone text-obsidian"
                    }`}
                    style={{
                      insetInlineStart: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    data-f17-product-hotspot={hotspot.slug}
                  >
                    {selected ? (
                      <X size={15} aria-hidden="true" />
                    ) : (
                      <Plus size={15} aria-hidden="true" />
                    )}
                    <span className="sr-only">نقطه {index + 1}</span>
                  </button>
                );
              })}
            </Frame>
          </div>

          <aside className="flex flex-col border border-hairline bg-carbon p-4 md:p-6">
            <TechLabel tone="signal">STORY DESTINATIONS</TechLabel>
            <p className="mt-3 text-sm leading-7 text-metal">
              این بخش بین الهام تصویری و مسیرهای واقعی سایت پل می‌زند، بدون اینکه داده منتشرنشده را
              به خرید عمومی تبدیل کند.
            </p>

            {publicReferences.length > 0 ? (
              <ol className="mt-6 space-y-2">
                {publicReferences.map((item, index) => {
                  const selected = active === item.slug;
                  return (
                    <li key={item.slug}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: item.slug }}
                        onMouseEnter={() => setActive(item.slug)}
                        onFocus={() => setActive(item.slug)}
                        aria-current={selected ? "true" : undefined}
                        className={`group grid min-h-[92px] grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                          selected
                            ? "border-signal bg-obsidian"
                            : "border-hairline bg-carbon hover:border-hairline-strong"
                        }`}
                        data-f17-public-product-link={item.slug}
                      >
                        <img
                          src={item.reference.image}
                          alt=""
                          width={64}
                          height={80}
                          loading="lazy"
                          decoding="async"
                          className="h-20 w-16 object-cover"
                        />
                        <span className="min-w-0">
                          <TechLabel tone={selected ? "signal" : "metal"}>0{index + 1}</TechLabel>
                          <span className="mt-1 block truncate text-sm font-black text-bone">
                            {item.reference.product.name}
                          </span>
                          <span className="mt-1 block text-xs leading-6 text-metal">
                            مشاهده محصول عمومی
                          </span>
                        </span>
                        <ArrowUpLeft
                          size={16}
                          aria-hidden="true"
                          className={selected ? "text-signal" : "text-mute group-hover:text-signal"}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <StatePanel className="mt-6" title="نقطه خرید مستقیمی روی این تصویر فعال نیست">
                کالکشن و لوک‌بوک مسیرهای امن بعدی هستند؛ Hotspot محصول فقط با داده عمومی معتبر ظاهر
                می‌شود.
              </StatePanel>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/collections/$slug"
                params={{ slug: "drop-01-shabgard" }}
                className="inline-flex min-h-11 items-center justify-center border border-hairline-strong px-4 text-xs font-bold text-bone transition-colors hover:border-signal hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                روایت شبگرد
              </Link>
              <Link
                to="/shop"
                search={{}}
                className="inline-flex min-h-11 items-center justify-center border border-signal bg-signal px-4 text-xs font-bold text-obsidian transition-colors hover:border-bone hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                مرور فروشگاه
              </Link>
            </div>
          </aside>
        </div>
      </Shell>
    </section>
  );
}
