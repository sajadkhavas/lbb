import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export type Crumb = { label: string } & Partial<Pick<LinkProps, "to" | "params">>;

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav dir="rtl" aria-label="مسیر صفحه" className="tech text-mute">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`} className="flex items-center gap-2">
              {it.to && !last ? (
                <Link
                  to={it.to}
                  params={it.params}
                  className="transition-colors hover:text-signal"
                >
                  {it.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-bone">
                  {it.label}
                </span>
              )}
              {!last && <ChevronLeft aria-hidden="true" size={12} className="text-mute" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
