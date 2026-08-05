import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/lbb/ui/primitives";

type GlobalPageStateKind = "loading" | "empty" | "error" | "not-found";

const COPY: Record<GlobalPageStateKind, { label: string; icon: typeof Inbox }> = {
  loading: { label: "LOADING", icon: LoaderCircle },
  empty: { label: "EMPTY STATE", icon: Inbox },
  error: { label: "APPLICATION ERROR", icon: AlertTriangle },
  "not-found": { label: "PAGE NOT FOUND", icon: AlertTriangle },
};

export function GlobalPageState({
  kind,
  title,
  body,
  action,
  className,
}: {
  kind: GlobalPageStateKind;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  const { label, icon: Icon } = COPY[kind];
  return (
    <section
      aria-busy={kind === "loading" ? "true" : undefined}
      aria-live={kind === "loading" ? "polite" : undefined}
      className={cn(
        "grid min-h-[70svh] place-items-center bg-obsidian px-4 py-16 text-bone",
        className,
      )}
    >
      <div className="w-full max-w-lg border border-hairline bg-carbon p-6 text-center shadow-raised md:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center border border-hairline text-signal">
          <Icon
            size={24}
            aria-hidden="true"
            className={kind === "loading" ? "animate-spin" : undefined}
          />
        </span>
        <div className="mt-5">
          <TechLabel tone="signal">{label}</TechLabel>
        </div>
        <h1 className="mt-3 text-display-3">{title}</h1>
        <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-8 text-metal">{body}</p>
        {action ? <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div> : null}
      </div>
    </section>
  );
}
