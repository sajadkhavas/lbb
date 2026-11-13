#!/usr/bin/env bash
set -Eeuo pipefail
umask 022

root=/var/www/lbb
current="$root/current"
service=lbb.service
baseline="$root/releases/size-guide-layout-I278rcNN"
mode="${1:-deploy}"

[[ $EUID == 0 && -L "$current" && -d "$baseline" ]]
exec 9>"$root/.shop-release.lock"
flock -n 9

switch_release() {
  local target="$1" stage
  stage="$(mktemp -d "$root/.shop-switch.XXXXXXXX")"
  ln -s -- "$target" "$stage/current" || return 1
  mv -Tf -- "$stage/current" "$current" || return 1
  rmdir -- "$stage" || true
}

check_release() {
  local target="$1" marker="${2:-}" pid attempt body http_code
  body="$(mktemp)" || return 1
  for attempt in {1..12}; do
    pid="$(systemctl show -p MainPID --value "$service")"
    if [[ "$pid" != 0 && "$(readlink -f "/proc/$pid/cwd" || true)" == "$target" ]] &&
      http_code="$(curl -fsS --compressed --max-time 5 -H 'Cache-Control: no-cache' \
        -o "$body" -w '%{http_code}' "https://lbbclo.com/shop?lbb_release=$(date +%s%N)")" &&
      [[ "$http_code" == 200 && -s "$body" ]]; then
      if [[ -z "$marker" ]] || LC_ALL=C grep -aqF 'id="shop-category-track"' "$body"; then
        rm -f -- "$body"
        return 0
      fi
      echo "SHOP_CHECK attempt=$attempt HTTP=200 release marker missing" >&2
    else
      echo "SHOP_CHECK attempt=$attempt HTTP=${http_code:-unavailable} PID=${pid:-unknown}" >&2
    fi
    sleep 2
  done
  rm -f -- "$body"
  return 1
}

if [[ "$mode" == rollback ]]; then
  active="$(readlink -f "$current")"
  if [[ "$active" != "$root"/releases/shop-layout-* || ! -f "$active/.lbb-shop-previous" ||
    "$(cat "$active/.lbb-shop-previous")" != "$baseline" ]]; then
    echo 'STOP: active release is not the release installed by this script.' >&2
    exit 1
  fi
  switch_release "$baseline"
  systemctl restart "$service"
  check_release "$baseline"
  echo "LBB_SHOP_ROLLBACK_OK $baseline"
  exit
fi

[[ "$mode" == deploy ]]
[[ "$(readlink -f "$current")" == "$baseline" ]]
[[ "$(systemctl show -p WorkingDirectory --value "$service")" == "$current" ]]
systemctl is-active --quiet "$service"
check_release "$baseline"

source_file=src/routes/shop.tsx
expected='95e5147b627b335aa0df5fafa724d63f16ba28df23667770895bce6be2945e14'
[[ "$(sha256sum "$baseline/$source_file" | cut -d' ' -f1)" == "$expected" ]] || {
  echo 'STOP: active shop source differs from the expected source.' >&2
  exit 1
}

candidate="$(mktemp -d "$root/releases/shop-layout-XXXXXXXX")"
chmod --reference="$baseline" "$candidate"
chown --reference="$baseline" "$candidate"
cp -a "$baseline/." "$candidate/"
cd "$candidate"
patch --batch --forward -p1 <<'PATCH'
diff --git a/src/routes/shop.tsx b/src/routes/shop.tsx
index 8718982..b22fbea 100644
--- a/src/routes/shop.tsx
+++ b/src/routes/shop.tsx
@@ -1,6 +1,13 @@
 import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
 import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
-import { ArrowUpLeft, PackageSearch, RefreshCcw, Search } from "lucide-react";
+import {
+  ArrowLeft,
+  ArrowRight,
+  ArrowUpLeft,
+  PackageSearch,
+  RefreshCcw,
+  Search,
+} from "lucide-react";
 import { Navbar } from "@/components/lbb/Navbar";
 import { Footer } from "@/components/lbb/Footer";
 import { ManagedPageHead } from "@/components/lbb/ManagedPageIntro";
