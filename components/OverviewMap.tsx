"use client";

import type { Dict } from "@/content/types";
import { LogoMark } from "./pixel";
import { useSite } from "./site";

// The overview map: the kernel in the middle, the clients, systems and devices around it, the
// outside world beyond a controlled gate. Two layouts drawn from the same pieces: wide (900px
// and up) and narrow (below). Squares mark what the kernel ships (solid) and what a plugin
// provides (socket); packets run along the links.

type LogoName =
  | "slack" | "lark" | "telegram" | "deepseek" | "qwen" | "connector-mcp" | "connector-openapi"
  | "aws-s3" | "docker" | "sandbox-e2b" | "anthropic" | "openai" | "gmail" | "calendar"
  | "sheets" | "notion" | "github";

/** Black-on-transparent marks, inverted in the dark theme. */
const MONO = new Set<LogoName>(["anthropic", "openai", "notion", "github"]);

const IM: LogoName[] = ["slack", "lark", "telegram"];
const SSO: LogoName[] = ["slack", "lark"];
const SELF_MODELS: LogoName[] = ["deepseek", "qwen"];
const CONNECTORS: LogoName[] = ["connector-mcp", "connector-openapi"];
const STORES: LogoName[] = ["aws-s3"];
const SANDBOXES: LogoName[] = ["docker", "sandbox-e2b"];
const CLOUD_MODELS: LogoName[] = ["anthropic", "openai", "deepseek", "qwen"];
const SAAS: LogoName[] = ["gmail", "calendar", "sheets", "notion", "github"];

function Logo({ name, x, y }: { name: LogoName; x: number; y: number }) {
  return <image className={MONO.has(name) ? "lg mono" : "lg"} href={`/logos/${name}.svg`} x={x} y={y} width={16} height={16} />;
}

function Logos({ names, x, y }: { names: LogoName[]; x: number; y: number }) {
  return (
    <>
      {names.map((n, i) => (
        <Logo key={i} name={n} x={x + i * 22} y={y} />
      ))}
    </>
  );
}

/** A wide-layout node with an icon, a title and a subtitle. */
function Node(p: { x: number; y: number; w: number; h: number; icon: string; title: string; sub: string; cls?: string; ix?: number }) {
  const ix = p.ix ?? 16;
  const tx = p.x + ix + 26;
  return (
    <g className={p.cls ?? "node"}>
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={10} />
      <use className="ico" href={`#i-${p.icon}`} x={p.x + ix} y={p.y + Math.floor((p.h - 18) / 2)} width={18} height={18} />
      <text className="t" x={tx} y={p.y + 25}>
        {p.title}
      </text>
      <text className="s" x={tx} y={p.y + 43}>
        {p.sub}
      </text>
    </g>
  );
}

/** A wide-layout node with a title over a row of logos and an optional tail. */
function LNode(p: { x: number; y: number; w: number; h: number; title: string; logos: LogoName[]; tail?: string; cls?: string }) {
  const tailX = p.x + 16 + p.logos.length * 22 + 2;
  return (
    <g className={p.cls ?? "node"}>
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={10} />
      <text className="t" x={p.x + 16} y={p.y + 24}>
        {p.title}
      </text>
      <Logos names={p.logos} x={p.x + 16} y={p.y + 32} />
      {p.tail && (
        <text className="s" x={tailX} y={p.y + 45}>
          {p.tail}
        </text>
      )}
    </g>
  );
}

/** The solid (kernel) or socket (plugin) square in a tile's top-right corner. */
function Mark({ x, y, plug }: { x: number; y: number; plug: boolean }) {
  return <rect className={plug ? "sock" : "solid"} x={x} y={y} width={7} height={7} />;
}

