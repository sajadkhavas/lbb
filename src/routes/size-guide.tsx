import { createFileRoute, Link } from "@tanstack/react-router";
import { Ruler, ScanLine, Shirt } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { breadcrumbLd, canonical, pageMeta } from "@/lib/site";

const TITLE = "راهنمای انتخاب اندازه LBB | اندازه‌گیری و بررسی تن‌خور";
const DESC =
  "راهنمای انتخاب اندازه پوشاک LBB؛ روش اندازه‌گیری بدن، مقایسه با لباس مناسب و بررسی تن‌خور هر محصول پیش از خرید.";

const STEPS = [
  {
    Icon: Ruler,
    title: "اندازه‌گیری بدن",
    body: "متر خیاطی را صاف و بدون فشار دور سینه، کمر یا بخشی که برای محصول اهمیت دارد قرار دهید. اندازه را بر حسب سانتی‌متر یادداشت کنید.",
  },
  {
    Icon: Shirt,
    title: "مقایسه با لباس مناسب",
    body: "لباسی را که تن‌خور آن برای شما مناسب است روی سطح صاف پهن کنید و عرض و طول آن را اندازه بگیرید. این مقایسه معمولاً از تکیه بر نام S، M یا L دقیق‌تر است.",
  },
  {
    Icon: ScanLine,
    title: "بررسی تن‌خور محصول",
    body: "واژه‌هایی مانند رگولار، آزاد، باکسی و اورسایز شکل نشستن لباس روی بدن را توضیح می‌دهند. توضیح تن‌خور هر قطعه را جداگانه بخوانید.",
  },
];

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/size-guide", type: "article" }),
    links: canonical("/size-guide"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "راهنمای اندازه", path: "/size-guide" },
          ]),
        ),
      },
    ],
  }),
  component: SizeGuide,
});

function SizeGuide() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-24">
        <Shell className="max-w-[900px]">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "راهنمای اندازه" }]} />
          <TechLabel tone="signal" className="mt-8">
            SIZE / FIT / MEASURE
          </TechLabel>
          <h1 className="mt-4 text-display-2 text-bone">راهنمای انتخاب اندازه</h1>
          <p className="mt-4 max-w-[66ch] text-sm leading-8 text-metal">
            نام اندازه به‌تنهایی برای انتخاب کافی نیست؛ الگو و تن‌خور هر محصول می‌تواند متفاوت باشد.
            اندازه‌های بدن یا یک لباس مناسب را ثبت کنید و آن‌ها را با اطلاعات همان محصول بسنجید.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ Icon, title, body }) => (
              <section key={title} className="rounded-2xl border border-hairline bg-carbon p-5">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-signal/40 bg-signal/10 text-signal">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-bone">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-metal">{body}</p>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-2xl border border-hairline bg-carbon p-6 md:p-8">
            <h2 className="text-xl font-bold text-bone">نکته‌های اندازه‌گیری</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-metal">
              <li>متر را نکشید و آن را بیش از اندازه آزاد نگذارید.</li>
              <li>برای بالاتنه، دور سینه و طول لباس را بررسی کنید.</li>
              <li>برای شلوار، دور کمر، دور باسن، فاق و طول پا اهمیت دارد.</li>
              <li>
                برای کفش، طول پا را در پایان روز و با جورابی که معمولاً می‌پوشید اندازه بگیرید.
              </li>
              <li>
                در انتخاب میان دو اندازه، توضیح تن‌خور و اندازه‌های دقیق همان محصول را ملاک قرار
                دهید.
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-bone">پرسش‌های رایج</h2>
            <FAQ
              question="آیا همه محصولات LBB یک الگوی اندازه دارند؟"
              answer="خیر. هودی، تیشرت، شلوار و کفش الگوهای متفاوتی دارند و حتی دو محصول هم‌دسته ممکن است تن‌خور یکسانی نداشته باشند. اطلاعات صفحه همان محصول را بررسی کنید."
            />
            <FAQ
              question="اورسایز یعنی یک اندازه بزرگ‌تر انتخاب کنم؟"
              answer="لزومی ندارد. اورسایز به الگوی آزادتر لباس اشاره می‌کند. اندازه معمول خود را با اندازه‌های واقعی و توضیح تن‌خور محصول مقایسه کنید."
            />
            <FAQ
              question="برای راهنمایی بیشتر از کجا بپرسم؟"
              answer="نام محصول و اندازه‌های خود را از طریق صفحه رسمی LBB بفرستید تا راهنمایی دقیق‌تری دریافت کنید."
            />
          </section>

          <div className="my-12 flex flex-wrap gap-3">
            <Link to="/shop" className={CtaClasses("signal")}>
              مشاهده محصولات
            </Link>
            <Link to="/contact" className={CtaClasses("line")}>
              تماس با LBB
            </Link>
          </div>
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="border-b border-hairline py-3">
      <summary className="cursor-pointer text-sm font-semibold text-bone tap-target">
        {question}
      </summary>
      <p className="mt-2 text-sm leading-7 text-metal">{answer}</p>
    </details>
  );
}
