import { Dithered } from "./Dithered";

export function FilmReel(props: { className?: string; style?: React.CSSProperties }) {
  return <Dithered src="/images/decor/film-reel.png" width={440} height={380} {...props} />;
}
