"use client";

import { ChevronDown, Download } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig, type Installer } from "@/config/site";

type DownloadButtonProps = {
  /** primary: large orange CTA · compact: navbar ink pill · link: plain text link (footer lists). */
  variant?: "primary" | "compact" | "link";
  className?: string;
};

const installers: { key: string; Icon: (p: { className?: string }) => React.ReactElement; item: Installer }[] = [
  { key: "windows", Icon: WindowsIcon, item: siteConfig.downloads.windows },
  { key: "macos", Icon: AppleIcon, item: siteConfig.downloads.macos },
];

const MENU_WIDTH = 304;
const GUTTER = 16; // keep the menu this far from the viewport edges
const GAP = 8; // space between the button and the menu

type Phase = "closed" | "open" | "closing";
type Place = { top: number; left: number; width: number; above: boolean };

/**
 * "Download Stitch": one button that opens a small platform menu. Every download CTA on the site uses
 * this component; the installer URLs come from `siteConfig.downloads` (src/config/site.ts).
 *
 * The menu is portalled to <body> with fixed positioning, so it is never clipped by a parent with
 * `overflow: hidden`, and it is kept inside the viewport (flipping above the button when needed).
 * Keyboard: Enter/Space/↓ opens, ↑/↓/Home/End move, Esc closes and returns focus, Tab closes.
 */
