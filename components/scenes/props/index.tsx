import type { ThemePalette } from "../types";

import * as beach from "./beach";
import * as cave from "./cave";
import * as forest from "./forest";
import * as graveyard from "./graveyard";
import type { PropComponent } from "./shared";
import * as volcano from "./volcano";

/**
 * Every authored prop, keyed by the name themes.ts refers to.
 *
 * Props are grouped per theme in their own files; a few read naturally in more
 * than one scene (rocks, bare trees) and are aliased rather than redrawn.
 */
export const PROP_COMPONENTS: Record<string, PropComponent> = {
  // Forest
  conifer: forest.ConiferTall,
  "conifer-squat": forest.ConiferSquat,
  oak: forest.OakTree,
  birch: forest.BirchTree,
  "rock-granite": forest.RockGranite,
  "rock-mossy": forest.RockMossy,
  "bush-berry": forest.BushBerry,
  "bush-leafy": forest.BushLeafy,
  fern: forest.FernCluster,
  mushrooms: forest.MushroomCluster,
  log: forest.FallenLog,
  stump: forest.TreeStump,
  flowers: forest.FlowerPatch,
  grass: forest.GrassTuft,

  // Cave
  "boulder-round": cave.BoulderRound,
  "boulder-cracked": cave.BoulderCracked,
  "rock-slab": cave.RockSlab,
  rubble: cave.RubblePile,
  "crystal-spire": cave.CrystalSpire,
  "crystal-cluster": cave.CrystalCluster,
  geode: cave.Geode,
  stalagmites: cave.Stalagmites,
  "cave-column": cave.CaveColumn,
  "cave-pool": cave.CavePool,
  "mineral-vein": cave.MineralVein,
  "glow-mushrooms": cave.GlowMushrooms,

  // Beach
  "palm-tall": beach.PalmTall,
  "palm-bent": beach.PalmBent,
  "palm-young": beach.PalmYoung,
  "beach-rock": beach.BeachRockLarge,
  "beach-stone": beach.BeachRockSmall,
  driftwood: beach.Driftwood,
  shells: beach.ShellCluster,
  umbrella: beach.BeachUmbrella,
  tidepool: beach.Tidepool,
  starfish: beach.Starfish,
  "dune-grass": beach.DuneGrass,
  coral: beach.Coral,

  // Graveyard
  "tomb-rounded": graveyard.TombRounded,
  "tomb-cross": graveyard.TombCross,
  "tomb-broken": graveyard.TombBroken,
  "bare-tree": graveyard.BareTreeGnarled,
  "bare-tree-leaning": graveyard.BareTreeLeaning,
  mausoleum: graveyard.Mausoleum,
  crypt: graveyard.Crypt,
  fence: graveyard.IronFence,
  candles: graveyard.CandleCluster,
  statue: graveyard.BrokenStatue,
  lantern: graveyard.Lantern,
  mound: graveyard.GraveMound,

  // Volcano
  "lava-jagged": volcano.LavaRockJagged,
  "lava-round": volcano.LavaRockRound,
  "lava-shards": volcano.LavaShards,
  obsidian: volcano.ObsidianSpire,
  basalt: volcano.BasaltColumns,
  "lava-flow": volcano.LavaFlow,
  "molten-pool": volcano.MoltenPool,
  ash: volcano.AshMound,
  ember: volcano.EmberCluster,
  "scorched-tree": volcano.ScorchedTree,
  vent: volcano.SmokeVent,
  crust: volcano.CooledCrust,
};

interface RenderProps {
  prop: string;
  palette: ThemePalette;
  /** Foreground props hide Pokemon but must never intercept their clicks. */
  interactive: boolean;
}

export function SceneProp({ prop, palette, interactive }: RenderProps) {
  const Component = PROP_COMPONENTS[prop] ?? forest.BushLeafy;
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      /*
       * Hit-testing lives here, not on the wrapper div. An HTML div captures
       * clicks across its whole box including transparent corners, which would
       * make a tree's bounding box an invisible wall over the Pokemon beside
       * it. `visiblePainted` limits the SVG to its actual painted geometry, so
       * only the pixels you can see block a click.
       */
      style={{
        overflow: "visible",
        pointerEvents: interactive ? "visiblePainted" : "none",
      }}
    >
      <Component p={palette} />
    </svg>
  );
}
