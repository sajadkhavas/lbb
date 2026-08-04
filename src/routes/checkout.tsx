import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { useCart } from "@/lib/cart";
import {
  createDemoOrderRef,
  FREE_SHIPPING_THRESHOLD,
  saveDemoOrder,
  shippingFeeFor,
} from "@/lib/commerce";
import { fmtToman } from "@/lib/products";
import { DemoNotice, EmptyState, CtaClasses } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical } from "@/lib/site";
import { cn } from "@/lib/utils";

const PROVINCES = [
  "تهران",
  "البرز",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "گیلان",
  "مازندران",
  "خوزستان",
  "کرمان",
  "یزد",
  "قم",
  "کرمانشاه",
  "هرمزگان",
  "سیستان و بلوچستان",
];

const TITLE = "پیش‌نمایش سفارش | LBB";
const DESC = "مرور نمایشی اطلاعات ارسال و جمع سفارش در نسخه آزمایشی فروشگاه LBB.";
const inputCls =
  "w-full rounded-xl border border-hairline bg-carbon px-4 py-3 text-sm text-bone outline-none tap-target placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/checkout", noindex: true }),
    links: canonical("/checkout"),
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, subtotal, clear, hydrated } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postal: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [storageError, setStorageError] = useState(false);

  const shipping = shippingFeeFor(subtotal);
  const total = subtotal + shipping;

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "نام و نام‌خانوادگی را وارد کنید";
    if (!/^09\d{9}$/.test(form.phone)) next.phone = "شماره موبایل معتبر نیست";
    if (!form.province) next.province = "استان را انتخاب کنید";
    if (!form.city.trim()) next.city = "شهر را وارد کنید";
    if (form.address.trim().length < 10) next.address = "آدرس کامل را وارد کنید";
    if (!/^\d{10}$/.test(form.postal)) next.postal = "کد پستی باید ۱۰ رقم باشد";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const createPreview = () => {
    if (!lines.length || subtotal <= 0) return;
    const ref = createDemoOrderRef();
    const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
    const stored = saveDemoOrder({
      ref,
      itemCount,
      subtotal,
      shipping,
      total,
      createdAt: new Date().toISOString(),
    });
    if (!stored) {
      setStorageError(true);
      return;
    }
    clear();
    window.location.assign("/order-confirmation");
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian px-5 pb-28 pt-28">
        <div className="mx-auto w-full max-w-[560px]">
          <h1 className="text-display-2 text-bone">پیش‌نمایش سفارش</h1>

          {!hydrated ? (
            <p className="mt-8 text-sm text-metal" role="status">
              در حال خواندن سبد خرید…
            </p>
          ) : lines.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="سبد خرید خالی است"
              body="برای ساخت پیش‌نمایش سفارش، ابتدا یک محصول به سبد خرید اضافه کنید."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  رفتن به فروشگاه
                </Link>
              }
            />
          ) : (
            <>
              <ol className="mb-8 mt-7 flex items-center justify-between text-xs">
                <li className="font-bold text-signal">۱. سبد خرید</li>
                <li className="font-bold text-signal">۲. اطلاعات نمایشی</li>
                <li className={step === 2 ? "font-bold text-signal" : "text-mute"}>۳. خلاصه</li>
              </ol>

              {step === 1 ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (validate()) setStep(2);
                  }}
                >
                  <DemoNotice className="rounded-xl">
                    این اطلاعات فقط برای بررسی رابط کاربری در حافظه همین صفحه نگه داشته می‌شوند؛ به
                    سرور ارسال یا برای سفارش واقعی ذخیره نخواهند شد.
                  </DemoNotice>
                  <Field id="co-name" label="نام و نام‌خانوادگی" error={errors.name}>
                    <input
                      id="co-name"
                      autoComplete="name"
                      className={inputCls}
                      value={form.name}
                      onChange={(event) => set("name", event.target.value)}
                      required
                    />
                  </Field>
                  <Field id="co-phone" label="شماره موبایل" error={errors.phone}>
                    <input
                      id="co-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      dir="ltr"
                      placeholder="09xxxxxxxxx"
                      className={inputCls}
                      value={form.phone}
                      onChange={(event) => set("phone", event.target.value)}
                      required
                    />
                  </Field>
                  <Field id="co-province" label="استان" error={errors.province}>
                    <select
                      id="co-province"
                      autoComplete="address-level1"
                      className={inputCls}
                      value={form.province}
                      onChange={(event) => set("province", event.target.value)}
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id="co-city" label="شهر" error={errors.city}>
                    <input
                      id="co-city"
                      autoComplete="address-level2"
                      className={inputCls}
                      value={form.city}
                      onChange={(event) => set("city", event.target.value)}
                      required
                    />
                  </Field>
                  <Field id="co-address" label="آدرس کامل" error={errors.address}>
                    <textarea
                      id="co-address"
                      autoComplete="street-address"
                      rows={3}
                      className={inputCls}
                      value={form.address}
                      onChange={(event) => set("address", event.target.value)}
                      required
                    />
                  </Field>
                  <Field id="co-postal" label="کد پستی" error={errors.postal}>
                    <input
                      id="co-postal"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      dir="ltr"
                      className={inputCls}
                      value={form.postal}
                      onChange={(event) => set("postal", event.target.value)}
                      required
                    />
                  </Field>
                  <button type="submit" className={cn("mt-2 w-full", CtaClasses("signal"))}>
                    مشاهده خلاصه نمایشی
                  </button>
                </form>
              ) : (
                <div>
                  <div className="rounded-2xl border border-hairline bg-carbon p-4 text-sm text-bone">
                    {lines.map((line) => (
                      <div
                        key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`}
                        className="flex justify-between gap-4 py-1"
                      >
                        <span>
                          {line.name} × {line.qty.toLocaleString("fa-IR")}
                        </span>
                        <span>{fmtToman(line.price * line.qty)}</span>
                      </div>
                    ))}
                    <div className="mt-3 flex justify-between border-t border-hairline pt-3">
                      <span>جمع کالاها</span>
                      <span>{fmtToman(subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>هزینه ارسال نمایشی</span>
                      <span>{shipping === 0 ? "رایگان" : fmtToman(shipping)}</span>
                    </div>
                    <div className="flex justify-between border-t border-hairline pt-3 font-bold">
                      <span>جمع نمایشی</span>
                      <span>{fmtToman(total)}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-hairline bg-carbon p-4">
                    <h2 className="text-sm font-semibold text-bone">وضعیت پرداخت</h2>
                    <p className="mt-2 text-sm leading-7 text-metal">
                      هیچ درگاه بانکی یا پرداخت در محل فعال نیست. ارسال رایگان نمایشی برای سبدهای
                      بالای {fmtToman(FREE_SHIPPING_THRESHOLD)} محاسبه می‌شود.
                    </p>
                  </div>

                  <DemoNotice className="mt-6 rounded-xl">
                    با ساخت این پیش‌نمایش هیچ پرداخت، سفارش، پیامک، ایمیل، ارسال یا رزرو موجودی
                    انجام نمی‌شود. فقط یک خلاصه بدون اطلاعات هویتی در sessionStorage همین تب ذخیره
                    می‌شود.
                  </DemoNotice>
                  {storageError ? (
                    <p className="mt-3 text-sm text-signal" role="alert">
                      مرورگر اجازه ذخیره پیش‌نمایش را نداد. حالت Private یا تنظیمات Storage را بررسی
                      کنید.
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={createPreview}
                    className={cn("mt-4 w-full", CtaClasses("signal"))}
                  >
                    ساخت پیش‌نمایش سفارش
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-4 w-full tap-target text-xs text-mute"
                  >
                    بازگشت به اطلاعات نمایشی
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-bone">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[11px] text-signal" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
