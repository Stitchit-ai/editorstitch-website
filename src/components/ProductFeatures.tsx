import { workflowSteps, type StepShot, type WorkflowStep } from "@/data/features";
import { Picture, imageInfo } from "./Picture";
import { TryInDemo } from "./TryInDemo";
import { Arrow, Squiggle, Star, Thread } from "./decor/Doodles";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Section 2: from raw footage to a finished story, in three steps. The interactive demo above
 * does the heavy visual lifting; each step shows genuine screenshot crops and can open that
 * part of the demo.
 */
export function ProductFeatures() {
  const [upload, shape, refine] = workflowSteps;
  return (
    <section id="workflow" aria-labelledby="workflow-title" className="relative isolate pt-16 md:pt-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div data-reveal className="relative grid justify-items-center gap-5 text-center">
          <Star
            className="twinkle absolute top-[-10px] right-[13%] hidden h-6 w-6 md:block lg:right-[19%]"
            style={{ "--td": "-1s" } as CSSVars}
          />
          <Star
            points={5}
            tone="lavender"
            className="twinkle absolute bottom-[-6px] left-[12%] hidden h-3.5 w-3.5 md:block lg:left-[18%]"
            style={{ "--td": "-3s" } as CSSVars}
          />
          <Star
            points={5}
            tone="coral"
            className="twinkle absolute top-[14%] left-[9%] hidden h-4 w-4 md:block lg:left-[16%]"
            style={{ "--td": "-2s" } as CSSVars}
          />
          <Star
            className="twinkle absolute right-[10%] bottom-[22%] hidden h-3 w-3 md:block lg:right-[17%]"
            style={{ "--td": "-4s" } as CSSVars}
          />
          <h2 id="workflow-title" className="display-lg max-w-[20ch]">
            One idea. A thousand ways to <em className="accent">tell it.</em>
          </h2>
          <p className="max-w-[50ch] text-[17px] leading-relaxed text-ink-2 sm:text-[18px]">
            Turn raw footage into stories worth watching. Edit, create, and bring your vision to life with a little help from AI.
          </p>
        </div>

        <ol className="mt-14 grid gap-16 md:mt-24 md:gap-28">
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
      className={`block font-serif leading-none italic text-orange-ink ${large ? "text-[64px] md:text-[104px]" : "text-[52px] md:text-[80px]"}`}
    >
      {n}
    </span>
  );
}

function StepText({ step, large = false, children }: { step: WorkflowStep; large?: boolean; children?: React.ReactNode }) {
  const { label, ...command } = step.demo;
  return (
    <div className="grid justify-items-start gap-3 md:gap-4">
      <StepNumber n={step.number} large={large} />
      <h3 className={`font-display font-semibold tracking-[-0.015em] ${large ? "text-[23px] sm:text-[30px]" : "text-[21px] sm:text-[26px]"}`}>
        {step.title}
      </h3>
      <p className="max-w-[44ch] text-[16px] leading-relaxed text-ink-2 md:text-[17px]">{step.body}</p>
      <div className="mt-1">
        <TryInDemo command={command} label={label} />
      </div>
      {children}
    </div>
  );
}

/** A handwritten sticker stuck beneath step 02's copy: the point of letting an agent in. */
function LoopSticker() {
  return (
    <p className="hand hand-note mt-4 max-w-[24ch] rotate-[-3deg] text-[24px] leading-[1.05] text-orange-ink sm:text-[27px] md:mt-6 md:ml-[2%]">
      <span>Don&rsquo;t</span> <span>get</span> <span>stuck</span> <span>in</span> <span>another</span>{" "}
      <span className="whitespace-nowrap">prompt-output-prompt</span> <span>loop!</span>
      <Squiggle tone="orange" className="mt-0.5 ml-[12%] block h-[14px] w-[150px]" />
    </p>
  );
}

/** A genuine screenshot crop in the site's white "tcard" frame. */
function Shot({
  shot,
  maxWidth,
  mobileMax = maxWidth,
  tilt = "0deg",
  className = "",
  sizes,
}: {
  shot: StepShot;
  maxWidth: number;
  /** Narrower cap on phones so crops stay compact. */
  mobileMax?: number;
  tilt?: string;
  className?: string;
  sizes: string;
}) {
  const info = imageInfo(shot.name);
  return (
    <figure
      className={`tcard max-w-[var(--mw-m)] transition-[rotate,translate] duration-500 ease-[var(--ease-snap)] hover:-translate-y-1.5 hover:rotate-0 md:max-w-[var(--mw)] ${className}`}
      style={{ rotate: tilt, "--mw": `${maxWidth + 16}px`, "--mw-m": `${mobileMax + 16}px` } as CSSVars}
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
    <li data-reveal className="relative grid items-center gap-7 md:grid-cols-2 md:gap-16">
      <div className={`order-2 flex justify-center ${shotSide === "right" ? "md:order-2" : "md:order-1"}`}>
        <Shot
          shot={shot}
          maxWidth={maxWidth}
          mobileMax={tall ? 180 : 320}
          tilt={shotSide === "left" ? "-2deg" : "1.5deg"}
          className="w-full"
          sizes={`(max-width: 767px) ${tall ? 180 : 320}px, ${maxWidth}px`}
        />
      </div>
      <div className={`order-1 ${shotSide === "right" ? "md:order-1 md:justify-self-end" : "md:order-2"}`}>
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
      <div className="grid items-center gap-9 md:gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <StepText step={step} large>
          <LoopSticker />
        </StepText>

        {/* Collage of genuine crops: the prompt, the proposed plan, and the result on the timeline. */}
        <div className="relative">
          <p className="hand relative z-40 mb-5 ml-[4%] flex w-fit rotate-[-4deg] items-end gap-1 text-[23px] text-ink-2 sm:mb-7 sm:text-[27px] xl:absolute xl:top-[-52px] xl:left-[-4%] xl:mb-0 xl:ml-0">
            Bring your own AI!
            <Arrow variant="arc-down" tone="orange" className="mb-[-30px] ml-1 h-[46px] w-[50px]" />
          </p>
          <div className="mx-auto grid max-w-[420px] grid-cols-2 gap-3 sm:max-w-none sm:gap-6 xl:block xl:h-[540px]">
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
