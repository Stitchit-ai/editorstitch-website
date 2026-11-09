import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

export const alt = "Stitch: All the creative freedom. None of the tedious work.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string) => readFile(join(process.cwd(), "src", "assets", "og", file));

export default async function Image() {
  const [serif, serifItalic, poppins, mascot] = await Promise.all([
    asset("InstrumentSerif-Regular.ttf"),
    asset("InstrumentSerif-Italic.ttf"),
    asset("Poppins-SemiBold.ttf"),
    asset("mascot.png"),
  ]);
  const mascotSrc = `data:image/png;base64,${mascot.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#F4F1EB",
          backgroundImage:
            "radial-gradient(circle at 14% 92%, rgba(255,176,140,0.55), rgba(255,176,140,0) 46%), radial-gradient(circle at 92% 18%, rgba(184,164,255,0.45), rgba(184,164,255,0) 44%)",
          color: "#15131F",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mascotSrc} width={88} height={69} alt="" />
          <span style={{ fontFamily: "Poppins", fontSize: 46, letterSpacing: "-0.03em" }}>Stitch</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Instrument Serif", fontSize: 96, lineHeight: 1 }}>
          <span style={{ letterSpacing: "-0.02em" }}>All the creative freedom.</span>
          <span style={{ fontStyle: "italic", color: "#E04F2B", letterSpacing: "-0.02em" }}>
            None of the tedious work.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Poppins",
            fontSize: 26,
            color: "#4A4654",
          }}
        >
          <span>AI-assisted video editing for {siteConfig.release.platform}</span>
          <span style={{ color: "#15131F" }}>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Poppins", data: poppins, style: "normal", weight: 600 },
      ],
    },
  );
}
