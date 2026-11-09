"use client";

import { memo, useState } from "react";
import { SegC, Slider, Toggle } from "./controls";
import { type Baste, type Clip, type Tab, clipById, fmt, img, px } from "./data";
import { Icon } from "./icons";

type RightPanelProps = {
  tab: Tab;
  sel: number | null;
  baste: Baste;
  pulse: string | null;
  onTab: (t: Tab) => void;
  onBaste: (b: Baste) => void;
};

/** Right panel: the agent conversation ("Claude") and the clip Inspector. */
export const RightPanel = memo(function RightPanel({ tab, sel, baste, pulse, onTab, onBaste }: RightPanelProps) {
  const status = baste === "kept" ? "Done" : baste === "undone" ? "Undone" : "Basted";
  return (
    <aside className="right" aria-label="Agent and inspector">
      <div className="rtabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "agent"} className={`rtab${tab === "agent" ? " on" : ""}`} onClick={() => onTab("agent")}>
          Claude{" "}
          <span className={`sw${baste ? " done" : ""}`}>
            <svg className="run" viewBox="0 0 16 6" aria-hidden="true">
              <path d="M1 3h14" />
            </svg>
            <span>{status}</span>
          </span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "insp"} className={`rtab${tab === "insp" ? " on" : ""}`} onClick={() => onTab("insp")}>
          Inspector
        </button>
      </div>
      <div className="rbody">
        {tab === "agent" ? (
          <AgentLog baste={baste} pulse={pulse} onBaste={onBaste} />
        ) : (
          <Inspector key={sel ?? "none"} clip={sel !== null ? clipById[sel] : null} />
        )}
      </div>
    </aside>
  );
});

