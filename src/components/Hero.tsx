import { ArrowDown } from "lucide-react";
import { DownloadButton } from "./DownloadButton";
import { Clapperboard } from "./decor/Clapperboard";
import { Camera } from "./decor/Camera";
import { Star } from "./decor/Doodles";
import { StitchDemo } from "./demo/StitchDemo";
import { ReleaseBadge } from "./ReleaseBadge";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * Section 1: the tagline, then the interactive Stitch application as the page's centrepiece.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate pt-10 pb-4 sm:pt-14 md:pt-16">
      {/* Colour washes (peach left, lavender right) behind the application, as in the Stitch Artifact. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[420px] left-[2%] -z-10 h-[560px] w-[640px] max-w-[80vw] rounded-full bg-[rgb(255_176_140/0.42)] blur-[90px] md:top-[520px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[340px] right-[2%] -z-10 h-[580px] w-[660px] max-w-[80vw] rounded-full bg-[rgb(184_164_255/0.38)] blur-[90px] md:top-[440px]"
      />

      {/* Printed illustrations beside the headline, kept clear of the copy: a halftone camera up by
          the badge on the left (phones go without it: the badge needs the width), the clapperboard on the
          right. */}
      <div
        aria-hidden="true"
        className="absolute -z-10 hidden sm:top-[34px] sm:left-[2%] sm:block sm:w-[118px] md:top-[32px] md:left-[1.5%] md:w-[134px] lg:top-[38px] lg:left-[2%] lg:w-[164px] xl:top-[44px] xl:left-[5.5%] xl:w-[196px]"
      >
        <Camera loading="eager" className="float w-full" style={{ "--fd": "0s" } as CSSVars} />
        <Star className="twinkle absolute top-[-12%] right-[-4%] h-4 w-4 lg:h-5 lg:w-5" style={{ "--td": "-0.6s" } as CSSVars} />
        <Star
          points={5}
          tone="lavender"
          className="twinkle absolute bottom-[-4%] left-[-6%] hidden h-3 w-3 lg:block"
          style={{ "--td": "-2.2s" } as CSSVars}
        />
        <Star tone="coral" className="twinkle absolute top-[22%] left-[-12%] hidden h-2.5 w-2.5 lg:block" style={{ "--td": "-3.4s" } as CSSVars} />
      </div>
      <Clapperboard
        loading="eager"
        className="float absolute top-[96px] right-[-38px] -z-10 w-[104px] sm:w-[150px] xl:top-[120px] xl:right-[-20px] xl:w-[230px]"
        style={{ "--fd": "-2s" } as CSSVars}
      />
      <Star
        points={5}
        className="twinkle absolute top-[76px] right-[16%] hidden h-5 w-5 xl:block"
        style={{ "--td": "-1.5s" } as CSSVars}
      />

      <div className="relative mx-auto grid max-w-[1200px] justify-items-center gap-6 px-5 text-center">
        <ReleaseBadge className="enter inline-flex items-center rounded-full border border-line bg-card/80 px-3.5 py-1.5 font-display text-[13px] font-medium text-ink-2 shadow-[0_1px_2px_rgb(32_28_20/0.05)] backdrop-blur" />

        <h1 id="hero-title" className="display-xl enter max-w-[13ch] md:max-w-none" style={{ "--d": ".06s" } as CSSVars}>
          <span className="block">All the creative freedom.</span>{" "}
          <em className="accent block pr-[0.06em]">None of the tedious work.</em>
        </h1>

        {/* Two balanced lines from tablet-landscape up; natural wrap below that. */}
        <p
          className="enter max-w-[46ch] text-[17px] leading-relaxed text-ink-2 sm:max-w-[60ch] sm:text-[18px] md:max-w-[930px] md:text-balance"
          style={{ "--d": ".14s" } as CSSVars}
        >
          Stitch brings AI agents into your familiar editing workspace, where they can understand your footage, build tailored
          editing plans and make changes directly on your timeline while you stay in control.
        </p>

        <div
          className="enter mt-1 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
          style={{ "--d": ".22s" } as CSSVars}
        >
          <DownloadButton />
          <a href="#product" className="btn btn-chip">
            Explore Stitch
            <ArrowDown aria-hidden="true" size={18} strokeWidth={2.4} />
          </a>
        </div>
      </div>

      {/* The interactive application, directly beneath the tagline. */}
      <div
        id="product"
        aria-label="Interactive Stitch demo"
        role="region"
        className="enter relative mx-auto mt-14 max-w-[1240px] px-4 sm:px-6 md:mt-20"
        style={{ "--d": ".3s" } as CSSVars}
      >
        <StitchDemo />
      </div>
    </section>
  );
}
