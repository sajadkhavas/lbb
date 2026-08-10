import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Download, Smartphone } from "lucide-react";
import { Navbar } from "@/components/lbb/Navbar";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import {
  currentPushSubscription,
  getPushState,
  subscribeToPush,
  unsubscribeFromPush,
  type PushPreference,
  type PushState,
} from "@/lib/push-notifications";

export const Route = createFileRoute("/app")({ component: AppPage });

function AppPage() {
  const [state, setState] = useState<PushState>("unsupported");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preferences, setPreferences] = useState<PushPreference[]>(["product_updates"]);
  useEffect(() => {
    void currentPushSubscription().then((subscription) => setState(getPushState(subscription)));
  }, []);
  const toggle = (preference: PushPreference) =>
    setPreferences((items) =>
      items.includes(preference)
        ? items.filter((item) => item !== preference)
        : [...items, preference],
    );
  const changeSubscription = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (state === "subscribed") {
        await unsubscribeFromPush(preferences);
        setState(getPushState(null));
        setMessage("اعلان‌ها غیرفعال شدند.");
      } else {
        const subscription = await subscribeToPush(preferences);
        setState(getPushState(subscription));
        setMessage("اعلان‌ها فعال شدند.");
      }
    } catch (error) {
      setState(getPushState(await currentPushSubscription()));
      setMessage(
        error instanceof Error && error.message === "PUSH_NOT_CONFIGURED"
          ? "اتصال امن اعلان‌ها پس از آماده شدن Backend فعال می‌شود."
          : "فعال‌سازی انجام نشد؛ تنظیمات مرورگر و اتصال را بررسی کنید.",
      );
    } finally {
      setBusy(false);
    }
  };
  const status =
    state === "subscribed"
      ? "فعال"
      : state === "denied"
        ? "مسدودشده در مرورگر"
        : state === "not-configured"
          ? "در انتظار اتصال Backend"
          : state === "unsupported"
            ? "پشتیبانی‌نشده"
            : "غیرفعال";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian px-4 pb-24 pt-28 text-bone">
        <div className="mx-auto max-w-3xl">
          <p className="tech text-signal">LBB / WEB APP</p>
          <h1 className="mt-4 text-display-1">وب‌اپ و اعلان‌ها</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-metal">
            LBB را روی دستگاه نصب کنید و انتخاب کنید چه اعلان‌هایی دریافت شوند. اجازه اعلان فقط بعد
            از فشردن دکمه فعال‌سازی درخواست می‌شود.
          </p>
          <section className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-hairline bg-carbon p-6">
              <Smartphone className="text-signal" aria-hidden="true" />
              <h2 className="mt-4 text-xl">نصب روی دستگاه</h2>
              <p className="mt-3 text-sm leading-7 text-metal">
                از گزینه Install در مرورگر یا Add to Home Screen در iOS استفاده کنید.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs text-bone">
                <Download size={16} aria-hidden="true" />
                بدون نصب از فروشگاه اپ
              </span>
            </article>
            <article className="rounded-2xl border border-hairline bg-carbon p-6">
              <Bell className="text-signal" aria-hidden="true" />
              <h2 className="mt-4 text-xl">اعلان‌های وب</h2>
              <p className="mt-3 text-sm text-metal">
                وضعیت: <strong className="text-bone">{status}</strong>
              </p>
              <fieldset
                className="mt-5 space-y-3"
                disabled={
                  busy ||
                  state === "subscribed" ||
                  state === "unsupported" ||
                  state === "denied" ||
                  state === "not-configured"
                }
              >
                <legend className="sr-only">نوع اعلان‌ها</legend>
                {[
                  ["product_updates", "به‌روزرسانی محصولات"],
                  ["editorial", "محتوای تازه ژورنال"],
                ].map(([value, label]) => (
                  <label key={value} className="flex min-h-11 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={preferences.includes(value as PushPreference)}
                      onChange={() => toggle(value as PushPreference)}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              {state === "subscribed" ? (
                <p className="mt-3 text-xs leading-6 text-metal">
                  برای تغییر نوع اعلان‌ها، ابتدا اعلان‌ها را غیرفعال و سپس با انتخاب جدید فعال کنید.
                </p>
              ) : null}
              <button
                type="button"
                disabled={
                  busy ||
                  state === "unsupported" ||
                  state === "denied" ||
                  state === "not-configured" ||
                  preferences.length === 0
                }
                onClick={() => void changeSubscription()}
                className="mt-5 min-h-11 rounded-lg bg-signal px-5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                {busy
                  ? "در حال انجام…"
                  : state === "subscribed"
                    ? "غیرفعال‌کردن اعلان‌ها"
                    : "فعال‌کردن اعلان‌ها"}
              </button>
              {message ? (
                <p role="status" className="mt-3 text-xs leading-6 text-metal">
                  {message}
                </p>
              ) : null}
            </article>
          </section>
          <p className="mt-6 rounded-xl border border-hairline p-4 text-xs leading-7 text-metal">
            اعلان آزمایشی یا سفارش ساختگی نمایش داده نمی‌شود. ارسال اعلان فقط پس از اتصال امن
            Backend، احراز هویت و ثبت subscription واقعی انجام خواهد شد.
          </p>
        </div>
      </main>
      <Footer theme="dark" />
      <MobileBottomBar />
    </>
  );
}
