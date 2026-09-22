import type { CommonStatusDataMap } from "@razzia/common/types/game/status";
import {
  ANSWERS_COLORS,
  ANSWERS_LABELS,
} from "@razzia/web/features/session/utils/constants";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface Props {
  data: CommonStatusDataMap["SHOW_PREPARED"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const PreparedAnimations = () => (
  <style>{`
    /* ── Judul ─────────────────────────────────────── */
    @keyframes prp-subtitle-in {
      0%   { opacity: 0; transform: translateY(-14px); letter-spacing: 0.8em; }
      100% { opacity: 1; transform: translateY(0);     letter-spacing: 0.3em; }
    }
    @keyframes prp-line-expand {
      0%   { transform: scaleX(0); opacity: 0; }
      100% { transform: scaleX(1); opacity: 1; }
    }
    @keyframes prp-title-in {
      0%   { opacity: 0; transform: translateY(30px) scale(0.85); letter-spacing: 0.15em; }
      60%  { opacity: 1; }
      100% { opacity: 1; transform: translateY(0) scale(1); letter-spacing: -0.02em; }
    }

    /* ── Kotak jawaban — masuk dari arah berbeda ──── */
    @keyframes prp-box-in-tl {
      0%   { opacity: 0; transform: translate(-80px, -60px) rotate(-25deg) scale(0.4); }
      70%  { opacity: 1; transform: translate(6px, 4px) rotate(3deg) scale(1.06); }
      100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
    }
    @keyframes prp-box-in-tr {
      0%   { opacity: 0; transform: translate(80px, -60px) rotate(25deg) scale(0.4); }
      70%  { opacity: 1; transform: translate(-6px, 4px) rotate(-3deg) scale(1.06); }
      100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
    }
    @keyframes prp-box-in-bl {
      0%   { opacity: 0; transform: translate(-80px, 60px) rotate(25deg) scale(0.4); }
      70%  { opacity: 1; transform: translate(6px, -4px) rotate(-3deg) scale(1.06); }
      100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
    }
    @keyframes prp-box-in-br {
      0%   { opacity: 0; transform: translate(80px, 60px) rotate(-25deg) scale(0.4); }
      70%  { opacity: 1; transform: translate(-6px, -4px) rotate(3deg) scale(1.06); }
      100% { opacity: 1; transform: translate(0, 0) rotate(0) scale(1); }
    }

    /* ── Kotak mengapung (setelah masuk) ─────────── */
    @keyframes prp-float-a {
      0%, 100% { transform: translateY(0) rotate(0); }
      50%      { transform: translateY(-6px) rotate(1deg); }
    }
    @keyframes prp-float-b {
      0%, 100% { transform: translateY(-5px) rotate(-1deg); }
      50%      { transform: translateY(0) rotate(0); }
    }

    /* ── Cincin pulse ─────────────────────────────── */
    @keyframes prp-ring {
      0%   { transform: scale(0.4); opacity: 0.55; }
      100% { transform: scale(1.9); opacity: 0; }
    }

    /* ── Loading dots ─────────────────────────────── */
    @keyframes prp-dot {
      0%, 100% { transform: translateY(0) scale(1);   opacity: 0.5; }
      50%      { transform: translateY(-10px) scale(1.25); opacity: 1; }
    }

    /* ── Glow berdenyut ───────────────────────────── */
    @keyframes prp-box-glow {
      0%, 100% { box-shadow: inset 0 -4px 12px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.3), 0 0 0 0 currentColor; }
      50%      { box-shadow: inset 0 -4px 12px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.4), 0 0 28px 2px currentColor; }
    }
  `}</style>
);

/* Arah masuk tiap kotak (staggered diagonal) */
const ENTRY_DIRECTIONS = [
  "prp-box-in-tl",
  "prp-box-in-tr",
  "prp-box-in-bl",
  "prp-box-in-br",
] as const;

/* Warna glow tiap kotak (diambil dari border/background) */
const BOX_GLOW_COLORS = [
  "rgba(225, 29, 72, 0.55)",   // crimson
  "rgba(217, 119, 6, 0.55)",   // amber
  "rgba(124, 58, 237, 0.55)",  // violet
  "rgba(5, 150, 105, 0.55)",   // emerald
] as const;

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Prepared = ({ data: { totalAnswers, questionNumber } }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-4 py-8">
      <PreparedAnimations />

      {/* Glow crimson statis di belakang judul */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/20 blur-[110px]" />

      {/* ── Header ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        <p
          className="mb-3 text-sm font-bold text-[var(--color-accent-gold)] uppercase md:text-base"
          style={{
            animation: "prp-subtitle-in 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
            letterSpacing: "0.3em",
          }}
        >
          Get Ready
        </p>

        {/* Garis gold melebar dari tengah */}
        <div
          className="mb-4 h-[2px] w-24 origin-center rounded-full bg-gradient-to-r from-transparent via-[var(--color-accent-gold)] to-transparent"
          style={{
            animation:
              "prp-line-expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s backwards",
          }}
        />

        <h1
          className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-center text-5xl font-black text-transparent drop-shadow-lg md:text-6xl lg:text-7xl"
          style={{
            animation:
              "prp-title-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards",
          }}
        >
          {t("game:questionPrefix")}
          <span className="ml-3 text-[var(--color-primary)]">
            {questionNumber}
          </span>
        </h1>
      </div>

      {/* ── Cincin pulse + Grid jawaban ─────────────────── */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Cincin pulse — 3 lapis dengan delay berbeda */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border-2 border-[var(--color-primary)]/40"
              style={{
                width: 320,
                height: 320,
                animation: `prp-ring 2.4s ease-out ${1.2 + i * 0.5}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Grid kotak */}
        <div
          className={clsx(
            "grid gap-3",
            totalAnswers === 2 && "grid-cols-2 max-w-[280px]",
            (totalAnswers === 3 || totalAnswers === 4) &&
              "grid-cols-2 max-w-[340px]",
          )}
        >
          {Array.from({ length: totalAnswers }).map((_, key) => {
            const entry = ENTRY_DIRECTIONS[key] ?? ENTRY_DIRECTIONS[0];
            const floatAnim = key % 2 === 0 ? "prp-float-a" : "prp-float-b";
            const glowColor = BOX_GLOW_COLORS[key] ?? BOX_GLOW_COLORS[0];

            return (
              <div
                key={key}
                className={clsx(
                  "flex aspect-square items-center justify-center rounded-[var(--radius-xl)]",
                  ANSWERS_COLORS[key],
                )}
                style={{
                  color: glowColor,
                  animation: `
                    ${entry} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.35 + key * 0.13}s backwards,
                    ${floatAnim} 2.6s ease-in-out ${1.1 + key * 0.2}s infinite,
                    prp-box-glow 2.2s ease-in-out ${1.1 + key * 0.2}s infinite
                  `,
                }}
              >
                <span className="text-3xl font-black text-white drop-shadow-md md:text-4xl">
                  {ANSWERS_LABELS[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Loading dots ─────────────────────────────────── */}
      <div className="relative z-10 mt-2 flex items-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 rounded-full bg-[var(--color-accent-gold)] shadow-[0_0_12px_rgba(212,168,131,0.6)]"
            style={{
              animation: `prp-dot 1.3s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Prepared;