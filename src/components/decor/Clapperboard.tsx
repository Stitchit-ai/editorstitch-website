import { Dithered } from "./Dithered";

export function Clapperboard(props: { className?: string; style?: React.CSSProperties }) {
  return <Dithered src="/images/decor/clapperboard.png" width={400} height={360} {...props} />;
}
