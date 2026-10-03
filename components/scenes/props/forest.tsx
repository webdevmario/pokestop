import { Ground, Lit, PropComponent, Shade, Speckle, detail, ink } from "./shared";

/** Tall layered conifer: four tiers, needle marks, sunlit south face. */
export const ConiferTall: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={30} />
    <g {...ink(p)}>
      <path d="M45 98 Q50 92 55 98 L55 82 L45 82 Z" fill={p.propDark} />
      <path d="M50 84 L20 86 L28 66 L50 62 L72 66 L80 86 Z" fill={p.propMid} />
      <Shade d="M50 84 L20 86 L28 66 L50 62 Z" p={p} />
      <path d="M50 66 L27 68 L34 48 L50 44 L66 48 L73 68 Z" fill={p.propMid} />
      <Shade d="M50 66 L27 68 L34 48 L50 44 Z" p={p} />
      <path d="M50 48 L33 50 L39 30 L50 26 L61 30 L67 50 Z" fill={p.propMid} />
      <Lit d="M50 26 L61 30 L67 50 L50 48 Z" p={p} opacity={0.3} />
      <path d="M50 30 L38 32 L50 4 L62 32 Z" fill={p.propMid} />
      <Lit d="M50 4 L62 32 L50 30 Z" p={p} />
    </g>
    <g {...detail(p.ink, 1.1, 0.3)}>
      <path d="M36 78 L44 72 M56 72 L64 78 M38 60 L46 54 M54 54 L62 60 M42 42 L48 36 M52 36 L58 42 M47 22 L50 16 L53 22" />
    </g>
  </g>
);

/** Squat conifer with a broader, snow-laden silhouette. */
export const ConiferSquat: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={34} />
    <g {...ink(p)}>
      <path d="M46 98 L46 80 L54 80 L54 98 Z" fill={p.propDark} />
      <path d="M50 84 L10 88 L22 62 L50 56 L78 62 L90 88 Z" fill={p.propMid} />
      <Shade d="M50 84 L10 88 L22 62 L50 56 Z" p={p} opacity={0.26} />
      <path d="M50 60 L24 62 L34 36 L50 30 L66 36 L76 62 Z" fill={p.propMid} />
      <Lit d="M50 30 L66 36 L76 62 L50 60 Z" p={p} opacity={0.32} />
      <path d="M50 34 L36 36 L50 8 L64 36 Z" fill={p.propMid} />
      <Lit d="M50 8 L64 36 L50 34 Z" p={p} />
    </g>
    <g {...detail(p.propLight, 1.4, 0.4)}>
      <path d="M26 82 L36 76 M62 76 L74 82 M36 56 L46 50 M56 50 L66 56" />
    </g>
  </g>
);

/** Broad oak: lobed canopy built from overlapping masses, forked trunk. */
export const OakTree: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={34} />
    <g {...ink(p)}>
      <path d="M42 98 L44 64 Q40 56 32 50 M58 98 L56 64 Q60 54 70 48" fill="none" stroke={p.propDark} strokeWidth={5} />
      <path d="M42 98 L44 60 L56 60 L58 98 Z" fill={p.propDark} />
      <path
        d="M12 48 Q6 26 26 18 Q34 2 54 8 Q78 2 86 24 Q98 36 86 54 Q70 70 46 68 Q18 68 12 48 Z"
        fill={p.propMid}
      />
      <Lit d="M26 18 Q34 2 54 8 Q70 12 72 28 Q54 40 34 34 Q22 28 26 18 Z" p={p} opacity={0.42} />
      <Shade d="M60 54 Q78 56 86 54 Q70 70 46 68 Q58 64 60 54 Z" p={p} opacity={0.3} />
    </g>
    <g {...detail(p.ink, 1.1, 0.28)}>
      <path d="M24 42 Q32 36 40 42 M50 28 Q58 22 66 30 M46 54 Q56 50 64 56 M70 40 Q78 36 82 42" />
    </g>
    <g {...detail(p.propDark, 1.2, 0.35)}>
      <path d="M47 92 L47 66 M53 90 L53 68" />
    </g>
  </g>
);

