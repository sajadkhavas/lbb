import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, RefreshCcw, RotateCcw, Truck } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import {
  CtaClasses,
  Shell,
  StatePanel,
  StatusTag,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import {
  STORE_SETTINGS,
  canPublishReturns,
  canPublishShipping,
  getPublicShippingMethods,
  type VerificationState,
} from "@/lib/store-settings";
import { isLiveBackend, type DeliveryMethod } from "@/lib/backend-api";
import {
  getDeliveryOptions,
  type DeliveryOptionDto,
  type DeliveryOptionsDto,
} from "@/lib/backend-delivery";
import { contentParagraphs, resolveOptionalStorefrontPage } from "@/lib/content-page";
import { fmtToman } from "@/lib/products";
import { pageMeta, canonical, breadcrumbLd, ROBOTS } from "@/lib/site";

const TITLE = "ارسال، تعویض و مرجوعی | LBB";
const DESC =
  "روش‌های ارسال تأییدشده LBB و وضعیت سیاست تعویض و مرجوعی؛ داده عملیاتی در حالت live از Backend خوانده می‌شود.";

type LiveDeliveryPolicy = {
  tehran: DeliveryOptionsDto;
  karaj: DeliveryOptionsDto;
  nationwide: DeliveryOptionsDto;
};

type ShippingCard = {
  id: DeliveryMethod;
  title: string;
  description: string;
  deliveryTimeLabel: string | null;
};

async function resolveLiveShippingCards(): Promise<ShippingCard[] | null> {
  if (!isLiveBackend()) return null;

  const [tehran, karaj, nationwide] = await Promise.all([
    getDeliveryOptions({ province: "تهران", city: "تهران" }),
    getDeliveryOptions({ province: "البرز", city: "کرج" }),
    getDeliveryOptions({ province: "اصفهان", city: "اصفهان" }),
  ]);

  return backendShippingCards({
    tehran: tehran.data,
    karaj: karaj.data,
    nationwide: nationwide.data,
  });
}

export const Route = createFileRoute("/shipping-returns")({
  loader: async () => {
    const [page, shippingCards] = await Promise.all([
      resolveOptionalStorefrontPage("shipping-returns"),
      resolveLiveShippingCards(),
    ]);

    return { page, shippingCards };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const title = page?.metaTitle || (page ? `${page.title} | LBB` : TITLE);
    const description = page?.metaDescription || page?.excerpt || DESC;

    return {
      meta: pageMeta({
        title,
        description,
        path: "/shipping-returns",
        robots: page ? undefined : ROBOTS.NOINDEX_FOLLOW,
      }),
      links: canonical("/shipping-returns"),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbLd([
              { name: "خانه", path: "/" },
              { name: page?.title || "ارسال و مرجوعی", path: "/shipping-returns" },
            ]),
          ),
        },
      ],
    };
  },
  component: ShippingReturnsPage,
});

function PublicationBadge({ state, published }: { state: VerificationState; published: boolean }) {
  if (published) return <StatusTag tone="success">تأیید و منتشرشده</StatusTag>;
  if (state === "pending") return <StatusTag tone="warning">در حال بررسی</StatusTag>;
  return <StatusTag tone="neutral">منتشر نشده</StatusTag>;
}

function findMethod(
  options: DeliveryOptionsDto,
  method: DeliveryMethod,
): DeliveryOptionDto | undefined {
  return options.methods.find((item) => item.method === method);
}

function backendShippingCards(delivery: LiveDeliveryPolicy): ShippingCard[] {
  const immediateTehran = findMethod(delivery.tehran, "immediate_courier");
  const immediateKaraj = findMethod(delivery.karaj, "immediate_courier");
  const tipax = findMethod(delivery.nationwide, "tipax");
  const decapost = findMethod(delivery.nationwide, "decapost");

  const cards: Array<ShippingCard | null> = [
    immediateTehran?.enabled && immediateKaraj?.enabled
      ? {
          id: "immediate_courier",
          title: "ارسال فوری — اسنپ / اسنپ‌باکس",
          description:
            immediateTehran.feeNotice ||
            "فقط برای مقصدهای تهران و کرج؛ هزینه حمل خارج از پرداخت آنلاین فروشگاه دریافت می‌شود.",
          deliveryTimeLabel: immediateTehran.eta.label,
        }
      : null,
    tipax?.enabled && tipax.policyEligible
      ? {
          id: "tipax",
          title: "تیپاکس — پس‌کرایه",
          description:
            tipax.feeNotice ||
            "ارسال سراسری؛ هزینه حمل خارج از پرداخت آنلاین فروشگاه و به‌صورت پس‌کرایه دریافت می‌شود.",
          deliveryTimeLabel: tipax.eta.label,
        }
      : null,
    decapost?.enabled && decapost.policyEligible
      ? {
          id: "decapost",
          title: "دکاپست — پس‌کرایه",
          description:
            decapost.feeNotice ||
            "ارسال سراسری؛ هزینه حمل خارج از پرداخت آنلاین فروشگاه و به‌صورت پس‌کرایه دریافت می‌شود.",
          deliveryTimeLabel: decapost.eta.label,
        }
      : null,
  ];

  return cards.filter((card): card is ShippingCard => card !== null);
}

