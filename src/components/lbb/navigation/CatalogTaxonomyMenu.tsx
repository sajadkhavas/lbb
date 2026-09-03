import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, LockKeyhole } from "lucide-react";
import {
  CATALOG_NAVIGATION,
  RETAINED_CURRENT_CATEGORY_NAVIGATION,
  catalogNavigationGroup,
  type CatalogTaxonomyNode,
} from "@/lib/catalog-taxonomy";

function nodeLabels(nodes: readonly CatalogTaxonomyNode[] | undefined) {
  if (!nodes?.length) return [];

  return nodes.map((node) => {
    if (!node.children?.length) return node.label;

    return `${node.label}: ${node.children.map((child) => child.label).join("، ")}`;
  });
}

export function CatalogTaxonomyMenu({
  pathname = "",
  onNavigate,
  compact = false,
}: {
  pathname?: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <div>
      <div
        className={compact ? "mt-3 grid gap-2" : "mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3"}
      >
        {CATALOG_NAVIGATION.map((entry, index) => {
          const group = catalogNavigationGroup(entry);

          if (!group) return null;

          const active = entry.currentRoute !== undefined && pathname === `/${entry.currentRoute}`;

          const labels =
            group.strategy === "filter-first" ? (group.filters ?? []) : nodeLabels(group.children);

          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="num text-[10px] text-mute">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h4 className={`mt-1 text-lg font-black ${active ? "text-signal" : "text-bone"}`}>
                    {group.label}
                  </h4>

                  {group.latin ? (
                    <span className="tech mt-1 block text-mute">{group.latin}</span>
                  ) : null}
                </div>

                {entry.availability === "planned" ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline px-2 py-1 text-[10px] text-mute">
                    <LockKeyhole size={11} aria-hidden="true" />
                    به‌زودی
                  </span>
                ) : entry.availability === "partial" ? (
                  <span className="shrink-0 rounded-full border border-signal/40 px-2 py-1 text-[10px] text-signal">
                    بخشی فعال
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-hairline px-2 py-1 text-[10px] text-metal">
                    فعال
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-hairline-soft bg-carbon-2 px-2.5 py-1 text-[10px] leading-5 text-metal"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-[11px] leading-6 text-mute">{entry.note}</p>

              {entry.currentRoute && entry.ctaLabel ? (
                <span className="mt-4 inline-flex min-h-10 items-center gap-2 text-xs font-black text-signal">
                  {entry.ctaLabel}
                  <ArrowUpLeft size={14} aria-hidden="true" />
                </span>
              ) : null}
            </>
          );

          if (entry.currentRoute && entry.ctaLabel) {
            return (
              <Link
                key={entry.groupSlug}
                to="/$category"
                params={{
                  category: entry.currentRoute,
                }}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className="group min-w-0 rounded-2xl border border-hairline bg-carbon p-4 transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {content}
              </Link>
            );
          }

          return (
            <article
              key={entry.groupSlug}
              aria-disabled="true"
              className="min-w-0 rounded-2xl border border-hairline-soft bg-carbon/70 p-4"
            >
              {content}
            </article>
          );
        })}
      </div>

      <div className="mt-3 border-t border-hairline pt-3">
        {RETAINED_CURRENT_CATEGORY_NAVIGATION.map((item) => {
          const active = pathname === `/${item.route}`;

          return (
            <Link
              key={item.route}
              to="/$category"
              params={{
                category: item.route,
              }}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-hairline-soft px-4 transition-colors hover:border-signal"
            >
              <span>
                <span className={`text-sm font-black ${active ? "text-signal" : "text-bone"}`}>
                  {item.label}
                </span>
                <span className="tech mr-2 text-mute">{item.latin}</span>
              </span>

              <span className="text-[10px] text-mute">{item.note}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
