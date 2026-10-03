import type { Pokemon } from "@/lib/pokemon";

import type { PlacedMon, PlacedProp, Theme } from "./types";

/** Deterministic RNG so a seed reproduces a scene exactly. */
export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Depth scale at a given baseline. Near the horizon things are small. */
export function depthScale(
  y: number,
  sceneH: number,
  horizon: number,
  min = 0.45,
  max = 1.15
): number {
  const horizonY = sceneH * horizon;
  const t = Math.max(0, Math.min(1, (y - horizonY) / (sceneH - horizonY)));
  // Squared falloff reads as more convincing recession than a linear ramp.
  return min + (max - min) * t * t;
}

/**
 * Paint order. Everything — props and Pokemon alike — sorts by its baseline,
 * so a mon standing in front of a bush paints over it and a mon standing
 * behind one is painted over. Foreground props get a large bias so they
 * always sit in front and do the hiding.
 */
export function baselineZ(y: number, layer: "mid" | "fore" | "mon"): number {
  const base = Math.round(y);
  if (layer === "fore") return base + 100_000;
  return base;
}

function weightedPool<T extends { weight: number }>(specs: T[]): T[] {
  const pool: T[] = [];
  for (const s of specs) {
    for (let i = 0; i < s.weight; i++) pool.push(s);
  }
  return pool;
}

export function generateProps(
  theme: Theme,
  sceneW: number,
  sceneH: number,
  seed: number,
  densityMultiplier: number
): PlacedProp[] {
  const rng = mulberry32(seed);
  const horizonY = sceneH * theme.horizon;
  const groundArea = (sceneW * (sceneH - horizonY)) / 1_000_000;
  const count = Math.round(theme.propDensity * groundArea * densityMultiplier);

  const pool = weightedPool(theme.props);
  const out: PlacedProp[] = [];

  for (let i = 0; i < count; i++) {
    const spec = pool[Math.floor(rng() * pool.length)];
    const width = spec.minW + rng() * (spec.maxW - spec.minW);
    const ratio = spec.minRatio + rng() * (spec.maxRatio - spec.minRatio);
    const height = width * ratio;

    // Bias placement toward the foreground so the horizon doesn't get cluttered.
    const yT = Math.sqrt(rng());
    const y = horizonY + (sceneH - horizonY) * yT;
    const x = rng() * sceneW;

    out.push({
      kind: "prop",
      id: `prop-${i}`,
      prop: spec.prop,
      layer: spec.layer,
      x,
      y,
      width,
      height,
      scale: depthScale(y, sceneH, theme.horizon),
      flipX: rng() > 0.5,
      z: baselineZ(y, spec.layer),
    });
  }

  return out;
}

export interface MonPlacementConfig {
  targets: Pokemon[];
  decoys: Pokemon[];
  sceneW: number;
  sceneH: number;
  theme: Theme;
  seed: number;
  /** Unscaled sprite box; depth scale is applied on top. */
  baseSize: number;
}

/**
 * Uniform grid for neighbour lookups, so rejection sampling stays linear
 * instead of comparing every candidate against every placed Pokemon.
 */
class SpatialHash {
  private readonly cells = new Map<string, { x: number; y: number; r: number }[]>();

  constructor(private readonly cellSize: number) {}

  private key(x: number, y: number) {
    return `${Math.floor(x / this.cellSize)}:${Math.floor(y / this.cellSize)}`;
  }

  insert(x: number, y: number, r: number) {
    const k = this.key(x, y);
    const bucket = this.cells.get(k);
    if (bucket) bucket.push({ x, y, r });
    else this.cells.set(k, [{ x, y, r }]);
  }

  /**
   * Distance to the nearest placed neighbour, as a multiple of the two radii
   * combined. 1 means just touching, >1 means clear air, Infinity means empty.
   * Returning the margin rather than a boolean lets the caller keep the
   * roomiest candidate instead of the first one it happened to try.
   */
  clearance(x: number, y: number, r: number): number {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    let best = Infinity;

    for (let gx = cx - 1; gx <= cx + 1; gx++) {
      for (let gy = cy - 1; gy <= cy + 1; gy++) {
        const bucket = this.cells.get(`${gx}:${gy}`);
        if (!bucket) continue;
        for (const other of bucket) {
          const dx = x - other.x;
          const dy = y - other.y;
          const sum = r + other.r;
          if (sum <= 0) continue;
          const ratio = Math.hypot(dx, dy) / sum;
          if (ratio < best) best = ratio;
        }
      }
    }
    return best;
  }
}

