import { useState } from "react";
import { toast } from "sonner";
import { CtaClasses } from "@/components/lbb/ui/primitives";

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
        description: "خبر دراپ‌های جدید LBB براتون ایمیل می‌شه.",
      });
    }, 600);
  };

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden bg-carbon px-6 py-20 md:px-10"
      aria-labelledby="newsletter-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--lbb-signal) 14%, transparent)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-6 text-center">
        <h2 id="newsletter-title" className="text-display-2 text-bone">
          خبر دراپ‌های بعدی رو زودتر بگیر
        </h2>
        <p className="max-w-md text-lede">
          با عضویت در خبرنامه، همزمان با انتشار هر دراپ جدید ایمیل دریافت می‌کنی.
        </p>

        <form onSubmit={submit} className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل خود را وارد کنید"
            aria-label="ایمیل"
            dir="ltr"
            className="h-12 flex-1 rounded-xl border border-hairline bg-obsidian px-4 text-sm text-bone placeholder:text-mute outline-none transition-colors focus:border-signal focus:ring-2 focus:ring-signal/30"
          />
          <button type="submit" disabled={loading} className={`${CtaClasses("signal")} rounded-xl`}>
            {loading ? "در حال ارسال..." : "عضویت"}
          </button>
        </form>
      </div>
    </section>
  );
}