export function DownloadButton({ variant = "primary", className = "" }: DownloadButtonProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [place, setPlace] = useState<Place | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusOnOpen = useRef<"first" | "last" | null>(null);
  const id = useId();
  const triggerId = `${id}-trigger`;
  const menuId = `${id}-menu`;
  const isOpen = phase === "open";

  const open = (focus: "first" | "last" | null) => {
    focusOnOpen.current = focus;
    setPhase("open");
  };
  const close = useCallback((returnFocus: boolean) => {
    setPhase((p) => (p === "open" ? "closing" : p));
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const finish = useCallback(() => {
    setPhase("closed");
    setPlace(null);
  }, []);

  // Position the menu under (or above) the button, clamped to the viewport.
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const r = trigger.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const width = Math.min(MENU_WIDTH, vw - GUTTER * 2);
    const height = menu.offsetHeight;
    const centre = r.left + r.width / 2 - width / 2;
    const left = Math.min(Math.max(centre, GUTTER), vw - GUTTER - width);
    const below = vh - r.bottom - GAP - GUTTER;
    const above = height > below && r.top - GAP - GUTTER > below;
    setPlace({ top: above ? r.top - GAP - height : r.bottom + GAP, left, width, above });
  }, []);

  useLayoutEffect(() => {
    if (phase !== "open") return;
    reposition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, { passive: true, capture: true });
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, { capture: true });
    };
  }, [phase, reposition]);

  // Move focus into the menu once it has been placed (keyboard opening).
  useEffect(() => {
    if (!isOpen || !place || !focusOnOpen.current) return;
    const items = itemsRef.current;
    (focusOnOpen.current === "first" ? items[0] : items[items.length - 1])?.focus();
    focusOnOpen.current = null;
  }, [isOpen, place]);

  // Close on a press anywhere outside the button and the menu (mouse, pen or touch).
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [isOpen, close]);

  // Unmount after the closing animation (with a fallback in case it never fires).
  useEffect(() => {
    if (phase !== "closing") return;
    const t = window.setTimeout(finish, 200);
    return () => window.clearTimeout(t);
  }, [phase, finish]);

  const onTriggerClick = (e: React.MouseEvent) => {
    if (isOpen) close(false);
    else open(e.detail === 0 ? "first" : null); // detail 0: activated with Enter/Space
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const where = e.key === "ArrowDown" ? "first" : "last";
      if (isOpen) {
        const items = itemsRef.current;
        (where === "first" ? items[0] : items[items.length - 1])?.focus();
      } else open(where);
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      close(true);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = itemsRef.current.filter((el): el is HTMLAnchorElement => !!el);
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const go = (n: number) => {
      e.preventDefault();
      items[(n + items.length) % items.length]?.focus();
    };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i < 0 ? items.length - 1 : i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
    else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") close(true); // focus returns to the button, then Tab moves on from there
  };

  const chevron = (size: number) => (
    <ChevronDown
      aria-hidden="true"
      size={size}
      strokeWidth={2.4}
      className={`-mr-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    />
  );

  const triggerProps = {
    ref: triggerRef,
    id: triggerId,
    type: "button" as const,
    "aria-haspopup": "menu" as const,
    "aria-expanded": isOpen,
    "aria-controls": isOpen ? menuId : undefined,
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
  };

  let trigger: React.ReactNode;
  if (variant === "compact") {
    trigger = (
      // Phones show "Download" only, as before, so the logo keeps its room; the name stays "Download Stitch".
      <button {...triggerProps} aria-label="Download Stitch" className={`btn btn-ink ${className}`}>
        <Download aria-hidden="true" size={16} strokeWidth={2.4} />
        <span>
          Download<span className="hidden sm:inline"> Stitch</span>
        </span>
        {chevron(15)}
      </button>
    );
  } else if (variant === "link") {
    trigger = (
      <button
        {...triggerProps}
        className={`inline-flex cursor-pointer items-center gap-1 rounded-sm text-[15px] text-ink-2 transition-colors hover:text-orange-ink aria-expanded:text-orange-ink ${className}`}
      >
        Download Stitch
        <ChevronDown
          aria-hidden="true"
          size={14}
          strokeWidth={2.4}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    );
  } else {
    trigger = (
      <button {...triggerProps} className={`btn btn-primary ${className}`}>
        <Download aria-hidden="true" size={20} strokeWidth={2.6} />
        Download Stitch
        {chevron(20)}
      </button>
    );
  }

  const menu =
    phase !== "closed"
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            data-state={phase}
            data-side={place?.above ? "top" : "bottom"}
            onKeyDown={onMenuKeyDown}
            onAnimationEnd={() => phase === "closing" && finish()}
            className="dl-menu fixed z-[60] rounded-[20px] border border-line bg-cream p-1.5 text-left text-ink shadow-[0_2px_6px_rgb(32_28_20/0.06),0_24px_48px_-20px_rgb(40_30_60/0.35)]"
            style={
              place
                ? { top: place.top, left: place.left, width: place.width }
                : { top: 0, left: 0, width: MENU_WIDTH, visibility: "hidden" }
            }
          >
            <p
              aria-hidden="true"
              className="flex items-baseline justify-between px-3 pt-2 pb-1.5 font-display text-[11.5px] font-semibold tracking-[0.08em] text-ink-3 uppercase"
            >
              Choose your platform
              <span className="font-medium tracking-normal normal-case">v{siteConfig.release.version}</span>
            </p>
            {installers.map(({ key, Icon, item }, i) => (
              <a
                key={key}
                ref={(el) => {
                  itemsRef.current[i] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                href={item.url}
                aria-label={`Download ${siteConfig.name} ${item.version} for ${item.label}, ${item.description}`}
                onClick={() => close(true)}
                className="group flex min-h-[56px] items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors outline-none hover:bg-card focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_2px_var(--color-orange)]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-card text-ink">
                  <Icon className="h-[17px] w-[17px]" />
                </span>
                <span className="grid min-w-0 flex-1 leading-tight">
                  <span className="font-display text-[15px] font-semibold">{item.label}</span>
                  <span className="mt-0.5 text-[13px] text-ink-2">{item.description}</span>
                </span>
                <Download
                  aria-hidden="true"
                  size={16}
                  strokeWidth={2.4}
                  className="shrink-0 text-ink-3 transition-colors group-hover:text-orange-ink group-focus-visible:text-orange-ink"
                />
              </a>
            ))}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {trigger}
      {menu}
    </>
  );
}

function WindowsIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M2 4.5 10.5 3.3v8.2H2zM11.7 3.1 22 1.7v9.8H11.7zM2 12.7h8.5v8.2L2 19.6zM11.7 12.7H22v9.7l-10.3-1.4z" />
    </svg>
  );
}

function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}
