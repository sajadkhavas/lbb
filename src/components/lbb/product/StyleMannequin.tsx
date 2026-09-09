import {
  isUsableMannequinProfile,
  mannequinAssetTransform,
  type MannequinProfileDto,
} from "@/lib/style-mannequin";

export function StyleMannequin({
  profile,
  productName,
  priority = false,
}: {
  profile: MannequinProfileDto;
  productName: string;
  priority?: boolean;
}) {
  if (!isUsableMannequinProfile(profile)) return null;

  return (
    <div
      role="img"
      aria-label={`پیش‌نمایش دوبعدی ${productName} روی مانکن`}
      data-testid="style-mannequin"
      data-mannequin-slot={profile.slot}
      className="absolute inset-0 isolate overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#f5f2ec_58%,#e9e5dc_100%)]"
    >
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center text-[#c8c2b8]">
        <svg
          viewBox="0 0 300 520"
          className="h-[88%] w-auto max-w-[66%] drop-shadow-[0_18px_22px_rgba(0,0,0,0.12)]"
          focusable="false"
        >
          <ellipse cx="150" cy="43" rx="31" ry="36" fill="currentColor" />
          <path
            d="M113 87c10-13 24-20 37-20s27 7 37 20l26 88-22 88-6 100h-70l-6-100-22-88 26-88Z"
            fill="currentColor"
          />
          <path d="M111 96 73 205l22 8 36-99-20-18Z" fill="currentColor" />
          <path d="m189 96 38 109-22 8-36-99 20-18Z" fill="currentColor" />
          <path d="M118 356h30l-10 147h-35l15-147Z" fill="currentColor" />
          <path d="M152 356h30l15 147h-35l-10-147Z" fill="currentColor" />
          <ellipse cx="120" cy="505" rx="23" ry="7" fill="currentColor" />
          <ellipse cx="180" cy="505" rx="23" ry="7" fill="currentColor" />
        </svg>
      </div>

      <img
        src={profile.assetUrl}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[72%] max-w-none select-none object-contain will-change-transform motion-reduce:transition-none"
        style={{
          transform: mannequinAssetTransform(profile),
          zIndex: profile.layer,
        }}
      />

      <span
        aria-hidden="true"
        className="absolute bottom-3 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-black/10 bg-white/85 px-2.5 py-1 text-[9px] font-bold tracking-wide text-black/60 shadow-sm backdrop-blur"
      >
        پیش‌نمایش 2D
      </span>
    </div>
  );
}
