import { EVENTS } from "@razzia/common/constants";
import { STATUS } from "@razzia/common/types/game/status";
import Button from "@razzia/web/components/ui/Button";
import Card from "@razzia/web/components/ui/Card";
import Input from "@razzia/web/components/ui/Input";
import {
  useEvent,
  useSocket,
} from "@razzia/web/features/session/contexts/socket-context";
import { usePlayerStore } from "@razzia/web/features/session/stores/player";
import { useNavigate } from "@tanstack/react-router";
import { type KeyboardEvent, useState } from "react";

const MAX_USERNAME_LENGTH = 20;
const COUNTER_THRESHOLD = 12;

const Username = () => {
  const { socket } = useSocket();
  const { gameId, login, setStatus } = usePlayerStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const trimmed = username.trim();
  const canSubmit =
    trimmed.length > 0 && trimmed.length <= MAX_USERNAME_LENGTH;
  const showCounter = username.length >= COUNTER_THRESHOLD;
  const isAtLimit = username.length >= MAX_USERNAME_LENGTH;

  const handleLogin = () => {
    if (!gameId || !canSubmit) {
      return;
    }

    socket.emit(EVENTS.PLAYER.LOGIN, {
      gameId,
      data: { username: trimmed },
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEvent(EVENTS.GAME.SUCCESS_JOIN, (joinedGameId) => {
    setStatus(STATUS.WAIT, { text: "game:waitingForPlayers" });
    login(trimmed);

    navigate({ to: "/party/$gameId", params: { gameId: joinedGameId } });
  });

  return (
    <Card className="anim-fade-up w-full max-w-sm" padding="lg">
      <h2 className="mb-6 text-center text-xl font-bold text-[var(--color-foreground)]">
        What&apos;s your name?
      </h2>

      <Input
        className="text-center"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your name"
        maxLength={MAX_USERNAME_LENGTH}
        autoFocus
        variant="lg"
      />

      <div className="mt-2 flex justify-end">
        <span
          className="text-xs tabular-nums transition-opacity duration-200"
          style={{
            opacity: showCounter ? 1 : 0,
            color: isAtLimit ? "#f87171" : "var(--color-muted-foreground)",
          }}
        >
          {username.length} / {MAX_USERNAME_LENGTH}
        </span>
      </div>

      <Button
        className="mt-4"
        fullWidth
        onClick={handleLogin}
        disabled={!canSubmit}
      >
        Continue
      </Button>
    </Card>
  );
};

export default Username;