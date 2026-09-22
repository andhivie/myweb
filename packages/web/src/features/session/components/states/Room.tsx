import { EVENTS } from "@razzia/common/constants";
import type { PublicPlayer } from "@razzia/common/types/game";
import type { ManagerStatusDataMap } from "@razzia/common/types/game/status";
import { RiveAvatar } from "@razzia/web/components/avatar";
import AlertDialog from "@razzia/web/components/ui/AlertDialog";
import Modal from "@razzia/web/components/ui/Modal";
import {
  useEvent,
  useSocket,
} from "@razzia/web/features/session/contexts/socket-context";
import { useManagerStore } from "@razzia/web/features/session/stores/manager";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface Props {
  data: ManagerStatusDataMap["SHOW_ROOM"];
}

/* ═══════════════════════════════════════════════════════════
   IKON SVG INLINE
   ═══════════════════════════════════════════════════════════ */

const ExpandIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 20, height: 20 }}
    aria-hidden="true"
  >
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

const CloseIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const UsersIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CopyIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════ */

const CopyButton = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied!`, { duration: 1500 });

      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--color-accent-foreground)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
      title={`Copy ${label}`}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════
   KOMPONEN UTAMA
   ═══════════════════════════════════════════════════════════ */

const ManagerRoom = ({ data: { text, inviteCode } }: Props) => {
  const { gameId, players, setPlayers } = useManagerStore();
  const { socket } = useSocket();
  const webUrl = window.location.origin;
  const [qrOpen, setQrOpen] = useState(false);
  const { t } = useTranslation();
  const playersRef = useRef(players);

  playersRef.current = players;

  useEvent(EVENTS.GAME.PLAYER_LIST, (list: PublicPlayer[]) => {
    setPlayers(
      list.map((p) => ({
        ...p,
        clientId: "",
      })),
    );
  });

  useEvent(EVENTS.GAME.TOTAL_PLAYERS, () => {
    // Daftar pemain sudah di-handle oleh PLAYER_LIST
  });

  const handleKick = (playerId: string) => () => {
    if (!gameId) return;

    socket.emit(EVENTS.MANAGER.KICK_PLAYER, { gameId, playerId });
  };

  const joinUrl = `${webUrl}?pin=${inviteCode ?? ""}`;
  const pin = inviteCode ?? "------";

  return (
    <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-6">
      {/* ══════════════════════════════════════════════════
          CARD 1 — JOIN INFO (QR + PIN + URL)
          ══════════════════════════════════════════════════ */}
      <div className="anim-fade-up rounded-[var(--radius-xl)] border border-[var(--color-accent)] bg-[var(--color-surface)]/70 p-5 backdrop-blur-sm md:p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr] md:gap-7">
          {/* QR Code */}
          <button
            onClick={() => setQrOpen(true)}
            className="group relative mx-auto flex items-center justify-center rounded-[var(--radius-lg)] bg-white p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98] md:mx-0"
            title="Click to enlarge"
          >
            {inviteCode && (
              <QRCodeSVG
                value={joinUrl}
                style={{ width: 190, height: 190 }}
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-lg)] bg-black/0 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-black">
                <ExpandIcon />
              </span>
            </span>
          </button>

          {/* Right side — URL + PIN */}
          <div className="flex flex-col justify-center gap-5">
            {/* URL bar */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-bold tracking-widest text-[var(--color-muted-foreground)] uppercase">
                  {t("game:joinInstruction")}
                </p>
                <CopyButton value={webUrl} label="URL" />
              </div>
              <p className="truncate rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-background)]/60 px-3 py-2 text-sm font-semibold text-white">
                {webUrl}
              </p>
            </div>

            {/* PIN */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-bold tracking-widest text-[var(--color-accent-gold)] uppercase">
                  {t("game:gamePinLabel")}
                </p>
                <CopyButton value={pin} label="PIN" />
              </div>
              <p
                className="font-black leading-none text-white tabular-nums"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                  letterSpacing: "0.08em",
                  textShadow: "0 4px 24px rgba(225, 29, 72, 0.5)",
                }}
              >
                {pin}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          CARD 2 — PLAYER COUNTER (balanced)
          ══════════════════════════════════════════════════ */}
      <div className="anim-fade-up flex items-center justify-between gap-4 rounded-[var(--radius-xl)] border border-[var(--color-accent)] bg-[var(--color-surface)]/70 px-5 py-3.5 backdrop-blur-sm">
        {/* Left: counter */}
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-full bg-[var(--color-accent-gold)]/15 text-[var(--color-accent-gold)]">
            <UsersIcon />
            {players.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tabular-nums text-[var(--color-accent-gold)]">
              {players.length}
            </span>
            <span className="text-sm font-semibold text-white/70">
              {players.length === 1 ? "player joined" : "players joined"}
            </span>
          </div>
        </div>

        {/* Right: status */}
        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
          {t(text)}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          CARD 3 — PLAYER GRID / EMPTY STATE
          ══════════════════════════════════════════════════ */}
      {players.length > 0 ? (
        <div className="anim-fade-up grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {players.map((player, i) => (
            <div
              key={player.id}
              className="group relative flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--color-accent)] bg-[var(--color-surface)]/80 p-3 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1"
              style={{
                animation: `lobby-fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms backwards`,
              }}
            >
              <RiveAvatar state="idle" size="md" name={player.username} />

              <p className="max-w-full truncate text-sm font-bold text-white">
                {player.username}
              </p>

              <AlertDialog
                trigger={
                  <button
                    className="absolute -top-2 -right-2 hidden size-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110 group-hover:flex"
                    title="Remove player"
                  >
                    <CloseIcon size={14} />
                  </button>
                }
                title="Remove player"
                description={`Remove "${player.username}" from the game?`}
                confirmLabel="Remove"
                onConfirm={handleKick(player.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="anim-fade-up flex flex-col items-center gap-2 py-10 text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
            <UsersIcon size={26} />
          </div>
          <p className="text-base font-semibold text-[var(--color-foreground)]">
            No players yet
          </p>
          <p className="max-w-md text-sm text-[var(--color-muted-foreground)]">
            Share the PIN or QR code above. Players will appear here as they
            join.
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ANIMASI INLINE
          ══════════════════════════════════════════════════ */}
      <style>{`
        @keyframes lobby-fade-up {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          QR MODAL
          ══════════════════════════════════════════════════ */}
      <Modal
        open={qrOpen}
        onOpenChange={setQrOpen}
        size="lg"
        className="!p-8"
        showClose={false}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-xl">
            {inviteCode && (
              <QRCodeSVG
                value={joinUrl}
                style={{
                  width: "min(70vw, 400px)",
                  height: "min(70vw, 400px)",
                }}
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-[var(--color-muted-foreground)] uppercase">
              Scan to join
            </p>
            <p className="mt-1 text-4xl font-black text-white tabular-nums">
              {inviteCode}
            </p>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default ManagerRoom;