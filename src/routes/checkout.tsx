import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, LockKeyhole, ReceiptText } from "lucide-react";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import { CustomerOtpAuth } from "@/components/lbb/CustomerOtpAuth";
import { CtaClasses, EmptyState, StatePanel } from "@/components/lbb/ui/primitives";
import { cartLinesToBackendItems, useCart } from "@/lib/cart";
import { fmtToman } from "@/lib/products";
import {
  STORE_SETTINGS,
  getPublicPaymentSettings,
  getPublicShippingMethods,
} from "@/lib/store-settings";
import { canonical, pageMeta } from "@/lib/site";
import {
  backendErrorMessage,
  commitCheckout,
  createCheckoutQuote,
  createIdempotencyKey,
  getCurrentCustomer,
  getOrder,
  initiatePayment,
  isAuthenticationError,
  isLiveBackend,
  type CheckoutCommitDto,
  type CheckoutQuoteDto,
  type CustomerDto,
  type DeliveryMethod,
} from "@/lib/backend-api";
import { getDeliveryOptions, type DeliveryOptionDto } from "@/lib/backend-delivery";
import { ensureBackendCsrf } from "@/lib/backend-session";
import {
  clearCheckoutCommitKey,
  clearPendingCheckoutForOrder,
  getOrCreateCheckoutCommitKey,
  persistPendingCheckout,
  readPendingCheckout,
  type PendingCheckout,
} from "@/lib/checkout-continuity";

const TITLE = "تکمیل سفارش | LBB";
const DESC = "تکمیل سفارش LBB با بررسی قیمت، موجودی، روش ارسال و پرداخت امن.";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: pageMeta({ title: TITLE, description: DESC, path: "/checkout", noindex: true }),
    links: canonical("/checkout"),
  }),
  component: Checkout,
});

function Checkout() {
  return isLiveBackend() ? <LiveCheckout /> : <PrototypeCheckout />;
}

type RecipientFieldKey = "name" | "province" | "city" | "address";
type RecipientErrors = Partial<Record<RecipientFieldKey, string>>;

