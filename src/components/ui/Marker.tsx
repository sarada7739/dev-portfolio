import type { HowIWorkItem } from "@/data";

type MarkerProps = {
  shape: HowIWorkItem["marker"];
  color: HowIWorkItem["markerColor"];
};

const MARKER_BG: Record<HowIWorkItem["markerColor"], string> = {
  coral: "bg-coral",
  amber: "bg-marker-amber",
  green: "bg-marker-green",
  sage: "bg-marker-sage",
};

const MARKER_FILL: Record<HowIWorkItem["markerColor"], string> = {
  coral: "fill-coral",
  amber: "fill-marker-amber",
  green: "fill-marker-green",
  sage: "fill-marker-sage",
};

// 「開発について」のマーカー。三角形は SVG で、ほかの形は span の背景色で描く
export default function Marker({ shape, color }: MarkerProps) {
  if (shape === "triangle") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className={`mt-1 size-5 shrink-0 ${MARKER_FILL[color]}`}
      >
        <path d="M6 1 11 10 1 10Z" />
      </svg>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`mt-1 size-5 shrink-0 ${shape === "square" ? "rounded-xs" : "rounded-full"} ${MARKER_BG[color]}`}
    />
  );
}
