import Title from "@/components/layout/title";
import { useCallback, useEffect, useState } from "react";

const GRID_SIZE = 14;
const WORD_COUNT = 8;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <Title
        name="Word Search"
        subtitle="Find the hidden Pokémon names!"
      />

      <div className="flex justify-center mb-6">
        <button
          onClick={generatePuzzle}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:brightness-110 transition-all"
        >
          New Puzzle
        </button>
      </div>

      {gameComplete && (
        <div className="text-center mb-6 p-4 rounded-2xl bg-[var(--color-green)]/10 border border-[var(--color-green)]/30">
          <p className="text-xl font-bold text-[var(--color-green)]">
            🎉 All words found!
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
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
            <div
              className="inline-grid gap-0.5 bg-[var(--color-bg-card)] p-3 rounded-2xl border border-white/10"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              }}
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
          </div>

          {/* Word bank */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-5 border border-white/10 min-w-[200px]">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
              Word Bank
            </h3>
            <ul className="space-y-2">
              {placedWords.map((pw) => (
                <li
                  key={pw.word}
                  className={`text-sm font-mono font-medium transition-all ${
                    pw.found
                      ? "text-[var(--color-green)] line-through opacity-60"
                      : "text-white"
                  }`}
                >
                  {pw.word}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[var(--color-text-muted)] mt-4">
              {placedWords.filter((w) => w.found).length} / {placedWords.length}{" "}
              found
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default WordsearchScreen;
