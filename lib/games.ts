import {
  BookOpen,
  HelpCircle,
  Layers,
  Leaf,
  Search,
  type LucideIcon,
} from "lucide-react";

import pokemonFile from "@/data/pokemon.json";

const POKEMON_COUNT = pokemonFile._meta.rowCount.toLocaleString();

export interface GameRoute {
  href: string;
  /** Full name, used on the home tiles. */
  title: string;
  /** Short name, used in the header nav where space is tight. */
  navLabel: string;
  description: string;
  icon: LucideIcon;
  /** Tint for the tile's icon chip. */
  color: string;
}

/**
 * Single source of truth for the game routes, so the header nav and the home
 * grid can't drift apart.
 */
export const GAME_ROUTES: GameRoute[] = [
  {
    href: "/pokedex",
    title: "Pokédex",
    navLabel: "Pokédex",
    description: `Browse all ${POKEMON_COUNT} Pokémon with filters`,
    icon: BookOpen,
    color: "#6390f0",
  },
  {
    href: "/matching",
    title: "Matching",
    navLabel: "Matching",
    description: "Test your memory with a card matching game",
    icon: Layers,
    color: "#7ac74c",
  },
  {
    href: "/trainer-guess",
    title: "Who's That Pokémon?",
    navLabel: "Who's That?",
    description: "Guess the Pokémon from its silhouette",
    icon: HelpCircle,
    color: "#f7d02c",
  },
  {
    href: "/wordsearch",
    title: "Word Search",
    navLabel: "Word Search",
    description: "Find hidden Pokémon names in the grid",
    icon: Search,
    color: "#a98ff3",
  },
  {
    href: "/hideandseek",
    title: "Hide & Seek",
    navLabel: "Hide & Seek",
    description: "Spot the target Pokémon hidden in the scene",
    icon: Leaf,
    color: "#2d5a1e",
  },
];
