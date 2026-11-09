"use client";

import { img, px, recents } from "./data";
import { Icon } from "./icons";

/** Home: "What are we making today?", recent projects and the four first-run steps. */
export function HomeScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="home">
      <img className="hpx" src={px("planet")} alt="" style={{ right: 60, top: 40, width: 260 }} />
      <img className="hpx" src={px("needle")} alt="" style={{ left: 30, bottom: 40, width: 300, opacity: 0.6 }} />
      <div className="hl">
        <div>
          <h2>
            What are we
            <br />
            making <em>today?</em>
          </h2>
          <p className="sub">Open the folder with your footage. Stitch keeps the project in .stitch beside it.</p>
        </div>
        <div className="hbtns">
          <button type="button" className="btnp" onClick={onOpen}>
            <Icon n="folder" s={17} />
            Open Folder…
          </button>
          <button type="button" className="btns">
            <Icon n="add" s={16} />
            Import media
          </button>
        </div>
        <div className="recent">
          <h4>Recent</h4>
          {recents.map(([name, path, when, pics]) => (
            <button type="button" className="rec" key={name} onClick={onOpen} aria-label={`Open ${name}`}>
              <div className="st">
                {pics.map((p) => (
                  <img key={p} src={img(p)} alt="" />
                ))}
              </div>
              <div style={{ textAlign: "left" }}>
                <b>{name}</b>
                <span>{path}</span>
              </div>
              <span className="when">{when}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="hr">
        <div className="hnd" style={{ margin: "150px 0 0 4px" }}>
          four steps, then it&apos;s yours
        </div>
        <div className="steps">
          <div className="stp done">
            <span className="n">1</span>
            <div>
              <b>Open a folder</b>
              <p>The project, imported media and generated clips live in .stitch inside it. Your own files are never moved.</p>
            </div>
          </div>
          <div className="stp done">
            <span className="n">2</span>
            <div>
              <b>Import media</b>
              <p>Video, images and audio are copied in, so the project travels with the folder.</p>
            </div>
          </div>
          <div className="stp">
            <span className="n">3</span>
            <div>
              <b>Ask the agent</b>
              <p>Claude, Codex or Gemini works inside .stitch: it renders clips there and reads your footage.</p>
            </div>
          </div>
          <div className="stp">
            <span className="n">4</span>
            <div>
              <b>Play it back</b>
              <p>Space plays, arrow keys step a frame, Ctrl + wheel zooms the timeline.</p>
            </div>
          </div>
        </div>
        <div className="agentcard">
          <span className="dot" />
          <div>
            <b>Claude Code</b> <span>connected · works inside .stitch only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
