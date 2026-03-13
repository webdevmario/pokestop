import Title from "@/components/layout/title";
import { getOfficialArtUrl } from "@/lib/pokemon";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
}

interface Round {
  answer: Pokemon;
  choices: Pokemon[];
}

function TrainerGuessScreen() {
  const [round, setRound] = useState<Round | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState<boolean | null>(
    null
  );
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
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <Title
        name="Who's That Pokémon?"
        subtitle="Guess the Pokémon from its silhouette!"
      />

      {/* Score bar */}
      <div className="flex justify-center gap-8 mb-8">
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase">
            Score
          </p>
          <p className="text-2xl font-bold text-[var(--color-yellow)]">
            {score}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase">
            Streak
          </p>
          <p className="text-2xl font-bold text-[var(--color-accent)]">
            {streak}🔥
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase">
            Best
          </p>
          <p className="text-2xl font-bold text-[var(--color-green)]">
            {bestStreak}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--color-text-muted)] uppercase">
            Accuracy
          </p>
          <p className="text-2xl font-bold text-white">
            {totalRounds > 0
              ? Math.round(
                  ((score / (hintUsed ? 5 : 10) / totalRounds) * 100 +
                    Number.EPSILON) *
                    10
                ) / 10 || 0
              : 0}
            %
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {round && !loading && (
        <>
          {/* Silhouette / reveal area */}
          <div className="flex justify-center mb-8">
            <div className="relative w-64 h-64 bg-[var(--color-bg-card)] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
              <Image
                src={getOfficialArtUrl(round.answer.id)}
                alt="mystery pokemon"
                width={200}
                height={200}
                className={`transition-all duration-500 drop-shadow-lg ${
                  revealed
                    ? "brightness-100"
                    : "brightness-0 contrast-200"
                }`}
                style={{
                  filter: revealed
                    ? "none"
                    : "brightness(0) drop-shadow(0 0 1px white)",
                }}
                unoptimized
              />
              {revealed && (
                <div
                  className={`absolute bottom-3 left-0 right-0 text-center ${
                    guessedCorrectly ? "text-[var(--color-green)]" : "text-[var(--color-accent)]"
                  }`}
                >
                  <p className="text-lg font-bold capitalize">
                    {guessedCorrectly ? "Correct!" : `It's ${round.answer.name}!`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hint */}
          {!revealed && (
            <div className="text-center mb-4">
              {hintUsed ? (
                <p className="text-sm text-[var(--color-text-muted)]">
                  Type:{" "}
                  <span className="text-white font-semibold capitalize">
                    {round.answer.types.join(" / ")}
                  </span>{" "}
                  (half points)
                </p>
              ) : (
                <button
                  onClick={showHint}
                  className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors underline"
                >
                  Need a hint? (half points)
                </button>
              )}
            </div>
          )}

          {/* Choices */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
            {round.choices.map((p) => {
              let btnClass =
                "px-4 py-3 rounded-xl text-center font-semibold capitalize transition-all border ";
              if (revealed) {
                if (p.id === round.answer.id) {
                  btnClass +=
                    "bg-[var(--color-green)]/20 border-[var(--color-green)] text-[var(--color-green)]";
                } else if (
                  guessedCorrectly === false &&
                  p.id !== round.answer.id
                ) {
                  btnClass +=
                    "bg-[var(--color-bg-card)] border-white/5 text-[var(--color-text-muted)] opacity-50";
                } else {
                  btnClass +=
                    "bg-[var(--color-bg-card)] border-white/5 text-[var(--color-text-muted)] opacity-50";
                }
              } else {
                btnClass +=
                  "bg-[var(--color-bg-card)] border-white/10 text-white hover:bg-[var(--color-bg-hover)] hover:border-white/20 cursor-pointer";
              }
              return (
                <button
                  key={p.id}
                  onClick={() => handleGuess(p)}
                  disabled={revealed}
                  className={btnClass}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {revealed && (
            <div className="text-center">
              <button
                onClick={loadRound}
                className="px-8 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:brightness-110 transition-all"
              >
                Next Pokémon →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default TrainerGuessScreen;
