import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";

const links = [
  { label: "Shop",     href: "/shop" },
  { label: "Hoodies",  href: "/hoodies" },
  { label: "Pants",    href: "/pants" },
  { label: "Sneakers", href: "/shoes" },
  { label: "About",    href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.08] bg-[var(--lbb-glass)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 md:px-10">
          <Link to="/" className="font-display text-[28px] font-black leading-none text-[var(--lbb-red)]">
            LBB
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button aria-label="Cart" className="text-white/80 hover:text-white">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
            <a
              href="/shop"
              className="hidden rounded-[4px] bg-[var(--lbb-red)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[var(--lbb-red)] md:inline-block"
            >
              New Drop
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="text-white md:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black md:hidden">
          <div className="flex h-16 items-center justify-between px-6">
            <span className="font-display text-[28px] font-black text-[var(--lbb-red)]">LBB</span>
            <button aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={26} className="text-white" />
            </button>
          </div>
          <ul className="flex flex-1 flex-col items-center justify-center gap-8">
            {links.map((l, i) => (
              <li
                key={l.href}
                style={{
                  animation: `lbb-fade-up 0.6s ${i * 0.08}s both ease-out`,
                }}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-[48px] leading-none text-white"
                >
                  {l.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
          <style>{`@keyframes lbb-fade-up { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }`}</style>
        </div>
      )}
    </>
  );
}
