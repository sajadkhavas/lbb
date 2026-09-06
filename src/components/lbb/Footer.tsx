import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { PERSONAL_NAVIGATION, type NavigationItem } from "@/lib/navigation";
import { NavigationLink } from "@/components/lbb/navigation/NavigationLink";
import { MerchantNavigationLink } from "@/components/lbb/navigation/MerchantNavigationLink";
import { Logo } from "@/components/lbb/Logo";
import { TrustMarks } from "@/components/lbb/TrustMarks";
import { useStorefrontControl, type MerchantNavigationItem } from "@/lib/storefront-control";

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const reactId = useId();
  const id = `footer-${reactId.replace(/:/g, "")}`;
  const [open, setOpen] = useState(false);
  return (
    <nav aria-labelledby={`${id}-title`} className="border-b border-hairline md:border-0">
      <h2 id={`${id}-title`} className="md:mb-4">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((current) => !current)}
          className="flex min-h-14 w-full items-center justify-between text-right md:pointer-events-none md:min-h-0"
        >
          <span className="tech text-bone">{title}</span>
          <span className="grid size-9 place-items-center rounded-xl border border-hairline bg-carbon-2 text-metal md:hidden">
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-300 ${open ? "rotate-180 text-signal" : ""}`}
            />
          </span>
        </button>
      </h2>
      <ul
        id={id}
        className={`${open ? "grid grid-rows-[1fr] pb-5" : "hidden"} space-y-2.5 md:block md:pb-0`}
      >
        {children}
      </ul>
    </nav>
  );
}

function MerchantFooterList({ title, items }: { title: string; items: MerchantNavigationItem[] }) {
  return (
    <FooterSection title={title}>
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <MerchantNavigationLink
            item={item}
            className="inline-flex min-h-10 items-center text-sm leading-7 text-metal transition-colors hover:text-signal"
          />
        </li>
      ))}
    </FooterSection>
  );
}

function PersonalFooterList({ title, items }: { title: string; items: NavigationItem[] }) {
  return (
    <FooterSection title={title}>
      {items.map((item) => (
        <li key={`${String(item.to)}-${item.label}`}>
          <NavigationLink
            item={item}
            className="inline-flex min-h-10 items-center text-sm leading-7 text-metal transition-colors hover:text-signal"
          />
        </li>
      ))}
    </FooterSection>
  );
}

/** Global dark footer. The theme prop remains for compatibility with existing routes. */
export function Footer(_props: { theme?: "dark" | "light" } = {}) {
  const { brand, copy, contact, navigation } = useStorefrontControl();
  const whatsappHref = `https://wa.me/98${contact.whatsapp.replace(/\D/g, "").replace(/^0/, "")}`;
  const phoneHref = `tel:+98${contact.phone.replace(/\D/g, "").replace(/^0/, "")}`;

  return (
    <footer dir="rtl" className="border-t border-hairline bg-obsidian pb-bottombar md:pb-0">
      <div className="lbb-shell py-10 md:py-12">
        <div className="grid gap-0 pb-8 md:gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
          <div className="min-w-0 border-b border-hairline pb-8 sm:col-span-2 lg:col-span-1 lg:border-0 lg:pb-0">
            <Logo size={48} withWordmark />
            <p className="mt-4 max-w-xs text-sm leading-7 text-metal">{brand.descriptor}</p>
            <p className="mt-4 flex items-start gap-2 text-sm leading-7 text-metal">
              <MapPin size={16} className="mt-1 shrink-0 text-signal" aria-hidden="true" />
              <span>{copy.storeLocationLabel || contact.locationLabel}</span>
            </p>
            <div className="mt-4 grid gap-1 text-sm text-metal">
              <a
                href={phoneHref}
                className="inline-flex min-h-9 items-center gap-2 hover:text-signal"
              >
                <Phone size={15} aria-hidden="true" />
                <span dir="ltr">{contact.phone}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center gap-2 hover:text-signal"
              >
                <MessageCircle size={15} aria-hidden="true" />
                <span dir="ltr">{contact.whatsapp}</span>
              </a>
            </div>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline px-4 text-metal transition-colors hover:border-signal hover:text-signal"
            >
              <Instagram size={16} aria-hidden="true" />
              <span className="tech">{brand.instagramHandle.toUpperCase()}</span>
            </a>
            <TrustMarks />
          </div>

          <MerchantFooterList title="خرید" items={navigation.shop} />
          <MerchantFooterList title="کالکشن و محتوا" items={navigation.editorial} />
          <MerchantFooterList title="پشتیبانی" items={navigation.service} />
          <div className="grid sm:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:gap-6">
            <PersonalFooterList title="شخصی" items={PERSONAL_NAVIGATION} />
            <MerchantFooterList title="برند" items={navigation.brand} />
          </div>
        </div>

        <div className="grid gap-4 border-t border-hairline pt-6 text-mute md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="tech">
              © ۲۰۲۶ {brand.nameFa} — {contact.locationLabel}
            </p>
            <p className="mt-2 text-[11px] leading-6">{brand.shortIntroduction}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/terms" className="text-xs transition-colors hover:text-bone">
              قوانین
            </Link>
            <Link to="/privacy" className="text-xs transition-colors hover:text-bone">
              حریم خصوصی
            </Link>
            <Link to="/contact" className="text-xs transition-colors hover:text-bone">
              تماس
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
