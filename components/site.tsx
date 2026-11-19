"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "@/content/en";
import type { Dict, Lang } from "@/content/types";
import { zh } from "@/content/zh";

export type Theme = "system" | "light" | "dark";

const DICTS: Record<Lang, Dict> = { zh, en };

interface Site {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SiteContext = createContext<Site | null>(null);

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Applies a theme to `<html>`: no `data-theme` means follow the system. */
function applyTheme(theme: Theme) {
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  // The static HTML is rendered in Chinese with the system theme; the stored choice (or the
  // browser language) takes over once the page runs. The theme itself is already on <html>,
  // applied before paint by the inline script in the layout.
  const [lang, setLangState] = useState<Lang>("zh");
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setThemeState(t === "light" || t === "dark" ? t : "system");
    const l = read("lang");
    setLangState(l === "zh" || l === "en" ? l : navigator.language.startsWith("zh") ? "zh" : "en");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    store("lang", l);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
    store("theme", t);
  }, []);

  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang, theme, setTheme }), [lang, setLang, theme, setTheme]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): Site {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite outside SiteProvider");
  return site;
}

/** The theme actually shown: the chosen one, or the system's when following it. */
export function useResolvedTheme(): "light" | "dark" {
  const { theme } = useSite();
  const [systemLight, setSystemLight] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: light)");
    const update = () => setSystemLight(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return theme === "system" ? (systemLight ? "light" : "dark") : theme;
}
