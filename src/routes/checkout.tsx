import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { useCart } from "@/lib/cart";
import { fmtToman } from "@/lib/products";

const PROVINCES = [
  "تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "آذربایجان غربی",
  "گیلان", "مازندران", "خوزستان", "کرمان", "یزد", "قم", "کرمانشاه", "هرمزگان", "سیستان و بلوچستان",
];

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "تکمیل سفارش | LBB" },
      { name: "description", content: "تکمیل اطلاعات ارسال و پرداخت سفارش در فروشگاه LBB." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "تکمیل سفارش | LBB" },
      { property: "og:description", content: "تکمیل اطلاعات ارسال و پرداخت سفارش در فروشگاه LBB." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/checkout" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: Checkout,
});

const inputCls =
  "w-full rounded-xl border border-[#e0e0e0] px-4 py-3 text-sm outline-none focus:border-[var(--lbb-red)]";

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
    // Replace with real payment gateway integration
    const orderNumber = String(Math.floor(100000 + Math.random() * 900000));
    clear();
    navigate({ to: "/order-confirmation", search: { order: orderNumber, phone: form.phone } });
  };

  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white px-5 pb-28 pt-28" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
        <div className="mx-auto w-full max-w-[560px]">
          <ol className="mb-8 flex items-center justify-between text-[12px]">
            {["۱. سبد خرید", "۲. اطلاعات", "۳. پرداخت"].map((label, i) => {
              const active = (i === 0 && step >= 1) || (i === 1 && step >= 1) || (i === 2 && step === 2);
              return (
                <li key={label} className={active ? "font-bold text-[var(--lbb-red)]" : "text-black/40"}>
                  {label}
                </li>
              );
            })}
          </ol>

          <h1 className="text-[24px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            تکمیل سفارش
          </h1>

          {step === 1 && (
            <form
              className="mt-6 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (validate()) setStep(2);
              }}
            >
              <div>
                <label htmlFor="co-name" className="mb-1.5 block text-[13px]">نام و نام‌خانوادگی</label>
                <input id="co-name" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} required />
                {errors.name && <p className="mt-1 text-[11px] text-[var(--lbb-red)]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="co-phone" className="mb-1.5 block text-[13px]">شماره موبایل</label>
                <input id="co-phone" type="tel" dir="ltr" placeholder="09xxxxxxxxx" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
                {errors.phone && <p className="mt-1 text-[11px] text-[var(--lbb-red)]">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="co-province" className="mb-1.5 block text-[13px]">استان</label>
                <select id="co-province" className={inputCls} value={form.province} onChange={(e) => set("province", e.target.value)}>
                  <option value="">انتخاب کنید</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.province && <p className="mt-1 text-[11px] text-[var(--lbb-red)]">{errors.province}</p>}
              </div>
              <div>
                <label htmlFor="co-city" className="mb-1.5 block text-[13px]">شهر</label>
                <input id="co-city" className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} />
                {errors.city && <p className="mt-1 text-[11px] text-[var(--lbb-red)]">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="co-address" className="mb-1.5 block text-[13px]">آدرس کامل</label>
                <textarea id="co-address" rows={3} className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} />
                {errors.address && <p className="mt-1 text-[11px] text-[var(--lbb-red)]">{errors.address}</p>}
              </div>
              <div>
                <label htmlFor="co-postal" className="mb-1.5 block text-[13px]">کد پستی</label>
                <input id="co-postal" dir="ltr" className={inputCls} value={form.postal} onChange={(e) => set("postal", e.target.value)} />
                {errors.postal && <p className="mt-1 text-[11px] text-[var(--lbb-red)]">{errors.postal}</p>}
              </div>
              <button type="submit" className="mt-2 h-[52px] w-full rounded-xl bg-[var(--lbb-red)] text-[14px] font-bold text-white">
                ادامه به پرداخت
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="mt-6">
              <div className="rounded-xl border border-[#e0e0e0] p-4 text-[13px]">
                {lines.map((l, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{l.name} × {l.qty.toLocaleString("fa-IR")}</span>
                    <span>{fmtToman(l.price * l.qty)}</span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between border-t border-[#eee] pt-3">
                  <span>جمع کالاها</span><span>{fmtToman(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>هزینه ارسال</span><span>{shipping === 0 ? "رایگان" : fmtToman(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-[#eee] pt-3 font-bold">
                  <span>مبلغ قابل پرداخت</span><span>{fmtToman(total)}</span>
                </div>
              </div>

              <h2 className="mt-6 text-[14px] font-semibold">انتخاب روش پرداخت</h2>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { id: "zarinpal", label: "درگاه بانکی (زرین‌پال)" },
                  { id: "idpay", label: "درگاه بانکی (ایدی‌پی)" },
                  { id: "cod", label: "پرداخت در محل" },
                ].map((o) => (
                  <label key={o.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e0e0e0] p-3 text-[13px]">
                    <input type="radio" name="payment" value={o.id} checked={payment === o.id} onChange={() => setPayment(o.id)} />
                    <span className="h-6 w-10 rounded bg-[#f2f2f2]" aria-hidden="true" />
                    {o.label}
                  </label>
                ))}
              </div>

              <button onClick={submitOrder} className="mt-6 h-[56px] w-full rounded-xl bg-[var(--lbb-red)] text-[14px] font-bold text-white">
                پرداخت و ثبت سفارش
              </button>
              <p className="mt-3 text-center text-[11px] text-[#888]">🔒 پرداخت از طریق درگاه امن بانکی</p>
              <button onClick={() => setStep(1)} className="mt-4 w-full text-[12px] text-black/50">
                بازگشت به اطلاعات ارسال
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
