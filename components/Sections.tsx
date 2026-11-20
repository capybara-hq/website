"use client";

import { useRef, useState } from "react";
import type { Rich } from "@/content/types";
import { Icon } from "./icons";
import { OverviewMap } from "./OverviewMap";
import { Section } from "./Section";
import { useSite } from "./site";

function RichText({ parts }: { parts: Rich }) {
  return (
    <>
      {parts.map((p, i) => (typeof p === "string" ? p : <code key={i}>{p.code}</code>))}
    </>
  );
}

export function Overview() {
  const { t } = useSite();
  return (
    <Section id="map" n="01" title={t.map.title} lead={t.map.lead}>
      <OverviewMap />
    </Section>
  );
}

export function Features() {
  const { t } = useSite();
  return (
    <Section id="features" n="02" title={t.features.title} lead={t.features.lead}>
      <div className="body feats">
        {t.features.items.map((f) => (
          <div className="feat" key={f.tag}>
            <span className="tag">{f.tag}</span>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Plugins() {
  const { t } = useSite();
  return (
    <Section id="plugins" n="03" title={t.plugins.title} lead={t.plugins.lead}>
      <div className="body grow">
        <ul className="kinds">
          {t.plugins.kinds.map((k) => (
            <li key={k.tag}>
              <span className="tag">{k.tag}</span>
              <span>{k.label}</span>
            </li>
          ))}
        </ul>
        <div className="code">
          <div className="code-top">
            <span>~/plugins/crm</span>
          </div>
          <pre>
            <span className="p">$ </span>npx capybara-plugin check{"\n"}
            <span className="o">
              <b>✓</b> plugin.json  extension  2 skills  1 connector
            </span>
            {"\n"}
            <span className="p">$ </span>npx capybara-plugin pack{"\n"}
            <span className="o">
              <b>✓</b> capybara-hq-plugin-crm-0.1.0.tgz  sha512 ok
            </span>
            {"\n"}
            <span className="c">{t.plugins.comment}</span>
          </pre>
        </div>
      </div>
    </Section>
  );
}

const SECRETS = `{
    echo "POSTGRES_PASSWORD=$(openssl rand -hex 24)"
    echo "CAPYBARA_MASTER_KEY=$(openssl rand -base64 32)"
    echo "CAPYBARA_S3_ACCESS_KEY=$(openssl rand -hex 24)"
    echo "CAPYBARA_S3_SECRET_KEY=$(openssl rand -hex 24)"
    echo "CAPYBARA_SETUP_TOKEN=$(openssl rand -hex 16)"
  } > .env`;

export function Deploy() {
  const { t } = useSite();
  const cmd = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = (cmd.current?.innerText ?? "").replace(/^\$ /gm, "");
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Section id="deploy" n="04" title={t.deploy.title} lead={t.deploy.lead}>
      <div className="body deploy">
        <ol className="steps">
          {t.deploy.steps.map((s) => (
            <li key={s.title}>
              <div>
                <h4>{s.title}</h4>
                <p>
                  <RichText parts={s.desc} />
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="code">
          <div className="code-top">
            <span>bash</span>
            <button type="button" className="copy" onClick={copy}>
              <Icon name="copy" />
              <span>{copied ? t.deploy.copied : t.deploy.copy}</span>
            </button>
          </div>
          <pre ref={cmd}>
            <span className="p">$ </span>git clone https://github.com/capybara-hq/core.git{"\n"}
            <span className="p">$ </span>cd core/docker{"\n"}
            <span className="p">$ </span>
            {SECRETS}
            {"\n"}
            <span className="p">$ </span>docker compose up -d{"\n"}
            <span className="o">
              <b>✓</b> web  ready  http://localhost:3000
            </span>
          </pre>
        </div>
      </div>
    </Section>
  );
}

export function Contact() {
  const { t } = useSite();
  return (
    <Section id="contact" n="05" title={t.contact.title} lead={t.contact.lead}>
      <div className="body">
        <div className="contact">
          {t.contact.items.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="contact-cta">
          <a className="btn primary" href="https://github.com/capybara-hq/core">
            <Icon name="github" />
            <span>capybara-hq/core</span>
          </a>
          <a className="btn secondary" href="https://github.com/capybara-hq/core/discussions">
            <span>{t.contact.discuss}</span>
            <Icon name="arrow" />
          </a>
        </div>
      </div>
    </Section>
  );
}
