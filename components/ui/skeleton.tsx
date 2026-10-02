import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

interface Props {
  className?: string;
  /** For skeletons whose size is computed at runtime. */
  style?: CSSProperties;
}

/**
 * Shimmering placeholder block. The shimmer is a transform on an overlay so it
 * composites, and prefers-reduced-motion flattens it to a static block.
 */
function Skeleton({ className, style }: Props) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "relative overflow-hidden rounded-control bg-surface-raised",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-border/10 to-transparent" />
    </div>
  );
}

export default Skeleton;
