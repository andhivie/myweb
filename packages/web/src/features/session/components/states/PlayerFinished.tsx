import type { CommonStatusDataMap } from "@razzia/common/types/game/status";
import { usePlayerStore } from "@razzia/web/features/session/stores/player";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: CommonStatusDataMap["FINISHED"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const FinishedAnimations = () => (
  <style>{`
    @keyframes fin-title-in {
      0%   { opacity: 0; transform: translateY(20px); filter: blur(6px); }
      100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
    }
    @keyframes fin-rank-in {
      0%   { opacity: 0; transform: scale(0.3) rotate(-15deg); }
      60%  { opacity: 1; transform: scale(1.15) rotate(6deg); }
      100% { opacity: 1; transform: scale(1) rotate(0); }
    }
    @keyframes fin-ring-pulse {
      0%   { transform: scale(1);   opacity: 0.5; }
      100% { transform: scale(2);   opacity: 0; }
    }
    @keyframes fin-points-in {
      0%   { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fin-glow-pulse {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50%      { opacity: 0.6;  transform: scale(1.1); }
    }
  `}</style>
);

/* Warna peringkat */
const RANK_STYLE = {
  1: {
    border: "border-yellow-400/70",
    bg: "bg-gradient-to-b from-yellow-400/25 to-yellow-600/5",
    text: "text-yellow-300",
    glow: "rgba(250, 204, 21, 0.4)",
  },
  2: {
    border: "border-gray-300/70",
    bg: "bg-gradient-to-b from-gray-300/25 to-gray-500/5",
    text: "text-gray-200",
    glow: "rgba(209, 213, 219, 0.35)",
  },
  3: {
    border: "border-amber-600/70",
    bg: "bg-gradient-to-b from-amber-600/25 to-amber-800/5",
    text: "text-amber-400",
    glow: "rgba(217, 119, 6, 0.4)",
  },
  other: {
    border: "border-[var(--color-accent)]",
    bg: "bg-gradient-to-b from-[var(--color-primary)]/15 to-transparent",
    text: "text-[var(--color-accent-gold)]",
    glow: "rgba(225, 29, 72, 0.3)",
  },
} as const;

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const PlayerFinished = ({ data: { subject, rank } }: Props) => {
  const { player } = usePlayerStore();
  const { t } = useTranslation();

  const [displayedPoints, setDisplayedPoints] = useState(0);

  const rankKeyMap: Record<number, string> = {
    1: "game:rank.1",
    2: "game:rank.2",
    3: "game:rank.3",
  };
  const rankKey =
    typeof rank === "number" ? (rankKeyMap[rank] ?? "game:rank.other") : null;

  const style =
    typeof rank === "number" && rank >= 1 && rank <= 3
      ? RANK_STYLE[rank as 1 | 2 | 3]
      : RANK_STYLE.other;

  // Count-up animasi poin
  useEffect(() => {
    const target = player?.points ?? 0;
    const duration = 1400;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedPoints(Math.round(target * eased));

      if (progress >= 1) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, [player?.points]);

  return (
    <section className="relative flex h-full w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-8 md:gap-8">
      <FinishedAnimations />

      {/* Glow radial */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          backgroundColor: style.glow,
          animation: "fin-glow-pulse 2.4s ease-in-out infinite",
        }}
      />

      {/* ── Subject ─────────────────────────────────────── */}
      <p
        className="relative z-10 text-center text-sm font-bold tracking-[0.3em] text-[var(--color-muted-foreground)] uppercase md:text-base"
        style={{
          animation: "fin-title-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {subject}
      </p>

      {/* ── Rank circle ────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Cincin pulse */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={clsx("absolute rounded-full border-2", style.border)}
              style={{
                width: 200,
                height: 200,
                animation: `fin-ring-pulse 2s ease-out ${i * 0.7}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Lingkaran peringkat */}
        <div
          className={clsx(
            "relative flex items-center justify-center rounded-full border-4",
            style.border,
            style.bg,
            "shadow-[0_12px_48px_rgba(0,0,0,0.5)]",
          )}
          style={{
            width: 180,
            height: 180,
            animation: "fin-rank-in 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-widest text-white/60 uppercase">
              Rank
            </span>
            <span
              className={clsx(
                "text-7xl leading-none font-black tabular-nums drop-shadow-lg md:text-8xl",
                style.text,
              )}
            >
              {rank ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Rank text ───────────────────────────────────── */}
      {rankKey && (
        <h1
          className="relative z-10 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-3xl font-black text-transparent drop-shadow-lg md:text-4xl lg:text-5xl"
          style={{
            animation:
              "fin-title-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards",
          }}
        >
          {t(rankKey, { rank })}
        </h1>
      )}

      {/* ── Total points ────────────────────────────────── */}
      <div
        className="relative z-10 flex items-center gap-3 rounded-full border-2 border-[var(--color-accent-gold)]/50 bg-gradient-to-b from-[var(--color-accent-gold)]/15 to-transparent px-8 py-3 backdrop-blur-sm"
        style={{
          animation:
            "fin-points-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards",
        }}
      >
        <span className="text-3xl font-black tabular-nums text-[var(--color-accent-gold)] md:text-4xl">
          {displayedPoints}
        </span>
        <span className="text-xs font-bold tracking-widest text-[var(--color-accent-gold)]/80 uppercase">
          Points
        </span>
      </div>

      {/* ── Footer message ──────────────────────────────── */}
      <p
        className="relative z-10 text-center text-sm text-white/50"
        style={{
          animation:
            "fin-title-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards",
        }}
      >
        Thanks for playing!
      </p>
    </section>
  );
};

export default PlayerFinished;