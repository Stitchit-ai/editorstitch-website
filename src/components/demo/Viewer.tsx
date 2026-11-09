"use client";

import { SegC } from "./controls";
import { captionWords, img, pad, tracks } from "./data";
import { Icon } from "./icons";

type ViewerProps = { t: number; playing: boolean; onPlay: () => void; onStep: (d: number) => void };

/** Preview: what's under the playhead, including the agent's basted edits. */
export function Viewer({ t, playing, onPlay, onStep }: ViewerProps) {
  const clip = tracks[3].clips.find((c) => t >= c.a && t < c.b) ?? tracks[3].clips[0];
  const s = Math.floor(t);
  const f = Math.floor((t - s) * 30);
  const inCap = t >= 20 && t < 25;
  const word = Math.min(captionWords.length - 1, Math.floor(t - 20));

  return (
    <div className="viewer">
      <div className="vtop">
        <span className="mono">Preview · 1920×1080</span>
        <SegC options={["Fit", "50%", "100%"]} style={{ width: 150 }} />
      </div>
      <div className="frame">
        <img src={img(clip.img!)} alt="Preview frame" className={t >= 24 && t < 38 ? "golden" : ""} />
        <div className={`fpin${t >= 8 && t < 12 ? "" : " hid"}`} />
        <div className={`ftitle${t >= 1 && t < 6 ? "" : " hid"}`}>
          <b>Road trip</b>
          <span>Five days · no map</span>
        </div>
        <div className={`fcap${inCap ? "" : " hid"}`} aria-hidden={!inCap}>
          {captionWords.map((w, i) => (
            <span key={w} className={inCap && i === word ? "on" : ""}>
              {w}
              {i < captionWords.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
        <div className="safe" />
      </div>
      <div className="transport">
        <div className="tc">
          00:{pad(Math.floor(s / 60))}:{pad(s % 60)}:{pad(f)} <span>/ 00:01:00:00</span>
        </div>
        <div className="tbtns">
          <button type="button" className="ib" aria-label="Back one second" onClick={() => onStep(-1)}>
            <Icon n="prev" />
          </button>
          <button type="button" className="ib play" aria-label={playing ? "Pause" : "Play"} onClick={onPlay}>
            <Icon n={playing ? "pause" : "play"} />
          </button>
          <button type="button" className="ib" aria-label="Forward one second" onClick={() => onStep(1)}>
            <Icon n="next" />
          </button>
        </div>
        <div className="tright">1080p · 30 fps</div>
      </div>
    </div>
  );
}
