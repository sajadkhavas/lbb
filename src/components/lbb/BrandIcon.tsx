import type { SVGProps } from "react";
import type { CategorySlug } from "@/lib/products";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function IconBase({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function TeeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M23 13c2 3 5 4.5 9 4.5S39 16 41 13l11 7-5 11-7-3.5V52H24V27.5L17 31l-5-11 11-7Z" />
      <path d="M25 14c1.5 2 3.8 3 7 3s5.5-1 7-3" />
    </IconBase>
  );
}

export function HoodieIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M24 15 16 20l-4 14 7 2 3-8v24h20V28l3 8 7-2-4-14-8-5" />
      <path d="M24 15c1-5 4-8 8-8s7 3 8 8l-8 7-8-7Z" />
      <path d="M27 25v7M37 25v7M25 41h14" />
    </IconBase>
  );
}

export function PantsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 10h24l-2 42H33l-1-25-1 25h-9l-2-42Z" />
      <path d="M20 16h24M26 16c0 4-2 7-5 8M38 16c0 4 2 7 5 8" />
    </IconBase>
  );
}

export function SocksIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 10h12v24c0 8-5 14-13 14-4 0-7-2-7-5 0-4 4-6 8-9V10Z" />
      <path d="M35 10h12v24c0 8-5 14-13 14-4 0-7-2-7-5 0-4 4-6 8-9V10Z" />
      <path d="M18 16h12M35 16h12" />
    </IconBase>
  );
}

export function ShoesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M11 39c7-1 11-5 14-14l8 5c4 3 10 5 17 6 2 0 3 2 3 4v5H11v-6Z" />
      <path d="M11 45h42M28 28l-4 6M33 31l-3 6M38 33l-2 6" />
    </IconBase>
  );
}

export function DeliveryIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 18h29v27H8M37 27h10l8 10v8H37V27Z" />
      <path d="M43 27v10h12M16 20h13M5 27h18M3 34h15" />
      <circle cx="18" cy="46" r="5" />
      <circle cx="47" cy="46" r="5" />
    </IconBase>
  );
}

const CATEGORY_ICONS: Record<CategorySlug, typeof TeeIcon> = {
  hoodies: HoodieIcon,
  pants: PantsIcon,
  tshirts: TeeIcon,
  shoes: ShoesIcon,
  socks: SocksIcon,
};

export function CategoryIcon({ category, ...props }: IconProps & { category: CategorySlug }) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon {...props} />;
}
