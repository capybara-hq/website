"use client";

import { useEffect, useRef, useState } from "react";
import { WALKER, cells } from "@/lib/bitmaps";
import { Icon } from "./icons";
import { ProductPreview } from "./ProductPreview";
import { useSite } from "./site";

const RELEASES_API = "https://api.github.com/repos/capybara-hq/core/releases?per_page=1";

/** The latest core release tag, fetched in the browser; "GitHub" until (or unless) it arrives. */
function useLatestRelease(): string {
  const [tag, setTag] = useState("GitHub");
  useEffect(() => {
    let live = true;
    fetch(RELEASES_API)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: Array<{ tag_name?: string }>) => {
        if (live && list[0]?.tag_name) setTag(list[0].tag_name);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return tag;
}

/** The working-line capybara walking along the top edge of the stage and back. */
function Walker() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--walk", `${(el.parentElement?.clientWidth ?? 0) - 42 - 48}px`);
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);
  return (
    <div className="walker" aria-hidden="true" ref={ref}>
      <svg className="px" width="42" height="30" viewBox="0 0 14 10">
        <path fill="currentColor" d={cells(WALKER.body)} />
        <path fill="currentColor" data-frame="1" d={cells(WALKER.legsA, 8)} />
        <path fill="currentColor" data-frame="2" d={cells(WALKER.legsB, 8)} />
      </svg>
    </div>
  );
}

export function Hero() {
  const { t } = useSite();
  const release = useLatestRelease();
  return (
    <div className="hero">
      <a className="note" href="https://github.com/capybara-hq/core/releases">
        <span className="sq" />
        <span>{release}</span>
      </a>
      <div className="hero-top">
        <h1>
          <span>
            {t.hero.title[0]}
            <br />
            {t.hero.title[1]}
          </span>
          <span className="caret" aria-hidden="true" />
        </h1>
        <div className="hero-side">
          <p className="lead">{t.hero.lead}</p>
          <div className="ctas">
            <a className="btn primary" href="https://github.com/capybara-hq/core">
              <Icon name="star" />
              <span>{t.hero.star}</span>
            </a>
            <a className="btn secondary" href="#deploy">
              <span>{t.hero.deploy}</span>
              <Icon name="arrow" />
            </a>
          </div>
        </div>
      </div>
      <div className="stage">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <span className="stage-cap">{t.hero.cap}</span>
        <Walker />
        <figure className="shot">
          <ProductPreview />
        </figure>
      </div>
    </div>
  );
}
