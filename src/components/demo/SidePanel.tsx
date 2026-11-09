"use client";

import { memo, useState } from "react";
import { SegC, Toggle } from "./controls";
import { effects, extensions, img, media, sounds, textPresets, transcript, transitions, views, wavePath } from "./data";
import { Icon } from "./icons";

/** The left panel. Its content follows the activity-bar view (Media, Transcript, Text, …). */
export const SidePanel = memo(function SidePanel({ view, onToast }: { view: number; onToast: (m: string) => void }) {
  const [key, name] = views[view];
  return (
    <aside className="side" aria-label={name}>
      <div className="ph">
        <span>{name}</span>
        <span className="act2">
          {key === "media" && (
            <button type="button" className="btnp" style={{ padding: "4px 10px", fontSize: 11.5 }}>
              <Icon n="add" s={13} />
              Import
            </button>
          )}
          {key === "transcript" && <span className="pill free">Transcribed</span>}
        </span>
      </div>
      {/* key: each view mounts fresh, like the Artifact's re-render */}
      <div className="pb sd-view-in" key={key}>
        {key === "media" && <MediaView />}
        {key === "transcript" && <TranscriptView />}
        {key === "text" && <TextView onToast={onToast} />}
        {key === "audio" && <SoundsView />}
        {key === "effects" && <EffectsView />}
        {key === "transitions" && <TransitionsView />}
        {key === "inspiration" && <InspirationView />}
        {key === "extensions" && <ExtensionsView />}
      </div>
    </aside>
  );
});

function MediaView() {
  return (
    <>
      <div className="chips">
        <span className="chip on">All</span>
        <span className="chip">Video</span>
        <span className="chip">Images</span>
        <span className="chip">Audio</span>
      </div>
      <div className="glabel">
        <span>In this folder</span>
        <span>8</span>
      </div>
      <div className="thumbs">
        {media.map(([im, nm, dur, used]) => (
          <div className="th2" key={nm}>
            <div className="im">
              <img src={img(im)} alt="" loading="lazy" />
              {used && <i className="used" title="On the timeline" />}
              <em>{dur}</em>
            </div>
            <div className="nm">{nm}</div>
          </div>
        ))}
      </div>
      <div className="glabel">
        <span>generated/ · by Claude</span>
        <span>1</span>
      </div>
      <div className="thumbs">
        <div className="th2 gen">
          <div
            className="im"
            style={{
              background: "linear-gradient(160deg,#2b2a6b,#a84a78 55%,#f08a5a)",
              display: "grid",
              placeItems: "center",
              font: "400 20px var(--sd-serif)",
              color: "#fff8ee",
            }}
          >
            Road trip
          </div>
          <div className="nm">title-roadtrip.png</div>
        </div>
        <div className="drop">
          <b>drop files here</b>or paste a link
        </div>
      </div>
    </>
  );
}

function TranscriptView() {
  return (
    <>
      <div className="sel2">
        <span>car-chat.wav</span>
        <span className="mono" style={{ color: "var(--sd-muted)" }}>
          0:24
        </span>
      </div>
      <div style={{ display: "grid" }}>
        {transcript.map((l) =>
          l.kind === 1 ? (
            <div className="tline pause" key={l.ts}>
              <span className="ts">{l.ts}</span>
              <span>
                <span className="x">[{l.text}]</span> <span style={{ fontSize: 10.5, color: "var(--sd-accent)" }}>cut</span>
              </span>
            </div>
          ) : (
            <div className={`tline${l.kind === 2 ? " now" : ""}`} key={l.ts}>
              <span className="ts">{l.ts}</span>
              <span>
                <span
                  className="spk"
                  style={{
                    background:
                      l.who === "Ana"
                        ? "color-mix(in oklab,var(--sd-lavc) 22%,transparent)"
                        : "color-mix(in oklab,var(--sd-woad) 22%,transparent)",
                  }}
                >
                  {l.who}
                </span>
                {l.filler && <span className="filler">{l.filler}</span>}
                {l.filler ? " " : ""}
                {l.text}
              </span>
            </div>
          ),
        )}
      </div>
      <div className="glabel">
        <span>Pauses</span>
        <span>3 found</span>
      </div>
      <SegC options={["Gentle", "Natural", "Tight"]} initial={1} />
      <div className="row">
        No filler words
        <Toggle on label="No filler words" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="btnp" style={{ flex: 1 }}>
          Add captions
        </button>
        <button type="button" className="btns">
          Subtitles .srt
        </button>
      </div>
    </>
  );
}

function TextView({ onToast }: { onToast: (m: string) => void }) {
  return (
    <>
      <div className="ihint">click one to drop it at the playhead</div>
      <div className="tcards">
        {textPresets.map((t) => (
          <button
            type="button"
            className="tpre"
            key={t.name}
            style={{ backgroundImage: `url(${img(t.bg)})` }}
            title={t.hint}
            onClick={() => onToast(`${t.name} dropped at the playhead`)}
          >
            <span style={t.style}>{t.sample}</span>
            <small>{t.name}</small>
          </button>
        ))}
      </div>
    </>
  );
}

