"use client";

import { useEffect } from "react";

/**
 * Reveal-on-scroll for `[data-reveal]` elements, designed to fail safe:
 * content is visible by default, and only once this component has mounted does it
 * mark already-visible elements as revealed and then enable the hidden start state
 * (`html.reveal-ready`) for the rest. Without JS, or with reduced motion, nothing hides.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    // Anything on screen right now is shown immediately (no flash on load).
    for (const el of els) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    }
    root.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