function ShippingCards({ cards }: { cards: ShippingCard[] }) {
  if (cards.length === 0) {
    return (
      <StatePanel title="روش ارسال عمومی در دسترس نیست" tone="warning">
        Backend در حال حاضر هیچ روش فعال و مجاز قابل نمایش برنگردانده است.
      </StatePanel>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((method) => (
        <article key={method.id} className="rounded-2xl border border-hairline bg-carbon p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="tech text-signal">VERIFIED SHIPPING</p>
              <h3 className="mt-2 text-base font-bold text-bone">{method.title}</h3>
            </div>
            <StatusTag tone="success">فعال و تأییدشده</StatusTag>
          </div>
          <p className="mt-3 text-sm leading-7 text-metal">{method.description}</p>
          {method.deliveryTimeLabel ? (
            <dl className="mt-5 text-sm">
              <div className="flex items-start justify-between gap-4 border-t border-hairline pt-3">
                <dt className="text-mute">تحویل</dt>
                <dd className="text-end font-semibold text-bone">{method.deliveryTimeLabel}</dd>
              </div>
            </dl>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function ShippingState({ cards }: { cards: ShippingCard[] | null }) {
  if (cards) return <ShippingCards cards={cards} />;

  const { shipping } = STORE_SETTINGS;
  const methods = getPublicShippingMethods();

  if (methods.length === 0) {
    const pending = shipping.verification === "pending";
    return (
      <StatePanel
        title={pending ? "تنظیمات ارسال در حال بررسی است" : "روش ارسال عمومی هنوز منتشر نشده است"}
        tone={pending ? "warning" : "info"}
      >
        تا زمان تأیید، روش، هزینه، محدوده و بازه تحویل به‌عنوان اطلاعات عمومی حدس زده نمی‌شوند.
      </StatePanel>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {methods.map((method) => (
        <article key={method.id} className="rounded-2xl border border-hairline bg-carbon p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="tech text-signal">VERIFIED SHIPPING</p>
              <h3 className="mt-2 text-base font-bold text-bone">{method.title}</h3>
            </div>
            <StatusTag tone="success">فعال و تأییدشده</StatusTag>
          </div>
          {method.description ? (
            <p className="mt-3 text-sm leading-7 text-metal">{method.description}</p>
          ) : null}
          <dl className="mt-5 space-y-3 text-sm">
            {method.feeToman !== null ? (
              <div className="flex items-start justify-between gap-4 border-t border-hairline pt-3">
                <dt className="text-mute">هزینه</dt>
                <dd className="font-semibold text-bone">{fmtToman(method.feeToman)}</dd>
              </div>
            ) : null}
            {method.deliveryTimeLabel ? (
              <div className="flex items-start justify-between gap-4 border-t border-hairline pt-3">
                <dt className="text-mute">تحویل</dt>
                <dd className="text-end font-semibold text-bone">{method.deliveryTimeLabel}</dd>
              </div>
            ) : null}
          </dl>
        </article>
      ))}
    </div>
  );
}

function ReturnsState() {
  const { returns } = STORE_SETTINGS;
  const published = canPublishReturns();

  if (!published) {
    const pending = returns.verification === "pending";
    return (
      <div className="space-y-4">
        <StatePanel
          title={
            pending ? "سیاست بازگشت در حال بررسی است" : "سیاست مرجوعی و تعویض هنوز منتشر نشده است"
          }
          tone={pending ? "warning" : "info"}
        >
          سیاست کامل مرجوعی، شرایط بازپرداخت و موارد مستثنا تا زمان انتشار از پنل به‌عنوان تعهد
          عمومی نمایش داده نمی‌شوند.
        </StatePanel>
        <StatePanel title="اعلام سریع مغایرت یا مشکل سایز" tone="info">
          LBB درخواست می‌کند مغایرت با عکس یا مشخصات، ایراد کالا یا مشکل مربوط به سایز حداکثر تا ۴۸
          ساعت پس از تحویل اطلاع داده شود تا رسیدگی سریع‌تر انجام شود. این بازه، حقوق قانونی
          مصرف‌کننده در معامله از راه دور را حذف یا محدود نمی‌کند.
        </StatePanel>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-carbon p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-bone">سیاست منتشرشده</h3>
        <StatusTag tone="success">فعال و تأییدشده</StatusTag>
      </div>
      <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
        <div className="border-t border-hairline pt-3">
          <dt className="text-mute">مرجوعی</dt>
          <dd className="mt-1 font-semibold text-bone">فعال</dd>
        </div>
        <div className="border-t border-hairline pt-3">
          <dt className="text-mute">تعویض</dt>
          <dd className="mt-1 font-semibold text-bone">
            {returns.exchangeEnabled ? "فعال" : "غیرفعال"}
          </dd>
        </div>
        {returns.returnWindowDays !== null ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">مهلت درخواست</dt>
            <dd className="mt-1 font-semibold text-bone">
              {returns.returnWindowDays.toLocaleString("fa-IR")} روز
            </dd>
          </div>
        ) : null}
        {returns.refundTimeLabel ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">زمان بازپرداخت</dt>
            <dd className="mt-1 font-semibold text-bone">{returns.refundTimeLabel}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

function ManagedPolicy({ content }: { content: string | null }) {
  const paragraphs = contentParagraphs(content);
  if (paragraphs.length === 0) return null;

  return (
    <section className="rounded-2xl border border-hairline bg-carbon p-6 md:p-8">
      <TechLabel tone="signal">ADMIN / PUBLISHED POLICY</TechLabel>
      <div className="mt-5 space-y-4 text-sm leading-8 text-metal">
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 28)}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function ShippingReturnsPage() {
  const { page, shippingCards } = Route.useLoaderData();
  const { shipping, returns } = STORE_SETTINGS;
  const shippingPublished = shippingCards ? shippingCards.length > 0 : canPublishShipping();
  const returnsPublished = canPublishReturns();

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb
              items={[{ label: "خانه", href: "/" }, { label: page?.title || "ارسال و مرجوعی" }]}
            />
          </Shell>
        </div>

        <header className="mx-auto max-w-[880px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">TRUST / SHIPPING / RETURNS</TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">
            {page?.title || "ارسال، تعویض و مرجوعی"}
          </h1>
          <p className="mt-4 max-w-[66ch] text-sm leading-8 text-metal">
            {page?.excerpt ||
              "روش‌های ارسال در حالت live از Backend خوانده می‌شوند و سیاست کامل مرجوعی تنها پس از انتشار از پنل، مرجع عمومی خواهد بود."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="وضعیت سیاست‌ها">
            <span className="inline-flex items-center gap-2">
              <span className="text-xs text-mute">ارسال</span>
              <PublicationBadge state={shipping.verification} published={shippingPublished} />
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-xs text-mute">مرجوعی</span>
              <PublicationBadge state={returns.verification} published={returnsPublished} />
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-[880px] space-y-12 px-4 pb-16 md:px-8">
          {page ? <ManagedPolicy content={page.content} /> : null}

          <section aria-labelledby="shipping-heading">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-hairline bg-carbon text-signal">
                <Truck size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 id="shipping-heading" className="text-xl font-bold text-bone">
                  ارسال و تحویل
                </h2>
                <p className="mt-1 text-sm leading-7 text-metal">
                  فقط روش‌های فعال و مجاز به‌عنوان گزینه عمومی نمایش داده می‌شوند.
                </p>
              </div>
            </div>
            <ShippingState cards={shippingCards} />
          </section>

          <section aria-labelledby="returns-heading">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-hairline bg-carbon text-signal">
                <RotateCcw size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 id="returns-heading" className="text-xl font-bold text-bone">
                  تعویض و مرجوعی
                </h2>
                <p className="mt-1 text-sm leading-7 text-metal">
                  سیاست داخلی نباید حقوق قانونی مصرف‌کننده را محدود یا جایگزین کند.
                </p>
              </div>
            </div>
            <ReturnsState />
          </section>

          <section aria-labelledby="definitions-heading">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-hairline bg-carbon text-signal">
                <RefreshCcw size={19} aria-hidden="true" />
              </span>
              <div>
                <h2 id="definitions-heading" className="text-xl font-bold text-bone">
                  تفاوت اصطلاح‌ها
                </h2>
                <p className="mt-1 text-sm leading-7 text-metal">
                  تعویض، مرجوعی و بازپرداخت فرایندهای جدا هستند و شرایط نهایی آنها باید در سیاست
                  منتشرشده مشخص باشد.
                </p>
              </div>
            </div>
          </section>

          <section
            className="rounded-2xl border border-hairline bg-carbon p-6"
            aria-labelledby="help-heading"
          >
            <h2 id="help-heading" className="text-lg font-bold text-bone">
              راهنمای تکمیلی
            </h2>
            <p className="mt-3 max-w-[66ch] text-sm leading-7 text-metal">
              برای شرایط استفاده، حریم خصوصی یا پیگیری یک مورد مشخص از صفحات زیر استفاده کنید.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/terms" className={CtaClasses("line")}>
                شرایط استفاده
                <ArrowUpLeft size={16} aria-hidden="true" />
              </Link>
              <Link to="/privacy" className={CtaClasses("line")}>
                حریم خصوصی
                <ArrowUpLeft size={16} aria-hidden="true" />
              </Link>
              <Link to="/contact" className={CtaClasses("signal")}>
                تماس و پشتیبانی
                <ArrowUpLeft size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
