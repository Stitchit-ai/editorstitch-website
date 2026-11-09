/** Icon set from the Inside Stitch Artifact (24×24, stroke icons; `.th` strokes take the accent when active). */
const I = {
  media: '<rect x="3" y="7" width="14" height="13" rx="2.5"/><path d="M7 4h11.5A2.5 2.5 0 0 1 21 6.5V16"/><path class="th" d="M8.5 11v5l4-2.5z"/>',
  transcript: '<path d="M4 6h13M4 10h16M4 14h7M4 18h5"/><path class="th" d="M14 15v4M17 13v8M20 15.5v3"/>',
  text: '<path d="M5 7V5h14v2M12 5v14"/><path class="th" d="M9 19h6"/>',
  audio: '<path d="M3 12h1.5M7 9v6M10.5 5v14M14 8v8"/><path class="th" d="M17.5 10.5v3M21 12h0"/>',
  effects: '<path d="M11 3.5l1.9 5.1 5.1 1.9-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9z"/><path class="th" d="M18.5 15v5M16 17.5h5"/>',
  transitions:
    '<rect x="3" y="6" width="8" height="12" rx="2"/><rect x="13" y="6" width="8" height="12" rx="2"/><path class="th" d="M12 3v18" stroke-dasharray="2.2 2.4"/>',
  inspiration:
    '<rect x="3.5" y="3.5" width="7" height="9" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/><rect class="th" x="3.5" y="15.5" width="7" height="5" rx="1.5"/>',
  extensions:
    '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/><path class="th" d="M16.5 3.5v7M13 7h7"/>',
  folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path class="th" d="M7 13h10" stroke-dasharray="2 2.4"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  play: '<path class="th" d="M7.5 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8a1 1 0 0 0-1.5.86z"/>',
  pause: '<rect x="6.5" y="5" width="3.6" height="14" rx="1.2"/><rect class="th" x="13.9" y="5" width="3.6" height="14" rx="1.2"/>',
  prev: '<path d="M18 6l-8 6 8 6z"/><path class="th" d="M6 6v12"/>',
  next: '<path d="M6 6l8 6-8 6z"/><path class="th" d="M18 6v12"/>',
  select: '<path d="M5 3.5l13 7-5.6 1.8L10.6 18z"/><path class="th" d="M13.5 13.5l5 5"/>',
  blade: '<circle cx="6" cy="6.5" r="2.6"/><circle cx="6" cy="17.5" r="2.6"/><path d="M8.2 16L20 5.5"/><path class="th" d="M8.2 8L20 18.5"/>',
  snap: '<path d="M6 4v8a6 6 0 0 0 12 0V4"/><path class="th" d="M4 8h4M16 8h4"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path class="th" d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="M15 14l5-5-5-5"/><path class="th" d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  export: '<path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/><path class="th" d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/>',
  panelL: '<rect x="3" y="4" width="18" height="16" rx="2"/><path class="th" d="M9 4v16"/>',
  panelB: '<rect x="3" y="4" width="18" height="16" rx="2"/><path class="th" d="M3 14h18"/>',
  panelR: '<rect x="3" y="4" width="18" height="16" rx="2"/><path class="th" d="M15 4v16"/>',
  visible: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  volume: '<path d="M4 9.5h3l5-4v13l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/>',
  attach: '<path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3l7.6-7.6"/>',
  send: '<path class="th" d="M12 19V5M6 11l6-6 6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path class="th" d="M15.5 15.5l5 5"/>',
  add: '<path class="th" d="M12 5v14M5 12h14"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
} as const;

export type IconName = keyof typeof I;

export function Icon({ n, s = 18, className = "" }: { n: IconName; s?: number; className?: string }) {
  return (
    <svg
      className={`ic ${className}`}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      aria-hidden="true"
      // Static, trusted icon markup from this module.
      dangerouslySetInnerHTML={{ __html: I[n] }}
    />
  );
}

/** Stitch app mark used in the window title bar. */
export function AppMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--sd-mark-bg)" />
      <path d="M9 23l1.84-1.84M15.08 16.92l1.84-1.84M21.16 10.84L23 9" stroke="var(--sd-accent)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}
