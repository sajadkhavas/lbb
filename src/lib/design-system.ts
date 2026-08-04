export type DesignToken = {
  name: string;
  token: string;
  usage: string;
};

export const COLOR_TOKENS: DesignToken[] = [
  { name: "Canvas", token: "--lbb-surface-canvas", usage: "پس‌زمینه اصلی صفحات" },
  { name: "Subtle", token: "--lbb-surface-subtle", usage: "باندها و تفکیک آرام محتوا" },
  { name: "Raised", token: "--lbb-surface-raised", usage: "کارت، فیلتر و کنترل‌ها" },
  { name: "Elevated", token: "--lbb-surface-elevated", usage: "Popover، Drawer و Modal" },
  { name: "Bone", token: "--lbb-text-primary", usage: "متن اصلی روی سطوح تیره" },
  { name: "Metal", token: "--lbb-text-secondary", usage: "متن توضیحی و Metadata" },
  { name: "Mute", token: "--lbb-text-tertiary", usage: "اطلاعات کم‌اهمیت و Disabled" },
  { name: "Signal", token: "--lbb-action-primary", usage: "CTA اصلی، Focus و وضعیت فعال" },
  { name: "Success", token: "--lbb-status-success", usage: "تأیید و موجودی مثبت" },
  { name: "Warning", token: "--lbb-status-warning", usage: "هشدار قابل اصلاح" },
  { name: "Danger", token: "--lbb-status-danger", usage: "خطا و اقدام تخریبی" },
  { name: "Info", token: "--lbb-status-info", usage: "اطلاع‌رسانی خنثی" },
];

export const TYPE_TOKENS = [
  { name: "Hero", className: "text-hero", sample: "تهران بعد از تاریکی" },
  { name: "Display 1", className: "text-display-1", sample: "فرم تازه خیابان" },
  { name: "Display 2", className: "text-display-2", sample: "کالکشن شب‌گرد" },
  { name: "Display 3", className: "text-display-3", sample: "جزئیات محصول" },
  { name: "Title", className: "text-title", sample: "هودی کلاسیک LBB" },
  { name: "Lede", className: "text-lede", sample: "روایت کوتاه و تصمیم‌ساز برای معرفی بخش." },
  {
    name: "Body",
    className: "body-copy",
    sample: "متن اصلی فارسی باید خوانا، طبیعی و دارای عرض کنترل‌شده باشد.",
  },
  { name: "Technical", className: "tech", sample: "LBB / SYSTEM / 02" },
] as const;

export const SPACING_TOKENS: DesignToken[] = [
  { name: "2XS", token: "--lbb-space-1", usage: "فاصله داخلی Icon" },
  { name: "XS", token: "--lbb-space-2", usage: "فاصله عناصر بسیار نزدیک" },
  { name: "SM", token: "--lbb-space-3", usage: "Gap کنترل‌های کوچک" },
  { name: "MD", token: "--lbb-space-4", usage: "Padding پایه Component" },
  { name: "LG", token: "--lbb-space-6", usage: "فاصله گروه‌های مرتبط" },
  { name: "XL", token: "--lbb-space-8", usage: "فاصله داخلی Card و Panel" },
  { name: "2XL", token: "--lbb-space-12", usage: "فاصله بلوک‌های صفحه" },
  { name: "Section", token: "--lbb-section-md", usage: "ریتم عمومی Section" },
];

export const RADIUS_TOKENS: DesignToken[] = [
  { name: "Sharp", token: "--radius-xs", usage: "Label و Status" },
  { name: "Control", token: "--radius-sm", usage: "Button، Input و Chip" },
  { name: "Panel", token: "--radius-md", usage: "Card و Filter" },
  { name: "Media", token: "--radius-lg", usage: "قاب تصویر" },
  { name: "Feature", token: "--radius-xl", usage: "Hero و Feature panel" },
  { name: "Pill", token: "--radius-pill", usage: "Swatch و کنترل‌های کاملاً گرد" },
];

export const MOTION_TOKENS: DesignToken[] = [
  { name: "Instant", token: "--dur-instant", usage: "تغییر State فوری" },
  { name: "Micro", token: "--dur-micro", usage: "Hover، Press و Focus" },
  { name: "State", token: "--dur-state", usage: "Accordion، Drawer و Filter" },
  { name: "Enter", token: "--dur-enter", usage: "ورود Component" },
  { name: "Reveal", token: "--dur-reveal", usage: "Moment نمایشی صفحه" },
];

export const DESIGN_SYSTEM_VERSION = "2.0.0";
export const EXPERIENCE_NORTH_STAR = "Tehran After Dark — Editorial Utility";
