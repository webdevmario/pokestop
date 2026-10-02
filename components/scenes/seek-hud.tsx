import { Lightbulb } from "lucide-react";

import { Button, Card, StatTile } from "@/components/ui";
import { getSpriteUrl, type Pokemon } from "@/lib/pokemon";

interface Props {
  targets: Pokemon[];
  foundIds: Set<number>;
  time: string;
  misses: number;
  sceneName: string;
  hintsLeft: number;
  onHint: () => void;
  hintDisabled: boolean;
}

/**
 * Always-visible progress strip. Each target shows as a grayscale silhouette
 * and resolves to full colour once found, so progress is readable at a glance
 * without reading names.
 */
function SeekHud({
  targets,
  foundIds,
  time,
  misses,
  sceneName,
  hintsLeft,
  onHint,
  hintDisabled,
}: Props) {
  return (
    <Card variant="bar" className="mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-label font-semibold uppercase text-text-muted">
            Find
          </span>
          <ul className="flex flex-wrap gap-2">
            {targets.map((t) => {
              const found = foundIds.has(t.id);
              return (
                <li
                  key={t.id}
                  title={found ? t.name : "Still hidden"}
                  className={`flex h-11 w-11 items-center justify-center rounded-control border transition-colors ${
                    found
                      ? "border-success/40 bg-success/15"
                      : "border-border/10 bg-surface"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny
                      game sprite, sized exactly; next/image adds no value. */}
                  <img
                    src={getSpriteUrl(t.id)}
                    alt={found ? t.name : "Hidden target"}
                    width={36}
                    height={36}
                    className={`h-9 w-9 object-contain transition-[filter,opacity] duration-300 ${
                      found ? "" : "opacity-70 brightness-50 grayscale"
                    }`}
                  />
                </li>
              );
            })}
          </ul>
          <span className="text-sm font-semibold text-text-muted">
            {foundIds.size}/{targets.length}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <StatTile label="Time" value={time} size="sm" mono />
          <StatTile label="Misses" value={misses} size="sm" tone="primary" />
          <StatTile label="Scene" value={sceneName} size="sm" />
          <Button
            size="sm"
            onClick={onHint}
            disabled={hintDisabled}
            icon={<Lightbulb aria-hidden className="h-4 w-4" />}
          >
            Hint ({hintsLeft})
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default SeekHud;
