import { useState, type FormEvent } from "react";
import { CheckCircle2, KeyRound, Loader2, Smartphone } from "lucide-react";
import {
  backendErrorMessage,
  requestOtp,
  verifyOtp,
  type CustomerDto,
} from "@/lib/backend-api";
import { CtaClasses, StatePanel, TechLabel } from "@/components/lbb/ui/primitives";

type Props = {
  onAuthenticated: (customer: CustomerDto) => void;
  title?: string;
  description?: string;
};

export function CustomerOtpAuth({
  onAuthenticated,
  title = "ورود با شماره موبایل",
  description = "برای تأیید قیمت، موجودی و سفارش باید نشست مشتری معتبر Backend ایجاد شود.",
}: Props) {
  const [mobile, setMobile] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mobile.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const response = await requestOtp(mobile.trim());
      setChallengeId(response.data.challengeId);
      setSent(true);
    } catch (cause) {
      setChallengeId(null);
      setSent(false);
      setError(backendErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!challengeId || !code.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const response = await verifyOtp({
        mobile: mobile.trim(),
        challengeId,
        code: code.trim(),
      });
      onAuthenticated(response.data.user);
    } catch (cause) {
      setError(backendErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="border border-hairline bg-carbon p-5 md:p-6" aria-labelledby="customer-auth-title">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center border border-hairline text-signal">
          {sent ? <KeyRound size={18} aria-hidden="true" /> : <Smartphone size={18} aria-hidden="true" />}
        </div>
        <div>
          <TechLabel tone="signal">CUSTOMER SESSION</TechLabel>
          <h2 id="customer-auth-title" className="mt-2 text-xl font-semibold text-bone">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-metal">{description}</p>
        </div>
      </div>

      {!challengeId ? (
        <form onSubmit={requestCode} className="mt-6 grid gap-3">
          <label htmlFor="customer-mobile" className="text-xs font-semibold text-metal">
            شماره موبایل
          </label>
          <input
            id="customer-mobile"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            placeholder="0912…"
            className="min-h-12 border border-hairline bg-obsidian px-4 text-left text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
          />
          <button type="submit" disabled={busy || !mobile.trim()} className={`${CtaClasses("signal")} disabled:opacity-50`}>
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            دریافت کد ورود
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-6 grid gap-3">
          <div className="flex items-center gap-2 text-xs text-metal">
            <CheckCircle2 size={15} className="text-signal" aria-hidden="true" />
            کد برای شماره واردشده درخواست شد.
          </div>
          <label htmlFor="customer-otp" className="text-xs font-semibold text-metal">
            کد یک‌بارمصرف
          </label>
          <input
            id="customer-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            dir="ltr"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-12 border border-hairline bg-obsidian px-4 text-center num text-lg tracking-[0.35em] text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
          />
          <button type="submit" disabled={busy || !code.trim()} className={`${CtaClasses("signal")} disabled:opacity-50`}>
            {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
            تأیید و ورود
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setChallengeId(null);
              setCode("");
              setSent(false);
              setError(null);
            }}
            className="min-h-11 text-xs text-metal underline underline-offset-4 hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            تغییر شماره
          </button>
        </form>
      )}

      {error ? (
        <div className="mt-4">
          <StatePanel title="ورود انجام نشد" tone="warning">
            {error}
          </StatePanel>
        </div>
      ) : null}
    </section>
  );
}
