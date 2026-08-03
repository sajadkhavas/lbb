import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Shell } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical } from "@/lib/site";

const TITLE = "راهنمای سایز LBB | جدول سایزبندی هودی، شلوار، کتونی";
const DESC = "برای انتخاب سایز مناسب در LBB این راهنما رو ببین. جدول سایزبندی کامل برای هودی، تیشرت، شلوار و کتونی.";

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "چطور سایز مناسب از LBB انتخاب کنیم",
  step: [
    { "@type": "HowToStep", text: "سینه خود را اندازه بگیرید" },
    { "@type": "HowToStep", text: "عدد را با جدول مقایسه کنید" },
    { "@type": "HowToStep", text: "اگه بین دو سایز بودید، سایز بزرگ‌تر رو انتخاب کنید" },
  ],
};

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/size-guide", type: "article" }),
    links: canonical("/size-guide"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(howToLd) }],
  }),
  component: SizeGuide,
});

const topsSizes = [
  ["سایز", "دور سینه (سانت)", "طول (سانت)"],
  ["XS", "86–90", "64"],
  ["S", "92–96", "66"],
  ["M", "98–102", "68"],
  ["L", "104–108", "70"],
  ["XL", "110–114", "72"],
  ["XXL", "116–120", "74"],
];

const pantsSizes = [
  ["سایز", "دور کمر (سانت)", "طول (سانت)"],
  ["S", "72–76", "100"],
  ["M", "78–82", "102"],
  ["L", "84–88", "104"],
  ["XL", "90–94", "106"],
];

function SizeGuide() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-24">
        <Shell className="max-w-[900px]">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "راهنمای سایز" }]} />
          <h1 className="mt-4 text-display-2 text-bone">راهنمای سایز</h1>
          <p className="mt-3 text-sm leading-8 text-metal">
            انتخاب سایز مناسب کار سختی نیست. یه متر خیاطی بردار، سینه و کمرت رو اندازه بگیر، و با جدول‌های پایین مقایسه کن.
            اگه بین دو سایز بودی، سایز بزرگ‌تر رو انتخاب کن — LBB معمولاً برش اورسایز داره.
          </p>

          <Table title="هودی و تیشرت" rows={topsSizes} />
          <Table title="شلوار" rows={pantsSizes} />

          <div className="mt-10">
            <h2 className="text-xl font-bold text-bone">سوالات رایج</h2>
            <FAQ q="اگه سایزم درست نبود چیکار کنم؟" a="تا ۷ روز فرصت داری کالا رو با کالای دیگه در همون سایز جایگزین کنی. برای اطلاعات بیشتر به صفحه تماس مراجعه کن." />
            <FAQ q="سایزبندی LBB به سایز جهانی نزدیکه؟" a="بله، برش‌های LBB بر اساس استانداردهای بین‌المللی طراحی شدن اما تمایل به اورسایز دارن." />
          </div>
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function Table({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xl font-bold text-bone">{title}</h2>
      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-carbon text-metal">
              {rows[0].map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((r, i) => (
              <tr key={i} className="border-t border-hairline text-bone">
                {r.map((c, j) => <td key={j} className="p-3">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="border-b border-hairline py-3">
      <summary className="cursor-pointer text-sm font-semibold text-bone tap-target">{q}</summary>
      <p className="mt-2 text-sm leading-7 text-metal">{a}</p>
    </details>
  );
}
