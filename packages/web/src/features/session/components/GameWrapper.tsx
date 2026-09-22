import { EVENTS } from "@razzia/common/constants";
import type { Status } from "@razzia/common/types/game/status";
import GameBackground from "@razzia/web/components/quiz/GameBackground";
import Button from "@razzia/web/components/ui/Button";
import Loader from "@razzia/web/components/ui/Loader";
import {
  useEvent,
  useSocket,
} from "@razzia/web/features/session/contexts/socket-context";
import { usePlayerStore } from "@razzia/web/features/session/stores/player";
import { useQuestionStore } from "@razzia/web/features/session/stores/question";
import { MANAGER_SKIP_BTN } from "@razzia/web/features/session/utils/constants";
import clsx from "clsx";
import { type PropsWithChildren, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type Props = PropsWithChildren & {
  statusName: Status | undefined;
  onNext?: () => void;
  onBack?: () => void;
  manager?: boolean;
};

const GameWrapper = ({
  children,
  statusName,
  onNext,
  onBack,
  manager,
}: Props) => {
  const { isConnected } = useSocket();
  const { player } = usePlayerStore();
  const { questionStates, setQuestionStates } = useQuestionStore();
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(false);
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null;

  useEvent(EVENTS.GAME.UPDATE_QUESTION, ({ current, total }) => {
    setQuestionStates({ current, total });
  });

  useEvent(EVENTS.GAME.ERROR_MESSAGE, (message) => {
    toast.error(t(message));
    console.log(t(message));
    setIsDisabled(false);
  });

  useEffect(() => {
    setIsDisabled(false);
  }, [statusName]);

  const handleNext = () => {
    setIsDisabled(true);
    onNext?.();
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--color-background)]">
      <GameBackground />

      <div className="z-10 flex w-full flex-1 flex-col justify-between">
        {!isConnected && !statusName ? (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
            <Loader className="h-30 text-[var(--color-accent-gold)]" />
            <h1 className="mt-4 text-4xl font-bold text-white">
              {t("common:connecting")}
            </h1>
          </div>
        ) : (
          <>
            {/* ── Header ──────────────────────────────────── */}
            <header className="flex w-full items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                {questionStates && (
                  <div
                    className={clsx(
                      "flex items-center gap-2 rounded-full",
                      "border border-[var(--color-accent)] bg-black/40 backdrop-blur-md",
                      "px-4 py-1.5",
                    )}
                  >
                    <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                      Q
                    </span>
                    <span className="text-lg font-extrabold tabular-nums text-white">
                      {questionStates.current}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-muted-foreground)]">
                      /
                    </span>
                    <span className="text-lg font-extrabold tabular-nums text-[var(--color-accent-gold)]">
                      {questionStates.total}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {manager && next && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNext}
                    disabled={isDisabled}
                  >
                    {t(next)}
                  </Button>
                )}

                {manager && onBack && (
                  <Button variant="secondary" size="sm" onClick={onBack}>
                    {t("common:exit")}
                  </Button>
                )}
              </div>
            </header>

            {/* ── Content ─────────────────────────────────── */}
            <div className="flex flex-1 flex-col">{children}</div>

            {/* ── Footer (player only) ────────────────────── */}
            {!manager && (
              <footer
                className={clsx(
                  "z-20 flex items-center justify-between",
                  "border-t border-[var(--color-accent)]",
                  "bg-[var(--color-surface)]/95 backdrop-blur-md",
                  "px-4 py-3",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center rounded-full bg-[var(--color-muted)] text-xs font-bold uppercase text-[var(--color-foreground)]"
                    style={{ width: 28, height: 28 }}
                  >
                    {player?.username?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                  <span className="max-w-[40vw] truncate text-base font-semibold text-[var(--color-foreground)]">
                    {player?.username ?? "—"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                    Score
                  </span>
                  <span
                    className={clsx(
                      "flex items-center justify-center rounded-[var(--radius-sm)]",
                      "bg-[var(--color-accent-gold)]/15 px-3 py-1",
                      "text-lg font-extrabold tabular-nums text-[var(--color-accent-gold)]",
                    )}
                  >
                    {player?.points ?? 0}
                  </span>
                </div>
              </footer>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default GameWrapper;