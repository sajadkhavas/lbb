const ITEMS = [
  "LBB",
  "NEW COLLECTION",
  "هودی",
  "شلوار",
  "کتونی",
  "STREETWEAR",
  "ارسال سریع",
  "LBB",
];

export function TickerStrip() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t, i) => (
        <span
          key={i}
          className="flex items-center gap-6 whitespace-nowrap px-6 text-[11px] uppercase text-white font-mono"
          style={{ letterSpacing: "0.3em" }}
        >
          {t}
          <span>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div
      aria-hidden="true"
      className="group h-11 w-full overflow-hidden bg-[var(--lbb-red)]"
    >
      <div className="marquee-track flex h-11 w-max items-center group-hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}
