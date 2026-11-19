"use client";

import { useEffect, useRef, useState } from "react";
import { dither, wordmark } from "@/lib/bitmaps";
import { useSite } from "./site";

const MARK = wordmark("CAPYBARA");

/** The dither strip, redrawn for its own width. */
function Dither() {
  const ref = useRef<SVGSVGElement>(null);
  const [art, setArt] = useState<ReturnType<typeof dither> | null>(null);
  useEffect(() => {
    const draw = () => {
      if (ref.current) setArt(dither(ref.current.clientWidth));
    };
    draw();
    addEventListener("resize", draw);
    return () => removeEventListener("resize", draw);
  }, []);
  return (
    <svg className="dither" ref={ref} viewBox={art?.viewBox} style={art ? { height: `${art.height}px` } : undefined} aria-hidden="true">
      {art && <path fill="currentColor" d={art.d} />}
    </svg>
  );
}

export function Footer() {
  const { t } = useSite();
  return (
    <footer>
      <div className="wrap">
        <Dither />
        <svg className="bigmark px" viewBox={MARK.viewBox} aria-hidden="true">
          <path fill="currentColor" d={MARK.d} />
        </svg>
        <div className="status">
          <span>capybarahq.com</span>
          <span>{t.footer.license}</span>
          <span className="r">
            <a href="https://github.com/capybara-hq">GitHub</a>
            <a href="https://meta1.top">{t.footer.meta1}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
