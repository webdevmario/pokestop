import type { Theme } from "./types";

interface Props {
  theme: Theme;
  width: number;
  height: number;
}

/**
 * Background layer: sky, distant ridges, ground plane, and the atmospheric
 * depth that sells the recession.
 *
 * Ids here are safe to use — exactly one backdrop renders per scene, unlike
 * the props, which render in the hundreds and so avoid ids entirely.
 */
function Backdrop({ theme, width, height }: Props) {
  const { palette: p, horizon } = theme;
  const horizonY = height * horizon;
  const uid = theme.id;

  /** A rolling ridge so the horizon is never a ruler-straight line. */
  const ridge = (amplitude: number, lift: number, phase: number) => {
    const pts: string[] = [`0 ${horizonY}`];
    const steps = 14;
    for (let i = 0; i <= steps; i++) {
      const x = (width / steps) * i;
      const y =
        horizonY - lift - Math.sin((i / steps) * Math.PI * 2.4 + phase) * amplitude;
      pts.push(`${x} ${y}`);
    }
    pts.push(`${width} ${horizonY}`);
    return `M${pts.join(" L")} Z`;
  };

  const rays = theme.id === "forest" || theme.id === "cave";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={`ground-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.ground[0]} />
          <stop offset="100%" stopColor={p.ground[1]} />
        </linearGradient>
        {/*
          Atmospheric perspective: distance washes toward the sky's colour and
          loses contrast. Strongest at the horizon, gone by the foreground.
        */}
        <linearGradient id={`haze-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.atmosphere} stopOpacity={0.85} />
          <stop offset="35%" stopColor={p.atmosphere} stopOpacity={0.4} />
          <stop offset="100%" stopColor={p.atmosphere} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0" r="0.8">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={width} height={horizonY} fill={`url(#sky-${uid})`} />
      <rect x={0} y={0} width={width} height={horizonY} fill={`url(#glow-${uid})`} />

      {/* Two ridge bands: the far one hazier, which reads as depth. */}
      <path d={ridge(26, 30, uid.length)} fill={p.distant} opacity={0.5} />
      <path d={ridge(16, 10, uid.length + 2)} fill={p.distant} />

      <rect
        x={0}
        y={horizonY}
        width={width}
        height={height - horizonY}
        fill={`url(#ground-${uid})`}
      />

      {/* Ground texture: long strokes that compress toward the horizon. */}
      {Array.from({ length: 9 }).map((_, i) => {
        const t = (i + 1) / 10;
        const y = horizonY + (height - horizonY) * t * t;
        return (
          <path
            key={i}
            d={`M0 ${y} Q${width / 2} ${y - 14 * t} ${width} ${y}`}
            fill="none"
            stroke={p.ink}
            strokeWidth={1}
            opacity={0.06}
          />
        );
      })}

      {rays && (
        <g opacity={0.14}>
          {[0.12, 0.34, 0.58, 0.8].map((at, i) => {
            const x = width * at;
            const spread = width * 0.06;
            return (
              <path
                key={i}
                d={`M${x} 0 L${x + spread} 0 L${x + spread * 2.4} ${horizonY * 1.9} L${x - spread * 0.6} ${horizonY * 1.9} Z`}
                fill="#ffffff"
              />
            );
          })}
        </g>
      )}

      {/* Haze sits over the ground near the horizon, under every prop. */}
      <rect
        x={0}
        y={horizonY - 8}
        width={width}
        height={(height - horizonY) * 0.55}
        fill={`url(#haze-${uid})`}
      />
    </svg>
  );
}

export default Backdrop;
