"use client";

import { ArrowUp } from "lucide-react";
import type { DemoCommand } from "./demo/AppWindow";
import { goToDemo } from "./demo/StitchDemo";

/** Sends the visitor to the interactive demo with the relevant panel open and highlighted. */
export function TryInDemo({ command, label }: { command: DemoCommand; label: string }) {
  return (
    <button
      type="button"
      onClick={() => goToDemo(command)}
      className="group inline-flex items-center gap-1.5 rounded-full font-display text-[14px] font-semibold text-ink underline decoration-orange-ink/40 decoration-2 underline-offset-[5px] transition-colors hover:decoration-orange-ink"
    >
      {label} in the demo
      <ArrowUp aria-hidden="true" size={15} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