function LiveCheckout() {
  const { lines, clear, hydrated } = useCart();
  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [methods, setMethods] = useState<DeliveryOptionDto[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | "">("");
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [quote, setQuote] = useState<CheckoutQuoteDto | null>(null);
  const [orderResult, setOrderResult] = useState<CheckoutCommitDto | null>(null);
  const [busy, setBusy] = useState<"quote" | "commit" | "payment" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [continuity, setContinuity] = useState<PendingCheckout | null>(null);
  const [continuityHydrated, setContinuityHydrated] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RecipientErrors>({});

  const backendItems = useMemo(() => cartLinesToBackendItems(lines), [lines]);
  const cartCompatible = backendItems.length > 0 && backendItems.length === lines.length;
  const enabledMethods = methods.filter((method) => method.enabled && method.policyEligible);
  const selectedMethod = enabledMethods.find((method) => method.method === deliveryMethod) ?? null;
  const needsAddress = deliveryMethod !== "";
  const shouldRecoverPending = lines.length === 0 && Boolean(continuity);

  const clearFieldError = (field: RecipientFieldKey) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateRecipient = () => {
    const next: RecipientErrors = {};
    if (fullName.trim().length < 2) next.name = "نام و نام خانوادگی را کامل وارد کنید.";
    if (needsAddress && !province.trim()) next.province = "استان را وارد کنید.";
    if (needsAddress && !city.trim()) next.city = "شهر را وارد کنید.";
    if (needsAddress && !address.trim()) next.address = "نشانی کامل را وارد کنید.";
    setFieldErrors(next);
    const first = (["name", "province", "city", "address"] as RecipientFieldKey[]).find(
      (field) => next[field],
    );
    if (first) {
      requestAnimationFrame(() => document.getElementById(`co-${first}`)?.focus());
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!hydrated) return;
    setContinuity(readPendingCheckout());
    setContinuityHydrated(true);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || !continuityHydrated) return;
    if (lines.length === 0 && !continuity) {
      setSessionLoading(false);
      return;
    }
    let cancelled = false;
    setSessionLoading(true);
    setSessionError(null);
    getCurrentCustomer()
      .then((response) => {
        if (cancelled) return;
        setCustomer(response.data.user);
        setFullName(response.data.user.fullName ?? "");
      })
      .catch((error) => {
        if (cancelled) return;
        if (isAuthenticationError(error)) {
          setCustomer(null);
          return;
        }
        setSessionError(backendErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setSessionLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, continuityHydrated, continuity, lines.length]);

  useEffect(() => {
    if (!continuityHydrated || !customer || !continuity || orderResult) return;
    if (!shouldRecoverPending) {
      setRecoveryLoading(false);
      setRecoveryError(null);
      return;
    }
    let cancelled = false;
    setRecoveryLoading(true);
    setRecoveryError(null);
    getOrder(continuity.orderId)
      .then((response) => {
        if (cancelled) return;
        const order = response.data.order;
        if (order.paidAt || order.cancelledAt) {
          clearPendingCheckoutForOrder(order.id);
          setContinuity(null);
          setOrderResult(null);
          return;
        }
        const paymentAvailable = continuity.paymentAvailable;
        setOrderResult({
          order,
          payment: {
            available: paymentAvailable,
            state: paymentAvailable ? "ready" : "disabled",
            initiationEndpoint: null,
          },
        });
      })
      .catch((error) => {
        if (cancelled) return;
        if (isAuthenticationError(error)) {
          setCustomer(null);
          return;
        }
        setRecoveryError(backendErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setRecoveryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [continuityHydrated, customer, continuity, orderResult, shouldRecoverPending]);

  useEffect(() => {
    if (!customer || !cartCompatible) return;
    let cancelled = false;
    setDeliveryLoading(true);
    setDeliveryError(null);
    getDeliveryOptions({ province, city, subtotalToman: 0 })
      .then((response) => {
        if (cancelled) return;
        setMethods(response.data.methods);
        const available = response.data.methods.filter(
          (method) => method.enabled && method.policyEligible,
        );
        setDeliveryMethod((current) =>
          available.some((method) => method.method === current)
            ? current
            : (available[0]?.method ?? ""),
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setMethods([]);
          setDeliveryMethod("");
          setDeliveryError(backendErrorMessage(error));
        }
      })
      .finally(() => {
        if (!cancelled) setDeliveryLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [customer, cartCompatible, province, city]);

  useEffect(() => {
    setQuote(null);
    setActionError(null);
  }, [fullName, province, city, address, postalCode, notes, deliveryMethod, lines]);

  const requestQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customer || !cartCompatible || !deliveryMethod) return;
    if (!validateRecipient()) return;
    setBusy("quote");
    setActionError(null);
    try {
      await ensureBackendCsrf();
      const response = await createCheckoutQuote({
        customer: {
          fullName: fullName.trim(),
          mobile: customer.mobile,
          province: needsAddress ? province.trim() : null,
          city: needsAddress ? city.trim() : null,
          address: needsAddress ? address.trim() : null,
          postalCode: postalCode.trim() || null,
          notes: notes.trim() || null,
        },
        deliveryMethod,
        items: backendItems,
      });
      getOrCreateCheckoutCommitKey(response.data.quoteId, () => createIdempotencyKey("checkout"));
      setQuote(response.data);
    } catch (error) {
      setQuote(null);
      setActionError(backendErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const commit = async () => {
    if (!quote) return;
    setBusy("commit");
    setActionError(null);
    try {
      await ensureBackendCsrf();
      const idempotencyKey = getOrCreateCheckoutCommitKey(quote.quoteId, () =>
        createIdempotencyKey("checkout"),
      );
      const response = await commitCheckout(quote.quoteId, idempotencyKey);
      const pending = persistPendingCheckout({
        orderId: response.data.order.id,
        orderNumber: response.data.order.number,
        paymentAvailable: response.data.payment.available,
        paymentIdempotencyKey: createIdempotencyKey("payment"),
      });
      clearCheckoutCommitKey(quote.quoteId);
      setContinuity(pending);
      setOrderResult(response.data);
      clear();
    } catch (error) {
      setActionError(backendErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const startPayment = async () => {
    if (!orderResult?.payment.available) return;
    setBusy("payment");
    setActionError(null);
    try {
      await ensureBackendCsrf();
      const persisted =
        continuity?.orderId === orderResult.order.id ? continuity : readPendingCheckout();
      const paymentIdempotencyKey =
        persisted?.orderId === orderResult.order.id
          ? persisted.paymentIdempotencyKey
          : createIdempotencyKey("payment");
      const response = await initiatePayment(orderResult.order.id, paymentIdempotencyKey);
      const redirectUrl = response.data.payment.redirectUrl;
      if (typeof redirectUrl !== "string" || !redirectUrl.startsWith("https://")) {
        throw new Error("payment_redirect_missing");
      }
      window.location.assign(redirectUrl);
    } catch (error) {
      setActionError(
        error instanceof Error && error.message === "payment_redirect_missing"
          ? "امکان اتصال به درگاه پرداخت فراهم نشد؛ دوباره تلاش کنید."
          : backendErrorMessage(error),
      );
      setBusy(null);
    }
  };

  return (
    <CheckoutChrome>
      {!hydrated ||
      !continuityHydrated ||
      sessionLoading ||
      recoveryLoading ||
      (shouldRecoverPending && customer && !orderResult && !recoveryError) ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-metal" role="status">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          در حال آماده‌کردن سفارش…
        </p>
      ) : lines.length === 0 && !orderResult && !continuity ? (
        <EmptyState
          className="mt-8"
          title="سبد خرید خالی است"
          body="برای تکمیل سفارش ابتدا یک محصول را با رنگ و سایز موردنظر به سبد اضافه کنید."
          action={
            <Link to="/shop" className={CtaClasses("signal")}>
              رفتن به فروشگاه
            </Link>
          }
        />
      ) : sessionError ? (
        <div className="mt-8">
          <StatePanel title="امکان تکمیل سفارش وجود ندارد" tone="warning">
            {sessionError}
          </StatePanel>
        </div>
      ) : shouldRecoverPending && recoveryError ? (
        <div className="mt-8 space-y-4">
          <StatePanel title="بازیابی سفارش ناتمام کامل نشد" tone="warning">
            {recoveryError}
          </StatePanel>
          <Link to="/account" className={CtaClasses("line")}>
            بررسی سفارش‌ها در حساب
          </Link>
        </div>
      ) : !customer ? (
        <div className="mt-8">
          <CustomerOtpAuth
            title="برای ادامه وارد شوید"
            description="برای تکمیل سفارش و مشاهده وضعیت خرید، وارد حساب خود شوید."
            onAuthenticated={(value) => {
              setCustomer(value);
              setFullName(value.fullName ?? "");
            }}
          />
        </div>
      ) : orderResult ? (
        <OrderCreated
          result={orderResult}
          busy={busy}
          error={actionError}
          onPayment={startPayment}
        />
      ) : (
        <form onSubmit={requestQuote} noValidate className="mt-8 space-y-6">
          {!cartCompatible ? (
            <StatePanel title="یکی از اقلام سبد نیاز به انتخاب دوباره دارد" tone="warning">
              آن کالا را از سبد حذف کنید و دوباره رنگ و سایز موردنظر را از صفحه محصول انتخاب کنید.
            </StatePanel>
          ) : null}

          <section
            className="border border-hairline bg-carbon p-5"
            aria-labelledby="checkout-items"
          >
            <h2 id="checkout-items" className="text-base font-bold text-bone">
              اقلام انتخاب‌شده
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {lines.map((line) => (
                <div
                  key={line.variantId ?? `${line.slug}-${line.size}`}
                  className="flex items-start justify-between gap-4 border-t border-hairline pt-3 first:border-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-bone">{line.name}</p>
                    <p className="mt-1 text-xs text-metal">
                      {line.colorLabel ?? line.color ?? "رنگ"} ·{" "}
                      {line.sizeLabel ?? line.size ?? "سایز"} · {line.qty.toLocaleString("fa-IR")}{" "}
                      عدد
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-mute">قیمت نهایی در مرحله بعد بررسی می‌شود</span>
                </div>
              ))}
            </div>
          </section>

          <section
            className="border border-hairline bg-carbon p-5"
            aria-labelledby="recipient-title"
          >
            <h2 id="recipient-title" className="text-lg font-bold text-bone">
              اطلاعات تحویل
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                id="co-name"
                label="نام و نام خانوادگی"
                value={fullName}
                onChange={(value) => {
                  setFullName(value);
                  clearFieldError("name");
                }}
                autoComplete="name"
                required
                error={fieldErrors.name}
              />
              <Field
                id="co-phone"
                label="شماره موبایل تأییدشده"
                value={customer.mobile}
                readOnly
                autoComplete="tel"
                dir="ltr"
              />
              <Field
                id="co-province"
                label="استان"
                value={province}
                onChange={(value) => {
                  setProvince(value);
                  clearFieldError("province");
                }}
                autoComplete="address-level1"
                required={needsAddress}
                error={fieldErrors.province}
              />
              <Field
                id="co-city"
                label="شهر"
                value={city}
                onChange={(value) => {
                  setCity(value);
                  clearFieldError("city");
                }}
                autoComplete="address-level2"
                required={needsAddress}
                error={fieldErrors.city}
              />
              {needsAddress ? (
                <div className="md:col-span-2">
                  <Field
                    id="co-address"
                    label="نشانی"
                    value={address}
                    onChange={(value) => {
                      setAddress(value);
                      clearFieldError("address");
                    }}
                    autoComplete="street-address"
                    required
                    error={fieldErrors.address}
                  />
                </div>
              ) : null}
              <Field
                id="co-postal"
                label="کدپستی (اختیاری)"
                value={postalCode}
                onChange={setPostalCode}
                autoComplete="postal-code"
                inputMode="numeric"
              />
              <Field
                id="co-notes"
                label="یادداشت سفارش (اختیاری)"
                value={notes}
                onChange={setNotes}
              />
            </div>
          </section>

          <section
            className="border border-hairline bg-carbon p-5"
            aria-labelledby="delivery-title"
          >
            <h2 id="delivery-title" className="text-lg font-bold text-bone">
              روش تحویل
            </h2>
            {deliveryLoading ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-metal">
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                در حال دریافت روش‌های ارسال…
              </p>
            ) : deliveryError ? (
              <div className="mt-4">
                <StatePanel title="روش ارسال قابل دریافت نیست" tone="warning">
                  {deliveryError}
                </StatePanel>
              </div>
            ) : enabledMethods.length === 0 ? (
              <div className="mt-4">
                <StatePanel title="روش تحویل فعالی وجود ندارد" tone="warning">
                  در حال حاضر امکان ادامه سفارش با مقصد انتخاب‌شده وجود ندارد.
                </StatePanel>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {enabledMethods.map((method) => (
                  <label
                    key={method.method}
                    className={`cursor-pointer border p-4 ${deliveryMethod === method.method ? "border-signal" : "border-hairline"}`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.method}
                      checked={deliveryMethod === method.method}
                      onChange={() => setDeliveryMethod(method.method)}
                      className="me-2"
                    />
                    <span className="font-semibold text-bone">{method.label}</span>
                    <span className="mt-2 block text-xs leading-6 text-metal">
                      {method.coverage.label}
                      {method.eta.label ? ` · ${method.eta.label}` : ""}
                    </span>
                    {method.paymentMode === "freight_collect" ? (
                      <span className="mt-1 block text-xs font-semibold leading-6 text-signal">
                        پس‌کرایه — هزینه حمل داخل مبلغ پرداخت آنلاین نیست.
                      </span>
                    ) : null}
                    {method.feeNotice ? (
                      <span className="mt-1 block text-xs leading-6 text-mute">
                        {method.feeNotice}
                      </span>
                    ) : null}
                  </label>
                ))}
              </div>
            )}
          </section>

          {quote ? (
            <ServerQuote quote={quote} method={selectedMethod} />
          ) : (
            <StatePanel title="جمع نهایی هنوز محاسبه نشده است" tone="info">
              قیمت و موجودی با دکمه «محاسبه مبلغ نهایی» دوباره بررسی می‌شوند؛ کرایه روش‌های فعال
              فروشگاه پس‌کرایه است و به مبلغ پرداخت آنلاین اضافه نمی‌شود.
            </StatePanel>
          )}

          {actionError ? (
            <StatePanel title="عملیات تکمیل نشد" tone="warning">
              {actionError}
            </StatePanel>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {!quote ? (
              <button
                type="submit"
                disabled={busy !== null || !cartCompatible || !selectedMethod}
                className={`${CtaClasses("signal")} disabled:opacity-50`}
              >
                {busy === "quote" ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <ReceiptText size={16} aria-hidden="true" />
                )}
                محاسبه مبلغ نهایی
              </button>
            ) : (
              <button
                type="button"
                onClick={commit}
                disabled={busy !== null}
                className={`${CtaClasses("signal")} disabled:opacity-50`}
              >
                {busy === "commit" ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <LockKeyhole size={16} aria-hidden="true" />
                )}
                ثبت سفارش
              </button>
            )}
            <Link to="/cart" className={CtaClasses("line")}>
              بازگشت به سبد
            </Link>
          </div>
        </form>
      )}
    </CheckoutChrome>
  );
}

function ServerQuote({
  quote,
  method,
}: {
  quote: CheckoutQuoteDto;
  method: DeliveryOptionDto | null;
}) {
  const freightCollect = method?.paymentMode === "freight_collect";

  return (
    <section className="border border-signal/60 bg-carbon p-5" aria-labelledby="server-quote-title">
      <h2 id="server-quote-title" className="text-lg font-bold text-bone">
        مبلغ نهایی سفارش
      </h2>
      <div className="mt-4 space-y-2 text-sm">
        <Row label="جمع کالاها" value={fmtToman(quote.totals.subtotal.amount)} />
        <Row
          label="هزینه ارسال"
          value={
            freightCollect
              ? "پس‌کرایه — خارج از مبلغ آنلاین"
              : fmtToman(quote.totals.deliveryFee.amount)
          }
        />
        <Row label="هزینه بسته‌بندی" value={fmtToman(quote.totals.packagingFee.amount)} />
        {quote.totals.discount.amount > 0 ? (
          <Row label="تخفیف" value={`− ${fmtToman(quote.totals.discount.amount)}`} />
        ) : null}
        <Row
          label="مبلغ قابل پرداخت آنلاین"
          value={fmtToman(quote.totals.grandTotal.amount)}
          bold
        />
      </div>
      {freightCollect ? (
        <p className="mt-3 text-xs font-semibold leading-6 text-signal">
          کرایه حمل در این مبلغ محاسبه نشده و طبق روش ارسال انتخابی به‌صورت پس‌کرایه دریافت می‌شود.
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-6 text-metal">
        این مبلغ تا {new Date(quote.expiresAt).toLocaleString("fa-IR")} معتبر است و هنگام ثبت سفارش
        دوباره بررسی می‌شود.
      </p>
    </section>
  );
}

function OrderCreated({
  result,
  busy,
  error,
  onPayment,
}: {
  result: CheckoutCommitDto;
  busy: "quote" | "commit" | "payment" | null;
  error: string | null;
  onPayment: () => void;
}) {
  return (
    <div className="mt-8 space-y-5">
      <StatePanel title={`سفارش ${result.order.number} ثبت شد`} tone="success">
        <p>مبلغ ثبت‌شده: {fmtToman(result.order.totals.grandTotal.amount)}</p>
        <p className="mt-1">وضعیت پرداخت: {result.order.paymentStatusLabel}</p>
      </StatePanel>
      {result.payment.available ? (
        <StatePanel title="درگاه پرداخت آماده است" tone="info">
          برای تکمیل خرید، پرداخت را در درگاه بانکی انجام دهید و تا بازگشت به فروشگاه صبر کنید.
        </StatePanel>
      ) : (
        <StatePanel title="درگاه پرداخت در دسترس نیست" tone="warning">
          سفارش ثبت شده اما هنوز پرداخت نشده است. کمی بعد دوباره تلاش کنید.
        </StatePanel>
      )}
      {error ? (
        <StatePanel title="پرداخت شروع نشد" tone="warning">
          {error}
        </StatePanel>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {result.payment.available ? (
          <button
            type="button"
            onClick={onPayment}
            disabled={busy !== null}
            className={`${CtaClasses("signal")} disabled:opacity-50`}
          >
            {busy === "payment" ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : null}
            رفتن به درگاه پرداخت
          </button>
        ) : null}
        <Link to="/account" className={CtaClasses("line")}>
          مشاهده سفارش‌ها
        </Link>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  readOnly,
  autoComplete,
  dir,
  inputMode,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
  inputMode?: "numeric" | "tel" | "text";
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="grid gap-2 text-xs font-semibold text-metal">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        dir={dir}
        inputMode={inputMode}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        className="min-h-12 border border-hairline bg-obsidian px-4 text-sm text-bone outline-none read-only:opacity-70 focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-semibold leading-6 text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${bold ? "border-t border-hairline pt-3 text-base font-bold text-bone" : "text-metal"}`}
    >
      <span>{label}</span>
      <span className="num text-bone">{value}</span>
    </div>
  );
}

function CheckoutChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian px-4 pb-28 pt-24 md:px-6">
        <div className="mx-auto w-full max-w-[820px]">
          <h1 className="text-display-2 text-bone">تکمیل سفارش</h1>
          <p className="mt-3 max-w-[66ch] text-sm leading-8 text-metal">
            اطلاعات تحویل را تکمیل کنید، روش ارسال را انتخاب کنید و مبلغ نهایی را پیش از ثبت سفارش
            بررسی کنید. کرایه روش‌های فعال فعلی پس‌کرایه است و داخل مبلغ آنلاین قرار نمی‌گیرد.
          </p>
          {children}
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function PrototypeCheckout() {
  const { lines, subtotal, hydrated } = useCart();
  const shippingMethods = getPublicShippingMethods();
  const payment = getPublicPaymentSettings();

  return (
    <>
      <Navbar />
      <main dir="rtl" className="min-h-screen overflow-x-clip bg-obsidian px-4 pb-28 pt-24 md:px-6">
        <div className="mx-auto w-full max-w-[760px]">
          <h1 className="text-display-2 text-bone">تکمیل سفارش</h1>
          <p className="mt-3 max-w-[62ch] text-sm leading-8 text-metal">
            وضعیت روش‌های ارسال و پرداخت فروشگاه را پیش از ادامه بررسی کنید.
          </p>

          {!hydrated ? (
            <p className="mt-8 text-sm text-metal" role="status">
              در حال خواندن سبد خرید…
            </p>
          ) : lines.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="سبد خرید خالی است"
              body="برای تکمیل سفارش ابتدا یک محصول به سبد اضافه کنید."
              action={
                <Link to="/shop" className={CtaClasses("signal")}>
                  رفتن به فروشگاه
                </Link>
              }
            />
          ) : (
            <div className="mt-8 space-y-6">
              <section
                className="rounded-2xl border border-hairline bg-carbon p-5"
                aria-labelledby="checkout-summary"
              >
                <h2 id="checkout-summary" className="text-base font-bold text-bone">
                  خلاصه اقلام
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  {lines.map((line) => (
                    <div
                      key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`}
                      className="flex min-w-0 items-start justify-between gap-4 border-t border-hairline pt-3 first:border-t-0 first:pt-0"
                    >
                      <span className="min-w-0 text-metal">
                        {line.name} × {line.qty.toLocaleString("fa-IR")}
                      </span>
                      <span className="shrink-0 font-semibold text-bone">
                        {fmtToman(line.price * line.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between gap-4 border-t border-hairline pt-4 text-base font-bold text-bone">
                    <span>جمع کالاها</span>
                    <span>{fmtToman(subtotal)}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-6 text-mute">
                  این مبلغ فقط جمع اقلام سبد است؛ کرایه ارسال پس‌کرایه است و به مبلغ آنلاین اضافه
                  نمی‌شود.
                </p>
              </section>

              {shippingMethods.length > 0 ? (
                <StatePanel title="روش‌های ارسال فروشگاه در دسترس هستند" tone="success">
                  <p>روش‌های فعال: {shippingMethods.map((method) => method.title).join("، ")}.</p>
                  <p className="mt-2">
                    روش‌های فعال فعلی پس‌کرایه‌اند و هزینه حمل جدا از مبلغ پرداخت آنلاین دریافت می‌شود.
                  </p>
                </StatePanel>
              ) : (
                <StatePanel
                  title={
                    STORE_SETTINGS.shipping.verification === "pending"
                      ? "تنظیمات ارسال در حال بررسی است"
                      : "روش ارسال فعلاً در دسترس نیست"
                  }
                  tone={STORE_SETTINGS.shipping.verification === "pending" ? "warning" : "info"}
                >
                  جزئیات ارسال پس از فعال‌شدن روش‌های قابل استفاده نمایش داده می‌شود.
                </StatePanel>
              )}

              {payment ? (
                <StatePanel title={`روش پرداخت: ${payment.displayName}`} tone="success">
                  پرداخت پس از ثبت سفارش از طریق درگاه بانکی انجام می‌شود.
                </StatePanel>
              ) : (
                <StatePanel
                  title={
                    STORE_SETTINGS.payment.verification === "pending"
                      ? "تنظیمات پرداخت در حال بررسی است"
                      : "روش پرداخت فعلاً در دسترس نیست"
                  }
                  tone={STORE_SETTINGS.payment.verification === "pending" ? "warning" : "info"}
                >
                  پس از فعال‌شدن روش پرداخت، امکان ادامه خرید از همین صفحه فراهم می‌شود.
                </StatePanel>
              )}

              <StatePanel title="تکمیل سفارش فعلاً در دسترس نیست" tone="warning">
                این نسخه هنوز امکان ثبت نهایی سفارش را ندارد. برای راهنمایی با پشتیبانی تماس بگیرید.
              </StatePanel>

              <div className="flex flex-wrap gap-3">
                <Link to="/cart" className={CtaClasses("line")}>
                  بازگشت به سبد
                </Link>
                <Link to="/shipping-returns" className={CtaClasses("line")}>
                  ارسال و مرجوعی
                </Link>
                <Link to="/contact" className={CtaClasses("signal")}>
                  تماس و پشتیبانی
                </Link>
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
