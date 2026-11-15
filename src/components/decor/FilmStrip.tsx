import { Dithered, type DitheredProps } from "./Dithered";

export function FilmStrip(props: DitheredProps) {
  return <Dithered src="/images/decor/film-strip.png" width={620} height={200} {...props} />;
}
