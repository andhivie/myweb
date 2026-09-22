import clsx from "clsx";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "default" | "elevated" | "outline";
type Padding = "none" | "sm" | "md" | "lg";

type Props = HTMLAttributes<HTMLDivElement> &
  PropsWithChildren<{
    variant?: Variant;
    padding?: Padding;
  }>;

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[var(--color-surface)] border border-[var(--color-accent)] shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
  elevated:
    "bg-[var(--color-surface)] border border-[var(--color-accent)] shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
  outline:
    "bg-transparent border border-[var(--color-accent)]",
};

const paddingClasses: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

const Card = ({
  children,
  className,
  variant = "default",
  padding = "md",
  ...otherProps
}: Props) => (
  <div
    className={twMerge(
      clsx(
        "relative z-10 flex flex-col rounded-[var(--radius-xl)]",
        "transition-[background-color,border-color] duration-200 ease-[var(--ease-out-andhivie)]",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      ),
    )}
    {...otherProps}
  >
    {children}
  </div>
);

export default Card;