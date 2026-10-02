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
 * Places Pokemon in overlapping clusters rather than a uniform scatter, which
 * is what makes scanning feel like seeking instead of like reading a grid.
 * Targets are placed into the same clusters as decoys so they can't be found
 * by looking for the odd one out.
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
      spread: 90 + rng() * 190,
    };
  });

  // Shuffle so targets don't land in a predictable slice of the clusters.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  const out: PlacedMon[] = [];

  all.forEach((entry, i) => {
    // Most mons join a cluster; the rest scatter so clusters don't look like islands.
    const inCluster = rng() < 0.82;
    let x: number;
    let y: number;

    if (inCluster) {
      const c = clusters[Math.floor(rng() * clusters.length)];
      // Box-Muller for a soft falloff from the cluster centre.
      const u = Math.max(rng(), 1e-6);
      const v = rng();
      const r = Math.sqrt(-2 * Math.log(u)) * c.spread * 0.5;
      x = c.cx + r * Math.cos(2 * Math.PI * v);
      y = c.cy + r * Math.sin(2 * Math.PI * v) * 0.6;
    } else {
      x = rng() * sceneW;
      y = horizonY + (sceneH - horizonY) * Math.sqrt(rng());
    }

    const margin = baseSize;
    x = Math.max(margin, Math.min(sceneW - margin, x));
    y = Math.max(horizonY + margin * 0.5, Math.min(sceneH - margin * 0.25, y));

    const scale = depthScale(y, sceneH, theme.horizon, 0.55, 1.2);

    out.push({
      kind: "mon",
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
    });
  });

  return out;
}
