import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircleMore, Phone } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { pageMeta, canonical, absUrl, breadcrumbLd } from "@/lib/site";
import { resolveStorefrontControl, resolveStorefrontPage } from "@/lib/storefront-control";

const FALLBACK_TITLE = "تماس با LBB";
const FALLBACK_DESC = "راه‌های ارتباط عمومی و تأییدشده با LBB و اطلاعات فروشگاه حضوری در کرج.";

type ContactKind = "instagram" | "phone" | "whatsapp";

function ContactIcon({ kind }: { kind: ContactKind }) {
  if (kind === "instagram") return <Instagram size={18} aria-hidden="true" />;
  if (kind === "phone") return <Phone size={18} aria-hidden="true" />;
  return <MessageCircleMore size={18} aria-hidden="true" />;
}

export const Route = createFileRoute("/contact")({
  loader: async () => {
    const [control, page] = await Promise.all([
      resolveStorefrontControl(),
      resolveStorefrontPage("contact"),
    ]);
    return { control, page };
  },
  head: ({ loaderData }) => {
    const control = loaderData?.control;
    const page = loaderData?.page;
    if (!control) return {};

    const title = page?.metaTitle || page?.title || FALLBACK_TITLE;
    const description = page?.metaDescription || page?.excerpt || FALLBACK_DESC;
    const sameAs = [control.contact.instagramUrl, `https://wa.me/98${control.contact.whatsapp.replace(/\D/g, "").replace(/^0/, "")}`];
    const contactPageLd = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: title,
      url: absUrl("/contact"),
      inLanguage: "fa-IR",
      mainEntity: {
        "@type": "ClothingStore",
        name: control.brand.name,
        alternateName: control.brand.nameFa,
        url: absUrl("/"),
        telephone: control.contact.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: control.contact.city,
          addressRegion: control.contact.province,
          addressCountry: "IR",
        },
        sameAs,
      },
    };

    return {
      meta: pageMeta({ title, description, path: "/contact" }),
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
    };
  },
  component: ContactPage,
});

function ContactPage() {
  const { control, page } = Route.useLoaderData();
  const whatsappDigits = control.contact.whatsapp.replace(/\D/g, "").replace(/^0/, "");
  const phoneDigits = control.contact.phone.replace(/\D/g, "").replace(/^0/, "");
  const contacts: Array<{
    kind: ContactKind;
    label: string;
    value: string;
    href: string;
  }> = [
    {
      kind: "instagram",
      label: "اینستاگرام",
      value: control.contact.instagramHandle,
      href: control.contact.instagramUrl,
    },
    {
      kind: "phone",
      label: "تلفن",
      value: control.contact.phone,
      href: `tel:+98${phoneDigits}`,
    },
    {
      kind: "whatsapp",
      label: "واتساپ",
      value: control.contact.whatsapp,
      href: `https://wa.me/98${whatsappDigits}`,
    },
  ];

  return (
    <>
      <Navbar />
      <main
        dir="rtl"
        className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16 text-bone"
        data-storefront-source={control.source}
      >
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "تماس" }]} />
          </Shell>
        </div>

        <Shell className="py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <section aria-labelledby="contact-heading">
              <TechLabel tone="signal">CONTACT / VERIFIED CHANNELS</TechLabel>
              <h1 id="contact-heading" className="mt-4 max-w-[14ch] text-display-1 text-bone">
                {page?.title || "ارتباط با LBB"}
              </h1>
              <p className="text-lede mt-5 max-w-[58ch]">
                {page?.excerpt ||
                  "برای پرسش درباره محصول، سایز، موجودی یا سفارش می‌توانید از راه‌های ارتباطی رسمی LBB استفاده کنید."}
              </p>

              <div
                className="mt-8 grid gap-3 sm:grid-cols-2"
                aria-label="راه‌های ارتباطی تأییدشده"
              >
                {contacts.map((channel) => (
                  <a
                    key={channel.kind}
                    href={channel.href}
                    target={channel.href.startsWith("https:") ? "_blank" : undefined}
                    rel={channel.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                    className={`${CtaClasses("line")} min-w-0 justify-start overflow-hidden`}
                  >
                    <ContactIcon kind={channel.kind} />
                    <span className="min-w-0">
                      <span className="block truncate">{channel.label}</span>
                      <span
                        className="mt-0.5 block truncate text-[11px] text-mute"
                        dir={channel.kind === "phone" || channel.kind === "whatsapp" ? "ltr" : undefined}
                      >
                        {channel.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <StatePanel className="mt-4" title="فرم تماس آنلاین فعال نیست" tone="info">
                تا زمانی که Transport واقعی پیام در قرارداد live فعال نشده، این صفحه موفقیت ساختگی
                برای ارسال فرم نشان نمی‌دهد.
              </StatePanel>
            </section>

            <aside
              id="store-location"
              className="scroll-mt-24 rounded-2xl border border-hairline bg-carbon p-6 md:p-8"
              aria-labelledby="store-location-heading"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-signal text-obsidian">
                  <MapPin size={21} aria-hidden="true" />
                </span>
                <div>
                  <p className="tech text-mute">PHYSICAL STORE</p>
                  <h2 id="store-location-heading" className="mt-1 text-lg font-bold text-bone">
                    اطلاعات عمومی فروشگاه
                  </h2>
                </div>
              </div>

              <dl className="mt-7 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">شهر</dt>
                  <dd className="font-semibold text-bone">{control.contact.city}</dd>
                </div>
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">استان</dt>
                  <dd className="font-semibold text-bone">{control.contact.province}</dd>
                </div>
                <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                  <dt className="text-mute">محل فروشگاه</dt>
                  <dd className="text-end font-semibold text-bone">{control.contact.locationLabel}</dd>
                </div>
              </dl>

              <div className="mt-7 rounded-xl border border-hairline bg-obsidian p-4">
                <div className="flex items-start gap-3">
                  <MessageCircleMore
                    size={18}
                    className="mt-1 shrink-0 text-signal"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-7 text-metal">
                    شماره واحد و ساعت کاری تا زمانی که به‌صورت عمومی تأیید نشوند در سایت حدس زده
                    نمی‌شوند.
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
