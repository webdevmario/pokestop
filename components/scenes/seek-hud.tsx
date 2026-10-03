import { Flag } from "lucide-react";
import { useState } from "react";

import { Button, Card, Modal } from "@/components/ui";
interface Props {
  time: string;
  misses: number;
  sceneName: string;
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
 * In-game controls: elapsed time, misses, scene name, and the give-up action.
 *
 * Progress lives in TargetStrip above the scene, so this bar stays a compact
 * row of readouts with the action pushed to the far end.
 */
function SeekHud({
  time,
  misses,
  sceneName,
  onGiveUp,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card variant="bar" className="mb-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {/* Readouts */}
          <div className="flex items-center gap-5">
            <Readout label="Time" value={time} mono />
            <Readout label="Misses" value={misses} tone="primary" />
            <Readout
              label="Scene"
              value={<span className="whitespace-nowrap">{sceneName}</span>}
            />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
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
