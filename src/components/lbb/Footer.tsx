import { Instagram } from "lucide-react";

const shop = [
  { l: "هودی", h: "/hoodies" },
  { l: "شلوار", h: "/pants" },
  { l: "تیشرت", h: "/tshirts" },
  { l: "کتونی", h: "/shoes" },
  { l: "اکسسوری", h: "/accessories" },
];
const info = [
  { l: "درباره ما", h: "/about" },
  { l: "تماس", h: "/contact" },
  { l: "راهنمای سایز", h: "/size-guide" },
  { l: "سوالات متداول", h: "/faq" },
  { l: "کالکشن‌ها", h: "/collections" },
  { l: "ژورنال", h: "/journal" },
  { l: "پیگیری سفارش", h: "/track-order" },
  { l: "ارسال و مرجوعی", h: "/shipping-returns" },
  { l: "قوانین و مقررات", h: "/terms" },
  { l: "حریم خصوصی", h: "/privacy" },
];

export function Footer({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <footer
      dir="rtl"
      className={`border-t px-6 pt-16 pb-24 md:px-10 md:pb-10 ${
        isLight ? "border-black/[0.06] bg-white text-black" : "border-white/[0.08] bg-black text-white"
      } font-body`}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span
            className="font-black text-[var(--lbb-red)] font-display"
            style={{ fontSize: 28 }}
          >
            LBB
          </span>
          <p className={`mt-4 max-w-xs text-xs leading-relaxed ${isLight ? "text-black/50" : "text-white/45"}`}>
            استریت‌ویر پریمیوم ایرانی. طراحی شده برای خیابون‌های تهران، پوشیده شده در همه‌جا.
          </p>
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className={`mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border ${isLight ? "border-black/15 text-black/60" : "border-white/20 text-white/70"} hover:border-[var(--lbb-red)]`}
          >
            <Instagram size={16} />
          </a>
        </div>
        <FooterCol title="فروشگاه" items={shop} light={isLight} />
        <FooterCol title="راهنما" items={info} light={isLight} />
        <div>
          <h4 className="mb-4 text-xs font-bold">عضویت در خبرنامه</h4>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="lbb-email" className="sr-only">ایمیل</label>
            <input
              id="lbb-email"
              type="email"
              placeholder="your@email.com"
              className={`flex-1 rounded-md border px-3 py-2 text-xs outline-none focus:border-[var(--lbb-red)] ${
                isLight ? "border-black/15 bg-white text-black" : "border-white/20 bg-black text-white"
              }`}
            />
            <button className={`rounded-md border px-3 text-[11px] font-bold hover:border-[var(--lbb-red)] ${isLight ? "border-black/25 text-black" : "border-white/30 text-white"}`}>
              عضویت
            </button>
          </form>
          {/* Enamad + Samandehi placeholders */}
          <div className="mt-6 flex gap-3">
            {/* جایگزین با کد اینماد اصلی پس از ثبت‌نام در https://enamad.ir */}
            <div
              className={`grid h-20 w-20 place-items-center rounded-md border border-dashed p-1 text-center text-[9px] leading-tight ${isLight ? "border-black/30 text-black/50" : "border-white/25 text-white/50"}`}
            >
              اینماد اینجا قرار می‌گیره
            </div>
            <div
              className={`grid h-20 w-20 place-items-center rounded-md border border-dashed p-1 text-center text-[9px] leading-tight ${isLight ? "border-black/30 text-black/50" : "border-white/25 text-white/50"}`}
            >
              ساماندهی
            </div>
          </div>
        </div>
      </div>

      <div className={`mx-auto mt-12 flex max-w-[1600px] flex-col items-start justify-between gap-2 border-t pt-6 text-[10px] md:flex-row ${isLight ? "border-black/[0.06] text-black/40" : "border-white/[0.06] text-white/30"}`}>
        <span>© ۱۴۰۵ LBB — تمامی حقوق محفوظ است</span>
        <span>طراحی شده برای خیابون‌های تهران</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items, light }: { title: string; items: { l: string; h: string }[]; light: boolean }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.h}>
            <a href={i.h} className={`text-xs hover:text-[var(--lbb-red)] ${light ? "text-black/60" : "text-white/55"}`}>
              {i.l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
