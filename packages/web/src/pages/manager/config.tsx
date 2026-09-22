import { EVENTS } from "@andhivie/common/constants";
import { STATUS } from "@andhivie/common/types/game/status";
import Background from "@andhivie/web/components/layout/Background";
import Loader from "@andhivie/web/components/ui/Loader";
import Configurations from "@andhivie/web/features/manager/components/configurations";
import {
  useEvent,
  useSocket,
} from "@andhivie/web/features/session/contexts/socket-context";
import { useManagerStore } from "@andhivie/web/features/session/stores/manager";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const ManagerConfigPage = () => {
  const { isConnected } = useSocket();
  const { setGameId, setStatus, setConfig, config } = useManagerStore();
  const navigate = useNavigate();

  useEvent(EVENTS.MANAGER.CONFIG, (data) => {
    setConfig(data);
  });

  useEvent(EVENTS.MANAGER.GAME_CREATED, ({ gameId, inviteCode }) => {
    setGameId(gameId);
    setStatus(STATUS.SHOW_ROOM, {
      text: "game:waitingForPlayers",
      inviteCode,
    });
    navigate({ to: "/party/manager/$gameId", params: { gameId } });
  });

  // Redirect ke /manager KALAU tidak ada config DAN sudah connected.
  // PENTING: dipanggil di useEffect, bukan saat render.
  useEffect(() => {
    if (isConnected && !config) {
      navigate({ to: "/manager" });
    }
  }, [config, isConnected, navigate]);

  if (!isConnected) {
    return (
      <Background>
        <Loader className="h-23" />
      </Background>
    );
  }

  // Kalau belum ada config, tampilkan loading (jangan navigate di render)
  if (!config) {
    return (
      <Background>
        <Loader className="h-23" />
      </Background>
    );
  }

  return (
    <Background>
      <Configurations data={config} />
    </Background>
  );
};

export const Route = createFileRoute("/manager/config")({
  component: ManagerConfigPage,
});