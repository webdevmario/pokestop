import { Ground, Lit, PropComponent, Shade, detail, ink } from "./shared";

/** Rounded headstone with a carved cross and weathered base. */
export const TombRounded: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={30} ry={5} />
    <g {...ink(p)}>
      <path d="M12 92 L88 92 L92 98 L8 98 Z" fill={p.propDark} />
      <path d="M18 92 L18 34 Q18 8 50 8 Q82 8 82 34 L82 92 Z" fill={p.propMid} />
      <Lit d="M18 34 Q18 8 50 8 L50 92 L18 92 Z" p={p} opacity={0.18} />
      <path d="M50 26 L50 66 M34 42 L66 42" fill="none" stroke={p.propDark} strokeWidth={5} />
    </g>
    <g {...detail(p.ink, 1.2, 0.3)}>
      <path d="M26 74 L74 74 M30 82 L70 82" />
    </g>
  </g>
);

/** Celtic-style cross headstone. */
export const TombCross: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={5} />
    <g {...ink(p)}>
      <path d="M22 92 L78 92 L82 98 L18 98 Z" fill={p.propDark} />
      <path d="M38 92 L38 60 L62 60 L62 92 Z" fill={p.propMid} />
      <path d="M42 60 L42 30 L58 30 L58 60 Z" fill={p.propMid} />
      <path d="M22 30 L78 30 L78 46 L22 46 Z" fill={p.propMid} />
      <path d="M42 4 L58 4 L58 32 L42 32 Z" fill={p.propMid} />
      <circle cx={50} cy={38} r={16} fill="none" stroke={p.ink} strokeWidth={3} />
      <Lit d="M42 4 L50 4 L50 92 L38 92 L38 60 L42 60 Z" p={p} opacity={0.2} />
    </g>
  </g>
);

/** Broken slab, top sheared away and leaning. */
export const TombBroken: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={30} ry={5} />
    <g {...ink(p)}>
      <path d="M14 92 L86 92 L90 98 L10 98 Z" fill={p.propDark} />
      <path d="M22 92 L24 40 L52 28 L58 54 L74 50 L76 92 Z" fill={p.propMid} />
      <Lit d="M24 40 L52 28 L58 54 L30 62 Z" p={p} opacity={0.2} />
      <Shade d="M58 54 L74 50 L76 92 L60 92 Z" p={p} opacity={0.24} />
    </g>
    <g {...detail(p.ink, 1.3, 0.35)}>
      <path d="M34 66 L62 62 M32 78 L66 76" />
    </g>
  </g>
);

/** Gnarled bare tree with forked, clawing branches. */
export const BareTreeGnarled: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={28} ry={5} />
    <g {...ink(p, 2)} fill="none" strokeLinecap="round">
      <path d="M44 96 Q48 66 50 44" stroke={p.propDark} strokeWidth={9} />
      <path d="M50 52 Q34 42 22 20 M50 44 Q66 36 78 14 M47 68 Q34 60 26 46 M50 36 Q56 24 54 8" stroke={p.propDark} strokeWidth={5.5} />
      <path d="M22 20 Q16 12 8 8 M78 14 Q86 8 94 6 M26 46 Q18 40 12 38 M54 8 Q50 4 44 2 M78 14 Q80 4 76 0" stroke={p.propDark} strokeWidth={3} />
    </g>
    <path d="M46 92 Q50 68 51 48" {...detail(p.propLight, 1.4, 0.28)} />
  </g>
);

/** Leaning dead tree, trunk split near the base. */
export const BareTreeLeaning: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={5} />
    <g {...ink(p, 2)} fill="none" strokeLinecap="round">
      <path d="M56 96 Q52 64 40 38" stroke={p.propDark} strokeWidth={8} />
      <path d="M44 48 Q30 40 20 24 M42 40 Q56 28 62 10 M48 62 Q36 58 28 48" stroke={p.propDark} strokeWidth={5} />
      <path d="M20 24 Q12 18 6 16 M62 10 Q68 2 74 0" stroke={p.propDark} strokeWidth={2.8} />
      <path d="M56 96 Q58 84 54 76" stroke={p.propDark} strokeWidth={4} />
    </g>
  </g>
);

/** Small mausoleum with a pedimented roof and barred door. */
export const Mausoleum: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={44} ry={5} />
    <g {...ink(p)}>
      <path d="M8 96 L8 44 L92 44 L92 96 Z" fill={p.propMid} />
      <path d="M2 46 L50 12 L98 46 Z" fill={p.propDark} />
      <Lit d="M2 46 L50 12 L50 46 Z" p={p} opacity={0.25} />
      <path d="M36 96 L36 58 Q50 50 64 58 L64 96 Z" fill={p.propDark} />
      <path d="M20 96 L20 52 L28 52 L28 96 Z" fill={p.propLight} opacity={0.5} />
      <path d="M72 96 L72 52 L80 52 L80 96 Z" fill={p.propLight} opacity={0.5} />
    </g>
    <g {...detail(p.propLight, 1.4, 0.45)}>
      <path d="M44 62 L44 94 M50 60 L50 94 M56 62 L56 94" />
    </g>
    <path d="M8 44 L92 44" {...detail(p.ink, 2, 0.5)} />
  </g>
);