function AgentLog({ baste, pulse, onBaste }: { baste: Baste; pulse: string | null; onBaste: (b: Baste) => void }) {
  const [ending, setEnding] = useState(0);
  const head = baste === "kept" ? "Sewn" : baste === "undone" ? "Undone" : "Basted";
  const endings: [string, string | null][] = [
    ["Field at sunset", "m-2"],
    ["Dancer in the dune", "hero-dune"],
    ["I'll pick myself", null],
  ];
  return (
    <>
      <div className="log sd-view-in">
        <div className="sys">Picked up where you left off · today 18:40</div>
        <div className={`ub${pulse === "prompt" ? " sd-pulse" : ""}`}>Make a 60 s reel from the road trip. Punchy, captions on, end on the field.</div>
        <div className="tools">
          <div className="tool">
            <Icon n="transcript" s={13} />
            <b>Read</b>transcript · car-chat.wav
            <span className="ok">
              <Icon n="check" s={13} />
            </span>
          </div>
          <div className="tool">
            <Icon n="media" s={13} />
            <b>Read</b>timeline · 5 clips
            <span className="ok">
              <Icon n="check" s={13} />
            </span>
          </div>
          <div className="tool">
            <Icon n="text" s={13} />
            <b>Write</b>generated/title-roadtrip.png
            <span className="ok">
              <Icon n="check" s={13} />
            </span>
          </div>
        </div>
        <div className="am">
          Cut <b>3 pauses</b> from car-chat (−4.4 s), put the title over the road shot and a golden look on the dune. It&apos;s basted on the
          timeline.
        </div>
        <div className={`res${pulse === "plan" ? " sd-pulse" : ""}`}>
          <div className="hd">
            <span>{head} · 5 edits</span>
            <span>on the timeline</span>
          </div>
          <div className="r">
            <span>3 cuts in car-chat</span>
            <span>−4.4 s</span>
          </div>
          <div className="r">
            <span>Title · Road trip</span>
            <span>0:01 – 0:06</span>
          </div>
          <div className="r">
            <span>Golden look on dune-climb</span>
            <span>0:24 – 0:38</span>
          </div>
          <div className="acts">
            {baste ? (
              <button type="button" className="btns" onClick={() => onBaste("")}>
                Baste again
              </button>
            ) : (
              <>
                <button type="button" className="btnp" onClick={() => onBaste("kept")}>
                  Keep
                </button>
                <button type="button" className="btns" onClick={() => onBaste("undone")}>
                  Undo
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`ask${pulse === "plan" ? " sd-pulse" : ""}`} role="radiogroup" aria-label="Which ending suits it?">
          <div className="q">Which ending suits it?</div>
          {endings.map(([label, im], i) => (
            <button type="button" role="radio" aria-checked={ending === i} key={label} className={`opt${ending === i ? " on" : ""}`} onClick={() => setEnding(i)}>
              <i />
              {label}
              {im && <img src={img(im)} alt="" />}
            </button>
          ))}
        </div>
      </div>
      <div className="composer">
        <span className="phd">Tell Stitch what you&apos;re making, or drop in files…</span>
        <div className="rw">
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Icon n="attach" s={16} />
            <span className="model">
              <i />
              Claude Code
            </span>
          </span>
          <span className="send">
            <Icon n="send" s={15} />
          </span>
        </div>
      </div>
    </>
  );
}

function Section({ title, d, children }: { title: string; d: string; children: React.ReactNode }) {
  return (
    <div className="isec" style={{ "--sd-d": d } as React.CSSProperties}>
      <h4>
        {title}
        <i />
      </h4>
      {children}
    </div>
  );
}

function Inspector({ clip: c }: { clip: Clip | null }) {
  if (!c) {
    return (
      <div className="insp sd-view-in" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <img className="hpx" style={{ position: "static", width: 150 }} src={px("reel")} alt="" />
        <div className="hnd">pick a clip to tune it</div>
        <div className="am" style={{ fontSize: 12 }}>
          Its look, speed and sound show up here.
        </div>
      </div>
    );
  }
  const d = `var(--sd-${c.track.d})`;
  const speed = (
    <Section title="Speed" d={d}>
      <SegC options={["0.5×", "1×", "1.5×", "2×"]} initial={1} />
      <div className="row">
        Keep the pitch
        <Toggle on label="Keep the pitch" />
      </div>
    </Section>
  );

  let body: React.ReactNode;
  if (c.k === "text") {
    body = (
      <>
        <Section title="Text" d={d}>
          <div className="tarea">{c.n.split(" · ")[1]}</div>
          <div className="sel2">
            <span>Newsreader</span>
            <Icon n="next" s={12} />
          </div>
          <Slider label="Text size" value={64} min={12} max={160} unit="" />
          <div className="fmt">
            <span className="on">
              <b>B</b>
            </span>
            <span>
              <i>I</i>
            </span>
            <span>
              <u>U</u>
            </span>
          </div>
          <SegC options={["Left", "Centre", "Right"]} initial={1} />
          <div className="row">
            Box behind the text
            <Toggle label="Box behind the text" />
          </div>
          <div className="am" style={{ fontSize: 11.5 }}>
            A box keeps captions readable over busy footage.
          </div>
        </Section>
        <Section title="Look" d={d}>
          <Slider label="Opacity" value={100} min={0} max={100} unit="%" />
          <Slider label="Fade in" value={0.4} min={0} max={2} unit=" s" />
        </Section>
      </>
    );
  } else if (c.k === "audio") {
    body = (
      <>
        <Section title="Sound" d={d}>
          <Slider label="Volume" value={-3} min={-30} max={6} unit=" dB" />
          <Slider label="Fade in" value={0.5} min={0} max={3} unit=" s" />
          <Slider label="Fade out" value={1.2} min={0} max={3} unit=" s" />
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" className="btns" style={{ flex: 1 }}>
              Mute
            </button>
            <button type="button" className="btns" style={{ flex: 1 }}>
              Reset to 0 dB
            </button>
          </div>
        </Section>
        {speed}
      </>
    );
  } else if (c.k === "video") {
    body = (
      <>
        <Section title="Look" d={d}>
          <Slider label="Opacity" value={100} min={0} max={100} unit="%" />
          <Slider label="Size" value={100} min={10} max={300} unit="%" />
          <Slider label="Rotation" value={0} min={-180} max={180} unit="°" />
          <div className="row">
            Round corners
            <Toggle label="Round corners" />
          </div>
          <button type="button" className="btns">
            Reset size, place and turn
          </button>
        </Section>
        {speed}
        <Section title="Effects" d={d}>
          <div className="fxrow">
            {c.a >= 24 && c.a < 38 && <span>Golden look</span>}
            <button type="button" className="btns" style={{ padding: "3px 10px", fontSize: 11.5 }}>
              Add…
            </button>
          </div>
        </Section>
        <Section title="Transition" d={d}>
          <div className="sel2">
            <span>Dissolve · 0.5 s</span>
            <span style={{ color: "var(--sd-accent)", fontSize: 11.5 }}>Change…</span>
          </div>
        </Section>
      </>
    );
  } else {
    body = (
      <Section title="Look" d={d}>
        <Slider label="Opacity" value={c.k === "effect" ? 80 : 100} min={0} max={100} unit="%" />
        <Slider label="Size" value={100} min={10} max={300} unit="%" />
      </Section>
    );
  }

  return (
    <div className="insp sd-view-in">
      <div className="ihead">
        <div className="im" style={{ "--sd-d": d } as React.CSSProperties}>
          {c.img ? <img src={img(c.img)} alt="" /> : c.k === "text" ? "Aa" : ""}
        </div>
        <div>
          <b>{c.n}</b>
          <span>
            {fmt(c.a)} – {fmt(c.b)} · {c.track.id}
          </span>
        </div>
      </div>
      {body}
      <div style={{ marginTop: "auto", fontSize: 11, color: "var(--sd-muted)" }}>
        Deselect the clip <span className="mono">Esc</span>
      </div>
    </div>
  );
}
