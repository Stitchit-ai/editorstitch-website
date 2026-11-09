import { workflowSteps, type StepShot, type WorkflowStep } from "@/data/features";
import { Picture, imageInfo } from "./Picture";
import { TryInDemo } from "./TryInDemo";
import { Arrow, Thread } from "./decor/Doodles";
import { FilmStrip } from "./decor/FilmStrip";
import { Lens } from "./decor/Lens";
import { Timecode } from "./decor/Timecode";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Section 2: from raw footage to a finished story, in three steps. The interactive demo above
 * does the heavy visual lifting; each step shows genuine screenshot crops and can open that
 * part of the demo.
 */
export function ProductFeatures() {
  const [upload, shape, refine] = workflowSteps;
  return (
    <section id="workflow" aria-labelledby="workflow-title" className="relative isolate pt-28 md:pt-40">
      <Lens
        className="float absolute top-[40px] right-[-60px] -z-10 w-[120px] opacity-90 md:top-[70px] md:right-[-30px] md:w-[160px]"
        style={{ "--fd": "-3s" } as CSSVars}
      />
      <FilmStrip className="absolute top-[30px] left-[-120px] -z-10 hidden w-[340px] rotate-[-8deg] opacity-80 lg:block" />

      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div data-reveal className="grid justify-items-center gap-5 text-center">
          <h2 id="workflow-title" className="display-lg max-w-[20ch]">
            One idea. A thousand ways to <em className="accent">tell it.</em>
          </h2>
          <p className="max-w-[50ch] text-[17px] leading-relaxed text-ink-2 sm:text-[18px]">
            Turn raw footage into stories worth watching. Edit, create, and bring your vision to life with a little help from AI.
          </p>
          <Timecode className="mt-3 w-full max-w-[560px]" />
        </div>

        <ol className="mt-16 grid gap-24 md:mt-24 md:gap-28">
          <SplitStep step={upload} shotSide="left" />
          <FeaturedStep step={shape} />
          <SplitStep step={refine} shotSide="right" />
        </ol>
      </div>
    </section>
  );
}

/* ---------- shared pieces ---------- */

function StepNumber({ n, large = false }: { n: string; large?: boolean }) {
  return (
    <span
      className={`block font-serif leading-none italic text-orange-ink ${large ? "text-[76px] md:text-[104px]" : "text-[60px] md:text-[80px]"}`}
    >
      {n}
    </span>
  );
}

function StepText({ step, large = false }: { step: WorkflowStep; large?: boolean }) {
  const { label, ...command } = step.demo;
  return (
    <div className="grid justify-items-start gap-4">
      <StepNumber n={step.number} large={large} />
      <h3 className={`font-display font-semibold tracking-[-0.015em] ${large ? "text-[26px] sm:text-[30px]" : "text-[23px] sm:text-[26px]"}`}>
        {step.title}
      </h3>
      <p className="max-w-[44ch] text-[17px] leading-relaxed text-ink-2">{step.body}</p>
      <div className="mt-1">
        <TryInDemo command={command} label={label} />
      </div>
    </div>
  );
}

/** A genuine screenshot crop in the site's white "tcard" frame. */
function Shot({ shot, maxWidth, tilt = "0deg", className = "", sizes }: { shot: StepShot; maxWidth: number; tilt?: string; className?: string; sizes: string }) {
  const info = imageInfo(shot.name);
  return (
    <figure
      className={`tcard transition-[rotate,translate] duration-500 ease-[var(--ease-snap)] hover:-translate-y-1.5 hover:rotate-0 ${className}`}
      style={{ rotate: tilt, maxWidth: maxWidth + 16 }}
    >
      <div className="tcard-inner">
        <Picture name={shot.name} alt={shot.alt} sizes={sizes} className="block h-auto w-full" style={{ aspectRatio: `${info.width} / ${info.height}` }} />
      </div>
    </figure>
  );
}

/** Dashed "stitch" thread linking one step to the next (wide screens). */
function StepLink({ flip = false, className = "left-1/2 w-[40%] -translate-x-1/2" }: { flip?: boolean; className?: string }) {
  return (
    <Thread
      d={flip ? "M380 8 C 300 120, 100 0, 20 112" : "M20 8 C 100 120, 300 0, 380 112"}
      className={`pointer-events-none absolute bottom-[-104px] hidden h-[96px] md:block ${className}`}
    />
  );
}

/* ---------- steps 01 and 03 ---------- */

function SplitStep({ step, shotSide }: { step: WorkflowStep; shotSide: "left" | "right" }) {
  const shot = step.shots[0];
  const tall = imageInfo(shot.name).height > imageInfo(shot.name).width;
  const maxWidth = tall ? 270 : 560;
  return (
    <li data-reveal className="relative grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className={`flex justify-center ${shotSide === "right" ? "md:order-2" : ""}`}>
        <Shot shot={shot} maxWidth={maxWidth} tilt={shotSide === "left" ? "-2deg" : "1.5deg"} className="w-full" sizes={`(max-width: 640px) 88vw, ${maxWidth}px`} />
      </div>
      <div className={shotSide === "right" ? "md:justify-self-end" : ""}>
        <StepText step={step} />
      </div>
      {shotSide === "left" && <StepLink className="left-[17%] w-[25%]" />}
    </li>
  );
}

/* ---------- step 02: the central differentiator ---------- */

function FeaturedStep({ step }: { step: WorkflowStep }) {
  const [prompt, plan, timeline] = step.shots;
  return (
    <li data-reveal className="relative">
      {/* Soft colour wash behind the featured step, as behind the hero application. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-4%] inset-y-[-12%] -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(38% 46% at 66% 44%, rgb(255 190 160 / 0.5), transparent 72%), radial-gradient(30% 38% at 80% 70%, rgb(199 184 255 / 0.42), transparent 72%)",
        }}
      />
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <StepText step={step} large />

        {/* Collage of genuine crops: the prompt, the proposed plan, and the result on the timeline. */}
        <div className="relative">
          <p className="hand relative z-40 mb-7 ml-[4%] flex w-fit rotate-[-4deg] items-end gap-1 text-[27px] text-ink-2 xl:absolute xl:top-[-52px] xl:left-[-4%] xl:mb-0 xl:ml-0">
            Bring your own AI!
            <Arrow variant="down-right" tone="orange" className="mb-[-34px] h-[44px] w-[44px]" />
          </p>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:block xl:h-[540px]">
            <Shot
              shot={prompt}
              maxWidth={290}
              tilt="-2.5deg"
              sizes="(max-width: 1279px) 44vw, 290px"
              className="w-full xl:absolute xl:top-0 xl:left-0 xl:z-10 xl:w-[300px]"
            />
            <Shot
              shot={plan}
              maxWidth={290}
              tilt="2deg"
              sizes="(max-width: 1279px) 44vw, 290px"
              className="w-full self-start xl:absolute xl:top-[34px] xl:left-[322px] xl:z-20 xl:w-[290px]"
            />
            <Shot
              shot={timeline}
              maxWidth={662}
              tilt="-1deg"
              sizes="(max-width: 1279px) 90vw, 580px"
              className="col-span-2 w-full xl:absolute xl:top-[318px] xl:left-[26px] xl:z-30 xl:w-[580px]"
            />
          </div>
        </div>
      </div>
      <StepLink flip />
    </li>
  );
}
