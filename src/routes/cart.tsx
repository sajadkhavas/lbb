import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Shell, EmptyState, CtaClasses } from "@/components/lbb/ui/primitives";
import { useCart } from "@/lib/cart";
import { fmtToman } from "@/lib/products";
import { pageMeta, canonical } from "@/lib/site";

const TITLE = "سبد خرید | LBB";
const DESC = "مرور و ویرایش سبد خرید در فروشگاه استریت‌ویر LBB.";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/cart", noindex: true }),
    links: canonical("/cart"),
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, remove, setQty, subtotal } = useCart();
  const count = lines.reduce((a, l) => a + l.qty, 0);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-24">
        <Shell>
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سبد خرید" }]} />
          <h1 className="mt-4 text-display-2 text-bone">سبد خرید</h1>
          <p className="mt-1 text-sm text-metal" role="status" aria-live="polite">
            {count.toLocaleString("fa-IR")} قلم کالا
          </p>

          {lines.length === 0 ? (
            <EmptyState
              className="mt-10"
              title="سبد خرید شما خالی است"
              body="محصولی برای نمایش وجود ندارد."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  رفتن به فروشگاه
                </Link>
              }
            />
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[65%_35%]">
              <div className="flex flex-col gap-3">
                {lines.map((l, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-hairline bg-carbon p-3">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-carbon-2 text-xs font-black text-signal/50 tech">
                      LBB
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-bone">{l.name}</p>
                      <p className="text-xs text-metal">
                        {l.color && (
                          <>
                            رنگ:{" "}
                            <span
                              aria-hidden="true"
                              className="inline-block h-2.5 w-2.5 rounded-full align-middle"
                              style={{ background: l.color }}
                            />{" "}
                          </>
                        )}
                        {l.size && <>· سایز: {l.size}</>}
                      </p>
                      <div className="mt-1 flex w-max items-center rounded-lg border border-hairline">
                        <button
                          onClick={() => setQty(i, l.qty - 1)}
                          className="grid h-9 w-9 place-items-center text-lg text-bone tap-target"
                          aria-label="کاهش تعداد"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm text-bone" aria-live="polite">
                          {l.qty.toLocaleString("fa-IR")}
                        </span>
                        <button
                          onClick={() => setQty(i, l.qty + 1)}
                          className="grid h-9 w-9 place-items-center text-lg text-bone tap-target"
                          aria-label="افزایش تعداد"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="text-sm font-bold text-bone">{fmtToman(l.price * l.qty)}</p>
                      <button
                        onClick={() => remove(i)}
                        className="mt-2 tap-target text-mute hover:text-signal"
                        aria-label={`حذف ${l.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-max rounded-2xl border border-hairline bg-carbon p-6">
                <h2 className="text-lg font-bold text-bone">خلاصه سفارش</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <Row label="جمع کالاها" value={fmtToman(subtotal)} />
                  <Row label="هزینه ارسال" value="محاسبه در پرداخت" />
                  <div className="my-3 h-px bg-hairline" />
                  <Row label="مجموع" value={fmtToman(subtotal)} bold />
                </div>
                <Link to="/checkout" className={`mt-4 flex w-full ${CtaClasses("signal")}`}>
                  تکمیل سفارش
                </Link>
              </aside>
            </div>
          )}
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-bold text-bone" : "text-metal"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
