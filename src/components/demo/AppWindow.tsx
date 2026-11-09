"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExportSheet } from "./ExportSheet";
import { HomeScreen } from "./HomeScreen";
import { RightPanel } from "./RightPanel";
import { SidePanel } from "./SidePanel";
import { Timeline } from "./Timeline";
import { Viewer } from "./Viewer";
import { type Baste, DUR, type Screen, type Tab, type Theme, views } from "./data";
import { AppMark, Icon } from "./icons";

/** Commands other parts of the page can send to the demo (see `goToDemo`). */
export type DemoCommand = {
  screen?: Screen;
  view?: number;
  tab?: Tab;
  select?: number | null;
  pulse?: "prompt" | "plan" | "timeline" | null;
  /** Horizontal focus on small screens: 0 = left edge, 1 = right edge. */
  pan?: number;
};
export const DEMO_EVENT = "stitch-demo";

type AppWindowProps = { screen: Screen; theme: Theme; onScreen: (s: Screen) => void };

const ctxItems: ([string, string, string] | "hr")[] = [
  ["Split at playhead", "S", "Split at playhead"],
  ["Trim start to playhead", "Q", "Trimmed start"],
  ["Trim end to playhead", "W", "Trimmed end"],
  ["Duplicate", "Ctrl+D", "Duplicated"],
  "hr",
  ["Ask Claude about this clip", "Ctrl+K", "Asked Claude about this clip"],
  ["Snapping", "N", "Snapping toggled"],
  "hr",
  ["Delete", "Del", "Deleted"],
];

/**
 * The Stitch application window (fixed 1440×900 design, scaled by the stage).
 * Behaviour mirrors the Inside Stitch Artifact.
 */
