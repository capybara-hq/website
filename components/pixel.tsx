import { LOGO, cells } from "@/lib/bitmaps";

/** The pixel capybara logo, filled with the current color. */
export function LogoMark({ className = "px", width, height, x, y }: { className?: string; width: number; height: number; x?: number; y?: number }) {
  return (
    <svg className={className} x={x} y={y} width={width} height={height} viewBox="0 0 14 10" aria-hidden="true">
      <path fill="currentColor" d={cells(LOGO)} />
    </svg>
  );
}
