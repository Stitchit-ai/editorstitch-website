"use client";

import { useEffect, useState } from "react";
import { DownloadButton } from "./DownloadButton";
import { Logo } from "./Logo";

const links = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "How it works" },
  { href: "#download", label: "Download" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md backdrop-saturate-150"
          : "bg-transparent"
      }`}
    >
      {/* Three-column grid: equal side tracks keep the nav centred on the viewport,
          independent of the logo and button widths. */}
      <div className="mx-auto grid h-[68px] max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 sm:px-6">
        <a href="#top" className="col-start-1 justify-self-start rounded-lg" aria-label="Stitch, back to top">
          <Logo size={36} />
        </a>
        <nav aria-label="Main" className="col-start-2 hidden md:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 font-display text-[14.5px] font-medium text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-start-3 justify-self-end">
          <DownloadButton variant="compact" />
        </div>
      </div>
    </header>
  );
}
