"use client";

import { useEffect, useState } from "react";
import { img, px } from "./data";
import { Icon } from "./icons";

const RES = ["480p", "720p", "1080p", "4K"];
const SIZE = ["18", "42", "96", "310"];
const BARS = 48;

/** Export: the form, the stitch-by-stitch progress, then "Your video is ready". */
export function ExportSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "run" | "done">("form");
  const [res, setRes] = useState(2);
  const [vert, setVert] = useState(false);
  const [filled, setFilled] = useState(0);

  // Every time the sheet opens it starts at the form (as in the Artifact).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep("form");
      setFilled(0);
    }
  }

  useEffect(() => {
    if (step !== "run") return;
    const id = setInterval(() => {
      setFilled((k) => {
        if (k + 1 >= BARS) {
          clearInterval(id);
          setTimeout(() => setStep("done"), 70);
          return BARS;
        }
        return k + 1;
      });
    }, 70);
    return () => clearInterval(id);
  }, [step]);

  const left = Math.max(1, Math.round((BARS - filled) * 0.07));

  return (
    <div className="scrim" aria-hidden={!open}>
      <div className="sheet" role="dialog" aria-label="Export video" key={step}>
        {step === "form" && (
          <>
            <div className="sh-h">
              <b>Export video</b>
              <button type="button" className="ib" aria-label="Close" onClick={onClose}>
                <Icon n="close" s={16} />
              </button>
            </div>
            <div className="sh-b">
              <div className="exg">
                <div className={`exprev${vert ? " vert" : ""}`}>
                  <img src={img("hero-road")} alt="" />
                  <em>1:00</em>
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  <div className="fld">
                    <label>Name</label>
                    <div className="inp">road-trip.mp4</div>
                  </div>
                  <div className="fld">
                    <label>Save to</label>
                    <div className="inp">
                      <span className="mono">C:\Users\you\Videos</span>
                      <span style={{ color: "var(--sd-accent)", fontSize: 12 }}>Save as…</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fld">
                <label>Resolution</label>
                <span className="segc">
                  {RES.map((r, i) => (
                    <button type="button" key={r} className={i === res ? "on" : ""} aria-pressed={i === res} onClick={() => setRes(i)}>
                      {r}
                    </button>
                  ))}
                </span>
              </div>
              <div className="row" style={{ padding: "10px 12px", border: "1px solid var(--sd-line)", borderRadius: 10 }}>
                <span>
                  <b style={{ color: "var(--sd-text)", fontWeight: 600 }}>Use Shorts / Reels / TikTok</b>
                  <br />
                  <span style={{ fontSize: 11.5 }}>Switch the canvas to vertical</span>
                </span>
                <button type="button" className={`tg${vert ? " on" : ""}`} aria-pressed={vert} aria-label="Vertical canvas" onClick={() => setVert(!vert)} />
              </div>
            </div>
            <div className="sh-f">
              <span style={{ fontSize: 12, color: "var(--sd-muted)" }}>MP4 · H.264 · about {SIZE[res]} MB</span>
              <span style={{ display: "flex", gap: 8 }}>
                <button type="button" className="btns" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="btnp" onClick={() => setStep("run")}>
                  Export
                </button>
              </span>
            </div>
          </>
        )}
        {step === "run" && (
          <>
            <div className="sh-h">
              <b>Exporting…</b>
              <button type="button" className="ib" aria-label="Close" onClick={onClose}>
                <Icon n="close" s={16} />
              </button>
            </div>
            <div className="sh-b">
              <div className="prog">
                <div className="stbar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((filled / BARS) * 100)}>
                  {Array.from({ length: BARS }, (_, i) => (
                    <i key={i} className={i < filled ? "f" : ""} />
                  ))}
                </div>
                <div className="meta">
                  <span>{filled < 6 ? "Working out how long it will take…" : `About ${left} s left`}</span>
                  <b>{Math.round((filled / BARS) * 100)}%</b>
                </div>
              </div>
              <div className="am" style={{ fontSize: 12 }}>
                road-trip.mp4 · {RES[res]}
                {vert ? " · vertical" : ""}
              </div>
            </div>
            <div className="sh-f">
              <span />
              <button type="button" className="btns" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
        {step === "done" && (
          <div className="sh-b">
            <div className="donew">
              <img className="hpx" style={{ position: "static", width: 200 }} src={px("needle")} alt="" />
              <h3>Your video is ready</h3>
              <p className="mono" style={{ fontSize: 12 }}>
                C:\Users\you\Videos\road-trip.mp4
              </p>
              <div className="acts">
                <button type="button" className="btnp">
                  <Icon n="play" s={14} />
                  Play
                </button>
                <button type="button" className="btns">
                  Show in folder
                </button>
                <button type="button" className="btns" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

