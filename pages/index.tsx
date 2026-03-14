import Image from "next/image";
import Link from "next/link";

const GAMES = [
  {
    href: "/showcase",
    title: "Showcase",
    description: "Search and explore Pokémon with flip cards",
    emoji: "✨",
    color: "#ff5350",
  },
  {
    href: "/pokedex",
    title: "Pokédex",
    description: "Browse all 1,281 Pokémon with filters",
    emoji: "📖",
    color: "#6390f0",
  },
  {
    href: "/matching",
    title: "Matching",
    description: "Test your memory with a card matching game",
    emoji: "🎴",
    color: "#7ac74c",
  },
  {
    href: "/trainer-guess",
    title: "Who's That Pokémon?",
    description: "Guess the Pokémon from its silhouette",
    emoji: "❓",
    color: "#f7d02c",
  },
  {
    href: "/wordsearch",
    title: "Word Search",
    description: "Find hidden Pokémon names in the grid",
    emoji: "🔍",
    color: "#a98ff3",
  },
  {
    href: "/hideandseek",
    title: "Hide & Seek",
    description: "Tap the tall grass to find hidden Pokémon",
    emoji: "🌿",
    color: "#2d5a1e",
  },
];

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16 animate-fade-in-up">
        <div className="mb-6">
          <Image
            src="/pokeball.png"
            alt="pokeball"
            width={80}
            height={80}
            className="mx-auto animate-float"
          />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-4">
          Pokéstop{" "}
          <span className="text-[var(--color-accent)]">Arcade</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg max-w-md mx-auto">
          Explore, play, and test your Pokémon knowledge with mini-games and tools.
        </p>
      </div>

      {/* Game grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl w-full">
        {GAMES.map((game, i) => (
          <Link
            key={game.href}
            href={game.href}
            className="pokemon-card block rounded-2xl p-6 bg-[var(--color-bg-card)] border border-white/5 hover:border-white/10 transition-all animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
              style={{ backgroundColor: `${game.color}22` }}
            >
              {game.emoji}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{game.title}</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              {game.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;