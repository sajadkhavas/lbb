import { useEffect, useRef } from "react";

const ITEMS = ["LBB", "پوشاک شهری", "دراپ ۰۰۱", "هودی", "شلوار", "کرج", "پاساژ مهستان", "LBB"];

export function TickerStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inViewport = false;

    const updatePlayback = () => {
      const shouldRun = !reducedMotion.matches && inViewport && !document.hidden;
      track.style.setProperty("animation-play-state", shouldRun ? "running" : "paused");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = Boolean(entry?.isIntersecting);
        updatePlayback();
      },
      { rootMargin: "120px 0px", threshold: 0.01 },
    );

    observer.observe(track);
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    updatePlayback();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <div aria-hidden="true" className="group h-11 w-full overflow-hidden bg-signal">
      <div
        ref={trackRef}
        data-f18-motion="viewport-ticker"
        className="marquee-track flex h-11 w-max items-center group-hover:[animation-play-state:paused]"
        style={{ animationPlayState: "paused" }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
