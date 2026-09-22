import Button from "@andhivie/web/components/ui/Button";
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

const AlertDialog = ({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  destructive = true,
}: Props) => {
  const { t } = useTranslation();

  return (
    <RadixAlertDialog.Root>
      <RadixAlertDialog.Trigger asChild>{trigger}</RadixAlertDialog.Trigger>

      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

        <RadixAlertDialog.Content
          onClick={(e) => e.stopPropagation()}
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-[var(--color-accent)] bg-[var(--color-surface)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <RadixAlertDialog.Title className="text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </RadixAlertDialog.Title>

          <RadixAlertDialog.Description className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            {description}
          </RadixAlertDialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <RadixAlertDialog.Cancel asChild>
              <Button variant="secondary" size="sm">
                {cancelLabel ?? t("common:cancel")}
              </Button>
            </RadixAlertDialog.Cancel>

            <RadixAlertDialog.Action asChild>
              <Button
                variant={destructive ? "danger" : "primary"}
                size="sm"
                onClick={onConfirm}
              >
                {confirmLabel ?? t("common:confirm")}
              </Button>
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

export default AlertDialog;