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
import { EMPTY_FILTERS } from "@/lib/product-filter";
import { registerPwa } from "@/lib/pwa";
import { QuickViewProvider } from "@/lib/quickview";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  organizationLd,
  serializeJsonLd,
  websiteLd,
} from "@/lib/site";
import { WishlistProvider } from "@/lib/wishlist";

function NotFoundComponent() {
  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0A] px-4 text-white"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center font-black"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "30vw",
          color: "rgba(255,255,255,0.04)",
        }}
      >
        404
      </span>
      <div className="relative z-10 max-w-md text-center">
        <h1 className="text-[24px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
          این صفحه وجود ندارد
        </h1>
        <p className="mt-2 text-[13px] text-white/50">شاید دنبال یکی از این‌ها بودید:</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            to="/shop"
            search={EMPTY_FILTERS}
            className="rounded-full border border-white/25 px-4 py-2 text-[12px]"
          >
            فروشگاه
          </Link>
          <Link
            to="/$category"
            params={{ category: "hoodies" }}
            search={EMPTY_FILTERS}
            className="rounded-full border border-white/25 px-4 py-2 text-[12px]"
          >
            هودی
          </Link>
          <Link to="/contact" className="rounded-full border border-white/25 px-4 py-2 text-[12px]">
            تماس
          </Link>
        </div>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-[var(--lbb-red)] px-6 py-3 text-xs font-bold text-white"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-white px-4 text-black"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">مشکلی پیش اومد</h1>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-4 rounded-md bg-[var(--lbb-red)] px-6 py-2 text-xs font-bold text-white"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: "LBB — پوشاک استریت‌ویر ایرانی" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#0A0A0A" },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: SITE_NAME },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: SITE_LOCALE },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: fontCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      { type: "application/ld+json", children: serializeJsonLd(organizationLd()) },
      { type: "application/ld+json", children: serializeJsonLd(websiteLd()) },
    ],
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
    </QueryClientProvider>
  );
}
