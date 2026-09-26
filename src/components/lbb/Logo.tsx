import { cn } from "@/lib/utils";

/** Client supplied identity, shared by header and footer. */
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
        src="/brand/lbb-logo.jpeg"
        alt=""
        width={size}
        height={size}
        decoding="async"
        className="shrink-0 rounded-lg object-cover"
        style={{ width: size, height: size }}
      />
      {withWordmark ? <span className="sr-only">ال‌بی‌بی</span> : null}
    </span>
  );
}
