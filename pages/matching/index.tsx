import Image from "next/image";
import { useCallback, useState } from "react";

import PageMeta from "@/components/layout/page-meta";
import {
  Button,
  Card,
  DifficultyPills,
  PageHeader,
  Skeleton,
  StatTile,
  WinBanner,
  type DifficultyOption,
} from "@/components/ui";
import { useGameTimer } from "@/hooks/use-game-timer";
import { getSpriteUrl } from "@/lib/pokemon";

interface MatchCard {
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

const DIFFICULTIES: DifficultyOption<Difficulty>[] = (
  Object.keys(GRID_CONFIG) as Difficulty[]
).map((value) => ({
  value,
  label: value,
  hint: `${GRID_CONFIG[value].pairs} pairs`,
}));

function MatchingScreen() {
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useGameTimer();
  // Depend on the stable callbacks, not the timer object, which changes
  // identity on every tick.
  const { start: startTimer, stop: stopTimer, reset: resetTimer } = timer;

  const totalPairs = GRID_CONFIG[difficulty].pairs;

  const startGame = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/pokemon?random=${totalPairs}&spritesOnly=1`);
    const data = await res.json();
    const pokemonList = data.pokemon;

    const pairs: MatchCard[] = [];

    pokemonList.forEach((p: { id: number; name: string }) => {
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
    setGameStarted(true);
    setLoading(false);
    startTimer();
  }, [totalPairs, startTimer]);

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
              stopTimer();
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

  return (
    <>
      <PageMeta
        title="Matching"
        description="A Pokémon memory card matching game with easy, medium and hard difficulty."
      />

      <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
        <PageHeader
          title="Matching"
          subtitle="Find all the matching Pokémon pairs!"
        >
          <DifficultyPills
            options={DIFFICULTIES}
            value={difficulty}
            onChange={(d) => {
              setDifficulty(d);
              setGameStarted(false);
              resetTimer();
            }}
          />
          <Button variant="primary" onClick={startGame}>
            {gameStarted ? "Restart" : "Start Game"}
          </Button>
        </PageHeader>

        {/* Stats */}
        {gameStarted && (
          <div className="mb-6 flex justify-center gap-6">
            <StatTile label="Moves" value={moves} />
            <StatTile label="Matched" value={`${matchCount}/${totalPairs}`} />
            <StatTile label="Time" value={timer.formatted} mono />
          </div>
        )}

        {gameWon && (
          <WinBanner
            title="You win!"
            detail={`Completed in ${moves} moves and ${timer.formatted}`}
          />
        )}

        {loading && (
          <div
            aria-busy="true"
            aria-label="Dealing cards"
            className={`grid ${GRID_CONFIG[difficulty].cols} mx-auto max-w-fit gap-2`}
          >
            {Array.from({ length: totalPairs * 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-20 rounded-control sm:h-24 sm:w-24"
              />
            ))}
          </div>
        )}

        {/* Card grid */}
        {gameStarted && !loading && (
          <div
            className={`grid ${GRID_CONFIG[difficulty].cols} mx-auto max-w-fit gap-2`}
          >
            {cards.map((card) => (
              // perspective lives on a wrapper: without it rotateY is an
              // orthographic mirror that reads as a snap, not a card turning.
              <div
                key={card.uid}
                className={`h-20 w-20 [perspective:800px] transition-[opacity,filter] duration-300 sm:h-24 sm:w-24 ${
                  card.matched ? "opacity-60 saturate-50" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleCardClick(card.uid)}
                  disabled={card.matched || card.flipped}
                  aria-label={
                    card.flipped || card.matched ? card.name : "Hidden card"
                  }
                  // transform is written here and nowhere else — the matched state
                  // uses opacity/saturate on the wrapper so nothing competes for it.
                  className={`relative h-full w-full rounded-control transition-transform duration-300 [transform-style:preserve-3d] [will-change:transform] ${
                    card.flipped || card.matched
                      ? "[transform:rotateY(180deg)]"
                      : "cursor-pointer"
                  }`}
                >
                  {/* Card back (face down) */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-control border-2 border-primary bg-primary [backface-visibility:hidden] [transform:translateZ(0)]">
                    <Image
                      src="/pokeball.png"
                      alt=""
                      width={36}
                      height={36}
                      className="opacity-40"
                    />
                  </div>
                  {/* Card front (face up) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-control border border-border/10 bg-surface-raised [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0)]">
                    <Image
                      src={getSpriteUrl(card.pokemonId)}
                      alt={card.name}
                      width={56}
                      height={56}
                      sizes="56px"
                    />
                    <p className="mt-0.5 text-[9px] capitalize text-text-muted">
                      {card.name}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}

        {!gameStarted && !loading && (
          <Card variant="raised" padding="lg" className="text-center text-text-muted">
            Choose a difficulty and click Start Game!
          </Card>
        )}
      </main>
    </>
  );
}

export default MatchingScreen;
