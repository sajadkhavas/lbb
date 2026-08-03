import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";

const TITLE = "تماس با LBB | پشتیبانی و سفارشات";
const DESC = "برای سوال، همکاری یا پیگیری سفارش با LBB در تماس باشید.";

const ld = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  url: "/contact",
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-24 text-black" style={{ paddingBottom: 80, fontFamily: "var(--font-body)" }}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-8">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "تماس" }]} />
          <h1 className="mt-4 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>تماس با ما</h1>
          <p className="mt-2 text-sm text-gray-600">هر سوالی داری، بپرس. تیم ما ۹ صبح تا ۹ شب همه روزه در دسترسه.</p>

          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="flex flex-col gap-4"
            >
              <Field label="نام" name="name" required />
              <Field label="ایمیل" name="email" type="email" required />
              <div>
                <label className="mb-1 block text-sm font-semibold">موضوع</label>
                <select className="w-full rounded-md border border-black/15 bg-white p-2.5 text-sm outline-none focus:border-[var(--lbb-red)]">
                  <option>سوال</option><option>سفارش</option><option>همکاری</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">پیام</label>
                <textarea rows={4} required className="w-full rounded-md border border-black/15 bg-white p-2.5 text-sm outline-none focus:border-[var(--lbb-red)]" />
              </div>
              <button className="h-12 rounded-lg bg-[var(--lbb-red)] text-sm font-bold text-white hover:brightness-110">
                {sent ? "پیام شما ارسال شد ✓" : "ارسال پیام"}
              </button>
            </form>
            <aside className="flex flex-col gap-4 rounded-xl bg-gray-50 p-6 text-sm">
              <h2 className="text-lg font-bold">راه‌های تماس</h2>
              <p><span className="text-gray-500">اینستاگرام: </span><a href="https://www.instagram.com/lbbclo" className="text-[var(--lbb-red)]">@lbbclo</a></p>
              <p><span className="text-gray-500">پاسخگویی: </span>۹ صبح تا ۹ شب، همه روزه</p>
              <p className="text-gray-600 leading-7">پیام مستقیم در اینستاگرام سریع‌ترین راه تماسه.</p>
            </aside>
          </div>
        </div>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      <input {...p} className="w-full rounded-md border border-black/15 bg-white p-2.5 text-sm outline-none focus:border-[var(--lbb-red)]" />
    </div>
  );
}
