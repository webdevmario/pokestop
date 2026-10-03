import { Ground, Lit, PropComponent, Shade, Speckle, detail, ink } from "./shared";

/** Jagged lava rock with glowing fissures running through it. */
export const LavaRockJagged: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={40} ry={5} />
    <g {...ink(p)}>
      <path d="M2 96 L8 46 L30 12 L70 16 L92 50 L98 96 Z" fill={p.propDark} />
      <Shade d="M30 12 L44 54 L92 50 L70 16 Z" p={p} opacity={0} />
      <path d="M30 12 L44 54 L92 50 L70 16 Z" fill={p.propMid} opacity={0.55} stroke="none" />
    </g>
    <g strokeLinecap="round" fill="none">
      <path d="M22 66 Q38 40 52 68 Q62 88 42 94" stroke={p.propLight} strokeWidth={3.6} opacity={0.95} />
      <path d="M58 32 Q70 50 62 66" stroke={p.propLight} strokeWidth={2.6} opacity={0.75} />
      <path d="M76 70 Q82 80 78 92" stroke={p.propLight} strokeWidth={2.2} opacity={0.6} />
      <path d="M22 66 Q38 40 52 68" stroke="#fff6c9" strokeWidth={1.3} opacity={0.5} />
    </g>
  </g>
);

/** Rounded, cooled lava boulder with a crusted surface. */
export const LavaRockRound: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={38} ry={5} />
    <g {...ink(p)}>
      <path d="M6 96 Q0 58 26 38 Q56 18 80 42 Q100 62 94 96 Z" fill={p.propDark} />
      <path d="M26 38 Q56 18 80 42 Q56 48 36 66 Q28 50 26 38 Z" fill={p.propMid} opacity={0.5} stroke="none" />
    </g>
    <g {...detail(p.propLight, 2.2, 0.75)}>
      <path d="M20 72 Q38 64 50 76 M56 60 Q70 58 82 66" />
    </g>
    <Speckle p={p} points={[[30,82],[46,88],[64,80],[76,86]]} r={1.8} color={p.propLight} opacity={0.45} />
  </g>
);

/** Shattered lava shards, low and sharp. */
export const LavaShards: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={42} ry={4} />
    <g {...ink(p, 2)}>
      <path d="M8 96 L18 56 L30 96 Z" fill={p.propDark} />
      <path d="M30 96 L46 42 L60 96 Z" fill={p.propDark} />
      <path d="M58 96 L72 60 L86 96 Z" fill={p.propDark} />
      <path d="M18 56 L24 96 L30 96 Z" fill={p.propMid} opacity={0.5} stroke="none" />
      <path d="M46 42 L52 96 L60 96 Z" fill={p.propMid} opacity={0.5} stroke="none" />
    </g>
    <g {...detail(p.propLight, 2, 0.7)}>
      <path d="M44 70 L50 84 M70 76 L74 88" />
    </g>
  </g>
);

/** Obsidian spire: tall, glassy, sharp-edged. */
export const ObsidianSpire: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={22} ry={4} />
    <g {...ink(p, 2.2)}>
      <path d="M34 96 L28 40 L48 2 L62 36 L72 26 L74 96 Z" fill={p.propDark} />
      <path d="M48 2 L48 96 L34 96 L28 40 Z" fill={p.propMid} opacity={0.45} stroke="none" />
    </g>
    <g {...detail("#ffffff", 1.6, 0.3)}>
      <path d="M40 24 L44 58 M54 42 L58 72" />
    </g>
    <path d="M32 62 L64 54" {...detail(p.propLight, 1.6, 0.4)} />
  </g>
);

/** Hexagonal basalt columns in a stepped cluster. */
export const BasaltColumns: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={38} ry={5} />
    <g {...ink(p)}>
      <path d="M16 96 L18 38 L32 28 L46 36 L44 96 Z" fill={p.propMid} />
      <path d="M18 38 L32 28 L46 36 L32 46 Z" fill={p.propLight} opacity={0.4} stroke="none" />
      <path d="M44 96 L46 18 L60 8 L74 16 L72 96 Z" fill={p.propMid} />
      <path d="M46 18 L60 8 L74 16 L60 26 Z" fill={p.propLight} opacity={0.45} stroke="none" />
      <path d="M72 96 L74 52 L86 44 L96 52 L94 96 Z" fill={p.propDark} />
      <path d="M74 52 L86 44 L96 52 L86 60 Z" fill={p.propMid} opacity={0.5} stroke="none" />
    </g>
    <g {...detail(p.ink, 1.3, 0.35)}>
      <path d="M24 56 L38 56 M24 74 L38 74 M52 40 L66 40 M52 62 L66 62 M78 68 L90 68" />
    </g>
  </g>
);

