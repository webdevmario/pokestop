import type { Theme } from "./types";

/**
 * Five illustrated plates. Each theme owns a palette and a weighted prop mix;
 * `props.tsx` draws every prop from that palette with one shared ink outline,
 * so the whole plate reads as a single illustration.
 *
 * `layer: "fore"` props paint over the Pokemon and never take clicks — they
 * are the ones that do the hiding.
 */
export const THEMES: Theme[] = [
  {
    id: "forest",
    name: "Viridian Forest",
    horizon: 0.26,
    palette: {
      sky: ["#bfe3c8", "#8fcba3"],
      ground: ["#6aa86a", "#3d7d43"],
      distant: "#79b57f",
      propDark: "#17401f",
      propMid: "#246b2d",
      propLight: "#54a04c",
      ink: "#12331a",
      haze: "rgba(120, 190, 130, 0.10)",
    },
    props: [
      { prop: "conifer", layer: "mid", minW: 90, maxW: 190, minRatio: 1.5, maxRatio: 1.9, weight: 4 },
      { prop: "broadleaf", layer: "mid", minW: 110, maxW: 220, minRatio: 1.0, maxRatio: 1.25, weight: 4 },
      { prop: "bush", layer: "mid", minW: 70, maxW: 140, minRatio: 0.6, maxRatio: 0.85, weight: 5 },
      { prop: "fern", layer: "fore", minW: 55, maxW: 110, minRatio: 0.8, maxRatio: 1.05, weight: 5 },
      { prop: "grass", layer: "fore", minW: 45, maxW: 95, minRatio: 0.6, maxRatio: 0.9, weight: 7 },
      { prop: "mushroom", layer: "fore", minW: 26, maxW: 52, minRatio: 0.8, maxRatio: 1.0, weight: 3 },
      { prop: "rock", layer: "mid", minW: 45, maxW: 90, minRatio: 0.55, maxRatio: 0.8, weight: 2 },
    ],
    propDensity: 150,
  },
  {
    id: "cave",
    name: "Mt. Moon Cave",
    horizon: 0.3,
    palette: {
      sky: ["#2a2b45", "#1b1c30"],
      ground: ["#44466b", "#20213a"],
      distant: "#2a2b47",
      propDark: "#22233d",
      propMid: "#565a8c",
      propLight: "#9093cc",
      ink: "#14152a",
      haze: "rgba(120, 130, 220, 0.08)",
    },
    props: [
      { prop: "stalagmite", layer: "mid", minW: 55, maxW: 120, minRatio: 1.3, maxRatio: 1.9, weight: 4 },
      { prop: "boulder", layer: "mid", minW: 80, maxW: 170, minRatio: 0.6, maxRatio: 0.85, weight: 4 },
      { prop: "crystal", layer: "fore", minW: 34, maxW: 70, minRatio: 1.4, maxRatio: 2.0, weight: 4 },
      { prop: "rock", layer: "fore", minW: 50, maxW: 105, minRatio: 0.55, maxRatio: 0.8, weight: 6 },
      { prop: "mushroom", layer: "fore", minW: 28, maxW: 56, minRatio: 0.8, maxRatio: 1.0, weight: 2 },
    ],
    propDensity: 135,
  },
  {
    id: "beach",
    name: "Cerulean Beach",
    horizon: 0.34,
    palette: {
      sky: ["#9fd8f2", "#cfeaf7"],
      ground: ["#edd9a0", "#d2b471"],
      distant: "#4f9ec4",
      propDark: "#6b4a22",
      propMid: "#3f8c4a",
      propLight: "#6fba63",
      ink: "#33240f",
      haze: "rgba(255, 228, 160, 0.10)",
    },
    props: [
      { prop: "palm", layer: "mid", minW: 110, maxW: 215, minRatio: 1.2, maxRatio: 1.6, weight: 4 },
      { prop: "driftwood", layer: "fore", minW: 85, maxW: 165, minRatio: 0.35, maxRatio: 0.55, weight: 4 },
      { prop: "rock", layer: "mid", minW: 55, maxW: 115, minRatio: 0.55, maxRatio: 0.8, weight: 4 },
      { prop: "bush", layer: "mid", minW: 60, maxW: 115, minRatio: 0.6, maxRatio: 0.85, weight: 3 },
      { prop: "grass", layer: "fore", minW: 40, maxW: 85, minRatio: 0.6, maxRatio: 0.9, weight: 5 },
    ],
    propDensity: 120,
  },
  {
    id: "graveyard",
    name: "Lavender Night",
    horizon: 0.28,
    palette: {
      sky: ["#2b1c48", "#140d26"],
      ground: ["#3d2a5c", "#1a1230"],
      distant: "#4a3370",
      propDark: "#241a3d",
      propMid: "#5b4880",
      propLight: "#9480c4",
      ink: "#130d22",
      haze: "rgba(160, 120, 220, 0.10)",
    },
    props: [
      { prop: "tombstone", layer: "mid", minW: 55, maxW: 105, minRatio: 1.0, maxRatio: 1.4, weight: 5 },
      { prop: "deadtree", layer: "mid", minW: 95, maxW: 195, minRatio: 1.1, maxRatio: 1.5, weight: 4 },
      { prop: "bush", layer: "fore", minW: 60, maxW: 120, minRatio: 0.6, maxRatio: 0.85, weight: 4 },
      { prop: "rock", layer: "fore", minW: 48, maxW: 95, minRatio: 0.55, maxRatio: 0.8, weight: 4 },
      { prop: "grass", layer: "fore", minW: 42, maxW: 88, minRatio: 0.6, maxRatio: 0.9, weight: 4 },
    ],
    propDensity: 135,
  },
  {
    id: "volcano",
    name: "Volcano Path",
    horizon: 0.3,
    palette: {
      sky: ["#5c2a18", "#2c1208"],
      ground: ["#6e3a1d", "#331708"],
      distant: "#8f4620",
      propDark: "#1e0d09",
      propMid: "#49220f",
      propLight: "#ff8a3c",
      ink: "#1a0a06",
      haze: "rgba(255, 120, 40, 0.10)",
    },
    props: [
      { prop: "lavarock", layer: "mid", minW: 75, maxW: 155, minRatio: 0.6, maxRatio: 0.9, weight: 5 },
      { prop: "boulder", layer: "mid", minW: 70, maxW: 145, minRatio: 0.6, maxRatio: 0.85, weight: 3 },
      { prop: "ember", layer: "fore", minW: 30, maxW: 62, minRatio: 1.1, maxRatio: 1.5, weight: 4 },
      { prop: "rock", layer: "fore", minW: 52, maxW: 105, minRatio: 0.55, maxRatio: 0.8, weight: 4 },
      { prop: "deadtree", layer: "mid", minW: 85, maxW: 165, minRatio: 1.1, maxRatio: 1.5, weight: 2 },
    ],
    propDensity: 130,
  },
];

export function themeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
