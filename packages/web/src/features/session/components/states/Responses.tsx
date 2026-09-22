import type { ManagerStatusDataMap } from "@razzia/common/types/game/status";
import {
  ANSWERS_COLORS,
  ANSWERS_LABELS,
  SFX,
} from "@razzia/web/features/session/utils/constants";
import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";

interface Props {
  data: ManagerStatusDataMap["SHOW_RESPONSES"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const ResponsesAnimations = () => (
  <style>{`
    @keyframes rsp-title-in {
      0%   { opacity: 0; transform: translateY(16px); filter: blur(6px); }
      100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
    }
    @keyframes rsp-bar-grow {
      0%   { transform: scaleY(0); }
      100% { transform: scaleY(1); }
    }
    @keyframes rsp-count-badge-in {
      0%   { opacity: 0; transform: scale(0.4); }
      60%  { transform: scale(1.15); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes rsp-check-in {
      0%   { opacity: 0; transform: scale(0); }
      60%  { transform: scale(1.3); }
      100% { opacity: 1; transform: scale(1); }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   IKON
   ═══════════════════════════════════════════════════════════ */

const CheckCircleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 22, height: 22 }}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path d="M8 12l3 3 5-6" />
  </svg>
);

const CrossCircleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 22, height: 22 }}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Responses = ({
  data: { question, answers, responses, solutions },
}: Props) => {
  const [sfxResults] = useSound(SFX.RESULTS_SOUND, { volume: 0.2 });
  const { t } = useTranslation();

  // Mainkan sound effect sekali saat mount
  useEffect(() => {
    sfxResults();
  }, [sfxResults]);

  // Hitung total jawaban (untuk persentase)
  const totalResponses = Object.values(responses).reduce(
    (sum, n) => sum + n,
    0,
  );
  const maxResponse = Math.max(
    1,
    ...answers.map((_, i) => responses[i] ?? 0),
  );

  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-6 px-4 py-6 md:gap-8">
      <ResponsesAnimations />

      {/* ── Judul ────────────────────────────────────────── */}
      <h2
        className="max-w-4xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-2xl leading-tight font-black text-transparent drop-shadow-lg md:text-4xl lg:text-5xl"
        style={{
          animation: "rsp-title-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {question}
      </h2>

      {/* ── Bar chart ────────────────────────────────────── */}
      <div className="flex w-full flex-1 items-end justify-center gap-4 md:gap-8">
        {answers.map((answer, key) => {
          const count = responses[key] ?? 0;
          const isSolution = solutions.includes(key);
          const heightPercent =
            maxResponse > 0 ? (count / maxResponse) * 100 : 0;
          const percentage =
            totalResponses > 0
              ? Math.round((count / totalResponses) * 100)
              : 0;

          return (
            <div
              key={key}
              className="flex h-full min-w-0 flex-1 max-w-[200px] flex-col items-center gap-3"
            >
              {/* Count badge di atas bar */}
              <div
                className="flex items-baseline gap-1 rounded-full border border-[var(--color-accent)] bg-[var(--color-surface)]/80 px-3 py-1.5 backdrop-blur-sm"
                style={{
                  animation: `rsp-count-badge-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + key * 0.08}s backwards`,
                }}
              >
                <span className="text-xl font-black tabular-nums text-white">
                  {count}
                </span>
                <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
                  ({percentage}%)
                </span>
              </div>

              {/* Bar */}
              <div className="relative flex w-full flex-1 items-end justify-center">
                <div
                  className={clsx(
                    "relative w-full origin-bottom overflow-hidden rounded-t-[var(--radius-md)]",
                    ANSWERS_COLORS[key],
                  )}
                  style={{
                    height: `${Math.max(heightPercent, count > 0 ? 6 : 2)}%`,
                    animation: `rsp-bar-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + key * 0.1}s backwards`,
                    opacity: isSolution ? 1 : 0.75,
                  }}
                >
                  {/* Ikon status di tengah bar */}
                  <div className="absolute inset-x-0 top-4 flex justify-center">
                    <span
                      className={clsx(
                        "flex size-10 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm",
                        isSolution ? "text-white" : "text-white/90",
                      )}
                      style={{
                        animation: `rsp-check-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${1 + key * 0.08}s backwards`,
                      }}
                    >
                      {isSolution ? <CheckCircleIcon /> : <CrossCircleIcon />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Label A/B/C/D + jawaban */}
              <div className="flex w-full flex-col items-center gap-1 text-center">
                <span
                  className={clsx(
                    "flex size-9 items-center justify-center rounded-[var(--radius-md)] text-sm font-black text-white",
                    ANSWERS_COLORS[key],
                  )}
                >
                  {ANSWERS_LABELS[key]}
                </span>
                <p className="line-clamp-2 w-full text-xs font-semibold text-white/80 md:text-sm">
                  {answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Legend: total respons ───────────────────────── */}
      <p className="text-sm font-semibold tracking-wider text-[var(--color-muted-foreground)] uppercase">
        {t("game:hud.answers")}: {totalResponses}
      </p>
    </section>
  );
};

export default Responses;