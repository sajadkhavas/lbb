import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { useCart } from "@/lib/cart";
import { fmtToman } from "@/lib/products";
import { DemoNotice, Shell, CtaClasses, TechLabel } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical } from "@/lib/site";
import { cn } from "@/lib/utils";

const PROVINCES = [
  "تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "آذربایجان غربی",
  "گیلان", "مازندران", "خوزستان", "کرمان", "یزد", "قم", "کرمانشاه", "هرمزگان", "سیستان و بلوچستان",
];

const TITLE = "تکمیل سفارش | LBB";
const DESC = "تکمیل اطلاعات ارسال و پرداخت سفارش در فروشگاه LBB.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/checkout", noindex: true }),
    links: canonical("/checkout"),
  }),
  component: Checkout,
});

const inputCls =
  "w-full rounded-xl border border-hairline bg-carbon px-4 py-3 text-sm text-bone outline-none tap-target placeholder:text-mute focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/40";

function Checkout() {
  const navigate = useNavigate();
  const { lines, subtotal, clear } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", province: "", city: "", address: "", postal: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState("zarinpal");

  const shipping = subtotal >= 5000000 || subtotal === 0 ? 0 : 60000;
  const total = subtotal + shipping;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "نام و نام‌خانوادگی را وارد کنید";
    if (!/^09\d{9}$/.test(form.phone)) e.phone = "شماره موبایل معتبر نیست";
    if (!form.province) e.province = "استان را انتخاب کنید";
    if (!form.city.trim()) e.city = "شهر را وارد کنید";
    if (form.address.trim().length < 10) e.address = "آدرس کامل را وارد کنید";
    if (!/^\d{10}$/.test(form.postal)) e.postal = "کد پستی باید ۱۰ رقم باشد";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitOrder = () => {
    // Demo-only: no payment gateway is connected and no order is actually
    // transmitted anywhere. This reference id only exists in this browser tab.
    const ref = String(Math.floor(100000 + Math.random() * 900000));
    const itemCount = lines.reduce((a, l) => a + l.qty, 0);
    clear();
    navigate({
      to: "/order-confirmation",
      search: { ref, itemCount: String(itemCount), total: String(total) },
    });
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian px-5 pb-28 pt-28">
        <div className="mx-auto w-full max-w-[560px]">
          <ol className="mb-8 flex items-center justify-between text-xs">
            {["۱. سبد خرید", "۲. اطلاعات", "۳. پرداخت"].map((label, i) => {
              const active = (i === 0 && step >= 1) || (i === 1 && step >= 1) || (i === 2 && step === 2);
              return (
                <li key={label} className={active ? "font-bold text-signal" : "text-mute"}>
                  {label}
                </li>
              );
            })}
          </ol>

          <h1 className="text-display-2 text-bone">تکمیل سفارش</h1>

          {step === 1 && (
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (validate()) setStep(2);
              }}
            >
              <Field id="co-name" label="نام و نام‌خانوادگی" error={errors.name}>
                <input id="co-name" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </Field>
              <Field id="co-phone" label="شماره موبایل" error={errors.phone}>
                <input id="co-phone" type="tel" dir="ltr" placeholder="09xxxxxxxxx" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
              </Field>
              <Field id="co-province" label="استان" error={errors.province}>
                <select id="co-province" className={inputCls} value={form.province} onChange={(e) => set("province", e.target.value)}>
                  <option value="">انتخاب کنید</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field id="co-city" label="شهر" error={errors.city}>
                <input id="co-city" className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field id="co-address" label="آدرس کامل" error={errors.address}>
                <textarea id="co-address" rows={3} className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <Field id="co-postal" label="کد پستی" error={errors.postal}>
                <input id="co-postal" dir="ltr" className={inputCls} value={form.postal} onChange={(e) => set("postal", e.target.value)} />
              </Field>
              <button type="submit" className={cn("mt-2 w-full", CtaClasses("signal"))}>
                ادامه به پرداخت
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="mt-6">
              <div className="rounded-2xl border border-hairline bg-carbon p-4 text-sm text-bone">
                {lines.map((l, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{l.name} × {l.qty.toLocaleString("fa-IR")}</span>
                    <span>{fmtToman(l.price * l.qty)}</span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between border-t border-hairline pt-3">
                  <span>جمع کالاها</span><span>{fmtToman(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>هزینه ارسال</span><span>{shipping === 0 ? "رایگان" : fmtToman(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-hairline pt-3 font-bold">
                  <span>مبلغ قابل پرداخت</span><span>{fmtToman(total)}</span>
                </div>
              </div>

              <h2 className="mt-6 text-sm font-semibold text-bone">انتخاب روش پرداخت</h2>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { id: "zarinpal", label: "درگاه بانکی (زرین‌پال)" },
                  { id: "idpay", label: "درگاه بانکی (ایدی‌پی)" },
                  { id: "cod", label: "پرداخت در محل" },
                ].map((o) => (
                  <label
                    key={o.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm tap-target",
                      payment === o.id ? "border-signal text-bone" : "border-hairline text-bone",
                    )}
                  >
                    <input type="radio" name="payment" value={o.id} checked={payment === o.id} onChange={() => setPayment(o.id)} />
                    <span className="h-6 w-10 rounded bg-carbon-2" aria-hidden="true" />
                    {o.label}
                  </label>
                ))}
              </div>

              <DemoNotice className="mt-6 rounded-xl">
                این یک فروشگاه نمایشی است. با کلیک روی «ثبت سفارش نمایشی» هیچ پرداخت واقعی انجام نمی‌شود، هیچ سفارشی برای شما ارسال نمی‌شود و پیامک یا ایمیلی دریافت نخواهید کرد.
              </DemoNotice>
              <button onClick={submitOrder} className={cn("mt-4 w-full", CtaClasses("signal"))}>
                ثبت سفارش نمایشی
              </button>
              <button onClick={() => setStep(1)} className="mt-4 w-full tap-target text-xs text-mute">
                بازگشت به اطلاعات ارسال
              </button>
            </div>
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
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-bone">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] text-signal" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
