import clsx from "clsx";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Variant =
  | "default"
  | "primary"
  | "gold"
  | "success"
  | "danger"
  | "warning"
  | "info";

type Size = "sm" | "md";

type Props = HTMLAttributes<HTMLSpanElement> &
  PropsWithChildren<{
    variant?: Variant;
    size?: Size;
  }>;

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[var(--color-muted)] text-[var(--color-accent-foreground)]",
  primary: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  gold: "bg-[var(--color-accent-gold)]/15 text-[var(--color-accent-gold)]",
  success: "bg-emerald-500/15 text-emerald-400",
  danger: "bg-red-500/15 text-red-400",
  warning: "bg-amber-500/15 text-amber-400",
  info: "bg-blue-500/15 text-blue-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

const Badge = ({
  children,
  className,
  variant = "default",
  size = "sm",
  ...otherProps
}: Props) => (
  <span
    className={twMerge(
      clsx(
        "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ),
    )}
    {...otherProps}
  >
    {children}
  </span>
);

export default Badge;