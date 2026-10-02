import { ArrowRight, Flame, Lightbulb } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import PageMeta from "@/components/layout/page-meta";
import { Button, Card, PageHeader, Skeleton, StatTile } from "@/components/ui";
import { getOfficialArtUrl, type Pokemon } from "@/lib/pokemon";

interface Round {
  answer: Pokemon;
  choices: Pokemon[];
}

function TrainerGuessScreen() {
  const [round, setRound] = useState<Round | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const loadRound = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    setGuessedCorrectly(null);
    setHintUsed(false);

    // Get 4 random pokemon for choices
    const res = await fetch("/api/pokemon?random=4");
    const data = await res.json();
    const choices: Pokemon[] = data.pokemon;

    // Pick one as the answer
    const answer = choices[Math.floor(Math.random() * choices.length)];

    // Shuffle choices
    const shuffled = [...choices].sort(() => Math.random() - 0.5);

    setRound({ answer, choices: shuffled });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRound();
  }, [loadRound]);

  const handleGuess = (pokemon: Pokemon) => {
    if (revealed || !round) return;

    const correct = pokemon.id === round.answer.id;
    setGuessedCorrectly(correct);
    setRevealed(true);
    setTotalRounds((t) => t + 1);

    if (correct) {
      const points = hintUsed ? 5 : 10;
      setScore((s) => s + points);
      setStreak((s) => {
        const newStreak = s + 1;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  };

  const showHint = () => {
    setHintUsed(true);
  };

  return (
    <>
      <PageMeta
        title="Who's That Pokémon?"
        description="Guess the Pokémon from its silhouette. Build streaks, use hints, and track your accuracy."
      />

      <main className="mx-auto min-h-screen max-w-3xl px-4 py-8">
        <PageHeader
          title="Who's That Pokémon?"
          subtitle="Guess the Pokémon from its silhouette!"
        />

        {/* Score bar */}
        <div className="mb-8 flex justify-center gap-8">
          <StatTile label="Score" value={score} tone="warning" />
          <StatTile
            label="Streak"
            value={streak}
            tone="primary"
            icon={<Flame aria-hidden className="h-5 w-5" />}
          />
          <StatTile label="Best" value={bestStreak} tone="success" />
          <StatTile
            label="Accuracy"
            value={`${
              totalRounds > 0
                ? Math.round(
                    ((score / (hintUsed ? 5 : 10) / totalRounds) * 100 +
                      Number.EPSILON) *
                      10
                  ) / 10 || 0
                : 0
            }%`}
          />
        </div>

        {loading && (
          <div className="mb-8 flex justify-center">
            <Skeleton className="h-64 w-64 rounded-card" />
          </div>
        )}

        {round && !loading && (
          <>
            {/* Silhouette / reveal area */}
            <div className="mb-8 flex justify-center">
              <Card
                variant="raised"
                padding="none"
                className="relative flex h-64 w-64 items-center justify-center overflow-hidden"
              >
                <Image
                  src={getOfficialArtUrl(round.answer.id)}
                  alt={revealed ? round.answer.name : "Mystery Pokémon"}
                  width={200}
                  height={200}
                  className={`transition-[filter] duration-500 ${
                    revealed ? "brightness-100" : "brightness-0 contrast-200"
                  }`}
                  style={{
                    filter: revealed
                      ? "none"
                      : "brightness(0) drop-shadow(0 0 1px white)",
                  }}
                  sizes="200px"
                />
                {revealed && (
                  <div
                    className={`absolute inset-x-0 bottom-3 text-center ${
                      guessedCorrectly ? "text-success" : "text-primary"
                    }`}
                  >
                    <p className="text-lg font-bold capitalize">
                      {guessedCorrectly
                        ? "Correct!"
                        : `It's ${round.answer.name}!`}
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Hint */}
            {!revealed && (
              <div className="mb-4 text-center">
                {hintUsed ? (
                  <p className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <Lightbulb aria-hidden className="h-4 w-4 text-warning" />
                    Type:{" "}
                    <span className="font-semibold capitalize text-text">
                      {round.answer.types.join(" / ")}
                    </span>{" "}
                    (half points)
                  </p>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={showHint}
                    icon={<Lightbulb aria-hidden className="h-4 w-4" />}
                  >
                    Need a hint? (half points)
                  </Button>
                )}
              </div>
            )}

            {/* Choices */}
            <div className="mx-auto mb-6 grid max-w-md grid-cols-2 gap-3">
              {round.choices.map((p) => {
                const isAnswer = p.id === round.answer.id;
                return (
                  <Button
                    key={p.id}
                    size="lg"
                    onClick={() => handleGuess(p)}
                    disabled={revealed}
                    className={`capitalize ${
                      revealed && isAnswer
                        ? "!border-success !bg-success/20 !text-success !opacity-100"
                        : revealed
                          ? "opacity-50"
                          : ""
                    }`}
                  >
                    {p.name}
                  </Button>
                );
              })}
            </div>

            {/* Next button */}
            {revealed && (
              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={loadRound}
                  iconAfter={<ArrowRight aria-hidden className="h-4 w-4" />}
                >
                  Next Pokémon
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default TrainerGuessScreen;
