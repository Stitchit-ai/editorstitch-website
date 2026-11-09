import { Dithered } from "./Dithered";

export function Lens(props: { className?: string; style?: React.CSSProperties }) {
  return <Dithered src="/images/decor/lens.png" width={380} height={380} {...props} />;
}
