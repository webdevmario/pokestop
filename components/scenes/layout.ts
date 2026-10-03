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
 * Bridson's Poisson-disk sampling.
 *
 * Produces points that are uniformly scattered with a guaranteed minimum
 * separation: no clumps and, just as importantly, no dead zones. That matters
 * most on a phone, where only a fraction of the plate is visible at a time —
 * the previous Gaussian-cluster placement meant one screenful could be a swarm
 * and the next could be empty.
 *
 * Returns points in a random order, so callers can take a prefix without
 * biasing toward one corner.
 */
function poissonDisk(
  width: number,
  height: number,
  minDist: number,
  rng: () => number,
  attempts = 30
): { x: number; y: number }[] {
  const cell = minDist / Math.SQRT2;
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const grid: number[] = new Array(cols * rows).fill(-1);

  const points: { x: number; y: number }[] = [];
  const active: number[] = [];

  const gridIndex = (x: number, y: number) =>
    Math.floor(y / cell) * cols + Math.floor(x / cell);

  const far = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return false;
    const gx = Math.floor(x / cell);
    const gy = Math.floor(y / cell);

    for (let iy = Math.max(0, gy - 2); iy <= Math.min(rows - 1, gy + 2); iy++) {
      for (let ix = Math.max(0, gx - 2); ix <= Math.min(cols - 1, gx + 2); ix++) {
        const idx = grid[iy * cols + ix];
        if (idx === -1) continue;
        const p = points[idx];
        const dx = p.x - x;
        const dy = p.y - y;
        if (dx * dx + dy * dy < minDist * minDist) return false;
      }
    }
    return true;
  };

  const push = (x: number, y: number) => {
    points.push({ x, y });
    grid[gridIndex(x, y)] = points.length - 1;
    active.push(points.length - 1);
  };

  push(rng() * width, rng() * height);

  while (active.length > 0) {
    const pick = Math.floor(rng() * active.length);
    const seedIdx = active[pick];
    const seed = points[seedIdx];
    let placed = false;

    for (let i = 0; i < attempts; i++) {
      const angle = rng() * Math.PI * 2;
      // Uniform over the annulus [minDist, 2*minDist].
      const radius = minDist * Math.sqrt(1 + 3 * rng());
      const x = seed.x + Math.cos(angle) * radius;
      const y = seed.y + Math.sin(angle) * radius;

      if (far(x, y)) {
        push(x, y);
        placed = true;
        break;
      }
    }

    if (!placed) {
      active[pick] = active[active.length - 1];
      active.pop();
    }
  }

  // Shuffle so a caller taking the first N gets an even spread, not a region.
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points;
}

/**
 * Places Pokemon evenly across the ground plane.
 *
 * Positions come from Poisson-disk sampling rather than the cluster scatter
 * this used previously: zoom into any patch and you should find a comparable
 * number of Pokemon. Targets are drawn from the same point set as decoys, so
 * they can't be found by spotting an odd one out.
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

  const margin = baseSize * 0.6;
  const fieldW = Math.max(1, sceneW - margin * 2);
  const fieldH = Math.max(1, sceneH - horizonY - margin * 1.5);
  const area = fieldW * fieldH;

  /*
   * Pick the separation that yields a little more than the requested count,
   * then take a prefix. Poisson-disk packs at roughly 0.7 of the square-grid
   * density, and asking for ~15% extra absorbs the variance so a plate is
   * never short.
   */
  const target = Math.max(all.length, 1);
  const minDist = Math.sqrt((area * 0.7) / (target * 1.15));
  // Never let sprites sit closer than they are wide, whatever the density asks.
  const floor = baseSize * 0.78;

  let points = poissonDisk(fieldW, fieldH, Math.max(minDist, floor), rng);

  // If a dense plate came up short, relax once rather than leaving gaps.
  if (points.length < all.length) {
    points = poissonDisk(fieldW, fieldH, Math.max(minDist * 0.82, floor * 0.85), rng);
  }

  // Shuffle the roster so targets don't take a predictable slice of the points.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.map((entry, i) => {
    const point = points[i % Math.max(points.length, 1)] ?? {
      x: rng() * fieldW,
      y: rng() * fieldH,
    };

    const x = margin + point.x;
    const y = horizonY + margin + point.y;
    const scale = depthScale(y, sceneH, theme.horizon, 0.55, 1.2);

    return {
      kind: "mon" as const,
      id: `mon-${entry.pokemon.id}-${i}`,
      pokemon: entry.pokemon,
      isTarget: entry.isTarget,
      x,
      y,
      width: baseSize,
      height: baseSize,
      scale,
      flipX: rng() > 0.5,
      z: baselineZ(y, "mon"),
    };
  });
}
