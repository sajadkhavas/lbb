import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { useCart } from "@/lib/cart";
import { fmtToman } from "@/lib/products";
import { X } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سبد خرید | LBB" },
      { name: "description", content: "سبد خرید فروشگاه LBB" },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "سبد خرید | LBB" },
      { property: "og:description", content: "سبد خرید فروشگاه LBB" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/cart" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, remove, setQty, subtotal } = useCart();
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-24 text-black" style={{ paddingBottom: 80, fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سبد خرید" }]} />
          <h1 className="mt-4 text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>سبد خرید</h1>

          {lines.length === 0 ? (
            <div className="mt-16 text-center text-gray-500">
              <p>سبد خرید شما خالی است.</p>
              <Link to="/shop" className="mt-6 inline-block rounded-lg bg-[var(--lbb-red)] px-6 py-3 text-sm font-bold text-white">
                رفتن به فروشگاه
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[65%_35%]">
              <div className="flex flex-col gap-3">
                {lines.map((l, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-black/[0.06] p-3">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-gray-50 text-xs text-[var(--lbb-red)]/40 font-black">LBB</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{l.name}</p>
                      <p className="text-xs text-gray-500">
                        {l.color && <>رنگ: <span style={{ display: "inline-block", width: 10, height: 10, background: l.color, borderRadius: 999, verticalAlign: "middle" }} /> </>}
                        {l.size && <>· سایز: {l.size}</>}
                      </p>
                      <div className="mt-1 flex items-center rounded-md border border-black/10 w-max">
                        <button onClick={() => setQty(i, l.qty - 1)} className="h-8 w-8 text-lg">−</button>
                        <span className="w-8 text-center text-sm">{l.qty}</span>
                        <button onClick={() => setQty(i, l.qty + 1)} className="h-8 w-8 text-lg">+</button>
                      </div>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {fmtToman(l.price * l.qty)}
                      </p>
                      <button onClick={() => remove(i)} className="mt-2 text-gray-400 hover:text-[var(--lbb-red)]" aria-label="حذف">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-max rounded-xl border border-black/[0.06] p-6">
                <h2 className="text-lg font-bold">خلاصه سفارش</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <Row label="جمع کالاها" value={fmtToman(subtotal)} />
                  <Row label="هزینه ارسال" value="محاسبه در پرداخت" />
                  <div className="my-3 h-px bg-black/[0.06]" />
                  <Row label="مجموع" value={fmtToman(subtotal)} bold />
                </div>
                <Link
                  to="/checkout"
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-[var(--lbb-red)] text-sm font-bold text-white hover:brightness-110"
                >
                  تکمیل سفارش
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-bold" : "text-gray-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
