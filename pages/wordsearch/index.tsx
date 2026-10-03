import { RefreshCw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import PageMeta from "@/components/layout/page-meta";
import { Button, Card, PageHeader, Skeleton, WinBanner } from "@/components/ui";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const GRID_SIZE = 14;
const WORD_COUNT = 8;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Soft hues for the found-word overlays, assigned by word index so a word keeps
 * its colour for the life of the puzzle. Chosen to read on the dark grid at low
 * opacity — this is annotation, so none of them compete with the letters.
 */
const OVERLAY_COLORS = [
  "#f0a3a3", // rose
  "#f0cf8f", // amber
  "#9fd8a4", // green
  "#8fd4d0", // teal
  "#a3bdf0", // blue
  "#c4a8ee", // violet
];

/**
 * Vibration patterns. Android honours these; iOS Safari has no Vibration API at
 * all, so `vibrate` is simply absent and both calls no-op.
 */
const BUZZ_FOUND = [20, 30, 40];
const BUZZ_WIN = [20, 40, 20, 40, 100];

function buzz(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Blocked by permissions policy (e.g. a cross-origin frame). Non-essential.
  }
}

type Direction = [number, number];
const DIRECTIONS: Direction[] = [
  [0, 1],   // right
  [0, -1],  // left
  [1, 0],   // down
  [-1, 0],  // up
  [1, 1],   // down-right
  [-1, -1], // up-left
  [1, -1],  // down-left
  [-1, 1],  // up-right
];

interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  found: boolean;
}

interface CellData {
  letter: string;
  row: number;
  col: number;
}

