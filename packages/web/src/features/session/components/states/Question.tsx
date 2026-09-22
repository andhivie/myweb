import { MEDIA_TYPES } from "@andhivie/common/constants";
import type { CommonStatusDataMap } from "@andhivie/common/types/game/status";
import { SFX } from "@andhivie/web/features/session/utils/constants";
import { useEffect, useState } from "react";
import useSound from "use-sound";

interface Props {
  data: CommonStatusDataMap["SHOW_QUESTION"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const QuestionAnimations = () => (
  <style>{`
    @keyframes qst-title-in {
      0%   { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(8px); }
      60%  { opacity: 1; filter: blur(0); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    @keyframes qst-media-in {
      0%   { opacity: 0; transform: translateY(20px) scale(0.94); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes qst-bar-glow {
      0%, 100% { box-shadow: 0 0 12px rgba(225, 29, 72, 0.5); }
      50%      { box-shadow: 0 0 20px rgba(225, 29, 72, 0.85); }
    }
    @keyframes qst-pulse-badge {
      0%, 100% { transform: scale(1);   opacity: 1; }
      50%      { transform: scale(1.08); opacity: 0.9; }
    }
    @keyframes qst-warmup-dot {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.15); }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Question = ({ data: { question, media, cooldown } }: Props) => {
  const [sfxShow] = useSound(SFX.SHOW_SOUND, { volume: 0.5 });

  const [remaining, setRemaining] = useState(cooldown);

  // Mainkan audio cue saat soal muncul
  useEffect(() => {
    sfxShow();
  }, [sfxShow]);

  // Countdown lokal — setiap 100ms update sisa waktu
  useEffect(() => {
    setRemaining(cooldown);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const next = Math.max(0, cooldown - elapsed);

      setRemaining(next);

      if (next <= 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [cooldown]);

  const progress = cooldown > 0 ? ((cooldown - remaining) / cooldown) * 100 : 100;
  const wholeSeconds = Math.ceil(remaining);
  const isAlmostReady = wholeSeconds <= 1;

  return (
    <section className="relative flex h-full w-full flex-1 flex-col items-center justify-between px-4 py-6 md:py-10">
      <QuestionAnimations />

      {/* ══════════════════════════════════════════════════
          TOP SPACER — untuk keseimbangan vertikal
          ══════════════════════════════════════════════════ */}
      <div className="hidden md:block" style={{ height: 40 }} />

      {/* ══════════════════════════════════════════════════
          CENTER — Question + Media
          ══════════════════════════════════════════════════ */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 md:gap-8">
        {/* Question text */}
        <h2
          className="max-w-4xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-2xl leading-tight font-black text-transparent drop-shadow-lg md:text-4xl lg:text-5xl"
          style={{
            animation: "qst-title-in 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {question}
        </h2>

        {/* Image (hanya gambar yang ditampilkan di tahap ini) */}
        {media?.type === MEDIA_TYPES.IMAGE && (
          <div
            className="relative w-full max-w-3xl"
            style={{
              animation:
                "qst-media-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s backwards",
            }}
          >
            <div className="pointer-events-none absolute -inset-2 rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10 blur-2xl" />
            <img
              alt={question}
              src={media.url}
              className="relative mx-auto max-h-48 w-auto rounded-[var(--radius-lg)] border border-[var(--color-accent)] shadow-[0_12px_40px_rgba(0,0,0,0.5)] sm:max-h-72 md:max-h-96"
            />
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          BOTTOM — Countdown
          ══════════════════════════════════════════════════ */}
      <div
        className="mx-auto mt-auto flex w-full max-w-2xl flex-col items-center gap-3"
        style={{
          animation: "qst-title-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards",
        }}
      >
        {/* Countdown label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-[var(--color-accent-gold)]"
                style={{
                  animation: `qst-warmup-dot 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>

          <span className="text-xs font-bold tracking-widest text-[var(--color-muted-foreground)] uppercase">
            Answers unlock in
          </span>

          <span
            className="text-3xl leading-none font-black text-[var(--color-accent-gold)] tabular-nums drop-shadow-lg md:text-4xl"
            style={{
              animation: isAlmostReady
                ? "qst-pulse-badge 0.5s ease-in-out infinite"
                : undefined,
            }}
          >
            {wholeSeconds}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary-hover)] to-[var(--color-primary)]"
            style={{
              width: `${progress}%`,
              animation: "qst-bar-glow 1.2s ease-in-out infinite",
              transition: "width 100ms linear",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Question;