export function AppWindow({ screen, theme, onScreen }: AppWindowProps) {
  const appRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(0);
  const [tab, setTab] = useState<Tab>("agent");
  const [sel, setSel] = useState<number | null>(null);
  const [t, setT] = useState(3.2);
  const [playing, setPlaying] = useState(false);
  const [baste, setBaste] = useState<Baste>("");
  const [snap, setSnap] = useState(true);
  const [panels, setPanels] = useState({ L: true, B: true, R: true });
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [toasts, setToasts] = useState<{ id: number; m: string }[]>([]);
  const [pulse, setPulse] = useState<string | null>(null);
  const toastId = useRef(0);

  const seek = useCallback((v: number) => setT(Math.max(0, Math.min(DUR - 0.01, v))), []);
  const toast = useCallback((m: string) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts, { id, m }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 1600);
  }, []);
  const select = useCallback((id: number | null) => {
    setSel(id);
    if (id !== null) setTab("insp");
  }, []);
  const closeCtx = useCallback(() => setCtx(null), []);
  const openCtx = useCallback(
    (clientX: number, clientY: number, clipId: number | null) => {
      if (clipId !== null) select(clipId);
      const r = appRef.current!.getBoundingClientRect();
      const s = r.width / 1440;
      setCtx({ x: Math.min(1440 - 250, (clientX - r.left) / s), y: Math.min(900 - 300, (clientY - r.top) / s) });
    },
    [select],
  );
  const toggleSnap = useCallback(() => setSnap((v) => !v), []);
  const split = useCallback(() => toast("Split at playhead"), [toast]);

  // Playback: advance the playhead in real time, looping at the end.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      setT((p) => {
        const n = p + (now - last) / 1000;
        return n >= DUR ? 0 : n;
      });
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Clicking anywhere outside the menu (and outside the lanes) closes it.
  useEffect(() => {
    if (!ctx) return;
    const onDoc = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest(".ctx") || el.closest(".lanes")) return;
      setCtx(null);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [ctx]);

  // Esc closes the menu, or deselects the clip (as in the Artifact).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (ctx) setCtx(null);
      else if (sel !== null && screen === "editor") {
        setSel(null);
        setTab("insp");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ctx, sel, screen]);

  // Commands from the page ("try it in the demo" links).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onCmd = (e: Event) => {
      const c = (e as CustomEvent<DemoCommand>).detail;
      setCtx(null);
      if (c.view !== undefined) setView(c.view);
      if (c.select !== undefined) setSel(c.select);
      if (c.tab) setTab(c.tab);
      if (c.pulse !== undefined) {
        clearTimeout(timer);
        setPulse(c.pulse);
        timer = setTimeout(() => setPulse(null), 2400);
      }
    };
    window.addEventListener(DEMO_EVENT, onCmd);
    return () => {
      window.removeEventListener(DEMO_EVENT, onCmd);
      clearTimeout(timer);
    };
  }, []);

  const cls = [
    "app",
    screen === "home" && "s-home",
    screen === "export" && "s-export",
    baste,
    !panels.L && "noL",
    !panels.B && "noB",
    !panels.R && "noR",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} data-theme={theme} ref={appRef}>
      {/* title bar */}
      <div className="tb">
        <AppMark />
        <div className="menus" aria-hidden="true">
          <span>File</span>
          <span>Edit</span>
          <span>Clip</span>
          <span>View</span>
          <span>Help</span>
        </div>
        <div className="ttl">
          {screen === "home" ? (
            <b>Stitch</b>
          ) : (
            <>
              <b>road-trip</b> · D:\Films\road-trip
            </>
          )}
        </div>
        <div className="tools">
          {(
            [
              ["L", "Side bar", "panelL"],
              ["B", "Timeline", "panelB"],
              ["R", "Agent", "panelR"],
            ] as const
          ).map(([k, label, ic]) => (
            <button
              type="button"
              key={k}
              className={`tbb${panels[k] ? " on" : ""}`}
              title={label}
              aria-label={label}
              aria-pressed={panels[k]}
              onClick={() => setPanels((p) => ({ ...p, [k]: !p[k] }))}
            >
              <Icon n={ic} s={16} />
            </button>
          ))}
          <button type="button" className="tbb" title="Export" aria-label="Export" onClick={() => onScreen("export")}>
            <Icon n="export" s={16} />
          </button>
        </div>
        <div className="wc" aria-hidden="true">
          <span>
            <svg width="10" height="10">
              <path d="M0 5h10" stroke="currentColor" />
            </svg>
          </span>
          <span>
            <svg width="10" height="10">
              <rect x=".5" y=".5" width="9" height="9" fill="none" stroke="currentColor" />
            </svg>
          </span>
          <span>
            <svg width="10" height="10">
              <path d="M0 0l10 10M10 0L0 10" stroke="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <HomeScreen onOpen={() => onScreen("editor")} />

      <div className="amain">
        <nav className="act" aria-label="Views">
          <div className="ind" style={{ transform: `translateY(${view * 48}px)` }} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="g">
            {views.map(([k, n], i) => (
              <button type="button" key={k} className={`ab${i === view ? " on" : ""}`} aria-label={n} aria-pressed={i === view} onClick={() => setView(i)}>
                <Icon n={k} s={21} />
                <span className="tip">{n}</span>
              </button>
            ))}
          </div>
          <div className="g">
            <button type="button" className="ab" aria-label="Projects" onClick={() => onScreen("home")}>
              <Icon n="folder" s={21} />
              <span className="tip">Projects</span>
            </button>
            <button type="button" className="ab" aria-label="Settings">
              <Icon n="settings" s={21} />
              <span className="tip">Settings</span>
            </button>
          </div>
        </nav>
        <SidePanel view={view} onToast={toast} />
        <section className="center">
          <Viewer t={t} playing={playing} onPlay={() => setPlaying((p) => !p)} onStep={(d) => seek(t + d)} />
          <div className={`sd-tlwrap${pulse === "timeline" ? " pulse" : ""}`}>
            <Timeline
              t={t}
              sel={sel}
              snap={snap}
              onSelect={select}
              onSeek={seek}
              onContext={openCtx}
              onCloseContext={closeCtx}
              onSplit={split}
              onToggleSnap={toggleSnap}
            />
          </div>
        </section>
        <RightPanel tab={tab} sel={sel} baste={baste} pulse={pulse} onTab={setTab} onBaste={setBaste} />
      </div>

      <div className="sbar">
        <span className="ok">
          <i />
          Ready
        </span>
        <span>1920×1080 · 30 fps · 01:00</span>
        <span className="g" />
        <span>{snap ? "Snapping on" : "Snapping off"}</span>
        <span>whisper small</span>
        <span className="ok">
          <i />
          Claude Code
        </span>
      </div>

      <ExportSheet open={screen === "export"} onClose={() => onScreen("editor")} />

      {ctx && (
        <div className="ctx" role="menu" style={{ left: ctx.x, top: ctx.y }}>
          {ctxItems.map((it, i) =>
            it === "hr" ? (
              <hr key={i} />
            ) : (
              <button
                type="button"
                role="menuitem"
                key={it[0]}
                onClick={() => {
                  if (it[0] === "Snapping") toggleSnap();
                  toast(it[2]);
                  setCtx(null);
                }}
              >
                {it[0]}
                <kbd>{it[1]}</kbd>
              </button>
            ),
          )}
        </div>
      )}
      {toasts.map((x) => (
        <div className="toast" key={x.id} role="status">
          {x.m}
        </div>
      ))}
    </div>
  );
}
