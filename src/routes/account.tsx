import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpLeft, Heart, PackageSearch, ShoppingBag, UserRound } from "lucide-react";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import {
  Band,
  DemoNotice,
  Shell,
  StatePanel,
  Surface,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import { canonical, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: pageMeta({
      title: "حساب کاربری | LBB",
      description: "مرکز نمایشی حساب، علاقه‌مندی‌ها، سبد و پیگیری سفارش LBB.",
      path: "/account",
      noindex: true,
    }),
    links: canonical("/account"),
  }),
  component: AccountPage,
});

const actions = [
  {
    title: "علاقه‌مندی‌ها",
    body: "محصولاتی که روی همین مرورگر نشان کرده‌ای.",
    to: "/wishlist" as const,
    icon: Heart,
  },
  {
    title: "سبد خرید",
    body: "محصولات و Variantهای ذخیره‌شده روی همین دستگاه.",
    to: "/cart" as const,
    icon: ShoppingBag,
  },
  {
    title: "پیگیری سفارش",
    body: "بررسی مرجع سفارش نمایشی ایجادشده در همین تب.",
    to: "/track-order" as const,
    icon: PackageSearch,
  },
];

function AccountPage() {
  return (
    <>
      <Navbar theme="dark" />
      <main
        id="main"
        dir="rtl"
        className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] text-bone md:pb-0"
      >
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "حساب کاربری" }]} />
        </Shell>

        <header className="border-b border-hairline">
          <Shell className="grid gap-8 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:py-16">
            <div>
              <TechLabel tone="signal">ACCOUNT / FRONTEND ONLY</TechLabel>
              <h1 className="mt-3 text-display-2">مرکز حساب</h1>
              <p className="mt-4 max-w-[54ch] text-sm leading-8 text-metal">
                یک مقصد مستقل برای مسیرهای شخصی رابط کاربری؛ بدون وانمودکردن به وجود ورود، پروفایل یا Backend فعال.
              </p>
            </div>
            <div className="grid h-20 w-20 place-items-center border border-hairline bg-carbon text-signal">
              <UserRound size={30} strokeWidth={1.4} aria-hidden="true" />
            </div>
          </Shell>
        </header>

        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>
            <DemoNotice title="حساب واقعی هنوز متصل نیست">
              ورود، ثبت‌نام، همگام‌سازی بین دستگاه‌ها و اطلاعات پروفایل در این فاز فعال نیستند. علاقه‌مندی و سبد فقط در مرورگر فعلی نگه‌داری می‌شوند.
            </DemoNotice>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.to} to={action.to} className="group block">
                    <Surface tone="raised" className="h-full p-5 transition-colors group-hover:border-signal md:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <span className="grid h-11 w-11 place-items-center border border-hairline text-signal">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <ArrowUpLeft size={18} aria-hidden="true" className="text-mute group-hover:text-signal" />
                      </div>
                      <h2 className="mt-7 text-title text-bone">{action.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-metal">{action.body}</p>
                    </Surface>
                  </Link>
                );
              })}
            </div>

            <StatePanel title="اصل Product Truth در حساب" tone="info" className="mt-8">
              تا زمانی که سرویس هویت و سفارش واقعی متصل نشده، این صفحه وضعیت جعلی، امتیاز، آدرس یا تاریخچه خرید ساختگی نمایش نمی‌دهد.
            </StatePanel>
          </Shell>
        </Band>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}
