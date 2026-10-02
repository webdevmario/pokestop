import type { ThemePalette } from "./types";

/**
 * Authored scene props.
 *
 * Every prop draws into a 100x100 viewBox with `preserveAspectRatio="none"`
 * handled by the caller's width/height, takes its colors from the theme
 * palette, and shares one ink outline. That shared outline is what makes a
 * pine, a tombstone and a crystal read as the same illustrated book rather
 * than as unrelated clip art.
 *
 * Props are drawn feet-at-the-bottom so the stage can sort by baseline.
 */

export interface PropProps {
  p: ThemePalette;
}

const INK_W = 2.5;

/** Shared outline treatment. */
function ink(p: ThemePalette) {
  return {
    stroke: p.ink,
    strokeWidth: INK_W,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
}

/* ── Trees ─────────────────────────────────────────────────────────── */

function ConiferTree({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M46 100 L46 72 L54 72 L54 100 Z" fill={p.propDark} />
      <path d="M50 4 L78 44 L62 44 L84 74 L16 74 L38 44 L22 44 Z" fill={p.propMid} />
      <path d="M50 4 L64 24 L50 24 Z" fill={p.propLight} stroke="none" />
      <path d="M50 44 L68 68 L50 68 Z" fill={p.propLight} stroke="none" opacity={0.5} />
      {/* needle texture */}
      <path d="M34 56 L42 62 M58 62 L66 56 M44 70 L50 64 L56 70" stroke={p.propDark} strokeWidth={1.5} fill="none" opacity={0.6} />
    </g>
  );
}

function BroadleafTree({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M44 100 L44 62 Q44 54 38 48 M56 100 L56 62 Q56 56 64 50" fill="none" stroke={p.propDark} strokeWidth={6} />
      <path d="M44 100 L56 100 L56 62 L44 62 Z" fill={p.propDark} />
      <ellipse cx={50} cy={40} rx={38} ry={30} fill={p.propMid} />
      <ellipse cx={34} cy={32} rx={22} ry={18} fill={p.propLight} stroke="none" opacity={0.65} />
      <ellipse cx={66} cy={44} rx={18} ry={14} fill={p.propDark} stroke="none" opacity={0.35} />
      <path d="M26 46 Q34 38 42 46 M58 34 Q66 28 74 36" stroke={p.propDark} strokeWidth={1.5} fill="none" opacity={0.5} />
    </g>
  );
}

function DeadTree({ p }: PropProps) {
  return (
    <g {...ink(p)} fill="none" strokeWidth={5}>
      <path d="M48 100 L50 46" stroke={p.propDark} />
      <path d="M50 58 L24 30 M50 48 L72 22 M50 70 L32 56 M50 40 L58 18" stroke={p.propDark} />
      <path d="M24 30 L14 18 M72 22 L82 12 M58 18 L54 6" stroke={p.propDark} strokeWidth={3} />
    </g>
  );
}

function PalmTree({ p }: PropProps) {
  const fronds = [-75, -35, 10, 55, 100, 145, 185];
  return (
    <g {...ink(p)}>
      <path d="M46 100 Q50 60 56 30" fill="none" stroke={p.propDark} strokeWidth={7} />
      {fronds.map((a, i) => {
        const r = (a * Math.PI) / 180;
        const ex = 56 + Math.cos(r) * 36;
        const ey = 28 + Math.sin(r) * 20;
        return (
          <path
            key={i}
            d={`M56 28 Q${(56 + ex) / 2 + (i % 2 ? 8 : -8)} ${(28 + ey) / 2 - 10} ${ex} ${ey}`}
            fill="none"
            stroke={i % 2 ? p.propMid : p.propDark}
            strokeWidth={6}
          />
        );
      })}
      <circle cx={56} cy={28} r={5} fill={p.propLight} />
    </g>
  );
}

/* ── Shrubs / ground cover ─────────────────────────────────────────── */

function Bush({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path
        d="M6 100 Q2 68 24 62 Q28 40 50 44 Q72 38 78 62 Q98 68 94 100 Z"
        fill={p.propMid}
      />
      <path d="M24 62 Q34 52 46 58" fill="none" stroke={p.propLight} strokeWidth={2} opacity={0.7} />
      <path d="M58 54 Q70 50 76 62" fill="none" stroke={p.propDark} strokeWidth={2} opacity={0.5} />
    </g>
  );
}

function GrassTuft({ p }: PropProps) {
  const blades = [14, 30, 46, 62, 80];
  return (
    <g {...ink(p)} fill="none" strokeWidth={4}>
      {blades.map((x, i) => (
        <path
          key={i}
          d={`M${x} 100 Q${x + (i % 2 ? 14 : -14)} 52 ${x + (i % 2 ? -6 : 6)} 8`}
          stroke={i % 2 ? p.propMid : p.propDark}
        />
      ))}
    </g>
  );
}

function Fern({ p }: PropProps) {
  return (
    <g {...ink(p)} fill="none" strokeWidth={3}>
      {[-30, 0, 30].map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 100)`}>
          <path d="M50 100 L50 24" stroke={p.propDark} />
          {[34, 48, 62, 76].map((y, j) => (
            <path
              key={j}
              d={`M50 ${y} L${32 - j * 2} ${y - 8} M50 ${y} L${68 + j * 2} ${y - 8}`}
              stroke={p.propMid}
              strokeWidth={2.5}
            />
          ))}
        </g>
      ))}
    </g>
  );
}

function Mushroom({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M40 100 L40 64 Q50 60 60 64 L60 100 Z" fill={p.propLight} />
      <path d="M8 62 Q14 24 50 24 Q86 24 92 62 Q50 74 8 62 Z" fill={p.propMid} />
      <circle cx={32} cy={46} r={7} fill={p.propLight} stroke="none" opacity={0.8} />
      <circle cx={62} cy={40} r={5} fill={p.propLight} stroke="none" opacity={0.8} />
    </g>
  );
}

/* ── Rock family ───────────────────────────────────────────────────── */

function Rock({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M6 100 L10 52 L34 18 L66 14 L90 48 L96 100 Z" fill={p.propMid} />
      <path d="M34 18 L44 56 L90 48" fill={p.propLight} stroke="none" opacity={0.45} />
      <path d="M44 56 L30 100" fill="none" stroke={p.propDark} strokeWidth={2} opacity={0.6} />
    </g>
  );
}

function Boulder({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M4 100 Q0 50 30 30 Q58 14 80 36 Q100 56 96 100 Z" fill={p.propMid} />
      <path d="M30 30 Q46 44 42 72" fill="none" stroke={p.propDark} strokeWidth={2} opacity={0.55} />
      <ellipse cx={38} cy={44} rx={18} ry={12} fill={p.propLight} stroke="none" opacity={0.4} />
    </g>
  );
}

function Stalagmite({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M18 100 L40 10 L52 26 L72 100 Z" fill={p.propMid} />
      <path d="M40 10 L46 62 L52 26 Z" fill={p.propLight} stroke="none" opacity={0.5} />
    </g>
  );
}

function Crystal({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M50 2 L72 36 L66 100 L34 100 L28 36 Z" fill={p.propMid} opacity={0.9} />
      <path d="M50 2 L50 100 L34 100 L28 36 Z" fill={p.propLight} stroke="none" opacity={0.45} />
      <path d="M36 60 L64 54" fill="none" stroke={p.propLight} strokeWidth={2} opacity={0.6} />
    </g>
  );
}

function LavaRock({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M4 100 L10 46 L32 14 L70 18 L92 52 L96 100 Z" fill={p.propDark} />
      <path
        d="M28 64 Q40 44 54 66 Q64 82 48 92"
        fill="none"
        stroke={p.propLight}
        strokeWidth={3}
        opacity={0.85}
      />
      <path d="M62 38 Q70 50 64 60" fill="none" stroke={p.propMid} strokeWidth={2.5} opacity={0.7} />
    </g>
  );
}

function Driftwood({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path
        d="M2 78 Q28 46 54 70 Q74 88 98 62 L98 92 Q74 100 54 92 Q28 74 2 96 Z"
        fill={p.propMid}
      />
      <path d="M20 72 Q44 62 62 80" fill="none" stroke={p.propDark} strokeWidth={2} opacity={0.6} />
    </g>
  );
}

function Tombstone({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M18 100 L18 34 Q18 8 50 8 Q82 8 82 34 L82 100 Z" fill={p.propMid} />
      <path d="M50 28 L50 70 M34 46 L66 46" stroke={p.propDark} strokeWidth={3} fill="none" />
      <path d="M18 34 Q18 8 50 8 L50 100 L18 100 Z" fill={p.propLight} stroke="none" opacity={0.18} />
    </g>
  );
}

function Ember({ p }: PropProps) {
  return (
    <g {...ink(p)} strokeWidth={2}>
      <path
        d="M50 100 Q22 76 38 48 Q42 66 52 56 Q46 30 68 10 Q62 42 78 54 Q92 76 50 100 Z"
        fill={p.propMid}
        opacity={0.9}
      />
      <path d="M50 92 Q36 76 46 60 Q50 74 58 64 Q62 80 50 92 Z" fill={p.propLight} stroke="none" />
    </g>
  );
}

/* ── Registry ──────────────────────────────────────────────────────── */

export const PROP_COMPONENTS: Record<
  string,
  (props: PropProps) => JSX.Element
> = {
  conifer: ConiferTree,
  broadleaf: BroadleafTree,
  deadtree: DeadTree,
  palm: PalmTree,
  bush: Bush,
  grass: GrassTuft,
  fern: Fern,
  mushroom: Mushroom,
  rock: Rock,
  boulder: Boulder,
  stalagmite: Stalagmite,
  crystal: Crystal,
  lavarock: LavaRock,
  driftwood: Driftwood,
  tombstone: Tombstone,
  ember: Ember,
};

interface RenderProps {
  prop: string;
  palette: ThemePalette;
  /** Foreground props hide Pokemon but must never intercept their clicks. */
  interactive: boolean;
}

export function SceneProp({ prop, palette, interactive }: RenderProps) {
  const Component = PROP_COMPONENTS[prop] ?? Bush;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      /*
       * Hit-testing lives here, not on the wrapper div. An HTML div captures
       * clicks across its whole box including transparent corners, which would
       * make a tree's bounding box an invisible wall over the Pokemon beside
       * it. `visiblePainted` limits the SVG to its actual painted geometry, so
       * only the pixels you can see block a click.
       */
      style={{
        overflow: "visible",
        pointerEvents: interactive ? "visiblePainted" : "none",
      }}
    >
      <Component p={palette} />
    </svg>
  );
}