/** Slender birch: pale trunk with dark bark scars, airy canopy. */
export const BirchTree: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={24} />
    <g {...ink(p)}>
      <path d="M44 98 Q46 60 48 34 L56 34 Q54 62 54 98 Z" fill={p.propLight} />
      <path d="M48 44 Q34 36 24 22 M52 38 Q64 30 72 16" fill="none" stroke={p.propLight} strokeWidth={3.5} />
      <ellipse cx={30} cy={26} rx={20} ry={15} fill={p.propMid} />
      <ellipse cx={66} cy={20} rx={22} ry={16} fill={p.propMid} />
      <ellipse cx={50} cy={12} rx={18} ry={13} fill={p.propMid} />
      <Lit d="M50 12 m-18 0 a18 13 0 0 1 18 -13 a18 13 0 0 1 18 13 Z" p={p} opacity={0.35} />
    </g>
    <g {...detail(p.ink, 1.6, 0.6)}>
      <path d="M45 84 L50 84 M50 72 L55 72 M45 60 L49 60 M51 50 L55 50" />
    </g>
  </g>
);

/** Weathered granite with cleavage planes and lichen speckle. */
export const RockGranite: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={38} ry={5} />
    <g {...ink(p)}>
      <path d="M6 96 L10 56 L30 22 L62 14 L88 46 L94 96 Z" fill={p.propMid} />
      <Lit d="M30 22 L46 60 L88 46 L62 14 Z" p={p} opacity={0.42} />
      <Shade d="M46 60 L34 96 L94 96 L88 46 Z" p={p} opacity={0.18} />
    </g>
    <g {...detail(p.ink, 1.5, 0.45)}>
      <path d="M46 60 L34 96 M46 60 L88 46 M46 60 L10 56" />
    </g>
    <Speckle
      p={p}
      points={[
        [22, 74],
        [30, 60],
        [64, 70],
        [76, 60],
        [56, 86],
        [40, 44],
      ]}
      r={2.2}
      opacity={0.25}
    />
  </g>
);

/** Low mossy boulder: rounded, with a moss cap spilling over one side. */
export const RockMossy: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={40} ry={5} />
    <g {...ink(p)}>
      <path d="M4 96 Q0 58 26 38 Q56 18 80 42 Q102 62 96 96 Z" fill={p.propMid} />
      <Lit d="M26 38 Q56 18 80 42 Q56 48 36 66 Q28 52 26 38 Z" p={p} opacity={0.3} />
      <path
        d="M10 62 Q30 40 56 44 Q74 48 84 44 Q78 62 56 62 Q30 64 14 74 Z"
        fill={p.propDark}
        opacity={0.75}
      />
    </g>
    <g {...detail(p.propLight, 1.3, 0.45)}>
      <path d="M22 60 Q30 52 40 56 M54 52 Q64 48 72 52" />
    </g>
    <g {...detail(p.ink, 1.3, 0.3)}>
      <path d="M36 76 Q44 84 40 94 M68 70 Q76 80 72 92" />
    </g>
  </g>
);

/** Berry bush: dense leaf mass with scattered fruit. */
export const BushBerry: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={40} ry={5} />
    <g {...ink(p)}>
      <path
        d="M4 96 Q0 66 18 58 Q20 40 38 42 Q48 26 62 38 Q84 36 88 56 Q102 64 96 96 Z"
        fill={p.propMid}
      />
      <Lit d="M18 58 Q20 40 38 42 Q48 26 62 38 Q48 50 32 54 Q22 56 18 58 Z" p={p} opacity={0.38} />
    </g>
    <g fill={p.propLight} stroke={p.ink} strokeWidth={1.1}>
      <circle cx={28} cy={70} r={4} />
      <circle cx={52} cy={60} r={4} />
      <circle cx={72} cy={74} r={4} />
      <circle cx={42} cy={84} r={3.4} />
      <circle cx={64} cy={52} r={3.4} />
    </g>
    <g {...detail(p.ink, 1.1, 0.26)}>
      <path d="M18 82 Q26 74 34 82 M58 80 Q66 72 74 80" />
    </g>
  </g>
);

