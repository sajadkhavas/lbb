import logoAsset from "@/assets/brand/lbb-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

/**
 * Official LBB brand mark (red canvas, Persian «ال‌بی‌بی» wordmark).
 * Cropped to a square via object-fit so it reads at every size.
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
      <img
        src={logoAsset.url}
        alt="LBB — ال‌بی‌بی"
        width={size}
        height={size}
        className="shrink-0 rounded-xl object-cover"
        style={{ width: size, height: size }}
      />
      {withWordmark ? (
        <span className="text-[15px] font-black leading-none tracking-tight text-bone">
          ال‌بی‌بی
        </span>
      ) : null}
    </span>
  );
}
