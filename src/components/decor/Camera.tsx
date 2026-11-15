import { Dithered, type DitheredProps } from "./Dithered";

/** Hero: a tilted rangefinder camera printed in halftone dots, with two orange "pop" bursts. */
export function Camera(props: DitheredProps) {
  return <Dithered src="/images/decor/camera.png" width={460} height={380} {...props} />;
}
