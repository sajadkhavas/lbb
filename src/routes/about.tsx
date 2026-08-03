import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";

const TITLE = "درباره LBB | داستان برند استریت‌ویر ایران";
const DESC = "LBB یک برند استریت‌ویر ایرانیه که با هدف ترکیب فرهنگ خیابانی و کیفیت بالا تأسیس شد.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Navbar theme="light" />
      <main dir="rtl" className="min-h-screen bg-white pt-16 text-black" style={{ paddingBottom: 80, fontFamily: "var(--font-body)" }}>
        <section
          className="relative flex h-[45vh] items-center justify-center overflow-hidden bg-black text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--lbb-red)]/40 via-transparent to-black" />
          <h1 className="relative z-10 text-5xl font-black md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
            داستان LBB
          </h1>
        </section>

        <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-8">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
        </div>

        <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 py-8 md:grid-cols-2 md:px-8">
          <div className="grid aspect-[4/5] place-items-center rounded-xl bg-gray-50">
            <span className="text-[var(--lbb-red)]/20 text-9xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              LBB
            </span>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>ما کی هستیم</h2>
            <p className="text-sm leading-8 text-gray-600">
              LBB یه برند استریت‌ویر ایرانیه که از تهران شروع شد و با یه هدف ساده جلو اومد: ترکیب فرهنگ خیابون‌های ایران با کیفیت جهانی. 
              ما باور داریم که لباس فقط پوشش نیست — یه بیانیه‌ست. هر قطعه‌ای که طراحی می‌کنیم، از انتخاب پارچه تا دوخت نهایی، با همین ذهنیت پیش می‌ره.
            </p>
            <p className="text-sm leading-8 text-gray-600">
              کالکشن‌های ما محدود، اورجینال و ساخته‌شده برای اونایی‌ست که استایل خودشون رو دارن. LBB مدل نیست، خودت باش.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-10 md:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { t: "کیفیت", d: "پارچه‌های پریمیوم و دوخت دقیق. هر قطعه با استاندارد جهانی." },
              { t: "استایل", d: "طراحی مینیمال با روح خیابون. ست‌شدنی، امروزی، شخصی." },
              { t: "اصالت", d: "تولید ایرانی، طراحی ایرانی، از هنر و فرهنگ خودمون." },
            ].map((v) => (
              <div key={v.t} className="rounded-xl border border-black/[0.06] bg-white p-6">
                <span className="text-4xl text-[var(--lbb-red)]">✦</span>
                <h3 className="mt-3 text-lg font-bold">{v.t}</h3>
                <p className="mt-2 text-sm text-gray-600">{v.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-black/[0.06] py-12 text-center">
          <p className="mb-4 text-sm text-gray-600">آماده‌ای یه چیز جدید امتحان کنی؟</p>
          <Link to="/shop" className="inline-flex h-12 items-center rounded-lg bg-[var(--lbb-red)] px-8 text-sm font-bold text-white hover:brightness-110">
            فروشگاه ما رو ببین
          </Link>
        </section>
      </main>
      <Footer theme="light" />
      <MobileBottomBar />
    </>
  );
}
