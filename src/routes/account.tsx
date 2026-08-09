import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpLeft,
  Heart,
  Loader2,
  LogOut,
  PackageSearch,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CustomerOtpAuth } from "@/components/lbb/CustomerOtpAuth";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import {
  Band,
  CtaClasses,
  DemoNotice,
  EmptyState,
  Shell,
  StatePanel,
  Surface,
  TechLabel,
} from "@/components/lbb/ui/primitives";
import {
  backendErrorMessage,
  cancelOrder,
  getCurrentCustomer,
  isAuthenticationError,
  isLiveBackend,
  listOrders,
  logoutCustomer,
  type CustomerDto,
  type OrderDto,
} from "@/lib/backend-api";
import { ensureBackendCsrf, resetBackendCsrf } from "@/lib/backend-session";
import { fmtToman } from "@/lib/products";
import { canonical, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: pageMeta({
      title: "حساب کاربری | LBB",
      description: "حساب مشتری و سفارش‌های LBB.",
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
    body: "Variantهای انتخاب‌شده؛ قیمت و موجودی هنگام Checkout دوباره از Backend خوانده می‌شوند.",
    to: "/cart" as const,
    icon: ShoppingBag,
  },
];

function AccountPage() {
  return isLiveBackend() ? <LiveAccount /> : <PrototypeAccount />;
}

function LiveAccount() {
  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setActionError(null);
    try {
      const response = await listOrders(1, 20);
      setOrders(response.data);
    } catch (cause) {
      if (isAuthenticationError(cause)) {
        setCustomer(null);
        setOrders([]);
      } else {
        setActionError(backendErrorMessage(cause));
      }
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCurrentCustomer()
      .then((response) => {
        if (cancelled) return;
        setCustomer(response.data.user);
      })
      .catch((cause) => {
        if (cancelled) return;
        if (isAuthenticationError(cause)) {
          setCustomer(null);
        } else {
          setError(backendErrorMessage(cause));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (customer) void loadOrders();
  }, [customer, loadOrders]);

  const logout = async () => {
    setActionError(null);
    try {
      await ensureBackendCsrf();
      await logoutCustomer();
      resetBackendCsrf();
      setCustomer(null);
      setOrders([]);
    } catch (cause) {
      setActionError(backendErrorMessage(cause));
    }
  };

  const cancel = async (order: OrderDto) => {
    if (!order.canCancel) return;
    setBusyOrder(order.id);
    setActionError(null);
    try {
      await ensureBackendCsrf();
      const response = await cancelOrder(order.id);
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? response.data.order : item)),
      );
    } catch (cause) {
      setActionError(backendErrorMessage(cause));
    } finally {
      setBusyOrder(null);
    }
  };

  return (
    <AccountChrome>
      {loading ? (
        <p className="mt-8 flex items-center gap-2 text-sm text-metal" role="status">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          در حال بررسی نشست مشتری…
        </p>
      ) : error ? (
        <div className="mt-8">
          <StatePanel title="Backend حساب در دسترس نیست" tone="warning">{error}</StatePanel>
        </div>
      ) : !customer ? (
        <div className="mt-8 max-w-[620px]">
          <CustomerOtpAuth
            title="ورود به حساب LBB"
            description="سفارش‌ها فقط بعد از ورود واقعی و از Backend نمایش داده می‌شوند."
            onAuthenticated={setCustomer}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <Surface tone="raised" className="p-5 md:p-6">
              <TechLabel tone="signal">AUTHENTICATED CUSTOMER</TechLabel>
              <h2 className="mt-2 text-xl font-bold text-bone">
                {customer.fullName?.trim() || "مشتری LBB"}
              </h2>
              <p className="mt-2 num text-sm text-metal" dir="ltr">{customer.mobile}</p>
              {customer.email ? <p className="mt-1 text-sm text-metal">{customer.email}</p> : null}
            </Surface>
            <button type="button" onClick={logout} className={CtaClasses("line")}>
              <LogOut size={16} aria-hidden="true" />
              خروج
            </button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to} className="group block">
                  <Surface tone="raised" className="h-full p-5 transition-colors group-hover:border-signal md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center border border-hairline text-signal"><Icon size={19} aria-hidden="true" /></span>
                      <ArrowUpLeft size={18} aria-hidden="true" className="text-mute group-hover:text-signal" />
                    </div>
                    <h2 className="mt-7 text-title text-bone">{action.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-metal">{action.body}</p>
                  </Surface>
                </Link>
              );
            })}
          </div>

          <section className="mt-10" aria-labelledby="account-orders-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <TechLabel tone="signal">ORDERS / BACKEND</TechLabel>
                <h2 id="account-orders-title" className="mt-2 text-display-3 text-bone">سفارش‌های من</h2>
              </div>
              <button type="button" onClick={() => void loadOrders()} disabled={ordersLoading} className={CtaClasses("line")}>
                {ordersLoading ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
                تازه‌سازی
              </button>
            </div>

            {actionError ? <div className="mt-4"><StatePanel title="عملیات حساب کامل نشد" tone="warning">{actionError}</StatePanel></div> : null}

            {ordersLoading && orders.length === 0 ? (
              <p className="mt-6 flex items-center gap-2 text-sm text-metal"><Loader2 size={16} className="animate-spin" aria-hidden="true" />در حال دریافت سفارش‌ها…</p>
            ) : orders.length === 0 ? (
              <EmptyState className="mt-6" icon={<PackageSearch size={38} aria-hidden="true" />} title="هنوز سفارشی ثبت نشده است" body="فقط سفارش‌های واقعی متعلق به همین نشست مشتری نمایش داده می‌شوند." />
            ) : (
              <div className="mt-6 space-y-3">
                {orders.map((order) => (
                  <Surface key={order.id} tone="raised" className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-bone">سفارش {order.number}</p>
                        <p className="mt-1 text-xs text-metal">{order.statusLabel} · {order.paymentStatusLabel}</p>
                        {order.placedAt ? <p className="mt-1 text-xs text-mute">{new Date(order.placedAt).toLocaleString("fa-IR")}</p> : null}
                      </div>
                      <div className="text-end">
                        <p className="num font-bold text-bone">{fmtToman(order.totals.grandTotal.amount)}</p>
                        <p className="mt-1 text-xs text-metal">{order.itemCount.toLocaleString("fa-IR")} قلم</p>
                      </div>
                    </div>
                    {order.canCancel ? (
                      <button type="button" onClick={() => void cancel(order)} disabled={busyOrder === order.id} className="mt-4 min-h-11 border border-hairline px-4 text-xs font-semibold text-metal hover:border-signal hover:text-signal disabled:opacity-50">
                        {busyOrder === order.id ? "در حال لغو…" : "لغو سفارش واجد شرایط"}
                      </button>
                    ) : null}
                  </Surface>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </AccountChrome>
  );
}

function AccountChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar theme="dark" />
      <main id="main" dir="rtl" className="min-h-screen bg-obsidian pb-bottombar pt-[var(--lbb-nav-h)] text-bone md:pb-0">
        <Shell className="border-b border-hairline py-4">
          <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "حساب کاربری" }]} />
        </Shell>
        <header className="border-b border-hairline">
          <Shell className="grid gap-8 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:py-16">
            <div>
              <TechLabel tone="signal">ACCOUNT / CUSTOMER SESSION</TechLabel>
              <h1 className="mt-3 text-display-2">مرکز حساب</h1>
              <p className="mt-4 max-w-[54ch] text-sm leading-8 text-metal">در حالت live هویت و سفارش‌ها از Backend می‌آیند؛ وضعیت ساختگی در حساب نمایش داده نمی‌شود.</p>
            </div>
            <div className="grid h-20 w-20 place-items-center border border-hairline bg-carbon text-signal"><UserRound size={30} strokeWidth={1.4} aria-hidden="true" /></div>
          </Shell>
        </header>
        <Band hairline={false} className="!py-10 md:!py-14"><Shell>{children}</Shell></Band>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function PrototypeAccount() {
  return (
    <AccountChrome>
      <DemoNotice title="حساب واقعی در حالت Prototype متصل نیست">ورود، ثبت‌نام و سفارش واقعی فقط در Backend mode live فعال می‌شوند. علاقه‌مندی و سبد این حالت در مرورگر فعلی نگه‌داری می‌شوند.</DemoNotice>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {[...actions, { title: "پیگیری سفارش", body: "بررسی مرجع نمایشی همان تب.", to: "/track-order" as const, icon: PackageSearch }].map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.to} to={action.to} className="group block">
              <Surface tone="raised" className="h-full p-5 transition-colors group-hover:border-signal md:p-7">
                <span className="grid h-11 w-11 place-items-center border border-hairline text-signal"><Icon size={19} aria-hidden="true" /></span>
                <h2 className="mt-7 text-title text-bone">{action.title}</h2>
                <p className="mt-2 text-sm leading-7 text-metal">{action.body}</p>
              </Surface>
            </Link>
          );
        })}
      </div>
      <StatePanel title="Product Truth" tone="info" className="mt-8">حالت Prototype هیچ پروفایل یا تاریخچه خرید واقعی جعل نمی‌کند.</StatePanel>
    </AccountChrome>
  );
}
