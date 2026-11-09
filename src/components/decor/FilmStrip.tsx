import { Dithered } from "./Dithered";

export function FilmStrip(props: { className?: string; style?: React.CSSProperties }) {
  return <Dithered src="/images/decor/film-strip.png" width={620} height={200} {...props} />;
}
