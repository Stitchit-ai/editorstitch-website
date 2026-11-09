"use client";

import { memo, useRef } from "react";
import { DUR, LEFT, PPS, X, cuts, tracks, wavePath } from "./data";
import { Icon } from "./icons";

type TimelineProps = {
  t: number;
  sel: number | null;
  snap: boolean;
  onSelect: (id: number | null) => void;
  onSeek: (t: number) => void;
  /** Open the context menu at viewport coordinates (right-click or touch long-press). */
  onContext: (clientX: number, clientY: number, clipId: number | null) => void;
  onCloseContext: () => void;
  onSplit: () => void;
  onToggleSnap: () => void;
};

/** Timeline: toolbar, track headers, ruler, clips, basting, the agent's cursor and the playhead. */
export function Timeline({ t, sel, snap, onSelect, onSeek, onContext, onCloseContext, onSplit, onToggleSnap }: TimelineProps) {
  const lanesRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number; fired: boolean } | null>(null);

  const clipAt = (target: EventTarget | null) => {
    const c = (target as HTMLElement | null)?.closest<HTMLElement>(".clip");
    return c ? Number(c.dataset.id) : null;
  };

  const seekFromRuler = (clientX: number) => {
    const lanes = lanesRef.current;
    if (!lanes) return;
    const r = lanes.getBoundingClientRect();
    const scale = r.width / lanes.offsetWidth; // the stage is scaled with a transform
    onSeek(((clientX - r.left) / scale - LEFT) / PPS);
  };

  return (
    <div className="tl" id="sd-tl">
      <div className="tlbar">
        <button type="button" className="ib on" title="Select  V" aria-label="Select">
          <Icon n="select" />
        </button>
        <button type="button" className="ib" title="Split at playhead  S" aria-label="Split at playhead" onClick={onSplit}>
          <Icon n="blade" />
        </button>
        <button type="button" className={`ib${snap ? " on" : ""}`} title="Snapping  N" aria-label="Snapping" aria-pressed={snap} onClick={onToggleSnap}>
          <Icon n="snap" />
        </button>
        <span className="sep" />
        <button type="button" className="ib" title="Undo  Ctrl+Z" aria-label="Undo">
          <Icon n="undo" />
        </button>
        <button type="button" className="ib" title="Redo  Ctrl+Shift+Z" aria-label="Redo">
          <Icon n="redo" />
        </button>
        <span className="sp" />
        <span className="lb">Timeline</span>
        <input className="zoom" type="range" min={0} max={100} defaultValue={40} aria-label="Zoom" />
        <button type="button" className="ib" title="Fit" aria-label="Fit">
          <Icon n="fit" />
        </button>
      </div>
      <div className="tlg">
        <div className="thd">
          {tracks.map((tr) => (
            <div key={tr.id}>
              <i style={{ background: `var(--sd-${tr.d})` }} />
              {tr.id}
              <Icon n={tr.au ? "volume" : "visible"} s={12} />
            </div>
          ))}
        </div>
        <div
          className="lanes"
          ref={lanesRef}
          onClick={(e) => {
            if (press.current?.fired) {
              press.current = null;
              return;
            }
            onCloseContext();
            const id = clipAt(e.target);
            if (id === null) {
              if ((e.target as HTMLElement).closest(".ruler")) seekFromRuler(e.clientX);
              else onSelect(null);
              return;
            }
            onSelect(id);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            onContext(e.clientX, e.clientY, clipAt(e.target));
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== "touch") return;
            const target = e.target;
            const { clientX: x, clientY: y } = e;
            press.current = {
              x,
              y,
              fired: false,
              timer: setTimeout(() => {
                if (!press.current) return;
                press.current.fired = true;
                onContext(x, y, clipAt(target));
              }, 550),
            };
          }}
          onPointerMove={(e) => {
            const p = press.current;
            if (p && !p.fired && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) {
              clearTimeout(p.timer);
              press.current = null;
            }
          }}
          onPointerUp={() => {
            const p = press.current;
            if (p && !p.fired) {
              clearTimeout(p.timer);
              press.current = null;
            }
          }}
          onPointerCancel={() => {
            if (press.current) clearTimeout(press.current.timer);
            press.current = null;
          }}
        >
          <Ruler />
          <Lanes sel={sel} />
          <div className="playhead" style={{ left: X(t) }}>
            <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
              <path d="M7 21.5L4.2 7Q7-1 9.8 7Z" fill="var(--sd-accent)" />
              <ellipse cx="7" cy="5.6" rx="1" ry="2.1" fill="var(--sd-panel)" />
            </svg>
            <div className="ln" />
          </div>
        </div>
      </div>
    </div>
  );
}

