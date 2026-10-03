import { Flag, Lightbulb } from "lucide-react";
import { useState } from "react";

import { Button, Card, Modal } from "@/components/ui";
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

/** Label-over-value readout, sized for a dense bar rather than a page. */
function Readout({
  label,
  value,
  tone = "text",
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "text" | "primary";
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col justify-center leading-tight">
      <span className="text-label uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <span
        className={`text-base font-bold ${
          tone === "primary" ? "text-primary" : "text-text"
        } ${mono ? "font-mono tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Always-visible progress strip.
 *
 * Laid out as three clusters — progress, readouts, actions — separated by
 * dividers rather than by guesswork about spacing. Everything inside a cluster
 * shares one row and one baseline, so the bar reads as grouped controls
 * instead of a line of loose items.
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card variant="bar" className="mb-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          {/* Progress */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="shrink-0 text-label font-semibold uppercase tracking-wide text-text-muted">
              Find
            </span>
            <ul className="flex flex-wrap items-center gap-1.5">
              {targets.map((t) => {
                const found = foundIds.has(t.id);
                return (
                  <li
                    key={t.id}
                    title={found ? t.name : "Still hidden"}
                    className={`flex h-10 w-10 items-center justify-center rounded-control border transition-colors ${
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
                      width={32}
                      height={32}
                      className={`h-8 w-8 object-contain transition-[filter,opacity] duration-300 ${
                        found ? "" : "opacity-70 brightness-50 grayscale"
                      }`}
                    />
                  </li>
                );
              })}
            </ul>
            <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-text-muted">
              {foundIds.size}/{targets.length}
            </span>
          </div>

          {/* Readouts */}
          <div className="flex items-center gap-5 border-border/10 sm:border-l sm:pl-5">
            <Readout label="Time" value={time} mono />
            <Readout label="Misses" value={misses} tone="primary" />
            <Readout
              label="Scene"
              value={<span className="whitespace-nowrap">{sceneName}</span>}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 border-border/10 sm:border-l sm:pl-5">
            <Button
              size="md"
              onClick={onHint}
              disabled={hintDisabled}
              icon={<Lightbulb aria-hidden className="h-4 w-4 shrink-0" />}
            >
              Hint
              <span className="font-mono tabular-nums opacity-70">
                {hintsLeft}
              </span>
            </Button>
            <Button
              size="md"
              variant="ghost"
              onClick={() => setConfirmOpen(true)}
              icon={<Flag aria-hidden className="h-4 w-4 shrink-0" />}
            >
              Give Up
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        label="Give up this round?"
        className="w-full max-w-sm"
      >
        <Card variant="surface" padding="lg">
          <h2 className="mb-2 text-xl font-bold text-text">
            Give up this round?
          </h2>
          <p className="mb-6 text-sm text-text-muted">
            Your progress won&apos;t be saved.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              icon={<Flag aria-hidden className="h-4 w-4" />}
              onClick={() => {
                setConfirmOpen(false);
                onGiveUp();
              }}
            >
              Give Up
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
}

export default SeekHud;
