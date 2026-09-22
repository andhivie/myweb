import type { CommonStatusDataMap } from "@razzia/common/types/game/status";
import { usePlayerStore } from "@razzia/web/features/session/stores/player";
import { SFX } from "@razzia/web/features/session/utils/constants";
import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";

interface Props {
  data: CommonStatusDataMap["SHOW_RESULT"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const ResultAnimations = () => (
  <style>{`
    @keyframes rsl-icon-in {
      0%   { opacity: 0; transform: scale(0.2) rotate(-30deg); }
      60%  { opacity: 1; transform: scale(1.12) rotate(6deg); }
      80%  { transform: scale(0.95) rotate(-2deg); }
      100% { opacity: 1; transform: scale(1) rotate(0); }
    }
    @keyframes rsl-icon-in-wrong {
      0%   { opacity: 0; transform: scale(0.3); }
      60%  { opacity: 1; transform: scale(1.1) rotate(-8deg); }
      70%  { transform: scale(1) rotate(8deg); }
      80%  { transform: scale(1) rotate(-5deg); }
      90%  { transform: scale(1) rotate(3deg); }
      100% { opacity: 1; transform: scale(1) rotate(0); }
    }
    @keyframes rsl-ring-pulse {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    @keyframes rsl-message-in {
      0%   { opacity: 0; transform: translateY(20px); filter: blur(6px); }
      100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
    }
    @keyframes rsl-points-in {
      0%   { opacity: 0; transform: scale(0.5) translateY(10px); }
      60%  { transform: scale(1.15) translateY(0); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes rsl-rank-in {
      0%   { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes rsl-glow-pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50%      { opacity: 0.7; transform: scale(1.1); }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   IKON SVG
   ═══════════════════════════════════════════════════════════ */

const CheckBigIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CrossBigIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Result = ({
  data: { correct, message, points, myPoints, rank, aheadOfMe },
}: Props) => {
  const player = usePlayerStore();
  const { t } = useTranslation();

  const [sfxResults] = useSound(SFX.RESULTS_SOUND, { volume: 0.25 });

  // Sinkronkan total poin ke store player + mainkan suara hasil
  useEffect(() => {
    player.updatePoints(myPoints);
    sfxResults();
    // oxlint-disable-next-line
  }, [sfxResults, myPoints]);

  const rankKeyMap: Record<number, string> = {
    1: "game:rank.1",
    2: "game:rank.2",
    3: "game:rank.3",
  };
  const rankKey = rankKeyMap[rank] ?? "game:rank.other";

  return (
    <section className="relative flex h-full w-full flex-1 flex-col items-center justify-center gap-6 px-4 py-8 md:gap-8">
      <ResultAnimations />

      {/* Glow radial di belakang ikon */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          backgroundColor: correct
            ? "rgba(16, 185, 129, 0.35)"
            : "rgba(239, 68, 68, 0.35)",
          animation: "rsl-glow-pulse 2.4s ease-in-out infinite",
        }}
      />

      {/* ══════════════════════════════════════════════════
          ICON dengan cincin pulse
          ══════════════════════════════════════════════════ */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Cincin pulse — 2 lapis */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={clsx(
                "absolute rounded-full border-2",
                correct ? "border-emerald-500/50" : "border-red-500/40",
              )}
              style={{
                width: 200,
                height: 200,
                animation: `rsl-ring-pulse 2s ease-out ${i * 0.6}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Lingkaran ikon */}
        <div
          className={clsx(
            "relative flex items-center justify-center rounded-full border-4",
            "shadow-[0_12px_48px_rgba(0,0,0,0.4)]",
            correct
              ? "border-emerald-500/60 bg-emerald-500/15"
              : "border-red-500/60 bg-red-500/15",
          )}
          style={{
            width: 140,
            height: 140,
            animation: correct
              ? "rsl-icon-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
              : "rsl-icon-in-wrong 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            className={clsx(
              "flex items-center justify-center",
              correct ? "text-emerald-400" : "text-red-400",
            )}
            style={{ width: 72, height: 72 }}
          >
            {correct ? <CheckBigIcon /> : <CrossBigIcon />}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MESSAGE
          ══════════════════════════════════════════════════ */}
      <h2
        className={clsx(
          "relative z-10 bg-gradient-to-b bg-clip-text text-center text-4xl font-black text-transparent drop-shadow-lg md:text-5xl lg:text-6xl",
          correct
            ? "from-white via-white to-emerald-200/60"
            : "from-white via-white to-red-200/60",
        )}
        style={{
          animation:
            "rsl-message-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards",
        }}
      >
        {t(message)}
      </h2>

      {/* ══════════════════════════════════════════════════
          POINTS BADGE
          ══════════════════════════════════════════════════ */}
      {correct && points > 0 && (
        <div
          className={clsx(
            "relative z-10 flex items-center gap-2 rounded-full px-6 py-3",
            "border-2 border-[var(--color-accent-gold)]/60",
            "bg-gradient-to-b from-[var(--color-accent-gold)]/25 to-[var(--color-accent-gold)]/5",
            "shadow-[0_8px_32px_rgba(212,168,131,0.35)] backdrop-blur-sm",
          )}
          style={{
            animation:
              "rsl-points-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards",
          }}
        >
          <span className="text-2xl font-black text-[var(--color-accent-gold)] md:text-3xl">
            +{points}
          </span>
          <span className="text-sm font-bold tracking-widest text-[var(--color-accent-gold)]/80 uppercase">
            Points
          </span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          RANK INFO
          ══════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col items-center gap-1.5 text-center"
        style={{
          animation:
            "rsl-rank-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s backwards",
        }}
      >
        <p className="text-base font-semibold text-white/80 md:text-lg">
          {t("game:resultTop")}
          <span className="mx-1 font-black text-[var(--color-accent-gold)]">
            {t(rankKey, { rank })}
          </span>
          {aheadOfMe && (
            <>
              {t("game:resultBehind")}
              <span className="ml-1 font-bold text-white">{aheadOfMe}</span>
            </>
          )}
        </p>

        <p className="text-sm text-[var(--color-muted-foreground)]">
          Total:{" "}
          <span className="font-bold tabular-nums text-white">{myPoints}</span>
        </p>
      </div>
    </section>
  );
};

export default Result;