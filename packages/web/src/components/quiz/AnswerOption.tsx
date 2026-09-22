import clsx from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type AnswerIndex = 0 | 1 | 2 | 3;

type Props = PropsWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
    /** Urutan jawaban (0-3) — menentukan warna */
    index: AnswerIndex;
    /** Huruf label (A/B/C/D) */
    label: string;
    /** State reaktif */
    state?: "default" | "selected" | "correct" | "wrong" | "dimmed";
    /** Padding kecil untuk preview/editor */
    compact?: boolean;
  }
>;

const ANSWER_BG = [
  "var(--color-answer-1)",
  "var(--color-answer-2)",
  "var(--color-answer-3)",
  "var(--color-answer-4)",
] as const;

/* ═══════════════════════════════════════════════════════════
   IKON SVG INLINE
   ═══════════════════════════════════════════════════════════ */

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CrossIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3.5}
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

const AnswerOption = ({
  children,
  className,
  index,
  label,
  state = "default",
  compact = false,
  disabled,
  style: externalStyle,
  ...otherProps
}: Props) => {
  const bg = ANSWER_BG[index];
  const isWrong = state === "wrong";
  const isCorrect = state === "correct";
  const isDimmed = state === "dimmed";

  return (
    <button
      className={clsx(
        "relative flex w-full items-center gap-3 rounded-[var(--radius-lg)] text-left",
        "border-2",
        "transition-all duration-200 ease-[var(--ease-out-andhivie)]",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed",
        compact ? "px-3 py-2" : "px-4 py-5",
        isCorrect &&
          "border-white shadow-[0_0_0_4px_rgba(16,185,129,0.35),0_8px_24px_rgba(16,185,129,0.25)]",
        state === "selected" &&
          "border-white shadow-[0_0_0_4px_rgba(255,255,255,0.18)]",
        (state === "default" || isDimmed || isWrong) && "border-transparent",
        !disabled && state === "default" && "hover:brightness-110",
        !disabled && state === "selected" && "hover:brightness-110",
        className,
      )}
      style={{
        // External style (animation) dulu
        ...externalStyle,
        // Internal style WAJIB ada setelah, supaya warna tidak tertimpa
        backgroundColor: bg,
        filter: isWrong ? "saturate(0.15) brightness(0.65)" : undefined,
        opacity: isDimmed ? 0.45 : 1,
      }}
      disabled={disabled}
      {...otherProps}
    >
      {/* Label A/B/C/D */}
      <span
        className="flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-black/25 font-extrabold text-white backdrop-blur-sm"
        style={{
          width: compact ? 24 : 32,
          height: compact ? 24 : 32,
          fontSize: compact ? 12 : 15,
        }}
      >
        {label}
      </span>

      {/* Teks jawaban */}
      <span
        className="min-w-0 flex-1 font-semibold text-white drop-shadow-sm"
        style={{ fontSize: compact ? 13 : 17 }}
      >
        {children}
      </span>

      {/* Ikon centang (correct) */}
      {isCorrect && (
        <span
          className="shrink-0 text-white drop-shadow-md"
          style={{ width: 24, height: 24 }}
        >
          <CheckIcon />
        </span>
      )}

      {/* Ikon silang (wrong) */}
      {isWrong && (
        <span
          className="shrink-0 text-white/90"
          style={{ width: 22, height: 22 }}
        >
          <CrossIcon />
        </span>
      )}
    </button>
  );
};

export default AnswerOption;