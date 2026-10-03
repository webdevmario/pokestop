import { Ground, Lit, PropComponent, Shade, Speckle, detail, ink } from "./shared";

/** Rounded boulder with a broad lit dome and grain speckle. */
export const BoulderRound: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={42} ry={5} />
    <g {...ink(p)}>
      <path d="M2 96 Q-2 54 24 34 Q54 12 80 36 Q102 58 98 96 Z" fill={p.propMid} />
      <Lit d="M24 34 Q54 12 80 36 Q54 42 34 62 Q26 48 24 34 Z" p={p} opacity={0.38} />
      <Shade d="M62 60 Q84 56 98 50 L98 96 L58 96 Z" p={p} opacity={0.24} />
    </g>
    <g {...detail(p.ink, 1.4, 0.35)}>
      <path d="M34 62 Q36 80 32 96 M34 62 Q60 60 84 48" />
    </g>
    <Speckle p={p} points={[[20,72],[46,78],[70,70],[58,88],[82,80]]} r={2} opacity={0.22} />
  </g>
);

/** Angular boulder split by a deep fracture. */
export const BoulderCracked: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={40} ry={5} />
    <g {...ink(p)}>
      <path d="M6 96 L10 50 L34 18 L58 24 L52 54 L90 44 L96 96 Z" fill={p.propMid} />
      <Lit d="M34 18 L58 24 L52 54 L30 50 Z" p={p} opacity={0.4} />
      <Shade d="M52 54 L90 44 L96 96 L56 96 Z" p={p} opacity={0.26} />
      <path d="M52 54 L48 96" fill="none" stroke={p.ink} strokeWidth={3} />
    </g>
    <g {...detail(p.ink, 1.3, 0.35)}>
      <path d="M22 62 L30 56 M66 62 L76 56 M36 80 L30 92" />
    </g>
  </g>
);

/** Flat stacked slab, like a tipped shelf of stone. */
export const RockSlab: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={44} ry={5} />
    <g {...ink(p)}>
      <path d="M4 96 L8 68 L44 56 L96 64 L96 96 Z" fill={p.propMid} />
      <Lit d="M8 68 L44 56 L96 64 L52 74 Z" p={p} opacity={0.42} />
      <path d="M14 76 L46 66 L88 72" {...detail(p.ink, 1.4, 0.4)} />
      <path d="M12 86 L44 78 L90 84" {...detail(p.ink, 1.4, 0.3)} />
    </g>
  </g>
);

/** Rubble pile of mixed chunks. */
export const RubblePile: PropComponent = ({ p }) => {
  const chunks: [number, number, number][] = [
    [16, 86, 15],
    [42, 92, 11],
    [64, 84, 17],
    [86, 90, 10],
    [34, 70, 10],
    [60, 64, 8],
  ];
  return (
    <g>
      <Ground p={p} rx={44} ry={4} />
      <g {...ink(p, 2)}>
        {chunks.map(([x, y, r], i) => (
          <g key={i}>
            <path
              d={`M${x - r} ${y + r * 0.55} L${x - r * 0.8} ${y - r * 0.45} L${x} ${y - r} L${x + r * 0.9} ${y - r * 0.35} L${x + r} ${y + r * 0.55} Z`}
              fill={i % 2 ? p.propMid : p.propDark}
            />
            <path
              d={`M${x} ${y - r} L${x + r * 0.9} ${y - r * 0.35} L${x} ${y}Z`}
              fill={p.propLight}
              opacity={0.25}
              stroke="none"
            />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Single tall crystal spire with internal facets. */
export const CrystalSpire: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={22} ry={4} />
    <g {...ink(p, 2.2)}>
      <path d="M32 96 L24 38 L46 4 L60 32 L72 22 L76 96 Z" fill={p.propMid} opacity={0.94} />
      <Lit d="M46 4 L46 96 L32 96 L24 38 Z" p={p} opacity={0.5} />
      <Shade d="M60 32 L58 96 L76 96 L72 22 Z" p={p} opacity={0.22} />
    </g>
    <g {...detail(p.propLight, 1.5, 0.55)}>
      <path d="M28 54 L60 44 M30 74 L66 64" />
    </g>
    <path d="M40 20 L44 46" {...detail("#ffffff", 1.4, 0.4)} />
  </g>
);

/** Cluster of three crystals at varying heights. */
export const CrystalCluster: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={40} ry={4} />
    <g {...ink(p, 2)}>
      <path d="M6 96 L12 54 L24 28 L34 58 L32 96 Z" fill={p.propMid} opacity={0.9} />
      <Lit d="M24 28 L24 96 L12 54 Z" p={p} opacity={0.42} />
      <path d="M58 96 L64 50 L80 24 L90 56 L92 96 Z" fill={p.propMid} opacity={0.9} />
      <Lit d="M80 24 L80 96 L64 50 Z" p={p} opacity={0.42} />
      <path d="M30 96 L38 32 L54 2 L66 36 L64 96 Z" fill={p.propMid} opacity={0.96} />
      <Lit d="M54 2 L52 96 L38 32 Z" p={p} opacity={0.5} />
    </g>
    <g {...detail(p.propLight, 1.4, 0.45)}>
      <path d="M40 50 L62 44 M42 70 L62 66" />
    </g>
  </g>
);

/** Split geode: stone shell with a crystalline interior. */
export const Geode: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={36} ry={5} />
    <g {...ink(p)}>
      <path d="M8 96 Q2 56 28 38 Q56 20 80 42 Q100 60 94 96 Z" fill={p.propDark} />
      <path d="M24 92 Q18 62 36 50 Q58 38 74 54 Q88 68 84 92 Z" fill={p.propMid} />
      <path d="M34 90 Q30 68 44 60 Q58 52 68 64 Q78 74 74 90 Z" fill={p.propLight} opacity={0.85} />
    </g>
    <g {...ink(p, 1.2)} fill={p.propLight}>
      <path d="M44 90 L48 68 L54 90 Z" />
      <path d="M56 90 L62 72 L66 90 Z" />
      <path d="M36 90 L40 76 L44 90 Z" />
    </g>
  </g>
);

/** Floor spikes: a stalagmite field. */
export const Stalagmites: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={42} ry={4} />
    <g {...ink(p)}>
      <path d="M8 96 L20 44 L30 96 Z" fill={p.propMid} />
      <Lit d="M20 44 L20 96 L8 96 Z" p={p} opacity={0.3} />
      <path d="M62 96 L74 34 L86 96 Z" fill={p.propMid} />
      <Lit d="M74 34 L74 96 L62 96 Z" p={p} opacity={0.3} />
      <path d="M28 96 L46 10 L62 96 Z" fill={p.propMid} />
      <Lit d="M46 10 L46 96 L28 96 Z" p={p} opacity={0.38} />
    </g>
    <g {...detail(p.ink, 1.2, 0.3)}>
      <path d="M40 60 L52 58 M38 78 L56 76 M16 70 L26 68" />
    </g>
  </g>
);

/** Floor-to-ceiling column where a stalactite and stalagmite have joined. */
export const CaveColumn: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={4} />
    <g {...ink(p)}>
      <path d="M30 96 Q34 70 40 52 Q34 28 28 0 L72 0 Q66 28 60 52 Q66 70 70 96 Z" fill={p.propMid} />
      <Lit d="M28 0 L40 52 L34 96 L30 96 Q34 70 40 52 Q34 28 28 0 Z" p={p} opacity={0.3} />
      <Shade d="M60 52 Q66 70 70 96 L58 96 Q58 70 54 52 Z" p={p} opacity={0.24} />
    </g>
    <g {...detail(p.ink, 1.3, 0.32)}>
      <path d="M38 24 Q50 28 62 24 M36 46 Q50 50 64 46 M34 70 Q50 74 66 70" />
    </g>
  </g>
);

