import Title from "@/components/layout/title";
import { getSpriteUrl } from "@/lib/pokemon";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Card {
  uid: string;
  pokemonId: number;
  name: string;
  flipped: boolean;
  matched: boolean;
}

type Difficulty = "easy" | "medium" | "hard";

const GRID_CONFIG: Record<Difficulty, { pairs: number; cols: string }> = {
  easy: { pairs: 6, cols: "grid-cols-4" },
  medium: { pairs: 10, cols: "grid-cols-5" },
  hard: { pairs: 15, cols: "grid-cols-6" },
};

function MatchingScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const totalPairs = GRID_CONFIG[difficulty].pairs;

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const startGame = useCallback(async () => {
    const res = await fetch(`/api/pokemon?random=${totalPairs}`);
    const data = await res.json();
    const pokemonList = data.pokemon;

    const pairs: Card[] = [];

    pokemonList.forEach((p: any) => {
      pairs.push({
        uid: `${p.id}-a`,
        pokemonId: p.id,
        name: p.name,
        flipped: false,
        matched: false,
      });
      pairs.push({
        uid: `${p.id}-b`,
        pokemonId: p.id,
        name: p.name,
        flipped: false,
        matched: false,
      });
    });

    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setCards(pairs);
    setFlippedIds([]);
    setMoves(0);
    setMatchCount(0);
    setGameWon(false);
    setTimer(0);
    setTimerActive(true);
    setGameStarted(true);
  }, [totalPairs]);

  const handleCardClick = (uid: string) => {
    if (flippedIds.length >= 2) return;

    const card = cards.find((c) => c.uid === uid);

    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, uid];

    setFlippedIds(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.uid === uid ? { ...c, flipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [firstUid, secondUid] = newFlipped;
      const first = cards.find((c) => c.uid === firstUid)!;
      const second = cards.find((c) => c.uid === secondUid)!;

      if (first.pokemonId === second.pokemonId) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pokemonId === first.pokemonId ? { ...c, matched: true } : c
            )
          );
          setFlippedIds([]);
          setMatchCount((m) => {
            const newCount = m + 1;
            if (newCount === totalPairs) {
              setGameWon(true);
              setTimerActive(false);
            }
            return newCount;
          });
        }, 400);
      } else {
        // No match — flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.uid) && !c.matched
                ? { ...c, flipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <Title
        name="Matching"
        subtitle="Find all the matching Pokémon pairs!"
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d);
              setGameStarted(false);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              difficulty === d
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-card)] border border-white/10 text-[var(--color-text-muted)] hover:text-white"
            }`}
          >
            {d} ({GRID_CONFIG[d].pairs} pairs)
          </button>
        ))}
        <button
          onClick={startGame}
          className="px-6 py-2 rounded-xl bg-[var(--color-green)] text-white font-semibold hover:brightness-110 transition-all"
        >
          {gameStarted ? "Restart" : "Start Game"}
        </button>
      </div>

      {/* Stats */}
      {gameStarted && (
        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)] uppercase">
              Moves
            </p>
            <p className="text-2xl font-bold text-white">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)] uppercase">
              Matched
            </p>
            <p className="text-2xl font-bold text-white">
              {matchCount}/{totalPairs}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-muted)] uppercase">
              Time
            </p>
            <p className="text-2xl font-bold text-white font-mono">
              {formatTime(timer)}
            </p>
          </div>
        </div>
      )}

      {/* Game won overlay */}
      {gameWon && (
        <div className="text-center mb-6 p-6 rounded-2xl bg-[var(--color-green)]/10 border border-[var(--color-green)]/30">
          <p className="text-2xl font-bold text-[var(--color-green)] mb-2">
            🎉 You win!
          </p>
          <p className="text-[var(--color-text-muted)]">
            Completed in {moves} moves and {formatTime(timer)}
          </p>
        </div>
      )}

      {/* Card grid */}
      {gameStarted && (
        <div
          className={`grid ${GRID_CONFIG[difficulty].cols} gap-2 max-w-fit mx-auto`}
        >
          {cards.map((card) => (
            <button
              key={card.uid}
              onClick={() => handleCardClick(card.uid)}
              disabled={card.matched || card.flipped}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl transition-all duration-300 [transform-style:preserve-3d] ${
                card.flipped || card.matched
                  ? "[transform:rotateY(180deg)]"
                  : ""
              } ${
                card.matched
                  ? "opacity-60 scale-95"
                  : "cursor-pointer"
              }`}
            >
              {/* Card back (face down) */}
              <div className="absolute inset-0 rounded-xl bg-[var(--color-accent)] flex items-center justify-center [backface-visibility:hidden] border-2 border-[var(--color-accent)]">
                <Image
                  src="/pokeball.png"
                  alt="hidden"
                  width={36}
                  height={36}
                  className="opacity-40"
                />
              </div>
              {/* Card front (face up) */}
              <div className="absolute inset-0 rounded-xl bg-[var(--color-bg-card)] border border-white/10 flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <Image
                  src={getSpriteUrl(card.pokemonId)}
                  alt={card.name}
                  width={56}
                  height={56}
                  unoptimized
                />
                <p className="text-[9px] capitalize text-white/70 mt-0.5">
                  {card.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!gameStarted && (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          Choose a difficulty and click Start Game!
        </div>
      )}
    </main>
  );
}

export default MatchingScreen;
