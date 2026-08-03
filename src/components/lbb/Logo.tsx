import { cn } from "@/lib/utils";

const LOGO_SRC = "/brand/lbb-logo.svg";

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
        src={LOGO_SRC}
        alt={withWordmark ? "" : "LBB"}
        width={size}
        height={size}
        decoding="async"
        className="shrink-0 rounded-xl"
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
