import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Shell, Band, SectionHead, TechLabel, CtaClasses } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "درباره LBB | داستان برند استریت‌ویر ایران";
const DESC = "LBB یک برند استریت‌ویر ایرانیه که با هدف ترکیب فرهنگ خیابانی و کیفیت بالا تأسیس شد.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/about" }),
    links: canonical("/about"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbLd([{ name: "خانه", path: "/" }, { name: "درباره ما", path: "/about" }])),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16">
        <section className="relative flex h-[45vh] items-center justify-center overflow-hidden bg-carbon text-bone">
          <div className="absolute inset-0 bg-gradient-to-br from-signal/25 via-transparent to-obsidian" />
          <h1 className="relative z-10 text-5xl font-black md:text-7xl">داستان LBB</h1>
        </section>

        <Shell className="py-6">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
        </Shell>

        <Band hairline={false} className="py-8">
          <Shell className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="grid aspect-[4/5] place-items-center rounded-2xl border border-hairline bg-carbon">
              <span className="text-9xl font-black text-signal/20">LBB</span>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <SectionHead label="LBB / درباره ما" title="ما کی هستیم" />
              <p className="text-sm leading-8 text-metal">
                LBB یه برند استریت‌ویر ایرانیه که از تهران شروع شد و با یه هدف ساده جلو اومد: ترکیب فرهنگ خیابون‌های ایران با کیفیت جهانی.
                ما باور داریم که لباس فقط پوشش نیست — یه بیانیه‌ست. هر قطعه‌ای که طراحی می‌کنیم، از انتخاب پارچه تا دوخت نهایی، با همین ذهنیت پیش می‌ره.
              </p>
              <p className="text-sm leading-8 text-metal">
                کالکشن‌های ما محدود، اورجینال و ساخته‌شده برای اونایی‌ست که استایل خودشون رو دارن. LBB مدل نیست، خودت باش.
              </p>
            </div>
          </Shell>
        </Band>

        <Band className="py-10">
          <Shell>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { t: "کیفیت", d: "پارچه‌های پریمیوم و دوخت دقیق. هر قطعه با استاندارد جهانی." },
                { t: "استایل", d: "طراحی مینیمال با روح خیابون. ست‌شدنی، امروزی، شخصی." },
                { t: "اصالت", d: "تولید ایرانی، طراحی ایرانی، از هنر و فرهنگ خودمون." },
              ].map((v) => (
                <div key={v.t} className="rounded-2xl border border-hairline bg-carbon p-6">
                  <span className="text-4xl text-signal" aria-hidden="true">✦</span>
                  <h3 className="mt-3 text-lg font-bold text-bone">{v.t}</h3>
                  <p className="mt-2 text-sm text-metal">{v.d}</p>
                </div>
              ))}
            </div>
          </Shell>
        </Band>

        <Band className="py-12 text-center">
          <Shell>
            <p className="mb-4 text-sm text-metal">آماده‌ای یه چیز جدید امتحان کنی؟</p>
            <Link to="/shop" className={CtaClasses("signal")}>
              فروشگاه ما رو ببین
            </Link>
          </Shell>
        </Band>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
