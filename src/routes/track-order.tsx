import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Loader2, PackageSearch, Search, Truck } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CtaClasses, Shell, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import { backendErrorMessage, isLiveBackend } from "@/lib/backend-api";
import { trackPublicOrder, type PublicOrderTracking } from "@/lib/final-technical-api";
import { canonical, pageMeta } from "@/lib/site";

const TITLE = "پیگیری سفارش | LBB";
const DESC = "پیگیری امن وضعیت سفارش LBB با شماره سفارش و شماره موبایل ثبت‌شده در سفارش.";

const STATUS_LABELS: Record<string, string> = {
  awaiting_payment: "در انتظار پرداخت",
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  preparing: "در حال آماده‌سازی",
  ready: "آماده ارسال",
  dispatched: "ارسال شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
  expired: "منقضی شده",
};

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: "پرداخت نشده",
  pending: "در انتظار تأیید پرداخت",
  paid: "پرداخت شده",
  failed: "پرداخت ناموفق",
  refunded: "بازپرداخت شده",
};

function labelOf(value: string, map: Record<string, string>) {
  return map[value] ?? value.replaceAll("_", " ");
}

function faDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/track-order", noindex: true }),
    links: canonical("/track-order"),
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicOrderTracking | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderNumber.trim() || !mobile.trim() || !isLiveBackend()) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = await trackPublicOrder({ orderNumber, mobile });
      setResult(response.data);
    } catch (cause) {
      setError(backendErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian pb-28 pt-16 text-bone">
        <div className="hairline-b">
          <Shell className="py-3">
            <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "پیگیری سفارش" }]} />
          </Shell>
        </div>

        <section className="mx-auto max-w-[760px] px-4 py-14 md:px-8 md:py-20">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-hairline bg-carbon text-signal">
            <PackageSearch size={21} aria-hidden="true" />
          </span>
          <TechLabel tone="signal" className="mt-5">
            ORDER TRACKING / SERVER VERIFIED
          </TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">پیگیری وضعیت سفارش</h1>
          <p className="mt-4 max-w-[62ch] text-sm leading-8 text-metal">
            شماره سفارش و همان شماره موبایلی که هنگام ثبت سفارش وارد شده را بنویس. برای حفظ حریم
            خصوصی، این صفحه اطلاعات گیرنده، آدرس یا اقلام سفارش را نمایش نمی‌دهد.
          </p>

          {isLiveBackend() ? (
            <form
              onSubmit={submit}
              className="mt-8 rounded-2xl border border-hairline bg-carbon p-5 md:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold text-metal">
                  شماره سفارش
                  <input
                    required
                    maxLength={64}
                    autoComplete="off"
                    dir="ltr"
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value)}
                    className="min-h-12 rounded-xl border border-hairline bg-obsidian px-4 text-left num text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold text-metal">
                  شماره موبایل سفارش
                  <input
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="0912…"
                    className="min-h-12 rounded-xl border border-hairline bg-obsidian px-4 text-left num text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={busy || !orderNumber.trim() || !mobile.trim()}
                className={`${CtaClasses("signal")} mt-5 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {busy ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Search size={16} aria-hidden="true" />
                )}
                {busy ? "در حال بررسی…" : "پیگیری سفارش"}
              </button>
            </form>
          ) : (
            <StatePanel className="mt-7" title="پیگیری فقط در حالت live فعال است" tone="info">
              در حالت نمونه هیچ سفارش یا وضعیت ساختگی ایجاد نمی‌شود.
            </StatePanel>
          )}

          {error ? (
            <StatePanel className="mt-5" title="سفارش پیدا نشد یا پیگیری انجام نشد" tone="warning">
              {error}
            </StatePanel>
          ) : null}

          {result ? <TrackingResult result={result} /> : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/account" className={CtaClasses("line")}>
              حساب کاربری
            </Link>
            <Link to="/contact" className={CtaClasses("line")}>
              تماس و پشتیبانی
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function TrackingResult({ result }: { result: PublicOrderTracking }) {
  const milestones = [
    ["ثبت سفارش", result.placedAt, CheckCircle2],
    ["تأیید سفارش", result.confirmedAt, CheckCircle2],
    ["آماده‌سازی", result.preparingAt, Clock3],
    ["آماده ارسال", result.readyAt, PackageSearch],
    ["ارسال", result.dispatchedAt ?? result.shipment?.shippedAt ?? null, Truck],
    ["تحویل", result.deliveredAt ?? result.shipment?.deliveredAt ?? null, CheckCircle2],
  ] as const;

  return (
    <section
      className="mt-6 rounded-2xl border border-signal/35 bg-carbon p-5 md:p-6"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-5">
        <div>
          <TechLabel tone="signal">VERIFIED ORDER STATUS</TechLabel>
          <h2 className="mt-2 text-xl font-bold text-bone">
            سفارش{" "}
            <span className="num" dir="ltr">
              {result.orderNumber}
            </span>
          </h2>
        </div>
        <span className="rounded-full border border-signal/40 px-3 py-1.5 text-xs font-bold text-signal">
          {labelOf(result.status, STATUS_LABELS)}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-obsidian p-4">
          <dt className="text-mute">وضعیت پرداخت</dt>
          <dd className="mt-1 font-semibold text-bone">
            {labelOf(result.paymentStatus, PAYMENT_LABELS)}
          </dd>
        </div>
        <div className="rounded-xl border border-hairline bg-obsidian p-4">
          <dt className="text-mute">روش ارسال</dt>
          <dd className="mt-1 font-semibold text-bone">
            {result.deliveryMethod ?? "هنوز تعیین نشده"}
          </dd>
        </div>
        {result.shipment?.carrier || result.trackingCode || result.shipment?.trackingReference ? (
          <div className="rounded-xl border border-hairline bg-obsidian p-4 sm:col-span-2">
            <dt className="text-mute">اطلاعات رهگیری مرسوله</dt>
            <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1 font-semibold text-bone">
              {result.shipment?.carrier ? <span>{result.shipment.carrier}</span> : null}
              {result.trackingCode ? (
                <span className="num" dir="ltr">
                  {result.trackingCode}
                </span>
              ) : null}
              {result.shipment?.trackingReference ? (
                <span className="num" dir="ltr">
                  {result.shipment.trackingReference}
                </span>
              ) : null}
            </dd>
          </div>
        ) : null}
      </dl>

      <ol className="mt-6 grid gap-3" aria-label="مراحل سفارش">
        {milestones.map(([label, date, Icon]) => (
          <li
            key={label}
            className={`flex items-center gap-3 rounded-xl border p-3 ${date ? "border-signal/30 bg-signal/5" : "border-hairline bg-obsidian"}`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${date ? "bg-signal text-obsidian" : "bg-carbon-2 text-mute"}`}
            >
              <Icon size={16} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={`block text-sm font-bold ${date ? "text-bone" : "text-metal"}`}>
                {label}
              </span>
              <span className="mt-0.5 block text-[11px] text-mute">
                {faDate(date) ?? "هنوز ثبت نشده"}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
