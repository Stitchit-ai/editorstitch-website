import { siteConfig } from "@/config/site";
import { DownloadButton } from "./DownloadButton";
import { Logo, Mascot } from "./Logo";
import { Clapperboard } from "./decor/Clapperboard";
import { Arrow, Star } from "./decor/Doodles";
import { FilmStrip } from "./decor/FilmStrip";
import { Timecode } from "./decor/Timecode";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const year = new Date().getFullYear();

const pageLinks = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "How it works" },
  { href: "#top", label: "Back to top" },
];

export function Footer() {
  const { release, social } = siteConfig;

  return (
    <footer id="download" aria-labelledby="thanks-title" className="mt-24 md:mt-48">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Closing message */}
        <div
          data-reveal
          className="relative isolate grid justify-items-center gap-5 overflow-hidden rounded-[28px] px-6 pt-14 pb-28 text-center md:rounded-[40px] md:px-10 md:pt-28 md:pb-32"
          style={{
            background:
              "radial-gradient(60% 80% at 18% 28%, rgb(255 190 160 / 0.75), transparent 70%), radial-gradient(50% 70% at 86% 72%, rgb(199 184 255 / 0.6), transparent 70%), #FBE9DF",
          }}
        >
          <FilmStrip className="absolute bottom-[3%] left-[-50px] -z-10 w-[220px] rotate-[6deg] md:bottom-[8%] md:left-[-40px] md:w-[380px]" />
          {/* Same file as the hero's clapperboard (already cached); `eager` keeps Next's dev-only LCP
              check, which tracks images by URL, from mistaking this copy for the one up top. */}
          <Clapperboard
            loading="eager"
            className="float absolute top-[8%] right-[3%] -z-10 w-[92px] rotate-[8deg] md:top-[10%] md:right-[6%] md:w-[150px]"
            style={{ "--fd": "-2s" } as CSSVars}
          />
          <Star className="twinkle absolute top-[16%] left-[9%] hidden h-7 w-7 md:block" />
          <Star
            points={5}
            tone="lavender"
            className="twinkle absolute top-[27%] left-[14%] hidden h-3.5 w-3.5 md:block"
            style={{ "--td": "-2.5s" } as CSSVars}
          />

          <Mascot className="bob w-[68px] md:w-[96px]" />
          <h2 id="thanks-title" className="display-lg max-w-[20ch]">
            Thanks for being part of this <em className="accent">creative journey.</em>
          </h2>
          <p className="max-w-[46ch] text-[16px] leading-relaxed text-ink-2 md:text-[17px]">
            Stitch v{release.version} is our very first release. We can&rsquo;t wait to see what you make with it.
          </p>
          <div className="mt-3 grid justify-items-center gap-3">
            <DownloadButton />
          </div>

          <p className="hand absolute right-[7%] bottom-[9%] hidden rotate-[-5deg] items-center gap-2 text-[28px] text-orange-ink md:flex">
            <Arrow variant="up-left" tone="orange" className="h-[56px] w-[44px]" />
            see you on the timeline!
          </p>
        </div>

        <Timecode
          className="mt-12 md:mt-16"
          marks={["00:00:00:00", "00:00:12:00", "00:00:24:00", "00:00:36:00", "00:00:48:00", "00:01:00:00"]}
        />

        {/* Brand + links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10 md:py-12">
          <div className="col-span-2 grid content-start gap-3 md:col-span-1">
            <Logo size={40} />
            <p className="max-w-[30ch] text-[15px] text-ink-2">{siteConfig.tagline}</p>
          </div>
          <nav aria-label="On this page">
            <h3 className="label mb-3">Explore</h3>
            <ul className="grid gap-1.5">
              {pageLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[15px] text-ink-2 transition-colors hover:text-orange-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Get Stitch">
            <h3 className="label mb-3">Get Stitch</h3>
            <ul className="grid gap-1.5">
              <li>
                <DownloadButton variant="link" />
              </li>
              {/* Social profiles appear here once they exist (see src/config/site.ts). */}
              {social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="text-[15px] text-ink-2 transition-colors hover:text-orange-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-5 pb-8 text-[13.5px] text-ink-3 md:pt-6 md:pb-10">
          <p>© {year} Stitch</p>
          <p>{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
