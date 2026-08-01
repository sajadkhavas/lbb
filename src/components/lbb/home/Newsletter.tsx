import { useState } from "react";
import { toast } from "sonner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      toast.error("لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      toast.success("عضویت با موفقیت انجام شد", {
        description: "کد تخفیف ۱۰٪ برات ایمیل شد 🎉",
      });
    }, 600);
  };

  return (
    <section dir="rtl" className="relative overflow-hidden bg-[var(--lbb-red)] px-6 py-20 md:px-10" aria-labelledby="newsletter-title">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, #fff 0, #fff 1px, transparent 1px, transparent 22px)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center">
        <h2
          id="newsletter-title"
          className="text-[28px] font-black text-white md:text-[40px] font-display"
        >
          عضو خانواده LBB شو
        </h2>
        <p className="max-w-md text-sm text-white/85">
          با عضویت در خبرنامه از تخفیف‌های ویژه و کالکشن‌های جدید زودتر از همه باخبر شو.
        </p>

        <form onSubmit={submit} className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل خود را وارد کنید"
            aria-label="ایمیل"
            dir="ltr"
            className="h-12 flex-1 rounded-lg border border-white/30 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 outline-none focus:border-white"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 shrink-0 rounded-lg bg-black px-7 text-[13px] font-bold text-white transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {loading ? "در حال ارسال..." : "عضویت"}
          </button>
        </form>
      </div>
    </section>
  );
}
