import { ArrowRight, Flame, Lightbulb } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import PageMeta from "@/components/layout/page-meta";
import {
  Button,
  Card,
  DifficultyPills,
  PageHeader,
  Skeleton,
  StatTile,
  type DifficultyOption,
} from "@/components/ui";
import { getOfficialArtUrl, type Pokemon } from "@/lib/pokemon";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultySpec {
  /** How many rows to sample before choosing an answer and distractors. */
  pool: number;
  /**
   * How close the distractors must be to the answer. `any` takes whatever is
   * in the pool; `related` prefers a shared type or generation; `similar`
   * takes the three most similar rows available.
   */
  similarity: "any" | "related" | "similar";
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultySpec> = {
  easy: { pool: 60, similarity: "any" },
  medium: { pool: 140, similarity: "related" },
  hard: { pool: 260, similarity: "similar" },
};

const DIFFICULTIES: DifficultyOption<Difficulty>[] = (
  Object.keys(DIFFICULTY_CONFIG) as Difficulty[]
).map((value) => ({ value, label: value }));

const CHOICE_COUNT = 4;

interface Round {
  answer: Pokemon;
  choices: Pokemon[];
}

/**
 * How plausible `candidate` is as a wrong answer for `answer`. Higher is a
 * harder distractor. Shape data isn't in the dataset, so this leans on the
 * attributes that most affect how alike two Pokemon look at a glance.
 */
function similarityScore(answer: Pokemon, candidate: Pokemon): number {
  let score = 0;
  if (candidate.types[0] && candidate.types[0] === answer.types[0]) score += 4;
  else if (candidate.types.some((t) => answer.types.includes(t))) score += 2;
  if (candidate.generation === answer.generation) score += 1;
  if (candidate.color === answer.color) score += 2;
  return score;
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildRound(pool: Pokemon[], spec: DifficultySpec): Round | null {
  if (pool.length < CHOICE_COUNT) return null;

  const answer = pool[Math.floor(Math.random() * pool.length)];
  const others = pool.filter((p) => p.id !== answer.id);

  let distractors: Pokemon[];

  if (spec.similarity === "any") {
    distractors = shuffle(others).slice(0, CHOICE_COUNT - 1);
  } else {
    const ranked = others
      .map((p) => ({ p, score: similarityScore(answer, p) }))
      .sort((a, b) => b.score - a.score);

    if (spec.similarity === "similar") {
      distractors = ranked.slice(0, CHOICE_COUNT - 1).map((r) => r.p);
    } else {
      // Prefer anything that shares a type or generation, but keep it varied
      // by sampling from the related band rather than taking the strict top.
      const related = ranked.filter((r) => r.score > 0);
      const band = related.length >= CHOICE_COUNT - 1 ? related : ranked;
      distractors = shuffle(band.slice(0, Math.max(CHOICE_COUNT - 1, 12)))
        .slice(0, CHOICE_COUNT - 1)
        .map((r) => r.p);
    }
  }

  return { answer, choices: shuffle([answer, ...distractors]) };
}

function TrainerGuessScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [round, setRound] = useState<Round | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [guessedCorrectly, setGuessedCorrectly] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  // Tracked separately from `score`: a hinted win is worth fewer points but is
  // still a correct answer, so one can't be derived from the other.
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const spec = DIFFICULTY_CONFIG[difficulty];

  const loadRound = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    setGuessedCorrectly(null);
    setHintUsed(false);

    const res = await fetch(
      `/api/pokemon?random=${spec.pool}&artOnly=1&spritesOnly=1`
    );
    const data = await res.json();
    setRound(buildRound((data.pokemon ?? []) as Pokemon[], spec));
    setLoading(false);
  }, [spec]);

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
      setScore((s) => s + (hintUsed ? 5 : 10));
      setCorrectCount((c) => c + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const accuracy =
    totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;

  const resetStats = () => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalRounds(0);
    setCorrectCount(0);
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
        >
          <DifficultyPills
            options={DIFFICULTIES}
            value={difficulty}
            onChange={(d) => {
              setDifficulty(d);
              resetStats();
            }}
          />
        </PageHeader>

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
          <StatTile label="Accuracy" value={`${accuracy}%`} />
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
                {/*
                 * A pure-black silhouette on the dark card was effectively
                 * invisible. The window behind it is light while hidden, so the
                 * outline reads clearly without revealing any interior detail —
                 * the artwork is still flattened to solid black.
                 */}
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(160deg, #eef1f9 0%, #c3c9de 100%)",
                    opacity: revealed ? 0 : 1,
                  }}
                />
                <Image
                  src={getOfficialArtUrl(round.answer.id)}
                  alt={revealed ? round.answer.name : "Mystery Pokémon"}
                  width={200}
                  height={200}
                  className="relative transition-[filter] duration-500"
                  style={{
                    filter: revealed ? "none" : "brightness(0) saturate(0)",
                  }}
                  sizes="200px"
                  priority
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
                    onClick={() => setHintUsed(true)}
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
