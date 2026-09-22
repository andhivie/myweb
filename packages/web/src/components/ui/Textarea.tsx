import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "sm" | "md" | "lg";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: Variant;
  error?: boolean;
};

const variantClasses: Record<Variant, string> = {
  sm: "p-3 text-sm rounded-[var(--radius-sm)] min-h-20",
  md: "p-4 text-base rounded-[var(--radius-md)] min-h-28",
  lg: "p-5 text-lg rounded-[var(--radius-lg)] min-h-36",
};

const Textarea = ({
  className,
  variant = "md",
  error = false,
  disabled,
  ...otherProps
}: Props) => (
  <textarea
    disabled={disabled}
    className={twMerge(
      clsx(
        "w-full resize-y bg-[var(--color-surface)] text-[var(--color-foreground)]",
        "border-2 transition-[border-color,box-shadow] duration-200",
        "ease-[var(--ease-out-andhivie)]",
        "placeholder:text-[var(--color-muted-foreground)]",
        "focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        error
          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
          : "border-[var(--color-accent)] hover:border-[var(--color-accent-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30",
        className,
      ),
    )}
    {...otherProps}
  />
);

export default Textarea;