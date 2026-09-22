import { EVENTS } from "@andhivie/common/constants";
import PinInput from "@andhivie/web/components/quiz/PinInput";
import Button from "@andhivie/web/components/ui/Button";
import Card from "@andhivie/web/components/ui/Card";
import {
    useEvent,
    useSocket,
} from "@andhivie/web/features/session/contexts/socket-context";
import { usePlayerStore } from "@andhivie/web/features/session/stores/player";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16 }}
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Room = () => {
  const { socket, isConnected } = useSocket();
  const { join } = usePlayerStore();
  const [invitation, setInvitation] = useState("");
  const { pin } = useSearch({ from: "/(auth)/" });
  const hasJoinedRef = useRef(false);
  const { t } = useTranslation();

  const cleanPin = invitation.replace(/\s/gu, "");
  const canSubmit = cleanPin.length === 6;

  const handleJoin = () => {
    if (!canSubmit) return;
    socket.emit(EVENTS.PLAYER.JOIN, cleanPin);
  };

  useEvent(EVENTS.GAME.SUCCESS_ROOM, (gameId) => {
    const pinToSave = cleanPin || pin;

    if (pinToSave) {
      localStorage.setItem("game_pin", pinToSave);
    }

    join(gameId);
  });

  useEffect(() => {
    if (!isConnected || !pin || hasJoinedRef.current) {
      return;
    }

    socket.emit(EVENTS.PLAYER.JOIN, pin);
    hasJoinedRef.current = true;
  }, [pin, isConnected, socket]);

  const handleDevPreview = () => {
    join("dev-preview-game-id");
  };

  return (
    <Card className="anim-fade-up w-full max-w-sm" padding="lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
          {t("game:pinLabel")}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--color-muted-foreground)]">
          Enter the 6-digit code shown on the screen
        </p>
      </div>

      <div className="flex justify-center">
        <PinInput
          value={invitation}
          onChange={setInvitation}
          onEnter={handleJoin}
        />
      </div>

      <Button
        className="mt-6"
        fullWidth
        onClick={handleJoin}
        disabled={!canSubmit}
        rightIcon={<ArrowRightIcon />}
      >
        {t("common:submit")}
      </Button>

      {import.meta.env.DEV && (
        <button
          onClick={handleDevPreview}
          className="mt-4 w-full rounded-[var(--radius-sm)] border border-dashed border-[var(--color-accent-gold)]/40 py-2 text-xs font-semibold text-[var(--color-accent-gold)]/70 transition-colors hover:border-[var(--color-accent-gold)]/80 hover:text-[var(--color-accent-gold)]"
        >
          🔧 DEV: Preview Username Screen
        </button>
      )}
    </Card>
  );
};

export default Room;