/** Candidate positions tried per Pokemon before the spacing requirement relaxes. */
const PLACEMENT_ATTEMPTS = 28;
/** Centres must be this much further apart than the two radii combined. */
const SPACING = 1.08;
/** Floor the relaxation can reach, so a crowded plate still never truly stacks. */
const MIN_SPACING = 0.82;

/**
 * Places Pokemon in loose clusters with guaranteed breathing room.
 *
 * Candidates are drawn from cluster centres so the plate still reads as a
 * crowd rather than a grid, but every candidate is rejection-sampled against
 * what is already placed. Without that check — which is how this behaved
 * before — a Gaussian scatter puts sprites directly on top of each other near
 * the cluster centres, and overlapping sprites can't be told apart or clicked.
 *
 * Targets share the clusters with decoys so they can't be found by spotting
 * the odd one out.
 */
export function placeMons({
  targets,
  decoys,
  sceneW,
  sceneH,
  theme,
  seed,
  baseSize,
}: MonPlacementConfig): PlacedMon[] {
  const rng = mulberry32(seed ^ 0x9e3779b9);
  const horizonY = sceneH * theme.horizon;
  const all = [
    ...targets.map((p) => ({ pokemon: p, isTarget: true })),
    ...decoys.map((p) => ({ pokemon: p, isTarget: false })),
  ];

  // Cluster centres, roughly one per 14 mons, biased to the foreground.
  const clusterCount = Math.max(3, Math.round(all.length / 14));
  const clusters = Array.from({ length: clusterCount }, () => {
    const yT = Math.sqrt(rng());
    return {
      cx: rng() * sceneW,
      cy: horizonY + (sceneH - horizonY) * yT,
      spread: 140 + rng() * 240,
    };
  });

  // Shuffle so targets don't land in a predictable slice of the clusters.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  const maxRadius = (baseSize * 1.2) / 2;
  const hash = new SpatialHash(maxRadius * 2.5);
  const out: PlacedMon[] = [];
  const margin = baseSize * 0.6;

  all.forEach((entry, i) => {
    let placed: { x: number; y: number; scale: number } | null = null;
    // Roomiest candidate seen so far, used when none clears the bar outright.
    let best: { x: number; y: number; scale: number; clear: number } | null = null;

    for (let attempt = 0; attempt < PLACEMENT_ATTEMPTS; attempt++) {
      // Most candidates join a cluster; the rest scatter, so clusters don't
      // read as islands on an empty field.
      let x: number;
      let y: number;

      if (rng() < 0.78) {
        const c = clusters[Math.floor(rng() * clusters.length)];
        const u = Math.max(rng(), 1e-6);
        const v = rng();
        const r = Math.sqrt(-2 * Math.log(u)) * c.spread * 0.5;
        x = c.cx + r * Math.cos(2 * Math.PI * v);
        y = c.cy + r * Math.sin(2 * Math.PI * v) * 0.6;
      } else {
        x = rng() * sceneW;
        y = horizonY + (sceneH - horizonY) * Math.sqrt(rng());
      }

      x = Math.max(margin, Math.min(sceneW - margin, x));
      y = Math.max(horizonY + margin, Math.min(sceneH - margin * 0.5, y));

      const scale = depthScale(y, sceneH, theme.horizon, 0.55, 1.2);
      const radius = (baseSize * scale) / 2;

      // Relax the requirement as attempts run out rather than giving up, so a
      // dense plate degrades to "tight" instead of to "stacked".
      const t = attempt / PLACEMENT_ATTEMPTS;
      const padding = SPACING - (SPACING - MIN_SPACING) * t;

      const clear = hash.clearance(x, y, radius);

      if (!best || clear > best.clear) best = { x, y, scale, clear };

      if (clear >= padding) {
        placed = { x, y, scale };
        break;
      }
    }

    // Falling back to the roomiest candidate, rather than the first one tried,
    // is what keeps a crowded plate from degenerating into literal stacks.
    const final = placed ?? best!;
    hash.insert(final.x, final.y, (baseSize * final.scale) / 2);

    out.push({
      kind: "mon",
      id: `mon-${entry.pokemon.id}-${i}`,
      pokemon: entry.pokemon,
      isTarget: entry.isTarget,
      x: final.x,
      y: final.y,
      width: baseSize,
      height: baseSize,
      scale: final.scale,
      flipX: rng() > 0.5,
      z: baselineZ(final.y, "mon"),
    });
  });

  return out;
}
