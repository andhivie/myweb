import { EVENTS } from "@razzia/common/constants";
import type { PublicPlayer } from "@razzia/common/types/game";
import type { PlayerStatusDataMap } from "@razzia/common/types/game/status";
import { RiveAvatar } from "@razzia/web/components/avatar";
import Loader from "@razzia/web/components/ui/Loader";
import {
  useEvent,
  useSocket,
} from "@razzia/web/features/session/contexts/socket-context";
import { usePlayerStore } from "@razzia/web/features/session/stores/player";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: PlayerStatusDataMap["WAIT"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI — didefinisikan inline via <style> tag
   Tidak bergantung pada CSS eksternal.
   ═══════════════════════════════════════════════════════════ */

const LobbyAnimations = () => (
  <style>{`
    @keyframes lobby-fade-up {
      from { opacity: 0; transform: translateY(12px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes lobby-bounce-dot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-8px); opacity: 1; }
    }
    @keyframes lobby-glow-pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.65; transform: scale(1.08); }
    }
    @keyframes lobby-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   SIMPLE WAIT — "waiting for answers" (setelah submit jawaban)
   ═══════════════════════════════════════════════════════════ */

const SimpleWait = ({ text }: { text: string }) => {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <Loader className="h-30 text-[var(--color-accent-gold)]" />
      <h2 className="mt-5 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        {t(text)}
      </h2>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   LOBBY — daftar pemain real-time sebelum game dimulai
   ═══════════════════════════════════════════════════════════ */

const Lobby = () => {
  const { player: me } = usePlayerStore();
  const { socket } = useSocket();
  const [players, setPlayers] = useState<PublicPlayer[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    socket.emit(EVENTS.PLAYER.REQUEST_LIST);
  }, [socket]);

  useEvent(EVENTS.GAME.PLAYER_LIST, (list) => {
    setPlayers(list);
  });

  useEvent(EVENTS.GAME.TOTAL_PLAYERS, (count) => {
    setTotal(count);
  });

  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
      <LobbyAnimations />

      {/* Glow radial di belakang judul */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--color-primary)]/15 blur-[120px]" />

      {/* ── Header ───────────────────────────────────────── */}
      <div className="anim-fade-up relative z-10 text-center">
        <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-black text-transparent drop-shadow-lg md:text-5xl lg:text-6xl">
          You&apos;re in!
        </h1>
        <p className="mt-3 text-base font-medium text-white/60 md:text-lg">
          Waiting for the host to start the game…
        </p>
      </div>

      {/* ── Counter — glowing badge ──────────────────────── */}
      <div className="anim-fade-up relative z-10">
        {/* Glow berdenyut di belakang badge */}
        <div
          className="absolute inset-0 -z-10 rounded-full bg-[var(--color-accent-gold)]/25 blur-2xl"
          style={{ animation: "lobby-glow-pulse 2.5s ease-in-out infinite" }}
        />

        <div
          className={clsx(
            "relative flex items-center gap-4 rounded-full",
            "border-2 border-[var(--color-accent-gold)]/50",
            "bg-gradient-to-b from-[var(--color-accent-gold)]/12 to-transparent",
            "px-8 py-4 shadow-[0_8px_40px_rgba(212,168,131,0.25)]",
            "backdrop-blur-sm",
          )}
        >
          <span className="text-5xl leading-none font-black tabular-nums text-[var(--color-accent-gold)] md:text-6xl">
            {total}
          </span>

          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold tracking-widest text-[var(--color-accent-gold)]/80 uppercase">
              {total === 1 ? "Player" : "Players"}
            </span>
            <span className="text-lg font-semibold text-white">
              joined
            </span>
          </div>
        </div>
      </div>

      {/* ── Player grid ──────────────────────────────────── */}
      <div className="relative z-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {players.map((p, i) => {
          const isMe = p.username === me?.username;

          return (
            <div
              key={p.id}
              className={clsx(
                "group relative flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border-2 p-4",
                "transition-transform duration-300 ease-[var(--ease-out-andhivie)]",
                "hover:-translate-y-1",
                isMe
                  ? "border-[var(--color-primary)] bg-gradient-to-b from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 shadow-[0_0_30px_rgba(225,29,72,0.25)]"
                  : "border-[var(--color-accent)] bg-[var(--color-surface)]/80 backdrop-blur-sm",
                !p.connected && "opacity-40",
              )}
              style={{
                animation: `lobby-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms backwards`,
              }}
            >
              {isMe && (
                <span className="absolute -top-2 -right-2 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-black tracking-wide text-white uppercase shadow-lg">
                  You
                </span>
              )}

              <RiveAvatar state="idle" size="md" name={p.username} />

              <div className="min-w-0 max-w-full text-center">
                <p className="truncate text-sm font-bold text-white md:text-base">
                  {p.username}
                </p>
                {!p.connected && (
                  <p className="text-[10px] font-semibold tracking-wider text-red-400 uppercase">
                    Offline
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Waiting animation ───────────────────────────── */}
      <div className="relative z-10 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-[var(--color-accent-gold)]"
            style={{
              animation: `lobby-bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   DISPATCHER
   ═══════════════════════════════════════════════════════════ */

const Wait = ({ data: { text } }: Props) => {
  if (text === "game:waitingForPlayers") {
    return <Lobby />;
  }

  return <SimpleWait text={text} />;
};

export default Wait;