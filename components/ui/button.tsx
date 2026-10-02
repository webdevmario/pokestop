import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:brightness-110 active:brightness-95 focus-visible:outline-primary",
  secondary:
    "bg-surface-raised text-text border border-border/10 hover:bg-surface-hover hover:border-border/20 focus-visible:outline-border",
  ghost:
    "bg-transparent text-text-muted hover:text-text hover:bg-border/5 focus-visible:outline-border",
  destructive:
    "bg-transparent text-primary border border-primary/40 hover:bg-primary/10 focus-visible:outline-primary",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label. Pass a lucide icon. */
  icon?: ReactNode;
  /** Rendered after the label. */
  iconAfter?: ReactNode;
  /** Renders the active/selected state, e.g. a chosen difficulty pill. */
  selected?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "secondary",
    size = "md",
    icon,
    iconAfter,
    selected = false,
    className,
    children,
    type = "button",
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-control font-semibold",
        // Only transition what actually changes, so nothing gets promoted needlessly.
        "transition-[background-color,border-color,color,filter] duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-30 disabled:pointer-events-none",
        selected ? VARIANTS.primary : VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
      {iconAfter}
    </button>
  );
});

export default Button;
