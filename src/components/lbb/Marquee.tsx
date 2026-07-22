const items = ["LBB", "Streetwear", "Hoodies", "Sneakers", "New Drop", "Pants", "LBB"];

export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center gap-10 px-5">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/35">
          {t}
          <span className="text-[var(--lbb-red)]">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="w-full overflow-hidden border-y border-[var(--lbb-red)]/60 bg-black py-4">
      <div className="marquee-track flex w-max">
        {row}{row}
      </div>
    </div>
  );
}
