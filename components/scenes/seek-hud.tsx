import { Flag, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

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
  /** Abandons the round and returns to the picker. No score penalty. */
  onGiveUp: () => void;
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
  onGiveUp,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  // Don't leave the confirm armed if the user ignores it.
  useEffect(() => {
    if (!confirming) return;
    const timeout = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timeout);
  }, [confirming]);

  return (
    <Card variant="bar" className="mb-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
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

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <StatTile label="Time" value={time} size="sm" mono />
          <StatTile label="Misses" value={misses} size="sm" tone="primary" />
          <StatTile
            label="Scene"
            value={<span className="whitespace-nowrap">{sceneName}</span>}
            size="sm"
          />
          <Button
            size="sm"
            onClick={onHint}
            disabled={hintDisabled}
            icon={<Lightbulb aria-hidden className="h-4 w-4" />}
          >
            Hint ({hintsLeft})
          </Button>

          {confirming ? (
            <span className="flex items-center gap-2">
              <span className="text-sm text-text-muted">Give up?</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setConfirming(false);
                  onGiveUp();
                }}
              >
                Yes
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                No
              </Button>
            </span>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirming(true)}
              icon={<Flag aria-hidden className="h-4 w-4" />}
            >
              Give Up
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default SeekHud;
