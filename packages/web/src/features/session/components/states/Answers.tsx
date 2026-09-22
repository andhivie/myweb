import { EVENTS, MEDIA_TYPES, NO_TIME_LIMIT } from "@andhivie/common/constants";
import type { QuestionMediaType } from "@andhivie/common/types/game";
import type { CommonStatusDataMap } from "@andhivie/common/types/game/status";
import QuestionMedia from "@andhivie/web/components/quiz/QuestionMedia";
import Timer from "@andhivie/web/components/quiz/Timer";
import { QUESTION_REGISTRY } from "@andhivie/web/features/questions";
import {
    useEvent,
    useSocket,
} from "@andhivie/web/features/session/contexts/socket-context";
import { usePlayerStore } from "@andhivie/web/features/session/stores/player";
import { SFX } from "@andhivie/web/features/session/utils/constants";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";

interface Props {
  data: CommonStatusDataMap["SELECT_ANSWER"];
}

/* ═══════════════════════════════════════════════════════════
   ANIMASI INLINE
   ═══════════════════════════════════════════════════════════ */

const AnswersAnimations = () => (
  <style>{`
    @keyframes answers-in {
      0%   { opacity: 0; transform: translateY(16px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes answers-title-in {
      0%   { opacity: 0; transform: translateY(20px); filter: blur(6px); }
      100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
    }
    @keyframes answers-submitted-in {
      0%   { opacity: 0; transform: scale(0.9); }
      60%  { transform: scale(1.04); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes answers-submitted-pulse {
      0%, 100% { transform: scale(1);    opacity: 0.5; }
      50%      { transform: scale(1.12); opacity: 0.85; }
    }
    @keyframes answers-bounce-dot {
      0%, 60%, 100% { transform: translateY(0);   opacity: 0.4; }
      30%           { transform: translateY(-8px); opacity: 1; }
    }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   KOMPONEN
   ═══════════════════════════════════════════════════════════ */

const Answers = ({
  data: { question, answers, media, time, totalPlayer, questionType, options },
}: Props) => {
  const { socket } = useSocket();
  const { player, gameId } = usePlayerStore();
  const { t } = useTranslation();

  const [cooldown, setCooldown] = useState(time);
  const [totalAnswer, setTotalAnswer] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [sfxPop] = useSound(SFX.ANSWERS.SOUND, { volume: 0.1 });
  const [playMusic, { stop: stopMusic }] = useSound(SFX.ANSWERS.MUSIC, {
    volume: 0.2,
    interrupt: true,
    loop: true,
  });

  const handleSubmit = (answerKeys: number[]) => {
    if (!player || !gameId || hasSubmitted) return;

    socket.emit(EVENTS.PLAYER.SELECTED_ANSWER, {
      gameId,
      data: { answerKeys },
    });

    setHasSubmitted(true);
    sfxPop();
  };

  // Musik latar
  useEffect(() => {
    const disabledMusicMedia: QuestionMediaType[] = [
      MEDIA_TYPES.AUDIO,
      MEDIA_TYPES.VIDEO,
    ];

    if (disabledMusicMedia.includes(media?.type)) {
      return;
    }

    playMusic();

    return () => {
      stopMusic();
    };
    // oxlint-disable-next-line
  }, [playMusic]);

  // Countdown timer
  useEffect(() => {
    if (time === NO_TIME_LIMIT) return;

    setCooldown(time);

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  useEvent(EVENTS.GAME.PLAYER_ANSWER, (count) => {
    setTotalAnswer(count);
    if (!hasSubmitted) sfxPop();
  });

  const { AnswerComponent } = QUESTION_REGISTRY[questionType];

  return (
    <div className="relative flex h-full w-full flex-1 flex-col">
      <AnswersAnimations />

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════ */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5 px-3 py-4 md:gap-6">
        <h2
          className="max-w-4xl bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-xl leading-tight font-black text-transparent drop-shadow-lg md:text-3xl lg:text-4xl"
          style={{
            animation:
              "answers-title-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards",
          }}
        >
          {question}
        </h2>

        <QuestionMedia media={media} alt={question} />
      </div>

      {/* ══════════════════════════════════════════════════
          HUD — Timer + Counter
          ══════════════════════════════════════════════════ */}
      <div className="mx-auto mb-3 flex w-full max-w-7xl items-center justify-between gap-3 px-3">
        {time !== NO_TIME_LIMIT ? (
          <Timer current={cooldown} total={time} size={72} />
        ) : (
          <div
            className={clsx(
              "flex items-center gap-2 rounded-full",
              "border border-[var(--color-accent-gold)]/40 bg-black/40 px-4 py-2 backdrop-blur-sm",
            )}
          >
            <span className="text-xs font-bold tracking-widest text-[var(--color-accent-gold)] uppercase">
              No Limit
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 rounded-full border border-[var(--color-accent)] bg-black/40 px-4 py-2 backdrop-blur-sm">
          <span className="text-xs font-bold tracking-widest text-[var(--color-muted-foreground)] uppercase">
            {t("game:hud.answers")}
          </span>
          <span className="text-xl font-black tabular-nums text-white">
            {totalAnswer}
            <span className="text-[var(--color-muted-foreground)]">
              /{totalPlayer}
            </span>
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          ANSWER AREA
          ══════════════════════════════════════════════════ */}
      <div className="relative w-full pb-4">
        {hasSubmitted ? (
          <SubmittedOverlay />
        ) : (
          <AnswerComponent
            answers={answers}
            options={options}
            onSubmit={handleSubmit}
            readOnly={!player}
          />
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SUBMITTED OVERLAY — setelah pemain submit
   ═══════════════════════════════════════════════════════════ */

const SubmittedOverlay = () => (
  <div
    className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 px-3 py-10"
    style={{
      animation: "answers-submitted-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    }}
  >
    {/* Lingkaran centang dengan glow */}
    <div className="relative flex size-24 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-emerald-500/30 blur-2xl"
        style={{ animation: "answers-submitted-pulse 2s ease-in-out infinite" }}
      />
      <span className="relative flex size-20 items-center justify-center rounded-full border-4 border-emerald-500/60 bg-emerald-500/15">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-10 text-emerald-400"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    </div>

    <p className="text-center text-xl font-bold text-white md:text-2xl">
      Answer submitted!
    </p>
    <p className="text-center text-sm text-[var(--color-muted-foreground)]">
      Waiting for other players…
    </p>

    {/* Titik berdenyut */}
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 rounded-full bg-[var(--color-accent-gold)]"
          style={{
            animation: `answers-bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

export default Answers;