/** A narrow-layout tile: icon on top, title below. */
function Tile(p: { x: number; y: number; w: number; icon: string; title: string; plug: boolean; cls?: string }) {
  return (
    <>
      <g className={p.cls ?? "node"}>
        <rect x={p.x} y={p.y} width={p.w} height={64} rx={10} />
        <use className="ico" href={`#i-${p.icon}`} x={p.x + 12} y={p.y + 12} width={18} height={18} />
        <text className="t sm" x={p.x + 12} y={p.y + 50}>
          {p.title}
        </text>
      </g>
      <Mark x={p.x + p.w - 17} y={p.y + 10} plug={p.plug} />
    </>
  );
}

/** A narrow-layout tile with logos on top; `plug: null` draws no mark. */
function LTile(p: { x: number; y: number; w: number; logos: LogoName[]; title: string; plug: boolean | null; cls?: string }) {
  return (
    <>
      <g className={p.cls ?? "node"}>
        <rect x={p.x} y={p.y} width={p.w} height={64} rx={10} />
        <Logos names={p.logos} x={p.x + 12} y={p.y + 12} />
        <text className="t sm" x={p.x + 12} y={p.y + 50}>
          {p.title}
        </text>
      </g>
      {p.plug !== null && <Mark x={p.x + p.w - 17} y={p.y + 10} plug={p.plug} />}
    </>
  );
}

/** The extension point's name over a node, after its kernel or plugin square. */
function Tag({ x, y, text, plug = true }: { x: number; y: number; text: string; plug?: boolean }) {
  return (
    <>
      <Mark x={x} y={y - 8} plug={plug} />
      <text className="tag" x={x + 13} y={y}>
        {text}
      </text>
    </>
  );
}

/** A link's end square, centred on the point where it meets the kernel. */
function End({ x, y, plug }: { x: number; y: number; plug: boolean }) {
  return <rect className={plug ? "sock" : "solid"} x={x - 3.5} y={y - 3.5} width={7} height={7} />;
}

/** Packets running along links, one per path, starts staggered by `step`. */
function Packets({ paths, dur, cls = "pk", reverse = false, step = 0 }: { paths: string[]; dur: number; cls?: string; reverse?: boolean; step?: number }) {
  return (
    <>
      {paths.map((d, i) => {
        const begin = `${(step * i + (reverse ? dur / 2 : 0)).toFixed(2)}s`;
        return (
          <rect key={i} className={cls} x={-3} y={-3} width={6} height={6}>
            {reverse ? (
              <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={begin} path={d} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
            ) : (
              <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={begin} path={d} />
            )}
          </rect>
        );
      })}
    </>
  );
}

