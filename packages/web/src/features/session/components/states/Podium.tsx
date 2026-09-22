import type { ManagerStatusDataMap } from "@razzia/common/types/game/status";
import { SFX } from "@razzia/web/features/session/utils/constants";
import useScreenSize from "@razzia/web/lib/hooks/useScreenSize";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import useSound from "use-sound";

interface Props {
  data: ManagerStatusDataMap["FINISHED"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const PodiumAnimations = () => (
  <style>{`
    @keyframes pd-title-in {
      0%   { opacity: 0; transform: translateY(20px); filter: blur(6px); }
      100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
    }
    @keyframes pd-step-rise {
      0%   { opacity: 0; transform: translateY(100%); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes pd-name-in {
      0%   { opacity: 0; transform: translateY(12px) scale(0.85); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes pd-medal-in {
      0%   { opacity: 0; transform: scale(0.3) rotate(-30deg); }
      60%  { transform: scale(1.2) rotate(8deg); }
      100% { opacity: 1; transform: scale(1) rotate(0); }
    }
    @keyframes pd-crown-bob {
      0%, 100% { transform: translateY(0) rotate(-3deg); }
      50%      { transform: translateY(-6px) rotate(3deg); }
    }
    @keyframes pd-spotlight-in {
      0%   { opacity: 0; transform: translateX(-50%) scale(0.2); }
      50%  { opacity: 1; transform: translateX(-50%) scale(1); }
      100% { opacity: 0; transform: translateX(-50%) scale(1.3); }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   MEDAL
   ═══════════════════════════════════════════════════════════ */

const medalColor = [
  { bg: "bg-gradient-to-br from-yellow-300 to-yellow-600", border: "border-yellow-200/70", glow: "0 0 30px rgba(250, 204, 21, 0.6)" },
  { bg: "bg-gradient-to-br from-gray-200 to-gray-500", border: "border-gray-100/70", glow: "0 0 30px rgba(209, 213, 219, 0.5)" },
  { bg: "bg-gradient-to-br from-amber-600 to-amber-800", border: "border-amber-400/70", glow: "0 0 30px rgba(217, 119, 6, 0.5)" },
] as const;

const Medal = ({ rank, delay }: { rank: number; delay: number }) => {
  const color = medalColor[rank - 1];

  return (
    <div
      className={clsx(
        "relative flex aspect-square size-16 items-center justify-center overflow-hidden rounded-full border-4 text-2xl font-black text-white md:size-20 md:border-4 md:text-3xl",
        color.bg,
        color.border,
      )}
      style={{
        animation: `pd-medal-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s backwards`,
        boxShadow: color.glow,
      }}
    >
      {/* Efek highlight */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute top-[30%] left-1/2 h-4 w-[160%] -translate-x-1/2 -rotate-40 bg-white/30" />
        <div className="absolute top-[70%] left-1/2 h-2 w-[160%] -translate-x-1/2 -rotate-40 bg-white/20" />
      </div>

      <p
        className="relative z-10"
        style={{ textShadow: "2px 2px rgba(0,0,0, 0.3)" }}
      >
        {rank}
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Podium = ({ data: { subject, top } }: Props) => {
  const { width, height } = useScreenSize();
  const [stage, setStage] = useState(0);

  const [sfxThird] = useSound(SFX.PODIUM.THREE, { volume: 0.15 });
  const [sfxSecond] = useSound(SFX.PODIUM.SECOND, { volume: 0.15 });
  const [sfxFirst] = useSound(SFX.PODIUM.FIRST, { volume: 0.15 });
  const [sfxRoll, { stop: sfxRollStop }] = useSound(SFX.PODIUM.SNEAR_ROOL, {
    volume: 0.15,
  });

  // Timeline animasi bertahap
  useEffect(() => {
    if (top.length < 3) {
      setStage(4);
      return;
    }

    const timers = [
      setTimeout(() => {
        setStage(1);
        sfxThird();
      }, 300),
      setTimeout(() => {
        setStage(2);
        sfxSecond();
      }, 1800),
      setTimeout(() => {
        setStage(3);
        sfxRoll();
      }, 3300),
      setTimeout(() => {
        setStage(4);
        sfxRollStop();
        sfxFirst();
      }, 5000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
    // oxlint-disable-next-line
  }, [top.length]);

  return (
    <>
      <PodiumAnimations />

      {/* Confetti saat semua sudah muncul */}
      {stage >= 4 && (
        <ReactConfetti
          width={width}
          height={height}
          className="pointer-events-none"
          recycle={true}
          numberOfPieces={180}
          gravity={0.25}
          colors={["#E11D48", "#D4A883", "#FFFFFF", "#FBBF24", "#10B981"]}
        />
      )}

      {/* Spotlight lembut di belakang podium */}
      {stage >= 3 && top.length >= 3 && (
        <div className="pointer-events-none absolute top-0 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2">
          <div
            className="h-full w-full rounded-full bg-gradient-to-b from-white/15 to-transparent blur-3xl"
            style={{
              animation: "pd-spotlight-in 2s ease-out",
            }}
          />
        </div>
      )}

      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-between gap-6 px-4 py-6">
        {/* ── Judul ────────────────────────────────────────── */}
        <h1
          className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-3xl font-black text-transparent drop-shadow-lg md:text-4xl lg:text-5xl"
          style={{
            animation: "pd-title-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {subject}
        </h1>

        {/* ── Podium ───────────────────────────────────────── */}
        <div
          className="grid w-full flex-1 items-end gap-2 md:gap-4"
          style={{
            gridTemplateColumns: top.length === 1
              ? "1fr"
              : top.length === 2
                ? "1fr 1fr"
                : "1fr 1.1fr 1fr",
            maxWidth: top.length === 1 ? 360 : 900,
            margin: "0 auto",
          }}
        >
          {/* ── 2nd place (kiri) ─────────────────────────── */}
          {top[1] && (
            <PodiumStep
              player={top[1]}
              rank={2}
              heightPercent={68}
              visible={stage >= 2}
              delay={0}
            />
          )}

          {/* ── 1st place (tengah) ───────────────────────── */}
          {top[0] && (
            <PodiumStep
              player={top[0]}
              rank={1}
              heightPercent={90}
              visible={stage >= 4}
              delay={0.15}
              center
            />
          )}

          {/* ── 3rd place (kanan) ────────────────────────── */}
          {top[2] && (
            <PodiumStep
              player={top[2]}
              rank={3}
              heightPercent={52}
              visible={stage >= 1}
              delay={0}
            />
          )}
        </div>
      </section>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════
   PODIUM STEP
   ═══════════════════════════════════════════════════════════ */

interface StepProps {
  player: { username: string; points: number };
  rank: 1 | 2 | 3;
  heightPercent: number;
  visible: boolean;
  delay: number;
  center?: boolean;
}

const PodiumStep = ({
  player,
  rank,
  heightPercent,
  visible,
  delay,
  center = false,
}: StepProps) => (
  <div
    className="flex flex-col items-center gap-3"
    style={{
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s",
    }}
  >
    {/* Nama pemain */}
    <p
      className={clsx(
        "max-w-full truncate text-center font-black text-white drop-shadow-lg",
        center ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl",
      )}
      style={{
        opacity: visible ? 1 : 0,
        animation: visible
          ? `pd-name-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s backwards`
          : undefined,
      }}
    >
      {player.username}
    </p>

    {/* Step dengan medal + poin */}
    <div
      className={clsx(
        "relative flex w-full flex-col items-center gap-2 rounded-t-[var(--radius-xl)] px-3 pt-4 pb-6",
        rank === 1 && "bg-gradient-to-b from-yellow-500/40 to-yellow-700/20 border-t-4 border-yellow-400",
        rank === 2 && "bg-gradient-to-b from-gray-400/40 to-gray-600/20 border-t-4 border-gray-300",
        rank === 3 && "bg-gradient-to-b from-amber-600/40 to-amber-800/20 border-t-4 border-amber-500",
      )}
      style={{
        height: `${heightPercent}%`,
        minHeight: center ? 260 : 200,
        opacity: visible ? 1 : 0,
        animation: visible
          ? `pd-step-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s backwards`
          : undefined,
      }}
    >
      {/* Mahkota untuk juara 1 */}
      {rank === 1 && (
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl md:text-4xl"
          style={{
            animation: visible
              ? "pd-crown-bob 2s ease-in-out infinite"
              : undefined,
          }}
        >
          👑
        </div>
      )}

      <Medal rank={rank} delay={delay + 0.3} />

      <p className="text-xl font-black tabular-nums text-white drop-shadow-md md:text-2xl lg:text-3xl">
        {player.points}
      </p>
    </div>
  </div>
);

export default Podium;