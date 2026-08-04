import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* =========================================================================
   LBB primitives — every page composes these instead of ad-hoc markup.
   ========================================================================= */

/** Max-width page container with responsive gutters. */
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

/** Full-bleed editorial band with consistent vertical rhythm. */
export function Band({
  children,
  className,
  hairline = true,
  id,
  label,
}: {
  children: ReactNode;
  className?: string;
  hairline?: boolean;
  id?: string;
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative lbb-rhythm", hairline && "hairline-t", className)}
    >
      {children}
    </section>
  );
}

/** Latin technical label, e.g. `LBB / DROP 001 / TEHRAN`. */
export function TechLabel({
  children,
  className,
  tone = "metal",
}: {
  children: ReactNode;
  className?: string;
  tone?: "metal" | "signal" | "bone";
}) {
  return (
    <span
      className={cn(
        "tech",
        tone === "signal" && "text-signal",
        tone === "metal" && "text-metal",
        tone === "bone" && "text-bone",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section header: index mark + technical label + editorial heading. */
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
  const H = level === 2 ? "h2" : "h3";
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
        <H className="text-display-2 min-w-0 text-bone">{title}</H>
        {action}
      </div>
      {lede && <p className="text-lede max-w-[54ch]">{lede}</p>}
    </div>
  );
}

/** Hairline rule with an optional technical caption. */
export function Rule({ caption, className }: { caption?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="h-px flex-1 bg-hairline" />
      {caption && <TechLabel>{caption}</TechLabel>}
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

/** Fixed-ratio image frame: zero CLS, slow hover zoom, skeleton ground. */
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

const CTA_BASE =
  "inline-flex items-center justify-center gap-2 tap-target px-6 text-xs font-bold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-[220ms] ease-[var(--ease-lbb)] active:translate-y-px disabled:pointer-events-none disabled:opacity-40";

/** Signal-red primary action. Use sparingly — one per view where possible. */
export function CtaClasses(variant: "signal" | "bone" | "ghost" | "line" = "signal") {
  switch (variant) {
    case "bone":
      return cn(CTA_BASE, "bg-bone text-obsidian hover:bg-signal hover:text-obsidian");
    case "ghost":
      return cn(CTA_BASE, "bg-transparent text-bone hover:bg-carbon-2");
    case "line":
      return cn(
        CTA_BASE,
        "border border-hairline bg-transparent text-bone hover:border-signal hover:text-signal",
      );
    default:
      return cn(CTA_BASE, "bg-signal text-obsidian hover:bg-bone hover:text-obsidian");
  }
}

/** Availability / status pill built from real product state. */
export function StatusTag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "signal" | "neutral" | "out" | "bone";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tech inline-flex items-center gap-1.5 px-2 py-1 leading-none",
        tone === "signal" && "bg-signal text-obsidian",
        tone === "bone" && "bg-bone text-obsidian",
        tone === "out" && "border border-hairline bg-obsidian/80 text-mute",
        tone === "neutral" && "border border-hairline bg-obsidian/80 text-bone",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Loading skeleton block. */
export function Skeleton({ className, ratio }: { className?: string; ratio?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer bg-carbon", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    />
  );
}

/** Product-grid loading state. */
export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="در حال بارگذاری محصولات"
      className="grid grid-cols-2 gap-px bg-hairline md:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-obsidian p-px">
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

/** Designed empty state. */
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

/** Honest, clearly-labelled demo notice for unconnected backend flows. */
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

/** Visually hidden text that stays available to screen readers. */
export function SrOnly({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
