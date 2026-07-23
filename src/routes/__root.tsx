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

function NotFoundComponent() {
  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-white px-4 text-black" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[var(--lbb-red)]">۴۰۴</h1>
        <p className="mt-2 text-sm text-black/60">صفحه‌ای که دنبالش هستی وجود نداره.</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-[var(--lbb-red)] px-6 py-2 text-xs font-bold text-white">
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
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-white px-4 text-black" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
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
  logo: "/favicon.ico",
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
      { property: "og:site_name", content: "LBB" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fa_IR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
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
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </QueryClientProvider>
  );
}
