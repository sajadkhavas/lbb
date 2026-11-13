#!/usr/bin/env bash
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo RUN_AS_ROOT; exit 1; }
if [[ ${1:-} == --hero ]]; then
  photo=$(realpath -- "${2:?missing hero photo}")
  echo "82898c7de2bec2c5fdb96fe65c78a2165cdf6ef12a0b2abd96ac51f8b270bf09  $photo" | sha256sum -c -
  cd /var/www/lbb/backend/current
  LBB_HERO_UPLOAD="$photo" php <<'LBB_HERO_PHP'
<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$path = 'storefront/hero/lbb-hero-0092.webp';
$disk = Illuminate\Support\Facades\Storage::disk('public');
$image = file_get_contents(getenv('LBB_HERO_UPLOAD'));
if ($image === false || !$disk->put($path, $image, 'public')) {
    throw new RuntimeException('Hero photo could not be written.');
}

Illuminate\Support\Facades\DB::transaction(function () use ($path) {
    $setting = App\Models\StoreSetting::query()->where('key', 'home.presentation')->lockForUpdate()->firstOrFail();
    $value = $setting->typedValue();
    if (!is_array($value)) {
        throw new RuntimeException('Invalid homepage settings.');
    }
    $value['heroImagePath'] = $path;
    $setting->value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $setting->saveOrFail();
});
echo "LBB_HERO_IMAGE_OK\n";
LBB_HERO_PHP
  exit
fi
if [[ ${1:-} == --admin ]]; then
  cd /var/www/lbb/backend/current
  admin_patch=$(mktemp)
  trap 'rm -f "$admin_patch"' EXIT
  cat > "$admin_patch" <<'LBB_ADMIN_PATCH'
