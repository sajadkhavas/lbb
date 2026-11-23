import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  currentPushSubscription,
  getPushState,
  initializePush,
  subscribeToPush,
  unsubscribeFromPush,
  type PushState,
} from "@/lib/push-notifications";

const TOPICS = ["product_updates", "editorial"] as const;

export function PushOptIn() {
  const [state, setState] = useState<PushState>("not-configured");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    void initializePush()
      .then(async () => {
        if (mounted) setState(getPushState(await currentPushSubscription()));
      })
      .catch(() => {
        if (mounted) setState("not-configured");
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (state === "unsupported") return null;

  if (state === "not-configured") {
    return (
      <p className="mt-5 text-xs text-metal" role="status">
        اعلان‌های فروشگاه هنوز آمادهٔ فعال‌سازی نیستند.
      </p>
    );
  }

  const toggle = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (state === "subscribed") {
        await unsubscribeFromPush([...TOPICS]);
        setState("available");
        setMessage("اعلان‌های این دستگاه غیرفعال شد.");
      } else {
        await subscribeToPush([...TOPICS]);
        setState("subscribed");
        setMessage("اعلان‌های محصولات و مطالب فروشگاه فعال شد.");
      }
    } catch {
      setState(getPushState(await currentPushSubscription()));
      setMessage("تغییر وضعیت اعلان انجام نشد. تنظیمات مرورگر و اتصال اینترنت را بررسی کنید.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5 border-t border-hairline pt-5 text-xs text-metal">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={busy || state === "denied"}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline px-3 transition-colors hover:border-signal disabled:opacity-60"
      >
        <Bell size={16} aria-hidden="true" />
        {state === "subscribed" ? "غیرفعال‌کردن اعلان‌ها" : "فعال‌کردن اعلان‌های فروشگاه"}
      </button>
      {state === "denied" ? <p className="mt-2">دسترسی اعلان در تنظیمات مرورگر بسته است.</p> : null}
      {message ? (
        <p className="mt-2" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
