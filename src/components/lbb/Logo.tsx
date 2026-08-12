import { cn } from "@/lib/utils";

/**
 * Persian client wordmark, kept as live text for crisp rendering at every size.
 *
 * Keeping the mark in the component removes the 1 MB preview-only Lovable
 * asset dependency and guarantees that the brand renders in every deployment.
 */
export function Logo({
  size = 34,
  className,
  withWordmark = false,
}: {
  size?: number;
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center rounded-[14px] bg-signal font-display font-black leading-none text-white shadow-[inset_0_-3px_0_rgba(0,0,0,.14)]"
        style={{ width: size, height: size, fontSize: Math.max(11, size * 0.32) }}
      >
        ال‌بی‌بی
      </span>
      {withWordmark ? (
        <span className="text-[15px] font-black leading-none tracking-tight text-bone">
          ال‌بی‌بی
        </span>
      ) : null}
    </span>
  );
}
