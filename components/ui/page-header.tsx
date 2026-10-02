import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface Props {
  title: string;
  subtitle?: string;
  /** Controls row rendered under the subtitle (filters, difficulty, actions). */
  children?: ReactNode;
  className?: string;
}

/**
 * Replaces the near-identical centered title block each page hand-rolled.
 */
function PageHeader({ title, subtitle, children, className }: Props) {
  return (
    <header className={cn("mb-8 mt-8 flex flex-col items-center", className)}>
      <h1 className="text-3xl font-bold uppercase tracking-widest text-text">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
      )}
      {children && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
}

export default PageHeader;
