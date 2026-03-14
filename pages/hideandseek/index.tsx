import Title from "@/components/layout/title";
import { getSpriteUrl, TYPE_COLORS } from "@/lib/pokemon";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
}

interface PlacedPokemon {
  pokemon: Pokemon;
  x: number;
  y: number;
  size: number;
  rotation: number;
  flipX: boolean;
  zIndex: number;
  isTarget: boolean;
  found: boolean;
}

interface Obstacle {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;
  flipX: boolean;
}

// ─── SVG obstacle renderers per theme ───────────────────────────────

function TreePine({ w, h }: { w: number; h: number }) {
  const trunkW = w * 0.15;
  const trunkH = h * 0.3;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect
        x={(w - trunkW) / 2}
        y={h - trunkH}
        width={trunkW}
        height={trunkH}
        fill="#5a3a1a"
        rx={2}
      />
      <polygon
        points={`${w / 2},${h * 0.05} ${w * 0.1},${h * 0.75} ${w * 0.9},${h * 0.75}`}
        fill="#1a5a1a"
      />
      <polygon
        points={`${w / 2},0 ${w * 0.15},${h * 0.55} ${w * 0.85},${h * 0.55}`}
        fill="#226a22"
      />
      <polygon
        points={`${w / 2},${h * 0.02} ${w * 0.22},${h * 0.38} ${w * 0.78},${h * 0.38}`}
        fill="#2a7a2a"
      />
    </svg>
  );
}

function TreeRound({ w, h }: { w: number; h: number }) {
  const trunkW = w * 0.12;
  const trunkH = h * 0.35;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect
        x={(w - trunkW) / 2}
        y={h * 0.55}
        width={trunkW}
        height={trunkH}
        fill="#6a4420"
        rx={3}
      />
      <ellipse cx={w / 2} cy={h * 0.38} rx={w * 0.45} ry={h * 0.38} fill="#2a6a18" />
      <ellipse cx={w * 0.35} cy={h * 0.32} rx={w * 0.28} ry={h * 0.28} fill="#338a22" />
      <ellipse cx={w * 0.65} cy={h * 0.35} rx={w * 0.25} ry={h * 0.26} fill="#2e7a1e" />
    </svg>
  );
}

function Bush({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <ellipse cx={w * 0.3} cy={h * 0.65} rx={w * 0.32} ry={h * 0.38} fill="#1e5a12" />
      <ellipse cx={w * 0.7} cy={h * 0.6} rx={w * 0.35} ry={h * 0.42} fill="#226816" />
      <ellipse cx={w * 0.5} cy={h * 0.5} rx={w * 0.3} ry={h * 0.35} fill="#2a7a1e" />
    </svg>
  );
}

