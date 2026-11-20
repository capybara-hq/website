/** A run of text where some parts render as inline `<code>`. */
export type Rich = ReadonlyArray<string | { code: string }>;

export type Lang = "zh" | "en";

export interface Dict {
  nav: { map: string; features: string; plugins: string; deploy: string; docs: string; contact: string };
  theme: { system: string; light: string; dark: string };
  hero: {
    /** The two lines of the headline. */
    title: readonly [string, string];
    lead: string;
    star: string;
    deploy: string;
    cap: string;
  };
  map: {
    title: string;
    lead: string;
    edge: string;
    legendCore: string;
    legendPlugin: string;
    kernel: string;
    run: string;
    runV: string;
    ctx: string;
    ctxV: string;
    gov: string;
    govV: string;
    plat: string;
    platV: string;
    gate: string;
    web: string;
    webSub: string;
    webNarrow: string;
    im: string;
    id: string;
    idNarrow: string;
    sso: string;
    models: string;
    modelsNarrow: string;
    internal: string;
    store: string;
    storeSub: string;
    market: string;
    marketSub: string;
    yours: string;
    yoursSub: string;
    laptop: string;
    sandbox: string;
    own: string;
    outside: string;
    cloud: string;
    saas: string;
    saasNarrow: string;
  };
  features: {
    title: string;
    lead: string;
    items: ReadonlyArray<{ tag: string; title: string; desc: string }>;
  };
  plugins: {
    title: string;
    lead: string;
    kinds: ReadonlyArray<{ tag: string; label: string }>;
    comment: string;
  };
  deploy: {
    title: string;
    lead: string;
    steps: ReadonlyArray<{ title: string; desc: Rich }>;
    copy: string;
    copied: string;
  };
  contact: {
    title: string;
    lead: string;
    items: ReadonlyArray<{ title: string; desc: string }>;
    discuss: string;
  };
  footer: { license: string; discuss: string };
}
