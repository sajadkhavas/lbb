#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

backend=$(readlink -e /var/www/lbb/backend/current)
config=/etc/nginx/sites-available/lbb-api
guard="$backend/routes/media-publication.php"
rollback=/root/lbb-media-publication-rollback.sh
[[ $backend == /var/www/lbb/backend/releases/* && -f "$backend/routes/web.php" ]]
[[ ! -e "$guard" && ! -e "$rollback" ]]
[[ $(grep -Fc 'root /var/www/lbb/backend/current/public;' "$config") == 1 ]]
[[ $(grep -Fc 'fastcgi_param SCRIPT_FILENAME $realpath_root/index.php;' "$config") == 1 ]]
[[ $(grep -Fc 'fastcgi_param  REQUEST_URI        $request_uri;' /etc/nginx/fastcgi_params) == 1 ]] ||
    grep -Eq '^[[:space:]]*fastcgi_param[[:space:]]+REQUEST_URI[[:space:]]+\$request_uri;' /etc/nginx/fastcgi_params
nginx -t

host=api.lbbclo.com
origin_status() {
    curl -sS --connect-timeout 5 --max-time 15 --resolve "$host:443:127.0.0.1" -o /dev/null -w '%{http_code}' "https://$host$1"
}
inactive_path=$(cd "$backend" && php artisan tinker --execute='
    $product = App\Models\Product::query()->where("slug", "superior-boxy-bomber-jacket")->firstOrFail();
    if (app(App\Domain\Catalog\PublicCatalogQuery::class)->publishedProducts()->whereKey($product->getKey())->exists()) {
        throw new RuntimeException("The test product is public.");
    }
    $owners = App\Models\ProductMediaAsset::query()->where("product_id", $product->getKey())->get()->push($product);
    foreach ($owners as $owner) {
        foreach ($owner->media as $media) {
            if ($media->disk === "public" && Illuminate\Support\Facades\Storage::disk("public")->exists($media->getPathRelativeToRoot())) {
                echo $media->getPathRelativeToRoot();
                return;
            }
        }
    }
')
if [[ ! $inactive_path =~ ^[0-9]+/[a-zA-Z0-9_./-]+$ ]]; then
    echo INACTIVE_PRODUCT_MEDIA_NOT_FOUND >&2
    exit 1
fi
inactive="/storage/$inactive_path"
echo "INACTIVE_PRODUCT_TEST_PATH=$inactive"
active_path=$(cd "$backend" && php artisan tinker --execute='echo (string) App\Models\GalleryItem::active()->where("image_path","like","storefront/lookbook/%")->value("image_path");')
[[ $active_path =~ ^storefront/lookbook/[a-zA-Z0-9_./%-]+$ ]]
[[ $(origin_status "/storage/$active_path") == 200 ]]
collection=/storage/70/conversions/lbb-diamond-nature-streetwear-preview.webp
[[ $(origin_status "$collection") == 200 ]]
product_path=$(cd "$backend" && php artisan tinker --execute='echo (string) App\Models\ProductMediaAsset::query()->whereHas("product", fn ($q) => $q->whereIn("id", app(App\Domain\Catalog\PublicCatalogQuery::class)->publishedProducts()->select("products.id")))->whereHas("media", fn ($q) => $q->where("disk", "public"))->with("media")->first()?->media->first()?->getPathRelativeToRoot();')
[[ $product_path =~ ^[0-9]+/[a-zA-Z0-9_./-]+$ ]]
[[ $product_path != "$inactive_path" ]]
echo "ACTIVE_PRODUCT_TEST_PATH=/storage/$product_path"
[[ $(origin_status "/storage/$product_path") == 200 ]]
[[ $(origin_status /health) == 200 ]]

backup=$(mktemp -d /root/lbb-media-publication.XXXXXXXX)
cp -a "$config" "$backup/nginx"
cp -a "$backend/routes/web.php" "$backup/web.php"
{
    echo '#!/usr/bin/env bash'
    echo 'set -euo pipefail'
    printf 'backend=%q\nconfig=%q\nbackup=%q\n' "$backend" "$config" "$backup"
    cat <<'UNDO'
cp -a "$backup/nginx" "$config"
nginx -t
systemctl reload nginx
cp -a "$backup/web.php" "$backend/routes/web.php"
rm -f "$backend/routes/media-publication.php"
cd "$backend"
runuser -u lbbapi -- php artisan route:clear
echo LBB_MEDIA_ROLLBACK_OK
UNDO
} > "$rollback"
chmod 700 "$rollback"
trap 'rc=$?; trap - ERR; bash "$rollback" && rm -f "$rollback"; exit "$rc"' ERR

cat > "$backup/media-publication.php" <<'PHP'
<?php

use App\Domain\Catalog\PublicCatalogQuery;
use App\Models\Collection;
use App\Models\GalleryItem;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductMediaAsset;
use Filament\Facades\Filament;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/storage/{path}', function (string $path) {
    $headers = [
        'Cache-Control' => 'private, no-store, max-age=0',
        'X-Content-Type-Options' => 'nosniff',
    ];
    $denied = static fn () => response('', 404, $headers + ['X-Robots-Tag' => 'noindex']);
    if (preg_match('~[\x00-\x1f\x7f]|(?:^|/)\.{1,2}(?:/|$)~', $path)
        || ! preg_match('~\.(?:avif|gif|jpe?g|png|webp)\z~i', $path)) {
        return $denied();
    }

    if (str_starts_with($path, 'storefront/journal/')) {
        $public = Post::published()->where('cover_image_path', $path)->exists();
    } elseif (str_starts_with($path, 'storefront/lookbook/')) {
        $public = GalleryItem::active()->where('image_path', $path)->exists();
    } elseif (str_starts_with($path, 'storefront/collections/')) {
        $public = Collection::published()->where('cover_image_path', $path)->exists();
    } else {
        $mediaClass = config('media-library.media_model');
        $media = $mediaClass::query()->find(explode('/', $path, 2)[0]);
        $public = false;
        if ($media !== null) {
            $owner = $media->model;
            $productId = match (true) {
                $owner instanceof Product => $owner->getKey(),
                $owner instanceof ProductMediaAsset => $owner->product_id,
                default => null,
            };
            $public = $productId !== null
                && app(PublicCatalogQuery::class)->publishedProducts()->whereKey($productId)->exists();
        }
        // A collection can reference a copied conversion after its media row is gone.
        $public = $public || Collection::published()->where('cover_image_path', $path)->exists();
    }

    if (! $public) {
        $admin = Auth::guard('web')->user();
        if (! $admin instanceof FilamentUser || ! $admin->canAccessPanel(Filament::getPanel('admin'))) {
            return $denied();
        }
        $headers['X-Robots-Tag'] = 'noindex';
    }

    $storage = Storage::disk('public');
    $root = realpath($storage->path(''));
    $file = realpath($storage->path($path));

    if ($root === false || $file === false || ! str_starts_with($file, $root.DIRECTORY_SEPARATOR) || ! is_file($file)) {
        return $denied();
    }

    return response()->file($file, $headers);
})->where('path', '(?:[0-9]+/|storefront/(?:journal|lookbook|collections)/).+');
PHP
php -l "$backup/media-publication.php"
install -m 0644 "$backup/media-publication.php" "$guard"
printf "\nrequire __DIR__.'/media-publication.php';\n" >> "$backend/routes/web.php"
php -l "$backend/routes/web.php"
(cd "$backend" && runuser -u lbbapi -- php artisan route:clear && runuser -u lbbapi -- php artisan route:list --path=storage)

python3 - "$config" <<'PY'
from pathlib import Path
import sys

config = Path(sys.argv[1])
text = config.read_text()
anchor = "    root /var/www/lbb/backend/current/public;\n"
location = """
    location ~ ^/storage/([0-9]+/|storefront/(journal|lookbook|collections)/) {
        rewrite ^ /index.php last;
    }
"""
assert text.count(anchor) == 1
config.write_text(text.replace(anchor, anchor + location))
PY
nginx -t
systemctl reload nginx

expect_origin() {
    local label=$1 expected=$2 path=$3 code attempt
    for attempt in {1..5}; do
        code=$(origin_status "$path") || code=unavailable
        [[ $code == "$expected" ]] && break
        sleep 1
    done
    printf '%s_ORIGIN=%s EXPECTED=%s PATH=%s\n' "$label" "$code" "$expected" "$path"
    [[ $code == "$expected" ]]
}

failed=0
expect_origin INACTIVE_PRODUCT 404 "$inactive" || failed=1
expect_origin ACTIVE_LOOKBOOK 200 "/storage/$active_path" || failed=1
expect_origin ACTIVE_COLLECTION 200 "$collection" || failed=1
expect_origin ACTIVE_PRODUCT 200 "/storage/$product_path" || failed=1
expect_origin API_HEALTH 200 /health || failed=1
[[ $failed == 0 ]]
echo "LBB_MEDIA_GATE_ORIGIN_OK"
echo "ROLLBACK_COMMAND=bash $rollback"
curl -sS --connect-timeout 5 --max-time 15 -o /dev/null -w 'INACTIVE_PRODUCT_PUBLIC=%{http_code}\n' "https://$host$inactive" || true
