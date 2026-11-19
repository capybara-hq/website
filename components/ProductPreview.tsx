"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useResolvedTheme, useSite } from "./site";

interface CapyApp {
  fonts: string;
  css: string;
  zh: string;
  en: string;
}

declare global {
  interface Window {
    CAPY_APP?: CapyApp;
  }
}

/**
 * The live product preview: Capybara's real conversation page (DOM and scoped CSS from
 * /app/capy-app.js) mounted in a shadow root, matched to the page's theme and language.
 */
export function ProductPreview() {
  const { lang } = useSite();
  const theme = useResolvedTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const renderedLang = useRef<string | null>(null);
  const [app, setApp] = useState<CapyApp | null>(null);
  const [size, setSize] = useState<"" | "medium" | "narrow">("");

  const onLoad = useCallback(() => {
    const capy = window.CAPY_APP;
    if (!capy) return;
    if (!document.getElementById("capy-fonts")) {
      const f = document.createElement("style");
      f.id = "capy-fonts";
      f.textContent = capy.fonts;
      document.head.append(f);
    }
    setApp(capy);
  }, []);

  // The script may already be there (client navigation, strict-mode remount).
  useEffect(() => {
    if (window.CAPY_APP) onLoad();
  }, [onLoad]);

  // Size classes by the frame's own width, not the window's: full above 1040, no side panel
  // from 720, conversation only below.
  useEffect(() => {
    const host = hostRef.current;
    if (!host?.parentElement) return;
    const fit = () => {
      const w = host.clientWidth;
      setSize(w < 720 ? "narrow" : w < 1040 ? "medium" : "");
    };
    const ro = new ResizeObserver(fit);
    ro.observe(host.parentElement);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !app) return;
    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    if (renderedLang.current !== lang) {
      root.innerHTML = `<style>${app.css}</style>${app[lang]}`;
      renderedLang.current = lang;
    }
  }, [app, lang]);

  return (
    <>
      <div
        id="app"
        ref={hostRef}
        className={size ? `app-host ${size}` : "app-host"}
        data-theme={app ? theme : undefined}
        role="img"
        aria-label="Capybara"
      />
      <Script src="/app/capy-app.js" strategy="afterInteractive" onLoad={onLoad} />
    </>
  );
}
