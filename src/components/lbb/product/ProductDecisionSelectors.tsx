import { useRef } from "react";
import type { DecisionAvailability, DecisionColor, DecisionSize } from "@/lib/product-decision";

function availabilityLabel(state: DecisionAvailability) {
  if (state === "available") return "موجود";
  if (state === "sold-out") return "ناموجود";
  if (state === "unavailable") return "برای این انتخاب در دسترس نیست";
  return "وضعیت موجودی تأیید نشده";
}

function Swatch({ color }: { color: DecisionColor }) {
  if (color.swatch?.type === "solid") {
    return (
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-hairline"
        style={{ backgroundColor: color.swatch.value }}
      />
    );
  }
  if (color.swatch?.type === "multi") {
    const stops = color.swatch.values.join(", ");
    return (
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-hairline"
        style={{ background: `conic-gradient(${stops})` }}
      />
    );
  }
  if (color.swatch?.type === "pattern") {
    return (
      <span
        aria-hidden="true"
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-hairline text-[8px] text-metal"
      >
        ◇
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-dashed border-metal text-[9px] text-metal"
    >
      ?
    </span>
  );
}

export function ColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: DecisionColor[];
  selected: string | null;
  onSelect: (colorId: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (index: number, direction: -1 | 1) => {
    if (colors.length === 0) return;
    let next = index;
    for (let attempt = 0; attempt < colors.length; attempt += 1) {
      next = (next + direction + colors.length) % colors.length;
      if (colors[next].availability !== "unavailable") {
        refs.current[next]?.focus();
        return;
      }
    }
  };

  if (colors.length === 0) return null;

  return (
    <fieldset data-testid="pdp-color-selector">
      <legend className="mb-3 text-sm font-bold text-bone">رنگ</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="انتخاب رنگ محصول">
        {colors.map((color, index) => {
          const blocked = color.availability === "unavailable";
          const current = selected === color.id;
          return (
            <button
              key={color.id}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              aria-pressed={current}
              aria-disabled={blocked || undefined}
              aria-label={`${color.label} — ${availabilityLabel(color.availability)}`}
              onClick={() => {
                if (!blocked) onSelect(color.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                  event.preventDefault();
                  move(index, 1);
                } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                  event.preventDefault();
                  move(index, -1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  refs.current[0]?.focus();
                } else if (event.key === "End") {
                  event.preventDefault();
                  refs.current[colors.length - 1]?.focus();
                }
              }}
              className={`min-h-11 min-w-11 rounded-full border px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                current
                  ? "border-signal bg-signal/10 text-bone"
                  : "border-hairline bg-carbon text-metal hover:border-metal"
              } ${blocked ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <span className="flex items-center gap-2">
                <Swatch color={color} />
                <span>{color.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SizeSelector({
  sizes,
  selected,
  availabilityFor,
  onSelect,
  describedBy,
}: {
  sizes: DecisionSize[];
  selected: string | null;
  availabilityFor: (sizeId: string) => DecisionAvailability;
  onSelect: (sizeId: string) => void;
  describedBy?: string;
}) {
  if (sizes.length === 0) return null;

  return (
    <fieldset data-testid="pdp-size-selector">
      <legend className="mb-3 text-sm font-bold text-bone">سایز</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="انتخاب سایز محصول">
        {sizes.map((size) => {
          const availability = availabilityFor(size.id);
          const blocked = availability !== "available";
          const current = selected === size.id;
          return (
            <button
              key={size.id}
              type="button"
              aria-pressed={current}
              aria-disabled={blocked || undefined}
              aria-describedby={describedBy}
              aria-label={`سایز ${size.label} — ${availabilityLabel(availability)}`}
              onClick={() => {
                if (!blocked) onSelect(size.id);
              }}
              className={`min-h-11 min-w-11 border px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                current
                  ? "border-signal bg-signal text-obsidian"
                  : blocked
                    ? "cursor-not-allowed border-hairline text-mute line-through"
                    : "border-hairline text-bone hover:border-metal"
              }`}
            >
              {size.label}
              {availability === "sold-out" ? <span className="sr-only">، ناموجود</span> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
