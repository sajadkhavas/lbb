const ITEMS = [
  "LBB",
  "پوشاک شهری",
  "دراپ ۰۰۱",
  "هودی",
  "شلوار",
  "کرج",
  "پاساژ مهستان",
  "LBB",
];

export function TickerStrip() {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((text, index) => (
        <span
          key={`${text}-${index}`}
          className="tech flex items-center gap-6 whitespace-nowrap px-6 text-obsidian"
        >
          {text}
          <span aria-hidden="true" className="text-obsidian/70">
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