function SoundsView() {
  return (
    <>
      <SegC options={["Music", "Sound effects"]} />
      <div className="chips">
        {["All", "Calm", "Upbeat", "Cinematic", "Lo-fi"].map((c, i) => (
          <span key={c} className={`chip${i ? "" : " on"}`}>
            {c}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gap: 2 }}>
        {sounds.map(([n, src, len, amp], i) => (
          <div className="snd" key={n}>
            <button type="button" className="pl" aria-label={`Play ${n}`}>
              <Icon n="play" s={12} />
            </button>
            <div style={{ minWidth: 0 }}>
              <b>{n}</b>
              <span>
                {src} · {len}
              </span>
              <svg className="wv" width={150} height={14} viewBox="0 0 150 14" style={{ display: "block", position: "static", marginTop: 3 }}>
                <path d={wavePath(150, 14, 44, amp * 6, i * 17 + 5)} stroke="var(--sd-verdigris)" strokeOpacity={0.8} strokeWidth={1.3} strokeLinecap="round" />
              </svg>
            </div>
            <button type="button" className="btns" style={{ padding: "4px 9px", fontSize: 11.5 }}>
              Add
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function EffectsView() {
  const [on, setOn] = useState(0);
  return (
    <>
      <div className="am" style={{ fontSize: 12 }}>
        Colour looks, stylised pictures, blur and more. Previewed on your frame.
      </div>
      <div className="fxg">
        {effects.map(([n, f], i) => (
          <button type="button" className={`fx${i === on ? " on" : ""}`} key={n} aria-pressed={i === on} onClick={() => setOn(i)}>
            <div className="im">
              <img src={img("hero-desert")} alt="" style={{ filter: f }} />
              {n === "Vignette" && <i style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 30px 10px rgba(0,0,0,.7)" }} />}
            </div>
            {n}
          </button>
        ))}
      </div>
      <div className="glabel">
        <span>ADJUSTMENT LAYER</span>
      </div>
      <div className="am" style={{ fontSize: 12 }}>
        Drop an effect on the Effect track to change everything below it.
      </div>
    </>
  );
}

function TransitionsView() {
  return (
    <>
      <div className="am" style={{ fontSize: 12 }}>
        How this clip moves into the next one. Hover to watch.
      </div>
      <div className="trg">
        {transitions.map(([n, anim]) => (
          <button type="button" className="tr" key={n} style={{ "--sd-anim": anim } as React.CSSProperties}>
            <div className="im">
              <img className="a" src={img("hero-road")} alt="" />
              <img className="b" src={img("hero-tram")} alt="" />
            </div>
            {n}
          </button>
        ))}
      </div>
      <button type="button" className="btns">
        All transitions…
      </button>
    </>
  );
}

function InspirationView() {
  return (
    <>
      <div className="insp-in">
        <Icon n="link" s={14} />
        Paste a link (Ctrl+V), then Enter
      </div>
      <div className="icard">
        <div className="hd">
          <img src={img("show-cinema")} alt="" />
          <span>reference · 2:10</span>
        </div>
        <div className="bd">
          <b style={{ fontSize: 12.5 }}>Your agent&apos;s breakdown</b>
          <div className="metric">
            <span>Pacing</span>
            <div className="bars">
              {[6, 10, 4, 14, 8, 16, 5, 12, 9, 18, 7, 11].map((h, i) => (
                <i key={i} style={{ height: h }} />
              ))}
            </div>
          </div>
          <div className="metric">
            <span>Rhythm</span>
            <b style={{ fontWeight: 500 }}>96 bpm · cuts on the beat</b>
          </div>
          <div className="metric">
            <span>Look</span>
            <div className="swatches">
              {["#2a1a12", "#7a3b1c", "#d9822b", "#f6c27a", "#1d2633"].map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="metric">
            <span>Transitions</span>
            <b style={{ fontWeight: 500 }}>Hard cuts, one dissolve</b>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <button type="button" className="btnp" style={{ flex: 1 }}>
              Apply look to my clips
            </button>
            <button type="button" className="btns">
              Copy prompt
            </button>
          </div>
        </div>
      </div>
      <div className="ihint">Stitch measures, your agent explains. Nothing is sent without you.</div>
    </>
  );
}

function ExtensionsView() {
  return (
    <>
      <div className="insp-in">
        <Icon n="search" s={14} />
        Search: typography, music, 3D…
      </div>
      <div className="glabel">
        <span>STITCH PICKS</span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {extensions.map(([n, desc, col, price, ic], i) => (
          <div className="ext" key={n}>
            <span className="lg" style={{ background: `color-mix(in oklab,${col} 22%,transparent)`, color: col }}>
              <Icon n={ic} s={18} />
            </span>
            <div style={{ minWidth: 0 }}>
              <b>{n}</b>
              <span>{desc}</span>
              <div className="tgs">
                <span className={`pill${price === "Free" ? " free" : ""}`}>{price}</span>
              </div>
            </div>
            <button type="button" className={i < 2 ? "btns" : "btnp"} style={{ padding: "4px 10px", fontSize: 11.5 }}>
              {i < 2 ? "On" : "Install"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
