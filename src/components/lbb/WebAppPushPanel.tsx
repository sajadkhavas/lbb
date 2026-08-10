import { useCallback, useEffect, useReducer, useState } from "react";
import { Bell, BellOff, Download, Loader2, Send, Smartphone } from "lucide-react";

import { CtaClasses, StatePanel, Surface, TechLabel } from "@/components/lbb/ui/primitives";
import {
  backendErrorMessage,
  getCurrentCustomer,
  isAuthenticationError,
  isLiveBackend,
} from "@/lib/backend-api";
import {
  getWebPushConfig,
  registerWebPushSubscription,
  revokeWebPushSubscription,
  sendWebPushTest,
  type WebPushConfig,
} from "@/lib/push-api";
import {
  canPromptWebAppInstall,
  isIosWebKitDevice,
  isStandaloneWebApp,
  promptWebAppInstall,
  subscribeWebAppInstall,
} from "@/lib/pwa";

function vapidKey(value: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  return bytes as Uint8Array<ArrayBuffer>;
}

function supportsPush() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function WebAppPushPanel() {
  const live = isLiveBackend();
  const [, refreshInstall] = useReducer((value) => value + 1, 0);
  const [config, setConfig] = useState<WebPushConfig | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [busy, setBusy] = useState<"enable" | "disable" | "test" | "install" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const standalone = isStandaloneWebApp();
  const ios = isIosWebKitDevice();
  const installPrompt = canPromptWebAppInstall();
  const permission = typeof Notification === "undefined" ? "default" : Notification.permission;

  const refreshSubscription = useCallback(async () => {
    if (!supportsPush()) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      setSubscription(await registration.pushManager.getSubscription());
    } catch {
      setSubscription(null);
    }
  }, []);

  useEffect(() => subscribeWebAppInstall(refreshInstall), []);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    Promise.allSettled([getWebPushConfig(), getCurrentCustomer()]).then(([push, customer]) => {
      if (cancelled) return;
      if (push.status === "fulfilled") setConfig(push.value.data);
      if (customer.status === "fulfilled") setAuthenticated(true);
      else if (isAuthenticationError(customer.reason)) setAuthenticated(false);
    });
    void refreshSubscription();
    return () => {
      cancelled = true;
    };
  }, [live, refreshSubscription]);

  const install = async () => {
    setBusy("install");
    setError(null);
    setMessage(null);
    try {
      const choice = await promptWebAppInstall();
      if (choice?.outcome === "accepted")
        setMessage("Web App نصب شد و از صفحه اصلی دستگاه در دسترس است.");
      else if (choice?.outcome === "dismissed")
        setMessage("نصب لغو شد؛ هر زمان خواستی دوباره می‌توانی انجامش بدهی.");
    } finally {
      setBusy(null);
    }
  };

  const enablePush = async () => {
    setBusy("enable");
    setError(null);
    setMessage(null);
    try {
      if (!live) throw new Error("اعلان واقعی فقط در حالت Backend live فعال می‌شود.");
      if (!authenticated)
        throw new Error("برای اتصال اعلان به سفارش‌های خودت ابتدا وارد حساب LBB شو.");
      if (!supportsPush()) throw new Error("این مرورگر Web Push را پشتیبانی نمی‌کند.");
      if (ios && !standalone)
        throw new Error(
          "در iPhone/iPad ابتدا سایت را به Home Screen اضافه کن، سپس از همان Web App اعلان را فعال کن.",
        );

      const currentConfig = config ?? (await getWebPushConfig()).data;
      setConfig(currentConfig);
      if (!currentConfig.enabled || !currentConfig.publicKey) {
        throw new Error("کلیدهای Web Push هنوز روی Backend production فعال نشده‌اند.");
      }

      const result = await Notification.requestPermission();
      if (result !== "granted")
        throw new Error("مجوز اعلان داده نشد. از تنظیمات مرورگر می‌توانی آن را تغییر بدهی.");

      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const created =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey(currentConfig.publicKey),
        }));

      try {
        await registerWebPushSubscription(created);
      } catch (cause) {
        if (!existing) await created.unsubscribe().catch(() => false);
        throw cause;
      }

      setSubscription(created);
      setMessage("اعلان‌های سفارش برای این دستگاه فعال شد.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : backendErrorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const disablePush = async () => {
    setBusy("disable");
    setError(null);
    setMessage(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const current = subscription ?? (await registration.pushManager.getSubscription());
      if (current) {
        if (live && authenticated) await revokeWebPushSubscription(current.endpoint);
        await current.unsubscribe();
      }
      setSubscription(null);
      setMessage("اعلان‌های این دستگاه غیرفعال شد.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : backendErrorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const testPush = async () => {
    setBusy("test");
    setError(null);
    setMessage(null);
    try {
      await sendWebPushTest();
      setMessage("اعلان آزمایشی برای دستگاه‌های فعال حساب ارسال شد.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : backendErrorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Surface tone="raised" className="p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <TechLabel tone="signal">WEB APP / INSTALL</TechLabel>
            <h2 className="mt-2 text-title text-bone">نصب LBB روی دستگاه</h2>
          </div>
          <Smartphone className="text-signal" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm leading-7 text-metal">
          نسخه Web App همان فروشگاه واقعی است و بدون نصب اپ جداگانه از Home Screen یا Desktop اجرا
          می‌شود.
        </p>
        <div className="mt-5">
          {standalone ? (
            <p className="text-sm font-semibold text-bone" role="status">
              Web App روی این دستگاه نصب/Standalone است.
            </p>
          ) : installPrompt ? (
            <button
              type="button"
              onClick={() => void install()}
              disabled={busy !== null}
              className={CtaClasses("signal")}
            >
              {busy === "install" ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Download size={16} aria-hidden="true" />
              )}
              نصب Web App
            </button>
          ) : ios ? (
            <StatePanel title="نصب در iPhone / iPad" tone="info">
              از منوی Share مرورگر Safari گزینه Add to Home Screen را بزن؛ بعد LBB را از همان آیکن
              باز کن.
            </StatePanel>
          ) : (
            <p className="text-sm leading-7 text-metal">
              اگر مرورگر نصب مستقیم را ارائه کند، دکمه نصب همین‌جا ظاهر می‌شود.
            </p>
          )}
        </div>
      </Surface>

      <Surface tone="raised" className="p-5 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <TechLabel tone="signal">WEB PUSH / ORDERS</TechLabel>
            <h2 className="mt-2 text-title text-bone">اعلان وضعیت سفارش</h2>
          </div>
          {subscription ? (
            <Bell className="text-signal" aria-hidden="true" />
          ) : (
            <BellOff className="text-metal" aria-hidden="true" />
          )}
        </div>
        <p className="mt-4 text-sm leading-7 text-metal">
          فقط بعد از اجازه خودت فعال می‌شود و تغییرات واقعی سفارش مثل تأیید پرداخت، آماده‌سازی،
          ارسال و تحویل را از Backend دریافت می‌کند.
        </p>
        <p className="mt-3 text-xs text-mute" role="status">
          وضعیت مرورگر:{" "}
          {permission === "granted"
            ? "مجاز"
            : permission === "denied"
              ? "مسدود"
              : "هنوز درخواست نشده"}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {subscription ? (
            <>
              <button
                type="button"
                onClick={() => void testPush()}
                disabled={busy !== null || !live || !authenticated}
                className={CtaClasses("line")}
              >
                {busy === "test" ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                تست اعلان
              </button>
              <button
                type="button"
                onClick={() => void disablePush()}
                disabled={busy !== null}
                className={CtaClasses("line")}
              >
                {busy === "disable" ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <BellOff size={16} aria-hidden="true" />
                )}
                غیرفعال‌سازی
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void enablePush()}
              disabled={busy !== null || permission === "denied"}
              className={CtaClasses("signal")}
            >
              {busy === "enable" ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Bell size={16} aria-hidden="true" />
              )}
              فعال‌کردن اعلان
            </button>
          )}
        </div>
        {!live ? (
          <p className="mt-4 text-xs leading-6 text-mute">
            در Prototype فقط رابط قابل بررسی است؛ subscription واقعی فقط با Backend live ثبت می‌شود.
          </p>
        ) : !authenticated ? (
          <p className="mt-4 text-xs leading-6 text-mute">
            برای اعلان سفارش، ابتدا از صفحه حساب وارد شو.
          </p>
        ) : null}
      </Surface>

      {(message || error) && (
        <div className="lg:col-span-2" aria-live="polite">
          <StatePanel
            title={error ? "عملیات کامل نشد" : "وضعیت Web App"}
            tone={error ? "warning" : "info"}
          >
            {error ?? message}
          </StatePanel>
        </div>
      )}
    </div>
  );
}
