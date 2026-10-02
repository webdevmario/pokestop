import { useCallback, useEffect, useRef, useState } from "react";

export interface GameTimer {
  /** Elapsed whole seconds. */
  seconds: number;
  running: boolean;
  /** Resets to 0 and starts counting. */
  start: () => void;
  stop: () => void;
  reset: () => void;
  /** Elapsed time as m:ss. */
  formatted: string;
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Second-resolution game clock shared by matching and hide & seek.
 *
 * Counts from a wall-clock start rather than incrementing on each tick, so a
 * throttled background tab doesn't silently lose seconds.
 */
export function useGameTimer(): GameTimer {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (startedAt.current === null) return;
      setSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    };

    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [running]);

  const start = useCallback(() => {
    startedAt.current = Date.now();
    setSeconds(0);
    setRunning(true);
  }, []);

  const stop = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    startedAt.current = null;
    setSeconds(0);
    setRunning(false);
  }, []);

  return { seconds, running, start, stop, reset, formatted: formatDuration(seconds) };
}
