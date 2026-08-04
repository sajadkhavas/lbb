import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

/**
 * A crumb links either through typed router props (`to` + `params`) or through
 * a plain internal path (`href`) — both render a client-side `<Link>`.
 */
export type Crumb = { label: string; href?: string } & Partial<Pick<LinkProps, "to" | "params">>;

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav dir="rtl" aria-label="مسیر صفحه" className="tech text-mute">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const to = (it.to ?? it.href) as LinkProps["to"];
          return (
            <li key={`${it.label}-${i}`} className="flex items-center gap-2">
              {to && !last ? (
                <Link to={to} params={it.params} className="transition-colors hover:text-signal">
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
