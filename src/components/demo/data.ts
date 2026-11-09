/**
 * Content of the interactive Stitch demo, taken from the Inside Stitch Artifact
 * (the reference prototype built from the real app's panel names and settings).
 */

import type { CSSProperties } from "react";

export const img = (name: string) => `/demo/${name}.webp`;
export const px = (name: "needle" | "planet" | "reel") => `/demo/px-${name}.png`;

export type Screen = "home" | "editor" | "export";
export type Theme = "loom" | "paper";
export type Tab = "agent" | "insp";
export type Baste = "" | "kept" | "undone";

/* ---------- activity bar views ---------- */
export const views = [
  ["media", "Media"],
  ["transcript", "Transcript"],
  ["text", "Text"],
  ["audio", "Sounds"],
  ["effects", "Effects"],
  ["transitions", "Transitions"],
  ["inspiration", "Inspiration"],
  ["extensions", "Extensions"],
] as const;
export type ViewKey = (typeof views)[number][0];

/* ---------- media bin: [image, name, duration, on the timeline] ---------- */
export const media: [string, string, string, boolean][] = [
  ["hero-road", "road.mov", "0:42", true],
  ["hero-tram", "tram-28.mov", "0:21", true],
  ["hero-desert", "dune-climb.mov", "1:12", true],
  ["hero-dune", "dancer.mov", "0:18", true],
  ["m-2", "field-sunset.mov", "0:54", true],
  ["m-3", "jump.mov", "0:09", false],
  ["m-4", "above-clouds.mov", "1:30", false],
  ["c-2", "van.jpg", "still", false],
];

/* ---------- transcript: [time, speaker, words(html-free parts), kind 0=line 1=pause 2=now] ---------- */
export type TranscriptLine = { ts: string; who: "Ana" | "Joe" | ""; filler?: string; text: string; kind: 0 | 1 | 2 };
export const transcript: TranscriptLine[] = [
  { ts: "0:01", who: "Ana", text: "So we just… kept driving.", kind: 0 },
  { ts: "0:04", who: "", text: "pause 1.4 s", kind: 1 },
  { ts: "0:05", who: "Ana", filler: "Like,", text: "no map, no plan.", kind: 0 },
  { ts: "0:08", who: "Joe", text: "Until the road ran out.", kind: 2 },
  { ts: "0:11", who: "", text: "pause 2.1 s", kind: 1 },
  { ts: "0:13", who: "Joe", text: "And then we walked.", kind: 0 },
  { ts: "0:16", who: "", text: "pause 0.9 s", kind: 1 },
  { ts: "0:17", who: "Ana", filler: "Um,", text: "best five days of the year.", kind: 0 },
];

/* ---------- text presets: [name, sample, hint, sample style, background] ---------- */
export const textPresets: { name: string; sample: string; hint: string; style: CSSProperties; bg: string }[] = [
  { name: "Title", sample: "Your title", hint: "The big opening words", style: { font: "400 22px var(--sd-serif)" }, bg: "hero-road" },
  {
    name: "Subtitle",
    sample: "A line under the title",
    hint: "",
    style: { font: "500 13px var(--sd-sans)", letterSpacing: ".1em", textTransform: "uppercase" },
    bg: "m-4",
  },
  {
    name: "Lower third",
    sample: "Ana Ribeiro",
    hint: "Who is speaking, bottom left",
    style: {
      font: "600 13px var(--sd-sans)",
      justifySelf: "start",
      alignSelf: "end",
      borderLeft: "3px solid var(--sd-cochineal)",
      paddingLeft: 6,
    },
    bg: "hero-tram",
  },
  { name: "Caption", sample: "Your caption here", hint: "For watching muted", style: { font: "700 13px var(--sd-sans)", alignSelf: "end" }, bg: "hero-desert" },
  { name: "Quote", sample: "“Same rails, same bell.”", hint: "Words worth repeating", style: { font: "italic 400 15px var(--sd-serif)" }, bg: "m-2" },
  {
    name: "Big statement",
    sample: "WOW",
    hint: "One loud word or number",
    style: { font: "800 30px var(--sd-sans)", letterSpacing: "-.02em" },
    bg: "hero-dune",
  },
];

/* ---------- sounds: [name, source, length, loudness] ---------- */
export const sounds: [string, string, string, number][] = [
  ["Storybook bed", "Jamendo · calm", "2:48", 0.9],
  ["Open road", "Jamendo · upbeat", "3:12", 0.7],
  ["Slow dust", "Jamendo · cinematic", "4:05", 0.6],
  ["Car door", "Freesound · sfx", "0:02", 0.4],
  ["Tram bell", "Freesound · sfx", "0:03", 0.5],
  ["Wind on the hill", "Freesound · ambience", "0:30", 0.3],
];

/* ---------- effects: [name, CSS filter preview] ---------- */
export const effects: [string, string][] = [
  ["Golden look", "saturate(1.4) sepia(.25) contrast(1.05)"],
  ["Film grain", "contrast(1.15) saturate(.8)"],
  ["Mono", "grayscale(1) contrast(1.1)"],
  ["Teal & orange", "hue-rotate(-12deg) saturate(1.5)"],
  ["Fade", "contrast(.75) brightness(1.12) saturate(.8)"],
  ["Blur", "blur(2px)"],
  ["Vignette", "brightness(.9)"],
  ["Glow", "brightness(1.15) saturate(1.2) blur(.4px)"],
];

