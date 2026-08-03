import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { CartDrawer } from "@/components/lbb/CartDrawer";
import { QuickViewProvider } from "@/lib/quickview";
import { ProductQuickView } from "@/components/lbb/ProductQuickView";
import { Toaster } from "@/components/ui/sonner";
import { registerPwa } from "@/lib/pwa";


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
          <Link to="/shop" className="rounded-full border border-white/25 px-4 py-2 text-[12px]">فروشگاه</Link>
          <Link to="/$category" params={{ category: "hoodies" }} className="rounded-full border border-white/25 px-4 py-2 text-[12px]">هودی</Link>
          <Link to="/contact" className="rounded-full border border-white/25 px-4 py-2 text-[12px]">تماس</Link>
        </div>
        <Link to="/" className="mt-6 inline-block rounded-md bg-[var(--lbb-red)] px-6 py-3 text-xs font-bold text-white">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-white px-4 text-black" style={{ fontFamily: "var(--font-body)" }}>
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">مشکلی پیش اومد</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-md bg-[var(--lbb-red)] px-6 py-2 text-xs font-bold text-white">
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LBB",
  url: "/",
  logo: "/icons/icon-512.png",
  description: "برند پوشاک استریت‌ویر ایرانی",
  sameAs: ["https://www.instagram.com/lbbclo"],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "LBB" },
      { name: "theme-color", content: "#0A0A0A" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "LBB" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:site_name", content: "LBB" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Estedad:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },

    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(orgJsonLd) },
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
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
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
            <Toaster position="bottom-left" dir="rtl" richColors closeButton />
          </QuickViewProvider>
        </CartProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}

