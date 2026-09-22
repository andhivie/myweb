import { MEDIA_TYPES } from "@andhivie/common/constants";
import type { QuestionMedia as QuestionMediaType } from "@andhivie/common/types/game";

interface Props {
  media?: QuestionMediaType;
  alt?: string;
}

const QuestionMedia = ({ media, alt = "" }: Props) => {
  if (media?.type === MEDIA_TYPES.IMAGE) {
    return (
      <div className="relative w-full max-w-4xl">
        <div className="pointer-events-none absolute -inset-2 rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10 blur-2xl" />
        <img
          alt={alt}
          src={media.url}
          className="relative mx-auto max-h-48 w-auto rounded-[var(--radius-lg)] border border-[var(--color-accent)] shadow-[0_12px_40px_rgba(0,0,0,0.5)] sm:max-h-64 md:max-h-80"
        />
      </div>
    );
  }

  if (media?.type === MEDIA_TYPES.VIDEO) {
    return (
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-none absolute -inset-2 rounded-[var(--radius-xl)] bg-[var(--color-primary)]/10 blur-2xl" />
        <video
          className="relative aspect-video w-full rounded-[var(--radius-lg)] border border-[var(--color-accent)] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          src={media.url}
          autoPlay
          controls
        />
      </div>
    );
  }

  if (media?.type === MEDIA_TYPES.AUDIO) {
    return (
      <div className="relative flex w-full max-w-xl items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-surface)]/80 p-4 backdrop-blur-sm">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-gold)]/15 text-[var(--color-accent-gold)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 24, height: 24 }}
            aria-hidden="true"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <audio className="w-full" src={media.url} autoPlay controls />
      </div>
    );
  }

  return null;
};

export default QuestionMedia;