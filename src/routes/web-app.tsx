import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";

import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import { WebAppPushPanel } from "@/components/lbb/WebAppPushPanel";
import { Band, Shell, TechLabel } from "@/components/lbb/ui/primitives";
import { canonical, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/web-app")({
  head: () => ({
    meta: pageMeta({
      title: "Web App و اعلان‌ها | LBB",
      description: "تنظیم نصب Web App و اعلان‌های سفارش LBB.",
      path: "/web-app",
      noindex: true,
    }),
    links: canonical("/web-app"),
  }),
  component: WebAppPage,
});

function WebAppPage() {
  return (
    <>
      <Navbar theme="dark" />
      <main
        id="main"
        dir="rtl"
        className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] text-bone md:pb-0"
      >
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "Web App و اعلان‌ها" }]} />
        </Shell>
        <header className="border-b border-hairline">
          <Shell className="py-12 md:py-16">
            <TechLabel tone="signal">LBB / WEB APP / PUSH</TechLabel>
            <h1 className="mt-3 text-display-2">Web App و اعلان‌های سفارش</h1>
            <p className="mt-4 max-w-[62ch] text-sm leading-8 text-metal">
              نصب فروشگاه روی دستگاه و کنترل اعلان‌ها کاملاً اختیاری است. مجوز اعلان فقط وقتی خودت دکمه فعال‌سازی را بزنی درخواست می‌شود.
            </p>
          </Shell>
        </header>
        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>
            <WebAppPushPanel />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/account"
                className="inline-flex min-h-11 items-center gap-2 border border-hairline px-5 text-sm font-bold text-bone transition-colors hover:border-signal"
              >
                حساب کاربری
                <ArrowUpLeft size={16} aria-hidden="true" />
              </Link>
              <Link
                to="/privacy"
                className="inline-flex min-h-11 items-center gap-2 border border-hairline px-5 text-sm font-bold text-metal transition-colors hover:border-signal hover:text-bone"
              >
                حریم خصوصی
              </Link>
            </div>
          </Shell>
        </Band>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
