import { Eye, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PageMeta from "@/components/layout/page-meta";
import { generateProps, placeMons } from "@/components/scenes/layout";
import SceneStage from "@/components/scenes/scene-stage";
import SeekHud from "@/components/scenes/seek-hud";
import { THEMES } from "@/components/scenes/themes";
import type { PlacedMon, SceneItem, Theme } from "@/components/scenes/types";
import ZoomPan from "@/components/scenes/zoom-pan";
import {
  Button,
  Card,
  DifficultyPills,
  PageHeader,
  Skeleton,
  WinBanner,
  type DifficultyOption,
} from "@/components/ui";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Pokemon } from "@/lib/pokemon";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultySpec {
  targets: number;
  /** Total Pokemon on the plate, targets included. */
  population: number;
  /** Multiplier on the theme's prop density. */
  propDensity: number;
  hints: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultySpec> = {
  easy: { targets: 3, population: 170, propDensity: 0.85, hints: 3 },
  medium: { targets: 5, population: 250, propDensity: 1.0, hints: 3 },
  hard: { targets: 7, population: 330, propDensity: 1.2, hints: 2 },
};

const DIFFICULTIES: DifficultyOption<Difficulty>[] = (
  Object.keys(DIFFICULTY_CONFIG) as Difficulty[]
).map((value) => ({ value, label: value }));

/**
 * The plate is this many times the viewport, so there's somewhere to pan to.
 * Kept under 2x: a larger plate spreads the same population thinner and the
 * density stops reading as a crowd.
 */
const PLATE_SCALE = 1.9;
/** Unscaled sprite box; depth scale takes this to roughly 21-46px on screen. */
const MON_BASE_SIZE = 38;
const HINT_MS = 1500;

/**
 * One sampled draw for the whole plate. This used to be several capped
 * requests, which were independent draws and so overlapped — the dedupe that
 * covered for it also meant the plate quietly came up short.
 */
async function fetchPool(count: number): Promise<Pokemon[]> {
  const res = await fetch(`/api/pokemon?random=${count}&spritesOnly=1`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.pokemon ?? []) as Pokemon[];
}

function HideAndSeekScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [items, setItems] = useState<SceneItem[]>([]);
  const [targets, setTargets] = useState<Pokemon[]>([]);
  const [foundIds, setFoundIds] = useState<Set<number>>(new Set());
  const [misses, setMisses] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(DIFFICULTY_CONFIG.medium.hints);
  const [hintedId, setHintedId] = useState<number | null>(null);
  const [missMark, setMissMark] = useState<{
    x: number;
    y: number;
    n: number;
  } | null>(null);

  const timer = useGameTimer();
  const { start: startTimer, stop: stopTimer, reset: resetTimer } = timer;
  const reduced = useReducedMotion();
  const animate = !reduced;

  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [viewport, setViewport] = useState({ w: 1000, h: 560 });

  useEffect(() => {
    function measure() {
      const w = Math.min(window.innerWidth - 32, 1248);
      // Leave room for header, page header, HUD and the footer hint line.
      const h = Math.max(window.innerHeight - 420, 360);
      setViewport({ w, h });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(
    () => () => {
      if (hintTimeout.current) clearTimeout(hintTimeout.current);
      if (missTimeout.current) clearTimeout(missTimeout.current);
    },
    []
  );

  const plate = useMemo(
    () => ({
      w: Math.round(viewport.w * PLATE_SCALE),
      h: Math.round(viewport.h * PLATE_SCALE),
    }),
    [viewport]
  );

  const cfg = DIFFICULTY_CONFIG[difficulty];

  const startGame = useCallback(async () => {
    setLoading(true);
    setHintedId(null);
    setMissMark(null);

    const nextTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const seed = Math.floor(Math.random() * 999_999);

    const pool = await fetchPool(cfg.population);

    const targetList = pool.slice(0, cfg.targets);
    const targetIds = new Set(targetList.map((p) => p.id));

    // Top up to the requested population by repeating decoys. A seek book may
    // show the same creature twice; a decoy that duplicates a target may not,
    // because then two sprites answer to one HUD slot.
    const safe = pool.slice(cfg.targets).filter((p) => !targetIds.has(p.id));
    const decoys: Pokemon[] = [];
    const wanted = cfg.population - targetList.length;
    for (let i = 0; i < wanted && safe.length > 0; i++) {
      decoys.push(safe[i % safe.length]);
    }

    const props = generateProps(
      nextTheme,
      plate.w,
      plate.h,
      seed,
      cfg.propDensity
    );
    const mons = placeMons({
      targets: targetList,
      decoys,
      sceneW: plate.w,
      sceneH: plate.h,
      theme: nextTheme,
      seed,
      baseSize: MON_BASE_SIZE,
    });

    // One baseline-sorted pass over props and Pokemon together is what makes
    // occlusion real; sorting them separately is what broke it before.
    const merged: SceneItem[] = [...props, ...mons].sort((a, b) => a.z - b.z);

    setTheme(nextTheme);
    setItems(merged);
    setTargets(targetList);
    setFoundIds(new Set());
    setMisses(0);
    setHintsLeft(cfg.hints);
    setGameWon(false);
    setGameStarted(true);
    setSceneKey((k) => k + 1);
    setLoading(false);
    startTimer();
  }, [cfg, plate, startTimer]);

  const handleMonClick = useCallback(
    (mon: PlacedMon) => {
      if (gameWon) return;

      if (mon.isTarget && !foundIds.has(mon.pokemon.id)) {
        setFoundIds((prev) => {
          const next = new Set(prev);
          next.add(mon.pokemon.id);
          if (next.size === targets.length) {
            setGameWon(true);
            stopTimer();
          }
          return next;
        });
        if (hintedId === mon.pokemon.id) setHintedId(null);
      } else if (!mon.isTarget) {
        setMisses((m) => m + 1);
        setMissMark({
          x: mon.x,
          y: mon.y - (mon.height * mon.scale) / 2,
          n: Date.now(),
        });
      }
    },
    [gameWon, foundIds, targets.length, stopTimer, hintedId]
  );

  const handleMissClick = useCallback(() => {
    if (!gameStarted || gameWon) return;
    setMisses((m) => m + 1);
  }, [gameStarted, gameWon]);

  const giveUp = useCallback(() => {
    if (hintTimeout.current) clearTimeout(hintTimeout.current);
    if (missTimeout.current) clearTimeout(missTimeout.current);
    resetTimer();
    setGameStarted(false);
    setGameWon(false);
    setItems([]);
    setTargets([]);
    setFoundIds(new Set());
    setMisses(0);
    setHintedId(null);
    setMissMark(null);
  }, [resetTimer]);

  const handleHint = useCallback(() => {
    const remaining = targets.filter((t) => !foundIds.has(t.id));
    if (remaining.length === 0 || hintsLeft <= 0) return;

    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setHintedId(pick.id);
    setHintsLeft((h) => h - 1);

    if (hintTimeout.current) clearTimeout(hintTimeout.current);
    hintTimeout.current = setTimeout(() => setHintedId(null), HINT_MS);
  }, [targets, foundIds, hintsLeft]);

  useEffect(() => {
    if (!missMark) return;
    if (missTimeout.current) clearTimeout(missTimeout.current);
    missTimeout.current = setTimeout(() => setMissMark(null), 500);
  }, [missMark]);

  return (
    <>
      <PageMeta
        title="Hide & Seek"
        description="Spot the target Pokémon hidden among hundreds of others in an illustrated scene."
      />

      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
        <PageHeader
          title="Hide & Seek"
          subtitle="Find the target Pokémon hidden in the scene!"
        >
          <DifficultyPills
            equalWidth
            options={DIFFICULTIES}
            value={difficulty}
            onChange={(d) => {
              setDifficulty(d);
              setGameStarted(false);
              resetTimer();
            }}
          />
          {/*
            The primary action sits beside three difficulty pills, so it needs
            to out-weigh them rather than match them: larger, saturated, and
            lifted off the surface with a tinted shadow.
          */}
          <Button
            variant="primary"
            size="lg"
            onClick={startGame}
            disabled={loading}
            icon={
              gameStarted ? (
                <RotateCcw aria-hidden className="h-5 w-5" />
              ) : (
                <Eye aria-hidden className="h-5 w-5" />
              )
            }
            className="px-8 text-base font-bold tracking-wide shadow-[0_6px_20px_-4px_rgb(var(--color-primary)/0.55)] transition-[transform,filter,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-4px_rgb(var(--color-primary)/0.7)] active:translate-y-0"
          >
            {gameStarted ? "New Scene" : "Start Game"}
          </Button>
        </PageHeader>

        {loading && (
          <Skeleton
            className="mx-auto rounded-card"
            style={{ width: viewport.w, height: viewport.h }}
          />
        )}

        {gameStarted && !loading && (
          <>
            <SeekHud
              targets={targets}
              foundIds={foundIds}
              time={timer.formatted}
              misses={misses}
              sceneName={theme.name}
              hintsLeft={hintsLeft}
              onHint={handleHint}
              hintDisabled={hintsLeft <= 0 || gameWon}
              onGiveUp={giveUp}
            />

            {gameWon && (
              <WinBanner
                title="Found them all!"
                detail={`${timer.formatted} with ${misses} miss${
                  misses !== 1 ? "es" : ""
                }`}
              />
            )}

            <div className="mx-auto w-fit">
              <ZoomPan
                viewportW={viewport.w}
                viewportH={viewport.h}
                contentW={plate.w}
                contentH={plate.h}
                resetKey={sceneKey}
                animate={animate}
              >
                <div className="relative">
                  <SceneStage
                    theme={theme}
                    width={plate.w}
                    height={plate.h}
                    items={items}
                    foundIds={foundIds}
                    hintedId={hintedId}
                    onMonClick={handleMonClick}
                    onMissClick={handleMissClick}
                    animate={animate}
                  />
                  {missMark && (
                    <span
                      key={missMark.n}
                      aria-hidden
                      className="pointer-events-none absolute rounded-full border-4 border-primary opacity-80"
                      style={{
                        left: missMark.x - 26,
                        top: missMark.y - 26,
                        width: 52,
                        height: 52,
                        zIndex: 300_000,
                      }}
                    />
                  )}
                </div>
              </ZoomPan>
            </div>

            <p className="mt-3 text-center text-xs text-text-muted">
              Scroll or pinch to zoom · drag to pan · click a Pokémon to call it
            </p>
          </>
        )}

        {!gameStarted && !loading && (
          <Card
            variant="raised"
            padding="lg"
            className="text-center text-text-muted"
          >
            Choose a difficulty and click Start Game!
          </Card>
        )}
      </main>
    </>
  );
}

export default HideAndSeekScreen;
