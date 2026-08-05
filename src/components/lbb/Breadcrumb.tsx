import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export type Crumb = { label: string; href?: string } & Partial<Pick<LinkProps, "to" | "params">>;

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav dir="rtl" aria-label="مسیر صفحه" className="min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ol className="tech flex min-w-max items-center gap-2 whitespace-nowrap text-mute">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const to = (item.to ?? item.href) as LinkProps["to"];
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {to && !last ? (
                <Link
                  to={to}
                  params={item.params}
                  className="inline-flex min-h-11 items-center transition-colors hover:text-signal"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="inline-flex min-h-11 items-center text-bone"
                >
                  {item.label}
                </span>
              )}
              {!last ? <ChevronLeft aria-hidden="true" size={12} className="text-mute" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