function WordsearchScreen() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedCells, setSelectedCells] = useState<string[]>([]); // "row-col"
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const reduced = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  // Cell size comes from a clamp(), so it is measured rather than recomputed:
  // `stride` is cell + gap, and the offsets absorb the grid's padding.
  const [metrics, setMetrics] = useState<{
    cell: number;
    stride: number;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    function measure() {
      const grid = gridRef.current;
      if (!grid || grid.children.length < 2) return;

      const first = grid.children[0] as HTMLElement;
      const second = grid.children[1] as HTMLElement;
      const cell = first.offsetWidth;
      const stride = second.offsetLeft - first.offsetLeft || cell;

      setMetrics({
        cell,
        stride,
        left: first.offsetLeft,
        top: first.offsetTop,
        width: grid.offsetWidth,
        height: grid.offsetHeight,
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [grid]);

  const generatePuzzle = useCallback(async () => {
    setLoading(true);
    setSelectedCells([]);
    setFoundCells(new Set());
    setGameComplete(false);

    // Fetch random pokemon names
    const res = await fetch(`/api/pokemon?random=20`);
    const data = await res.json();

    // Pick names that fit well (3-10 letters, no hyphens)
    const candidateNames: string[] = data.pokemon
      .map((p: any) => p.name.toUpperCase())
      .filter(
        (name: string) =>
          name.length >= 3 &&
          name.length <= 10 &&
          !name.includes("-") &&
          !name.includes(" ") &&
          !name.includes(".")
      );

    // Build empty grid
    const newGrid: string[][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "")
    );

    const placed: PlacedWord[] = [];

    // Try to place each word
    for (const word of candidateNames) {
      if (placed.length >= WORD_COUNT) break;

      let didPlace = false;

      // Try many random positions/directions
      for (let attempt = 0; attempt < 100; attempt++) {
        const dir =
          DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);

        if (canPlace(newGrid, word, startRow, startCol, dir)) {
          placeWord(newGrid, word, startRow, startCol, dir);
          placed.push({
            word,
            startRow,
            startCol,
            direction: dir,
            found: false,
          });
          didPlace = true;
          break;
        }
      }
    }

    // Fill empty cells with random letters
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c]) {
          newGrid[r][c] = LETTERS[Math.floor(Math.random() * 26)];
        }
      }
    }

    setGrid(newGrid);
    setPlacedWords(placed);
    setLoading(false);
  }, []);

  function canPlace(
    grid: string[][],
    word: string,
    row: number,
    col: number,
    dir: Direction
  ): boolean {
    for (let i = 0; i < word.length; i++) {
      const r = row + dir[0] * i;
      const c = col + dir[1] * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  function placeWord(
    grid: string[][],
    word: string,
    row: number,
    col: number,
    dir: Direction
  ) {
    for (let i = 0; i < word.length; i++) {
      grid[row + dir[0] * i][col + dir[1] * i] = word[i];
    }
  }

  // Get all cells for a placed word
  function getWordCells(pw: PlacedWord): string[] {
    const cells: string[] = [];
    for (let i = 0; i < pw.word.length; i++) {
      cells.push(
        `${pw.startRow + pw.direction[0] * i}-${pw.startCol + pw.direction[1] * i}`
      );
    }
    return cells;
  }

  // Check if current selection matches any word
  function checkSelection(cells: string[]) {
    for (const pw of placedWords) {
      if (pw.found) continue;
      const wordCells = getWordCells(pw);

      // Check forward and reverse
      const fwd = wordCells.join(",");
      const rev = [...wordCells].reverse().join(",");
      const sel = cells.join(",");

      if (sel === fwd || sel === rev) {
        return pw;
      }
    }
    return null;
  }

  // Selection must be in a straight line
  function isValidSelection(cells: string[]): boolean {
    if (cells.length < 2) return true;

    const [r0, c0] = cells[0].split("-").map(Number);
    const [r1, c1] = cells[1].split("-").map(Number);
    const dr = Math.sign(r1 - r0);
    const dc = Math.sign(c1 - c0);

    for (let i = 1; i < cells.length; i++) {
      const [r, c] = cells[i].split("-").map(Number);
      const [pr, pc] = cells[i - 1].split("-").map(Number);
      if (r - pr !== dr || c - pc !== dc) return false;
    }
    return true;
  }

  const handleCellMouseDown = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setIsSelecting(true);
    setSelectedCells([key]);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return;
    const key = `${row}-${col}`;
    if (selectedCells.includes(key)) return;

    const newSelection = [...selectedCells, key];
    if (isValidSelection(newSelection)) {
      setSelectedCells(newSelection);
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Check if selection matches a word
    const matched = checkSelection(selectedCells);
    if (matched) {
      matched.found = true;
      const newFound = new Set(foundCells);
      selectedCells.forEach((c) => newFound.add(c));
      setFoundCells(newFound);
      setPlacedWords([...placedWords]);

      // Check if all found
      const allFound = placedWords.every((pw) => pw.found);
      if (allFound) {
        setGameComplete(true);
        buzz(BUZZ_WIN);
      } else {
        buzz(BUZZ_FOUND);
      }
    }

    setSelectedCells([]);
  };

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  // Touch support
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    if (el && el.dataset?.row && el.dataset?.col) {
      handleCellMouseEnter(
        parseInt(el.dataset.row),
        parseInt(el.dataset.col)
      );
    }
  };

  return (
    <>
      <PageMeta
        title="Word Search"
        description="Procedurally generated word search puzzles with Pokémon names hidden in the grid."
      />

      <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
        <PageHeader
          title="Word Search"
          subtitle="Find the hidden Pokémon names!"
        >
          <Button
            variant="primary"
            onClick={generatePuzzle}
            icon={<RefreshCw aria-hidden className="h-4 w-4" />}
          >
            New Puzzle
          </Button>
        </PageHeader>

      {gameComplete && <WinBanner title="All words found!" />}

      {loading ? (
        <div className="flex flex-col items-start justify-center gap-8 lg:flex-row">
          <Skeleton className="h-[500px] w-[500px] max-w-full rounded-card" />
          <Skeleton className="h-[320px] w-[200px] rounded-card" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Grid */}
          <div
            className="select-none touch-none"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            <div className="relative inline-block">
            <div
              ref={gridRef}
              className="inline-grid gap-0.5 rounded-card border border-border/10 bg-surface-raised p-3"
              style={
                {
                  // Fits the grid to narrow viewports; capped so desktop is
                  // unchanged. Accounts for page padding and the grid's own.
                  "--ws-cell": `clamp(17px, calc((100vw - 5rem) / ${GRID_SIZE}), 32px)`,
                  gridTemplateColumns: `repeat(${GRID_SIZE}, var(--ws-cell))`,
                } as React.CSSProperties
              }
            >
              {grid.map((row, ri) =>
                row.map((cell, ci) => {
                  const key = `${ri}-${ci}`;
                  const isFound = foundCells.has(key);
                  const isSelected = selectedCells.includes(key);

                  return (
                    <div
                      key={key}
                      data-row={ri}
                      data-col={ci}
                      onMouseDown={() => handleCellMouseDown(ri, ci)}
                      onMouseEnter={() => handleCellMouseEnter(ri, ci)}
                      onTouchStart={() => {
                        handleCellMouseDown(ri, ci);
                      }}
                      className={`ws-cell ${isFound ? "found" : ""} ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      {cell}
                    </div>
                  );
                })
              )}
            </div>

            {/*
              Found-word annotations. One rounded outline per word, rotated to
              the word's direction, so horizontals, verticals and diagonals all
              use the same shape. Sits above the grid and takes no pointer
              events, so dragging still selects normally.
            */}
            {metrics && (
              <svg
                aria-hidden
                className="pointer-events-none absolute left-0 top-0"
                width={metrics.width}
                height={metrics.height}
              >
                {placedWords.map((pw, i) => {
                  if (!pw.found) return null;

                  const color = OVERLAY_COLORS[i % OVERLAY_COLORS.length];
                  const steps = pw.word.length - 1;
                  const centre = (row: number, col: number) => ({
                    x: metrics.left + col * metrics.stride + metrics.cell / 2,
                    y: metrics.top + row * metrics.stride + metrics.cell / 2,
                  });

                  const a = centre(pw.startRow, pw.startCol);
                  const b = centre(
                    pw.startRow + pw.direction[0] * steps,
                    pw.startCol + pw.direction[1] * steps
                  );

                  const dx = b.x - a.x;
                  const dy = b.y - a.y;
                  const length = Math.hypot(dx, dy);
                  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                  const thickness = metrics.cell * 0.86;

                  return (
                    <g
                      key={pw.word}
                      transform={`translate(${a.x} ${a.y}) rotate(${angle})`}
                      style={
                        reduced
                          ? undefined
                          : { animation: "ws-found-in 220ms ease-out both" }
                      }
                    >
                      <rect
                        x={-thickness / 2}
                        y={-thickness / 2}
                        width={length + thickness}
                        height={thickness}
                        rx={thickness / 2}
                        fill={color}
                        fillOpacity={0.1}
                        stroke={color}
                        strokeOpacity={0.55}
                        strokeWidth={1.5}
                      />
                    </g>
                  );
                })}
              </svg>
            )}
            </div>
          </div>

          {/* Word bank */}
          <Card variant="raised" padding="lg" className="min-w-[200px]">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Word Bank
            </h3>
            <ul className="space-y-2">
              {placedWords.map((pw) => (
                <li
                  key={pw.word}
                  className={`font-mono text-sm font-medium transition-colors ${
                    pw.found
                      ? "text-success line-through opacity-60"
                      : "text-text"
                  }`}
                >
                  {pw.word}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-muted">
              {placedWords.filter((w) => w.found).length} / {placedWords.length}{" "}
              found
            </p>
          </Card>
        </div>
      )}
      </main>
    </>
  );
}

export default WordsearchScreen;
