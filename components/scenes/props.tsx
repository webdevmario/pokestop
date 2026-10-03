import type { ThemePalette } from "./types";

/**
 * Authored scene props.
 *
 * Every prop draws into a 100x100 viewBox, takes its colours from the theme
 * palette, and shares one ink outline. That shared outline is what makes a
 * pine, a tombstone and a crystal read as the same illustrated book rather
 * than as unrelated clip art.
 *
 * Shading is done with stacked semi-transparent paths rather than SVG
 * gradients: gradients need per-instance ids, and a plate renders well over a
 * hundred props. Texture comes from small repeated marks (needles, cracks,
 * speckles) inside the silhouette, which is what separates these from flat
 * vector shapes at a glance.
 *
 * Props are drawn feet-at-the-bottom so the stage can sort by baseline.
 */

export interface PropProps {
  p: ThemePalette;
}

function ink(p: ThemePalette, width = 2.5) {
  return {
    stroke: p.ink,
    strokeWidth: width,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
}

/** Thin interior marks: texture without a second outline weight. */
function detail(color: string, width = 1.4, opacity = 0.55) {
  return {
    stroke: color,
    strokeWidth: width,
    strokeLinecap: "round" as const,
    fill: "none",
    opacity,
  };
}

/* ── Trees ─────────────────────────────────────────────────────────── */

function ConiferTree({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M45 100 L45 70 Q50 66 55 70 L55 100 Z" fill={p.propDark} />
      {/* three tiers, each with a shaded underside and needle marks */}
      <path d="M50 76 L18 78 L26 58 L50 54 L74 58 L82 78 Z" fill={p.propMid} />
      <path d="M50 76 L18 78 L26 58 L50 54 Z" fill={p.propDark} opacity={0.3} stroke="none" />
      <path d="M50 56 L26 58 L32 38 L50 34 L68 38 L74 58 Z" fill={p.propMid} />
      <path d="M50 56 L26 58 L32 38 L50 34 Z" fill={p.propDark} opacity={0.3} stroke="none" />
      <path d="M50 36 L34 38 L50 6 L66 38 Z" fill={p.propMid} />
      <path d="M50 36 L34 38 L50 6 Z" fill={p.propLight} opacity={0.35} stroke="none" />
      <g {...detail(p.ink, 1.2, 0.35)}>
        <path d="M38 70 L44 64 M56 64 L62 70 M40 50 L46 44 M54 44 L60 50 M46 28 L50 22 L54 28" />
      </g>
    </g>
  );
}

function BroadleafTree({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M43 100 L43 60 L57 60 L57 100 Z" fill={p.propDark} />
      <path d="M50 62 L50 100" {...detail(p.ink, 1.3, 0.4)} />
      {/* canopy as overlapping lobes, not one ellipse */}
      <path
        d="M14 46 Q10 24 30 18 Q40 4 56 10 Q78 6 84 26 Q96 38 84 54 Q66 70 44 68 Q20 66 14 46 Z"
        fill={p.propMid}
      />
      <path
        d="M30 18 Q40 4 56 10 Q66 14 68 26 Q52 38 34 32 Q26 26 30 18 Z"
        fill={p.propLight}
        opacity={0.45}
        stroke="none"
      />
      <path d="M62 50 Q78 52 84 54 Q66 70 44 68 Q58 62 62 50 Z" fill={p.propDark} opacity={0.28} stroke="none" />
      <g {...detail(p.ink, 1.2, 0.3)}>
        <path d="M26 40 Q34 34 42 40 M52 26 Q60 20 68 28 M48 52 Q58 48 66 54" />
      </g>
    </g>
  );
}

function TreeStump({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M22 100 L26 44 Q50 36 74 44 L78 100 Z" fill={p.propMid} />
      <ellipse cx={50} cy={44} rx={24} ry={8} fill={p.propLight} opacity={0.8} />
      <ellipse cx={50} cy={44} rx={14} ry={4.5} {...detail(p.ink, 1.2, 0.5)} />
      <ellipse cx={50} cy={44} rx={6} ry={2} {...detail(p.ink, 1.2, 0.5)} />
      <g {...detail(p.ink, 1.3, 0.35)}>
        <path d="M34 58 L34 94 M50 60 L50 96 M66 58 L66 94" />
      </g>
    </g>
  );
}

function FallenLog({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M4 58 Q50 44 96 58 L96 86 Q50 74 4 86 Z" fill={p.propMid} />
      <path d="M4 58 Q50 44 96 58 Q50 54 4 72 Z" fill={p.propLight} opacity={0.35} stroke="none" />
      <ellipse cx={95} cy={72} rx={7} ry={14} fill={p.propLight} />
      <ellipse cx={95} cy={72} rx={3} ry={6} {...detail(p.ink, 1.2, 0.6)} />
      <g {...detail(p.ink, 1.2, 0.3)}>
        <path d="M24 60 Q26 72 24 82 M48 56 Q50 70 48 80 M70 58 Q72 70 70 80" />
      </g>
    </g>
  );
}

function DeadTree({ p }: PropProps) {
  return (
    <g {...ink(p, 2)}>
      <path d="M42 100 Q46 70 48 44 Q49 30 52 10" fill="none" stroke={p.propDark} strokeWidth={7} />
      <path d="M48 52 Q34 44 20 26 M49 40 Q64 34 76 16 M47 66 Q36 60 28 50 M51 28 Q58 22 60 10" fill="none" stroke={p.propDark} strokeWidth={4.5} />
      <path d="M20 26 L12 16 M76 16 L84 8 M28 50 L20 44 M60 10 L58 2" fill="none" stroke={p.propDark} strokeWidth={2.6} />
      <path d="M44 96 Q47 70 49 46" {...detail(p.propLight, 1.3, 0.3)} />
    </g>
  );
}

function PalmTree({ p }: PropProps) {
  const fronds = [-82, -40, 4, 48, 96, 142, 186];
  return (
    <g {...ink(p)}>
      <path d="M42 100 Q48 62 56 28" fill="none" stroke={p.propDark} strokeWidth={8} />
      <g {...detail(p.ink, 1.3, 0.4)}>
        <path d="M44 92 L50 90 M45 80 L51 78 M47 68 L53 66 M49 54 L55 52 M52 42 L57 40" />
      </g>
      {fronds.map((a, i) => {
        const r = (a * Math.PI) / 180;
        const ex = 56 + Math.cos(r) * 38;
        const ey = 26 + Math.sin(r) * 22;
        const mx = (56 + ex) / 2 + (i % 2 ? 9 : -9);
        const my = (26 + ey) / 2 - 12;
        return (
          <g key={i}>
            <path d={`M56 26 Q${mx} ${my} ${ex} ${ey}`} fill="none" stroke={i % 2 ? p.propMid : p.propDark} strokeWidth={7} />
            <path d={`M56 26 Q${mx} ${my} ${ex} ${ey}`} {...detail(p.propLight, 1.6, 0.4)} />
          </g>
        );
      })}
      <circle cx={56} cy={26} r={5} fill={p.propLight} />
      <circle cx={62} cy={34} r={3.5} fill={p.propLight} />
      <circle cx={50} cy={34} r={3.5} fill={p.propLight} />
    </g>
  );
}

/* ── Shrubs / ground cover ─────────────────────────────────────────── */

function Bush({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path
        d="M4 100 Q0 70 18 62 Q20 44 38 46 Q48 32 62 42 Q82 40 86 60 Q100 68 96 100 Z"
        fill={p.propMid}
      />
      <path d="M18 62 Q20 44 38 46 Q48 32 62 42 Q50 54 34 56 Q24 58 18 62 Z" fill={p.propLight} opacity={0.4} stroke="none" />
      <g {...detail(p.ink, 1.2, 0.3)}>
        <path d="M22 76 Q30 68 38 76 M46 70 Q54 62 62 70 M66 82 Q74 74 82 82 M34 90 Q42 84 50 90" />
      </g>
    </g>
  );
}

function FlowerPatch({ p }: PropProps) {
  const blooms = [
    [20, 48],
    [44, 36],
    [68, 50],
    [84, 40],
  ];
  return (
    <g {...ink(p, 2)}>
      {blooms.map(([x, y], i) => (
        <path key={`s${i}`} d={`M${x} 100 Q${x + (i % 2 ? 5 : -5)} ${y + 22} ${x} ${y + 8}`} fill="none" stroke={p.propDark} strokeWidth={3} />
      ))}
      {blooms.map(([x, y], i) => (
        <g key={`b${i}`}>
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <ellipse
                key={a}
                cx={x + Math.cos(r) * 7}
                cy={y + Math.sin(r) * 7}
                rx={5}
                ry={5}
                fill={i % 2 ? p.propLight : p.propMid}
              />
            );
          })}
          <circle cx={x} cy={y} r={4} fill={p.propDark} />
        </g>
      ))}
    </g>
  );
}