/* ---------- transitions: [name, hover animation] ---------- */
export const transitions: [string, string][] = [
  ["Dissolve", "sd-t-dissolve"],
  ["Dip to black", "sd-t-dip"],
  ["Cross zoom", "sd-t-zoom"],
  ["Wipe", "sd-t-wipe"],
  ["Slide", "sd-t-slide"],
  ["Whip pan", "sd-t-whip"],
];

/* ---------- extensions: [name, description, colour, price, icon] ---------- */
export const extensions: [string, string, string, string, "effects" | "audio" | "text"][] = [
  ["Blender clips", "3D titles and objects, rendered locally", "#E87D0D", "Free", "effects"],
  ["Voiceover", "Text to speech for narration", "#7B62E6", "Free", "audio"],
  ["Freesound", "Sound effects search", "#3FB59A", "Free tier", "audio"],
  ["Jamendo", "Music for your edits", "#D2508E", "Free tier", "audio"],
  ["Type foundry", "Kinetic typography packs", "#4C9FD0", "Paid", "text"],
];

/* ---------- home: recent projects ---------- */
export const recents: [string, string, string, [string, string, string]][] = [
  ["road-trip", "D:\\Films\\road-trip", "2 h ago", ["hero-road", "hero-tram", "hero-desert"]],
  ["lisbon-diary", "D:\\Films\\lisbon", "Yesterday", ["m-6", "c-1", "hero-tram"]],
  ["studio-launch", "D:\\Work\\studio-launch", "3 days ago", ["show-brand", "feat-ai", "how-1"]],
  ["autumn-short", "D:\\Films\\autumn", "Last week", ["com-autumn", "com-forest", "cta-mug"]],
];

/* ---------- timeline ---------- */
export const DUR = 60;
export const LEFT = 8;
export const LANE = 676;
export const PPS = LANE / DUR;
export const X = (t: number) => LEFT + t * PPS;

export type ClipKind = "text" | "effect" | "graphic" | "video" | "audio";
export type Clip = { id: number; a: number; b: number; n: string; k: ClipKind; img?: string; track: Track };
export type Track = {
  id: "Text" | "Effect" | "Graphic" | "Video" | "Voice" | "Music";
  d: "weld" | "woad" | "cochineal" | "indigo" | "verdigris";
  v?: boolean;
  au?: boolean;
  soft?: boolean;
  clips: Clip[];
};

type RawClip = Omit<Clip, "id" | "track">;
const raw: (Omit<Track, "clips"> & { clips: RawClip[] })[] = [
  {
    id: "Text",
    d: "weld",
    clips: [
      { a: 1, b: 6, n: "Title · Road trip", k: "text" },
      { a: 20, b: 25, n: "Caption · until the road ran out", k: "text" },
    ],
  },
  { id: "Effect", d: "woad", clips: [{ a: 24, b: 38, n: "Golden look", k: "effect" }] },
  { id: "Graphic", d: "cochineal", clips: [{ a: 8, b: 12, n: "Sticker · map pin", k: "graphic" }] },
  {
    id: "Video",
    d: "indigo",
    v: true,
    clips: [
      { a: 0, b: 14, n: "road.mov", k: "video", img: "hero-road" },
      { a: 14, b: 24, n: "tram-28.mov", k: "video", img: "hero-tram" },
      { a: 24, b: 38, n: "dune-climb.mov", k: "video", img: "hero-desert" },
      { a: 38, b: 48, n: "dancer.mov", k: "video", img: "hero-dune" },
      { a: 48, b: 60, n: "field-sunset.mov", k: "video", img: "m-2" },
    ],
  },
  { id: "Voice", d: "verdigris", au: true, clips: [{ a: 0, b: 24, n: "car-chat.wav", k: "audio" }] },
  { id: "Music", d: "verdigris", au: true, soft: true, clips: [{ a: 0, b: 60, n: "Storybook bed · Jamendo", k: "audio" }] },
];

let cid = 0;
export const tracks: Track[] = raw.map((t) => {
  const track = { ...t, clips: [] as Clip[] } as Track;
  track.clips = t.clips.map((c) => ({ ...c, id: cid++, track }));
  return track;
});
export const clipById: Record<number, Clip> = Object.fromEntries(tracks.flatMap((t) => t.clips).map((c) => [c.id, c]));
/** Pauses the agent cut out of car-chat (shown as joints and x marks). */
export const cuts = [6.2, 11.8, 17.5];
export const captionWords = "until the road ran out".split(" ");

export const pad = (n: number) => String(n).padStart(2, "0");
export const fmt = (t: number) => `${Math.floor(t / 60)}:${pad(Math.floor(t % 60))}`;

/** Deterministic waveform (same on server and client). */
export function wavePath(w: number, h: number, n: number, amp: number, seed: number) {
  let d = "";
  let r = seed;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) {
    const x = ((i + 0.5) * w) / n;
    const a = amp * (0.25 + 0.75 * rnd()) * (0.55 + 0.45 * Math.sin(i / 6));
    d += `M${x.toFixed(1)} ${(h / 2 - a).toFixed(1)}V${(h / 2 + a).toFixed(1)}`;
  }
  return d;
}
