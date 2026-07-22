import { Instagram } from "lucide-react";

const shop = [
  { l: "Hoodies", h: "/hoodies" },
  { l: "Pants", h: "/pants" },
  { l: "T-Shirts", h: "/tshirts" },
  { l: "Sneakers", h: "/shoes" },
  { l: "Accessories", h: "/accessories" },
];
const info = [
  { l: "About", h: "/about" },
  { l: "Contact", h: "/contact" },
  { l: "Size Guide", h: "/size-guide" },
  { l: "Shipping & Returns", h: "/shipping" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-black px-6 pt-20 pb-10 md:px-10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-2xl font-black text-[var(--lbb-red)]">LBB</span>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/40">
            Premium Iranian streetwear. Crafted for the streets of Tehran, worn everywhere.
          </p>
          <a
            href="https://www.instagram.com/lbbclo"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-[var(--lbb-red)] hover:text-white"
          >
            <Instagram size={16} />
          </a>
        </div>

        <FooterCol title="Shop" items={shop} />
        <FooterCol title="Info"  items={info} />

        <div>
          <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
            Join the community
          </h4>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="lbb-email" className="sr-only">Email</label>
            <input
              id="lbb-email"
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-[4px] border border-white/20 bg-black px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-[var(--lbb-red)] focus:outline-none"
            />
            <button className="rounded-[4px] border border-white/30 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:border-[var(--lbb-red)]">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1600px] flex-col items-start justify-between gap-2 border-t border-white/[0.06] pt-6 text-[10px] uppercase tracking-[0.2em] text-white/25 md:flex-row">
        <span>© 2026 LBB — All rights reserved</span>
        <span>Designed for the streets of Tehran</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { l: string; h: string }[] }) {
  return (
    <div>
      <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-white">{title}</h4>
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i.h}>
            <a href={i.h} className="text-xs text-white/50 hover:text-white">{i.l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
