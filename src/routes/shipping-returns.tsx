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
import { isLiveBackend, type DeliveryMethod } from "@/lib/backend-api";
import {
  getDeliveryOptions,
  type DeliveryOptionDto,
  type DeliveryOptionsDto,
} from "@/lib/backend-delivery";
import { contentParagraphs, resolveOptionalStorefrontPage } from "@/lib/content-page";
import { pageMeta, canonical, breadcrumbLd, ROBOTS } from "@/lib/site";
import { useStorefrontControl, type ReturnsPolicyControl } from "@/lib/storefront-control";

const TITLE = "ارسال، تعویض و مرجوعی | LBB";
const DESC = "روش‌های ارسال LBB و شرایط تعویض و مرجوعی سفارش‌ها را پیش از خرید بررسی کنید.";

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
            immediateTehran.feeNotice || "ارسال فوری برای مقصدهای تحت پوشش نمایش داده می‌شود.",
          deliveryTimeLabel: immediateTehran.eta.label,
        }
      : null,
    tipax?.enabled && tipax.policyEligible
      ? {
          id: "tipax",
          title: "تیپاکس",
          description: tipax.feeNotice || "این روش بر اساس مقصد و شرایط سفارش نمایش داده می‌شود.",
          deliveryTimeLabel: tipax.eta.label,
        }
      : null,
    decapost?.enabled && decapost.policyEligible
      ? {
          id: "decapost",
          title: "دکاپست",
          description:
            decapost.feeNotice || "این روش بر اساس مقصد و شرایط سفارش نمایش داده می‌شود.",
          deliveryTimeLabel: decapost.eta.label,
        }
      : null,
  ];

  return cards.filter((card): card is ShippingCard => card !== null);
}