/** Cooled lava flow: a ropy crust with heat still showing in the seams. */
export const LavaFlow: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p)}>
      <path d="M0 96 Q18 72 40 76 Q62 80 76 68 Q90 56 100 60 L100 96 Z" fill={p.propDark} />
      <path d="M0 96 Q18 72 40 76 Q62 80 76 68 Q60 86 36 86 Q14 86 0 96 Z" fill={p.propMid} opacity={0.5} stroke="none" />
    </g>
    <g fill="none" strokeLinecap="round">
      <path d="M6 92 Q26 80 46 84 Q68 88 84 74" stroke={p.propLight} strokeWidth={3.4} opacity={0.85} />
      <path d="M14 96 Q34 88 52 92" stroke={p.propLight} strokeWidth={2.2} opacity={0.6} />
      <path d="M6 92 Q26 80 46 84" stroke="#fff6c9" strokeWidth={1.2} opacity={0.45} />
    </g>
  </g>
);

/** Molten pool with a bright core and crusted rim. */
export const MoltenPool: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p)}>
      <ellipse cx={50} cy={76} rx={46} ry={19} fill={p.propDark} />
      <ellipse cx={50} cy={75} rx={37} ry={13} fill={p.propLight} stroke="none" />
      <ellipse cx={50} cy={74} rx={24} ry={8} fill="#ffd98a" stroke="none" opacity={0.9} />
    </g>
    <ellipse cx={50} cy={74} rx={54} ry={24} fill={p.propLight} opacity={0.12} stroke="none" />
    <g {...detail(p.ink, 1.6, 0.4)}>
      <path d="M18 70 Q28 66 38 70 M62 82 Q72 78 82 82" />
    </g>
  </g>
);

/** Ash mound with drifted ridges. */
export const AshMound: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p, 2)}>
      <path d="M2 96 Q22 62 50 58 Q78 62 98 96 Z" fill={p.propMid} />
      <Lit d="M2 96 Q22 62 50 58 L50 96 Z" p={p} opacity={0.22} />
    </g>
    <g {...detail(p.propLight, 1.5, 0.4)}>
      <path d="M24 86 Q32 78 40 84 M56 82 Q66 74 74 82 M38 94 Q48 88 58 94" />
    </g>
    <Speckle p={p} points={[[30,72],[52,68],[68,76]]} r={1.6} opacity={0.3} />
  </g>
);

/** Floating ember cluster with a hot core. */
export const EmberCluster: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p, 1.8)}>
      <path
        d="M50 96 Q20 72 36 42 Q40 62 52 50 Q44 22 68 2 Q60 38 80 48 Q96 74 50 96 Z"
        fill={p.propMid}
        opacity={0.92}
      />
      <path d="M50 88 Q32 72 44 52 Q48 68 58 56 Q62 76 50 88 Z" fill={p.propLight} stroke="none" />
    </g>
    <path d="M50 80 Q42 68 50 58" fill="none" stroke="#fff6c9" strokeWidth={1.6} opacity={0.55} />
    <g fill={p.propLight} opacity={0.6} stroke="none">
      <circle cx={26} cy={34} r={2.4} />
      <circle cx={80} cy={26} r={2} />
      <circle cx={68} cy={14} r={1.6} />
    </g>
  </g>
);

/** Scorched dead tree, charcoal black with ember glow at the base. */
export const ScorchedTree: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={5} />
    <g {...ink(p, 2)} fill="none" strokeLinecap="round">
      <path d="M46 96 Q50 64 50 40" stroke={p.propDark} strokeWidth={8} />
      <path d="M50 50 Q34 42 24 22 M50 40 Q66 34 76 14 M48 66 Q36 60 30 50" stroke={p.propDark} strokeWidth={5} />
      <path d="M24 22 Q16 16 10 14 M76 14 Q84 8 90 8" stroke={p.propDark} strokeWidth={2.8} />
    </g>
    <g {...detail(p.propLight, 2, 0.7)}>
      <path d="M44 92 Q50 84 54 90" />
    </g>
  </g>
);

/** Steaming vent: a cracked cone with heat escaping. */
export const SmokeVent: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={32} ry={5} />
    <g {...ink(p)}>
      <path d="M12 96 Q26 56 40 52 L62 52 Q76 56 90 96 Z" fill={p.propDark} />
      <path d="M12 96 Q26 56 40 52 L48 52 L40 96 Z" fill={p.propMid} opacity={0.5} stroke="none" />
      <ellipse cx={51} cy={52} rx={12} ry={5} fill={p.propLight} opacity={0.9} />
    </g>
    <g fill={p.propLight} opacity={0.2} stroke="none">
      <circle cx={48} cy={38} r={8} />
      <circle cx={56} cy={24} r={10} />
      <circle cx={46} cy={10} r={12} />
    </g>
    <g {...detail(p.propLight, 2, 0.6)}>
      <path d="M30 84 Q38 76 44 82" />
    </g>
  </g>
);

/** Cracked crust plate, hairline heat showing between the slabs. */
export const CooledCrust: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p, 2)}>
      <path d="M2 96 L6 74 L34 66 L68 70 L96 76 L98 96 Z" fill={p.propDark} />
      <path d="M6 74 L34 66 L68 70 L40 80 Z" fill={p.propMid} opacity={0.45} stroke="none" />
    </g>
    <g fill="none" strokeLinecap="round">
      <path d="M22 96 L30 76 M52 96 L48 72 M76 96 L70 74" stroke={p.propLight} strokeWidth={2.2} opacity={0.65} />
      <path d="M8 84 L92 88" stroke={p.propLight} strokeWidth={1.6} opacity={0.4} />
    </g>
  </g>
);
