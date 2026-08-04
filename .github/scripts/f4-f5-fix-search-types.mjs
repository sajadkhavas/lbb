import { readFile, writeFile } from "node:fs/promises";

async function patch(path, replacements) {
  let source = await readFile(path, "utf8");
  for (const [before, after] of replacements) {
    if (source.includes(after)) continue;
    if (!source.includes(before)) {
      throw new Error(`Expected source fragment was not found in ${path}: ${before}`);
    }
    source = source.replace(before, after);
  }
  await writeFile(path, source);
}

await patch("src/lib/product-filter.ts", [
  [
    "export function stableSearchString(params: Record<string, unknown>): string {",
    "export function stableSearchString(params: object): string {",
  ],
  [
    "export function isCanonicalSearch(current: string, expected: Record<string, unknown>): boolean {",
    "export function isCanonicalSearch(current: string, expected: object): boolean {",
  ],
]);

await patch("src/routes/shop.tsx", [
  [
    "  normalizeFilters,\n  parseFilters,\n",
    "  normalizeFilters,\n  parseFilterSearch,\n  parseFilters,\n",
  ],
  [
    "  validateSearch: (search: Record<string, unknown>): Filters => parseFilters(search),",
    "  validateSearch: (search: Record<string, unknown>) => parseFilterSearch(search),",
  ],
  [
    "    const filters = match.search as Filters;",
    "    const filters = parseFilters(match.search as unknown as Record<string, unknown>);",
  ],
  [
    "  const filters = useMemo(() => normalizeFilters(routeFilters, FILTER_SCOPE), [routeFilters]);",
    "  const filters = useMemo(\n    () =>\n      normalizeFilters(\n        parseFilters(routeFilters as unknown as Record<string, unknown>),\n        FILTER_SCOPE,\n      ),\n    [routeFilters],\n  );",
  ],
]);

await patch("src/routes/$category.tsx", [
  [
    "  normalizeFilters,\n  parseFilters,\n",
    "  normalizeFilters,\n  parseFilterSearch,\n  parseFilters,\n",
  ],
  [
    "  validateSearch: (search: Record<string, unknown>): Filters => parseFilters(search),",
    "  validateSearch: (search: Record<string, unknown>) => parseFilterSearch(search),",
  ],
  [
    "    const filters = match.search as Filters;",
    "    const filters = parseFilters(match.search as unknown as Record<string, unknown>);",
  ],
  [
    "  const filters = useMemo(() => normalizeFilters(routeFilters, scope), [routeFilters, scope]);",
    "  const filters = useMemo(\n    () =>\n      normalizeFilters(\n        parseFilters(routeFilters as unknown as Record<string, unknown>),\n        scope,\n      ),\n    [routeFilters, scope],\n  );",
  ],
]);

await patch("src/routes/search.tsx", [
  [
    "  normalizeFilters,\n  parseFilters,\n",
    "  normalizeFilters,\n  parseFilterSearch,\n  parseFilters,\n",
  ],
  ["  type Filters,\n", "  type Filters,\n  type FilterSearch,\n"],
  [
    "type SearchParams = Filters & { q?: string };",
    "type SearchParams = FilterSearch & { q?: string };",
  ],
  [
    "const serializeSearch = (query: string | undefined, filters: Filters) => ({",
    "const serializeSearch = (query: string | undefined, filters: Filters): SearchParams => ({",
  ],
  ["    ...parseFilters(search),", "    ...parseFilterSearch(search),"],
  [
    "  const filters = useMemo(() => normalizeFilters(routeSearch, FILTER_SCOPE), [routeSearch]);",
    "  const filters = useMemo(\n    () =>\n      normalizeFilters(\n        parseFilters(routeSearch as unknown as Record<string, unknown>),\n        FILTER_SCOPE,\n      ),\n    [routeSearch],\n  );",
  ],
]);

console.log("F4/F5 optional search typing patches applied.");
