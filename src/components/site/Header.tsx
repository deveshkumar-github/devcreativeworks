import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/dev-logo.png.asset.json";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ReferralButton } from "@/components/refer/ReferralButton";

const nav = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Book", href: "#book" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoAsset.url} alt="Dev Creative Works" className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-sm" />
          <span className="font-display font-bold text-navy text-xl hidden sm:block">
            Dev <span className="text-orange">Creative Works</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-slate-soft hover:text-brand transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <ReferralButton />
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand text-white px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow transition-shadow"
          >
            Start Your Project
          </a>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-3">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-base font-medium text-ink py-2">
                {n.label}
              </a>
            ))}
            <ReferralButton className="mt-2 w-full" onClick={() => setOpen(false)} />
            <a
              href="https://wa.me/919999999999"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-brand text-white px-5 py-3 text-sm font-semibold"
            >
              Start Your Project
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}