import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpLeft,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  PackageSearch,
  Pencil,
  Plus,
  Save,
  ShoppingBag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Breadcrumb } from "@/components/lbb/Breadcrumb";
import { CustomerOtpAuth } from "@/components/lbb/CustomerOtpAuth";
import { Footer } from "@/components/lbb/Footer";
import { MobileBottomBar } from "@/components/lbb/MobileBottomBar";
import { Navbar } from "@/components/lbb/Navbar";
import {
  Band,
  CtaClasses,
  EmptyState,
  Shell,
  StatePanel,
  Surface,
} from "@/components/lbb/ui/primitives";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  listCustomerAddresses,
  updateCustomerAddress,
  updateCustomerProfile,
  type CustomerAddressDto,
  type CustomerAddressInput,
} from "@/lib/account-api";
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
      description: "مدیریت مشخصات، آدرس‌ها و سفارش‌های حساب LBB.",
      path: "/account",
      noindex: true,
    }),
    links: canonical("/account"),
  }),
  component: AccountPage,
});

const inputClass =
  "min-h-12 w-full border border-hairline bg-obsidian px-4 text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30";

const actions = [
  {
    title: "علاقه‌مندی‌ها",
    body: "محصولاتی که برای بعد ذخیره کرده‌اید.",
    to: "/wishlist" as const,
    icon: Heart,
  },
  {
    title: "سبد خرید",
    body: "اقلام انتخاب‌شده و ادامه مسیر خرید.",
    to: "/cart" as const,
    icon: ShoppingBag,
  },
  {
    title: "پیگیری سفارش",
    body: "وضعیت سفارش را با اطلاعات سفارش بررسی کنید.",
    to: "/track-order" as const,
    icon: PackageSearch,
  },
];

type AddressDraft = CustomerAddressInput & { id?: string };

function emptyAddress(customer: CustomerDto): AddressDraft {
  return {
    title: "آدرس من",
    recipientName: customer.fullName?.trim() || "",
    mobile: customer.mobile,
    province: "",
    city: "",
    address: "",
    postalCode: "",
    isDefault: false,
  };
}

function AccountPage() {
  return isLiveBackend() ? <LiveAccount /> : <PrototypeAccount />;
}

