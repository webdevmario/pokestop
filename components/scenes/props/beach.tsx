import { Ground, Lit, PropComponent, Shade, Speckle, detail, ink } from "./shared";

/** Classic tall palm with a ringed trunk and coconuts. */
export const PalmTall: PropComponent = ({ p }) => {
  const fronds = [-84, -42, 2, 44, 94, 140, 184];
  return (
    <g>
      <Ground p={p} rx={24} ry={4} />
      <g {...ink(p)}>
        <path d="M40 96 Q48 58 58 24" fill="none" stroke={p.propDark} strokeWidth={8} />
        {fronds.map((a, i) => {
          const r = (a * Math.PI) / 180;
          const ex = 58 + Math.cos(r) * 38;
          const ey = 22 + Math.sin(r) * 22;
          const mx = (58 + ex) / 2 + (i % 2 ? 9 : -9);
          const my = (22 + ey) / 2 - 13;
          return (
            <g key={i}>
              <path d={`M58 22 Q${mx} ${my} ${ex} ${ey}`} fill="none" stroke={i % 2 ? p.propMid : p.propDark} strokeWidth={7} />
              <path d={`M58 22 Q${mx} ${my} ${ex} ${ey}`} {...detail(p.propLight, 1.6, 0.45)} />
            </g>
          );
        })}
        <g fill={p.propLight}>
          <circle cx={56} cy={30} r={4.5} />
          <circle cx={64} cy={33} r={4} />
          <circle cx={60} cy={38} r={3.6} />
        </g>
      </g>
      <g {...detail(p.ink, 1.3, 0.4)}>
        <path d="M42 88 L49 86 M43 76 L50 74 M45 64 L52 62 M48 52 L55 50 M51 40 L57 38" />
      </g>
    </g>
  );
};

/** Wind-bent palm leaning hard to one side. */
export const PalmBent: PropComponent = ({ p }) => {
  const fronds = [-120, -70, -20, 20, 60, 110];
  return (
    <g>
      <Ground p={p} rx={22} ry={4} />
      <g {...ink(p)}>
        <path d="M58 96 Q60 60 36 30" fill="none" stroke={p.propDark} strokeWidth={8} />
        {fronds.map((a, i) => {
          const r = (a * Math.PI) / 180;
          const ex = 34 + Math.cos(r) * 34;
          const ey = 28 + Math.sin(r) * 20;
          const mx = (34 + ex) / 2 + (i % 2 ? 8 : -8);
          const my = (28 + ey) / 2 - 12;
          return (
            <path
              key={i}
              d={`M34 28 Q${mx} ${my} ${ex} ${ey}`}
              fill="none"
              stroke={i % 2 ? p.propMid : p.propDark}
              strokeWidth={6.5}
            />
          );
        })}
        <circle cx={34} cy={28} r={5} fill={p.propLight} />
      </g>
      <g {...detail(p.ink, 1.3, 0.4)}>
        <path d="M57 86 L63 85 M55 74 L61 72 M51 62 L57 60 M46 50 L52 48" />
      </g>
    </g>
  );
};

/** Short young palm, broad fronds, no trunk rings yet. */
export const PalmYoung: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={22} ry={4} />
    <g {...ink(p)}>
      <path d="M48 96 Q50 72 52 56" fill="none" stroke={p.propDark} strokeWidth={6} />
      {[-70, -25, 25, 70, 130, 180].map((a, i) => {
        const r = (a * Math.PI) / 180;
        const ex = 52 + Math.cos(r) * 32;
        const ey = 54 + Math.sin(r) * 24;
        return (
          <path
            key={i}
            d={`M52 54 Q${(52 + ex) / 2 + (i % 2 ? 7 : -7)} ${(54 + ey) / 2 - 14} ${ex} ${ey}`}
            fill="none"
            stroke={i % 2 ? p.propMid : p.propLight}
            strokeWidth={8}
          />
        );
      })}
    </g>
  </g>
);

/** Large sea-worn rock with a wet lower band. */
export const BeachRockLarge: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={40} ry={5} />
    <g {...ink(p)}>
      <path d="M4 96 Q0 56 26 36 Q56 16 82 40 Q102 60 96 96 Z" fill={p.propMid} />
      <Lit d="M26 36 Q56 16 82 40 Q56 44 36 64 Q28 50 26 36 Z" p={p} opacity={0.4} />
      <path d="M6 82 Q30 76 52 80 Q76 84 96 78 L96 96 L4 96 Z" fill={p.propDark} opacity={0.4} />
    </g>
    <Speckle p={p} points={[[24,66],[48,70],[68,62],[58,52]]} r={2} opacity={0.25} />
  </g>
);

/** Small rounded beach stone. */
export const BeachRockSmall: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={30} ry={4} />
    <g {...ink(p)}>
      <path d="M12 96 Q6 74 26 62 Q50 50 70 64 Q88 76 84 96 Z" fill={p.propMid} />
      <Lit d="M26 62 Q50 50 70 64 Q50 70 36 80 Q28 70 26 62 Z" p={p} opacity={0.38} />
    </g>
    <path d="M36 80 Q40 88 38 96" {...detail(p.ink, 1.2, 0.3)} />
  </g>
);

