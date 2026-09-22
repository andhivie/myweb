import { EVENTS } from "@razzia/common/constants";
import Button from "@razzia/web/components/ui/Button";
import Card from "@razzia/web/components/ui/Card";
import {
  useEvent,
  useSocket,
} from "@razzia/web/features/session/contexts/socket-context";
import { usePlayerStore } from "@razzia/web/features/session/stores/player";
import { useQuestionStore } from "@razzia/web/features/session/stores/question";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

/** Minimum spinner display time (ms) — supaya loading terlihat jelas */
const MIN_SPINNER_MS = 800;

/* ═══════════════════════════════════════════════════════════
   IKON SVG INLINE
   ═══════════════════════════════════════════════════════════ */

const HistoryIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 20, height: 20 }}
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 3" />
  </svg>
);

/**
 * Spinner SVG dengan keyframe didefinisikan inline di komponen.
 * Tidak bergantung CSS eksternal — dijamin berputar.
 */
const Spinner = ({ size = 40 }: { size?: number }) => (
  <>
    <style>{`
      @keyframes andhivie-spinner-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
    <svg
      viewBox="0 0 50 50"
      style={{
        width: size,
        height: size,
        animation: "andhivie-spinner-rotate 1s linear infinite",
        transformOrigin: "center",
        display: "block",
      }}
      aria-hidden="true"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="90 60"
        opacity="0.9"
      />
    </svg>
  </>
);

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Reconnect = () => {
  const { isConnected, socket } = useSocket();
  const { setGameId, setPlayer, setStatus } = usePlayerStore();
  const { setQuestionStates } = useQuestionStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [savedPin, setSavedPin] = useState(() =>
    localStorage.getItem("game_pin"),
  );
  const [isChecking, setIsChecking] = useState(
    Boolean(localStorage.getItem("game_pin")),
  );
  const hasCheckedRef = useRef(false);
  const checkStartTimeRef = useRef(0);

  useEffect(() => {
    if (!isConnected || hasCheckedRef.current || !savedPin) {
      return;
    }

    hasCheckedRef.current = true;
    checkStartTimeRef.current = Date.now();
    socket.emit(EVENTS.PLAYER.CHECK_PIN, savedPin);
  }, [isConnected, savedPin, socket]);

  useEvent(EVENTS.PLAYER.CHECK_PIN_RESULT, ({ valid }) => {
    // Paksa spinner tampil minimal MIN_SPINNER_MS
    const elapsed = Date.now() - checkStartTimeRef.current;
    const remaining = Math.max(0, MIN_SPINNER_MS - elapsed);

    setTimeout(() => {
      setIsChecking(false);

      if (!valid) {
        localStorage.removeItem("game_pin");
        setSavedPin(null);
      }
    }, remaining);
  });

  const handleReconnect = () => {
    if (savedPin) {
      socket.emit(EVENTS.PLAYER.JOIN, savedPin);
    }
  };

  const handleForget = () => {
    localStorage.removeItem("game_pin");
    setSavedPin(null);
  };

  useEvent(EVENTS.GAME.RESET, (message) => {
    toast.error(t(message));
  });

  useEvent(
    EVENTS.PLAYER.SUCCESS_RECONNECT,
    ({ gameId, status, player, currentQuestion }) => {
      setGameId(gameId);
      setStatus(status.name, status.data);
      setPlayer(player);
      setQuestionStates(currentQuestion);
      navigate({ to: "/party/$gameId", params: { gameId } });
    },
  );

  if (!savedPin) {
    return null;
  }

  if (isChecking) {
    return (
      <Card
        className="anim-fade-up mt-4 mb-16 w-full max-w-sm"
        padding="md"
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-[var(--color-accent-gold)]">
            <Spinner size={40} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-[var(--color-foreground)]">
              Checking session
            </h3>
            <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
              Looking for a game you were in…
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="anim-fade-up mt-4 mb-16 w-full max-w-sm" padding="md">
      <div className="flex items-start gap-3">
        <div
          className="flex shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-gold)]/15 text-[var(--color-accent-gold)]"
          style={{ width: 40, height: 40 }}
        >
          <HistoryIcon />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[var(--color-foreground)]">
            You were in a game
          </h3>
          <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
            Continue where you left off
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="ghost" size="sm" onClick={handleForget}>
          Forget
        </Button>
        <Button variant="primary" size="sm" onClick={handleReconnect}>
          Reconnect
        </Button>
      </div>
    </Card>
  );
};

export default Reconnect;