/** Still pool with a reflective surface and a stone rim. */
export const CavePool: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p)}>
      <ellipse cx={50} cy={74} rx={46} ry={20} fill={p.propDark} />
      <ellipse cx={50} cy={72} rx={38} ry={15} fill={p.propLight} opacity={0.55} stroke="none" />
    </g>
    <g {...detail("#ffffff", 1.6, 0.4)}>
      <path d="M26 68 Q36 64 48 68 M54 78 Q66 74 76 78" />
    </g>
    <g {...ink(p, 1.8)} fill={p.propMid}>
      <path d="M4 80 L10 66 L22 62 L26 78 Z" />
      <path d="M76 76 L84 62 L96 66 L96 82 Z" />
    </g>
  </g>
);

/** Mineral vein running through exposed rock. */
export const MineralVein: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={38} ry={4} />
    <g {...ink(p)}>
      <path d="M6 96 L12 52 L38 30 L72 36 L92 62 L94 96 Z" fill={p.propMid} />
      <Shade d="M60 50 L66 96 L94 96 L92 62 Z" p={p} opacity={0.22} />
    </g>
    <path
      d="M14 88 Q30 70 34 54 Q44 44 60 50 Q74 54 88 44"
      fill="none"
      stroke={p.propLight}
      strokeWidth={5}
      opacity={0.9}
      strokeLinecap="round"
    />
    <path
      d="M14 88 Q30 70 34 54 Q44 44 60 50 Q74 54 88 44"
      fill="none"
      stroke="#ffffff"
      strokeWidth={1.6}
      opacity={0.45}
      strokeLinecap="round"
    />
  </g>
);

/** Ring of luminous cave mushrooms. */
export const GlowMushrooms: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={34} ry={4} />
    <g {...ink(p, 1.8)}>
      {([
        [18, 88, 9],
        [40, 80, 13],
        [64, 86, 10],
        [84, 78, 8],
      ] as [number, number, number][]).map(([x, y, r], i) => (
        <g key={i}>
          <path d={`M${x - r * 0.35} 96 Q${x - r * 0.3} ${y} ${x} ${y - 2} Q${x + r * 0.3} ${y} ${x + r * 0.35} 96 Z`} fill={p.propLight} />
          <path
            d={`M${x - r} ${y} Q${x - r * 0.9} ${y - r * 1.5} ${x} ${y - r * 1.5} Q${x + r * 0.9} ${y - r * 1.5} ${x + r} ${y} Q${x} ${y + r * 0.35} ${x - r} ${y} Z`}
            fill={p.propMid}
          />
        </g>
      ))}
    </g>
    <g fill="#ffffff" opacity={0.5} stroke="none">
      <circle cx={36} cy={70} r={2.6} />
      <circle cx={46} cy={74} r={2} />
      <circle cx={62} cy={78} r={2} />
      <circle cx={20} cy={82} r={1.8} />
    </g>
  </g>
);
