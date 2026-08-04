import { cn } from "@/lib/utils";

/**
 * Lightweight inline LBB monogram.
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
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="shrink-0 rounded-xl"
        style={{ width: size, height: size }}
      >
        <rect width="64" height="64" rx="14" fill="var(--lbb-signal)" />
        <text
          x="32"
          y="39"
          textAnchor="middle"
          fill="var(--lbb-bone)"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize="20"
          fontWeight="900"
          letterSpacing="-2"
        >
          LBB
        </text>
        <path d="M13 49h38" stroke="var(--lbb-bone)" strokeWidth="2" opacity="0.7" />
      </svg>
      {withWordmark ? (
        <span className="text-[15px] font-black leading-none tracking-tight text-bone">
          ال‌بی‌بی
        </span>
      ) : null}
    </span>
  );
}