function Links({ paths, out = false }: { paths: string[]; out?: boolean }) {
  return (
    <g className={out ? "links out" : "links"}>
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/** The kernel box contents: the mark, the name and what it does. */
function Kernel({ x, y, w, gap, m }: { x: number; y: number; w: number; gap: number; m: Dict["map"] }) {
  const rows: [string, string][] = [
    [m.run, m.runV],
    [m.ctx, m.ctxV],
    [m.gov, m.govV],
    [m.plat, m.platV],
  ];
  return (
    <>
      <LogoMark className="px core-mark" x={x + 24} y={y + 24} width={42} height={30} />
      <text className="t big" x={x + 78} y={y + 46}>
        {m.kernel}
      </text>
      <line className="rule" x1={x + 24} y1={y + 76} x2={x + w - 24} y2={y + 76} />
      {rows.map(([k, v], i) => (
        <g key={i}>
          <text className="k" x={x + 24} y={y + 104 + i * gap}>
            {k}
          </text>
          <text className="v" x={x + 24} y={y + 124 + i * gap}>
            {v}
          </text>
        </g>
      ))}
    </>
  );
}

/** The boundary, its caption and the kernel/plugin legend. */
function Frame({ w, h, ox, oy, legend, m }: { w: number; h: number; ox: number; oy: number; legend: [number, number, number]; m: Dict["map"] }) {
  const [coreX, plugX, legendY] = legend;
  return (
    <>
      <rect className="edge" x={1} y={1} width={w} height={h} rx={14} />
      <use className="ico sm" href="#i-shield" x={ox} y={oy} width={16} height={16} />
      <text className="cap" x={ox + 22} y={oy + 13}>
        {m.edge}
      </text>
      <rect className="solid" x={coreX} y={legendY} width={7} height={7} />
      <text className="cap" x={coreX + 13} y={legendY + 8}>
        {m.legendCore}
      </text>
      <rect className="sock" x={plugX} y={legendY} width={7} height={7} />
      <text className="cap" x={plugX + 13} y={legendY + 8}>
        {m.legendPlugin}
      </text>
    </>
  );
}

// Wide layout ----------------------------------------------------------------------------
const W_CORE = ["M236 132H292", "M236 420H292"];
const W_PLUG = ["M236 228H292", "M236 324H292", "M604 132H652", "M604 228H652", "M604 324H652", "M604 420H652", "M354 428V484", "M550 428V484"];
const W_OUT = ["M864 132H936", "M864 228H936"];

function WideMap({ m }: { m: Dict["map"] }) {
  return (
    <svg className="map map-wide" viewBox="0 0 1136 562" role="img" aria-labelledby="map-title">
      <title id="map-title">{m.title}</title>
      <Frame w={884} h={560} ox={24} oy={19} legend={[600, 724, 24]} m={m} />
      <g className="core">
        <rect x={292} y={104} width={312} height={324} rx={14} />
      </g>
      <Links paths={[...W_CORE, ...W_PLUG]} />
      <Links paths={W_OUT} out />
      <g className="flow">
        <Packets paths={[W_CORE[0], ...W_PLUG.slice(0, 2)]} dur={2.4} step={0.7} />
        <Packets paths={W_PLUG.slice(2, 6)} dur={2.2} step={0.45} />
        <Packets paths={W_PLUG.slice(2, 6)} dur={2.2} cls="pk dim" reverse step={0.45} />
        <Packets paths={W_PLUG.slice(6)} dur={2.0} step={0.9} />
        <Packets paths={[W_CORE[1]]} dur={3.2} cls="pk dim" />
        <Packets paths={["M604 132H936", "M604 228H936"]} dur={4.8} cls="pk out" step={2.0} />
      </g>
      <Kernel x={292} y={104} w={312} gap={56} m={m} />
      <End x={292} y={132} plug={false} />
      <End x={292} y={420} plug={false} />
      <End x={354} y={484} plug={false} />
      {([[292, 228], [292, 324], [652, 132], [652, 228], [652, 324], [652, 420], [550, 484]] as const).map(([x, y]) => (
        <End key={`${x},${y}`} x={x} y={y} plug />
      ))}
      <rect className="gate" x={878} y={112} width={14} height={136} rx={3} />
      <text className="cap" x={868} y={270} textAnchor="end">
        {m.gate}
      </text>
      <Tag x={24} y={96} text="web" plug={false} />
      <Node x={24} y={104} w={212} h={56} icon="monitor" title={m.web} sub={m.webSub} />
      <Tag x={24} y={192} text="channel" />
      <LNode x={24} y={200} w={212} h={56} title={m.im} logos={IM} />
      <Tag x={24} y={288} text="identity · directory" />
      <LNode x={24} y={296} w={212} h={56} title={m.id} logos={SSO} tail={m.sso} />
      <Tag x={652} y={96} text="model-provider" />
      <LNode x={652} y={104} w={212} h={56} title={m.models} logos={SELF_MODELS} tail="vLLM · Ollama" />
      <Tag x={652} y={192} text="connector" />
      <LNode x={652} y={200} w={212} h={56} title={m.internal} logos={CONNECTORS} tail="MCP · OpenAPI" />
      <Tag x={652} y={288} text="object-store" />
      <LNode x={652} y={296} w={212} h={56} title={m.store} logos={STORES} tail={m.storeSub} />
      <Tag x={24} y={384} text="marketplace" plug={false} />
      <Node x={24} y={392} w={212} h={56} icon="store" title={m.market} sub={m.marketSub} />
      <Tag x={652} y={384} text="your-plugin" />
      <Node x={652} y={392} w={212} h={56} icon="plus2" title={m.yours} sub={m.yoursSub} cls="node yours" />
      <Tag x={260} y={476} text="device" plug={false} />
      <Node x={260} y={484} w={188} h={56} icon="laptop" title={m.laptop} sub="capybara-device" ix={14} />
      <Tag x={456} y={476} text="sandbox" />
      <LNode x={456} y={484} w={188} h={56} title={m.sandbox} logos={SANDBOXES} tail={m.own} />
      <text className="cap" x={936} y={96}>
        {m.outside}
      </text>
      <LNode x={936} y={104} w={192} h={56} title={m.cloud} logos={CLOUD_MODELS} cls="node dim" />
      <LNode x={936} y={200} w={192} h={56} title={m.saas} logos={SAAS} cls="node dim" />
    </svg>
  );
}

// Narrow layout --------------------------------------------------------------------------
const N_TOP = ["M68 132V176", "M180 132V176", "M292 132V176"];
const N_SYS = ["M68 480V528", "M180 480V528", "M292 480V528"];
const N_DEV = ["M124 480V636", "M236 480V636"];

function NarrowMap({ m }: { m: Dict["map"] }) {
  return (
    <svg className="map map-narrow" viewBox="0 0 360 876" role="img" aria-labelledby="map-title-n">
      <title id="map-title-n">{m.title}</title>
      <Frame w={358} h={751} ox={16} oy={15} legend={[16, 108, 44]} m={m} />
      <g className="core">
        <rect x={16} y={176} width={328} height={304} rx={14} />
      </g>
      <Links paths={[...N_TOP, ...N_SYS, ...N_DEV]} />
      <Links paths={["M180 480V745", "M180 759V808"]} out />
      <g className="flow">
        <Packets paths={N_TOP} dur={1.6} step={0.5} />
        <Packets paths={N_SYS} dur={1.6} step={0.4} />
        <Packets paths={N_DEV} dur={2.2} step={0.8} />
        <Packets paths={["M180 480V808"]} dur={4.6} cls="pk out" />
      </g>
      <Kernel x={16} y={176} w={328} gap={52} m={m} />
      <Tile x={16} y={68} w={104} icon="monitor" title={m.webNarrow} plug={false} />
      <LTile x={128} y={68} w={104} logos={IM} title={m.im} plug />
      <LTile x={240} y={68} w={104} logos={SSO} title={m.idNarrow} plug />
      <LTile x={16} y={528} w={104} logos={SELF_MODELS} title={m.modelsNarrow} plug />
      <LTile x={128} y={528} w={104} logos={CONNECTORS} title={m.internal} plug />
      <LTile x={240} y={528} w={104} logos={STORES} title={m.store} plug />
      <Tile x={16} y={636} w={104} icon="laptop" title={m.laptop} plug={false} />
      <Tile x={128} y={636} w={104} icon="plus2" title={m.yours} plug cls="node yours" />
      <LTile x={240} y={636} w={104} logos={SANDBOXES} title={m.sandbox} plug />
      <rect className="gate" x={148} y={745} width={64} height={14} rx={3} />
      <text className="cap" x={220} y={784}>
        {m.gate}
      </text>
      <LTile x={16} y={808} w={160} logos={CLOUD_MODELS} title={m.cloud} plug={null} cls="node dim" />
      <LTile x={184} y={808} w={160} logos={SAAS} title={m.saasNarrow} plug={null} cls="node dim" />
    </svg>
  );
}

export function OverviewMap() {
  const { t } = useSite();
  return (
    <div className="map-wrap">
      <WideMap m={t.map} />
      <NarrowMap m={t.map} />
    </div>
  );
}
