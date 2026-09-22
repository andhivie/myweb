import clsx from "clsx";
import type {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    /** @deprecated gunakan leftIcon/rightIcon. Dipertahankan untuk kompatibilitas. */
    classNameContent?: string;
  }>;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:brightness-90 disabled:bg-[var(--color-primary)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface)]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:brightness-90 disabled:bg-red-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)] gap-1.5",
  md: "h-11 px-5 text-base rounded-[var(--radius-md)] gap-2",
  lg: "h-13 px-7 text-lg rounded-[var(--radius-lg)] gap-2.5",
};

const Spinner = () => (
  <svg
    className="size-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.25"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Button = ({
  children,
  className,
  classNameContent,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...otherProps
}: Props) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center font-semibold whitespace-nowrap",
          "transition-[background-color,color,filter,transform] duration-200 ease-[var(--ease-out-andhivie)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        ),
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...otherProps}
    >
      <span
        className={twMerge(
          clsx(
            "inline-flex items-center justify-center gap-2",
            classNameContent,
          ),
        )}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </span>
    </button>
  );
};

export default Button;