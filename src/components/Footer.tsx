import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { DownloadButton, ReleaseMeta } from "./DownloadButton";
import { Logo, Mascot } from "./Logo";
import { Clapperboard } from "./decor/Clapperboard";
import { Arrow, Sparkle } from "./decor/Doodles";
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
  const { release, links, social } = siteConfig;

  return (
    <footer id="download" aria-labelledby="thanks-title" className="mt-32 md:mt-48">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Closing message */}
        <div
          data-reveal
          className="relative isolate grid justify-items-center gap-5 overflow-hidden rounded-[28px] px-6 pt-20 pb-40 text-center md:rounded-[40px] md:px-10 md:pt-28 md:pb-32"
          style={{
            background:
              "radial-gradient(60% 80% at 18% 28%, rgb(255 190 160 / 0.75), transparent 70%), radial-gradient(50% 70% at 86% 72%, rgb(199 184 255 / 0.6), transparent 70%), #FBE9DF",
          }}
        >
          <FilmStrip className="absolute bottom-[4%] left-[-60px] -z-10 w-[280px] rotate-[6deg] md:bottom-[8%] md:left-[-40px] md:w-[380px]" />
          <Clapperboard
            className="float absolute top-[8%] right-[3%] -z-10 w-[92px] rotate-[8deg] md:top-[10%] md:right-[6%] md:w-[150px]"
            style={{ "--fd": "-2s" } as CSSVars}
          />
          <Sparkle className="spin-slow absolute top-[16%] left-[9%] hidden h-8 w-8 md:block" />

          <Mascot className="bob w-[84px] md:w-[96px]" />
          <h2 id="thanks-title" className="display-lg max-w-[20ch]">
            Thanks for being part of the <em className="accent">creative journey.</em>
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink-2">
            Stitch v{release.version} is our very first release. We can&rsquo;t wait to see what you make with it.
          </p>
          <div className="mt-3 grid justify-items-center gap-3">
            <DownloadButton />
            <ReleaseMeta />
          </div>
          <a
            href={links.releases.href}
            className="inline-flex items-center gap-1 rounded-md font-display text-[14.5px] font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-orange-ink"
          >
            All releases on GitHub
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>

          <p className="hand absolute right-[7%] bottom-[9%] hidden rotate-[-5deg] items-center gap-2 text-[28px] text-orange-ink md:flex">
            <Arrow variant="up-left" tone="orange" className="h-[56px] w-[44px]" />
            see you on the timeline!
          </p>
        </div>

        <Timecode
          className="mt-16"
          marks={["00:00:00:00", "00:00:12:00", "00:00:24:00", "00:00:36:00", "00:00:48:00", "00:01:00:00"]}
        />

        {/* Brand + links */}
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="grid content-start gap-3">
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
                <a href={release.downloadUrl} className="text-[15px] text-ink-2 transition-colors hover:text-orange-ink">
                  Download for {release.platform}
                </a>
              </li>
              <li>
                <a
                  href={links.releases.href}
                  className="inline-flex items-center gap-1 text-[15px] text-ink-2 transition-colors hover:text-orange-ink"
                >
                  {links.releases.label}
                  <ArrowUpRight aria-hidden="true" size={14} />
                </a>
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

        <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-6 pb-10 text-[13.5px] text-ink-3">
          <p>© {year} Stitch</p>
          <p>{siteConfig.domain}</p>
        </div>
      </div>
    </footer>
  );
}
