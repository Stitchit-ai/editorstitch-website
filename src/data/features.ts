import type { DemoCommand } from "@/components/demo/AppWindow";
import type { ImageName } from "@/components/Picture";

/**
 * Workflow steps shown in the "One idea. A thousand ways to tell it." section.
 * Copy is kept within project-info/product-features.md (no export formats or specs).
 * Every image is a crop of a genuine Stitch v0.1.0 screenshot.
 */

export type StepShot = { name: ImageName; alt: string };

export type WorkflowStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  /** Genuine screenshot crops that explain the step (the first is the main one). */
  shots: StepShot[];
  /** The central differentiator gets the strongest visual emphasis. */
  featured?: boolean;
  /** What "… in the demo" does: which screen/panel to open and what to highlight. */
  demo: DemoCommand & { label: string };
};

export const workflowSteps: WorkflowStep[] = [
  {
    id: "upload",
    number: "01",
    title: "Upload your footage.",
    body: "Open a project and import your video, images and audio. Everything you bring in waits in the media panel, ready to place on the timeline.",
    shots: [
      {
        name: "media-light",
        alt: "The Stitch media panel with an Import button, filters for video, images and audio, and a grid of imported clips.",
      },
    ],
    demo: { label: "Open a project", screen: "home" },
  },
  {
    id: "shape",
    number: "02",
    title: "Let Stitch help shape your story.",
    body: "Describe the edit you want in plain language to an AI agent working beside your timeline. It proposes an editing plan; you review it, give your input, and the changes are applied right in your edit. Stitch is designed to work with agents such as Claude, Codex and Gemini, depending on your setup.",
    featured: true,
    shots: [
      {
        name: "prompt-light",
        alt: "The Stitch AI chat: a request for a 60-second road-trip reel, the agent reading the transcript and timeline, and its reply.",
      },
      {
        name: "plan-light",
        alt: "The proposed edits summarised in the AI panel, followed by the question “Which ending suits it?” with options to choose from.",
      },
      {
        name: "timeline-light",
        alt: "The Stitch timeline with text, effect, graphic, video, voice and music tracks after the edits.",
      },
    ],
    demo: { label: "See the plan", screen: "editor", tab: "agent", pulse: "plan", pan: 1 },
  },
  {
    id: "refine",
    number: "03",
    title: "Refine, export, and share.",
    body: "It's still your edit. Fine-tune clips by hand, play it back in the preview, then export the finished video and share it with the world.",
    shots: [
      {
        name: "preview-light",
        alt: "The Stitch preview showing the road-trip edit with its title card, timecode and playback controls.",
      },
    ],
    demo: { label: "Open Export", screen: "export" },
  },
];
