"use client";

import { Figtree, Geist_Mono, Newsreader } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppWindow, DEMO_EVENT, type DemoCommand } from "./AppWindow";
import type { Screen, Theme } from "./data";
import "./stitch-demo.css";
import "./demo-extra.css";

// The application's own typefaces (as in the real Stitch UI and the Inside Stitch Artifact).
const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-figtree", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono", display: "swap" });

/** Drive the demo from elsewhere on the page (e.g. the "How it works" steps). */
export function goToDemo(cmd: DemoCommand) {
  window.dispatchEvent(new CustomEvent<DemoCommand>(DEMO_EVENT, { detail: cmd }));
}

const SCREENS: [Screen, string][] = [
  ["home", "Home"],
  ["editor", "Editor"],
  ["export", "Export"],
];
const THEMES: [Theme, string][] = [
  ["loom", "Loom · dark"],
  ["paper", "Paper · light"],
];

type Pan = { start: boolean; end: boolean; thumb: number; pos: number; touched: boolean };

/**
 * Interactive Stitch demo: a working reconstruction of the Inside Stitch Artifact.
 * Screen and theme controls on top; the 1440×900 app window below, scaled to fit.
 */
export function StitchDemo() {
  const [screen, setScreen] = useState<Screen>("home");
  const [theme, setTheme] = useState<Theme>("paper");
  const rootRef = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<Pan>({ start: true, end: false, thumb: 1, pos: 0, touched: false });

  const measure = useCallback((touched?: boolean) => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPan((p) => ({
      start: el.scrollLeft <= 2,
      end: max <= 2 || el.scrollLeft >= max - 2,
      thumb: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1,
      pos: max > 0 ? el.scrollLeft / max : 0,
      touched: p.touched || !!touched,
    }));
  }, []);

  useEffect(() => {
    const onResize = () => measure();
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  // Older browsers without CSS trig functions can't compute the stage scale in CSS: do it in JS.
  useEffect(() => {
    if (CSS.supports("transform", "scale(tan(atan2(1px, 2px)))")) return;
    const wrap = rootRef.current?.querySelector<HTMLElement>(".sd-stage-wrap");
    const stage = wrap?.querySelector<HTMLElement>(".sd-stage");
    if (!wrap || !stage) return;
    const ro = new ResizeObserver(() => (stage.style.transform = `scale(${wrap.clientWidth / 1440})`));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // Page commands: switch screen, bring the demo into view and pan to the relevant area.
  useEffect(() => {
    const onCmd = (e: Event) => {
      const c = (e as CustomEvent<DemoCommand>).detail;
      if (c.screen) setScreen(c.screen);
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const el = scroller.current;
      if (el && c.pan !== undefined) el.scrollTo({ left: c.pan * (el.scrollWidth - el.clientWidth), behavior: "smooth" });
    };
    window.addEventListener(DEMO_EVENT, onCmd);
    return () => window.removeEventListener(DEMO_EVENT, onCmd);
  }, []);

  const pannable = pan.thumb < 0.99;

  return (
    <div ref={rootRef} className={`sd ${figtree.variable} ${newsreader.variable} ${geistMono.variable}`} id="demo">
      {/* Control bar: SCREEN · THEME · hint (as in the reference) */}
      <div className="sd-ctrls">
        <div className="sd-ctrl">
          <span className="sd-lbl" id="sd-screen-lbl">
            Screen
          </span>
          <div className="sd-seg" role="group" aria-labelledby="sd-screen-lbl">
            {SCREENS.map(([v, label]) => (
              <button type="button" key={v} className={screen === v ? "on" : ""} aria-pressed={screen === v} onClick={() => setScreen(v)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="sd-ctrl">
          <span className="sd-lbl" id="sd-theme-lbl">
            Theme
          </span>
          <div className="sd-seg" role="group" aria-labelledby="sd-theme-lbl">
            {THEMES.map(([v, label]) => (
              <button type="button" key={v} className={theme === v ? "on" : ""} aria-pressed={theme === v} onClick={() => setTheme(v)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="sd-hint">try: click a clip, right-click the timeline →</p>
      </div>

      {/* Small screens: how to explore + where you are */}
      <div aria-hidden="true" className={`sd-panhint${pannable ? "" : " sd-invisible"}`}>
        <p>
          swipe to explore · tap a clip · long-press the timeline <span className={pan.touched ? "" : "nudge"}>→</span>
        </p>
        <div className="sd-scrub">
          <span style={{ width: `${pan.thumb * 100}%`, left: `${pan.pos * (1 - pan.thumb) * 100}%` }} />
        </div>
      </div>

      <div className="sd-panwrap">
        <div
          ref={scroller}
          className="sd-scroller"
          onScroll={() => measure(true)}
          tabIndex={0}
          role="region"
          aria-label="Interactive Stitch demo. On small screens, scroll sideways to explore the whole window."
        >
          <div className="sd-stage-wrap">
            <div className="sd-stage">
              <AppWindow screen={screen} theme={theme} onScreen={setScreen} />
            </div>
          </div>
        </div>
        <span aria-hidden="true" className={`sd-fade sd-fade-l${pan.start ? "" : " on"}`} />
        <span aria-hidden="true" className={`sd-fade sd-fade-r${pan.end ? "" : " on"}`} />
      </div>
    </div>
  );
}
