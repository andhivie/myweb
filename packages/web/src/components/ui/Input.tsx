import clsx from "clsx";
import type { InputHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "sm" | "md" | "lg";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: Variant;
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
};

const variantClasses: Record<Variant, string> = {
  sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]",
  md: "h-11 px-4 text-base rounded-[var(--radius-md)]",
  lg: "h-13 px-5 text-lg rounded-[var(--radius-lg)]",
};

const iconSizeClasses: Record<Variant, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const Input = ({
  className,
  containerClassName,
  variant = "md",
  error = false,
  leftIcon,
  rightIcon,
  disabled,
  type = "text",
  ...otherProps
}: Props) => {
  const baseClasses = clsx(
    "w-full bg-[var(--color-surface)] text-[var(--color-foreground)]",
    "border-2 transition-[border-color,box-shadow] duration-200",
    "ease-[var(--ease-out-andhivie)]",
    "placeholder:text-[var(--color-muted-foreground)]",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    error
      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
      : "border-[var(--color-accent)] hover:border-[var(--color-accent-foreground)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30",
  );

  if (!leftIcon && !rightIcon) {
    return (
      <input
        type={type}
        disabled={disabled}
        className={twMerge(clsx(baseClasses, className))}
        {...otherProps}
      />
    );
  }

  return (
    <div className={twMerge(clsx("relative flex items-center", containerClassName))}>
      {leftIcon && (
        <span
          className={clsx(
            "pointer-events-none absolute left-3 flex items-center",
            "text-[var(--color-muted-foreground)]",
            iconSizeClasses[variant],
          )}
        >
          {leftIcon}
        </span>
      )}

      <input
        type={type}
        disabled={disabled}
        className={twMerge(
          clsx(baseClasses, leftIcon && "pl-10", rightIcon && "pr-10", className),
        )}
        {...otherProps}
      />

      {rightIcon && (
        <span
          className={clsx(
            "absolute right-3 flex items-center",
            "text-[var(--color-muted-foreground)]",
            iconSizeClasses[variant],
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
};

export default Input;