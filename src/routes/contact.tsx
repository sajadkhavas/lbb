import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock3,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { backendErrorMessage, isLiveBackend } from "@/lib/backend-api";
import { contentParagraphs } from "@/lib/content-page";
import { submitContactInquiry } from "@/lib/final-technical-api";
import { pageMeta, canonical, absUrl, breadcrumbLd } from "@/lib/site";
import { resolveStorefrontControl, resolveStorefrontPage } from "@/lib/storefront-control";

const FALLBACK_TITLE = "تماس با LBB";
const FALLBACK_DESC = "راه‌های ارتباط عمومی و تأییدشده با LBB و اطلاعات فروشگاه حضوری در کرج.";

type ContactKind = "instagram" | "phone" | "whatsapp" | "email";

function ContactIcon({ kind }: { kind: ContactKind }) {
  if (kind === "instagram") return <Instagram size={18} aria-hidden="true" />;
  if (kind === "phone") return <Phone size={18} aria-hidden="true" />;
  if (kind === "email") return <Mail size={18} aria-hidden="true" />;
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

    const prototypeTitle = `تماس با LBB | ${control.brand.physicalLocation} ${control.contact.city}`;
    const title =
      page?.metaTitle ||
      page?.title ||
      (control.source === "prototype" ? prototypeTitle : FALLBACK_TITLE);
    const description = page?.metaDescription || page?.excerpt || FALLBACK_DESC;
    const sameAs = [
      control.contact.instagramUrl,
      `https://wa.me/98${control.contact.whatsapp.replace(/\D/g, "").replace(/^0/, "")}`,
    ];
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
        email: control.contact.email || undefined,
        address: {
          "@type": "PostalAddress",
          streetAddress: control.contact.addressLine || undefined,
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
  const pageParagraphs = contentParagraphs(page?.content ?? null);
  const contacts: Array<{ kind: ContactKind; label: string; value: string; href: string }> = [
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
    ...(control.contact.email
      ? [
          {
            kind: "email" as const,
            label: "ایمیل",
            value: control.contact.email,
            href: `mailto:${control.contact.email}`,
          },
        ]
      : []),
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
              {pageParagraphs.length > 0 ? (
                <div className="mt-5 max-w-[62ch] space-y-3 text-sm leading-8 text-metal">
                  {pageParagraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="راه‌های ارتباطی تأییدشده">
                {contacts.map((channel) => (
                  <a
                    key={channel.kind}
                    href={channel.href}
                    aria-label={
                      channel.kind === "instagram"
                        ? `اینستاگرام رسمی ${control.brand.name}`
                        : undefined
                    }
                    target={channel.href.startsWith("https:") ? "_blank" : undefined}
                    rel={channel.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                    className={`${CtaClasses("line")} min-w-0 justify-start overflow-hidden`}
                  >
                    <ContactIcon kind={channel.kind} />
                    <span className="min-w-0">
                      <span className="block truncate">{channel.label}</span>
                      <span
                        className="mt-0.5 block truncate text-[11px] text-mute"
                        dir={
                          channel.kind === "phone" ||
                          channel.kind === "whatsapp" ||
                          channel.kind === "email"
                            ? "ltr"
                            : undefined
                        }
                      >
                        {channel.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              {isLiveBackend() ? (
                <LiveContactForm />
              ) : (
                <StatePanel className="mt-6" title="فرم تماس در حالت نمونه غیرفعال است" tone="info">
                  ثبت پیام فقط در حالت live و از طریق Backend انجام می‌شود؛ موفقیت ساختگی در مرورگر
                  نمایش داده نمی‌شود.
                </StatePanel>
              )}
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
                  <dd className="text-end font-semibold text-bone">
                    {control.source === "prototype"
                      ? control.brand.physicalLocation
                      : control.contact.addressLine || control.contact.locationLabel}
                  </dd>
                </div>
              </dl>

              {control.contact.openingHours.length > 0 ? (
                <div className="mt-6 rounded-xl border border-hairline bg-obsidian p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-bone">
                    <Clock3 size={17} className="text-signal" aria-hidden="true" />
                    ساعت کاری
                  </p>
                  <ul className="mt-3 space-y-1 text-xs leading-6 text-metal">
                    {control.contact.openingHours.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {control.contact.mapUrl ? (
                <a
                  href={control.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${CtaClasses("line")} mt-5 w-full`}
                >
                  مشاهده موقعیت روی نقشه
                  <MapPin size={16} aria-hidden="true" />
                </a>
              ) : null}

              {!control.contact.addressLine && control.contact.openingHours.length === 0 ? (
                <div className="mt-7 rounded-xl border border-hairline bg-obsidian p-4">
                  <div className="flex items-start gap-3">
                    <MessageCircleMore
                      size={18}
                      className="mt-1 shrink-0 text-signal"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-7 text-metal">
                      جزئیات تکمیلی آدرس و ساعت کاری فقط پس از ثبت و انتشار از پنل نمایش داده
                      می‌شوند.
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

function LiveContactForm() {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || message.trim().length < 10 || (!mobile.trim() && !email.trim())) return;
    setBusy(true);
    setError(null);
    setReference(null);
    try {
      const response = await submitContactInquiry({
        fullName,
        mobile,
        email,
        subject,
        message,
        website,
      });
      setReference(response.data.inquiry.id);
      setSubject("");
      setMessage("");
    } catch (cause) {
      setError(backendErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-8 rounded-2xl border border-hairline bg-carbon p-5 md:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <TechLabel tone="signal">CONTACT FORM / BACKEND</TechLabel>
          <h2 className="mt-2 text-xl font-bold text-bone">ارسال پیام به LBB</h2>
        </div>
        <Send size={20} className="text-signal" aria-hidden="true" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-semibold text-metal">
          نام و نام خانوادگی
          <input
            required
            minLength={2}
            maxLength={120}
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="min-h-12 rounded-xl border border-hairline bg-obsidian px-4 text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
          />
        </label>
        <label className="grid gap-2 text-xs font-semibold text-metal">
          شماره موبایل
          <input
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            placeholder="0912…"
            className="min-h-12 rounded-xl border border-hairline bg-obsidian px-4 text-left text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
          />
        </label>
        <label className="grid gap-2 text-xs font-semibold text-metal">
          ایمیل
          <input
            type="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-h-12 rounded-xl border border-hairline bg-obsidian px-4 text-left text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
          />
        </label>
        <label className="grid gap-2 text-xs font-semibold text-metal">
          موضوع
          <input
            maxLength={220}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="min-h-12 rounded-xl border border-hairline bg-obsidian px-4 text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
          />
        </label>
      </div>
      <label className="mt-4 grid gap-2 text-xs font-semibold text-metal">
        پیام
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="rounded-xl border border-hairline bg-obsidian px-4 py-3 text-sm leading-7 text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
        />
      </label>
      <label className="sr-only" aria-hidden="true">
        وب‌سایت
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>
      <p className="mt-3 text-[11px] leading-6 text-mute">
        حداقل یکی از شماره موبایل یا ایمیل را وارد کنید. پیام مستقیماً در Backend فروشگاه ثبت
        می‌شود.
      </p>
      <button
        type="submit"
        disabled={
          busy ||
          !fullName.trim() ||
          message.trim().length < 10 ||
          (!mobile.trim() && !email.trim())
        }
        className={`${CtaClasses("signal")} mt-5 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Send size={16} aria-hidden="true" />
        )}
        {busy ? "در حال ثبت…" : "ثبت پیام"}
      </button>
      {error ? (
        <StatePanel className="mt-4" title="پیام ثبت نشد" tone="warning">
          {error}
        </StatePanel>
      ) : null}
      {reference ? (
        <StatePanel className="mt-4" title="پیام با موفقیت ثبت شد" tone="success">
          کد پیگیری داخلی درخواست:{" "}
          <span className="num" dir="ltr">
            {reference}
          </span>
        </StatePanel>
      ) : null}
    </form>
  );
}