/** Stone crypt: low vault with a sealed entrance. */
export const Crypt: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={46} ry={5} />
    <g {...ink(p)}>
      <path d="M6 96 L6 54 Q50 24 94 54 L94 96 Z" fill={p.propMid} />
      <Lit d="M6 54 Q50 24 94 54 Q50 44 6 70 Z" p={p} opacity={0.22} />
      <path d="M36 96 L36 64 Q50 56 64 64 L64 96 Z" fill={p.propDark} />
      <path d="M50 70 L50 86" fill="none" stroke={p.propLight} strokeWidth={2.4} opacity={0.5} />
    </g>
    <g {...detail(p.ink, 1.3, 0.3)}>
      <path d="M14 76 L30 76 M70 76 L88 76 M14 86 L30 86 M70 86 L88 86" />
    </g>
  </g>
);

/** Wrought-iron fence section with spear finials. */
export const IronFence: PropComponent = ({ p }) => {
  const bars = [12, 28, 44, 60, 76, 92];
  return (
    <g>
      <Ground p={p} rx={46} ry={4} />
      <g {...ink(p, 2.2)} fill="none" strokeLinecap="round">
        <path d="M4 44 L96 44 M4 74 L96 74" stroke={p.propMid} strokeWidth={4} />
        {bars.map((x) => (
          <g key={x}>
            <path d={`M${x} 96 L${x} 22`} stroke={p.propMid} strokeWidth={4} />
            <path d={`M${x - 5} 22 L${x} 10 L${x + 5} 22 Z`} fill={p.propLight} stroke={p.ink} strokeWidth={2} />
          </g>
        ))}
      </g>
    </g>
  );
};

/** Cluster of melted candles with flames. */
export const CandleCluster: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={26} ry={4} />
    <g {...ink(p, 1.8)}>
      <path d="M18 96 Q16 68 22 62 L34 62 Q40 68 38 96 Z" fill={p.propLight} />
      <path d="M44 96 Q42 54 48 46 L60 46 Q66 54 64 96 Z" fill={p.propLight} />
      <path d="M68 96 Q66 76 72 70 L82 70 Q88 76 86 96 Z" fill={p.propLight} />
    </g>
    <g stroke="none">
      <path d="M28 62 Q24 54 28 48 Q32 54 28 62 Z" fill="#ffd27a" />
      <path d="M54 46 Q49 36 54 28 Q59 36 54 46 Z" fill="#ffd27a" />
      <path d="M77 70 Q73 62 77 56 Q81 62 77 70 Z" fill="#ffd27a" />
      <circle cx={28} cy={52} r={6} fill="#ffd27a" opacity={0.22} />
      <circle cx={54} cy={34} r={8} fill="#ffd27a" opacity={0.22} />
      <circle cx={77} cy={60} r={6} fill="#ffd27a" opacity={0.22} />
    </g>
    <g {...detail(p.ink, 1.1, 0.3)}>
      <path d="M22 76 Q28 72 34 76 M48 62 Q54 58 60 62" />
    </g>
  </g>
);

/** Weathered statue of a mourning figure, one arm broken off. */
export const BrokenStatue: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={30} ry={5} />
    <g {...ink(p)}>
      <path d="M22 96 L22 82 L78 82 L78 96 Z" fill={p.propDark} />
      <path d="M30 82 L34 72 L66 72 L70 82 Z" fill={p.propMid} />
      <path d="M38 72 Q34 46 44 34 L58 34 Q66 46 62 72 Z" fill={p.propMid} />
      <Lit d="M38 72 Q34 46 44 34 L50 34 L50 72 Z" p={p} opacity={0.22} />
      <circle cx={50} cy={24} r={11} fill={p.propMid} />
      <path d="M58 40 Q70 46 72 58" fill="none" stroke={p.propMid} strokeWidth={6} />
      <path d="M42 40 Q34 44 32 52" fill="none" stroke={p.propMid} strokeWidth={6} />
    </g>
    <g {...detail(p.ink, 1.3, 0.4)}>
      <path d="M44 50 Q50 54 56 50 M42 62 Q50 66 58 62" />
    </g>
  </g>
);

/** Iron lantern on a hooked post. */
export const Lantern: PropComponent = ({ p }) => (
  <g>
    <Ground p={p} rx={18} ry={4} />
    <g {...ink(p, 2)}>
      <path d="M46 96 L46 20 Q46 12 56 12 L66 12" fill="none" stroke={p.propMid} strokeWidth={5} />
      <path d="M58 24 L74 24 L78 48 L54 48 Z" fill={p.propDark} />
      <path d="M62 28 L70 28 L72 44 L60 44 Z" fill="#ffd27a" opacity={0.85} stroke="none" />
      <path d="M56 22 L76 22 L80 18 L52 18 Z" fill={p.propMid} />
      <circle cx={66} cy={36} r={13} fill="#ffd27a" opacity={0.16} stroke="none" />
    </g>
    <g {...detail(p.ink, 1.2, 0.4)}>
      <path d="M48 84 L48 40 M44 60 L48 60" />
    </g>
  </g>
);

/** Low grave mound with a simple marker. */
export const GraveMound: PropComponent = ({ p }) => (
  <g>
    <g {...ink(p)}>
      <path d="M4 96 Q24 70 50 68 Q76 70 96 96 Z" fill={p.propMid} />
      <Lit d="M4 96 Q24 70 50 68 L50 96 Z" p={p} opacity={0.18} />
      <path d="M44 68 L44 44 L56 44 L56 68 Z" fill={p.propLight} />
      <path d="M34 54 L66 54 L66 62 L34 62 Z" fill={p.propLight} />
    </g>
    <g {...detail(p.ink, 1.2, 0.3)}>
      <path d="M22 86 Q34 80 44 84 M58 84 Q70 78 80 84" />
    </g>
  </g>
);
