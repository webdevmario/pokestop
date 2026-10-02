/**
 * Joins class names, dropping falsy values. Deliberately not clsx/tailwind-merge —
 * the primitives put caller `className` last so it wins by source order, and
 * adding a dependency to do that is not worth it at this size.
 */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
