export { default as Button } from "./button";
export { default as Card } from "./card";
export { default as DifficultyPills } from "./difficulty-pills";
export { default as Modal } from "./modal";
export { default as PageHeader } from "./page-header";
export { default as Skeleton } from "./skeleton";
export { default as StatTile } from "./stat-tile";
export { default as WinBanner } from "./win-banner";
export type { ButtonSize, ButtonVariant } from "./button";
export type { CardVariant } from "./card";
export type { DifficultyOption } from "./difficulty-pills";

/** Shared styling for native inputs and selects so filter rows stay consistent. */
export const fieldClasses =
  "rounded-control border border-border/10 bg-surface-raised px-4 py-2.5 text-sm text-text " +
  "placeholder:text-text-muted outline-none transition-colors " +
  "focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