/** Leafy shrub with visible individual leaves along the crown. */
export const BushLeafy: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={36} ry={5} />
    <g {...ink(p)}>
      <path d="M8 96 Q4 64 24 54 Q44 34 62 50 Q88 50 92 72 Q96 86 92 96 Z" fill={p.propMid} />
      <Lit d="M24 54 Q44 34 62 50 Q46 58 34 62 Q26 60 24 54 Z" p={p} opacity={0.36} />
      {[
        [20, 60],
        [38, 46],
        [58, 44],
        [78, 58],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y} q8 -10 16 -2 q-8 10 -16 2 Z`}
          fill={p.propLight}
          opacity={0.75}
        />
      ))}
    </g>
  </g>
);

/** Fern cluster: arched fronds with paired pinnae. */
export const FernCluster: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={4} />
    <g {...ink(p, 1.8)} fill="none">
      {[-36, -14, 10, 32].map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 98)`}>
          <path d="M50 98 Q53 56 50 14" stroke={p.propDark} strokeWidth={3} />
          {[26, 38, 50, 62, 74, 86].map((y, j) => {
            const spread = 8 + j * 3.5;
            return (
              <path
                key={j}
                d={`M50 ${y} Q${50 - spread * 0.6} ${y - 5} ${50 - spread} ${y - 1} M50 ${y} Q${50 + spread * 0.6} ${y - 5} ${50 + spread} ${y - 1}`}
                stroke={j % 2 ? p.propMid : p.propLight}
                strokeWidth={2.2}
                opacity={0.95}
              />
            );
          })}
        </g>
      ))}
    </g>
  </g>
);

/** Mushroom cluster: three caps at different heights with gilled stems. */
export const MushroomCluster: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={30} ry={4} />
    <g {...ink(p, 2)}>
      {/* back small */}
      <path d="M72 96 Q70 80 74 74 L82 74 Q86 80 84 96 Z" fill={p.propLight} />
      <path d="M62 76 Q64 56 78 56 Q92 56 94 76 Q78 84 62 76 Z" fill={p.propMid} />
      {/* front large */}
      <path d="M34 96 Q30 72 38 62 L54 62 Q62 72 58 96 Z" fill={p.propLight} />
      <path d="M12 62 Q16 28 46 28 Q76 28 80 62 Q46 76 12 62 Z" fill={p.propMid} />
      <Lit d="M12 62 Q16 28 46 28 Q46 46 46 70 Q26 68 12 62 Z" p={p} opacity={0.26} />
      {/* small front-left */}
      <path d="M12 96 Q10 86 13 82 L19 82 Q22 86 20 96 Z" fill={p.propLight} />
      <path d="M4 84 Q6 70 16 70 Q26 70 28 84 Q16 90 4 84 Z" fill={p.propMid} />
    </g>
    <g fill={p.propLight} opacity={0.85} stroke="none">
      <circle cx={28} cy={48} r={5} />
      <circle cx={54} cy={42} r={4} />
      <circle cx={66} cy={54} r={3.2} />
    </g>
    <g {...detail(p.ink, 1, 0.3)}>
      <path d="M38 70 L38 92 M46 70 L46 92 M54 70 L54 92" />
    </g>
  </g>
);

