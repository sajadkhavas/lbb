import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircleMore } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { BRAND, BRAND_COPY } from "@/lib/brand";
import { pageMeta, canonical, absUrl, breadcrumbLd } from "@/lib/site";

const TITLE = "تماس با LBB | فروشگاه پاساژ مهستان کرج";
const DESC =
  "راه‌های ارتباط با LBB؛ مراجعه به فروشگاه پوشاک شهری LBB در پاساژ مهستان کرج یا پیام به صفحه رسمی @lbbclo.";

const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  url: absUrl("/contact"),
  inLanguage: "fa-IR",
  mainEntity: {
    "@type": "ClothingStore",
    name: BRAND.name,
    alternateName: BRAND.nameFa,
    url: absUrl("/"),
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.physicalLocation,
      addressLocality: BRAND.city,
      addressRegion: BRAND.province,
      addressCountry: "IR",
    },
    sameAs: [BRAND.instagramUrl],
  },
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/contact" }),
    links: canonical("/contact"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "تماس", path: "/contact" },
          ]),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(contactPageLd) },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian pb-28 pt-16 text-bone">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "تماس" }]} />
          </Shell>
        </div>

        <Shell className="py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <section>
              <TechLabel tone="signal">CONTACT / KARAJ / MAHESTAN</TechLabel>
              <h1 className="mt-4 max-w-[14ch] text-display-1 text-bone">ارتباط با LBB</h1>
              <p className="text-lede mt-5 max-w-[58ch]">
                برای دیدن محصولات از نزدیک به فروشگاه LBB در پاساژ مهستان کرج مراجعه کنید یا از
                طریق صفحهٔ رسمی اینستاگرام پیام بفرستید.
              </p>
              <p className="mt-5 max-w-[64ch] text-sm leading-8 text-metal">
                برای پرسش دربارهٔ محصول، اندازه، تن‌خور یا همکاری، پیام شما از طریق شناسهٔ رسمی
                LBB پیگیری می‌شود. شمارهٔ واحد، طبقه، ساعت کاری و راه‌های ارتباطی دیگر پس از تأیید
                رسمی در همین صفحه درج خواهند شد.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={CtaClasses("signal")}
                >
                  <Instagram size={17} aria-hidden="true" />
                  پیام به {BRAND.instagramHandle}
                </a>
                <a href="#store-location" className={CtaClasses("line")}>
                  <MapPin size={17} aria-hidden="true" />
                  نشانی فروشگاه
                </a>
              </div>
            </section>

            <aside
              id="store-location"
              className="scroll-mt-24 rounded-2xl border border-hairline bg-carbon p-6 md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-signal text-obsidian">
                  <MapPin size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="tech text-mute">PHYSICAL STORE</p>
                  <h2 className="mt-1 text-lg font-bold text-bone">فروشگاه حضوری LBB</h2>
                </div>
              </div>

              <dl className="mt-7 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">شهر</dt>
                  <dd className="font-semibold text-bone">{BRAND.city}</dd>
                </div>
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">محل فروشگاه</dt>
                  <dd className="text-end font-semibold text-bone">{BRAND.physicalLocation}</dd>
                </div>
                <div className="flex items-start justify-between gap-5">
                  <dt className="text-mute">اینستاگرام رسمی</dt>
                  <dd className="font-semibold text-bone" dir="ltr">
                    {BRAND.instagramHandle}
                  </dd>
                </div>
              </dl>

              <div className="mt-7 rounded-xl border border-hairline bg-obsidian p-4">
                <div className="flex items-start gap-3">
                  <MessageCircleMore size={18} className="mt-1 shrink-0 text-signal" aria-hidden="true" />
                  <p className="text-sm leading-7 text-metal">
                    {BRAND_COPY.storeLocationLabel}. برای دریافت جزئیات مراجعه، پیش از حرکت از طریق
                    صفحهٔ رسمی LBB پیام بفرستید.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
