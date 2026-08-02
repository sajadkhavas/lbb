const ITEMS = ["LBB", "DROP 001", "هودی", "شلوار", "کتونی", "STREETWEAR", "تهران", "LBB"];

export function TickerStrip() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t, i) => (
        <span key={i} className="tech flex items-center gap-6 whitespace-nowrap px-6 text-bone">
          {t}
          <span aria-hidden="true" className="text-bone/60">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="group h-11 w-full overflow-hidden bg-signal">
      <div className="marquee-track flex h-11 w-max items-center group-hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}
