import type { Pokemon } from "@/lib/pokemon";

/** A prop's footprint is measured at its base, so `y` is always its feet. */
export interface Placed {
  id: string;
  x: number;
  y: number;
  /** Unscaled design width/height; the stage applies depth scale. */
  width: number;
  height: number;
  /** Depth scale derived from `y` against the horizon. */
  scale: number;
  flipX: boolean;
  /** Paint order. Derived from the baseline (`y`) so feet sort correctly. */
  z: number;
}

export interface PlacedProp extends Placed {
  kind: "prop";
  prop: string;
  /** Foreground props paint over everything and never take clicks. */
  layer: "mid" | "fore";
}

export interface PlacedMon extends Placed {
  kind: "mon";
  pokemon: Pokemon;
  isTarget: boolean;
}

export type SceneItem = PlacedProp | PlacedMon;

export interface ThemePalette {
  /** Sky / upper gradient stops, far to near. */
  sky: [string, string];
  /** Ground gradient stops, horizon to foreground. */
  ground: [string, string];
  /** Distant silhouette band just above the horizon. */
  distant: string;
  /** Primary + secondary foliage/structure colors for props. */
  propDark: string;
  propMid: string;
  propLight: string;
  /** Outline color shared by every prop, which is what unifies the art style. */
  ink: string;
  /** Tint laid over the whole plate to bind the palette together. */
  haze: string;
}

export interface PropSpec {
  prop: string;
  layer: "mid" | "fore";
  minW: number;
  maxW: number;
  /** Height is derived from width by this ratio range, so props keep shape. */
  minRatio: number;
  maxRatio: number;
  weight: number;
}

export interface Theme {
  id: string;
  name: string;
  /** Fraction of scene height where the ground starts. */
  horizon: number;
  palette: ThemePalette;
  props: PropSpec[];
  /** Props per 1000x1000 units of ground, before difficulty scaling. */
  propDensity: number;
}
