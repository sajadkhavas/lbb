import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import fontCss from "../fonts.css?url";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartDrawer } from "@/components/lbb/CartDrawer";
import { ProductQuickView } from "@/components/lbb/ProductQuickView";
import { PwaExperience } from "@/components/lbb/PwaExperience";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart";
import { NavigationOverlayProvider } from "@/lib/navigation-overlay";
import { registerPwa } from "@/lib/pwa";
import { QuickViewProvider } from "@/lib/quickview";
import { absUrl } from "@/lib/site";
import { WishlistProvider } from "@/lib/wishlist";

function NotFoundComponent() {
  return (
    <>
      <title>صفحه پیدا نشد | LBB</title>
      <meta name="robots" content="noindex, nofollow" />
      <main
        id="main"
        dir="rtl"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian px-4 text-bone"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid select-none place-items-center font-display text-[30vw] font-black text-carbon-2"
        >
          404
        </span>
        <div className="relative z-10 max-w-md text-center">
          <p className="tech text-signal">PAGE NOT FOUND</p>
          <h1 className="mt-3 text-display-3">این صفحه وجود ندارد</h1>
          <p className="mt-3 text-sm leading-7 text-metal">شاید مقصد موردنظر جابه‌جا شده باشد.</p>
          <nav aria-label="مسیرهای پیشنهادی" className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/shop"
              className="inline-flex min-h-11 items-center rounded-xl border border-hairline px-4 py-2 text-xs transition-colors hover:border-signal hover:text-signal"
            >
              فروشگاه
            </Link>
            <Link
              to="/$category"
              params={{ category: "hoodies" }}
              className="inline-flex min-h-11 items-center rounded-xl border border-hairline px-4 py-2 text-xs transition-colors hover:border-signal hover:text-signal"
            >
              هودی
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center rounded-xl border border-hairline px-4 py-2 text-xs transition-colors hover:border-signal hover:text-signal"
            >
              تماس
            </Link>
          </nav>
          <Link
            to="/"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-signal px-6 text-xs font-bold text-bone transition-colors hover:bg-bone hover:text-obsidian"
          >
            بازگشت به خانه
          </Link>
        </div>
      </main>
    </>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main
      id="main"
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-obsidian px-4 text-bone"
    >
      <div className="max-w-md text-center">
        <p className="tech text-signal">APPLICATION ERROR</p>
        <h1 className="mt-3 text-display-3">مشکلی پیش آمد</h1>
        <p className="mt-3 text-sm leading-7 text-metal">
          صفحه دوباره بارگذاری می‌شود و اطلاعات سبد خرید شما حفظ خواهد شد.
        </p>
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 min-h-11 rounded-xl bg-signal px-6 text-xs font-bold text-bone transition-colors hover:bg-bone hover:text-obsidian"
        >
          تلاش مجدد
        </button>
      </div>
    </main>
  );
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LBB",
  url: absUrl("/"),
  logo: absUrl("/icons/icon-512.png"),
  description: "برند پوشاک استریت‌ویر ایرانی",
  sameAs: ["https://www.instagram.com/lbbclo"],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "LBB" },
      { name: "theme-color", content: "#050505" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "LBB" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:site_name", content: "LBB" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: fontCss },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(orgJsonLd) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    void registerPwa();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationOverlayProvider>
        <WishlistProvider>
          <CartProvider>
            <QuickViewProvider>
              <Outlet />
              <CartDrawer />
              <ProductQuickView />
              <PwaExperience />
              <Toaster position="bottom-left" dir="rtl" richColors closeButton />
            </QuickViewProvider>
          </CartProvider>
        </WishlistProvider>
      </NavigationOverlayProvider>
    </QueryClientProvider>
  );
}