/** Bleached driftwood with splits and knots. */
export const Driftwood: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={46} ry={4} cy={94} />
    <g {...ink(p)}>
      <path d="M2 72 Q28 46 54 66 Q76 82 98 56 L98 82 Q76 98 54 88 Q28 70 2 92 Z" fill={p.propMid} />
      <Lit d="M2 72 Q28 46 54 66 Q76 82 98 56 Q76 70 54 76 Q28 60 2 80 Z" p={p} opacity={0.38} />
    </g>
    <g {...detail(p.ink, 1.3, 0.4)}>
      <path d="M18 72 Q22 80 18 88 M42 68 Q46 78 42 86 M70 78 Q74 86 70 92" />
    </g>
    <ellipse cx={34} cy={74} rx={3} ry={2} fill={p.propDark} opacity={0.6} />
  </g>
);

/** Cluster of shells in the sand. */
export const ShellCluster: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={34} ry={4} />
    <g {...ink(p, 1.8)}>
      {/* fan shell */}
      <path d="M46 94 Q14 78 20 48 Q26 20 46 20 Q66 20 72 48 Q78 78 46 94 Z" fill={p.propLight} />
      <g {...detail(p.ink, 1.3, 0.4)}>
        <path d="M46 92 Q34 62 30 30 M46 92 Q46 58 46 22 M46 92 Q58 62 62 30" />
      </g>
      <Shade d="M46 94 Q14 78 20 48 Q32 70 46 94 Z" p={p} opacity={0.22} />
      {/* small spiral shell */}
      <path d="M80 94 Q62 88 66 74 Q70 62 82 64 Q92 66 90 78 Q88 88 80 94 Z" fill={p.propMid} />
      <path d="M80 86 Q74 82 76 76 Q80 72 84 76" {...detail(p.ink, 1.2, 0.5)} />
      {/* clam */}
      <path d="M10 94 Q0 86 6 76 Q14 68 24 76 Q30 86 20 94 Z" fill={p.propLight} />
      <path d="M12 92 Q14 82 16 76 M18 92 Q19 82 20 76" {...detail(p.ink, 1.1, 0.4)} />
    </g>
  </g>
);

/** Beach umbrella, striped canopy on a tilted pole. */
export const BeachUmbrella: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={20} ry={4} />
    <g {...ink(p)}>
      <path d="M52 96 L46 34" fill="none" stroke={p.propDark} strokeWidth={4} />
      <path d="M6 38 Q10 6 46 4 Q82 6 86 38 Q46 48 6 38 Z" fill={p.propLight} />
      <path d="M46 4 Q30 6 20 38 Q33 42 46 44 Z" fill={p.propMid} />
      <path d="M46 4 Q62 6 72 38 Q59 42 46 44 Z" fill={p.propMid} />
      <circle cx={46} cy={4} r={3.2} fill={p.propDark} />
    </g>
    <g {...detail(p.ink, 1.2, 0.35)}>
      <path d="M20 38 Q33 42 46 44 M72 38 Q59 42 46 44" />
    </g>
  </g>
);

/** Tidepool ringed with wet stones. */
export const Tidepool: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p)}>
      <ellipse cx={50} cy={76} rx={44} ry={18} fill={p.propDark} />
      <ellipse cx={50} cy={74} rx={35} ry={13} fill="#6fc3dd" opacity={0.75} stroke="none" />
    </g>
    <g {...detail("#ffffff", 1.5, 0.45)}>
      <path d="M28 70 Q38 66 50 70 M54 80 Q64 76 72 80" />
    </g>
    <g {...ink(p, 1.6)} fill={p.propMid}>
      <path d="M2 82 L8 68 L20 66 L24 80 Z" />
      <path d="M78 78 L86 64 L96 68 L96 84 Z" />
      <path d="M40 92 L48 86 L58 90 L54 96 L42 96 Z" />
    </g>
  </g>
);

/** Starfish resting on the sand. */
export const Starfish: PropComponent = ({ p }) => {
  const arms = [-90, -18, 54, 126, 198];
  const pts = arms
    .map((a) => {
      const r = (a * Math.PI) / 180;
      return `${50 + Math.cos(r) * 42} ${64 + Math.sin(r) * 34}`;
    })
    .join(" L");
  return (
    <g>
      <Ground p={p} rx={28} ry={4} cy={92} />
      <g {...ink(p, 2)}>
        <path d={`M${pts} Z`} fill={p.propLight} />
      </g>
      <Speckle p={p} points={[[50,58],[40,64],[60,64],[50,72],[44,50],[58,50]]} r={2.4} color={p.propMid} opacity={0.7} />
    </g>
  );
};

/** Dune grass: stiff upright blades in a sandy clump. */
export const DuneGrass: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={28} ry={4} />
    <g {...ink(p, 1.9)} fill="none">
      {[18, 30, 42, 54, 66, 80].map((x, i) => (
        <path
          key={i}
          d={`M${x} 98 Q${x + (i % 2 ? 14 : -14)} 56 ${x + (i % 2 ? -6 : 6)} 10`}
          stroke={i % 2 ? p.propMid : p.propDark}
          strokeWidth={4}
        />
      ))}
    </g>
    <path d="M10 92 Q50 86 90 92" {...detail(p.propLight, 2, 0.4)} />
  </g>
);

/** Branching coral washed up above the tide line. */
export const Coral: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={4} />
    <g {...ink(p, 2)} fill="none" strokeLinecap="round">
      <path d="M50 96 L50 62" stroke={p.propMid} strokeWidth={7} />
      <path d="M50 70 Q36 62 30 40 M50 62 Q64 54 72 32 M50 80 Q38 74 32 60 M50 74 Q62 68 68 54" stroke={p.propMid} strokeWidth={5.5} />
      <path d="M30 40 Q26 30 28 20 M72 32 Q78 22 76 12 M32 60 Q28 52 30 44 M68 54 Q74 46 72 38" stroke={p.propLight} strokeWidth={4} />
    </g>
  </g>
);
