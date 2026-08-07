import { createFileRoute } from "@tanstack/react-router";
import { AtSign, Instagram, Mail, MapPin, MessageCircleMore, Phone } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { BRAND } from "@/lib/brand";
import {
  STORE_SETTINGS,
  getPublicContactChannels,
  getPublicStoreLocation,
  type ContactChannelKind,
} from "@/lib/store-settings";
import { pageMeta, canonical, absUrl, breadcrumbLd } from "@/lib/site";

const publicLocation = getPublicStoreLocation();
const publicContacts = getPublicContactChannels();
const publicSocialUrls = publicContacts
  .filter((channel) => channel.kind === "instagram" || channel.kind === "whatsapp")
  .map((channel) => channel.href);

const TITLE = publicLocation
  ? `تماس با LBB | ${publicLocation.venue} ${publicLocation.city}`
  : "تماس با LBB";
const DESC = publicLocation
  ? `راه‌های ارتباط تأییدشده با LBB و اطلاعات عمومی فروشگاه در ${publicLocation.venue} ${publicLocation.city}.`
  : "راه‌های ارتباط عمومی و تأییدشده با LBB؛ اطلاعات تأییدنشده در این صفحه نمایش داده نمی‌شوند.";

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
    ...(publicLocation
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: publicLocation.city,
            addressRegion: publicLocation.province,
            addressCountry: publicLocation.countryCode,
          },
        }
      : {}),
    ...(publicSocialUrls.length > 0 ? { sameAs: publicSocialUrls } : {}),
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

function ContactIcon({ kind }: { kind: ContactChannelKind }) {
  if (kind === "instagram") return <Instagram size={18} aria-hidden="true" />;
  if (kind === "email") return <Mail size={18} aria-hidden="true" />;
  if (kind === "phone") return <Phone size={18} aria-hidden="true" />;
  if (kind === "whatsapp") return <MessageCircleMore size={18} aria-hidden="true" />;
  return <AtSign size={18} aria-hidden="true" />;
}

function ContactPage() {
  const location = getPublicStoreLocation(STORE_SETTINGS);
  const contacts = getPublicContactChannels(STORE_SETTINGS);
  const hasPendingContact = STORE_SETTINGS.contacts.some(
    (channel) => channel.isPublic && channel.verification === "pending",
  );

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16 text-bone">
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
                ارتباط با LBB
              </h1>
              <p className="text-lede mt-5 max-w-[58ch]">
                فقط راه‌های ارتباطی و اطلاعات مکانی که در Store Settings عمومی و تأیید شده‌اند در
                این صفحه نمایش داده می‌شوند.
              </p>
              <p className="mt-5 max-w-[64ch] text-sm leading-8 text-metal">
                شماره واحد، طبقه، نشانی کامل، کدپستی، تلفن، ایمیل یا ساعت کاری تا زمانی که تأیید
                عمومی نداشته باشند نمایش داده نمی‌شوند.
              </p>

              {contacts.length > 0 ? (
                <div
                  className="mt-8 grid gap-3 sm:grid-cols-2"
                  aria-label="راه‌های ارتباطی تأییدشده"
                >
                  {contacts.map((channel) => (
                    <a
                      key={`${channel.kind}-${channel.value}`}
                      href={channel.href}
                      target={channel.href.startsWith("https:") ? "_blank" : undefined}
                      rel={channel.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                      className={`${CtaClasses("line")} min-w-0 justify-start overflow-hidden`}
                    >
                      <ContactIcon kind={channel.kind} />
                      <span className="truncate">{channel.label}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <StatePanel
                  className="mt-8"
                  title={
                    hasPendingContact
                      ? "راه ارتباطی عمومی در حال بررسی است"
                      : "راه ارتباطی عمومی هنوز منتشر نشده است"
                  }
                  tone={hasPendingContact ? "warning" : "info"}
                >
                  تا زمانی که یک کانال هم عمومی و هم تأییدشده نباشد، لینک تماس ساختگی در این صفحه
                  نمایش داده نمی‌شود.
                </StatePanel>
              )}

              <StatePanel className="mt-4" title="فرم تماس آنلاین فعال نیست" tone="info">
                این فرانت‌اند در حال حاضر Transport تأییدشده‌ای برای ارسال فرم پشتیبانی ندارد؛ به
                همین دلیل فرمی که بتواند پیام «ارسال شد» بدون تحویل واقعی نشان دهد ارائه نمی‌شود.
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

              {location ? (
                <dl className="mt-7 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                    <dt className="text-mute">شهر</dt>
                    <dd className="font-semibold text-bone">{location.city}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                    <dt className="text-mute">محل فروشگاه</dt>
                    <dd className="text-end font-semibold text-bone">{location.venue}</dd>
                  </div>
                  {location.floor ? (
                    <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                      <dt className="text-mute">طبقه</dt>
                      <dd className="font-semibold text-bone">{location.floor}</dd>
                    </div>
                  ) : null}
                  {location.unit ? (
                    <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                      <dt className="text-mute">واحد</dt>
                      <dd className="font-semibold text-bone">{location.unit}</dd>
                    </div>
                  ) : null}
                  {location.addressLine ? (
                    <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                      <dt className="text-mute">نشانی</dt>
                      <dd className="max-w-[26ch] text-end font-semibold text-bone">
                        {location.addressLine}
                      </dd>
                    </div>
                  ) : null}
                  {location.postalCode ? (
                    <div className="flex items-start justify-between gap-5 border-b border-hairline pb-4">
                      <dt className="text-mute">کدپستی</dt>
                      <dd className="font-semibold text-bone" dir="ltr">
                        {location.postalCode}
                      </dd>
                    </div>
                  ) : null}
                  {location.openingHours.length > 0 ? (
                    <div className="flex items-start justify-between gap-5">
                      <dt className="text-mute">ساعت کاری</dt>
                      <dd className="text-end font-semibold text-bone">
                        <ul className="space-y-1">
                          {location.openingHours.map((hours) => (
                            <li key={hours}>{hours}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <StatePanel className="mt-7" title="مکان عمومی منتشر نشده است" tone="info">
                  تا تأیید عمومی موقعیت، نشانی یا جزئیات مراجعه نمایش داده نمی‌شود.
                </StatePanel>
              )}

              {location &&
              !location.floor &&
              !location.unit &&
              !location.addressLine &&
              location.openingHours.length === 0 ? (
                <div className="mt-7 rounded-xl border border-hairline bg-obsidian p-4">
                  <div className="flex items-start gap-3">
                    <MessageCircleMore
                      size={18}
                      className="mt-1 shrink-0 text-signal"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-7 text-metal">
                      جزئیات تکمیلی مراجعه هنوز عمومی نشده‌اند. این صفحه از روی نام مجتمع، شماره
                      واحد یا ساعت کاری حدس نمی‌زند.
                    </p>
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </Shell>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