diff --git a/app/Filament/Pages/SiteSettings.php b/app/Filament/Pages/SiteSettings.php
index 554ebec..d610211 100644
--- a/app/Filament/Pages/SiteSettings.php
+++ b/app/Filament/Pages/SiteSettings.php
@@ -380,6 +380,7 @@ class SiteSettings extends Page implements HasForms
         ]);
 
         $this->putJsonSetting('home', 'home.presentation', 'چیدمان صفحه اصلی', [
+            ...$this->jsonSetting('home', 'home.presentation'),
             'heroProductSlug' => $state['hero_product_slug'] ?? '',
             'categoryOrder' => $this->stringValues($state['category_order'] ?? []),
             'sections' => $this->stringValues($state['home_sections'] ?? []),
diff --git a/app/Filament/Pages/StorefrontControlCenter.php b/app/Filament/Pages/StorefrontControlCenter.php
index 5718b66..f4805fc 100644
--- a/app/Filament/Pages/StorefrontControlCenter.php
+++ b/app/Filament/Pages/StorefrontControlCenter.php
@@ -58,6 +58,7 @@ class StorefrontControlCenter extends Page implements HasForms
         $this->data = [
             'hero_enabled' => (bool) ($home['heroEnabled'] ?? true),
             'hero_product_slug' => (string) ($home['heroProductSlug'] ?? ''),
+            'hero_product_slugs' => array_values((array) ($home['heroProductSlugs'] ?? [])),
             'hero_image_path' => $home['heroImagePath'] ?? null,
             'hero_image_alt' => (string) ($home['heroImageAlt'] ?? ''),
             'hero_image_fit' => (string) ($home['heroImageFit'] ?? 'contain'),
@@ -117,13 +118,13 @@ class StorefrontControlCenter extends Page implements HasForms
                         Toggle::make('hero_enabled')
                             ->label('نمایش Hero')
                             ->helperText('خاموش‌کردن Hero فقط نمایش را متوقف می‌کند و داده محصول را تغییر نمی‌دهد.'),
-                        Select::make('hero_product_slug')
-                            ->label('محصول Hero')
+                        Select::make('hero_product_slugs')
+                            ->label('محصولات کاروسل زیر هیرو')
+                            ->multiple()
                             ->options(fn (): array => $this->productOptions())
                             ->searchable()
                             ->preload()
-                            ->placeholder('بدون محصول منتخب')
-                            ->helperText('فقط محصول واقعی منتشرشده را انتخاب کنید؛ نیازی به واردکردن Slug نیست.'),
+                            ->helperText('خالی بگذارید تا همه محصولات فعال نمایش داده شوند، یا فقط محصولات دلخواه را انتخاب کنید.'),
                         FileUpload::make('hero_image_path')
                             ->label('تصویر مستقل Hero')
                             ->disk('public')
@@ -331,7 +332,11 @@ class StorefrontControlCenter extends Page implements HasForms
         DB::transaction(function () use ($state): void {
             $home = $this->jsonSetting('home', 'home.presentation');
             $home['heroEnabled'] = (bool) ($state['hero_enabled'] ?? true);
-            $home['heroProductSlug'] = trim((string) ($state['hero_product_slug'] ?? ''));
+            $home['heroProductSlugs'] = array_values(array_intersect(
+                (array) ($state['hero_product_slugs'] ?? []),
+                array_keys($this->productOptions()),
+            ));
+            $home['heroProductSlug'] = $home['heroProductSlugs'][0] ?? ($home['heroProductSlug'] ?? '');
             $home['heroImagePath'] = $this->nullableString($state['hero_image_path'] ?? null);
             $home['heroImageAlt'] = trim((string) ($state['hero_image_alt'] ?? ''));
             $home['heroImageFit'] = in_array(($state['hero_image_fit'] ?? 'contain'), ['contain', 'cover'], true)
LBB_ADMIN_PATCH
  patch --batch --forward --dry-run -p1 < "$admin_patch"
  backup=$(mktemp -d /root/lbb-admin-before-XXXXXXXX)
  cp -a app/Filament/Pages/{SiteSettings,StorefrontControlCenter}.php "$backup/"
  if ! patch --batch --forward -p1 < "$admin_patch" ||
     ! php -l app/Filament/Pages/SiteSettings.php ||
     ! php -l app/Filament/Pages/StorefrontControlCenter.php; then
    cp -a "$backup/"*.php app/Filament/Pages/
    exit 1
  fi
  echo "LBB_HERO_ADMIN_OK backup=$backup"
  exit
fi
[[ $(df -PB1 /var/www/lbb/releases | awk 'NR==2 { print $4 }') -ge 2147483648 ]] || { echo INSUFFICIENT_DISK; exit 1; }
previous=$(readlink -f /var/www/lbb/current)
[[ -f "$previous/src/components/lbb/home/DropStory.tsx" ]] || { echo SOURCE_NOT_FOUND; exit 1; }
[[ -z $(ss -H -ltn 'sport = :18574') ]] || { echo CANARY_PORT_BUSY; exit 1; }
release=$(mktemp -d /var/www/lbb/releases/home-motion-XXXXXXXX)
unit="lbb-home-check-$(basename "$release")"
state=$(mktemp -d /root/lbb-home-state-XXXXXXXX)
switched=0
rollback() {
  local result=$?
  trap - ERR
  if [[ "$switched" == 1 ]]; then
    ln -s "$previous" "/var/www/lbb/current.rollback.$$"
    mv -Tf "/var/www/lbb/current.rollback.$$" /var/www/lbb/current
    systemctl restart lbb.service
    echo "LBB_HOME_ROLLBACK_OK $previous"
  fi
  systemctl stop "$unit.service" >/dev/null 2>&1 || true
  rm -f "$state/runtime.env"
  if [[ "$(readlink -f /var/www/lbb/current)" != "$release" ]]; then rm -rf -- "$release"; fi
  echo "INSTALL_FAILED status=$result candidate=$release"
  exit "$result"
}
trap rollback ERR
tar -C "$previous" --exclude='./.output' --exclude='./.output-before-*' --exclude='./.*-build-backup-*' --exclude='./.git' -cf - . | tar -C "$release" -xf -
cd "$release"
python3 - "$state" <<'PY_PAYLOAD'
import json,sys,pathlib,subprocess
payload=json.loads(r'''{"patch": "--- a/src/components/lbb/ProductCard.tsx\n+++ b/src/components/lbb/ProductCard.tsx\n@@ -1,3 +1,4 @@\n+import { DecodedCardImage } from \"./DecodedCardImage\";\n import { useIdleAutoplay } from \"@/hooks/use-idle-autoplay\";\n import { useEffect, useRef, useState, type PointerEvent, type TouchEvent } from \"react\";\n import { Link } from \"@tanstack/react-router\";\n@@ -14,7 +15,7 @@\n import { colorName } from \"@/lib/color-names\";\n import { isUsableMannequinProfile } from \"@/lib/style-mannequin\";\n import { StyleMannequin } from \"@/components/lbb/product/StyleMannequin\";\n-import { Frame, StatusTag, TechLabel } from \"@/components/lbb/ui/primitives\";\n+import { StatusTag, TechLabel } from \"@/components/lbb/ui/primitives\";\n \n export type ProductCardModel = Product | BackendCatalogCard;\n \n@@ -49,7 +50,7 @@\n     : [productImage(p.slug)].filter((value): value is string => Boolean(value));\n   const { ref: autoplayRef, visible } = useIdleAutoplay<HTMLElement>(\n     () => setPreviewIndex((index) => (index + 1) % previewImages.length),\n-    3000,\n+    4000,\n     autoplay && !showMannequin && previewImages.length > 1,\n   );\n   const nextImage = previewImages[(previewIndex + 1) % previewImages.length];\n@@ -187,19 +188,10 @@\n           event.stopPropagation();\n         }}\n       >\n-        <Frame\n-          src={primaryImage}\n-          alt={name}\n-          ratio=\"4/5\"\n-          width={1024}\n-          height={1280}\n-          priority={priority && previewIndex === 0}\n-          zoom={false}\n-          className=\"product-card__media bg-white\"\n-          imgClassName=\"object-cover\"\n-        >\n+        <div className=\"product-card__media relative aspect-[4/5] overflow-hidden bg-carbon\">\n+          <DecodedCardImage src={primaryImage} alt={name} priority={priority} />\n           {overlay}\n-        </Frame>\n+        </div>\n         {!autoplay && backend && previewImages.length > 1 && previewIndex === 0 ? (\n           <img\n             src={previewImages[1]}\n--- a/src/components/lbb/home/HomeProductCarousel.tsx\n+++ b/src/components/lbb/home/HomeProductCarousel.tsx\n@@ -18,7 +18,7 @@\n       if (api.canScrollNext()) api.scrollNext();\n       else api.scrollTo(0);\n     },\n-    5500,\n+    7000,\n     items.length > 1,\n   );\n   return (\n--- a/src/components/lbb/home/CompactCollectionStory.tsx\n+++ b/src/components/lbb/home/CompactCollectionStory.tsx\n@@ -36,13 +36,10 @@\n       data-compact-collection\n     >\n       <Shell>\n-        <div className=\"grid overflow-hidden rounded-2xl border border-hairline bg-obsidian md:grid-cols-2\">\n-          <div className=\"flex justify-center bg-[#121212]\">\n+        <div className=\"grid overflow-hidden rounded-2xl border border-hairline bg-obsidian md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]\">\n+          <div className=\"relative min-h-[min(48vw,540px)] min-w-0 overflow-hidden bg-[#121212] [container-type:size] max-md:aspect-[3/4]\">\n             {heroImage && (\n-              <div\n-                className=\"relative w-auto max-w-full\"\n-                style={{ aspectRatio: \"3 / 4\", height: \"clamp(300px, 38vw, 460px)\" }}\n-              >\n+              <div className=\"absolute left-1/2 top-1/2 aspect-[3/4] w-[max(100cqw,75cqh)] -translate-x-1/2 -translate-y-1/2\">\n                 <img\n                   src={heroImage}\n                   alt={collection.name}\n@@ -50,7 +47,7 @@\n                   height={1200}\n                   loading=\"lazy\"\n                   decoding=\"async\"\n-                  className=\"block w-full object-contain\"\n+                  className=\"absolute inset-0 block w-full object-cover\"\n                   style={{ height: \"100%\" }}\n                 />\n                 {diamond &&\n--- a/src/components/lbb/home/HeroNarrative.tsx\n+++ b/src/components/lbb/home/HeroNarrative.tsx\n@@ -1,5 +1,7 @@\n+import { useState } from \"react\";\n+import { useIdleAutoplay } from \"@/hooks/use-idle-autoplay\";\n import { Link } from \"@tanstack/react-router\";\n-import { ArrowDownLeft, ArrowUpLeft } from \"lucide-react\";\n+import { ArrowDownLeft, ArrowUpLeft, ChevronLeft, ChevronRight } from \"lucide-react\";\n import { MerchantNavigationLink } from \"@/components/lbb/navigation/MerchantNavigationLink\";\n import { CtaClasses, TechLabel } from \"@/components/lbb/ui/primitives\";\n import { CATEGORIES } from \"@/lib/categories\";\n@@ -19,7 +21,9 @@\n export function HeroNarrative({\n   heroProduct: liveHeroProduct,\n   liveCategories,\n+  heroProducts,\n }: {\n+  heroProducts?: LiveHeroProduct[];\n   heroProduct?: LiveHeroProduct | null;\n   liveCategories?: StorefrontCategoryDto[] | null;\n }) {\n@@ -30,7 +34,7 @@\n     (slug): slug is keyof typeof CATEGORIES => slug in CATEGORIES,\n   );\n \n-  const heroProduct =\n+  const initialProduct =\n     source === \"live\"\n       ? liveHeroProduct\n       : prototypeProduct\n@@ -41,9 +45,20 @@\n             image: productImage(prototypeProduct.slug),\n           }\n         : null;\n+  const items = heroProducts?.length ? heroProducts : initialProduct ? [initialProduct] : [];\n+  const [selected, setSelected] = useState<string | null>(null);\n+  const index = Math.max(\n+    0,\n+    items.findIndex((item) => item.slug === (selected ?? initialProduct?.slug)),\n+  );\n+  const heroProduct = items[index];\n+  const move = (delta: number) => {\n+    if (items.length > 1) setSelected(items[(index + delta + items.length) % items.length].slug);\n+  };\n+  const { ref: heroCarouselRef } = useIdleAutoplay(() => move(1), 7000, items.length > 1);\n   const heroImage =\n     source === \"live\"\n-      ? (presentation.hero.imageUrl ?? heroProduct?.image ?? null)\n+      ? (presentation.hero.imageUrl ?? initialProduct?.image ?? null)\n       : productImage(home.heroProductSlug);\n   const heroAlt =\n     source === \"live\" && presentation.hero.imageAlt\n@@ -210,39 +225,64 @@\n           <span aria-hidden=\"true\" className=\"absolute inset-x-0 top-0 h-px bg-bone/30\" />\n \n           {heroProduct ? (\n-            <Link\n-              to=\"/product/$slug\"\n-              params={{ slug: heroProduct.slug }}\n-              className=\"group absolute bottom-5 right-5 grid w-[min(360px,calc(100%-2.5rem))] grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-hairline-strong bg-obsidian/95 p-2 text-bone shadow-overlay backdrop-blur md:bottom-8 md:right-8\"\n+            <div\n+              ref={heroCarouselRef}\n+              className=\"absolute bottom-5 right-5 w-[min(360px,calc(100%_-_2.5rem))] md:bottom-8 md:right-8\"\n             >\n-              {heroProduct.image ? (\n-                <img\n-                  src={heroProduct.image}\n-                  alt=\"\"\n-                  width={64}\n-                  height={80}\n-                  loading=\"eager\"\n-                  decoding=\"async\"\n-                  className=\"h-20 w-16 rounded-xl object-cover\"\n+              <Link\n+                to=\"/product/$slug\"\n+                params={{ slug: heroProduct.slug }}\n+                className=\"group grid w-full grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-hairline-strong bg-obsidian/95 p-2 text-bone shadow-overlay backdrop-blur\"\n+              >\n+                {heroProduct.image ? (\n+                  <img\n+                    src={heroProduct.image}\n+                    alt=\"\"\n+                    width={64}\n+                    height={80}\n+                    loading=\"eager\"\n+                    decoding=\"async\"\n+                    className=\"h-20 w-16 rounded-xl object-cover\"\n+                  />\n+                ) : (\n+                  <span aria-hidden=\"true\" className=\"h-20 w-16 rounded-xl bg-carbon-2\" />\n+                )}\n+                <span className=\"min-w-0\">\n+                  <TechLabel tone=\"signal\">HERO PIECE</TechLabel>\n+                  <span className=\"mt-1 block truncate text-sm font-black\">{heroProduct.name}</span>\n+                  <span className=\"num mt-1 block text-xs text-metal\">\n+                    {heroProduct.priceToman === null\n+                      ? \"قیمت در صفحه محصول\"\n+                      : fmtToman(heroProduct.priceToman)}\n+                  </span>\n+                </span>\n+                <ArrowUpLeft\n+                  size={18}\n+                  aria-hidden=\"true\"\n+                  className=\"text-mute transition-colors group-hover:text-signal\"\n                 />\n-              ) : (\n-                <span aria-hidden=\"true\" className=\"h-20 w-16 rounded-xl bg-carbon-2\" />\n+              </Link>\n+              {items.length > 1 && (\n+                <div className=\"absolute -top-10 end-0 flex gap-1\">\n+                  <button\n+                    type=\"button\"\n+                    onClick={() => move(-1)}\n+                    aria-label=\"محصول قبلی\"\n+                    className=\"grid h-9 w-9 place-items-center rounded-full bg-obsidian/75 text-bone hover:text-signal\"\n+                  >\n+                    <ChevronRight size={15} />\n+                  </button>\n+                  <button\n+                    type=\"button\"\n+                    onClick={() => move(1)}\n+                    aria-label=\"محصول بعدی\"\n+                    className=\"grid h-9 w-9 place-items-center rounded-full bg-obsidian/75 text-bone hover:text-signal\"\n+                  >\n+                    <ChevronLeft size={15} />\n+                  </button>\n+                </div>\n               )}\n-              <span className=\"min-w-0\">\n-                <TechLabel tone=\"signal\">HERO PIECE</TechLabel>\n-                <span className=\"mt-1 block truncate text-sm font-black\">{heroProduct.name}</span>\n-                <span className=\"num mt-1 block text-xs text-metal\">\n-                  {heroProduct.priceToman === null\n-                    ? \"قیمت در صفحه محصول\"\n-                    : fmtToman(heroProduct.priceToman)}\n-                </span>\n-              </span>\n-              <ArrowUpLeft\n-                size={18}\n-                aria-hidden=\"true\"\n-                className=\"text-mute transition-colors group-hover:text-signal\"\n-              />\n-            </Link>\n+            </div>\n           ) : null}\n \n           <a\n--- a/src/lib/storefront-control.tsx\n+++ b/src/lib/storefront-control.tsx\n@@ -81,6 +81,7 @@\n \n export type HomePresentation = {\n   heroProductSlug: string;\n+  heroProductSlugs?: string[];\n   categoryOrder: string[];\n   sections: string[];\n };\n--- a/src/routes/index.tsx\n+++ b/src/routes/index.tsx\n@@ -14,7 +14,7 @@\n import { ProductMoments } from \"@/components/lbb/home/ProductMoments\";\n import { TickerStrip } from \"@/components/lbb/home/TickerStrip\";\n import { TrustStrip } from \"@/components/lbb/home/TrustStrip\";\n-import { BackendApiError, getCollection, getProduct } from \"@/lib/backend-api\";\n+import { BackendApiError, getCollection, getProduct, listProducts } from \"@/lib/backend-api\";\n import { backendCard, type BackendCatalogCard } from \"@/lib/backend-storefront\";\n import { listStorefrontCategories, type StorefrontCategoryDto } from \"@/lib/final-technical-api\";\n import { productImage } from \"@/lib/product-images\";\n@@ -26,7 +26,6 @@\n   type StorefrontLookDto,\n } from \"@/lib/storefront-control\";\n import {\n-  resolveStorefrontHomeProducts,\n   resolveStorefrontPresentation,\n   type StorefrontPresentation,\n } from \"@/lib/storefront-presentation\";\n@@ -42,32 +41,19 @@\n   control: Awaited<ReturnType<typeof resolveStorefrontControl>>;\n   presentation: StorefrontPresentation;\n   heroProduct: LiveHeroProduct | null;\n+  heroProducts?: LiveHeroProduct[];\n   categories: StorefrontCategoryDto[] | null;\n   products: BackendCatalogCard[] | null;\n   lookbook: StorefrontLookDto[] | null;\n   featuredStory: LiveFeaturedStory | null;\n };\n \n-async function resolveLiveHeroProduct(slug: string): Promise<LiveHeroProduct | null> {\n-  if (!slug.trim()) return null;\n-  try {\n-    const response = await getProduct(slug);\n-    return {\n-      slug: response.data.slug,\n-      name: response.data.name,\n-      priceToman: response.data.price.from?.amount ?? null,\n-      image: response.data.primaryImage,\n-    };\n-  } catch (error) {\n-    if (\n-      error instanceof BackendApiError &&\n-      error.status === 404 &&\n-      error.code === \"resource_not_found\"\n-    ) {\n-      return null;\n-    }\n-\n-    throw error;\n+async function loadHomeCatalog() {\n+  const products = [];\n+  for (let page = 1; ; page++) {\n+    const result = await listProducts({ page, per_page: 24, sort: \"newest\" });\n+    products.push(...result.data);\n+    if (!result.meta.pagination?.hasMore) return products.map(backendCard);\n   }\n }\n \n@@ -116,22 +102,42 @@\n       };\n     }\n \n-    const [heroProduct, categories, curatedProducts, lookbook, featuredStory] = await Promise.all([\n-      resolveLiveHeroProduct(control.home.heroProductSlug),\n+    const [categories, catalog, lookbook, featuredStory] = await Promise.all([\n       listStorefrontCategories(),\n-      resolveStorefrontHomeProducts(),\n+      loadHomeCatalog(),\n       resolveStorefrontLookbook(),\n       resolveLiveFeaturedStory(control),\n+\n     ]);\n+\n+    const selected = Array.isArray(control.home.heroProductSlugs)\n+      ? control.home.heroProductSlugs\n+      : [];\n+    const heroProducts = (\n+      selected.length\n+        ? selected.flatMap((slug) => catalog.filter((item) => item.slug === slug))\n+        : catalog\n+    ).map((item) => ({\n+      slug: item.slug,\n+      name: item.name,\n+      image: item.primaryImage,\n+      priceToman: item.priceFromToman,\n+    }));\n+    const heroProduct =\n+      heroProducts.find((item) => item.slug === control.home.heroProductSlug) ??\n+      heroProducts[0] ??\n+      null;\n \n     return {\n       control,\n       presentation,\n       heroProduct,\n       categories,\n-      products: curatedProducts.map(backendCard),\n+      heroProducts,\n+      products: catalog,\n       lookbook: lookbook ?? [],\n       featuredStory,\n+\n     };\n   },\n   head: ({ loaderData }) => {\n@@ -195,8 +201,17 @@\n });\n \n function Home() {\n-  const { control, presentation, heroProduct, categories, products, lookbook, featuredStory } =\n-    Route.useLoaderData();\n+  const {\n+    control,\n+    presentation,\n+    heroProduct,\n+    heroProducts,\n+    categories,\n+    products,\n+    lookbook,\n+    featuredStory,\n+\n+  } = Route.useLoaderData();\n   const [barVisible, setBarVisible] = useState(false);\n   const handleBarVisibility = useCallback((visible: boolean) => setBarVisible(visible), []);\n   const offsetTop = barVisible ? ANNOUNCEMENT_HEIGHT : 0;\n@@ -226,7 +241,11 @@\n         data-storefront-source={control.source}\n       >\n         {presentation.hero.enabled ? (\n-          <HeroNarrative heroProduct={heroProduct} liveCategories={categories} />\n+          <HeroNarrative\n+            heroProduct={heroProduct}\n+            heroProducts={heroProducts}\n+            liveCategories={categories}\n+          />\n         ) : null}\n         {control.home.sections.map((key) => (\n           <div key={key}>{sections[key] ?? null}</div>\n", "files": {"src/components/lbb/DecodedCardImage.tsx": "import { useEffect, useState } from \"react\";\n\nexport function DecodedCardImage({\n  src,\n  alt,\n  priority,\n}: {\n  src: string;\n  alt: string;\n  priority: boolean;\n}) {\n  const [current, setCurrent] = useState(src);\n  const [ready, setReady] = useState<string | null>(null);\n  const incoming = src !== current ? src : null;\n  const revealed = incoming !== null && incoming === ready;\n\n  useEffect(() => {\n    if (!revealed || !incoming) return;\n    const timer = window.setTimeout(() => {\n      setCurrent(incoming);\n      setReady(null);\n    }, 300);\n    return () => window.clearTimeout(timer);\n  }, [incoming, revealed]);\n\n  const imageClass = \"absolute inset-0 w-full object-cover\";\n  return (\n    <>\n      <img\n        key={current}\n        src={current}\n        alt={alt}\n        loading={priority ? \"eager\" : \"lazy\"}\n        fetchPriority={priority ? \"high\" : \"auto\"}\n        decoding=\"async\"\n        width={1024}\n        height={1280}\n        style={{ height: \"100%\" }}\n        className={imageClass}\n      />\n      {incoming && (\n        <img\n          key={incoming}\n          src={incoming}\n          alt=\"\"\n          aria-hidden=\"true\"\n          width={1024}\n          height={1280}\n          decoding=\"async\"\n          onLoad={async (event) => {\n            const image = event.currentTarget;\n            try {\n              await image.decode();\n              if (image.isConnected) setReady(incoming);\n            } catch {\n              // Keep the current photo if the incoming image cannot be decoded.\n            }\n          }}\n          style={{ height: \"100%\", opacity: revealed ? 1 : 0 }}\n          className={imageClass + \" pointer-events-none motion-reduce:transition-none\"}\n        />\n      )}\n    </>\n  );\n}\n"}}''')
state=pathlib.Path(sys.argv[1])
patch=state/'home.patch'
patch.write_text(payload['patch'])
for name,content in payload['files'].items():
    p=pathlib.Path(name)
    if p.exists() and p.read_text()!=content:
        raise SystemExit('EXISTING_FILE_DIFFERS: '+name)
subprocess.run(['patch','--batch','--forward','--dry-run','-p1','-i',str(patch)],check=True)
subprocess.run(['patch','--batch','--forward','-p1','-i',str(patch)],check=True)
for name,content in payload['files'].items():
    p=pathlib.Path(name);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
PY_PAYLOAD
if [[ -d .output ]]; then
  old_output=$(mktemp -d "$release/.home-build-backup-XXXXXXXX")
  mv .output "$old_output/output"
fi
VITE_SITE_URL=https://lbbclo.com VITE_LBB_BACKEND_MODE=live VITE_LBB_API_BASE_URL=https://api.lbbclo.com NITRO_PRESET=node-server npm run build
npm run typecheck
node scripts/test-home-autoplay.cjs
[[ -s .output/server/index.mjs ]]
chown -R lbb:lbb "$release"
chmod 755 "$release"
pid=$(systemctl show lbb.service -p MainPID --value)
python3 - "$pid" "$state/runtime.env" <<'PY_ENV'
import pathlib,sys,re
entries=pathlib.Path('/proc/'+sys.argv[1]+'/environ').read_bytes().split(b'\0')
lines=[]
for entry in entries:
    if b'=' not in entry: continue
    k,v=entry.split(b'=',1)
    key=k.decode()
    if not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*',key): continue
    if not key.startswith(('VITE_','NITRO_','NODE_','LBB_','API_')): continue
    value=v.decode().replace('\\','\\\\').replace('"','\\"')
    if '\n' in value: raise SystemExit('MULTILINE_RUNTIME_ENV_NOT_SUPPORTED')
    lines.append(key+'="'+value+'"')
lines+=['NODE_ENV=production','HOST=127.0.0.1','PORT=18574','NITRO_HOST=127.0.0.1','NITRO_PORT=18574']
p=pathlib.Path(sys.argv[2]);p.write_text('\n'.join(lines)+'\n');p.chmod(0o600)
PY_ENV
systemd-run --unit="$unit" --property=User=lbb --property=Group=lbb --property="WorkingDirectory=$release" --property="EnvironmentFile=$state/runtime.env" /usr/bin/node "$release/.output/server/index.mjs"
check_home() {
  local port="$1" file="$state/home-$1.html"
  for attempt in $(seq 1 30); do
    if curl --compressed -fsS --connect-timeout 2 --max-time 10 "http://127.0.0.1:$port/" -o "$file" 2>/dev/null && grep -q 'data-compact-collection' "$file" && grep -q 'data-home-product-carousel' "$file"; then return 0; fi
    sleep 1
  done
  return 1
}
check_home 18574 || { journalctl -u "$unit" -n 25 --no-pager; false; }
echo LBB_HOME_CANARY_OK
rollback_file="/root/lbb-home-rollback-$(date +%Y%m%d-%H%M%S).sh"
printf '#!/usr/bin/env bash\nset -euo pipefail\nln -s %q /var/www/lbb/current.manual-rollback.$$\nmv -Tf /var/www/lbb/current.manual-rollback.$$ /var/www/lbb/current\nsystemctl restart lbb.service\necho LBB_HOME_MANUAL_ROLLBACK_OK\n' "$previous" > "$rollback_file"
chmod 700 "$rollback_file"
ln -s "$release" "/var/www/lbb/current.home.$$"
switched=1
mv -Tf "/var/www/lbb/current.home.$$" /var/www/lbb/current
systemctl restart lbb.service
check_home 5173
prod_pid=$(systemctl show lbb.service -p MainPID --value)
[[ $(readlink -f "/proc/$prod_pid/cwd") == "$release" ]]
systemctl is-active --quiet lbb.service
systemctl stop "$unit.service"
rm -f "$state/runtime.env"
trap - ERR
echo "LBB_HOME_DEPLOY_OK $release"
echo "ROLLBACK_COMMAND=bash $rollback_file"
