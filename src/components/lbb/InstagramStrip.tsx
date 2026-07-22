export function InstagramStrip() {
  return (
    <section className="bg-black px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[1600px] text-center">
        <p className="text-[13px] uppercase tracking-[0.25em] text-white/50">@lbbclo</p>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <a
              key={i}
              href="https://www.instagram.com/lbbclo"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square w-[70vw] shrink-0 snap-start overflow-hidden rounded-[2px] border border-white/[0.06] md:w-auto"
              style={{
                background: `linear-gradient(135deg, rgba(232,0,29,${
                  0.6 - i * 0.08
                }) 0%, #0A0A0A 100%)`,
              }}
              aria-label="LBB Instagram feed"
            >
              <span className="absolute inset-0 flex items-center justify-center text-4xl text-[var(--lbb-red)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                ✦
              </span>
            </a>
          ))}
        </div>
        <div className="mt-10">
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-[4px] border border-white/30 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:border-[var(--lbb-red)]"
          >
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
