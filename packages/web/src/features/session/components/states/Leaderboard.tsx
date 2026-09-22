import type { ManagerStatusDataMap } from "@razzia/common/types/game/status";
import clsx from "clsx";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  data: ManagerStatusDataMap["SHOW_LEADERBOARD"];
}

/* ═══════════════════════════════════════════════════════════
   IKON API
   ═══════════════════════════════════════════════════════════ */

const FlameIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    <path d="M12 2c0 4-5 6-5 11a5 5 0 0 0 10 0c0-2-1-3-1-3s-1 2-2 2c0-3-2-5-2-10z" />
  </svg>
);

const CrownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: 20, height: 20 }}
    aria-hidden="true"
  >
    <path d="M3 6l4 4 5-6 5 6 4-4v14H3z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   ANIMASI ANGKA — count-up dari nilai lama ke baru
   ═══════════════════════════════════════════════════════════ */

const AnimatedPoints = ({ from, to }: { from: number; to: number }) => {
  const spring = useSpring(from, { stiffness: 80, damping: 22 });
  const display = useTransform(spring, (value) => Math.round(value));
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    spring.set(to);
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [to, spring, display]);

  return <span className="tabular-nums">{displayValue}</span>;
};

/* ═══════════════════════════════════════════════════════════
   RANK BADGE — warna berbeda untuk 1, 2, 3
   ═══════════════════════════════════════════════════════════ */

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-yellow-300 to-yellow-600 text-xl font-black text-yellow-950 shadow-md">
        <CrownIcon />
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-gray-200 to-gray-400 text-lg font-black text-gray-800 shadow-md">
        {rank}
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-amber-600 to-amber-800 text-lg font-black text-white shadow-md">
        {rank}
      </span>
    );
  }

  return (
    <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-muted)] text-lg font-black text-[var(--color-muted-foreground)]">
      {rank}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   STREAK BADGE
   ═══════════════════════════════════════════════════════════ */

const StreakBadge = ({ streak }: { streak: number }) => (
  <span className="flex items-center gap-1 rounded-full bg-gradient-to-br from-amber-500 to-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
    <span style={{ width: 12, height: 12, display: "inline-flex" }}>
      <FlameIcon />
    </span>
    {streak}
  </span>
);

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Leaderboard = ({ data: { oldLeaderboard, leaderboard } }: Props) => {
  const [displayed, setDisplayed] = useState(oldLeaderboard);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useTranslation();

  // Tunggu 1,2 detik, lalu update ke leaderboard baru dengan animasi
  useEffect(() => {
    setDisplayed(oldLeaderboard);
    setIsAnimating(false);

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setDisplayed(leaderboard);
    }, 1200);

    return () => clearTimeout(timer);
  }, [oldLeaderboard, leaderboard]);

  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-6">
      {/* ── Judul ────────────────────────────────────────── */}
      <h2
        className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-4xl font-black text-transparent drop-shadow-lg md:text-5xl lg:text-6xl"
        style={{
          animation: "lb-title-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {t("game:leaderboard")}
      </h2>

      {/* ── Daftar pemain ───────────────────────────────── */}
      <div className="flex w-full flex-col gap-2.5">
        <AnimatePresence mode="popLayout">
          {displayed.map((player, index) => {
            const rank = index + 1;
            const oldPoints =
              oldLeaderboard.find((p) => p.id === player.id)?.points ?? 0;
            const newPoints =
              leaderboard.find((p) => p.id === player.id)?.points ?? 0;

            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{
                  layout: {
                    type: "spring",
                    stiffness: 320,
                    damping: 28,
                  },
                  opacity: { duration: 0.25 },
                  x: { duration: 0.25 },
                }}
                className={clsx(
                  "flex items-center gap-3 rounded-[var(--radius-lg)] border p-3 md:gap-4 md:p-4",
                  rank === 1 &&
                    "border-[var(--color-accent-gold)]/60 bg-gradient-to-r from-[var(--color-accent-gold)]/15 to-transparent",
                  rank === 2 &&
                    "border-gray-400/40 bg-gradient-to-r from-gray-400/10 to-transparent",
                  rank === 3 &&
                    "border-amber-700/40 bg-gradient-to-r from-amber-700/10 to-transparent",
                  rank > 3 &&
                    "border-[var(--color-accent)] bg-[var(--color-surface)]/80",
                )}
              >
                <RankBadge rank={rank} />

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <p className="truncate text-lg font-bold text-white md:text-xl">
                    {player.username}
                  </p>
                  {player.streak >= 3 && <StreakBadge streak={player.streak} />}
                </div>

                <span className="text-2xl font-black text-[var(--color-accent-gold)] md:text-3xl">
                  {isAnimating ? (
                    <AnimatedPoints from={oldPoints} to={newPoints} />
                  ) : (
                    <span className="tabular-nums">{player.points}</span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes lb-title-in {
          0%   { opacity: 0; transform: translateY(16px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
      `}</style>
    </section>
  );
};

export default Leaderboard;