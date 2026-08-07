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
  getPublicShippingMethods,
  type VerificationState,
} from "@/lib/store-settings";
import { fmtToman } from "@/lib/products";
import { pageMeta, canonical, breadcrumbLd } from "@/lib/site";

const TITLE = "ارسال، تعویض و مرجوعی | LBB";
const DESC =
  "وضعیت عمومی و تأییدشده ارسال، تعویض، مرجوعی و بازپرداخت LBB؛ جزئیات تأییدنشده نمایش داده نمی‌شوند.";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/shipping-returns" }),
    links: canonical("/shipping-returns"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbLd([
            { name: "خانه", path: "/" },
            { name: "ارسال و مرجوعی", path: "/shipping-returns" },
          ]),
        ),
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function VerificationBadge({ state }: { state: VerificationState }) {
  if (state === "verified") return <StatusTag tone="success">تأییدشده</StatusTag>;
  if (state === "pending") return <StatusTag tone="warning">در حال بررسی</StatusTag>;
  return <StatusTag tone="neutral">منتشر نشده</StatusTag>;
}

function ShippingState() {
  const { shipping } = STORE_SETTINGS;
  const methods = getPublicShippingMethods();

  if (methods.length === 0) {
    const pending = shipping.verification === "pending";
    return (
      <StatePanel
        title={pending ? "تنظیمات ارسال در حال بررسی است" : "روش ارسال عمومی هنوز منتشر نشده است"}
        tone={pending ? "warning" : "info"}
      >
        {pending
          ? "تا پایان بررسی، هیچ روش، هزینه، آستانهٔ ارسال رایگان، محدوده یا بازهٔ تحویل به‌عنوان اطلاعات عمومی نمایش داده نمی‌شود."
          : "در وضعیت فعلی هیچ مبلغ، وعدهٔ ارسال رایگان، شرکت حمل‌ونقل یا زمان تحویلی از طرف LBB در این صفحه اعلام نمی‌شود."}
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
            {method.freeFromToman !== null ? (
              <div className="flex items-start justify-between gap-4 border-t border-hairline pt-3">
                <dt className="text-mute">ارسال رایگان از</dt>
                <dd className="font-semibold text-bone">{fmtToman(method.freeFromToman)}</dd>
              </div>
            ) : null}
            {method.processingTimeLabel ? (
              <div className="flex items-start justify-between gap-4 border-t border-hairline pt-3">
                <dt className="text-mute">آماده‌سازی</dt>
                <dd className="text-end font-semibold text-bone">{method.processingTimeLabel}</dd>
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
  const { returns, legal } = STORE_SETTINGS;
  const published = canPublishReturns();

  if (!published) {
    const pending = returns.verification === "pending";
    return (
      <StatePanel
        title={
          pending ? "سیاست بازگشت در حال بررسی است" : "سیاست مرجوعی و تعویض هنوز منتشر نشده است"
        }
        tone={pending ? "warning" : "info"}
      >
        مهلت درخواست، امکان تعویض، مسئول هزینهٔ بازگشت، کالاهای مستثنا و زمان بازپرداخت تا زمانی که
        سیاست هم تأیید و هم منتشر نشود نمایش داده نمی‌شوند. از وضعیت فعلی هیچ «مهلت بازگشت» یا ضمانت
        عمومی استنباط نکنید.
      </StatePanel>
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
        {returns.customerPaysReturnShipping !== null ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">هزینهٔ ارسال بازگشت</dt>
            <dd className="mt-1 font-semibold text-bone">
              {returns.customerPaysReturnShipping ? "بر عهده مشتری" : "بر عهده فروشگاه"}
            </dd>
          </div>
        ) : null}
        {legal.lastReviewedAt ? (
          <div className="border-t border-hairline pt-3">
            <dt className="text-mute">آخرین بازبینی</dt>
            <dd className="mt-1 font-semibold text-bone" dir="ltr">
              {legal.lastReviewedAt}
            </dd>
          </div>
        ) : null}
      </dl>
      {returns.excludedCategories.length > 0 ? (
        <div className="mt-5 border-t border-hairline pt-4">
          <p className="text-sm font-semibold text-bone">موارد مستثنا</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-7 text-metal">
            {returns.excludedCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ShippingReturnsPage() {
  const { shipping, returns } = STORE_SETTINGS;

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "ارسال و مرجوعی" }]} />
          </Shell>
        </div>

        <header className="mx-auto max-w-[880px] px-4 py-10 md:px-8 md:py-14">
          <TechLabel tone="signal">TRUST / SHIPPING / RETURNS</TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">ارسال، تعویض و مرجوعی</h1>
          <p className="mt-4 max-w-[66ch] text-sm leading-8 text-metal">
            این صفحه فقط اطلاعاتی را عمومی می‌کند که در تنظیمات فروشگاه تأیید شده و برای نمایش فعال
            باشند. نبودن یک عدد یا روش به معنی مقدار پیش‌فرض یا وعدهٔ ضمنی نیست.
          </p>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="وضعیت سیاست‌ها">
            <span className="inline-flex items-center gap-2">
              <span className="text-xs text-mute">ارسال</span>
              <VerificationBadge state={shipping.verification} />
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-xs text-mute">مرجوعی</span>
              <VerificationBadge state={returns.verification} />
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-[880px] space-y-12 px-4 pb-16 md:px-8">
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
                  روش، هزینه و زمان فقط از رکوردهای فعال و تأییدشده نمایش داده می‌شوند.
                </p>
              </div>
            </div>
            <ShippingState />
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
                  فعال بودن مرجوعی به‌تنهایی دربارهٔ تعویض یا بازپرداخت ادعایی ایجاد نمی‌کند.
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
                  این تعریف‌ها برای شفافیت رابط هستند و به‌تنهایی سیاست فروشگاه محسوب نمی‌شوند.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-2xl border border-hairline bg-carbon p-5">
                <h3 className="font-bold text-bone">تعویض</h3>
                <p className="mt-2 text-sm leading-7 text-metal">
                  جایگزین شدن کالای برگشتی با کالای دیگر، فقط در صورتی که سیاست منتشرشده آن را مجاز
                  بداند.
                </p>
              </article>
              <article className="rounded-2xl border border-hairline bg-carbon p-5">
                <h3 className="font-bold text-bone">مرجوعی</h3>
                <p className="mt-2 text-sm leading-7 text-metal">
                  درخواست بازگرداندن کالا بر اساس شرایطی که باید جداگانه تأیید و منتشر شده باشند.
                </p>
              </article>
              <article className="rounded-2xl border border-hairline bg-carbon p-5">
                <h3 className="font-bold text-bone">بازپرداخت</h3>
                <p className="mt-2 text-sm leading-7 text-metal">
                  بازگشت وجه پس از یک فرایند معتبر مالی؛ زمان آن فقط در صورت وجود سیاست تأییدشده
                  نمایش داده می‌شود.
                </p>
              </article>
            </div>
          </section>

          <section
            className="rounded-2xl border border-hairline bg-carbon p-6"
            aria-labelledby="help-heading"
          >
            <h2 id="help-heading" className="text-lg font-bold text-bone">
              پیش از اقدام، اطلاعات منتشرشده را بررسی کنید
            </h2>
            <p className="mt-3 max-w-[66ch] text-sm leading-7 text-metal">
              برای چارچوب استفاده از سایت، حریم خصوصی و راه ارتباطی تأییدشده از صفحات زیر استفاده
              کنید. این صفحه جای اطلاعات تأییدنشده را با مقدار فرضی پر نمی‌کند.
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