function LiveAccount() {
  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<string | null>(null);
  const [addressDraft, setAddressDraft] = useState<AddressDraft | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  const syncProfileFields = useCallback((value: CustomerDto) => {
    setFullName(value.fullName ?? "");
    setEmail(value.email ?? "");
    setMarketingConsent(value.marketingConsent);
  }, []);

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

  const loadAddresses = useCallback(async () => {
    setAddressesLoading(true);
    setActionError(null);
    try {
      const response = await listCustomerAddresses();
      setAddresses(response.data);
    } catch (cause) {
      if (isAuthenticationError(cause)) {
        setCustomer(null);
        setAddresses([]);
      } else {
        setActionError(backendErrorMessage(cause));
      }
    } finally {
      setAddressesLoading(false);
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
        syncProfileFields(response.data.user);
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
  }, [syncProfileFields]);

  useEffect(() => {
    if (!customer) return;
    void Promise.all([loadOrders(), loadAddresses()]);
  }, [customer, loadAddresses, loadOrders]);

  const logout = async () => {
    setActionError(null);
    try {
      await ensureBackendCsrf();
      await logoutCustomer();
      resetBackendCsrf();
      setCustomer(null);
      setOrders([]);
      setAddresses([]);
      setAddressDraft(null);
    } catch (cause) {
      setActionError(backendErrorMessage(cause));
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaving(true);
    setActionError(null);
    try {
      await ensureBackendCsrf();
      const response = await updateCustomerProfile({
        fullName: fullName.trim() || null,
        email: email.trim() || null,
        marketingConsent,
      });
      setCustomer(response.data.user);
      syncProfileFields(response.data.user);
    } catch (cause) {
      setActionError(backendErrorMessage(cause));
    } finally {
      setProfileSaving(false);
    }
  };

  const saveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addressDraft) return;
    setAddressSaving(true);
    setActionError(null);
    try {
      await ensureBackendCsrf();
      const payload: CustomerAddressInput = {
        title: addressDraft.title.trim(),
        recipientName: addressDraft.recipientName.trim(),
        mobile: addressDraft.mobile.trim(),
        province: addressDraft.province.trim(),
        city: addressDraft.city.trim(),
        address: addressDraft.address.trim(),
        postalCode: addressDraft.postalCode?.trim() || null,
        isDefault: Boolean(addressDraft.isDefault),
      };
      if (addressDraft.id) {
        await updateCustomerAddress(addressDraft.id, payload);
      } else {
        await createCustomerAddress(payload);
      }
      setAddressDraft(null);
      await loadAddresses();
    } catch (cause) {
      setActionError(backendErrorMessage(cause));
    } finally {
      setAddressSaving(false);
    }
  };

  const removeAddress = async (address: CustomerAddressDto) => {
    setDeletingAddress(address.id);
    setActionError(null);
    try {
      await ensureBackendCsrf();
      await deleteCustomerAddress(address.id);
      if (addressDraft?.id === address.id) setAddressDraft(null);
      await loadAddresses();
    } catch (cause) {
      setActionError(backendErrorMessage(cause));
    } finally {
      setDeletingAddress(null);
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
          در حال آماده‌کردن حساب…
        </p>
      ) : error ? (
        <div className="mt-8">
          <StatePanel title="حساب کاربری در دسترس نیست" tone="warning">
            {error}
          </StatePanel>
        </div>
      ) : !customer ? (
        <div className="mt-8 max-w-[620px]">
          <CustomerOtpAuth
            title="ورود به حساب LBB"
            description="برای دیدن سفارش‌ها، آدرس‌ها و اطلاعات حساب وارد شوید."
            onAuthenticated={(value) => {
              setCustomer(value);
              syncProfileFields(value);
            }}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <Surface tone="raised" className="p-5 md:p-6">
              <h2 className="text-xl font-bold text-bone">
                {customer.fullName?.trim() || "مشتری LBB"}
              </h2>
              <p className="mt-2 num text-sm text-metal" dir="ltr">
                {customer.mobile}
              </p>
              {customer.email ? <p className="mt-1 text-sm text-metal">{customer.email}</p> : null}
            </Surface>
            <button type="button" onClick={logout} className={CtaClasses("line")}>
              <LogOut size={16} aria-hidden="true" />
              خروج
            </button>
          </div>

          {actionError ? (
            <div className="mt-5">
              <StatePanel title="عملیات کامل نشد" tone="warning">
                {actionError}
              </StatePanel>
            </div>
          ) : null}

          <section className="mt-10" aria-labelledby="account-profile-title">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-signal">اطلاعات شخصی</p>
                <h2 id="account-profile-title" className="mt-2 text-display-3 text-bone">
                  مشخصات حساب
                </h2>
              </div>
            </div>
            <Surface tone="raised" className="mt-5 p-5 md:p-6">
              <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold text-metal">
                  نام و نام خانوادگی
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold text-metal">
                  ایمیل
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className={`${inputClass} text-left`}
                  />
                </label>
                <label className="flex min-h-12 items-center gap-3 border border-hairline bg-obsidian px-4 text-sm text-metal md:col-span-2">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(event) => setMarketingConsent(event.target.checked)}
                    className="h-4 w-4 accent-signal"
                  />
                  دریافت اطلاع‌رسانی‌های فروشگاه
                </label>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className={CtaClasses("signal")}
                  >
                    {profileSaving ? (
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Save size={16} aria-hidden="true" />
                    )}
                    ذخیره مشخصات
                  </button>
                </div>
              </form>
            </Surface>
          </section>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to} className="group block">
                  <Surface
                    tone="raised"
                    className="h-full p-5 transition-colors group-hover:border-signal md:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 place-items-center border border-hairline text-signal">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <ArrowUpLeft
                        size={18}
                        aria-hidden="true"
                        className="text-mute group-hover:text-signal"
                      />
                    </div>
                    <h2 className="mt-6 text-title text-bone">{action.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-metal">{action.body}</p>
                  </Surface>
                </Link>
              );
            })}
          </div>

          <section className="mt-10" aria-labelledby="account-addresses-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-signal">ارسال سفارش</p>
                <h2 id="account-addresses-title" className="mt-2 text-display-3 text-bone">
                  آدرس‌های من
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAddressDraft(emptyAddress(customer))}
                className={CtaClasses("line")}
              >
                <Plus size={16} aria-hidden="true" />
                افزودن آدرس
              </button>
            </div>

            {addressDraft ? (
              <Surface tone="raised" className="mt-5 p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-bone">
                    {addressDraft.id ? "ویرایش آدرس" : "آدرس جدید"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setAddressDraft(null)}
                    className="grid h-10 w-10 place-items-center text-metal hover:text-bone"
                    aria-label="بستن فرم آدرس"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={saveAddress} className="mt-5 grid gap-4 md:grid-cols-2">
                  <AddressInput
                    label="عنوان آدرس"
                    value={addressDraft.title}
                    onChange={(value) => setAddressDraft((current) => current && { ...current, title: value })}
                  />
                  <AddressInput
                    label="نام تحویل‌گیرنده"
                    value={addressDraft.recipientName}
                    onChange={(value) =>
                      setAddressDraft((current) => current && { ...current, recipientName: value })
                    }
                  />
                  <AddressInput
                    label="شماره موبایل"
                    value={addressDraft.mobile}
                    dir="ltr"
                    onChange={(value) => setAddressDraft((current) => current && { ...current, mobile: value })}
                  />
                  <AddressInput
                    label="استان"
                    value={addressDraft.province}
                    onChange={(value) =>
                      setAddressDraft((current) => current && { ...current, province: value })
                    }
                  />
                  <AddressInput
                    label="شهر"
                    value={addressDraft.city}
                    onChange={(value) => setAddressDraft((current) => current && { ...current, city: value })}
                  />
                  <AddressInput
                    label="کد پستی"
                    value={addressDraft.postalCode ?? ""}
                    dir="ltr"
                    onChange={(value) =>
                      setAddressDraft((current) => current && { ...current, postalCode: value })
                    }
                  />
                  <label className="grid gap-2 text-xs font-semibold text-metal md:col-span-2">
                    نشانی کامل
                    <textarea
                      value={addressDraft.address}
                      onChange={(event) =>
                        setAddressDraft((current) =>
                          current ? { ...current, address: event.target.value } : current,
                        )
                      }
                      rows={3}
                      className="w-full border border-hairline bg-obsidian px-4 py-3 text-sm text-bone outline-none focus-visible:border-signal focus-visible:ring-2 focus-visible:ring-signal/30"
                    />
                  </label>
                  <label className="flex min-h-12 items-center gap-3 border border-hairline bg-obsidian px-4 text-sm text-metal md:col-span-2">
                    <input
                      type="checkbox"
                      checked={Boolean(addressDraft.isDefault)}
                      onChange={(event) =>
                        setAddressDraft((current) =>
                          current ? { ...current, isDefault: event.target.checked } : current,
                        )
                      }
                      className="h-4 w-4 accent-signal"
                    />
                    استفاده به‌عنوان آدرس پیش‌فرض
                  </label>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={addressSaving}
                      className={CtaClasses("signal")}
                    >
                      {addressSaving ? (
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Save size={16} aria-hidden="true" />
                      )}
                      ذخیره آدرس
                    </button>
                  </div>
                </form>
              </Surface>
            ) : null}

            {addressesLoading ? (
              <p className="mt-5 flex items-center gap-2 text-sm text-metal">
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                در حال دریافت آدرس‌ها…
              </p>
            ) : addresses.length === 0 ? (
              <EmptyState
                className="mt-5"
                icon={<MapPin size={36} aria-hidden="true" />}
                title="هنوز آدرسی ذخیره نشده است"
                body="برای سریع‌تر شدن خریدهای بعدی، آدرس تحویل را ذخیره کنید."
              />
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {addresses.map((address) => (
                  <Surface key={address.id} tone="raised" className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-bone">{address.title}</h3>
                          {address.isDefault ? (
                            <span className="border border-signal/40 px-2 py-1 text-[10px] font-bold text-signal">
                              پیش‌فرض
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-metal">{address.recipientName}</p>
                        <p className="mt-1 text-sm leading-7 text-metal">
                          {address.province}، {address.city}، {address.address}
                        </p>
                        {address.postalCode ? (
                          <p className="mt-1 text-xs text-mute">کد پستی: {address.postalCode}</p>
                        ) : null}
                      </div>
                      <MapPin size={18} className="shrink-0 text-signal" aria-hidden="true" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setAddressDraft({
                            id: address.id,
                            title: address.title,
                            recipientName: address.recipientName,
                            mobile: address.mobile,
                            province: address.province,
                            city: address.city,
                            address: address.address,
                            postalCode: address.postalCode ?? "",
                            isDefault: address.isDefault,
                          })
                        }
                        className={CtaClasses("line")}
                      >
                        <Pencil size={15} aria-hidden="true" />
                        ویرایش
                      </button>
                      <button
                        type="button"
                        disabled={deletingAddress === address.id}
                        onClick={() => void removeAddress(address)}
                        className="inline-flex min-h-11 items-center gap-2 border border-hairline px-4 text-xs font-semibold text-metal hover:border-red-400/60 hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingAddress === address.id ? (
                          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                        ) : (
                          <Trash2 size={15} aria-hidden="true" />
                        )}
                        حذف
                      </button>
                    </div>
                  </Surface>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10" aria-labelledby="account-orders-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-signal">خریدهای شما</p>
                <h2 id="account-orders-title" className="mt-2 text-display-3 text-bone">
                  سفارش‌های من
                </h2>
              </div>
              <button
                type="button"
                onClick={() => void loadOrders()}
                disabled={ordersLoading}
                className={CtaClasses("line")}
              >
                {ordersLoading ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                ) : null}
                تازه‌سازی
              </button>
            </div>

            {ordersLoading && orders.length === 0 ? (
              <p className="mt-6 flex items-center gap-2 text-sm text-metal">
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                در حال دریافت سفارش‌ها…
              </p>
            ) : orders.length === 0 ? (
              <EmptyState
                className="mt-6"
                icon={<PackageSearch size={38} aria-hidden="true" />}
                title="هنوز سفارشی ثبت نشده است"
                body="پس از ثبت اولین سفارش، وضعیت آن از همین بخش قابل مشاهده است."
              />
            ) : (
              <div className="mt-6 space-y-3">
                {orders.map((order) => (
                  <Surface key={order.id} tone="raised" className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-bone">سفارش {order.number}</p>
                        <p className="mt-1 text-xs text-metal">
                          {order.statusLabel} · {order.paymentStatusLabel}
                        </p>
                        {order.placedAt ? (
                          <p className="mt-1 text-xs text-mute">
                            {new Date(order.placedAt).toLocaleString("fa-IR")}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-end">
                        <p className="num font-bold text-bone">
                          {fmtToman(order.totals.grandTotal.amount)}
                        </p>
                        <p className="mt-1 text-xs text-metal">
                          {order.itemCount.toLocaleString("fa-IR")} قلم
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 border-t border-hairline pt-4 text-xs text-metal md:grid-cols-2">
                      <p>روش ارسال: {order.delivery.methodLabel}</p>
                      <p>تحویل‌گیرنده: {order.recipient.fullName}</p>
                      {order.recipient.city ? <p>شهر: {order.recipient.city}</p> : null}
                      {order.fulfillment.trackingCode ? (
                        <p>کد پیگیری: {order.fulfillment.trackingCode}</p>
                      ) : null}
                    </div>
                    {order.canCancel ? (
                      <button
                        type="button"
                        onClick={() => void cancel(order)}
                        disabled={busyOrder === order.id}
                        className="mt-4 min-h-11 border border-hairline px-4 text-xs font-semibold text-metal hover:border-signal hover:text-signal disabled:opacity-50"
                      >
                        {busyOrder === order.id ? "در حال لغو…" : "لغو سفارش"}
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

function AddressInput({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="grid gap-2 text-xs font-semibold text-metal">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        dir={dir}
        className={`${inputClass} ${dir === "ltr" ? "text-left" : ""}`}
      />
    </label>
  );
}

function AccountChrome({ children }: { children: React.ReactNode }) {
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
              <p className="text-xs font-semibold text-signal">حساب من</p>
              <h1 className="mt-3 text-display-2">حساب کاربری</h1>
              <p className="mt-4 max-w-[54ch] text-sm leading-8 text-metal">
                مشخصات شخصی، آدرس‌های تحویل، علاقه‌مندی‌ها و سفارش‌های خود را از اینجا مدیریت کنید.
              </p>
            </div>
            <div className="grid h-20 w-20 place-items-center border border-hairline bg-carbon text-signal">
              <UserRound size={30} strokeWidth={1.4} aria-hidden="true" />
            </div>
          </Shell>
        </header>
        <Band hairline={false} className="!py-10 md:!py-14">
          <Shell>{children}</Shell>
        </Band>
      </main>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

function PrototypeAccount() {
  return (
    <AccountChrome>
      <div className="mt-8 max-w-[680px]">
        <StatePanel title="حساب کاربری در نسخه نمایشی محدود است" tone="info">
          پس از اتصال فروشگاه به سرویس‌های حساب، ورود و مدیریت سفارش‌ها در این بخش فعال می‌شود.
        </StatePanel>
      </div>
    </AccountChrome>
  );
}