@@ -49,7 +56,9 @@ import {
   backendErrorMessage,
   getCatalogFacets,
   isLiveBackend,
+  listCategories,
   listProducts,
+  type CategoryDto,
   type FacetsDto,
 } from "@/lib/backend-api";
 import {
@@ -91,6 +100,7 @@ type LiveLoader = {
   mode: "live";
   products: BackendCatalogCard[];
   facets: FacetsDto | null;
+  categories?: CategoryDto[];
   total: number;
   totalPages: number;
   filters: Filters;
@@ -108,7 +118,10 @@ export const Route = createFileRoute("/shop")({
     if (!isLiveBackend()) return { mode: "prototype" };
 
     try {
-      const facetsResponse = await getCatalogFacets();
+      const [facetsResponse, categoryResponse] = await Promise.all([
+        getCatalogFacets(),
+        listCategories().catch(() => null),
+      ]);
       const facets = facetsResponse.data;
       const visuals = backendFacetVisuals(facets);
       const scope: FilterScope = {
@@ -132,6 +145,7 @@ export const Route = createFileRoute("/shop")({
           mode: "live",
           products: response.data.map(backendCard),
           facets,
+          categories: categoryResponse?.data,
           total: response.meta.pagination?.total ?? response.data.length,
           totalPages: response.meta.pagination?.totalPages ?? 1,
           filters,
@@ -142,6 +156,7 @@ export const Route = createFileRoute("/shop")({
           mode: "live",
           products: [],
           facets,
+          categories: categoryResponse?.data,
           total: 0,
           totalPages: 0,
           filters,
@@ -335,7 +350,11 @@ function LiveShop({ loader }: { loader: LiveLoader }) {
 
   return (
     <ShopChrome
-      categories={categoryOptions ?? []}
+      categories={
+        loader.categories?.map(({ slug, name, image }) => ({ slug, label: name, image })) ??
+        categoryOptions ??
+        []
+      }
       status={
         loader.error
           ? "در حال حاضر دریافت اطلاعات فروشگاه امکان‌پذیر نیست. لطفاً کمی بعد دوباره تلاش کنید."
@@ -596,6 +615,39 @@ function ShopChrome({
   const presentation = useStorefrontPresentation();
   const page = presentation.pages.shop;
   const [query, setQuery] = useState("");
+  const categoryTrack = useRef<HTMLDivElement>(null);
+  const [categoryScroll, setCategoryScroll] = useState({ previous: false, next: false });
+
+  useEffect(() => {
+    const track = categoryTrack.current;
+    if (!track) return;
+    const update = () => {
+      const position = Math.abs(track.scrollLeft);
+      setCategoryScroll({
+        previous: position > 1,
+        next: position + track.clientWidth < track.scrollWidth - 1,
+      });
+    };
+    const observer = new ResizeObserver(update);
+    observer.observe(track);
+    track.addEventListener("scroll", update, { passive: true });
+    update();
+    return () => {
+      observer.disconnect();
+      track.removeEventListener("scroll", update);
+    };
+  }, [categories.length]);
+
+  const scrollCategories = (direction: number) => {
+    const track = categoryTrack.current;
+    const card = track?.firstElementChild;
+    if (!track || !card) return;
+    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
+    track.scrollBy({
+      left: direction * (card.getBoundingClientRect().width + gap),
+      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
+    });
+  };
 
   const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
@@ -619,17 +671,15 @@ function ShopChrome({
             <div className="relative isolate min-h-[520px] overflow-hidden rounded-[24px] bg-carbon md:min-h-[590px] md:rounded-[32px]">
               <img
                 src={page.socialImageUrl ?? homeCategoryImage("tshirts")}
-                alt={
-                  presentation.source === "live"
-                    ? page.title
-                    : "تیشرت ال‌بی‌بی برای شروع مرور فروشگاه"
-                }
-                width={1600}
-                height={2000}
+                alt=""
                 fetchPriority="high"
-                className="absolute inset-0 h-full w-full bg-white object-contain p-8 md:p-14"
+                className={
+                  page.socialImageUrl
+                    ? "absolute inset-0 h-full w-full object-cover object-left"
+                    : "absolute inset-0 h-full w-full object-cover object-center"
+                }
               />
-              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,.12)_0%,rgba(9,9,11,.38)_42%,rgba(9,9,11,.94)_100%)] md:bg-[linear-gradient(90deg,rgba(9,9,11,.94)_0%,rgba(9,9,11,.68)_42%,rgba(9,9,11,.08)_78%)]" />
+              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(9,9,11,.15)_30%,rgba(9,9,11,.96)_75%)] md:bg-[linear-gradient(to_left,rgba(9,9,11,.86)_0%,rgba(9,9,11,.58)_32%,transparent_67%)]" />
               <div className="relative flex min-h-[520px] flex-col justify-end p-5 md:min-h-[590px] md:max-w-[680px] md:justify-center md:p-12 lg:p-16">
                 <TechLabel tone="signal">{page.eyebrow}</TechLabel>
                 <h1 className="mt-4 max-w-xl text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[.92] tracking-[-.06em] text-bone">
@@ -686,35 +736,61 @@ function ShopChrome({
                   {page.sectionTitle}
                 </h2>
               </div>
-              <span className="tech hidden text-mute md:block">SWIPE / EXPLORE</span>
+              {(categoryScroll.previous || categoryScroll.next) && (
+                <div className="flex shrink-0 gap-2">
+                  <button
+                    type="button"
+                    aria-label="دسته قبلی"
+                    aria-controls="shop-category-track"
+                    disabled={!categoryScroll.previous}
+                    onClick={() => scrollCategories(1)}
+                    className="grid size-11 place-items-center rounded-full border border-white/25 text-bone hover:border-signal focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-35"
+                  >
+                    <ArrowRight size={18} aria-hidden="true" />
+                  </button>
+                  <button
+                    type="button"
+                    aria-label="دسته بعدی"
+                    aria-controls="shop-category-track"
+                    disabled={!categoryScroll.next}
+                    onClick={() => scrollCategories(-1)}
+                    className="grid size-11 place-items-center rounded-full border border-white/25 text-bone hover:border-signal focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-35"
+                  >
+                    <ArrowLeft size={18} aria-hidden="true" />
+                  </button>
+                </div>
+              )}
             </div>
-            <div className="mx-[calc(0px_-_var(--lbb-gutter))] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--lbb-gutter)] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
+            <div
+              id="shop-category-track"
+              ref={categoryTrack}
+              className="flex snap-x snap-mandatory gap-3 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
+            >
               {categories.map((category, index) => (
                 <Link
                   key={category.slug}
                   to="/$category"
                   params={{ category: category.slug }}
-                  className="group relative aspect-[4/5] w-[72vw] max-w-[290px] shrink-0 snap-start overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-raised transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-signal/60 hover:shadow-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal md:w-auto md:max-w-none"
+                  className="group relative h-32 w-28 shrink-0 snap-start overflow-hidden rounded-xl border border-white/15 bg-bone hover:border-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal md:h-40 md:w-[calc((100%_-_3.75rem)/6)]"
                 >
-                  <img
-                    src={
-                      category.image || homeCategoryImage(category.slug as keyof typeof CATEGORIES)
-                    }
-                    alt=""
-                    width={640}
-                    height={800}
-                    loading={index < 2 ? "eager" : "lazy"}
-                    className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-[1.05]"
-                  />
-                  <span className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
-                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
-                    <span>
-                      <span className="block text-xl font-black text-bone">{category.label}</span>
-                      <span className="tech mt-1 block text-bone/60">0{index + 1}</span>
-                    </span>
-                    <span className="grid size-10 place-items-center rounded-full border border-white/25 bg-obsidian/45 text-bone backdrop-blur transition-colors group-hover:border-signal group-hover:bg-signal">
-                      <ArrowUpLeft size={16} aria-hidden="true" />
-                    </span>
+                  {(category.image || Object.hasOwn(CATEGORIES, category.slug)) && (
+                    <img
+                      src={
+                        category.image ||
+                        (Object.hasOwn(CATEGORIES, category.slug)
+                          ? homeCategoryImage(category.slug as keyof typeof CATEGORIES)
+                          : undefined)
+                      }
+                      alt=""
+                      width={640}
+                      height={800}
+                      loading={index < 2 ? "eager" : "lazy"}
+                      className="absolute inset-0 h-full w-full object-contain px-3 pb-9 pt-2 transition-transform group-hover:scale-105"
+                    />
+                  )}
+                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-obsidian px-2 py-2 text-xs font-bold text-bone md:px-3 md:text-sm">
+                    {category.label}
+                    <ArrowUpLeft size={14} aria-hidden="true" className="shrink-0" />
                   </span>
                 </Link>
               ))}
PATCH

# A fresh output directory keeps the previous release and its build intact.
if [[ -e .output || -L .output ]]; then
  mv -- .output .output-before-shop-build
fi
if [[ ! -x node_modules/.bin/vite ]]; then
  npm ci --include=dev
fi
VITE_SITE_URL=https://lbbclo.com \
VITE_LBB_BACKEND_MODE=live \
VITE_LBB_API_BASE_URL=https://api.lbbclo.com \
npm run build
test -s .output/server/index.mjs
printf '%s\n' "$baseline" > .lbb-shop-previous

rollback_on_failure() {
  local status="$?"
  trap - EXIT HUP INT TERM
  if [[ "$(readlink -f "$current")" == "$candidate" ]]; then
    if switch_release "$baseline" && systemctl restart "$service" && check_release "$baseline"; then
      echo "LBB_SHOP_ROLLBACK_OK $baseline" >&2
    else
      echo "LBB_SHOP_ROLLBACK_CHECK_FAILED $baseline" >&2
    fi
  fi
  exit "$status"
}

trap rollback_on_failure EXIT
trap 'exit 130' HUP INT TERM
switch_release "$candidate"
systemctl restart "$service"
check_release "$candidate" new
trap - EXIT HUP INT TERM
echo "LBB_SHOP_DEPLOY_OK $candidate"