function ShippingState({ cards, live }: { cards: ShippingCard[] | null; live: boolean }) {
  if (!live) {
    return (
      <StatePanel title="روش‌های ارسال در حالت نمونه نمایش عملیاتی ندارند" tone="info">
        روش‌های قابل انتخاب بر اساس مقصد و شرایط سفارش نمایش داده می‌شوند.
      </StatePanel>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <StatePanel title="روش ارسال عمومی در دسترس نیست" tone="warning">
        در حال حاضر روش ارسال قابل انتخابی برای این مقصد وجود ندارد؛ سایت روش یا هزینه‌ای حدس
        نمی‌زند.
      </StatePanel>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((method) => (
        <article key={method.id} className="rounded-2xl border border-hairline bg-carbon p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="tech text-signal">روش ارسال</p>
              <h3 className="mt-2 text-base font-bold text-bone">{method.title}</h3>
            </div>
            <StatusTag tone="success">فعال</StatusTag>
          </div>
          <p className="mt-3 text-sm leading-7 text-metal">{method.description}</p>
          {method.deliveryTimeLabel ? (
            <dl className="mt-5 text-sm">
              <div className="flex items-start justify-between gap-4 border-t border-hairline pt-3">
                <dt className="text-mute">بازه تحویل</dt>
                <dd className="text-end font-semibold text-bone">{method.deliveryTimeLabel}</dd>
              </div>
            </dl>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function ReturnsState({ policy, live }: { policy: ReturnsPolicyControl; live: boolean }) {
  if (!live) {
    return (
      <StatePanel title="سیاست مرجوعی در حالت نمونه مرجع تجاری نیست" tone="info">
        فقط سیاست رسمی و تأییدشده فروشگاه در این صفحه نمایش داده می‌شود.
      </StatePanel>
    );
  }

  const published = policy.enabled && policy.verification === "verified";
  if (!published) {
    return (
      <StatePanel
        title={
          policy.verification === "pending"
            ? "سیاست مرجوعی در حال بررسی است"
            : "سیاست مرجوعی و تعویض هنوز منتشر نشده است"
        }
        tone={policy.verification === "pending" ? "warning" : "info"}
      >
        تا زمان تأیید و انتشار سیاست مرجوعی، مهلت، هزینه یا تعهدی برای مرجوعی اعلام نمی‌شود.
      </StatePanel>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-carbon p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-bone">سیاست تأییدشده فروشگاه</h3>
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
            {policy.exchangeEnabled ? "فعال" : "غیرفعال"}
          </dd>
        </div>
        {policy.returnWindowDays !== null ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">مهلت درخواست</dt>
            <dd className="mt-1 font-semibold text-bone">
              {policy.returnWindowDays.toLocaleString("fa-IR")} روز
            </dd>
          </div>
        ) : null}
        {policy.refundTimeLabel ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">زمان بازپرداخت</dt>
            <dd className="mt-1 font-semibold text-bone">{policy.refundTimeLabel}</dd>
          </div>
        ) : null}
        {policy.customerPaysReturnShipping !== null ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">هزینه ارسال برگشت</dt>
            <dd className="mt-1 font-semibold text-bone">
              {policy.customerPaysReturnShipping ? "بر عهده مشتری" : "بر عهده فروشگاه"}
            </dd>
          </div>
        ) : null}
        {policy.quickIssueNoticeHours !== null ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">اعلام سریع مغایرت/ایراد</dt>
            <dd className="mt-1 font-semibold text-bone">
              تا {policy.quickIssueNoticeHours.toLocaleString("fa-IR")} ساعت
            </dd>
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
      <TechLabel tone="signal">سیاست رسمی فروشگاه</TechLabel>
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
  const { source, policies } = useStorefrontControl();
  const live = source === "live";
  const shippingPublished = live && Boolean(shippingCards?.length);
  const returnsPublished =
    live && policies.returns.enabled && policies.returns.verification === "verified";

  return (
    <>
      <Navbar />
      <main
        dir="rtl"
        className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16"
        data-storefront-source={source}
      >
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb
              items={[{ label: "خانه", href: "/" }, { label: page?.title || "ارسال و مرجوعی" }]}
            />
          </Shell>
        </div>

        <header className="mx-auto max-w-[980px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">ارسال و مرجوعی</TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">
            {page?.title || "ارسال، تعویض و مرجوعی"}
          </h1>
          <p className="mt-4 max-w-[70ch] text-sm leading-8 text-metal">
            {page?.excerpt ||
              "روش‌های ارسال و سیاست مرجوعی بر اساس اطلاعات رسمی فروشگاه نمایش داده می‌شوند."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <StatusTag tone={shippingPublished ? "success" : "neutral"}>
              ارسال: {shippingPublished ? "فعال" : "بدون روش عمومی"}
            </StatusTag>
            <StatusTag tone={returnsPublished ? "success" : "warning"}>
              مرجوعی: {returnsPublished ? "منتشرشده" : "منتشرنشده/در حال بررسی"}
            </StatusTag>
          </div>
        </header>

        <div className="mx-auto max-w-[980px] space-y-10 px-4 pb-16 md:px-8">
          {page ? <ManagedPolicy content={page.content} /> : null}

          <section aria-labelledby="shipping-title">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-signal text-obsidian">
                <Truck size={19} aria-hidden="true" />
              </span>
              <div>
                <TechLabel tone="signal">روش‌های ارسال</TechLabel>
                <h2 id="shipping-title" className="mt-1 text-xl font-bold text-bone">
                  روش‌های ارسال
                </h2>
              </div>
            </div>
            <ShippingState cards={shippingCards} live={live} />
          </section>

          <section aria-labelledby="returns-title">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-carbon text-signal">
                <RotateCcw size={19} aria-hidden="true" />
              </span>
              <div>
                <TechLabel tone="signal">سیاست مرجوعی</TechLabel>
                <h2 id="returns-title" className="mt-1 text-xl font-bold text-bone">
                  تعویض و مرجوعی
                </h2>
              </div>
            </div>
            <ReturnsState policy={policies.returns} live={live} />
          </section>

          {!page && live ? (
            <StatePanel title="جزئیات کامل سیاست هنوز منتشر نشده است" tone="info">
              وضعیت روش‌های ارسال از تنظیمات فروشگاه خوانده می‌شود؛ جزئیات کامل سیاست‌ها پس از
              انتشار نسخه رسمی این مسیر نمایش داده خواهد شد.
            </StatePanel>
          ) : null}

          <div className="flex flex-wrap gap-3 border-t border-hairline pt-8">
            <Link to="/terms" className={CtaClasses("line")}>
              شرایط استفاده
            </Link>
            <Link to="/contact" className={CtaClasses("signal")}>
              پشتیبانی
              <ArrowUpLeft size={16} aria-hidden="true" />
            </Link>
            <Link to="/shop" className={CtaClasses("line")}>
              بازگشت به فروشگاه
              <RefreshCcw size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
