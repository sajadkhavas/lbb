export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, light = true }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav
      dir="rtl"
      aria-label="breadcrumb"
      className={`text-xs ${light ? "text-gray-500" : "text-white/50"} font-body`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href ? (
              <a href={it.href} className="hover:text-[var(--lbb-red)]">{it.label}</a>
            ) : (
              <span className={light ? "text-black" : "text-white"}>{it.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
