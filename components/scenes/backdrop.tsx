import type { Theme } from "./types";

interface Props {
  theme: Theme;
  width: number;
  height: number;
}

/**
 * Background layer: sky gradient, a distant silhouette band hugging the
 * horizon, and the ground plane. Everything here is behind every prop and
 * every Pokemon, and takes no clicks.
 */
function Backdrop({ theme, width, height }: Props) {
  const { palette: p, horizon } = theme;
  const horizonY = height * horizon;
  const uid = theme.id;

  // A low rolling silhouette so the horizon isn't a ruler-straight line.
  const ridge = (() => {
    const pts: string[] = [`0 ${horizonY}`];
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const x = (width / steps) * i;
      const y =
        horizonY - 18 - Math.sin((i / steps) * Math.PI * 2.2 + uid.length) * 14;
      pts.push(`${x} ${y}`);
    }
    pts.push(`${width} ${horizonY}`);
    return `M${pts.join(" L")} Z`;
  })();

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
      </defs>

      <rect x={0} y={0} width={width} height={horizonY} fill={`url(#sky-${uid})`} />
      <path d={ridge} fill={p.distant} />
      <rect
        x={0}
        y={horizonY}
        width={width}
        height={height - horizonY}
        fill={`url(#ground-${uid})`}
      />
      {/* Ground texture: a few long strokes that imply receding distance. */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = (i + 1) / 8;
        const y = horizonY + (height - horizonY) * t * t;
        return (
          <path
            key={i}
            d={`M0 ${y} Q${width / 2} ${y - 10 * t} ${width} ${y}`}
            fill="none"
            stroke={p.ink}
            strokeWidth={1}
            opacity={0.06}
          />
        );
      })}
    </svg>
  );
}

export default Backdrop;
