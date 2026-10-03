import { mulberry32 } from "./layout";
import type { Theme } from "./types";

interface Props {
  theme: Theme;
  width: number;
  height: number;
  seed: number;
}

/**
 * Foliage that frames the bottom edge of the plate.
 *
 * A printed seek spread is dense right to the margin — the reader looks
 * *through* the undergrowth rather than down at a field. This band sits above
 * every Pokemon so the nearest ones are genuinely partly obscured, which is
 * the cheapest way to make the plate feel like a place rather than a canvas.
 *
 * Inert: it never takes a click, so a Pokemon behind a blade is still reachable
 * on whatever part of it remains visible.
 */
function ForegroundFrame({ theme, width, height, seed }: Props) {
  const { palette: p } = theme;
  const rng = mulberry32(seed ^ 0x5bf03635);

  const bandTop = height - Math.min(height * 0.22, 190);

  // Grass/leaf blades sweeping up from the bottom edge.
  const blades = Array.from({ length: Math.round(width / 26) }, (_, i) => {
    const x = (width / Math.round(width / 26)) * i + rng() * 18;
    const h = 60 + rng() * 150;
    const lean = (rng() - 0.5) * 90;
    const dark = rng() > 0.45;
    return { x, h, lean, dark, w: 7 + rng() * 9 };
  });

  // Broad leaves anchored at the corners, framing the view.
  const leaves = Array.from({ length: 7 }, () => {
    const fromLeft = rng() > 0.5;
    const x = fromLeft ? rng() * width * 0.3 : width - rng() * width * 0.3;
    return {
      x,
      y: height - rng() * 70,
      r: 70 + rng() * 90,
      rot: (fromLeft ? -1 : 1) * (18 + rng() * 42),
    };
  });

  const blooms = Array.from({ length: 9 }, () => ({
    x: rng() * width,
    y: height - 20 - rng() * 120,
    r: 9 + rng() * 10,
    color: p.blooms[Math.floor(rng() * p.blooms.length)],
  }));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      {/* Soft darkening at the very bottom, so the band reads as near. */}
      <rect
        x={0}
        y={bandTop}
        width={width}
        height={height - bandTop}
        fill={p.ink}
        opacity={0.1}
      />

      {leaves.map((l, i) => (
        <g key={`leaf-${i}`} transform={`rotate(${l.rot} ${l.x} ${l.y})`}>
          <path
            d={`M${l.x} ${l.y} q${-l.r * 0.5} ${-l.r * 0.7} 0 ${-l.r * 1.4} q${l.r * 0.5} ${l.r * 0.7} 0 ${l.r * 1.4} Z`}
            fill={i % 2 ? p.propDark : p.propMid}
            stroke={p.ink}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <path
            d={`M${l.x} ${l.y} L${l.x} ${l.y - l.r * 1.4}`}
            stroke={p.ink}
            strokeWidth={1.4}
            opacity={0.4}
            fill="none"
          />
        </g>
      ))}

      {blades.map((b, i) => (
        <path
          key={`blade-${i}`}
          d={`M${b.x} ${height + 6} Q${b.x + b.lean * 0.4} ${height - b.h * 0.55} ${b.x + b.lean} ${height - b.h}`}
          fill="none"
          stroke={b.dark ? p.propDark : p.propMid}
          strokeWidth={b.w}
          strokeLinecap="round"
        />
      ))}

      {blooms.map((b, i) => (
        <g key={`bloom-${i}`}>
          {[0, 72, 144, 216, 288].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle
                key={a}
                cx={b.x + Math.cos(rad) * b.r * 0.62}
                cy={b.y + Math.sin(rad) * b.r * 0.62}
                r={b.r * 0.46}
                fill={b.color}
                stroke={p.ink}
                strokeWidth={1.8}
              />
            );
          })}
          <circle cx={b.x} cy={b.y} r={b.r * 0.3} fill={p.ink} opacity={0.75} />
        </g>
      ))}
    </svg>
  );
}

export default ForegroundFrame;
