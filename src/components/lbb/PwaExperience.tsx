import { useEffect, useState } from "react";
import { Download, RefreshCw, WifiOff, X } from "lucide-react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function PwaExperience() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [offline, setOffline] = useState(false);
  const [update, setUpdate] = useState<(() => Promise<void>) | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const onInstall = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent); };
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    const onUpdate = (event: Event) => setUpdate(() => (event as CustomEvent<() => Promise<void>>).detail);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("lbb:pwa-update", onUpdate);
    return () => { window.removeEventListener("beforeinstallprompt", onInstall); window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); window.removeEventListener("lbb:pwa-update", onUpdate); };
  }, []);

  if (hidden || (!offline && !update && !installPrompt)) return null;
  const action = update ? { label: "به‌روزرسانی", icon: RefreshCw, run: () => void update(true) } : installPrompt ? { label: "نصب وب‌اپ", icon: Download, run: () => void installPrompt.prompt().then(() => setInstallPrompt(null)) } : null;

  return <aside role="status" aria-live="polite" className="fixed inset-x-3 bottom-[calc(72px+env(safe-area-inset-bottom))] z-[260] mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-hairline bg-carbon p-3 text-bone shadow-2xl md:bottom-5">
    {offline ? <WifiOff aria-hidden="true" className="shrink-0 text-signal" size={20} /> : action ? <action.icon aria-hidden="true" className="shrink-0 text-signal" size={20} /> : null}
    <p className="flex-1 text-xs leading-6">{offline ? "آفلاین هستید؛ قیمت، موجودی و حساب فقط پس از اتصال تازه می‌شوند." : update ? "نسخه جدید LBB آماده است." : "برای دسترسی سریع‌تر، LBB را به‌صورت وب‌اپ نصب کنید."}</p>
    {action ? <button type="button" onClick={action.run} className="tap-target rounded-lg bg-signal px-3 text-xs font-bold text-white">{action.label}</button> : null}
    <button type="button" aria-label="بستن پیام" onClick={() => setHidden(true)} className="tap-target grid place-items-center text-metal"><X size={18} aria-hidden="true" /></button>
  </aside>;
}
