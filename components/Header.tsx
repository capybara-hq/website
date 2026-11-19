"use client";

import { useState } from "react";
import type { Lang } from "@/content/types";
import { Icon } from "./icons";
import { LogoMark } from "./pixel";
import { useSite, type Theme } from "./site";

const DOCS = "https://github.com/capybara-hq/core#readme";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useSite();
  const links: [string, string][] = [
    ["#map", t.nav.map],
    ["#features", t.nav.features],
    ["#plugins", t.nav.plugins],
    ["#deploy", t.nav.deploy],
    [DOCS, t.nav.docs],
    ["#contact", t.nav.contact],
  ];
  return (
    <>
      {links.map(([href, label]) => (
        <a key={href} href={href} onClick={onNavigate}>
          {label}
        </a>
      ))}
    </>
  );
}

function LangSeg() {
  const { lang, setLang } = useSite();
  const options: [Lang, string][] = [
    ["zh", "中"],
    ["en", "EN"],
  ];
  return (
    <div className="seg" role="group" aria-label="Language">
      {options.map(([l, label]) => (
        <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function ThemeSeg({ titled }: { titled: boolean }) {
  const { t, theme, setTheme } = useSite();
  const options: [Theme, string][] = [
    ["system", "monitor"],
    ["light", "sun"],
    ["dark", "moon"],
  ];
  return (
    <div className="seg icons" role="group" aria-label="Theme">
      {options.map(([value, icon]) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          title={titled ? t.theme[value] : undefined}
          aria-label={t.theme[value]}
          onClick={() => setTheme(value)}
        >
          <Icon name={icon} />
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="wrap bar">
        <a className="brand" href="#" aria-label="Capybara">
          <LogoMark width={28} height={20} />
          Capybara
        </a>
        <nav className="links">
          <NavLinks />
        </nav>
        <div className="tools">
          <LangSeg />
          <ThemeSeg titled />
          <a className="gh" href="https://github.com/capybara-hq/core">
            <Icon name="github" />
            <span className="t">GitHub</span>
          </a>
          <button
            type="button"
            className="menu"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="sheet"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </div>
      <div className="sheet" id="sheet" hidden={!open}>
        <nav className="sheet-links">
          <NavLinks onNavigate={() => setOpen(false)} />
        </nav>
        <div className="sheet-tools">
          <LangSeg />
          <ThemeSeg titled={false} />
        </div>
      </div>
    </header>
  );
}
