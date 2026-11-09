import { ArrowDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { DownloadButton, ReleaseMeta } from "./DownloadButton";
import { Clapperboard } from "./decor/Clapperboard";
import { FilmReel } from "./decor/FilmReel";
import { StitchDemo } from "./demo/StitchDemo";

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

      {/* Dithered film-world illustrations beside the headline (kept clear of the application). */}
      <FilmReel
        className="float absolute top-[-14px] left-[-62px] -z-10 w-[150px] sm:w-[200px] xl:left-[-40px] xl:w-[270px]"
        style={{ "--fd": "0s" } as CSSVars}
      />
      <Clapperboard
        className="float absolute top-[96px] right-[-38px] -z-10 w-[104px] sm:w-[150px] xl:top-[120px] xl:right-[-20px] xl:w-[230px]"
        style={{ "--fd": "-2s" } as CSSVars}
      />

      <div className="relative mx-auto grid max-w-[1200px] justify-items-center gap-6 px-5 text-center">
        <p className="enter inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-3.5 py-1.5 font-display text-[13px] font-medium text-ink-2 shadow-[0_1px_2px_rgb(32_28_20/0.05)] backdrop-blur">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-orange" />
          Stitch v{siteConfig.release.version} · now on {siteConfig.release.platform}
        </p>

        <h1 id="hero-title" className="display-xl enter max-w-[13ch] md:max-w-none" style={{ "--d": ".06s" } as CSSVars}>
          <span className="block">All the creative freedom.</span>{" "}
          <em className="accent block pr-[0.06em]">None of the tedious work.</em>
        </h1>

        <p className="enter max-w-[52ch] text-[17px] leading-relaxed text-ink-2 sm:text-[19px]" style={{ "--d": ".14s" } as CSSVars}>
          Edit in a familiar video workspace, bring an AI agent into the process, and stay in control as your ideas become
          timeline changes.
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
        <ReleaseMeta className="enter -mt-1" />
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
        <p className="mt-5 text-center text-[13.5px] text-ink-3 md:mt-6">
          Stitch v{siteConfig.release.version}: a familiar, VS Code-inspired workspace with an AI assistant beside your editing
          timeline. Interactive demo.
        </p>
      </div>
    </section>
  );
}
