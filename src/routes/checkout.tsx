import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import { CtaClasses, EmptyState, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { useCart } from "@/lib/cart";
import { getCommerceReadiness } from "@/lib/commerce";
import { fmtToman } from "@/lib/products";
import {
  STORE_SETTINGS,
  getPublicPaymentSettings,
  getPublicShippingMethods,
} from "@/lib/store-settings";
import { canonical, pageMeta } from "@/lib/site";

const TITLE = "تکمیل سفارش | LBB";
const DESC =
  "بررسی وضعیت آماده‌بودن ارسال، پرداخت و ثبت سفارش LBB؛ هیچ سفارش یا پرداختی بدون زیرساخت تأییدشده موفق تلقی نمی‌شود.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/checkout", noindex: true }),
    links: canonical("/checkout"),
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, hydrated } = useCart();
  const readiness = getCommerceReadiness();
  const shippingMethods = getPublicShippingMethods();
  const payment = getPublicPaymentSettings();

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian px-4 pb-28 pt-24 md:px-6">
        <div className="mx-auto w-full max-w-[760px]">
          <TechLabel tone="signal">CHECKOUT / TRUST BOUNDARY</TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">تکمیل سفارش</h1>
          <p className="mt-3 max-w-[62ch] text-sm leading-8 text-metal">
            این صفحه قبل از جمع‌آوری اطلاعات هویتی یا شروع پرداخت، آماده‌بودن سرویس‌های عمومی و سمت
            سرور را بررسی می‌کند. نبودن یک سرویس با دادهٔ فرضی جبران نمی‌شود.
          </p>

          {!hydrated ? (
            <p className="mt-8 text-sm text-metal" role="status">
              در حال خواندن سبد خرید…
            </p>
          ) : lines.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="سبد خرید خالی است"
              body="برای بررسی Checkout ابتدا یک محصول به سبد اضافه کنید."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  رفتن به فروشگاه
                </Link>
              }
            />
          ) : (
            <div className="mt-8 space-y-6">
              <section className="rounded-2xl border border-hairline bg-carbon p-5" aria-labelledby="checkout-summary">
                <h2 id="checkout-summary" className="text-base font-bold text-bone">
                  خلاصه اقلام
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  {lines.map((line) => (
                    <div
                      key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`}
                      className="flex min-w-0 items-start justify-between gap-4 border-t border-hairline pt-3 first:border-t-0 first:pt-0"
                    >
                      <span className="min-w-0 text-metal">
                        {line.name} × {line.qty.toLocaleString("fa-IR")}
                      </span>
                      <span className="shrink-0 font-semibold text-bone">
                        {fmtToman(line.price * line.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-hairline pt-4 text-base font-bold text-bone">
                    <span>جمع کالاها</span>
                    <span>{fmtToman(subtotal)}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-6 text-mute">
                  این مبلغ فقط جمع اقلام سبد است؛ هزینه ارسال یا Total نهایی تا وجود دادهٔ قابل‌اعتماد
                  اضافه نمی‌شود.
                </p>
              </section>

              {shippingMethods.length > 0 ? (
                <StatePanel title="روش ارسال عمومی تأیید شده است" tone="success">
                  روش‌های فعال: {shippingMethods.map((method) => method.title).join("، ")}. انتخاب
                  روش و محاسبه قابل‌اعتماد هزینه به فرایند واقعی سفارش وابسته است.
                </StatePanel>
              ) : (
                <StatePanel
                  title={
                    STORE_SETTINGS.shipping.verification === "pending"
                      ? "تنظیمات ارسال در حال بررسی است"
                      : "روش ارسال عمومی در دسترس نیست"
                  }
                  tone={STORE_SETTINGS.shipping.verification === "pending" ? "warning" : "info"}
                >
                  Checkout هیچ هزینه، ارسال رایگان یا زمان تحویل فرضی تولید نمی‌کند.
                </StatePanel>
              )}

              {payment ? (
                <StatePanel title={`روش پرداخت عمومی: ${payment.displayName}`} tone="success">
                  این اطلاعات فقط سطح عمومی پرداخت است. شروع تراکنش و نتیجهٔ پرداخت باید سمت سرور
                  پیاده‌سازی و Verify شوند؛ Callback مرورگر به‌تنهایی Success نیست.
                </StatePanel>
              ) : (
                <StatePanel
                  title={
                    STORE_SETTINGS.payment.verification === "pending"
                      ? "تنظیمات پرداخت در حال بررسی است"
                      : "روش پرداخت عمومی هنوز فعال نیست"
                  }
                  tone={STORE_SETTINGS.payment.verification === "pending" ? "warning" : "info"}
                >
                  نام درگاه، روش پرداخت، Merchant ID یا دادهٔ حساس دیگری از روی حدس نمایش داده
                  نمی‌شود.
                </StatePanel>
              )}

              <StatePanel title="ثبت نهایی سفارش هنوز سمت سرور تأیید نشده است" tone="warning">
                <p>
                  آماده‌بودن عمومی Shipping: {readiness.shippingPublic ? "بله" : "خیر"}؛ Payment:{" "}
                  {readiness.paymentPublic ? "بله" : "خیر"}. حتی با آماده‌شدن این دو، Order
                  submission و Payment verification باید Backend تأییدشده داشته باشند.
                </p>
                <p className="mt-2">
                  به همین دلیل این صفحه فعلاً نام، تلفن، نشانی یا کدپستی جمع‌آوری نمی‌کند و هیچ دکمهٔ
                  موفقیت ساختگی ندارد.
                </p>
              </StatePanel>

              <div className="flex flex-wrap gap-3">
                <Link to="/cart" className={CtaClasses("line")}>
                  بازگشت به سبد
                </Link>
                <Link to="/shipping-returns" className={CtaClasses("line")}>
                  ارسال و مرجوعی
                </Link>
                <Link to="/contact" className={CtaClasses("signal")}>
                  تماس و پشتیبانی
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
