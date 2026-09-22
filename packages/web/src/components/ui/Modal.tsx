import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { X } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Size = "sm" | "md" | "lg" | "xl";

type Props = PropsWithChildren<{
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  title?: string;
  description?: string;
  size?: Size;
  showClose?: boolean;
  className?: string;
  trigger?: ReactNode;
}>;

const sizeClasses: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

const Modal = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  showClose = true,
  className,
  trigger,
}: Props) => (
  <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
    {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}

    <RadixDialog.Portal>
      <RadixDialog.Overlay
        className={clsx(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=open]:fade-in",
        )}
      />

      <RadixDialog.Content
        className={twMerge(
          clsx(
            "fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2",
            "bg-[var(--color-surface)] border border-[var(--color-accent)]",
            "rounded-[var(--radius-xl)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
            "focus:outline-none",
            sizeClasses[size],
            className,
          ),
        )}
      >
        {showClose && (
          <RadixDialog.Close
            className={clsx(
              "absolute top-4 right-4 rounded-[var(--radius-sm)] p-1.5",
              "text-[var(--color-muted-foreground)]",
              "transition-colors hover:bg-[var(--color-surface-hover)]",
              "hover:text-[var(--color-foreground)]",
            )}
            aria-label="Close"
          >
            <X className="size-5" />
          </RadixDialog.Close>
        )}

        {title && (
          <RadixDialog.Title className="text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </RadixDialog.Title>
        )}

        {description && (
          <RadixDialog.Description className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {description}
          </RadixDialog.Description>
        )}

        <div className={clsx((title || description) && "mt-4")}>{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);

export default Modal;