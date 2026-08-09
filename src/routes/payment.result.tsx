import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { CtaClasses, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";
import {
  backendErrorMessage,
  isLiveBackend,
  verifyPayment,
  type PaymentVerificationDto,
} from "@/lib/backend-api";
import { ensureBackendCsrf } from "@/lib/backend-session";
import { canonical, pageMeta } from "@/lib/site";

const TITLE = "نتیجه پرداخت | LBB";

export const Route = createFileRoute("/payment/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    Authority: typeof search.Authority === "string" ? search.Authority : undefined,
    Status: typeof search.Status === "string" ? search.Status : undefined,
  }),
  head: () => ({
    meta: pageMeta({
      title: TITLE,
      description: "تأیید نتیجه پرداخت LBB از طریق Backend.",
      path: "/payment/result",
      noindex: true,
    }),
    links: canonical("/payment/result"),
  }),
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const search = Route.useSearch();
  const [result, setResult] = useState<PaymentVerificationDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLiveBackend()) {
      setError("تأیید پرداخت فقط در حالت Backend live فعال است.");
      setLoading(false);
      return;
    }
    if (!search.Authority || !search.Status) {
      setError("پارامترهای بازگشت درگاه کامل نیستند؛ پرداخت موفق تلقی نشد.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await ensureBackendCsrf();
        const response = await verifyPayment(search.Authority!, search.Status!);
        if (!cancelled) setResult(response.data);
      } catch (cause) {
        if (!cancelled) setError(backendErrorMessage(cause));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search.Authority, search.Status]);

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen bg-obsidian px-4 pb-28 pt-24 md:px-6">
        <div className="mx-auto w-full max-w-[720px]">
          <TechLabel tone="signal">PAYMENT / SERVER VERIFY</TechLabel>
          <h1 className="mt-3 text-display-2 text-bone">نتیجه پرداخت</h1>
          {loading ? (
            <p className="mt-8 flex items-center gap-2 text-sm text-metal" role="status">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              در حال Verify نتیجه با Backend…
            </p>
          ) : result?.verified ? (
            <div className="mt-8 space-y-5">
              <StatePanel title="پرداخت توسط Backend تأیید شد" tone="success">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={17} aria-hidden="true" />
                  سفارش {result.order.number} با وضعیت «{result.order.paymentStatusLabel}» ثبت شده است.
                </span>
              </StatePanel>
              <Link to="/account" className={CtaClasses("signal")}>مشاهده سفارش</Link>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              <StatePanel title="پرداخت تأیید نشد" tone="warning">
                <span className="inline-flex items-center gap-2">
                  <XCircle size={17} aria-hidden="true" />
                  {error ?? "Backend این بازگشت را پرداخت موفق تشخیص نداد."}
                </span>
              </StatePanel>
              <p className="text-sm leading-7 text-metal">بازگشت مرورگر به‌تنهایی Success محسوب نمی‌شود؛ تنها پاسخ Verify سمت Backend ملاک است.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/account" className={CtaClasses("line")}>سفارش‌های من</Link>
                <Link to="/contact" className={CtaClasses("line")}>پشتیبانی</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
