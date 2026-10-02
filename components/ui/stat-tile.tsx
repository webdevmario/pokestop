import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "default" | "primary" | "success" | "warning" | "info";

const TONES: Record<Tone, string> = {
  default: "text-text",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
};

const SIZES = {
  sm: "text-base",
  md: "text-2xl",
} as const;

interface Props {
  label: string;
  value: ReactNode;
  tone?: Tone;
  size?: keyof typeof SIZES;
  /** Use the mono face for values that tick, so digits don't jitter. */
  mono?: boolean;
  /** Wraps the tile in a bordered surface (the pokedex modal style). */
  boxed?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * The recurring label-over-value stat, used for height/weight/region/color in
 * the pokedex modal and for moves/time/score/streak across the games.
 */
function StatTile({
  label,
  value,
  tone = "default",
  size = "md",
  mono = false,
  boxed = false,
  icon,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "text-center",
        boxed && "rounded-control bg-surface-raised p-3",
        className
      )}
    >
      <p className="text-label uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p
        className={cn(
          "font-bold inline-flex items-center justify-center gap-1.5",
          SIZES[size],
          TONES[tone],
          mono && "font-mono"
        )}
      >
        {value}
        {icon}
      </p>
    </div>
  );
}

export default StatTile;
