import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type CardVariant = "surface" | "raised" | "bar" | "interactive";

const VARIANTS: Record<CardVariant, string> = {
  /** Modal bodies and large panels: one step up from the page background. */
  surface: "bg-surface border border-border/10",
  /** The default card sitting on the page: stat tiles, word bank, panels. */
  raised: "bg-surface-raised border border-border/10",
  /** Control/status bars above game boards. */
  bar: "bg-surface-raised border border-border/10",
  /** Clickable grid cards (pokedex entries, home tiles). */
  interactive:
    "pokemon-card bg-surface-raised border border-border/5 hover:border-border/15",
};

const PADDING = {
  none: "",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
} as const;

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: keyof typeof PADDING;
  children?: ReactNode;
}

function Card({
  variant = "raised",
  padding = "md",
  className,
  children,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "rounded-card",
        VARIANTS[variant],
        PADDING[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
