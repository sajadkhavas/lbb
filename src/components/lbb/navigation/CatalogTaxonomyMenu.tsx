import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CATALOG_NAVIGATION,
  RETAINED_CURRENT_CATEGORY_NAVIGATION,
  catalogNavigationGroup,
  type CatalogTaxonomyNode,
} from "@/lib/catalog-taxonomy";
import { isLiveBackend } from "@/lib/backend-api";
import {
  listStorefrontCategories,
  type StorefrontCategoryDto,
} from "@/lib/final-technical-api";

function nodeLabels(nodes: readonly CatalogTaxonomyNode[] | undefined) {
  if (!nodes?.length) return [];

  return nodes.map((node) => {
    if (!node.children?.length) return node.label;

    return `${node.label}: ${node.children.map((child) => child.label).join("، ")}`;
  });
}

type LiveCategoryNode = StorefrontCategoryDto & { children: LiveCategoryNode[] };

function buildLiveTree(categories: StorefrontCategoryDto[]): LiveCategoryNode[] {
  const nodes = new Map<string, LiveCategoryNode>();
  for (const category of categories) {
    nodes.set(category.publicId, { ...category, children: [] });
  }

  const roots: LiveCategoryNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.parentPublicId ? nodes.get(node.parentPublicId) : null;
    if (parent && parent.publicId !== node.publicId) parent.children.push(node);
    else roots.push(node);
  }

  const prune = (node: LiveCategoryNode): LiveCategoryNode | null => {
    const children = node.children.map(prune).filter((value): value is LiveCategoryNode => value !== null);
    if (node.showInHeader !== true && children.length === 0) return null;
    return { ...node, children };
  };

  const sortNodes = (items: LiveCategoryNode[]): LiveCategoryNode[] =>
    [...items]
      .sort((a, b) => a.name.localeCompare(b.name, "fa"))
      .map((item) => ({ ...item, children: sortNodes(item.children) }));

  return sortNodes(roots.map(prune).filter((value): value is LiveCategoryNode => value !== null));
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
  const live = isLiveBackend();
  const [categories, setCategories] = useState<StorefrontCategoryDto[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    setFailed(false);
    void listStorefrontCategories()
      .then((items) => {
        if (!cancelled) setCategories(items);
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  const liveTree = useMemo(() => buildLiveTree(categories ?? []), [categories]);

  if (live) {
    return (
      <LiveTaxonomy
        tree={liveTree}
        loading={categories === null}
        failed={failed}
        compact={compact}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    );
  }

  return <PrototypeTaxonomy compact={compact} pathname={pathname} onNavigate={onNavigate} />;
}

function LiveTaxonomy({
  tree,
  loading,
  failed,
  compact,
  pathname,
  onNavigate,
}: {
  tree: LiveCategoryNode[];
  loading: boolean;
  failed: boolean;
  compact: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  if (loading) {
    return (
      <div className="mt-3 rounded-2xl border border-hairline bg-carbon p-5 text-sm text-metal" role="status">
        در حال دریافت دسته‌بندی‌های فروشگاه…
      </div>
    );
  }

  if (failed) {
    return (
      <div className="mt-3 rounded-2xl border border-hairline bg-carbon p-5 text-sm leading-7 text-metal">
        دسته‌بندی‌های زنده فعلاً قابل دریافت نیستند. برای جلوگیری از نمایش ساختار قدیمی، منوی نمونه جایگزین نمی‌شود.
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="mt-3 rounded-2xl border border-hairline bg-carbon p-5 text-sm leading-7 text-metal">
        هنوز دسته‌ای برای نمایش در Header از پنل مدیریت فعال نشده است.
      </div>
    );
  }

  return (
    <div className={compact ? "mt-3 grid gap-2" : "mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"}>
      {tree.map((root, index) => {
        const active = pathname === `/${root.slug}`;
        return (
          <article
            key={root.publicId}
            className={`min-w-0 rounded-2xl border bg-carbon p-4 transition-colors ${
              active ? "border-signal" : "border-hairline hover:border-signal/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                to="/$category"
                params={{ category: root.slug }}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className="group flex min-w-0 flex-1 items-start gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {root.icon ? (
                  <img
                    src={root.icon}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-xl border border-hairline bg-white object-contain p-1.5"
                  />
                ) : (
                  <span className="num grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-hairline text-[10px] text-mute">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="min-w-0">
                  <span className={`block text-base font-black transition-colors group-hover:text-signal ${active ? "text-signal" : "text-bone"}`}>
                    {root.name}
                  </span>
                  {root.description ? (
                    <span className="mt-1 line-clamp-2 block text-[11px] leading-6 text-mute">
                      {root.description}
                    </span>
                  ) : null}
                </span>
              </Link>
              <ArrowUpLeft size={15} className="mt-1 shrink-0 text-mute" aria-hidden="true" />
            </div>

            {root.children.length > 0 ? (
              <ul className="mt-4 grid gap-2 border-t border-hairline-soft pt-3">
                {root.children.map((child) => (
                  <li key={child.publicId}>
                    <Link
                      to="/$category"
                      params={{ category: child.slug }}
                      onClick={onNavigate}
                      className={`flex min-h-10 items-center justify-between gap-3 rounded-lg px-2 text-xs font-bold transition-colors hover:bg-carbon-2 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                        pathname === `/${child.slug}` ? "text-signal" : "text-bone"
                      }`}
                    >
                      <span className="min-w-0 truncate">{child.name}</span>
                      {typeof child.productCount === "number" ? (
                        <span className="num shrink-0 text-[10px] text-mute">{child.productCount.toLocaleString("fa-IR")}</span>
                      ) : null}
                    </Link>
                    {child.children.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-1.5 px-2">
                        {child.children.map((grandchild) => (
                          <Link
                            key={grandchild.publicId}
                            to="/$category"
                            params={{ category: grandchild.slug }}
                            onClick={onNavigate}
                            className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors hover:border-signal hover:text-signal ${
                              pathname === `/${grandchild.slug}`
                                ? "border-signal text-signal"
                                : "border-hairline-soft text-metal"
                            }`}
                          >
                            {grandchild.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function PrototypeTaxonomy({
  pathname,
  onNavigate,
  compact,
}: {
  pathname: string;
  onNavigate?: () => void;
  compact: boolean;
}) {
  return (
    <div>
      <div className={compact ? "mt-3 grid gap-2" : "mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3"}>
        {CATALOG_NAVIGATION.map((entry, index) => {
          const group = catalogNavigationGroup(entry);
          if (!group) return null;

          const active = entry.currentRoute !== undefined && pathname === `/${entry.currentRoute}`;
          const labels = group.strategy === "filter-first" ? (group.filters ?? []) : nodeLabels(group.children);

          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="num text-[10px] text-mute">{String(index + 1).padStart(2, "0")}</span>
                  <h4 className={`mt-1 text-lg font-black ${active ? "text-signal" : "text-bone"}`}>
                    {group.label}
                  </h4>
                  {group.latin ? <span className="tech mt-1 block text-mute">{group.latin}</span> : null}
                </div>
                {entry.availability === "planned" ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline px-2 py-1 text-[10px] text-mute">
                    <LockKeyhole size={11} aria-hidden="true" />
                    به‌زودی
                  </span>
                ) : entry.availability === "partial" ? (
                  <span className="shrink-0 rounded-full border border-signal/40 px-2 py-1 text-[10px] text-signal">بخشی فعال</span>
                ) : (
                  <span className="shrink-0 rounded-full border border-hairline px-2 py-1 text-[10px] text-metal">فعال</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {labels.map((label) => (
                  <span key={label} className="rounded-full border border-hairline-soft bg-carbon-2 px-2.5 py-1 text-[10px] leading-5 text-metal">
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
                params={{ category: entry.currentRoute }}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className="group min-w-0 rounded-2xl border border-hairline bg-carbon p-4 transition-colors hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
              >
                {content}
              </Link>
            );
          }

          return (
            <article key={entry.groupSlug} aria-disabled="true" className="min-w-0 rounded-2xl border border-hairline-soft bg-carbon/70 p-4">
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
              params={{ category: item.route }}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className="flex min-h-12 items-center justify-between gap-4 rounded-xl border border-hairline-soft px-4 transition-colors hover:border-signal"
            >
              <span>
                <span className={`text-sm font-black ${active ? "text-signal" : "text-bone"}`}>{item.label}</span>
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