function GrassTuft({ p }: PropProps) {
  const blades = [12, 26, 40, 54, 68, 84];
  return (
    <g {...ink(p, 2.2)} fill="none">
      {blades.map((x, i) => (
        <path
          key={i}
          d={`M${x} 100 Q${x + (i % 2 ? 16 : -16)} 54 ${x + (i % 2 ? -8 : 8)} 6`}
          stroke={i % 2 ? p.propMid : p.propDark}
          strokeWidth={4.5}
        />
      ))}
      {blades.slice(0, 3).map((x, i) => (
        <path key={`h${i}`} d={`M${x + 4} 96 Q${x + 12} 62 ${x + 6} 30`} {...detail(p.propLight, 1.6, 0.45)} />
      ))}
    </g>
  );
}

function Fern({ p }: PropProps) {
  return (
    <g {...ink(p, 2)} fill="none">
      {[-34, -12, 12, 34].map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 100)`}>
          <path d="M50 100 Q52 60 50 18" stroke={p.propDark} strokeWidth={3.2} />
          {[30, 42, 54, 66, 78].map((y, j) => (
            <path
              key={j}
              d={`M50 ${y} Q${40 - j * 2} ${y - 6} ${30 - j * 3} ${y - 2} M50 ${y} Q${60 + j * 2} ${y - 6} ${70 + j * 3} ${y - 2}`}
              stroke={j % 2 ? p.propMid : p.propLight}
              strokeWidth={2.4}
              opacity={0.9}
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
      <path d="M38 100 Q36 72 42 62 L58 62 Q64 72 62 100 Z" fill={p.propLight} />
      <path d="M50 62 L50 100" {...detail(p.ink, 1.2, 0.3)} />
      <path d="M6 60 Q10 20 50 20 Q90 20 94 60 Q50 76 6 60 Z" fill={p.propMid} />
      <path d="M6 60 Q10 20 50 20 Q50 48 50 70 Q24 68 6 60 Z" fill={p.propLight} opacity={0.3} stroke="none" />
      <circle cx={28} cy={44} r={7} fill={p.propLight} stroke="none" opacity={0.85} />
      <circle cx={58} cy={36} r={5.5} fill={p.propLight} stroke="none" opacity={0.85} />
      <circle cx={74} cy={50} r={4} fill={p.propLight} stroke="none" opacity={0.85} />
    </g>
  );
}

/* ── Rock family ───────────────────────────────────────────────────── */

function Rock({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M4 100 L8 54 L28 20 L62 12 L88 44 L96 100 Z" fill={p.propMid} />
      <path d="M28 20 L44 58 L88 44 L62 12 Z" fill={p.propLight} opacity={0.4} stroke="none" />
      <path d="M44 58 L34 100" {...detail(p.ink, 1.6, 0.5)} />
      <path d="M44 58 L88 44 M44 58 L8 54" {...detail(p.ink, 1.4, 0.4)} />
      <g {...detail(p.propLight, 1.2, 0.3)}>
        <path d="M18 76 L26 70 M60 76 L70 68 M52 88 L60 82" />
      </g>
    </g>
  );
}

function Boulder({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M2 100 Q-2 52 26 28 Q56 8 80 32 Q102 54 98 100 Z" fill={p.propMid} />
      <path d="M26 28 Q56 8 80 32 Q58 42 40 62 Q30 44 26 28 Z" fill={p.propLight} opacity={0.38} stroke="none" />
      <path d="M40 62 Q36 82 42 100" {...detail(p.ink, 1.6, 0.45)} />
      <path d="M40 62 Q66 58 86 46" {...detail(p.ink, 1.4, 0.35)} />
      <g {...detail(p.ink, 1.2, 0.25)}>
        <path d="M16 78 L24 74 M62 78 L72 72" />
      </g>
    </g>
  );
}

function Rubble({ p }: PropProps) {
  const chunks: [number, number, number][] = [
    [18, 84, 14],
    [42, 90, 10],
    [64, 82, 16],
    [86, 90, 9],
    [32, 70, 8],
  ];
  return (
    <g {...ink(p, 2)}>
      {chunks.map(([x, y, r], i) => (
        <path
          key={i}
          d={`M${x - r} ${y + r * 0.6} L${x - r * 0.8} ${y - r * 0.4} L${x} ${y - r} L${x + r * 0.9} ${y - r * 0.3} L${x + r} ${y + r * 0.6} Z`}
          fill={i % 2 ? p.propMid : p.propDark}
        />
      ))}
    </g>
  );
}

function Stalagmite({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M14 100 L36 8 L48 30 L58 14 L84 100 Z" fill={p.propMid} />
      <path d="M36 8 L44 66 L48 30 Z" fill={p.propLight} opacity={0.45} stroke="none" />
      <path d="M58 14 L62 72 L84 100" fill={p.propDark} opacity={0.25} stroke="none" />
      <g {...detail(p.propLight, 1.3, 0.35)}>
        <path d="M30 64 L38 56 M62 60 L70 70" />
      </g>
    </g>
  );
}

function Crystal({ p }: PropProps) {
  return (
    <g {...ink(p, 2.2)}>
      <path d="M34 100 L26 40 L44 6 L58 34 L70 24 L74 100 Z" fill={p.propMid} opacity={0.92} />
      <path d="M44 6 L44 100 L34 100 L26 40 Z" fill={p.propLight} opacity={0.5} stroke="none" />
      <path d="M58 34 L56 100" {...detail(p.ink, 1.4, 0.4)} />
      <path d="M30 56 L62 48 M32 76 L66 68" {...detail(p.propLight, 1.5, 0.5)} />
    </g>
  );
}

function CrystalCluster({ p }: PropProps) {
  return (
    <g {...ink(p, 2)}>
      <path d="M8 100 L14 56 L26 32 L36 60 L34 100 Z" fill={p.propMid} opacity={0.9} />
      <path d="M32 100 L38 34 L52 4 L64 38 L62 100 Z" fill={p.propMid} opacity={0.95} />
      <path d="M60 100 L66 52 L80 28 L90 58 L92 100 Z" fill={p.propMid} opacity={0.9} />
      <path d="M52 4 L50 100 L38 34 Z" fill={p.propLight} opacity={0.45} stroke="none" />
      <path d="M26 32 L24 100" {...detail(p.propLight, 1.4, 0.35)} />
      <path d="M80 28 L78 100" {...detail(p.propLight, 1.4, 0.35)} />
    </g>
  );
}

function LavaRock({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M2 100 L8 46 L30 12 L70 16 L92 50 L98 100 Z" fill={p.propDark} />
      <path d="M30 12 L44 54 L92 50 L70 16 Z" fill={p.propMid} opacity={0.6} stroke="none" />
      {/* glowing fissures */}
      <path d="M24 66 Q38 42 52 68 Q62 86 44 94" fill="none" stroke={p.propLight} strokeWidth={3.4} opacity={0.95} />
      <path d="M58 34 Q68 50 62 64" fill="none" stroke={p.propLight} strokeWidth={2.4} opacity={0.75} />
      <path d="M74 70 Q80 80 76 92" fill="none" stroke={p.propLight} strokeWidth={2} opacity={0.6} />
      <path d="M24 66 Q38 42 52 68" fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.45} />
    </g>
  );
}

function BasaltColumn({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M22 100 L24 26 L38 12 L52 24 L50 100 Z" fill={p.propMid} />
      <path d="M50 100 L52 40 L66 26 L80 38 L78 100 Z" fill={p.propDark} />
      <path d="M24 26 L38 12 L52 24 L38 34 Z" fill={p.propLight} opacity={0.4} stroke="none" />
      <g {...detail(p.ink, 1.4, 0.35)}>
        <path d="M30 44 L44 44 M30 66 L44 66 M58 52 L72 52 M58 74 L72 74" />
      </g>
    </g>
  );
}

function Driftwood({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M2 74 Q28 48 54 68 Q76 84 98 58 L98 84 Q76 100 54 90 Q28 72 2 94 Z" fill={p.propMid} />
      <path d="M2 74 Q28 48 54 68 Q76 84 98 58 Q76 72 54 78 Q28 62 2 82 Z" fill={p.propLight} opacity={0.35} stroke="none" />
      <g {...detail(p.ink, 1.3, 0.4)}>
        <path d="M18 74 Q22 82 18 90 M42 70 Q46 80 42 88 M70 78 Q74 86 70 94" />
      </g>
    </g>
  );
}

function Seashell({ p }: PropProps) {
  return (
    <g {...ink(p, 2.2)}>
      <path d="M50 96 Q10 76 18 40 Q26 8 50 8 Q74 8 82 40 Q90 76 50 96 Z" fill={p.propLight} />
      <g {...detail(p.ink, 1.5, 0.45)}>
        <path d="M50 94 Q38 60 32 20 M50 94 Q50 56 50 10 M50 94 Q62 60 68 20" />
      </g>
      <path d="M50 96 Q10 76 18 40 Q34 64 50 96 Z" fill={p.propMid} opacity={0.3} stroke="none" />
    </g>
  );
}

function Seagrass({ p }: PropProps) {
  return (
    <g {...ink(p, 2)} fill="none">
      {[22, 38, 54, 70, 84].map((x, i) => (
        <path
          key={i}
          d={`M${x} 100 Q${x + (i % 2 ? 20 : -20)} 58 ${x + (i % 2 ? -10 : 10)} 12`}
          stroke={i % 2 ? p.propMid : p.propDark}
          strokeWidth={5}
        />
      ))}
    </g>
  );
}

function Tombstone({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M16 100 L16 34 Q16 6 50 6 Q84 6 84 34 L84 100 Z" fill={p.propMid} />
      <path d="M16 34 Q16 6 50 6 L50 100 L16 100 Z" fill={p.propLight} opacity={0.2} stroke="none" />
      <path d="M50 26 L50 72 M32 44 L68 44" stroke={p.propDark} strokeWidth={4} fill="none" />
      <g {...detail(p.ink, 1.3, 0.35)}>
        <path d="M26 84 L74 84 M30 92 L70 92" />
      </g>
    </g>
  );
}

function Crypt({ p }: PropProps) {
  return (
    <g {...ink(p)}>
      <path d="M12 100 L12 40 L50 14 L88 40 L88 100 Z" fill={p.propMid} />
      <path d="M12 40 L50 14 L88 40 L50 52 Z" fill={p.propLight} opacity={0.35} stroke="none" />
      <path d="M38 100 L38 62 Q50 54 62 62 L62 100 Z" fill={p.propDark} />
      <g {...detail(p.ink, 1.3, 0.35)}>
        <path d="M20 58 L20 96 M80 58 L80 96 M12 70 L38 70 M62 70 L88 70" />
      </g>
    </g>
  );
}

function IronFence({ p }: PropProps) {
  const bars = [14, 32, 50, 68, 86];
  return (
    <g {...ink(p, 2.2)} fill="none">
      <path d="M4 48 L96 48 M4 78 L96 78" stroke={p.propMid} strokeWidth={4} />
      {bars.map((x) => (
        <g key={x}>
          <path d={`M${x} 100 L${x} 26`} stroke={p.propMid} strokeWidth={4} />
          <path d={`M${x - 5} 26 L${x} 14 L${x + 5} 26`} stroke={p.propLight} strokeWidth={3} />
        </g>
      ))}
    </g>
  );
}

function Ember({ p }: PropProps) {
  return (
    <g {...ink(p, 2)}>
      <path
        d="M50 100 Q18 74 36 44 Q40 64 52 52 Q44 24 68 4 Q60 40 80 50 Q96 76 50 100 Z"
        fill={p.propMid}
        opacity={0.92}
      />
      <path d="M50 92 Q32 74 44 54 Q48 70 58 58 Q62 78 50 92 Z" fill={p.propLight} stroke="none" />
      <path d="M50 84 Q42 72 50 62" fill="none" stroke="#fff" strokeWidth={1.6} opacity={0.5} />
    </g>
  );
}

function AshMound({ p }: PropProps) {
  return (
    <g {...ink(p, 2)}>
      <path d="M2 100 Q22 66 50 62 Q78 66 98 100 Z" fill={p.propMid} />
      <path d="M2 100 Q22 66 50 62 Q50 82 50 100 Z" fill={p.propLight} opacity={0.25} stroke="none" />
      <g {...detail(p.propLight, 1.4, 0.4)}>
        <path d="M28 88 Q34 80 40 86 M58 84 Q66 76 72 84" />
      </g>
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
  stump: TreeStump,
  log: FallenLog,
  deadtree: DeadTree,
  palm: PalmTree,
  bush: Bush,
  flowers: FlowerPatch,
  grass: GrassTuft,
  fern: Fern,
  mushroom: Mushroom,
  rock: Rock,
  boulder: Boulder,
  rubble: Rubble,
  stalagmite: Stalagmite,
  crystal: Crystal,
  crystalcluster: CrystalCluster,
  lavarock: LavaRock,
  basalt: BasaltColumn,
  driftwood: Driftwood,
  shell: Seashell,
  seagrass: Seagrass,
  tombstone: Tombstone,
  crypt: Crypt,
  fence: IronFence,
  ember: Ember,
  ash: AshMound,
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