function GrassTuft({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((xp, i) => (
        <path
          key={i}
          d={`M${w * xp},${h} Q${w * xp + (i % 2 ? 5 : -5)},${h * 0.2} ${w * xp + (i % 2 ? -3 : 3)},0`}
          stroke={i % 2 ? "#3a8a2a" : "#2a6a1a"}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Rock({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.1},${h * 0.9} L${w * 0.05},${h * 0.5} L${w * 0.25},${h * 0.15} L${w * 0.6},${h * 0.1} L${w * 0.85},${h * 0.3} L${w * 0.95},${h * 0.7} L${w * 0.8},${h * 0.95} Z`}
        fill="#5a5a6a"
      />
      <path
        d={`M${w * 0.25},${h * 0.15} L${w * 0.4},${h * 0.5} L${w * 0.85},${h * 0.3}`}
        fill="#6a6a7a"
        opacity={0.5}
      />
    </svg>
  );
}

function Boulder({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <ellipse cx={w * 0.5} cy={h * 0.6} rx={w * 0.48} ry={h * 0.4} fill="#4a4a5a" />
      <ellipse cx={w * 0.42} cy={h * 0.5} rx={w * 0.3} ry={h * 0.25} fill="#5a5a6a" opacity={0.6} />
    </svg>
  );
}

function Stalagmite({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.2},${h} L${w * 0.4},${h * 0.05} L${w * 0.55},${h * 0.15} L${w * 0.8},${h} Z`}
        fill="#3a3a5a"
      />
      <path
        d={`M${w * 0.4},${h * 0.05} L${w * 0.45},${h * 0.5} L${w * 0.55},${h * 0.15}`}
        fill="#4a4a6a"
        opacity={0.4}
      />
    </svg>
  );
}

function Crystal({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polygon
        points={`${w * 0.5},0 ${w * 0.7},${h * 0.35} ${w * 0.65},${h} ${w * 0.35},${h} ${w * 0.3},${h * 0.35}`}
        fill="#7a6aaa"
        opacity={0.8}
      />
      <polygon
        points={`${w * 0.5},0 ${w * 0.5},${h} ${w * 0.35},${h} ${w * 0.3},${h * 0.35}`}
        fill="#9a8acc"
        opacity={0.4}
      />
    </svg>
  );
}

function PalmTree({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.47},${h * 0.3} Q${w * 0.5},${h * 0.6} ${w * 0.52},${h}`}
        stroke="#7a5a2a"
        strokeWidth={w * 0.06}
        fill="none"
        strokeLinecap="round"
      />
      {[-70, -30, 10, 50, 90, 130, 170].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = w * 0.4;
        const ex = w * 0.48 + Math.cos(rad) * len;
        const ey = h * 0.25 + Math.sin(rad) * len * 0.5;
        return (
          <path
            key={i}
            d={`M${w * 0.48},${h * 0.25} Q${(w * 0.48 + ex) / 2 + (i % 2 ? 8 : -8)},${(h * 0.25 + ey) / 2 - 10} ${ex},${ey}`}
            stroke={i % 2 ? "#2a7a18" : "#1e6a12"}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function Driftwood({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M0,${h * 0.6} Q${w * 0.3},${h * 0.3} ${w * 0.6},${h * 0.5} Q${w * 0.8},${h * 0.6} ${w},${h * 0.45}`}
        stroke="#8a7a5a"
        strokeWidth={h * 0.2}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Tombstone({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.15},${h} L${w * 0.15},${h * 0.3} Q${w * 0.15},${h * 0.05} ${w * 0.5},${h * 0.05} Q${w * 0.85},${h * 0.05} ${w * 0.85},${h * 0.3} L${w * 0.85},${h} Z`}
        fill="#4a4a5a"
      />
      <line
        x1={w * 0.5}
        y1={h * 0.25}
        x2={w * 0.5}
        y2={h * 0.65}
        stroke="#3a3a4a"
        strokeWidth={2}
      />
      <line
        x1={w * 0.33}
        y1={h * 0.42}
        x2={w * 0.67}
        y2={h * 0.42}
        stroke="#3a3a4a"
        strokeWidth={2}
      />
    </svg>
  );
}

function DeadTree({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.45},${h} L${w * 0.43},${h * 0.4} L${w * 0.15},${h * 0.15} M${w * 0.43},${h * 0.4} L${w * 0.55},${h * 0.35} L${w * 0.85},${h * 0.1} M${w * 0.55},${h * 0.35} L${w * 0.55},${h}`}
        stroke="#3a2a3a"
        strokeWidth={w * 0.06}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LavaRock({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.05},${h * 0.95} L${w * 0.1},${h * 0.4} L${w * 0.3},${h * 0.1} L${w * 0.7},${h * 0.15} L${w * 0.9},${h * 0.45} L${w * 0.95},${h * 0.95} Z`}
        fill="#3a2218"
      />
      <path
        d={`M${w * 0.3},${h * 0.5} Q${w * 0.4},${h * 0.35} ${w * 0.55},${h * 0.55} Q${w * 0.65},${h * 0.7} ${w * 0.5},${h * 0.8}`}
        stroke="#ff6a20"
        strokeWidth={2}
        fill="none"
        opacity={0.6}
      />
    </svg>
  );
}

function Ember({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`M${w * 0.5},0 Q${w * 0.8},${h * 0.3} ${w * 0.6},${h * 0.6} Q${w * 0.7},${h * 0.8} ${w * 0.5},${h} Q${w * 0.3},${h * 0.8} ${w * 0.4},${h * 0.6} Q${w * 0.2},${h * 0.3} ${w * 0.5},0 Z`}
        fill="#cc4400"
        opacity={0.7}
      />
      <path
        d={`M${w * 0.5},${h * 0.2} Q${w * 0.65},${h * 0.45} ${w * 0.55},${h * 0.65} Q${w * 0.45},${h * 0.75} ${w * 0.5},${h * 0.85} Q${w * 0.4},${h * 0.6} ${w * 0.45},${h * 0.45} Q${w * 0.35},${h * 0.35} ${w * 0.5},${h * 0.2} Z`}
        fill="#ff8800"
        opacity={0.6}
      />
    </svg>
  );
}

// ─── Obstacle component router ──────────────────────────────────────

function ObstacleRenderer({ type, w, h }: { type: string; w: number; h: number }) {
  switch (type) {
    case "pine": return <TreePine w={w} h={h} />;
    case "tree": return <TreeRound w={w} h={h} />;
    case "bush": return <Bush w={w} h={h} />;
    case "grass": return <GrassTuft w={w} h={h} />;
    case "rock": return <Rock w={w} h={h} />;
    case "boulder": return <Boulder w={w} h={h} />;
    case "stalagmite": return <Stalagmite w={w} h={h} />;
    case "crystal": return <Crystal w={w} h={h} />;
    case "palm": return <PalmTree w={w} h={h} />;
    case "driftwood": return <Driftwood w={w} h={h} />;
    case "tombstone": return <Tombstone w={w} h={h} />;
    case "deadtree": return <DeadTree w={w} h={h} />;
    case "lavarock": return <LavaRock w={w} h={h} />;
    case "ember": return <Ember w={w} h={h} />;
    default: return <Bush w={w} h={h} />;
  }
}

// ─── Theme config ───────────────────────────────────────────────────

type Theme = {
  name: string;
  emoji: string;
  bgGradient: string;
  obstacles: { type: string; minW: number; maxW: number; minH: number; maxH: number; weight: number }[];
  obstacleCount: [number, number]; // [min, max]
};

const THEMES: Theme[] = [
  {
    name: "Viridian Forest",
    emoji: "🌲",
    bgGradient: "linear-gradient(180deg, #1a3a2a 0%, #2d5a1e 40%, #1e4a15 100%)",
    obstacles: [
      { type: "pine", minW: 70, maxW: 130, minH: 120, maxH: 220, weight: 3 },
      { type: "tree", minW: 80, maxW: 140, minH: 100, maxH: 180, weight: 3 },
      { type: "bush", minW: 60, maxW: 120, minH: 40, maxH: 80, weight: 5 },
      { type: "grass", minW: 30, maxW: 60, minH: 30, maxH: 60, weight: 6 },
      { type: "rock", minW: 40, maxW: 70, minH: 35, maxH: 60, weight: 2 },
    ],
    obstacleCount: [40, 70],
  },
  {
    name: "Mt. Moon Cave",
    emoji: "🪨",
    bgGradient: "linear-gradient(180deg, #1a1a2e 0%, #2a2a4a 40%, #1a1a30 100%)",
    obstacles: [
      { type: "stalagmite", minW: 40, maxW: 80, minH: 80, maxH: 180, weight: 4 },
      { type: "boulder", minW: 60, maxW: 120, minH: 50, maxH: 90, weight: 4 },
      { type: "crystal", minW: 25, maxW: 50, minH: 50, maxH: 100, weight: 3 },
      { type: "rock", minW: 50, maxW: 90, minH: 40, maxH: 70, weight: 5 },
    ],
    obstacleCount: [35, 60],
  },
  {
    name: "Cerulean Beach",
    emoji: "🏖️",
    bgGradient: "linear-gradient(180deg, #87ceeb 0%, #5ba3d9 25%, #d4a960 65%, #c49550 100%)",
    obstacles: [
      { type: "palm", minW: 80, maxW: 140, minH: 140, maxH: 240, weight: 3 },
      { type: "rock", minW: 50, maxW: 100, minH: 40, maxH: 70, weight: 3 },
      { type: "driftwood", minW: 70, maxW: 130, minH: 25, maxH: 45, weight: 3 },
      { type: "bush", minW: 50, maxW: 90, minH: 35, maxH: 60, weight: 4 },
      { type: "grass", minW: 25, maxW: 50, minH: 25, maxH: 45, weight: 4 },
    ],
    obstacleCount: [30, 55],
  },
  {
    name: "Lavender Night",
    emoji: "👻",
    bgGradient: "linear-gradient(180deg, #0d0d1a 0%, #1a0a2e 40%, #2a1a3e 100%)",
    obstacles: [
      { type: "tombstone", minW: 40, maxW: 70, minH: 55, maxH: 95, weight: 5 },
      { type: "deadtree", minW: 70, maxW: 130, minH: 110, maxH: 200, weight: 3 },
      { type: "rock", minW: 45, maxW: 80, minH: 35, maxH: 65, weight: 3 },
      { type: "bush", minW: 50, maxW: 90, minH: 35, maxH: 60, weight: 3 },
    ],
    obstacleCount: [35, 60],
  },
  {
    name: "Volcano Path",
    emoji: "🌋",
    bgGradient: "linear-gradient(180deg, #2a1a0a 0%, #4a2a1a 30%, #3a1a0a 70%, #5a2a0a 100%)",
    obstacles: [
      { type: "lavarock", minW: 60, maxW: 110, minH: 50, maxH: 90, weight: 5 },
      { type: "boulder", minW: 55, maxW: 100, minH: 45, maxH: 80, weight: 3 },
      { type: "ember", minW: 25, maxW: 50, minH: 35, maxH: 65, weight: 4 },
      { type: "rock", minW: 50, maxW: 90, minH: 40, maxH: 70, weight: 3 },
    ],
    obstacleCount: [35, 60],
  },
];

// ─── Difficulty ─────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard";
const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { targets: number; decoys: number; sceneWidth: number; sceneHeight: number }
> = {
  easy: { targets: 3, decoys: 35, sceneWidth: 1200, sceneHeight: 800 },
  medium: { targets: 5, decoys: 60, sceneWidth: 1600, sceneHeight: 1000 },
  hard: { targets: 7, decoys: 100, sceneWidth: 2000, sceneHeight: 1200 },
};

// ─── Seeded random for stable obstacle positions ────────────────────

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Main component ─────────────────────────────────────────────────

function HideAndSeekScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [placed, setPlaced] = useState<PlacedPokemon[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [targets, setTargets] = useState<Pokemon[]>([]);
  const [foundIds, setFoundIds] = useState<Set<number>>(new Set());
  const [misclicks, setMisclicks] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState(0);
  const [clickFeedback, setClickFeedback] = useState<{
    x: number;
    y: number;
    correct: boolean;
  } | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const cfg = DIFFICULTY_CONFIG[difficulty];

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  function hasOverlap(
    x: number,
    y: number,
    size: number,
    existing: { x: number; y: number; size: number }[]
  ): boolean {
    const minDist = size * 0.4;
    return existing.some((e) => {
      const dx = x - e.x;
      const dy = y - e.y;
      return Math.sqrt(dx * dx + dy * dy) < minDist + e.size * 0.4;
    });
  }

  function generateObstacles(
    theme: Theme,
    sceneW: number,
    sceneH: number,
    seed: number
  ): Obstacle[] {
    const rng = mulberry32(seed);
    const [minCount, maxCount] = theme.obstacleCount;
    const count = Math.floor(rng() * (maxCount - minCount)) + minCount;

    // Build weighted pool
    const pool: typeof theme.obstacles = [];
    for (const o of theme.obstacles) {
      for (let i = 0; i < o.weight; i++) pool.push(o);
    }

    const obs: Obstacle[] = [];
    for (let i = 0; i < count; i++) {
      const template = pool[Math.floor(rng() * pool.length)];
      const w = template.minW + rng() * (template.maxW - template.minW);
      const h = template.minH + rng() * (template.maxH - template.minH);
      const x = rng() * (sceneW - w);
      const y = rng() * (sceneH - h * 0.5);

      obs.push({
        type: template.type,
        x,
        y,
        width: w,
        height: h,
        zIndex: Math.floor(y + h), // bottom edge = depth
        rotation: (rng() - 0.5) * 8,
        flipX: rng() > 0.5,
      });
    }

    return obs;
  }

  const startGame = useCallback(async () => {
    setLoading(true);
    const total = cfg.targets + cfg.decoys;
    const newTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const newSeed = Math.floor(Math.random() * 999999);
    setTheme(newTheme);
    setSeed(newSeed);

    // Generate obstacles
    const obs = generateObstacles(newTheme, cfg.sceneWidth, cfg.sceneHeight, newSeed);
    setObstacles(obs);

    const res = await fetch(`/api/pokemon?random=${Math.min(total, 100)}`);
    const data = await res.json();
    let allPokemon: Pokemon[] = data.pokemon;

    if (total > 100) {
      const res2 = await fetch(`/api/pokemon?random=${total - 100}`);
      const data2 = await res2.json();
      allPokemon = [...allPokemon, ...data2.pokemon];
    }

    const targetPokemon = allPokemon.slice(0, cfg.targets);
    const decoyPokemon = allPokemon.slice(cfg.targets);

    const placedList: PlacedPokemon[] = [];
    const positions: { x: number; y: number; size: number }[] = [];

    const margin = 80;
    for (const p of targetPokemon) {
      let x: number, y: number;
      const size = 48 + Math.random() * 16;
      let attempts = 0;
      do {
        x = margin + Math.random() * (cfg.sceneWidth - margin * 2);
        y = margin + Math.random() * (cfg.sceneHeight - margin * 2);
        attempts++;
      } while (hasOverlap(x, y, size, positions) && attempts < 200);

      positions.push({ x, y, size });
      placedList.push({
        pokemon: p,
        x,
        y,
        size,
        rotation: (Math.random() - 0.5) * 20,
        flipX: Math.random() > 0.5,
        zIndex: Math.floor(y),
        isTarget: true,
        found: false,
      });
    }

    for (const p of decoyPokemon) {
      let x: number, y: number;
      const size = 40 + Math.random() * 28;
      let attempts = 0;
      do {
        x = 20 + Math.random() * (cfg.sceneWidth - 40);
        y = 20 + Math.random() * (cfg.sceneHeight - 40);
        attempts++;
      } while (hasOverlap(x, y, size, positions) && attempts < 100);

      positions.push({ x, y, size });
      placedList.push({
        pokemon: p,
        x,
        y,
        size,
        rotation: (Math.random() - 0.5) * 15,
        flipX: Math.random() > 0.5,
        zIndex: Math.floor(y),
        isTarget: false,
        found: false,
      });
    }

    placedList.sort((a, b) => a.zIndex - b.zIndex);

    setPlaced(placedList);
    setTargets(targetPokemon);
    setFoundIds(new Set());
    setMisclicks(0);
    setGameWon(false);
    setTimer(0);
    setTimerActive(true);
    setGameStarted(true);
    setLoading(false);
  }, [difficulty, cfg]);

  const handlePokemonClick = (p: PlacedPokemon) => {
    if (gameWon) return;

    if (p.isTarget && !foundIds.has(p.pokemon.id)) {
      const newFound = new Set(foundIds);
      newFound.add(p.pokemon.id);
      setFoundIds(newFound);

      setClickFeedback({ x: p.x, y: p.y, correct: true });
      setTimeout(() => setClickFeedback(null), 600);

      if (newFound.size === targets.length) {
        setGameWon(true);
        setTimerActive(false);
      }
    } else if (!p.isTarget) {
      setMisclicks((m) => m + 1);
      setClickFeedback({ x: p.x, y: p.y, correct: false });
      setTimeout(() => setClickFeedback(null), 600);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Merge pokemon + obstacles into one depth-sorted render list
  const renderItems = useMemo(() => {
    const items: {
      key: string;
      zIndex: number;
      type: "pokemon" | "obstacle";
      data: PlacedPokemon | Obstacle;
    }[] = [];

    placed.forEach((p, i) => {
      items.push({
        key: `p-${p.pokemon.id}-${i}`,
        zIndex: p.zIndex,
        type: "pokemon",
        data: p,
      });
    });

    obstacles.forEach((o, i) => {
      items.push({
        key: `o-${i}`,
        zIndex: o.zIndex,
        type: "obstacle",
        data: o,
      });
    });

    items.sort((a, b) => a.zIndex - b.zIndex);
    return items;
  }, [placed, obstacles]);

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Title
        name="Hide & Seek"
        subtitle="Find the target Pokémon hidden in the scene!"
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
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
            {d} (find {DIFFICULTY_CONFIG[d].targets})
          </button>
        ))}
        <button
          onClick={startGame}
          className="px-6 py-2 rounded-xl bg-[var(--color-green)] text-white font-semibold hover:brightness-110 transition-all"
        >
          {gameStarted ? "New Scene" : "Start Game"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {gameStarted && !loading && (
        <>
          {/* Target bar */}
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-4 border border-white/10 mb-4">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">
                  Find:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {targets.map((t) => {
                    const isFound = foundIds.has(t.id);
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                          isFound
                            ? "bg-[var(--color-green)]/15 border-[var(--color-green)]/40"
                            : "bg-[var(--color-bg-secondary)] border-white/10"
                        }`}
                      >
                        <Image
                          src={getSpriteUrl(t.id)}
                          alt={t.name}
                          width={28}
                          height={28}
                          unoptimized
                          className={isFound ? "opacity-50" : ""}
                        />
                        <span
                          className={`text-sm font-semibold capitalize ${
                            isFound
                              ? "line-through text-[var(--color-green)]/60"
                              : "text-white"
                          }`}
                        >
                          {t.name}
                        </span>
                        {isFound && (
                          <span className="text-[var(--color-green)]">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-5 text-sm">
                <div className="text-center">
                  <span className="text-[var(--color-text-muted)] text-xs uppercase block">
                    Time
                  </span>
                  <span className="text-white font-bold font-mono">
                    {formatTime(timer)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[var(--color-text-muted)] text-xs uppercase block">
                    Misses
                  </span>
                  <span className="text-[var(--color-accent)] font-bold">
                    {misclicks}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[var(--color-text-muted)] text-xs uppercase block">
                    Scene
                  </span>
                  <span className="text-white font-bold">
                    {theme.emoji} {theme.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Win banner */}
          {gameWon && (
            <div className="text-center mb-4 p-5 rounded-2xl bg-[var(--color-green)]/10 border border-[var(--color-green)]/30">
              <p className="text-2xl font-bold text-[var(--color-green)] mb-1">
                🎉 Found them all!
              </p>
              <p className="text-[var(--color-text-muted)]">
                {formatTime(timer)} with {misclicks} miss
                {misclicks !== 1 ? "es" : ""}
              </p>
            </div>
          )}

          {/* Scene viewport */}
          <div
            ref={sceneRef}
            className="relative overflow-auto rounded-2xl border-2 border-white/10 cursor-crosshair"
            style={{
              height: "70vh",
              maxHeight: "700px",
            }}
          >
            <div
              className="relative select-none"
              style={{
                width: cfg.sceneWidth,
                height: cfg.sceneHeight,
                background: theme.bgGradient,
              }}
            >
              {/* Depth-sorted render: pokemon and obstacles interleaved */}
              {renderItems.map((item) => {
                if (item.type === "obstacle") {
                  const o = item.data as Obstacle;
                  return (
                    <div
                      key={item.key}
                      className="absolute pointer-events-none"
                      style={{
                        left: o.x,
                        top: o.y,
                        width: o.width,
                        height: o.height,
                        zIndex: o.zIndex,
                        transform: `rotate(${o.rotation}deg) scaleX(${o.flipX ? -1 : 1})`,
                      }}
                    >
                      <ObstacleRenderer
                        type={o.type}
                        w={o.width}
                        h={o.height}
                      />
                    </div>
                  );
                } else {
                  const p = item.data as PlacedPokemon;
                  const isFound = p.isTarget && foundIds.has(p.pokemon.id);
                  return (
                    <button
                      key={item.key}
                      onClick={() => handlePokemonClick(p)}
                      className={`absolute transition-all duration-200 rounded-full ${
                        isFound
                          ? "ring-3 ring-[var(--color-green)] ring-offset-2 ring-offset-transparent scale-110"
                          : "hover:scale-125 hover:brightness-110"
                      }`}
                      style={{
                        left: p.x - p.size / 2,
                        top: p.y - p.size / 2,
                        width: p.size,
                        height: p.size,
                        zIndex: p.zIndex,
                        transform: `rotate(${p.rotation}deg) scaleX(${
                          p.flipX ? -1 : 1
                        })`,
                      }}
                    >
                      <Image
                        src={getSpriteUrl(p.pokemon.id)}
                        alt=""
                        fill
                        className="object-contain drop-shadow-md pointer-events-none"
                        unoptimized
                        draggable={false}
                      />
                    </button>
                  );
                }
              })}

              {/* Click feedback */}
              {clickFeedback && (
                <div
                  className="absolute pointer-events-none animate-fade-in-up"
                  style={{
                    left: clickFeedback.x - 16,
                    top: clickFeedback.y - 40,
                    zIndex: 9999,
                  }}
                >
                  <span
                    className={`text-2xl font-bold ${
                      clickFeedback.correct
                        ? "text-[var(--color-green)]"
                        : "text-[var(--color-accent)]"
                    }`}
                  >
                    {clickFeedback.correct ? "✓" : "✗"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
            Scroll to explore the full scene. Click a Pokémon you think is a
            target!
          </p>
        </>
      )}

      {!gameStarted && !loading && (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          Choose a difficulty and click Start Game!
        </div>
      )}
    </main>
  );
}

export default HideAndSeekScreen;