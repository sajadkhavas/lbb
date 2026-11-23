import { LoaderCircle } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* =========================================================================
   LBB Design System 2.0 primitives
   Components expose semantic states; pages must not recreate them ad hoc.
   ========================================================================= */

export function Shell({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return <Tag className={cn("lbb-shell", className)}>{children}</Tag>;
}

export function Band({
  children,
  className,
  hairline = true,
  id,
  label,
  major = false,
}: {
  children: ReactNode;
  className?: string;
  hairline?: boolean;
  id?: string;
  label?: string;
  major?: boolean;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        "relative",
        major ? "lbb-section-major" : "lbb-rhythm",
        hairline && "hairline-t",
        className,
      )}
    >
      {children}
    </section>
  );
}

type SurfaceTone = "canvas" | "subtle" | "raised" | "elevated" | "inverse" | "signal";

export function Surface({
  as: Tag = "div",
  tone = "subtle",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "aside";
  tone?: SurfaceTone;
}) {
  return (
    <Tag
      className={cn(
        "border",
        tone === "canvas" && "border-hairline bg-obsidian text-bone",
        tone === "subtle" && "border-hairline bg-carbon text-bone",
        tone === "raised" && "border-hairline bg-carbon-2 text-bone shadow-raised",
        tone === "elevated" && "border-hairline-strong bg-graphite text-bone shadow-overlay",
        tone === "inverse" && "border-hairline-ink bg-bone text-obsidian",
        tone === "signal" && "border-signal bg-signal text-obsidian",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function TechLabel({
  children,
  className,
  tone = "metal",
}: {
  children: ReactNode;
  className?: string;
  tone?: "metal" | "signal" | "bone" | "inverse";
}) {
  return (
    <span
      className={cn(
        "tech",
        tone === "signal" && "text-signal",
        tone === "metal" && "text-metal",
        tone === "bone" && "text-bone",
        tone === "inverse" && "text-obsidian",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHead({
  index,
  label,
  title,
  lede,
  action,
  className,
  level = 2,
}: {
  index?: string;
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  className?: string;
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {(index || label) && (
        <div className="flex items-center gap-3">
          {index && <TechLabel tone="signal">{index}</TechLabel>}
          {index && label && <span aria-hidden="true" className="h-px w-8 bg-hairline" />}
          {label && <TechLabel>{label}</TechLabel>}
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <Heading className="text-display-2 min-w-0 text-bone">{title}</Heading>
        {action}
      </div>
      {lede && <p className="text-lede">{lede}</p>}
    </div>
  );
}

export function Rule({ caption, className }: { caption?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-hairline" />
      {caption && <TechLabel>{caption}</TechLabel>}
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

export function Frame({
  src,
  alt,
  ratio = "4/5",
  className,
  imgClassName,
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
  zoom = true,
  children,
  width = 1200,
  height = 1500,
}: {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  zoom?: boolean;
  children?: ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-carbon", className)}
      style={{ aspectRatio: ratio }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          zoom && "frame-zoom",
          imgClassName,
        )}
      />
      {children}
    </div>
  );
}

export type CtaVariant = "signal" | "bone" | "ghost" | "line" | "danger";
export type CtaSize = "sm" | "md" | "lg";

const CTA_BASE =
  "inline-flex items-center justify-center gap-2 tap-target font-bold transition-[background-color,color,border-color,transform,box-shadow] ease-[var(--ease-lbb-standard)] active:translate-y-px disabled:pointer-events-none disabled:opacity-40 aria-busy:cursor-wait";

const CTA_SIZE: Record<CtaSize, string> = {
  sm: "min-h-11 px-4 text-[11px] tracking-[0.1em]",
  md: "min-h-11 px-6 text-xs tracking-[0.12em]",
  lg: "min-h-12 px-8 text-sm tracking-[0.1em]",
};

export function CtaClasses(variant: CtaVariant = "signal", size: CtaSize = "md") {
  const variantClass =
    variant === "bone"
      ? "border border-bone bg-bone text-obsidian hover:border-signal hover:bg-signal"
      : variant === "ghost"
        ? "border border-transparent bg-transparent text-bone hover:border-hairline hover:bg-carbon-2"
        : variant === "line"
          ? "border border-hairline-strong bg-transparent text-bone hover:border-signal hover:text-signal"
          : variant === "danger"
            ? "border border-danger bg-danger text-obsidian hover:border-bone hover:bg-bone"
            : "border border-signal bg-signal text-obsidian hover:border-bone hover:bg-bone";

  return cn(CTA_BASE, CTA_SIZE[size], variantClass);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CtaVariant;
  size?: CtaSize;
  loading?: boolean;
  loadingLabel?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "signal",
    size = "md",
    loading = false,
    loadingLabel = "در حال انجام",
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(CtaClasses(variant, size), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : null}
      <span>{loading ? loadingLabel : children}</span>
    </button>
  );
});

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    pressed?: boolean;
    size?: "md" | "lg";
  }
>(function IconButton(
  { label, pressed, size = "md", className, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "grid place-items-center border border-hairline bg-carbon text-bone transition-colors hover:border-signal hover:text-signal disabled:pointer-events-none disabled:opacity-40",
        size === "md" ? "h-11 w-11" : "h-12 w-12",
        pressed && "border-signal bg-signal text-obsidian",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export function ChoiceChip({
  selected,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "min-h-11 border px-4 text-xs font-semibold transition-colors",
        selected
          ? "border-signal bg-signal text-obsidian"
          : "border-hairline bg-carbon text-bone hover:border-hairline-strong",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusTag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "signal" | "neutral" | "out" | "bone" | "success" | "warning" | "info";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tech inline-flex items-center gap-1.5 border px-2 py-1 leading-none",
        tone === "signal" && "border-signal bg-signal text-obsidian",
        tone === "bone" && "border-bone bg-bone text-obsidian",
        tone === "success" && "border-success/50 bg-success/10 text-success",
        tone === "warning" && "border-warning/50 bg-warning/10 text-warning",
        tone === "info" && "border-info/50 bg-info/10 text-info",
        tone === "out" && "border-hairline bg-obsidian/80 text-mute",
        tone === "neutral" && "border-hairline bg-obsidian/80 text-bone",
        className,
      )}
    >
      {children}
    </span>
  );
}

type StateTone = "neutral" | "success" | "warning" | "danger" | "info";

export function StatePanel({
  title,
  children,
  tone = "neutral",
  action,
  className,
}: {
  title: string;
  children: ReactNode;
  tone?: StateTone;
  action?: ReactNode;
  className?: string;
}) {
  const role = tone === "danger" ? "alert" : "status";
  return (
    <div
      role={role}
      className={cn(
        "border p-5",
        tone === "neutral" && "border-hairline bg-carbon",
        tone === "success" && "border-success/50 bg-success/[0.07]",
        tone === "warning" && "border-warning/50 bg-warning/[0.07]",
        tone === "danger" && "border-danger/50 bg-danger/[0.07]",
        tone === "info" && "border-info/50 bg-info/[0.07]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-bone">{title}</p>
          <div className="mt-2 text-xs leading-6 text-metal">{children}</div>
        </div>
        {action}
      </div>
    </div>
  );
}

export function FieldMessage({
  id,
  tone = "help",
  children,
}: {
  id?: string;
  tone?: "help" | "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "mt-2 text-xs leading-6",
        tone === "help" && "text-mute",
        tone === "error" && "font-semibold text-danger",
        tone === "success" && "font-semibold text-success",
      )}
    >
      {children}
    </p>
  );
}

export function Skeleton({ className, ratio }: { className?: string; ratio?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer bg-carbon", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری محصولات"
      className="grid grid-cols-2 gap-px bg-hairline md:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-obsidian p-px">
          <Skeleton ratio="4/5" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 border border-hairline bg-carbon px-6 py-20 text-center",
        className,
      )}
    >
      {icon && <span className="text-mute">{icon}</span>}
      <p className="text-display-3 text-bone">{title}</p>
      {body && <p className="max-w-[42ch] text-sm leading-7 text-metal">{body}</p>}
      {action}
    </div>
  );
}

export function DemoNotice({
  title = "حالت نمایشی",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="note" className={cn("border border-signal/50 bg-signal/[0.07] p-4", className)}>
      <p className="flex items-center gap-2">
        <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-signal" />
        <span className="text-xs font-bold text-bone">{title}</span>
      </p>
      <div className="mt-2 text-xs leading-6 text-metal">{children}</div>
    </div>
  );
}

export function SrOnly({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