/** Fallen log: end-grain rings, bark ridges, moss along the top. */
export const FallenLog: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={46} ry={5} cy={94} />
    <g {...ink(p)}>
      <path d="M4 56 Q50 42 92 56 L92 84 Q50 72 4 86 Z" fill={p.propMid} />
      <Lit d="M4 56 Q50 42 92 56 Q50 52 4 68 Z" p={p} opacity={0.3} />
      <ellipse cx={92} cy={70} rx={8} ry={14} fill={p.propLight} />
      <ellipse cx={92} cy={70} rx={4.5} ry={8} {...detail(p.ink, 1.1, 0.55)} />
      <ellipse cx={92} cy={70} rx={1.6} ry={3} {...detail(p.ink, 1, 0.5)} />
      <path d="M8 56 Q30 46 56 48 Q44 58 24 60 Q14 58 8 56 Z" fill={p.propDark} opacity={0.6} />
    </g>
    <g {...detail(p.ink, 1.1, 0.3)}>
      <path d="M24 60 Q26 72 24 82 M44 54 Q46 66 44 76 M64 54 Q66 66 64 76" />
    </g>
  </g>
);

/** Cut stump with growth rings and radial splits. */
export const TreeStump: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={32} ry={5} />
    <g {...ink(p)}>
      <path d="M22 96 L26 44 Q50 36 74 44 L78 96 Z" fill={p.propMid} />
      <Shade d="M56 46 L58 96 L78 96 L74 44 Z" p={p} opacity={0.22} />
      <ellipse cx={50} cy={44} rx={24} ry={8.5} fill={p.propLight} />
      <ellipse cx={50} cy={44} rx={16} ry={5.6} {...detail(p.ink, 1.1, 0.5)} />
      <ellipse cx={50} cy={44} rx={8} ry={2.8} {...detail(p.ink, 1.1, 0.5)} />
      <path d="M26 46 Q24 70 28 94" fill="none" stroke={p.propDark} strokeWidth={3} opacity={0.5} />
    </g>
    <g {...detail(p.ink, 1.2, 0.35)}>
      <path d="M36 54 L34 92 M50 56 L50 94 M64 54 L66 92" />
    </g>
    <path d="M50 44 L58 40" {...detail(p.ink, 1.2, 0.45)} />
  </g>
);

/** Wildflower patch: stems, leaves and five-petal blooms. */
export const FlowerPatch: PropComponent = ({ p }) => {
  const blooms: [number, number][] = [
    [16, 54],
    [38, 40],
    [60, 50],
    [82, 44],
  ];
  return (
    <g>
      <Ground p={p} rx={34} ry={4} />
      <g {...ink(p, 1.8)} fill="none">
        {blooms.map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} 98 Q${x + (i % 2 ? 7 : -7)} ${y + 24} ${x} ${y + 9}`} stroke={p.propDark} strokeWidth={3} />
            <path d={`M${x} ${y + 26} q-9 -5 -11 -12 q9 1 11 12 Z`} fill={p.propMid} />
          </g>
        ))}
      </g>
      {blooms.map(([x, y], i) => (
        <g key={`b${i}`} {...ink(p, 1.6)}>
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <ellipse
                key={a}
                cx={x + Math.cos(r) * 6.5}
                cy={y + Math.sin(r) * 6.5}
                rx={5}
                ry={5}
                fill={i % 2 ? p.propLight : p.propMid}
              />
            );
          })}
          <circle cx={x} cy={y} r={3.6} fill={p.propDark} />
        </g>
      ))}
    </g>
  );
};

/** Tall grass tuft with seed heads. */
export const GrassTuft: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={28} ry={4} />
    <g {...ink(p, 2)} fill="none">
      {[14, 28, 42, 56, 70, 84].map((x, i) => (
        <path
          key={i}
          d={`M${x} 98 Q${x + (i % 2 ? 17 : -17)} 54 ${x + (i % 2 ? -9 : 9)} 8`}
          stroke={i % 2 ? p.propMid : p.propDark}
          strokeWidth={4.2}
        />
      ))}
    </g>
    <g fill={p.propLight} opacity={0.75} stroke="none">
      <ellipse cx={23} cy={14} rx={3} ry={7} />
      <ellipse cx={65} cy={10} rx={3} ry={7} />
    </g>
  </g>
);