const Ruler = memo(function Ruler() {
  const ticks = [];
  for (let s = 0; s <= DUR; s += 2) {
    const big = s % 10 === 0;
    ticks.push(
      <div key={s} className={`tick${big ? "" : " mn"}`} style={{ left: X(s) }}>
        {big ? (s === 60 ? "1:00" : `0:${String(s).padStart(2, "0")}`) : ""}
      </div>,
    );
  }
  return (
    <div className="ruler" title="Click to move the playhead">
      {ticks}
    </div>
  );
});

/** Clip lanes. Memoised: only re-renders when the selection changes, not on every playback frame. */
const Lanes = memo(function Lanes({ sel }: { sel: number | null }) {
  const basteW = X(24) - X(0);
  return (
    <>
      {tracks.map((tr) => (
        <div className="lane" key={tr.id}>
          {tr.clips.map((c) => {
            const left = X(c.a) + 1;
            const w = (c.b - c.a) * PPS - 2;
            const style = { left, width: w, "--sd-d": `var(--sd-${tr.d})`, ...(tr.soft ? { "--sd-mix": "12%" } : {}) } as React.CSSProperties;
            const cls = `clip${tr.v ? " v" : ""}${sel === c.id ? " sel" : ""}`;
            return (
              <div className={cls} data-id={c.id} key={c.id} style={style} role="button" tabIndex={-1} aria-label={`${c.n}, ${tr.id} track`}>
                {tr.v ? (
                  <>
                    <div className="strip" style={{ backgroundImage: `url(/demo/${c.img}.webp)` }} />
                    <span>{c.n}</span>
                  </>
                ) : tr.au ? (
                  <>
                    <svg className="wv" width={Math.round(w)} height={20} viewBox={`0 0 ${Math.round(w)} 20`} aria-hidden="true">
                      <path
                        d={wavePath(Math.round(w), 20, Math.round(w / 3), tr.soft ? 5 : 8, c.id * 31 + 7)}
                        stroke="var(--sd-verdigris)"
                        strokeOpacity={tr.soft ? 0.6 : 0.9}
                        strokeWidth={1.3}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span style={{ position: "relative" }}>{c.n}</span>
                  </>
                ) : (
                  c.n
                )}
                <i className="h l" />
                <i className="h r" />
              </div>
            );
          })}
          {(tr.id === "Video" || tr.id === "Voice") &&
            cuts.map((cut) => (
              <span key={cut}>
                <div className="joint" style={{ left: X(cut) }} />
                <svg className="xm" viewBox="0 0 10 10" style={{ left: X(cut) }} aria-hidden="true">
                  <path d="M2 2l6 6M8 2L2 8" />
                </svg>
              </span>
            ))}
        </div>
      ))}
      {/* The agent's provisional edit: dashed "basting" until you press Keep. */}
      <div className="baste" style={{ left: X(0) - 1, top: 24 + 36 * 3 + 1, width: basteW + 2, height: 70 }}>
        <svg width={basteW + 2} height={70} aria-hidden="true">
          <rect x="1" y="1" width={basteW} height="68" rx="7" />
        </svg>
        <span className="tag">basted by Claude · 3 cuts</span>
      </div>
      <div className="cursor cur-claude" style={{ left: X(9), top: 24 + 36 * 4 + 14 }} aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M3 2l17 8-7.2 2.3L9.6 20z" fill="var(--sd-accent)" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span>Claude</span>
      </div>
    </>
  );
});
